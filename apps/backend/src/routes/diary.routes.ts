import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

const weatherOptions = ["sunny", "cloudy", "rainy", "snowy", "windy", "foggy"] as const;
const moodOptions = ["happy", "calm", "anxious", "sad", "angry", "excited"] as const;

const diarySchema = z.object({
  content: z.string().min(1),
  weather: z.enum(weatherOptions).optional().nullable(),
  mood: z.enum(moodOptions).optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  isOutside: z.boolean().optional().nullable(),
  diaryDate: z.string().datetime().optional(),
});

export async function diaryRoutes(fastify: FastifyInstance): Promise<void> {
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
      const diaries = await prisma.diary.findMany({
        where: { userId, deletedAt: null },
        orderBy: { diaryDate: "desc" },
      });
      return ResponseUtil.success(reply, diaries);
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
      const diary = await prisma.diary.create({
        data: {
          content: body.content,
          weather: body.weather || null,
          mood: body.mood || null,
          imageUrl: body.imageUrl || null,
          isOutside: body.isOutside || false,
          diaryDate: body.diaryDate ? new Date(body.diaryDate) : new Date(),
          userId,
        },
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
      const diary = await prisma.diary.update({
        where: { id: request.params.id, userId },
        data: {
          content: body.content,
          weather: body.weather !== undefined ? body.weather : undefined,
          mood: body.mood !== undefined ? body.mood : undefined,
          imageUrl: body.imageUrl !== undefined ? body.imageUrl : undefined,
          isOutside: body.isOutside !== undefined ? body.isOutside : undefined,
          diaryDate: body.diaryDate ? new Date(body.diaryDate) : undefined,
        },
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
