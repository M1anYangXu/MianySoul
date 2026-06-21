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

  // ===== 分组管理 =====

  // 获取所有分组（包含图片数量）
  fastify.get(
    "/groups",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["gallery"],
        summary: "获取所有图片分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      let groups = await prisma.imageGroup.findMany({
        where: { userId, deletedAt: null },
        orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        include: { _count: { select: { images: { where: { deletedAt: null } } } } },
      });
      if (groups.length === 0) {
        await prisma.imageGroup.create({
          data: { name: "默认分组", isDefault: true, userId },
        });
        groups = await prisma.imageGroup.findMany({
          where: { userId, deletedAt: null },
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
  fastify.post(
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
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const body = await request.body();
      const groupId = typeof body === "object" && body !== null ? (body as any).groupId : null;

      const files = request.files();
      const results: Array<{
        id: string;
        url: string;
        filename: string;
        size: number;
        mimetype: string;
      }> = [];

      for await (const data of files) {
        if (!config.upload.allowedTypes.includes(data.mimetype)) {
          continue;
        }

        const ext = path.extname(data.filename);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(uploadDir, filename);
        const buffer = await data.toBuffer();
        await fs.promises.writeFile(filepath, buffer);

        const image = await prisma.image.create({
          data: {
            filename: data.filename,
            url: `/uploads/${filename}`,
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
      await fs.promises.unlink(path.join(uploadDir, image.url.split("/").pop()!)).catch(() => {});
      await prisma.image.update({
        where: { id: request.params.id, userId },
        data: { deletedAt: new Date() },
      });
      return ResponseUtil.success(reply, null, "删除成功");
    }
  );
}
