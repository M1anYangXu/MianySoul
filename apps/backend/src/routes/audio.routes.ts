import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";
import { getUploadsDir } from "../utils/paths.js";

const uploadDir = getUploadsDir();
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export async function audioRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(import("@fastify/multipart"), {
    limits: {
      fileSize: 524288000,
    },
  });

  fastify.get(
    "/groups",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["audio"],
        summary: "获取音频分组列表",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      let groups = await prisma.audioGroup.findMany({
        where: {
          OR: [
            { userId, deletedAt: null },
            { userId: "default", deletedAt: null }
          ]
        },
        orderBy: { sortOrder: "asc" },
      });

      const hasSystemDefault = groups.some((g) => g.userId === "default" && g.isDefault);
      if (!hasSystemDefault) {
        await prisma.audioGroup.create({
          data: { name: "默认分组", isDefault: true, userId: "default" },
        });
        groups = await prisma.audioGroup.findMany({
          where: {
            OR: [
              { userId, deletedAt: null },
              { userId: "default", deletedAt: null }
            ]
          },
          orderBy: { sortOrder: "asc" },
        });
      }

      groups = await Promise.all(
        groups.map(async (group) => {
          const count = await prisma.audio.count({
            where: {
              groupId: group.id,
              deletedAt: null,
            },
          });
          return { ...group, _count: { audios: count } };
        })
      );

      return ResponseUtil.success(reply, groups);
    }
  );

  fastify.post(
    "/groups",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["audio"],
        summary: "创建音频分组",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["name"],
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            icon: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const body = request.body as any;

      const group = await prisma.audioGroup.create({
        data: {
          name: body.name,
          description: body.description || null,
          icon: body.icon || "📁",
          userId,
        },
      });

      return ResponseUtil.success(reply, group, "创建成功");
    }
  );

  fastify.put<{ Params: { id: string } }>(
    "/groups/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["audio"],
        summary: "更新音频分组",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            name: { type: "string" },
            description: { type: "string" },
            icon: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const body = request.body as any;

      const group = await prisma.audioGroup.findFirst({
        where: {
          id: request.params.id,
          deletedAt: null,
          OR: [{ userId }, { userId: "default" }]
        },
      });

      if (!group) {
        return ResponseUtil.notFound(reply, "分组不存在");
      }

      if (group.isDefault || group.userId === "default") {
        return ResponseUtil.badRequest(reply, "默认分组不能编辑");
      }

      const updated = await prisma.audioGroup.update({
        where: { id: request.params.id },
        data: {
          name: body.name,
          description: body.description || null,
          icon: body.icon,
        },
      });

      return ResponseUtil.success(reply, updated, "更新成功");
    }
  );

  fastify.delete<{ Params: { id: string } }>(
    "/groups/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["audio"],
        summary: "删除音频分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const group = await prisma.audioGroup.findFirst({
        where: {
          id: request.params.id,
          deletedAt: null,
          OR: [{ userId }, { userId: "default" }]
        },
      });

      if (!group) {
        return ResponseUtil.notFound(reply, "分组不存在");
      }

      if (group.isDefault || group.userId === "default") {
        return ResponseUtil.badRequest(reply, "默认分组不能删除");
      }

      const defaultGroup = await prisma.audioGroup.findFirst({
        where: { userId: "default", isDefault: true, deletedAt: null },
      });

      if (defaultGroup) {
        await prisma.audio.updateMany({
          where: { groupId: request.params.id },
          data: { groupId: defaultGroup.id },
        });
      } else {
        await prisma.audio.updateMany({
          where: { groupId: request.params.id },
          data: { groupId: null },
        });
      }

      await prisma.audioGroup.update({
        where: { id: request.params.id },
        data: { deletedAt: new Date() },
      });

      return ResponseUtil.success(reply, null, "删除成功");
    }
  );

  fastify.get<{ Params: { groupId: string } }>(
    "/groups/:groupId/audios",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["audio"],
        summary: "获取分组下的音频列表",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            pageSize: { type: "number", default: 20 },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { groupId: string } }>, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const query = request.query as any;
      const page = query.page ? Number(query.page) : 1;
      const pageSize = query.pageSize ? Number(query.pageSize) : 20;
      const skip = (page - 1) * pageSize;

      const group = await prisma.audioGroup.findFirst({
        where: { id: request.params.groupId, userId, deletedAt: null },
      });

      const isDefaultGroup = group?.isDefault;

      const where: any = { userId, deletedAt: null };
      if (isDefaultGroup) {
        where.OR = [{ groupId: request.params.groupId }, { groupId: null }];
      } else {
        where.groupId = request.params.groupId;
      }

      const [audios, total] = await Promise.all([
        prisma.audio.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.audio.count({ where }),
      ]);

      return ResponseUtil.paginated(reply, audios, total, page, pageSize);
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
      schema: {
        tags: ["audio"],
        summary: "获取用户音频列表",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            pageSize: { type: "number", default: 20 },
            groupId: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const query = request.query as any;
      const page = query.page ? Number(query.page) : 1;
      const pageSize = query.pageSize ? Number(query.pageSize) : 20;
      const groupId = query.groupId || null;
      const skip = (page - 1) * pageSize;

      const where: any = { userId, deletedAt: null };
      if (groupId) {
        where.groupId = groupId;
      }

      const [audios, total] = await Promise.all([
        prisma.audio.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: pageSize,
        }),
        prisma.audio.count({ where }),
      ]);

      return ResponseUtil.paginated(reply, audios, total, page, pageSize);
    }
  );

  fastify.post(
    "/upload",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["audio"],
        summary: "上传音频",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const query = request.query as any;
      let groupId = query.groupId || null;

      if (!groupId) {
        let defaultGroup = await prisma.audioGroup.findFirst({
          where: { userId: "default", isDefault: true, deletedAt: null },
        });
        if (!defaultGroup) {
          defaultGroup = await prisma.audioGroup.create({
            data: { name: "默认分组", isDefault: true, userId: "default" },
          });
        }
        groupId = defaultGroup.id;
      }

      const results: Array<{
        id: string;
        url: string;
        filename: string;
        size: number;
        mimetype: string;
        duration: number | undefined;
      }> = [];

      const files = request.files();
      for await (const data of files) {
        const ext = path.extname(data.filename);
        const uuid = uuidv4();
        const subdir = uuid.substring(0, 2);
        const filename = `${uuid}${ext}`;
        const subdirPath = path.join(uploadDir, subdir);
        await fs.promises.mkdir(subdirPath, { recursive: true });
        const filepath = path.join(subdirPath, filename);
        const buffer = await data.toBuffer();
        await fs.promises.writeFile(filepath, buffer);

        const audio = await prisma.audio.create({
          data: {
            filename: data.filename,
            url: `/uploads/${subdir}/${filename}`,
            size: buffer.length,
            mimetype: data.mimetype,
            userId,
            groupId,
          },
        });

        results.push({
          id: audio.id,
          url: audio.url,
          filename: audio.filename,
          size: audio.size,
          mimetype: audio.mimetype,
          duration: audio.duration || undefined,
        });
      }

      return ResponseUtil.success(reply, results, `成功上传 ${results.length} 个音频`);
    }
  );

  fastify.put<{ Params: { id: string } }>(
    "/:id/move",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["audio"],
        summary: "移动音频到分组",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            groupId: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const body = request.body as any;

      const audio = await prisma.audio.findFirst({
        where: { id: request.params.id, userId, deletedAt: null },
      });

      if (!audio) {
        return ResponseUtil.notFound(reply, "音频不存在");
      }

      const updated = await prisma.audio.update({
        where: { id: request.params.id },
        data: { groupId: body.groupId || null },
      });

      return ResponseUtil.success(reply, updated, "移动成功");
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
      schema: {
        tags: ["audio"],
        summary: "删除音频",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = (request.user as any)?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const audio = await prisma.audio.findFirst({
        where: { id: request.params.id, userId, deletedAt: null },
      });

      if (!audio) {
        return ResponseUtil.notFound(reply, "音频不存在");
      }

      await prisma.audio.update({
        where: { id: request.params.id },
        data: { deletedAt: new Date() },
      });

      await prisma.musicLyric.updateMany({
        where: { audioId: request.params.id },
        data: { audioId: null },
      });

      const filePath = path.join(uploadDir, audio.url.replace("/uploads/", ""));
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      return ResponseUtil.success(reply, null, "删除成功");
    }
  );
}
