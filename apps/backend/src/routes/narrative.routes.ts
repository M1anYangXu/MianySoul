import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { ResponseUtil } from "../utils/response.js";
import { createActivity } from "../utils/activity.js";

export async function narrativeRoutes(fastify: FastifyInstance): Promise<void> {
  // ==================== 公开接口 ====================

  // 获取所有叙述（公开，只返回已激活的）
  fastify.get("/", async (_request: FastifyRequest, reply: FastifyReply) => {
    try {
      const narratives = await prisma.narrative.findMany({
        where: { deletedAt: null, isActive: true },
        orderBy: { createdAt: "desc" },
        include: {
          media: {
            where: { deletedAt: null },
            orderBy: { createdAt: "asc" },
          },
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
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      try {
        const narrative = await prisma.narrative.findUnique({
          where: { id, deletedAt: null, isActive: true },
          include: {
            media: {
              where: { deletedAt: null },
              orderBy: { createdAt: "asc" },
            },
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
    async (
      request: FastifyRequest<{
        Querystring: { page?: number; pageSize?: number };
      }>,
      reply: FastifyReply
    ) => {
      const page = request.query.page ? Number(request.query.page) : 1;
      const pageSize = request.query.pageSize ? Number(request.query.pageSize) : 20;
      const skip = (page - 1) * pageSize;

      try {
        const [list, total] = await Promise.all([
          prisma.narrative.findMany({
            where: { deletedAt: null },
            orderBy: { createdAt: "desc" },
            skip,
            take: pageSize,
            include: {
              media: {
                where: { deletedAt: null },
                orderBy: { createdAt: "asc" },
              },
            },
          }),
          prisma.narrative.count({ where: { deletedAt: null } }),
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
    async (
      request: FastifyRequest<{
        Body: {
          title: string;
          description: string;
          type?: string;
          media?: { mediaUrl: string; thumbnail?: string; type?: string }[];
        };
      }>,
      reply: FastifyReply
    ) => {
      const body = request.body;
      try {
        const narrative = await prisma.narrative.create({
          data: {
            title: body.title,
            description: body.description,
            type: body.type || "image",
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
          },
        });

        await createActivity("article", narrative.id, narrative.title);

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
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: {
          title?: string;
          description?: string;
          type?: string;
          isActive?: boolean;
          media?: { id?: string; mediaUrl: string; thumbnail?: string; type?: string }[];
        };
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const body = request.body;

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
          },
        });

        await createActivity("article", id, updated?.title || existing.title);

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
    async (
      request: FastifyRequest<{
        Params: { id: string };
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
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

        await createActivity("article", id, narrative.title);

        return ResponseUtil.success(reply, null, "删除成功");
      } catch (error) {
        console.error("删除叙述错误:", error);
        return ResponseUtil.error(reply, "删除失败");
      }
    }
  );
}
