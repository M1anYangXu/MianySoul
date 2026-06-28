import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

interface MusicLyricBody {
  singer: string;
  songName: string;
  lyric: string;
  coverImage?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export async function musicRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/",
    {
      schema: {
        tags: ["music"],
        summary: "获取所有歌词段（公开接口）",
        querystring: {
          type: "object",
          properties: {
            activeOnly: { type: "boolean", default: true },
            singer: { type: "string" },
            keyword: { type: "string" },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { activeOnly?: boolean; singer?: string; keyword?: string };
      }>,
      reply: FastifyReply
    ) => {
      const { activeOnly = true, singer, keyword } = request.query;

      const where: any = { deletedAt: null };
      if (activeOnly) {
        where.isActive = true;
      }
      if (singer) {
        where.singer = singer;
      }
      if (keyword) {
        where.OR = [
          { singer: { contains: keyword } },
          { songName: { contains: keyword } },
          { lyric: { contains: keyword } },
        ];
      }

      const lyrics = await prisma.musicLyric.findMany({
        where,
        orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          singer: true,
          songName: true,
          lyric: true,
          coverImage: true,
          sortOrder: true,
          isActive: true,
          createdAt: true,
        },
      });

      return ResponseUtil.success(reply, lyrics);
    }
  );

  fastify.get(
    "/:id",
    {
      schema: {
        tags: ["music"],
        summary: "获取单个歌词段（公开接口）",
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;

      const lyric = await prisma.musicLyric.findUnique({
        where: { id, deletedAt: null },
        select: {
          id: true,
          singer: true,
          songName: true,
          lyric: true,
          coverImage: true,
          sortOrder: true,
          isActive: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!lyric) {
        return ResponseUtil.notFound(reply, "歌词不存在");
      }

      return ResponseUtil.success(reply, lyric);
    }
  );

  fastify.get(
    "/singers/list",
    {
      schema: {
        tags: ["music"],
        summary: "获取所有歌手列表（公开接口）",
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const lyrics = await prisma.musicLyric.findMany({
        where: { deletedAt: null, isActive: true },
        select: { singer: true },
        distinct: ["singer"],
        orderBy: { singer: "asc" },
      });

      const singers = lyrics.map((item) => item.singer);

      return ResponseUtil.success(reply, singers);
    }
  );

  fastify.post<{ Body: MusicLyricBody }>(
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
        tags: ["music"],
        summary: "添加歌词（管理员）",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            singer: { type: "string" },
            songName: { type: "string" },
            lyric: { type: "string" },
            coverImage: { type: "string" },
            sortOrder: { type: "integer" },
            isActive: { type: "boolean" },
          },
          required: ["singer", "songName", "lyric"],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as MusicLyricBody;

      const lyric = await prisma.musicLyric.create({
        data: {
          singer: body.singer,
          songName: body.songName,
          lyric: body.lyric,
          coverImage: body.coverImage,
          sortOrder: body.sortOrder ?? 0,
          isActive: body.isActive ?? true,
        },
        select: {
          id: true,
          singer: true,
          songName: true,
          lyric: true,
          coverImage: true,
          sortOrder: true,
          isActive: true,
          createdAt: true,
        },
      });

      return ResponseUtil.success(reply, lyric, "歌词添加成功");
    }
  );

  fastify.put<{ Params: { id: string }; Body: Partial<MusicLyricBody> }>(
    "/:id",
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
        tags: ["music"],
        summary: "更新歌词（管理员）",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
        body: {
          type: "object",
          properties: {
            singer: { type: "string" },
            songName: { type: "string" },
            lyric: { type: "string" },
            coverImage: { type: "string" },
            sortOrder: { type: "integer" },
            isActive: { type: "boolean" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const body = request.body as Partial<MusicLyricBody>;

      const existing = await prisma.musicLyric.findUnique({
        where: { id },
      });

      if (!existing) {
        return ResponseUtil.notFound(reply, "歌词不存在");
      }

      const updateData: any = {};
      if (body.singer !== undefined) updateData.singer = body.singer;
      if (body.songName !== undefined) updateData.songName = body.songName;
      if (body.lyric !== undefined) updateData.lyric = body.lyric;
      if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
      if (body.sortOrder !== undefined) updateData.sortOrder = body.sortOrder;
      if (body.isActive !== undefined) updateData.isActive = body.isActive;

      const lyric = await prisma.musicLyric.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          singer: true,
          songName: true,
          lyric: true,
          coverImage: true,
          sortOrder: true,
          isActive: true,
          updatedAt: true,
        },
      });

      return ResponseUtil.success(reply, lyric, "歌词更新成功");
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/:id",
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
        tags: ["music"],
        summary: "删除歌词（管理员，软删除）",
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
          required: ["id"],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };

      const existing = await prisma.musicLyric.findUnique({
        where: { id },
      });

      if (!existing) {
        return ResponseUtil.notFound(reply, "歌词不存在");
      }

      await prisma.musicLyric.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return ResponseUtil.success(reply, null, "歌词删除成功");
    }
  );
}
