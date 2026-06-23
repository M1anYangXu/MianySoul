import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { prisma } from "../db/index.js";
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

export async function videoRoutes(fastify: FastifyInstance): Promise<void> {
  await fastify.register(import("@fastify/multipart"), {
    limits: {
      fileSize: 524288000,
    },
  });

  // ===== 分组管理 =====

  // 获取所有分组（包含视频数量）
  fastify.get(
    "/groups",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["video"],
        summary: "获取所有视频分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");
      let groups = await prisma.videoGroup.findMany({
        where: { userId, deletedAt: null },
        orderBy: [{ isDefault: "desc" }, { sortOrder: "asc" }, { createdAt: "desc" }],
        include: { _count: { select: { videos: { where: { deletedAt: null } } } } },
      });

      if (groups.length === 0) {
        const defaultGroup = await prisma.videoGroup.create({
          data: { name: "默认分组", isDefault: true, userId },
        });
        groups = [
          {
            ...defaultGroup,
            _count: { videos: 0 },
          },
        ];
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
        tags: ["video"],
        summary: "创建视频分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");
      const body = groupSchema.parse(request.body);

      const group = await prisma.videoGroup.create({
        data: {
          name: body.name,
          description: body.description,
          icon: body.icon,
          userId,
        },
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
        tags: ["video"],
        summary: "更新视频分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");
      const body = groupSchema.parse(request.body);

      const group = await prisma.videoGroup.findFirst({
        where: { id: request.params.id, userId, deletedAt: null },
      });

      if (!group) {
        return ResponseUtil.notFound(reply, "分组不存在");
      }

      const updated = await prisma.videoGroup.update({
        where: { id: request.params.id },
        data: {
          name: body.name,
          description: body.description,
          icon: body.icon,
        },
      });

      return ResponseUtil.success(reply, updated, "更新成功");
    }
  );

  // 删除分组
  fastify.delete<{ Params: { id: string } }>(
    "/groups/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["video"],
        summary: "删除视频分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const group = await prisma.videoGroup.findFirst({
        where: { id: request.params.id, userId, deletedAt: null },
      });

      if (!group) {
        return ResponseUtil.notFound(reply, "分组不存在");
      }

      if (group.isDefault) {
        return ResponseUtil.error(reply, "不能删除默认分组", 1, 400);
      }

      await prisma.videoGroup.update({
        where: { id: request.params.id },
        data: { deletedAt: new Date() },
      });

      await prisma.video.updateMany({
        where: { groupId: request.params.id },
        data: { groupId: null },
      });

      return ResponseUtil.success(reply, null, "删除成功");
    }
  );

  // ===== 视频管理 =====

  // 获取分组下的视频列表
  fastify.get<{ Params: { groupId: string } }>(
    "/groups/:groupId/videos",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["video"],
        summary: "获取分组下的视频列表",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { groupId: string } }>, reply: FastifyReply) => {
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const group = await prisma.videoGroup.findFirst({
        where: { id: request.params.groupId, userId, deletedAt: null },
      });

      if (!group) {
        return ResponseUtil.notFound(reply, "分组不存在");
      }

      const videos = await prisma.video.findMany({
        where: { groupId: request.params.groupId, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });

      return ResponseUtil.success(reply, videos);
    }
  );

  // 上传视频（可指定分组）
  fastify.post<{ Querystring: { groupId?: string } }>(
    "/upload",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["video"],
        summary: "上传视频到分组",
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
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");
      const groupId = request.query.groupId;
      const results: Array<{
        id: string;
        url: string;
        thumbnail: string | undefined;
        filename: string;
        size: number;
        mimetype: string;
        duration: number | undefined;
      }> = [];

      const files = request.files();
      for await (const data of files) {
        const ext = path.extname(data.filename);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(uploadDir, filename);
        const buffer = await data.toBuffer();
        await fs.promises.writeFile(filepath, buffer);

        const video = await prisma.video.create({
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
          id: video.id,
          url: video.url,
          thumbnail: video.thumbnail,
          filename: video.filename,
          size: video.size,
          mimetype: video.mimetype,
          duration: video.duration,
        });
      }

      return ResponseUtil.success(reply, results, `成功上传 ${results.length} 个视频`);
    }
  );

  // 移动视频到分组
  fastify.put<{ Params: { id: string } }>(
    "/videos/:id/move",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["video"],
        summary: "移动视频到分组",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");
      const body = z.object({ groupId: z.string().optional().nullable() }).parse(request.body);
      const video = await prisma.video.update({
        where: { id: request.params.id, userId },
        data: { groupId: body.groupId },
      });
      return ResponseUtil.success(reply, video, "移动成功");
    }
  );

  // 删除视频
  fastify.delete<{ Params: { id: string } }>(
    "/videos/:id",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["video"],
        summary: "删除视频",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const userId = request.user?.id;
      if (!userId) return ResponseUtil.unauthorized(reply, "请先登录");

      const video = await prisma.video.findFirst({
        where: { id: request.params.id, userId, deletedAt: null },
      });

      if (!video) {
        return ResponseUtil.notFound(reply, "视频不存在");
      }

      await prisma.video.update({
        where: { id: request.params.id },
        data: { deletedAt: new Date() },
      });

      const filePath = path.join(uploadDir, path.basename(video.url));
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
      }

      if (video.thumbnail) {
        const thumbnailPath = path.join(uploadDir, path.basename(video.thumbnail));
        if (fs.existsSync(thumbnailPath)) {
          await fs.promises.unlink(thumbnailPath);
        }
      }

      return ResponseUtil.success(reply, null, "删除成功");
    }
  );

  // 获取所有未分组的视频
  fastify.get(
    "/ungrouped",
    {
      preHandler: [
        async (req, reply) => {
          if (!req.user) return ResponseUtil.unauthorized(reply, "请先登录");
        },
      ],
      schema: {
        tags: ["video"],
        summary: "获取所有未分组的视频",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const videos = await prisma.video.findMany({
        where: { userId, groupId: null, deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
      return ResponseUtil.success(reply, videos);
    }
  );
}
