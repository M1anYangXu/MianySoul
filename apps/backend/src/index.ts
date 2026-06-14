import "dotenv/config";
import path from "path";
import Fastify from "fastify";
import { config } from "./config/index.js";
import { logger } from "./utils/logger.js";
import { ResponseUtil, sanitizeResponse } from "./utils/index.js";
import { authPlugin, securityPlugin, swaggerPlugin } from "./plugins/index.js";
import { registerRoutes } from "./routes/index.js";

// 创建 Fastify 实例
const fastify = Fastify({
  logger: false, // 使用自定义 logger
  requestIdHeader: "x-request-id",
});

// 全局错误处理
fastify.setErrorHandler((error, request, reply) => {
  logger.error("请求错误", {
    requestId: request.id,
    method: request.method,
    url: request.url,
    error: error.message,
    stack: error.stack,
  });

  // 参数校验错误
  if (error.validation) {
    return ResponseUtil.validationError(reply, error.message);
  }

  // JWT 错误
  if (error.statusCode === 401) {
    return ResponseUtil.unauthorized(reply, "认证失败");
  }

  // 服务器错误
  return ResponseUtil.serverError(
    reply,
    config.nodeEnv === "development" ? error.message : "服务器内部错误"
  );
});

// 请求日志
fastify.addHook("onResponse", (request, reply) => {
  logger.request(request, reply, reply.elapsedTime);
});

// 响应脱敏
fastify.addHook("onSend", async (_request, reply, payload) => {
  // 只处理 JSON 响应
  if (
    typeof payload === "string" &&
    reply.getHeader("content-type")?.includes("application/json")
  ) {
    try {
      const data = JSON.parse(payload);
      const sanitized = sanitizeResponse(data);
      return JSON.stringify(sanitized);
    } catch {
      return payload;
    }
  }
  return payload;
});

// 注册插件
async function startServer() {
  try {
    // 安全插件
    await fastify.register(securityPlugin);

    // Swagger 文档
    await fastify.register(swaggerPlugin);

    // JWT 认证
    await fastify.register(authPlugin);

    // 静态文件服务（上传文件）
    await fastify.register(import("@fastify/static"), {
      root: path.join(process.cwd(), "uploads"),
      prefix: "/uploads/",
    });

    // 注册路由
    await fastify.register(registerRoutes, { prefix: "/api" });

    // 404 处理
    fastify.setNotFoundHandler((request, reply) => {
      logger.warn("404 Not Found", {
        requestId: request.id,
        method: request.method,
        url: request.url,
      });
      return ResponseUtil.notFound(reply, "接口不存在");
    });

    // 启动服务器
    await fastify.listen({ port: config.port, host: "127.0.0.1" });

    logger.info(`服务器启动成功`, {
      port: config.port,
      nodeEnv: config.nodeEnv,
      docsUrl: `http://localhost:${config.port}/api/docs`,
    });
  } catch (error) {
    logger.fatal("服务器启动失败", { error: String(error) });
    process.exit(1);
  }
}

// 优雅关闭
const gracefulShutdown = async (signal: string) => {
  logger.info(`收到 ${signal} 信号，正在关闭服务器...`);
  try {
    await fastify.close();
    logger.info("服务器已关闭");
    process.exit(0);
  } catch (error) {
    logger.error("关闭服务器失败", { error: String(error) });
    process.exit(1);
  }
};

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

// 启动
startServer();
