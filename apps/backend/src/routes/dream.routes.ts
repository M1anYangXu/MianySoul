import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

const dreamSchema = z.object({
  content: z.string().min(1),
  dreamDate: z.string().datetime().optional(),
});

export async function dreamRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/dates",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const dreams = await prisma.dream.findMany({
        where: { userId, deletedAt: null },
        select: { dreamDate: true },
        orderBy: { dreamDate: "desc" },
      });

      const yearMonthMap = new Map<number, Set<number>>();
      dreams.forEach((d) => {
        const date = new Date(d.dreamDate);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        if (!yearMonthMap.has(year)) {
          yearMonthMap.set(year, new Set());
        }
        yearMonthMap.get(year)!.add(month);
      });

      const result = Array.from(yearMonthMap.entries())
        .map(([year, months]) => ({
          year,
          months: Array.from(months).sort((a, b) => a - b),
        }))
        .sort((a, b) => b.year - a.year);

      return ResponseUtil.success(reply, result);
    }
  );

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
      const query = request.query as any;
      const page = query.page ? Number(query.page) : 1;
      const pageSize = query.pageSize ? Number(query.pageSize) : 10;
      const skip = (page - 1) * pageSize;

      const where: any = { userId, deletedAt: null };

      if (query.keyword) {
        where.content = { contains: query.keyword };
      }

      if (query.year && query.month) {
        const year = Number(query.year);
        const month = Number(query.month);
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 1);
        where.dreamDate = {
          gte: startDate,
          lt: endDate,
        };
      } else if (query.year) {
        const year = Number(query.year);
        where.dreamDate = {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        };
      }

      const [dreams, total] = await Promise.all([
        prisma.dream.findMany({
          where,
          orderBy: { dreamDate: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.dream.count({ where }),
      ]);

      return ResponseUtil.paginated(reply, dreams, total, page, pageSize);
    }
  );

  fastify.post(
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
      const body = dreamSchema.parse(request.body);
      const dream = await prisma.dream.create({
        data: {
          content: body.content,
          dreamDate: body.dreamDate ? new Date(body.dreamDate) : new Date(),
          userId,
        },
      });
      return ResponseUtil.success(reply, dream, "记录成功");
    }
  );

  fastify.put<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = dreamSchema.partial().parse(request.body);
      const dream = await prisma.dream.update({
        where: { id: request.params.id, userId },
        data: {
          ...body,
          dreamDate: body.dreamDate ? new Date(body.dreamDate) : undefined,
        },
      });
      return ResponseUtil.success(reply, dream, "更新成功");
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      await prisma.dream.update({
        where: { id: request.params.id, userId },
        data: { deletedAt: new Date() },
      });
      return ResponseUtil.success(reply, null, "删除成功");
    }
  );
}
