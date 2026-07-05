import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

const entrySchema = z.object({
  type: z.enum(["text", "photo"]).default("text"),
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  imageUrl: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
});

export async function memoirRoutes(fastify: FastifyInstance): Promise<void> {
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

      const entry = await prisma.memoirEntry.create({
        data: { ...body, userId },
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

      const updated = await prisma.memoirEntry.update({
        where: { id: request.params.id },
        data: body,
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
