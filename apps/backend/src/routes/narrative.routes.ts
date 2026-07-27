import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { ResponseUtil } from "../utils/response.js";

export async function narrativeRoutes(fastify: FastifyInstance): Promise<void> {
  // ==================== 分类管理接口 ====================

  // 获取所有分类
  fastify.get<{ Querystring: { admin?: string } }>(
    "/categories/list",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const query = request.query as { admin?: string };
        const isAdmin = query.admin === "true";
        const where = isAdmin ? { deletedAt: null } : { deletedAt: null, isPublic: true };

        const categories = await prisma.narrativeCategory.findMany({
          where,
          orderBy: [{ isDefault: "desc" }, { createdAt: "asc" }],
          include: {
            _count: {
              select: { narratives: { where: { deletedAt: null } } },
            },
          },
        });

        const defaultCategory = categories.find((cat) => cat.isDefault);
        const defaultCount = defaultCategory
          ? await prisma.narrative.count({
              where: {
                deletedAt: null,
                OR: [{ categoryId: null }, { categoryId: defaultCategory.id }],
              },
            })
          : 0;

        const result = categories.map((cat) => ({
          id: cat.id,
          name: cat.name,
          icon: cat.icon,
          isDefault: cat.isDefault,
          isPublic: cat.isPublic,
          count: cat.isDefault ? defaultCount : cat._count.narratives,
        }));

        if (!isAdmin && !result.some((cat) => cat.isDefault)) {
          const defaultCat = await prisma.narrativeCategory.findFirst({
            where: { isDefault: true, deletedAt: null },
          });
          if (defaultCat) {
            const count = await prisma.narrative.count({
              where: {
                deletedAt: null,
                OR: [{ categoryId: null }, { categoryId: defaultCat.id }],
              },
            });
            result.unshift({
              id: defaultCat.id,
              name: defaultCat.name,
              icon: defaultCat.icon,
              isDefault: true,
              isPublic: true,
              count,
            });
          }
        }

        return ResponseUtil.success(reply, result);
      } catch (error) {
        console.error("获取分类错误:", error);
        return ResponseUtil.error(reply, "获取分类失败");
      }
    }
  );

  // 创建分类
  fastify.post(
    "/categories",
    {
      preHandler: [
        async (request: any, reply: FastifyReply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { name, icon, isPublic = true } = request.body as { name: string; icon?: string; isPublic?: boolean };
      try {
        const existing = await prisma.narrativeCategory.findFirst({
          where: { name, deletedAt: null },
        });
        if (existing) {
          return ResponseUtil.error(reply, "分类已存在");
        }

        const category = await prisma.narrativeCategory.create({
          data: {
            name,
            icon: icon || "📁",
            isPublic,
          },
        });

        return ResponseUtil.success(reply, category, "创建成功");
      } catch (error) {
        console.error("创建分类错误:", error);
        return ResponseUtil.error(reply, "创建失败");
      }
    }
  );

  // 更新分类
  fastify.put(
    "/categories/:id",
    {
      preHandler: [
        async (request: any, reply: FastifyReply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const { name, icon, isPublic } = request.body as { name?: string; icon?: string; isPublic?: boolean };
      try {
        const existing = await prisma.narrativeCategory.findUnique({
          where: { id, deletedAt: null },
        });
        if (!existing) {
          return ResponseUtil.notFound(reply, "分类不存在");
        }

        if (name) {
          const duplicate = await prisma.narrativeCategory.findFirst({
            where: { name, id: { not: id }, deletedAt: null },
          });
          if (duplicate) {
            return ResponseUtil.error(reply, "分类名称已存在");
          }
        }

        const updated = await prisma.narrativeCategory.update({
          where: { id },
          data: {
            ...(name && { name }),
            ...(icon && { icon }),
            ...(isPublic !== undefined && { isPublic }),
          },
        });

        return ResponseUtil.success(reply, updated, "更新成功");
      } catch (error) {
        console.error("更新分类错误:", error);
        return ResponseUtil.error(reply, "更新失败");
      }
    }
  );

  // 删除分类（软删除）
  fastify.delete(
    "/categories/:id",
    {
      preHandler: [
        async (request: any, reply: FastifyReply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const existing = await prisma.narrativeCategory.findUnique({
          where: { id, deletedAt: null },
        });
        if (!existing) {
          return ResponseUtil.notFound(reply, "分类不存在");
        }

        const count = await prisma.narrative.count({
          where: { categoryId: id, deletedAt: null },
        });
        if (count > 0) {
          return ResponseUtil.error(reply, "该分类下存在叙述，无法删除");
        }

        await prisma.narrativeCategory.update({
          where: { id },
          data: { deletedAt: new Date() },
        });

        return ResponseUtil.success(reply, null, "删除成功");
      } catch (error) {
        console.error("删除分类错误:", error);
        return ResponseUtil.error(reply, "删除失败");
      }
    }
  );

  // ==================== 公开接口 ====================

  // 获取所有叙述（公开，只返回已激活的）
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const narratives = await prisma.narrative.findMany({
        where: {
          deletedAt: null,
          isActive: true,
          OR: [{ categoryId: null }, { category: { isPublic: true, deletedAt: null } }],
        },
        orderBy: { createdAt: "desc" },
        include: {
          media: {
            where: { deletedAt: null },
            orderBy: { createdAt: "asc" },
          },
          category: true,
        },
      });
      return ResponseUtil.success(reply, narratives);
    } catch (error) {
      console.error("获取叙述错误:", error);
      return ResponseUtil.error(reply, "获取叙述失败");
    }
  });

  // 获取单条叙述详情（公开）
  fastify.get(
    "/:id",
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const narrative = await prisma.narrative.findUnique({
          where: { id, deletedAt: null, isActive: true },
          include: {
            media: {
              where: { deletedAt: null },
              orderBy: { createdAt: "asc" },
            },
            category: true,
          },
        });
        if (!narrative) {
          return ResponseUtil.notFound(reply, "叙述不存在");
        }
        return ResponseUtil.success(reply, narrative);
      } catch (error) {
        console.error("获取叙述详情错误:", error);
        return ResponseUtil.error(reply, "获取叙述详情失败");
      }
    }
  );

  // ==================== 管理接口（需要登录） ====================

  // 获取所有叙述（管理端，包含未激活的）
  fastify.get(
    "/admin/list",
    {
      preHandler: [
        async (request: any, reply: FastifyReply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const query = request.query as { page?: number; pageSize?: number; categoryId?: string };
      const page = query.page ? Number(query.page) : 1;
      const pageSize = query.pageSize ? Number(query.pageSize) : 20;
      const categoryId = query.categoryId;
      const skip = (page - 1) * pageSize;

      const where: any = { deletedAt: null };
      if (categoryId) {
        where.categoryId = categoryId;
      }

      try {
        const [list, total] = await Promise.all([
          prisma.narrative.findMany({
            where,
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            include: {
              media: {
                where: { deletedAt: null },
                orderBy: { createdAt: "asc" },
              },
              category: true,
            },
          }),
          prisma.narrative.count({ where }),
        ]);

        return ResponseUtil.success(reply, {
          list,
          total,
          page,
          pageSize,
          totalPages: Math.ceil(total / pageSize),
        });
      } catch (error) {
        console.error("获取叙述列表错误:", error);
        return ResponseUtil.error(reply, "获取叙述列表失败");
      }
    }
  );

  // 创建叙述
  fastify.post(
    "/",
    {
      preHandler: [
        async (request: any, reply: FastifyReply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as {
        title: string;
        description: string;
        type?: string;
        categoryId?: string;
        media?: { mediaUrl: string; thumbnail?: string; type?: string }[];
      };
      try {
        const narrative = await prisma.narrative.create({
          data: {
            title: body.title,
            description: body.description,
            type: body.type || "image",
            categoryId: body.categoryId || null,
            media: body.media
              ? {
                  create: body.media.map((m) => ({
                    mediaUrl: m.mediaUrl,
                    thumbnail: m.thumbnail,
                    type: m.type || "image",
                  })),
                }
              : undefined,
          },
          include: {
            media: true,
            category: true,
          },
        });

        return ResponseUtil.success(reply, narrative, "创建成功");
      } catch (error) {
        console.error("创建叙述错误:", error);
        return ResponseUtil.error(reply, "创建失败");
      }
    }
  );

  // 更新叙述
  fastify.put(
    "/:id",
    {
      preHandler: [
        async (request: any, reply: FastifyReply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as {
        title?: string;
        description?: string;
        type?: string;
        isActive?: boolean;
        categoryId?: string;
        media?: { id?: string; mediaUrl: string; thumbnail?: string; type?: string }[];
      };

      try {
        const existing = await prisma.narrative.findUnique({
          where: { id, deletedAt: null },
        });
        if (!existing) {
          return ResponseUtil.notFound(reply, "叙述不存在");
        }

        const updateData: Record<string, unknown> = {};
        if (body.title !== undefined) updateData.title = body.title;
        if (body.description !== undefined) updateData.description = body.description;
        if (body.type !== undefined) updateData.type = body.type;
        if (body.isActive !== undefined) updateData.isActive = body.isActive;
        if (body.categoryId !== undefined) updateData.categoryId = body.categoryId || null;

        if (body.media !== undefined) {
          const existingMediaIds = (
            await prisma.narrativeMedia.findMany({
              where: { narrativeId: id, deletedAt: null },
              select: { id: true },
            })
          ).map((m) => m.id);

          const mediaToUpdate = body.media.filter((m) => m.id);
          const mediaToCreate = body.media.filter((m) => !m.id);

          await prisma.narrative.update({
            where: { id },
            data: {
              ...updateData,
              media: {
                update: mediaToUpdate.map((m) => ({
                  where: { id: m.id! },
                  data: {
                    mediaUrl: m.mediaUrl,
                    thumbnail: m.thumbnail,
                    type: m.type || "image",
                  },
                })),
                create: mediaToCreate.map((m) => ({
                  mediaUrl: m.mediaUrl,
                  thumbnail: m.thumbnail,
                  type: m.type || "image",
                })),
              },
            },
          });

          const currentMediaIds = body.media.filter((m) => m.id).map((m) => m.id!);
          const mediaToDelete = existingMediaIds.filter((id) => !currentMediaIds.includes(id));
          if (mediaToDelete.length > 0) {
            await prisma.narrativeMedia.updateMany({
              where: { id: { in: mediaToDelete } },
              data: { deletedAt: new Date() },
            });
          }
        } else {
          await prisma.narrative.update({
            where: { id },
            data: updateData,
          });
        }

        const updated = await prisma.narrative.findUnique({
          where: { id },
          include: {
            media: {
              where: { deletedAt: null },
              orderBy: { createdAt: "asc" },
            },
            category: true,
          },
        });

        return ResponseUtil.success(reply, updated, "更新成功");
      } catch (error) {
        console.error("更新叙述错误:", error);
        return ResponseUtil.error(reply, "更新失败");
      }
    }
  );

  // 删除叙述（软删除）
  fastify.delete(
    "/:id",
    {
      preHandler: [
        async (request: any, reply: FastifyReply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      try {
        const narrative = await prisma.narrative.findUnique({
          where: { id, deletedAt: null },
        });
        if (!narrative) {
          return ResponseUtil.notFound(reply, "叙述不存在");
        }

        await prisma.narrative.update({
          where: { id },
          data: { deletedAt: new Date() },
        });

        await prisma.narrativeMedia.updateMany({
          where: { narrativeId: id },
          data: { deletedAt: new Date() },
        });

        return ResponseUtil.success(reply, null, "删除成功");
      } catch (error) {
        console.error("删除叙述错误:", error);
        return ResponseUtil.error(reply, "删除失败");
      }
    }
  );
}
