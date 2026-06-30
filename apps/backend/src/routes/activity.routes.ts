import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { ResponseUtil } from "../utils/response.js";

export async function activityRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["activity"],
        summary: "获取最近的站点动态（公开接口）",
        querystring: {
          type: "object",
          properties: {
            limit: { type: "number", default: 10 },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: { limit?: number } }>, reply: FastifyReply) => {
      const limit = request.query.limit ? Number(request.query.limit) : 10;
      try {
        const activities = await prisma.activity.findMany({
          orderBy: { createdAt: "desc" },
          take: limit,
        });
        return ResponseUtil.success(reply, activities);
      } catch (error) {
        console.error("获取活动记录失败:", error);
        return ResponseUtil.error(reply, "获取活动记录失败");
      }
    }
  );

  fastify.get(
    "/admin/list",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
          if (request.user.role !== "admin") {
            return ResponseUtil.forbidden(reply, "需要管理员权限");
          }
        },
      ],
      schema: {
        tags: ["activity"],
        summary: "获取活动记录列表（管理员）",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            limit: { type: "number", default: 20 },
            type: { type: "string" },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { page?: number; limit?: number; type?: string };
      }>,
      reply: FastifyReply
    ) => {
      const page = request.query.page ? Number(request.query.page) : 1;
      const limit = request.query.limit ? Number(request.query.limit) : 20;
      const type = request.query.type;
      const skip = (page - 1) * limit;

      try {
        const where: any = {};
        if (type) {
          where.type = type;
        }

        const [activities, total] = await Promise.all([
          prisma.activity.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
          }),
          prisma.activity.count({ where }),
        ]);

        const types = await prisma.activity.findMany({
          select: { type: true },
          distinct: ["type"],
        });

        return ResponseUtil.success(reply, {
          list: activities,
          total,
          page,
          limit,
          types: types.map((t) => t.type),
        });
      } catch (error) {
        console.error("获取活动记录失败:", error);
        return ResponseUtil.error(reply, "获取活动记录失败");
      }
    }
  );

  fastify.post(
    "/",
    async (
      request: FastifyRequest<{
        Body: { type: string; targetId?: string; targetName?: string; description: string };
      }>,
      reply: FastifyReply
    ) => {
      const body = request.body;
      try {
        const activity = await prisma.activity.create({
          data: {
            type: body.type,
            targetId: body.targetId || null,
            targetName: body.targetName || null,
            description: body.description,
          },
        });
        return ResponseUtil.success(reply, activity, "活动记录创建成功");
      } catch (error) {
        console.error("创建活动记录失败:", error);
        return ResponseUtil.error(reply, "创建活动记录失败");
      }
    }
  );

  fastify.delete(
    "/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        await prisma.activity.delete({ where: { id } });
        return ResponseUtil.success(reply, null, "活动记录删除成功");
      } catch (error) {
        return ResponseUtil.error(reply, "删除活动记录失败");
      }
    }
  );

  fastify.delete(
    "/",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
          if (request.user.role !== "admin") {
            return ResponseUtil.forbidden(reply, "需要管理员权限");
          }
        },
      ],
      schema: {
        tags: ["activity"],
        summary: "清空所有活动记录（管理员）",
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        await prisma.activity.deleteMany({});
        return ResponseUtil.success(reply, null, "活动记录清空成功");
      } catch (error) {
        return ResponseUtil.error(reply, "清空活动记录失败");
      }
    }
  );
}
