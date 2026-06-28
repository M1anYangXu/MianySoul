import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

export async function statsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;

      try {
        const [articleCount, imageCount, diaryCount] = await Promise.all([
          prisma.article.count({ where: { authorId: userId, deletedAt: null } }),
          prisma.image.count({ where: { userId, deletedAt: null } }),
          prisma.diary.count({ where: { userId, deletedAt: null } }),
        ]);

        return ResponseUtil.success(reply, {
          articleCount,
          imageCount,
          diaryCount,
        });
      } catch (error) {
        return ResponseUtil.error(reply, "获取统计数据失败");
      }
    }
  );

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
}
