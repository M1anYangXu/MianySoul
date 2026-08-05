import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";
import { requireUser } from "../middleware/index.js";

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
        const STORAGE_TOTAL = 20 * 1024 * 1024 * 1024; // 20GB 固定总量

        // 计算媒体文件实际占用空间
        const [imageSize, videoSize, audioSize] = await Promise.all([
          prisma.image
            .aggregate({ where: { deletedAt: null }, _sum: { size: true } })
            .catch(() => ({ _sum: { size: 0 } })),
          prisma.video
            .aggregate({ where: { deletedAt: null }, _sum: { size: true } })
            .catch(() => ({ _sum: { size: 0 } })),
          prisma.audio
            .aggregate({ where: { deletedAt: null }, _sum: { size: true } })
            .catch(() => ({ _sum: { size: 0 } })),
        ]);

        const used =
          (imageSize._sum.size || 0) + (videoSize._sum.size || 0) + (audioSize._sum.size || 0);
        const total = STORAGE_TOTAL;
        const free = Math.max(total - used, 0);

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
