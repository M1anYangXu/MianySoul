import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { prisma } from "../db/index.js";
import { config } from "../config/index.js";
import { ResponseUtil } from "../utils/response.js";

const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const groupSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().optional().nullable(),
  icon: z.string().default("📁"),
});

export async function galleryRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(import("@fastify/multipart"), {
    limits: {
      fileSize: config.upload.maxSize,
    },
  });

  // ===== 公开接口 =====

  // 获取最近的图片（公开接口）
  fastify.get(
    "/recent",
    {
      schema: {
        tags: ["gallery"],
        summary: "获取最近的图片（公开）",
        querystring: {
          type: "object",
          properties: {
            limit: { type: "number", default: 100 },
            groupId: { type: "string" },
          },
        },
      },
    },
    async (
      request: FastifyRequest<{
        Querystring: { limit?: number; groupId?: string };
      }>,
      reply: FastifyReply
    ) => {
      const limit = request.query.limit ? Number(request.query.limit) : 100;
      const groupId = request.query.groupId;
      try {
        const where: any = { deletedAt: null };
        if (groupId && groupId !== "all") {
          where.groupId = groupId;
        }
        const images = await prisma.image.findMany({
          where,
          orderBy: { createdAt: "desc" },
          take: limit,
          select: {
            id: true,
            url: true,
            filename: true,
            createdAt: true,
            groupId: true,
          },
        });
        return ResponseUtil.success(reply, images);
      } catch (error) {
        console.error("获取最近图片错误:", error);
        return ResponseUtil.error(reply, "获取图片失败");
      }
    }
  );

  // ===== 分组管理 =====

  // 获取所有分组（公开接口）
  fastify.get(
    "/groups",
    {
      schema: {
        tags: ["gallery"],
        summary: "获取所有图片分组（公开）",
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      let groups = await prisma.imageGroup.findMany({
        where: { deletedAt: null },
        orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        include: { _count: { select: { images: { where: { deletedAt: null } } } } },
      });
      if (groups.length === 0) {
        await prisma.imageGroup.create({
          data: { name: "默认分组", isDefault: true, userId: "default" },
        });
        groups = await prisma.imageGroup.findMany({
          where: { deletedAt: null },
          orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
          include: { _count: { select: { images: { where: { deletedAt: null } } } } },
        });
      }
      return ResponseUtil.success(reply, groups);
    }
  );

  // 创建分组
  fastify.post(
    "/groups",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "创建图片分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = groupSchema.parse(request.body);
      const group = await prisma.imageGroup.create({
        data: { ...body, userId },
      });
      return ResponseUtil.success(reply, group, "创建成功");
    }
  );

  // 更新分组
  fastify.put<{ Params: { id: string } }>(
    "/groups/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "更新图片分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = groupSchema.partial().parse(request.body);
      const group = await prisma.imageGroup.update({
        where: { id: request.params.id, userId },
        data: body,
      });
      return ResponseUtil.success(reply, group, "更新成功");
    }
  );

  // 删除分组（软删除）
  fastify.delete<{ Params: { id: string } }>(
    "/groups/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "删除图片分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const group = await prisma.imageGroup.findUnique({
        where: { id: request.params.id, userId },
      });
      if (!group) {
        return ResponseUtil.error(reply, "分组不存在", 1, 404);
      }
      if (group.isDefault) {
        return ResponseUtil.error(reply, "不能删除默认分组", 1, 400);
      }
      await prisma.imageGroup.update({
        where: { id: request.params.id, userId },
        data: { deletedAt: new Date() },
      });
      return ResponseUtil.success(reply, null, "删除成功");
    }
  );

  // 设置默认分组
  fastify.post<{ Params: { id: string } }>(
    "/groups/:id/set-default",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "设置默认分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      await prisma.imageGroup.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
      await prisma.imageGroup.update({
        where: { id: request.params.id, userId },
        data: { isDefault: true },
      });
      return ResponseUtil.success(reply, null, "设置成功");
    }
  );

  // ===== 图片管理 =====

  // 获取分组图片列表
  fastify.get<{ Params: { groupId: string } }>(
    "/groups/:groupId/images",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "获取分组图片列表",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { groupId: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const images = await prisma.image.findMany({
        where: { groupId: request.params.groupId, userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
      return ResponseUtil.success(reply, images);
    }
  );

  // 获取所有图片（不分组）
  fastify.get(
    "/images",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "获取所有图片",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const images = await prisma.image.findMany({
        where: { userId, deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: { group: { select: { id: true, name: true, icon: true } } },
      });
      return ResponseUtil.success(reply, images);
    }
  );

  // 上传图片（可指定分组）
  fastify.post<{ Querystring: { groupId?: string } }>(
    "/upload",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "上传图片到分组",
        security: [{ bearerAuth: [] }],
        querystring: {
          type: "object",
          properties: {
            groupId: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest<{ Querystring: { groupId?: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const groupId = request.query.groupId;
      const results: Array<{
        id: string;
        url: string;
        filename: string;
        size: number;
        mimetype: string;
      }> = [];

      const files = request.files();
      for await (const data of files) {
        if (!config.upload.allowedTypes.includes(data.mimetype)) {
          continue;
        }

        const ext = path.extname(data.filename);
        const uuid = uuidv4();
        const subdir = uuid.substring(0, 2);
        const filename = `${uuid}${ext}`;
        const subdirPath = path.join(uploadDir, subdir);
        await fs.promises.mkdir(subdirPath, { recursive: true });
        const filepath = path.join(subdirPath, filename);
        const buffer = await data.toBuffer();
        await fs.promises.writeFile(filepath, buffer);

        const image = await prisma.image.create({
          data: {
            filename: data.filename,
            url: `/uploads/${subdir}/${filename}`,
            size: buffer.length,
            mimetype: data.mimetype,
            groupId: groupId || null,
            userId,
          },
        });

        results.push({
          id: image.id,
          url: image.url,
          filename: image.filename,
          size: image.size,
          mimetype: image.mimetype,
        });
      }

      return ResponseUtil.success(reply, results, `成功上传 ${results.length} 张图片`);
    }
  );

  // 移动图片到分组
  fastify.put<{ Params: { id: string } }>(
    "/images/:id/move",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "移动图片到分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = z.object({ groupId: z.string().optional().nullable() }).parse(request.body);
      const image = await prisma.image.update({
        where: { id: request.params.id, userId },
        data: { groupId: body.groupId },
      });
      return ResponseUtil.success(reply, image, "移动成功");
    }
  );

  // 删除图片
  fastify.delete<{ Params: { id: string } }>(
    "/images/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "删除图片",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user!.id;
      const image = await prisma.image.findUnique({
        where: { id: request.params.id, userId },
      });
      if (!image) {
        return ResponseUtil.error(reply, "图片不存在", 1, 404);
      }
      await fs.promises
        .unlink(path.join(uploadDir, image.url.replace("/uploads/", "")))
        .catch(() => {});
      await prisma.image.update({
        where: { id: request.params.id, userId },
        data: { deletedAt: new Date() },
      });
      return ResponseUtil.success(reply, null, "删除成功");
    }
  );
}
