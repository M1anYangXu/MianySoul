import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

interface SceneBody {
  sceneId: string;
  name: string;
  icon: string;
  color?: string;
  description?: string;
  audioUrl: string;
}

export async function sceneRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["scene"],
        summary: "获取所有场景（公开接口）",
        querystring: {
          type: "object",
          properties: {
            activeOnly: { type: "boolean", default: true },
            page: { type: "number", default: 1 },
            pageSize: { type: "number", default: 10 },
            keyword: { type: "string" },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { activeOnly?: boolean; page?: number; pageSize?: number; keyword?: string };
      }>,
      reply: FastifyReply
    ) => {
      const { activeOnly = true, page = 1, pageSize = 10, keyword } = request.query;
      const skip = (page - 1) * pageSize;

      const where: any = activeOnly ? { isActive: true } : {};

      if (keyword) {
        where.OR = [{ name: { contains: keyword } }, { description: { contains: keyword } }];
      }

      const [scenes, total] = await Promise.all([
        prisma.scene.findMany({
          where,
          orderBy: { updatedAt: "desc" },
          select: {
            sceneId: true,
            name: true,
            icon: true,
            color: true,
            description: true,
            audioUrl: true,
            isActive: true,
          },
          skip,
          take: pageSize,
        }),
        prisma.scene.count({ where }),
      ]);

      return ResponseUtil.paginated(reply, scenes, total, page, pageSize);
    }
  );

  fastify.get(
    "/:sceneId",
    {
      schema: {
        tags: ["scene"],
        summary: "获取单个场景（公开接口）",
        params: {
          type: "object",
          properties: {
            sceneId: { type: "string" },
          },
          required: ["sceneId"],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { sceneId: string } }>, reply: FastifyReply) => {
      const { sceneId } = request.params;

      const scene = await prisma.scene.findUnique({
        where: { sceneId },
        select: {
          sceneId: true,
          name: true,
          icon: true,
          color: true,
          description: true,
          audioUrl: true,
          isActive: true,
        },
      });

      if (!scene) {
        return ResponseUtil.notFound(reply, "场景不存在");
      }

      return ResponseUtil.success(reply, scene);
    }
  );

  fastify.post<{ Body: SceneBody }>(
    "/",
    {
      preHandler: [
        async (request: any, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["scene"],
        summary: "添加场景",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            sceneId: { type: "string" },
            name: { type: "string" },
            icon: { type: "string" },
            color: { type: "string" },
            description: { type: "string" },
            audioUrl: { type: "string" },
          },
          required: ["sceneId", "name", "icon", "audioUrl"],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as SceneBody;

      const existing = await prisma.scene.findUnique({
        where: { sceneId: body.sceneId },
      });

      if (existing) {
        return ResponseUtil.badRequest(reply, "场景ID已存在");
      }

      const scene = await prisma.scene.create({
        data: body,
        select: {
          id: true,
          sceneId: true,
          name: true,
          icon: true,
          color: true,
          description: true,
          audioUrl: true,
          isActive: true,
          createdAt: true,
        },
      });

      return ResponseUtil.success(reply, scene, "场景添加成功");
    }
  );

  fastify.put<{ Params: { sceneId: string }; Body: Partial<SceneBody> }>(
    "/:sceneId",
    {
      preHandler: [
        async (request: any, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["scene"],
        summary: "更新场景",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            sceneId: { type: "string" },
          },
          required: ["sceneId"],
        },
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            icon: { type: "string" },
            color: { type: "string" },
            description: { type: "string" },
            audioUrl: { type: "string" },
            isActive: { type: "boolean" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { sceneId } = request.params as { sceneId: string };
      const body = request.body as Partial<SceneBody>;

      const existing = await prisma.scene.findUnique({
        where: { sceneId },
      });

      if (!existing) {
        return ResponseUtil.notFound(reply, "场景不存在");
      }

      const scene = await prisma.scene.update({
        where: { sceneId },
        data: body,
        select: {
          sceneId: true,
          name: true,
          icon: true,
          color: true,
          description: true,
          audioUrl: true,
          isActive: true,
          updatedAt: true,
        },
      });

      return ResponseUtil.success(reply, scene, "场景更新成功");
    }
  );

  fastify.delete<{ Params: { sceneId: string } }>(
    "/:sceneId",
    {
      preHandler: [
        async (request: any, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["scene"],
        summary: "删除场景",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            sceneId: { type: "string" },
          },
          required: ["sceneId"],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { sceneId } = request.params as { sceneId: string };

      const existing = await prisma.scene.findUnique({
        where: { sceneId },
      });

      if (!existing) {
        return ResponseUtil.notFound(reply, "场景不存在");
      }

      await prisma.scene.delete({
        where: { sceneId },
      });

      return ResponseUtil.success(reply, null, "场景删除成功");
    }
  );
}
