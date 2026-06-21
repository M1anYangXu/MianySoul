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
      const dreams = await prisma.dream.findMany({
        where: { userId, deletedAt: null },
        orderBy: { dreamDate: "desc" },
      });
      return ResponseUtil.success(reply, dreams);
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
