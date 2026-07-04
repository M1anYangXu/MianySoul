import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

const weatherOptions = [
  "sunny",
  "cloudy",
  "rainy",
  "snowy",
  "windy",
  "foggy",
  "thunderstorm",
  "drizzle",
  "hail",
  "overcast",
] as const;
const moodOptions = [
  "happy",
  "calm",
  "anxious",
  "sad",
  "angry",
  "excited",
  "tired",
  "confused",
  "hopeful",
  "grateful",
  "lonely",
  "content",
] as const;

const diarySchema = z.object({
  content: z.string().min(1),
  weather: z.enum(weatherOptions).optional().nullable(),
  mood: z.enum(moodOptions).optional().nullable(),
  imageUrls: z.array(z.string()).optional().default([]),
  isOutside: z.boolean().optional().nullable(),
  diaryDate: z.string().datetime().optional(),
});

export async function diaryRoutes(fastify: FastifyInstance): Promise<void> {
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
      const diaries = await prisma.diary.findMany({
        where: { userId, deletedAt: null },
        select: { diaryDate: true },
        orderBy: { diaryDate: "desc" },
      });

      const yearMonthMap = new Map<number, Set<number>>();
      diaries.forEach((d) => {
        const date = new Date(d.diaryDate);
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
        where.diaryDate = {
          gte: startDate,
          lt: endDate,
        };
      } else if (query.year) {
        const year = Number(query.year);
        where.diaryDate = {
          gte: new Date(year, 0, 1),
          lt: new Date(year + 1, 0, 1),
        };
      }

      const [diaries, total] = await Promise.all([
        prisma.diary.findMany({
          where,
          orderBy: { diaryDate: "desc" },
          include: { images: { orderBy: { sortOrder: "asc" } } },
          skip,
          take: pageSize,
        }),
        prisma.diary.count({ where }),
      ]);

      return ResponseUtil.paginated(reply, diaries, total, page, pageSize);
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
      const body = diarySchema.parse(request.body);
      const imageUrls = body.imageUrls || [];
      const diary = await prisma.diary.create({
        data: {
          content: body.content,
          weather: body.weather || null,
          mood: body.mood || null,
          isOutside: body.isOutside || false,
          diaryDate: body.diaryDate ? new Date(body.diaryDate) : new Date(),
          userId,
          images: {
            create: imageUrls.map((url: string, index: number) => ({
              imageUrl: url,
              sortOrder: index,
            })),
          },
        },
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
      return ResponseUtil.success(reply, diary, "记录成功");
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
      const body = diarySchema.partial().parse(request.body);
      const imageUrls = body.imageUrls;
      const updateData: any = {
        content: body.content,
        weather: body.weather !== undefined ? body.weather : undefined,
        mood: body.mood !== undefined ? body.mood : undefined,
        isOutside: body.isOutside !== undefined ? body.isOutside : undefined,
        diaryDate: body.diaryDate ? new Date(body.diaryDate) : undefined,
      };

      if (imageUrls !== undefined) {
        await prisma.diaryImage.deleteMany({ where: { diaryId: request.params.id } });
        if (imageUrls.length > 0) {
          await prisma.diaryImage.createMany({
            data: imageUrls.map((url: string, index: number) => ({
              diaryId: request.params.id,
              imageUrl: url,
              sortOrder: index,
            })),
          });
        }
      }

      const diary = await prisma.diary.update({
        where: { id: request.params.id, userId },
        data: updateData,
        include: { images: { orderBy: { sortOrder: "asc" } } },
      });
      return ResponseUtil.success(reply, diary, "更新成功");
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
      await prisma.diary.update({
        where: { id: request.params.id, userId },
        data: { deletedAt: new Date() },
      });
      return ResponseUtil.success(reply, null, "删除成功");
    }
  );
}
