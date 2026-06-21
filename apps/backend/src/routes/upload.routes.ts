import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs";
import { prisma } from "../db/index.js";
import { config } from "../config/index.js";
import { ResponseUtil } from "../utils/response.js";

// 确保上传目录存在
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * 文件上传路由
 */
export async function uploadRoutes(fastify: FastifyInstance): Promise<void> {
  // 注册 multipart 插件
  await fastify.register(import("@fastify/multipart"), {
    limits: {
      fileSize: config.upload.maxSize,
    },
  });

  // 单文件上传
  fastify.post(
    "/single",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["upload"],
        summary: "单文件上传",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              data: {
                type: "object",
                properties: {
                  url: { type: "string" },
                  filename: { type: "string" },
                  size: { type: "number" },
                  mimetype: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await request.file();

      if (!data) {
        return ResponseUtil.error(reply, "请选择要上传的文件", 1, 400);
      }

      // 验证文件类型
      if (!config.upload.allowedTypes.includes(data.mimetype)) {
        return ResponseUtil.error(reply, `不支持的文件类型: ${data.mimetype}`, 1, 400);
      }

      // 生成文件名
      const ext = path.extname(data.filename);
      const filename = `${uuidv4()}${ext}`;
      const filepath = path.join(uploadDir, filename);

      // 保存文件
      const buffer = await data.toBuffer();
      await fs.promises.writeFile(filepath, buffer);

      const userId = request.user!.id;
      let defaultGroup = await prisma.imageGroup.findFirst({
        where: { userId, isDefault: true, deletedAt: null },
      });
      if (!defaultGroup) {
        defaultGroup = await prisma.imageGroup.create({
          data: { name: "默认分组", isDefault: true, userId },
        });
      }

      await prisma.image.create({
        data: {
          filename: data.filename,
          url: `/uploads/${filename}`,
          size: buffer.length,
          mimetype: data.mimetype,
          groupId: defaultGroup.id,
          userId,
        },
      });

      return ResponseUtil.success(
        reply,
        {
          url: `/uploads/${filename}`,
          filename: data.filename,
          size: buffer.length,
          mimetype: data.mimetype,
        },
        "上传成功"
      );
    }
  );

  // 获取已上传的图片列表
  fastify.get(
    "/images",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["upload"],
        summary: "获取已上传的图片列表",
        security: [{ bearerAuth: [] }],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const files = await fs.promises.readdir(uploadDir);
        const images = files
          .filter((file) => {
            const ext = path.extname(file).toLowerCase();
            return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"].includes(ext);
          })
          .map((file) => ({
            url: `/uploads/${file}`,
            filename: file,
          }));
        return ResponseUtil.success(reply, images);
      } catch (e) {
        return ResponseUtil.success(reply, []);
      }
    }
  );

  // 多文件上传
  fastify.post(
    "/multiple",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["upload"],
        summary: "多文件上传",
        security: [{ bearerAuth: [] }],
        consumes: ["multipart/form-data"],
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      let defaultGroup = await prisma.imageGroup.findFirst({
        where: { userId, isDefault: true, deletedAt: null },
      });
      if (!defaultGroup) {
        defaultGroup = await prisma.imageGroup.create({
          data: { name: "默认分组", isDefault: true, userId },
        });
      }

      const files = request.files();
      const results: Array<{
        url: string;
        filename: string;
        size: number;
        mimetype: string;
      }> = [];

      for await (const data of files) {
        // 验证文件类型
        if (!config.upload.allowedTypes.includes(data.mimetype)) {
          continue;
        }

        // 生成文件名
        const ext = path.extname(data.filename);
        const filename = `${uuidv4()}${ext}`;
        const filepath = path.join(uploadDir, filename);

        // 保存文件
        const buffer = await data.toBuffer();
        await fs.promises.writeFile(filepath, buffer);

        await prisma.image.create({
          data: {
            filename: data.filename,
            url: `/uploads/${filename}`,
            size: buffer.length,
            mimetype: data.mimetype,
            groupId: defaultGroup!.id,
            userId,
          },
        });

        results.push({
          url: `/uploads/${filename}`,
          filename: data.filename,
          size: buffer.length,
          mimetype: data.mimetype,
        });
      }

      return ResponseUtil.success(reply, results, `成功上传 ${results.length} 个文件`);
    }
  );
}
