import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import type { User } from "@prisma/client";
import { config } from "../config/index.js";

declare module "fastify" {
  interface FastifyRequest {
    user?: Omit<User, "password" | "deletedAt">;
  }
}

export interface JwtPayload {
  userId: string;
  username: string;
  role: string;
  iat: number;
  exp: number;
}

/**
 * JWT 认证插件
 */
const authPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import("@fastify/jwt"), {
    secret: config.jwt.secret,
    sign: {
      expiresIn: config.jwt.expiresIn,
    },
  });

  // 添加认证装饰器（检查是否已存在）
  if (!fastify.hasRequestDecorator("user")) {
    fastify.decorateRequest("user", null);
  }

  // 认证中间件
  fastify.addHook("onRequest", async (request, _reply) => {
    // 跳过不需要认证的路由
    const publicPaths = [
      "/api/auth/login",
      "/api/auth/register",
      "/api/auth/refresh",
      "/api/docs",
      "/api/docs/json",
      "/api/docs/static",
      "/api/health",
      "/uploads",
    ];

    const isPublicPath = publicPaths.some((path) => request.url.startsWith(path));

    if (isPublicPath) {
      return;
    }

    // 检查 Authorization header
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return;
    }

    try {
      const token = authHeader.slice(7);
      const decoded = await request.jwtVerify<JwtPayload>(token);
      request.user = {
        id: decoded.userId,
        username: decoded.username,
        role: decoded.role,
        email: "",
        avatar: null,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    } catch {
      // Token 无效，但不阻止请求（让路由处理）
      request.user = undefined;
    }
  });
};

export default fp(authPlugin, {
  name: "auth",
});
