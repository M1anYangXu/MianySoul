import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { healthRoutes } from "./health.routes.js";
import { testRoutes } from "./test.routes.js";
import { configRoutes } from "./config.routes.js";
import { sceneRoutes } from "./scene.routes.js";

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

  // 系统配置
  await fastify.register(configRoutes, { prefix: "/config" });

  // 场景管理
  await fastify.register(sceneRoutes, { prefix: "/scene" });

  // 测试路由
  await fastify.register(testRoutes, { prefix: "/test" });
}
