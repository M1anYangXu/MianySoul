import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

interface MusicLyricBody {
  singer: string;
  songName: string;
  lyric: string;
  coverImage?: string;
  audioId?: string;
  categoryId?: string;
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
            category: { type: "string" },
            keyword: { type: "string" },
            page: { type: "number", default: 1 },
            pageSize: { type: "number", default: 10 },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: {
          activeOnly?: boolean;
          singer?: string;
          category?: string;
          keyword?: string;
          page?: number;
          pageSize?: number;
        };
      }>,
      reply: FastifyReply
    ) => {
      const { singer, category, keyword, page = 1, pageSize = 10 } = request.query;
      const skip = (page - 1) * pageSize;

      const where: any = {
        deletedAt: null,
      };
      if (singer) {
        where.singer = singer;
      }
      if (category) {
        where.categoryId = category;
      }
      if (keyword) {
        where.OR = [
          { singer: { contains: keyword } },
          { songName: { contains: keyword } },
          { lyric: { contains: keyword } },
          { categoryRel: { name: { contains: keyword } } },
        ];
      } else {
        where.OR = [{ categoryId: null }, { categoryRel: { isPublic: true, deletedAt: null } }];
      }

      const [lyrics, total] = await Promise.all([
        prisma.musicLyric.findMany({
          where,
          orderBy: [{ createdAt: "desc" }],
          select: {
            id: true,
            singer: true,
            songName: true,
            lyric: true,
            coverImage: true,
            audioId: true,
            audio: {
              select: {
                id: true,
                url: true,
                filename: true,
              },
            },
            category: true,
            categoryId: true,
            categoryRel: {
              select: {
                id: true,
                name: true,
                icon: true,
              },
            },
            createdAt: true,
          },
          skip,
          take: pageSize,
        }),
        prisma.musicLyric.count({ where }),
      ]);

      return ResponseUtil.paginated(reply, lyrics, total, page, pageSize);
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
          audioId: true,
          audio: {
            select: {
              id: true,
              url: true,
              filename: true,
            },
          },
          category: true,
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
        where: { deletedAt: null },
        select: { singer: true },
        distinct: ["singer"],
        orderBy: { singer: "asc" },
      });

      const singers = lyrics.map((item) => item.singer);

      return ResponseUtil.success(reply, singers);
    }
  );

  fastify.get(
    "/categories/list",
    {
      schema: {
        tags: ["music"],
        summary: "获取所有分类列表",
      },
    },
    async (request: FastifyRequest<{ Querystring: { admin?: string } }>, reply: FastifyReply) => {
      const isAdmin = request.query.admin === "true";
      const where = isAdmin ? { deletedAt: null } : { deletedAt: null, isPublic: true };

      const categories = await prisma.musicCategory.findMany({
        where,
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
        include: {
          _count: {
            select: { lyrics: { where: { deletedAt: null } } },
          },
        },
      });

      const defaultCategory =
        categories.find((cat) => cat.isDefault) ||
        categories.find((cat) => cat.name === "默认分组") ||
        categories.find((cat) => cat.name === "默认分类") ||
        null;

      const defaultCount = defaultCategory
        ? await prisma.musicLyric.count({
            where: {
              deletedAt: null,
              OR: [{ categoryId: null }, { categoryId: defaultCategory.id }],
            },
          })
        : 0;

      const categoryList = categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        icon: cat.icon,
        isDefault: cat.isDefault,
        isPublic: cat.isPublic,
        count: defaultCategory && cat.id === defaultCategory.id ? defaultCount : cat._count.lyrics,
      }));

      return ResponseUtil.success(reply, categoryList);
    }
  );

  fastify.post(
    "/categories",
    {
      preHandler: [
        async (request: any, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["music"],
        summary: "创建分类（管理员）",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            icon: { type: "string" },
            isPublic: { type: "boolean" },
          },
          required: ["name"],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as { name: string; icon?: string; isPublic?: boolean };
      const name = body.name.trim();

      if (!name) {
        return ResponseUtil.badRequest(reply, "分类名称不能为空");
      }

      const exists = await prisma.musicCategory.findFirst({
        where: { deletedAt: null, name },
      });

      if (exists) {
        return ResponseUtil.badRequest(reply, "分类已存在");
      }

      const category = await prisma.musicCategory.create({
        data: {
          name,
          icon: body.icon || "mdi:music",
          isPublic: body.isPublic !== undefined ? body.isPublic : true,
        },
      });

      return ResponseUtil.success(reply, category, "分类创建成功");
    }
  );

  fastify.put(
    "/categories/:id",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["music"],
        summary: "更新分类（管理员）",
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
            name: { type: "string" },
            icon: { type: "string" },
            isPublic: { type: "boolean" },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      const body = request.body as { name?: string; icon?: string; isPublic?: boolean };

      const category = await prisma.musicCategory.findUnique({
        where: { id, deletedAt: null },
      });

      if (!category) {
        return ResponseUtil.notFound(reply, "分类不存在");
      }

      if (body.name !== undefined) {
        const name = body.name.trim();
        if (!name) {
          return ResponseUtil.badRequest(reply, "分类名称不能为空");
        }
        const exists = await prisma.musicCategory.findFirst({
          where: { deletedAt: null, name, id: { not: id } },
        });
        if (exists) {
          return ResponseUtil.badRequest(reply, "分类名称已存在");
        }
      }

      const updated = await prisma.musicCategory.update({
        where: { id },
        data: {
          ...(body.name !== undefined && { name: body.name.trim() }),
          ...(body.icon !== undefined && { icon: body.icon }),
          ...(body.isPublic !== undefined && { isPublic: body.isPublic }),
        },
      });

      return ResponseUtil.success(reply, updated, "分类更新成功");
    }
  );

  fastify.delete(
    "/categories/:id",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["music"],
        summary: "删除分类（管理员）",
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
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;

      const category = await prisma.musicCategory.findUnique({
        where: { id, deletedAt: null },
      });

      if (!category) {
        return ResponseUtil.notFound(reply, "分类不存在");
      }

      if (category.isDefault) {
        return ResponseUtil.badRequest(reply, "默认分类无法删除");
      }

      const count = await prisma.musicLyric.count({
        where: { deletedAt: null, categoryId: id },
      });

      if (count > 0) {
        return ResponseUtil.badRequest(reply, "该分类下存在歌词，无法删除");
      }

      await prisma.musicCategory.update({
        where: { id },
        data: { deletedAt: new Date() },
      });

      return ResponseUtil.success(reply, null, "分类删除成功");
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
            audioId: { type: "string" },
            category: { type: "string" },
          },
          required: ["singer", "songName", "lyric"],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const body = request.body as MusicLyricBody;

      const audioId = body.audioId && body.audioId.trim() ? body.audioId : null;
      if (audioId) {
        const audioExists = await prisma.audio.findUnique({
          where: { id: audioId, deletedAt: null },
        });
        if (!audioExists) {
          return ResponseUtil.badRequest(reply, "音频文件不存在");
        }
      }

      let categoryId = body.categoryId;
      if (!categoryId) {
        const defaultCategory = await prisma.musicCategory.findFirst({
          where: { deletedAt: null, isDefault: true },
        });
        if (!defaultCategory) {
          return ResponseUtil.badRequest(reply, "请先创建分类");
        }
        categoryId = defaultCategory.id;
      }

      const lyric = await prisma.musicLyric.create({
        data: {
          singer: body.singer,
          songName: body.songName,
          lyric: body.lyric,
          coverImage: body.coverImage,
          audioId,
          categoryId,
        },
        select: {
          id: true,
          singer: true,
          songName: true,
          lyric: true,
          coverImage: true,
          audioId: true,
          audio: {
            select: {
              id: true,
              url: true,
              filename: true,
            },
          },
          categoryId: true,
          categoryRel: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
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
            audioId: { type: "string" },
            categoryId: { type: "string" },
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

      const audioId = body.audioId && body.audioId.trim() ? body.audioId : null;
      if (audioId) {
        const audioExists = await prisma.audio.findUnique({
          where: { id: audioId, deletedAt: null },
        });
        if (!audioExists) {
          return ResponseUtil.badRequest(reply, "音频文件不存在");
        }
      }

      const updateData: any = {};
      if (body.singer !== undefined) updateData.singer = body.singer;
      if (body.songName !== undefined) updateData.songName = body.songName;
      if (body.lyric !== undefined) updateData.lyric = body.lyric;
      if (body.coverImage !== undefined) updateData.coverImage = body.coverImage;
      if (body.audioId !== undefined) updateData.audioId = audioId;
      if (body.categoryId !== undefined) {
        updateData.categoryId = body.categoryId || null;
        if (body.categoryId) {
          const category = await prisma.musicCategory.findFirst({
            where: { id: body.categoryId, deletedAt: null },
          });
          if (category) {
            updateData.category = category.name;
          }
        } else {
          updateData.category = "默认分类";
        }
      }

      const lyric = await prisma.musicLyric.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          singer: true,
          songName: true,
          lyric: true,
          coverImage: true,
          audioId: true,
          audio: {
            select: {
              id: true,
              url: true,
              filename: true,
            },
          },
          categoryId: true,
          categoryRel: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
          updatedAt: true,
        },
      });

      return ResponseUtil.success(reply, lyric, "歌词更新成功");
    }
  );

  fastify.put<{ Params: { id: string }; Body: { categoryId: string } }>(
    "/:id/move",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["music"],
        summary: "移动歌词到指定分类（管理员）",
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
            categoryId: { type: "string" },
          },
          required: ["categoryId"],
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { id } = request.params as { id: string };
      const { categoryId } = request.body as { categoryId: string };

      const existing = await prisma.musicLyric.findUnique({
        where: { id, deletedAt: null },
      });

      if (!existing) {
        return ResponseUtil.notFound(reply, "歌词不存在");
      }

      const category = await prisma.musicCategory.findFirst({
        where: { id: categoryId, deletedAt: null },
      });

      if (!category) {
        return ResponseUtil.badRequest(reply, "分类不存在");
      }

      const lyric = await prisma.musicLyric.update({
        where: { id },
        data: {
          categoryId: categoryId,
          category: category.name,
        },
        select: {
          id: true,
          singer: true,
          songName: true,
          categoryId: true,
          categoryRel: {
            select: {
              id: true,
              name: true,
              icon: true,
            },
          },
        },
      });

      return ResponseUtil.success(reply, lyric, "移动成功");
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
