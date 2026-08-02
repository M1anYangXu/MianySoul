import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";
import { authGuard, adminGuard } from "../middleware/index.js";
import {
  type SiteConfig,
  defaultModuleConfigs,
  defaultPageConfigs,
  getDefaultSiteConfig,
} from "@miany-soul/shared";
import AdmZip from "adm-zip";
import fs from "fs";
import path from "path";
import { getUploadsDir } from "../utils/paths.js";

const defaultConfig = getDefaultSiteConfig();

const CONFIG_KEY = "site_config";

/**
 * 系统配置路由
 */
export async function configRoutes(fastify: FastifyInstance): Promise<void> {
  // 注册 multipart 插件（用于完整备份 ZIP 上传）
  await fastify.register(import("@fastify/multipart"), {
    limits: {
      fileSize: 1024 * 1024 * 1024, // 1GB（备份文件可能较大）
    },
  });

  // 获取系统配置（公开接口）
  fastify.get(
    "/",
    {
      schema: {
        tags: ["config"],
        summary: "获取系统配置",
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const config = await prisma.config.findUnique({
        where: { key: CONFIG_KEY },
      });

      const siteConfig: SiteConfig = config
        ? { ...defaultConfig, ...JSON.parse(config.value) }
        : defaultConfig;

      siteConfig.modules = { ...defaultModuleConfigs, ...siteConfig.modules };
      siteConfig.pages = { ...defaultPageConfigs, ...siteConfig.pages };

      return ResponseUtil.success(reply, siteConfig);
    }
  );

  // 更新系统配置（需要管理员权限）
  fastify.put<{
    Body: Partial<SiteConfig>;
  }>(
    "/",
    {
      preHandler: [authGuard],
      schema: {
        tags: ["config"],
        summary: "更新系统配置",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            logo: { type: "string" },
            title: { type: "string" },
            subtitle: { type: "string" },
            description: { type: "string" },
            copyright: { type: "string" },
            icp: { type: "string" },
            startTime: { type: "string" },
            homeWallpaperLight: { type: "string" },
            homeWallpaperDark: { type: "string" },
            lightThemeColor: { type: "string" },
            darkThemeColor: { type: "string" },
            amapKey: { type: "string" },
            modules: {
              type: "object",
              properties: {
                article: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                memory: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                gallery: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                video: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                audio: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                music: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                settings: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                siteinfo: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                narrative: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                users: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
            pages: {
              type: "object",
              properties: {
                archive: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                categories: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                tags: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                lyrics: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                gallery: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                about: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                memory: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                narrative: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const existing = await prisma.config.findUnique({
        where: { key: CONFIG_KEY },
      });

      const current: SiteConfig = existing
        ? { ...defaultConfig, ...JSON.parse(existing.value) }
        : defaultConfig;

      const body = request.body as Partial<SiteConfig>;
      const updated: SiteConfig = { ...current, ...body };

      if (body.modules) {
        updated.modules = {
          ...current.modules,
          ...body.modules,
        };
      }

      if (body.pages) {
        updated.pages = {
          ...current.pages,
          ...body.pages,
        };
      }

      await prisma.config.upsert({
        where: { key: CONFIG_KEY },
        update: { value: JSON.stringify(updated) },
        create: {
          key: CONFIG_KEY,
          value: JSON.stringify(updated),
          description: "站点基础配置",
        },
      });

      return ResponseUtil.success(reply, updated, "配置保存成功");
    }
  );

  // ==================== 完整备份（ZIP：数据库 + uploads） ====================

  // 导出完整备份（ZIP）
  fastify.get(
    "/backup/export-full",
    {
      preHandler: [adminGuard],
      schema: {
        tags: ["config"],
        summary: "导出完整备份（数据库 + 上传文件，ZIP 格式）",
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const uploadsDir = getUploadsDir();
        const dbPath = path.join(process.cwd(), "prisma/dev.db");

        // 校验数据库文件存在
        if (!fs.existsSync(dbPath)) {
          return ResponseUtil.notFound(reply, "数据库文件不存在");
        }

        const zip = new AdmZip();

        // 1. 添加数据库文件
        zip.addLocalFile(dbPath, "database", "dev.db");

        // 2. 添加 uploads 目录（如果存在）
        if (fs.existsSync(uploadsDir)) {
          zip.addLocalFolder(uploadsDir, "uploads");
        }

        // 3. 添加备份元信息
        const meta = {
          version: "2.0",
          type: "full-backup",
          exportedAt: new Date().toISOString(),
          description: "完整备份：包含数据库文件和所有上传文件",
        };
        zip.addFile("backup-meta.json", JSON.stringify(meta, null, 2));

        const zipBuffer = zip.toBuffer();

        // 设置响应头，返回 ZIP 文件
        const filename = `full-backup-${Date.now()}.zip`;
        reply.header("Content-Type", "application/zip");
        reply.header("Content-Disposition", `attachment; filename="${filename}"`);
        reply.header("Content-Length", zipBuffer.length.toString());

        return reply.send(zipBuffer);
      } catch (err: any) {
        console.error("导出完整备份失败:", err);
        return ResponseUtil.serverError(reply, `导出完整备份失败: ${err?.message || String(err)}`);
      }
    }
  );

  // 导入完整备份（ZIP）
  fastify.post(
    "/backup/import-full",
    {
      preHandler: [adminGuard],
      schema: {
        tags: ["config"],
        summary: "导入完整备份（数据库 + 上传文件，ZIP 格式）",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        // 注册 multipart 插件（如果尚未注册）
        // 使用 multipart 接收 zip 文件
        const file = await request.file();
        if (!file) {
          return ResponseUtil.badRequest(reply, "未接收到 ZIP 文件");
        }

        // 检查文件类型
        if (!file.mimetype.includes("zip") && !file.filename.endsWith(".zip")) {
          return ResponseUtil.badRequest(reply, "请上传 ZIP 格式的文件");
        }

        // 读取文件内容到 Buffer
        const chunks: Buffer[] = [];
        for await (const chunk of file.file) {
          chunks.push(Buffer.from(chunk));
        }
        const zipBuffer = Buffer.concat(chunks);

        const uploadsDir = getUploadsDir();
        const dbPath = path.join(process.cwd(), "prisma/dev.db");
        const dbDir = path.dirname(dbPath);

        // 确保目录存在
        if (!fs.existsSync(dbDir)) {
          fs.mkdirSync(dbDir, { recursive: true });
        }
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const zip = new AdmZip(zipBuffer);
        const entries = zip.getEntries();

        // 校验是否包含数据库文件
        const hasDb = entries.some(
          (e) => e.entryName === "database/dev.db" || e.entryName === "dev.db"
        );
        if (!hasDb) {
          return ResponseUtil.badRequest(reply, "ZIP 中未找到数据库文件 dev.db");
        }

        // 1. 关闭 Prisma 连接（释放数据库文件锁）
        await prisma.$disconnect();

        // 2. 备份当前数据库（以防导入失败）
        if (fs.existsSync(dbPath)) {
          const backupDbPath = dbPath + ".before-import";
          fs.copyFileSync(dbPath, backupDbPath);
        }

        try {
          // 3. 解压数据库文件
          const dbEntry = entries.find(
            (e) => e.entryName === "database/dev.db" || e.entryName === "dev.db"
          );
          if (dbEntry) {
            fs.writeFileSync(dbPath, dbEntry.getData());
          }

          // 4. 清空并解压 uploads 目录
          // 先清空现有 uploads（保留目录本身）
          if (fs.existsSync(uploadsDir)) {
            const items = fs.readdirSync(uploadsDir);
            for (const item of items) {
              const itemPath = path.join(uploadsDir, item);
              if (item === ".gitkeep") continue;
              fs.rmSync(itemPath, { recursive: true, force: true });
            }
          }

          // 解压 uploads 相关条目
          for (const entry of entries) {
            if (entry.isDirectory) continue;
            if (entry.entryName.startsWith("uploads/")) {
              const relativePath = entry.entryName.slice("uploads/".length);
              if (!relativePath) continue;
              const targetPath = path.join(uploadsDir, relativePath);
              const targetDir = path.dirname(targetPath);
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              fs.writeFileSync(targetPath, entry.getData());
            }
          }

          // 5. 重新连接数据库
          await prisma.$connect();

          return ResponseUtil.success(reply, null, "完整备份导入成功！数据库和所有文件已恢复");
        } catch (innerErr: any) {
          // 尝试恢复数据库备份
          const backupDbPath = dbPath + ".before-import";
          if (fs.existsSync(backupDbPath)) {
            fs.copyFileSync(backupDbPath, dbPath);
            fs.unlinkSync(backupDbPath);
          }
          await prisma.$connect();
          throw innerErr;
        }
      } catch (err: any) {
        console.error("导入完整备份失败:", err);
        try {
          await prisma.$connect();
        } catch (reconnectErr) {
          console.error("重新连接数据库失败:", reconnectErr);
        }
        return ResponseUtil.serverError(reply, `导入完整备份失败: ${err?.message || String(err)}`);
      }
    }
  );
}
