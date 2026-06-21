import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";
import { PasswordUtil } from "../utils/password.js";
import { config } from "../config/index.js";
import { loginSchema, registerSchema, refreshTokenSchema } from "../schemas/index.js";

/**
 * 认证路由
 */
export async function authRoutes(fastify: FastifyInstance): Promise<void> {
  // 登录 - 带限流
  fastify.post<{ Body: z.infer<typeof loginSchema>["body"] }>(
    "/login",
    {
      config: {
        rateLimit: {
          max: 5,
          timeWindow: "1 minute",
        },
      },
      schema: {
        tags: ["auth"],
        summary: "用户登录",
        body: {
          type: "object",
          required: ["username", "password"],
          properties: {
            username: { type: "string" },
            password: { type: "string" },
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              data: {
                type: "object",
                properties: {
                  accessToken: { type: "string" },
                  refreshToken: { type: "string" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      username: { type: "string" },
                      email: { type: "string" },
                      role: { type: "string" },
                    },
                  },
                },
              },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { username, password } = request.body;

      // 查找用户
      const user = await prisma.user.findUnique({
        where: { username },
      });

      if (!user || !user.isActive) {
        return ResponseUtil.error(reply, "用户名或密码错误", 1, 401);
      }

      // 验证密码
      const isValid = await PasswordUtil.compare(password, user.password);
      if (!isValid) {
        return ResponseUtil.error(reply, "用户名或密码错误", 1, 401);
      }

      // 生成 token
      const accessToken = fastify.jwt.sign({
        userId: user.id,
        username: user.username,
        role: user.role,
      });

      const refreshToken = fastify.jwt.sign(
        {
          userId: user.id,
          username: user.username,
          role: user.role,
          type: "refresh",
        },
        { expiresIn: config.jwt.refreshExpiresIn }
      );

      return ResponseUtil.success(
        reply,
        {
          accessToken,
          refreshToken,
          user: {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
          },
        },
        "登录成功"
      );
    }
  );

  // 注册
  fastify.post<{ Body: z.infer<typeof registerSchema>["body"] }>(
    "/register",
    {
      schema: {
        tags: ["auth"],
        summary: "用户注册",
        body: {
          type: "object",
          required: ["username", "email", "password"],
          properties: {
            username: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { username, email, password } = request.body;

      // 检查用户名是否存在
      const existingUser = await prisma.user.findFirst({
        where: {
          OR: [{ username }, { email }],
        },
      });

      if (existingUser) {
        return ResponseUtil.error(reply, "用户名或邮箱已存在", 1, 400);
      }

      // 创建用户
      const hashedPassword = await PasswordUtil.hash(password);
      const user = await prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
          role: "user",
        },
      });

      return ResponseUtil.success(
        reply,
        {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        "注册成功"
      );
    }
  );

  // 刷新 Token
  fastify.post<{ Body: z.infer<typeof refreshTokenSchema>["body"] }>(
    "/refresh",
    {
      schema: {
        tags: ["auth"],
        summary: "刷新访问令牌",
        body: {
          type: "object",
          required: ["refreshToken"],
          properties: {
            refreshToken: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const { refreshToken } = request.body;

      try {
        const decoded = fastify.jwt.verify(refreshToken) as {
          userId: string;
          username: string;
          role: string;
        };

        const user = await prisma.user.findUnique({
          where: { id: decoded.userId },
        });

        if (!user || !user.isActive) {
          return ResponseUtil.unauthorized(reply, "用户不存在或已禁用");
        }

        const accessToken = fastify.jwt.sign({
          userId: user.id,
          username: user.username,
          role: user.role,
        });

        return ResponseUtil.success(reply, { accessToken }, "刷新成功");
      } catch {
        return ResponseUtil.unauthorized(reply, "刷新令牌无效或已过期");
      }
    }
  );

  // 获取当前用户信息
  fastify.get(
    "/me",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["auth"],
        summary: "获取当前用户信息",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              data: {
                type: "object",
                properties: {
                  id: { type: "string" },
                  username: { type: "string" },
                  email: { type: "string" },
                  role: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const user = await prisma.user.findUnique({
        where: { id: request.user!.id },
      });

      if (!user) {
        return ResponseUtil.notFound(reply, "用户不存在");
      }

      return ResponseUtil.success(reply, {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    }
  );

  // 登出
  fastify.post(
    "/logout",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["auth"],
        summary: "用户登出",
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      // JWT 无状态，客户端删除 token 即可
      return ResponseUtil.success(reply, null, "登出成功");
    }
  );

  // 更新当前用户信息
  fastify.put<{
    Body: { username?: string; email?: string; avatar?: string };
  }>(
    "/me",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["auth"],
        summary: "更新当前用户信息",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            username: { type: "string" },
            email: { type: "string" },
            avatar: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const { username, email, avatar } = request.body as {
        username?: string;
        email?: string;
        avatar?: string;
      };

      const updateData: Record<string, string> = {};
      if (username !== undefined) updateData.username = username;
      if (email !== undefined) updateData.email = email;
      if (avatar !== undefined) updateData.avatar = avatar;

      if (Object.keys(updateData).length === 0) {
        return ResponseUtil.error(reply, "没有需要更新的字段", 1, 400);
      }

      if (username || email) {
        const existing = await prisma.user.findFirst({
          where: {
            AND: [
              { id: { not: userId } },
              {
                OR: [username ? { username } : {}, email ? { email } : {}].filter(Boolean),
              },
            ],
          },
        });
        if (existing) {
          return ResponseUtil.error(reply, "用户名或邮箱已被使用", 1, 400);
        }
      }

      const user = await prisma.user.update({
        where: { id: userId },
        data: updateData,
      });

      return ResponseUtil.success(
        reply,
        {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          avatar: user.avatar,
        },
        "更新成功"
      );
    }
  );

  // 修改密码
  fastify.put<{
    Body: { oldPassword: string; newPassword: string };
  }>(
    "/change-password",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["auth"],
        summary: "修改密码",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          required: ["oldPassword", "newPassword"],
          properties: {
            oldPassword: { type: "string" },
            newPassword: { type: "string" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const userId = request.user!.id;
      const { oldPassword, newPassword } = request.body as {
        oldPassword: string;
        newPassword: string;
      };

      const user = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        return ResponseUtil.notFound(reply, "用户不存在");
      }

      const isValid = await PasswordUtil.compare(oldPassword, user.password);
      if (!isValid) {
        return ResponseUtil.error(reply, "当前密码错误", 1, 400);
      }

      const hashedPassword = await PasswordUtil.hash(newPassword);
      await prisma.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
      });

      return ResponseUtil.success(reply, null, "密码修改成功");
    }
  );
}
