import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

// ==================== 回忆录分类 ====================

const categorySchema = z.object({
  name: z.string().min(1).max(50),
  icon: z.string().max(10).default("📖"),
  description: z.string().max(200).optional(),
  sortOrder: z.number().int().default(0),
});

export async function memoirRoutes(fastify: FastifyInstance): Promise<void> {
  // 获取所有分类（带条目数）
  fastify.get(
    "/categories",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const categories = await prisma.memoirCategory.findMany({
        where: { userId, deletedAt: null },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
        include: {
          _count: { select: { entries: { where: { deletedAt: null } } } },
        },
      });
      return ResponseUtil.success(reply, categories);
    }
  );

  // 创建分类
  fastify.post(
    "/categories",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["memoir"],
        summary: "创建回忆录分类",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = categorySchema.parse(request.body);
      const category = await prisma.memoirCategory.create({
        data: { ...body, userId },
      });
      return ResponseUtil.success(reply, category, "创建成功");
    }
  );

  // 更新分类
  fastify.put<{ Params: { id: string } }>(
    "/categories/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = categorySchema.partial().parse(request.body);
      const category = await prisma.memoirCategory.update({
        where: { id: request.params.id, userId },
        data: body,
      });
      return ResponseUtil.success(reply, category, "更新成功");
    }
  );

  // 删除分类（级联删除条目）
  fastify.delete<{ Params: { id: string } }>(
    "/categories/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      await prisma.memoirCategory.update({
        where: { id: request.params.id, userId },
        data: { deletedAt: new Date() },
      });
      return ResponseUtil.success(reply, null, "删除成功");
    }
  );

  // ==================== 回忆录条目 ====================

  const entrySchema = z.object({
    title: z.string().min(1).max(200),
    content: z.string().min(1),
    imageUrl: z.string().optional().nullable(),
    eventDate: z.string().datetime().optional().nullable(),
    sortOrder: z.number().int().default(0),
  });

  // 获取某分类下的所有条目
  fastify.get<{ Params: { categoryId: string } }>(
    "/categories/:categoryId/entries",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { categoryId: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      // 校验分类属于当前用户
      const category = await prisma.memoirCategory.findFirst({
        where: { id: request.params.categoryId, userId, deletedAt: null },
      });
      if (!category) return ResponseUtil.notFound(reply, "分类不存在");

      const entries = await prisma.memoirEntry.findMany({
        where: { categoryId: request.params.categoryId, deletedAt: null },
        orderBy: [{ eventDate: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
      });
      return ResponseUtil.success(reply, entries);
    }
  );

  // 创建条目
  fastify.post<{ Params: { categoryId: string } }>(
    "/categories/:categoryId/entries",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { categoryId: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const category = await prisma.memoirCategory.findFirst({
        where: { id: request.params.categoryId, userId, deletedAt: null },
      });
      if (!category) return ResponseUtil.notFound(reply, "分类不存在");

      const body = entrySchema.parse(request.body);
      const entry = await prisma.memoirEntry.create({
        data: {
          ...body,
          eventDate: body.eventDate ? new Date(body.eventDate) : null,
          categoryId: request.params.categoryId,
        },
      });
      return ResponseUtil.success(reply, entry, "创建成功");
    }
  );

  // 更新条目
  fastify.put<{ Params: { id: string } }>(
    "/entries/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      // 校验条目属于当前用户
      const entry = await prisma.memoirEntry.findUnique({
        where: { id: request.params.id },
        include: { category: true },
      });
      if (!entry || entry.category.userId !== userId) {
        return ResponseUtil.notFound(reply, "条目不存在");
      }
      const body = entrySchema.partial().parse(request.body);
      const updated = await prisma.memoirEntry.update({
        where: { id: request.params.id },
        data: {
          ...body,
          eventDate: body.eventDate ? new Date(body.eventDate) : entry.eventDate,
        },
      });
      return ResponseUtil.success(reply, updated, "更新成功");
    }
  );

  // 删除条目
  fastify.delete<{ Params: { id: string } }>(
    "/entries/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const entry = await prisma.memoirEntry.findUnique({
        where: { id: request.params.id },
        include: { category: true },
      });
      if (!entry || entry.category.userId !== userId) {
        return ResponseUtil.notFound(reply, "条目不存在");
      }
      await prisma.memoirEntry.update({
        where: { id: request.params.id },
        data: { deletedAt: new Date() },
      });
      return ResponseUtil.success(reply, null, "删除成功");
    }
  );
}
