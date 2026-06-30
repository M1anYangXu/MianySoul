import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";
import { createActivity } from "../utils/activity.js";

interface SceneBody {
  sceneId: string;
  name: string;
  icon: string;
  description?: string;
  image: string;
  audioUrl: string;
  sortOrder?: number;
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
          },
        },
      },
    },
    async (
      request: FastifyRequest<{ Querystring: { activeOnly?: boolean } }>,
      reply: FastifyReply
    ) => {
      const { activeOnly = true } = request.query;

      const scenes = await prisma.scene.findMany({
        where: activeOnly ? { isActive: true } : {},
        orderBy: { sortOrder: "asc" },
        select: {
          sceneId: true,
          name: true,
          icon: true,
          description: true,
          image: true,
          audioUrl: true,
          sortOrder: true,
          isActive: true,
        },
      });

      return ResponseUtil.success(reply, scenes);
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
          description: true,
          image: true,
          audioUrl: true,
          sortOrder: true,
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
        tags: ["scene"],
        summary: "添加场景（管理员）",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            sceneId: { type: "string" },
            name: { type: "string" },
            icon: { type: "string" },
            description: { type: "string" },
            image: { type: "string" },
            audioUrl: { type: "string" },
            sortOrder: { type: "integer" },
          },
          required: ["sceneId", "name", "icon", "image", "audioUrl"],
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
          description: true,
          image: true,
          audioUrl: true,
          sortOrder: true,
          isActive: true,
          createdAt: true,
        },
      });

      await createActivity("scene", scene.id, `${body.icon} ${body.name}`);

      return ResponseUtil.success(reply, scene, "场景添加成功");
    }
  );

  fastify.put<{ Params: { sceneId: string }; Body: Partial<SceneBody> }>(
    "/:sceneId",
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
        tags: ["scene"],
        summary: "更新场景（管理员）",
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
            description: { type: "string" },
            image: { type: "string" },
            audioUrl: { type: "string" },
            sortOrder: { type: "integer" },
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
          description: true,
          image: true,
          audioUrl: true,
          sortOrder: true,
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
        tags: ["scene"],
        summary: "删除场景（管理员）",
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
