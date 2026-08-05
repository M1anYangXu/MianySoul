import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";
import { requireUser } from "../middleware/index.js";
import { execSync } from "child_process";
import os from "os";
import path from "path";
import fs from "fs";
import { getUploadsDir } from "../utils/paths.js";

export async function statsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const userId = requireUser(request, reply);
    if (!userId) return;

    try {
      const [
        articleCount,
        imageCount,
        diaryCount,
        lyricCount,
        videoCount,
        narrativeCount,
        audioCount,
        imageTotalSize,
        videoTotalSize,
        audioTotalSize,
      ] = await Promise.all([
        prisma.article.count({ where: { authorId: userId, deletedAt: null } }),
        prisma.image.count({ where: { userId, deletedAt: null } }),
        prisma.diary.count({ where: { userId, deletedAt: null } }),
        prisma.musicLyric.count({ where: { deletedAt: null } }),
        prisma.video.count({ where: { deletedAt: null } }),
        prisma.narrative.count({ where: { deletedAt: null } }),
        prisma.audio.count({ where: { userId, deletedAt: null } }),
        prisma.image.aggregate({ where: { userId, deletedAt: null }, _sum: { size: true } }),
        prisma.video.aggregate({ where: { deletedAt: null }, _sum: { size: true } }),
        prisma.audio.aggregate({ where: { userId, deletedAt: null }, _sum: { size: true } }),
      ]);

      return ResponseUtil.success(reply, {
        articleCount,
        imageCount,
        diaryCount,
        lyricCount,
        videoCount,
        narrativeCount,
        audioCount,
        imageTotalSize: imageTotalSize._sum.size || 0,
        videoTotalSize: videoTotalSize._sum.size || 0,
        audioTotalSize: audioTotalSize._sum.size || 0,
      });
    } catch (error) {
      return ResponseUtil.error(reply, "获取统计数据失败");
    }
  });

  fastify.get(
    "/public",
    {
      schema: {
        tags: ["stats"],
        summary: "获取公开统计数据",
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const [articleCount, imageCount, lyricCount] = await Promise.all([
          prisma.article.count({ where: { status: "published", deletedAt: null } }),
          prisma.image.count({ where: { deletedAt: null } }),
          prisma.musicLyric.count({ where: { isActive: true, deletedAt: null } }),
        ]);

        return ResponseUtil.success(reply, {
          articleCount,
          imageCount,
          lyricCount,
        });
      } catch (error) {
        console.error("获取公开统计错误:", error);
        return ResponseUtil.error(reply, "获取统计数据失败");
      }
    }
  );

  // 磁盘使用情况（跨平台）
  fastify.get(
    "/disk",
    {
      preHandler: [requireUser],
      schema: {
        tags: ["stats"],
        summary: "获取服务器磁盘使用情况",
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        let total = 0;
        let used = 0;
        let free = 0;

        const platform = os.platform();

        if (platform === "linux" || platform === "darwin") {
          try {
            const output = execSync("df -B1 /", { encoding: "utf-8", timeout: 5000 });
            const lines = output.trim().split("\n");
            if (lines.length >= 2) {
              const parts = lines[1].split(/\s+/);
              total = parseInt(parts[1], 10) || 0;
              used = parseInt(parts[2], 10) || 0;
              free = parseInt(parts[3], 10) || 0;
            }
          } catch {
            // df failed, fallback below
          }
        } else if (platform === "win32") {
          try {
            const output = execSync("wmic logicaldisk where DeviceID='C:' get Size,FreeSpace", {
              encoding: "utf-8",
              timeout: 5000,
            });
            const lines = output.trim().split("\n");
            for (const line of lines) {
              const match = line.trim().match(/^(\d+)\s+(\d+)$/);
              if (match) {
                total = parseInt(match[1], 10);
                free = parseInt(match[2], 10);
                used = total - free;
                break;
              }
            }
          } catch {
            // wmic failed, fallback below
          }
        }

        if (total === 0) {
          const uploadDir = getUploadsDir();
          let fileSize = 0;

          const calcDirSize = (dirPath: string): number => {
            let sum = 0;
            try {
              const entries = fs.readdirSync(dirPath, { withFileTypes: true });
              for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);
                if (entry.isFile()) {
                  sum += fs.statSync(fullPath).size;
                } else if (entry.isDirectory()) {
                  sum += calcDirSize(fullPath);
                }
              }
            } catch {
              // dir not accessible
            }
            return sum;
          };

          if (fs.existsSync(uploadDir)) {
            fileSize = calcDirSize(uploadDir);
          }

          // 获取数据库文件大小
          const dbPath = path.join(process.cwd(), "prisma", "dev.db");
          if (fs.existsSync(dbPath)) {
            fileSize += fs.statSync(dbPath).size;
          }

          used = fileSize;
          // 本地开发环境按实际存储的 3 倍估算总量
          total = Math.floor(fileSize * 3);
          free = Math.max(total - used, 0);
        }

        return ResponseUtil.success(reply, {
          total,
          used,
          free,
        });
      } catch (error) {
        console.error("获取磁盘信息失败:", error);
        return ResponseUtil.error(reply, "获取磁盘信息失败");
      }
    }
  );
}
