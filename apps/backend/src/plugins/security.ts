import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { config } from "../config/index.js";

/**
 * 安全配置插件
 */
const securityPlugin: FastifyPluginAsync = async (fastify) => {
  // CORS 配置
  await fastify.register(import("@fastify/cors"), {
    origin: config.cors.origin,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  });

  // Helmet 安全头
  await fastify.register(import("@fastify/helmet"), {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:", "blob:", `http://localhost:${config.port}`],
      },
    },
  });

  // 全局限流
  await fastify.register(import("@fastify/rate-limit"), {
    max: config.rateLimit.max,
    timeWindow: config.rateLimit.windowMs,
    keyGenerator: (request) => {
      return request.ip;
    },
    errorResponseBuilder: () => ({
      code: 429,
      data: null,
      message: "请求过于频繁，请稍后再试",
    }),
  });
};

export default fp(securityPlugin, {
  name: "security",
});
