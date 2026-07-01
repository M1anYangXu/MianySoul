import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

export async function footprintRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/footprints",
    {
      schema: {
        tags: ["footprint"],
        summary: "获取足迹列表",
        querystring: {
          type: "object",
          properties: {
            province: { type: "string" },
            city: { type: "string" },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { province?: string; city?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const where: any = { deletedAt: null };
        const province = request.query.province;
        const city = request.query.city;
        if (province) {
          where.province = province;
        }
        if (city) {
          where.city = city;
        }
        const footprints = await prisma.footprint.findMany({
          where,
          orderBy: { createdAt: "desc" },
        });
        return ResponseUtil.success(reply, footprints);
      } catch (error) {
        return ResponseUtil.error(reply, "获取足迹列表失败", 500);
      }
    }
  );

  fastify.get(
    "/footprints/public",
    {
      schema: {
        tags: ["footprint"],
        summary: "获取公开足迹列表",
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const footprints = await prisma.footprint.findMany({
          where: { deletedAt: null },
          orderBy: { createdAt: "desc" },
        });
        return ResponseUtil.success(reply, footprints);
      } catch (error) {
        return ResponseUtil.error(reply, "获取足迹列表失败", 500);
      }
    }
  );

  fastify.get(
    "/footprints/:id",
    {
      schema: {
        tags: ["footprint"],
        summary: "获取单个足迹",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const footprint = await prisma.footprint.findFirst({
          where: { id: request.params.id, deletedAt: null },
        });
        if (!footprint) {
          return ResponseUtil.notFound(reply, "足迹不存在");
        }
        return ResponseUtil.success(reply, footprint);
      } catch (error) {
        return ResponseUtil.error(reply, "获取足迹失败", 500);
      }
    }
  );

  fastify.post(
    "/footprints",
    {
      schema: {
        tags: ["footprint"],
        summary: "创建足迹",
        body: {
          type: "object",
          properties: {
            province: { type: "string" },
            city: { type: "string" },
            places: { type: "string" },
          },
          required: ["province", "city"],
        },
      },
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
    },
    async (
      request: FastifyRequest<{
        Body: { province: string; city: string; places?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { province, city, places } = request.body;
        const footprint = await prisma.footprint.create({
          data: {
            province,
            city,
            places: places || "",
            userId: request.user!.id,
          },
        });
        return ResponseUtil.success(reply, footprint, 201);
      } catch (error) {
        return ResponseUtil.error(reply, "创建足迹失败", 500);
      }
    }
  );

  fastify.put(
    "/footprints/:id",
    {
      schema: {
        tags: ["footprint"],
        summary: "更新足迹",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            province: { type: "string" },
            city: { type: "string" },
            places: { type: "string" },
          },
          required: ["province", "city"],
        },
      },
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
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: { province: string; city: string; places?: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const { province, city, places } = request.body;
        const footprint = await prisma.footprint.findFirst({
          where: { id: request.params.id, deletedAt: null },
        });
        if (!footprint) {
          return ResponseUtil.notFound(reply, "足迹不存在");
        }
        const updated = await prisma.footprint.update({
          where: { id: request.params.id },
          data: {
            province,
            city,
            places: places || "",
          },
        });
        return ResponseUtil.success(reply, updated);
      } catch (error) {
        return ResponseUtil.error(reply, "更新足迹失败", 500);
      }
    }
  );

  fastify.delete(
    "/footprints/:id",
    {
      schema: {
        tags: ["footprint"],
        summary: "删除足迹",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
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
    },
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      try {
        const footprint = await prisma.footprint.findFirst({
          where: { id: request.params.id, deletedAt: null },
        });
        if (!footprint) {
          return ResponseUtil.notFound(reply, "足迹不存在");
        }
        await prisma.footprint.update({
          where: { id: request.params.id },
          data: { deletedAt: new Date() },
        });
        return ResponseUtil.success(reply, { message: "删除成功" });
      } catch (error) {
        return ResponseUtil.error(reply, "删除足迹失败", 500);
      }
    }
  );
}
