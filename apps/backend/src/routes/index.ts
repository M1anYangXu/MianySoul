import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { healthRoutes } from "./health.routes.js";
import { testRoutes } from "./test.routes.js";

/**
 * 注册所有路由
 */
export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // 健康检查
  await fastify.register(healthRoutes);

  // 认证路由
  await fastify.register(authRoutes, { prefix: "/auth" });

  // 文件上传
  await fastify.register(uploadRoutes, { prefix: "/upload" });

  // 测试路由
  await fastify.register(testRoutes, { prefix: "/test" });
}
