import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

const entrySchema = z.object({
  type: z.enum(["text", "photo"]).default("text"),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  categoryId: z.string().optional().nullable(),
  eventDate: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export async function memoirRoutes(fastify: FastifyInstance): Promise<void> {
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
      let categories = await prisma.memoirCategory.findMany({
        where: { deletedAt: null },
        orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
        include: {
          _count: {
            select: { entries: { where: { deletedAt: null } } },
          },
        },
      });

      if (categories.length === 0) {
        await prisma.memoirCategory.create({
          data: { name: "默认回忆", isDefault: true, icon: "📖" },
        });
        categories = await prisma.memoirCategory.findMany({
          where: { deletedAt: null },
          orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
          include: {
            _count: {
              select: { entries: { where: { deletedAt: null } } },
            },
          },
        });
      } else {
        const hasDefault = categories.some((c) => c.isDefault);
        if (!hasDefault) {
          const defaultCat = categories.find((c) => c.name === "默认回忆") || categories[0];
          await prisma.memoirCategory.update({
            where: { id: defaultCat.id },
            data: { isDefault: true },
          });
          categories = await prisma.memoirCategory.findMany({
            where: { deletedAt: null },
            orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { name: "asc" }],
            include: {
              _count: {
                select: { entries: { where: { deletedAt: null } } },
              },
            },
          });
        }
      }

      return ResponseUtil.success(reply, categories);
    }
  );

  fastify.get<{ Params: { id: string } }>(
    "/categories/:id/entries",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const categoryId = request.params.id;

      const entries = await prisma.memoirEntry.findMany({
        where: { userId, categoryId, deletedAt: null },
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      });

      return ResponseUtil.success(reply, entries);
    }
  );

  fastify.post(
    "/categories",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
          if (req.user.role !== "admin") return ResponseUtil.forbidden(reply, "需要管理员权限");
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { name: string; icon?: string; description?: string };
      const name = body.name.trim();

      if (!name) {
        return ResponseUtil.badRequest(reply, "分类名称不能为空");
      }

      const exists = await prisma.memoirCategory.findFirst({
        where: { deletedAt: null, name },
      });

      if (exists) {
        return ResponseUtil.badRequest(reply, "分类名称已存在");
      }

      const category = await prisma.memoirCategory.create({
        data: {
          name,
          icon: body.icon || "📖",
          description: body.description || null,
        },
      });

      return ResponseUtil.success(reply, category, "创建成功");
    }
  );

  fastify.put<{ Params: { id: string } }>(
    "/categories/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
          if (req.user.role !== "admin") return ResponseUtil.forbidden(reply, "需要管理员权限");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const body = request.body as { name?: string; icon?: string; description?: string };
      const category = await prisma.memoirCategory.findUnique({
        where: { id: request.params.id, deletedAt: null },
      });

      if (!category) {
        return ResponseUtil.notFound(reply, "分类不存在");
      }

      const updateData: any = {};
      if (body.name !== undefined) {
        updateData.name = body.name.trim();
        if (!updateData.name) {
          return ResponseUtil.badRequest(reply, "分类名称不能为空");
        }
        const exists = await prisma.memoirCategory.findFirst({
          where: { deletedAt: null, name: updateData.name, id: { not: request.params.id } },
        });
        if (exists) {
          return ResponseUtil.badRequest(reply, "分类名称已存在");
        }
      }
      if (body.icon !== undefined) updateData.icon = body.icon;
      if (body.description !== undefined) updateData.description = body.description;

      const updated = await prisma.memoirCategory.update({
        where: { id: request.params.id },
        data: updateData,
      });

      return ResponseUtil.success(reply, updated, "更新成功");
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/categories/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
          if (req.user.role !== "admin") return ResponseUtil.forbidden(reply, "需要管理员权限");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const category = await prisma.memoirCategory.findUnique({
        where: { id: request.params.id, deletedAt: null },
      });

      if (!category) {
        return ResponseUtil.notFound(reply, "分类不存在");
      }

      if (category.isDefault) {
        return ResponseUtil.badRequest(reply, "默认分类不能删除");
      }

      await prisma.memoirCategory.update({
        where: { id: request.params.id },
        data: { deletedAt: new Date() },
      });

      return ResponseUtil.success(reply, null, "删除成功");
    }
  );

  fastify.get(
    "/entries",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const query = request.query as any;
      const page = query.page ? Number(query.page) : 1;
      const pageSize = query.pageSize ? Number(query.pageSize) : 20;
      const skip = (page - 1) * pageSize;

      const where: any = { userId, deletedAt: null };

      if (query.type) {
        where.type = query.type;
      }

      if (query.keyword) {
        where.OR = [
          { title: { contains: query.keyword } },
          { content: { contains: query.keyword } },
        ];
      }

      const [entries, total] = await Promise.all([
        prisma.memoirEntry.findMany({
          where,
          orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
          include: { category: true },
          skip,
          take: pageSize,
        }),
        prisma.memoirEntry.count({ where }),
      ]);

      return ResponseUtil.paginated(reply, entries, total, page, pageSize);
    }
  );

  fastify.post(
    "/entries",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["memoir"],
        summary: "创建回忆录条目",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = entrySchema.parse(request.body);

      if (body.type === "photo" && !body.imageUrl) {
        return ResponseUtil.badRequest(reply, "照片回忆需要选择图片");
      }

      const createData: any = { ...body, userId };
      if (body.eventDate) {
        createData.eventDate = new Date(body.eventDate);
      }

      const entry = await prisma.memoirEntry.create({
        data: createData,
      });
      return ResponseUtil.success(reply, entry, "创建成功");
    }
  );

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
      const entry = await prisma.memoirEntry.findUnique({
        where: { id: request.params.id },
      });
      if (!entry || entry.userId !== userId) {
        return ResponseUtil.notFound(reply, "条目不存在");
      }

      const body = entrySchema.partial().parse(request.body);
      if (body.type === "photo" && !body.imageUrl) {
        return ResponseUtil.badRequest(reply, "照片回忆需要选择图片");
      }

      const updateData: any = { ...body };
      if (body.eventDate) {
        updateData.eventDate = new Date(body.eventDate);
      }

      const updated = await prisma.memoirEntry.update({
        where: { id: request.params.id },
        data: updateData,
      });
      return ResponseUtil.success(reply, updated, "更新成功");
    }
  );

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
      });
      if (!entry || entry.userId !== userId) {
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
