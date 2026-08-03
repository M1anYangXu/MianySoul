import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";
import { config } from "../config/index.js";

/**
 * 安全配置插件
 */
const securityPlugin: FastifyPluginAsync = async (fastify) => {
  const allowedOrigins = config.cors.origin;

  // CORS 配置 - 允许 localhost 及配置中的域名访问
  await fastify.register(import("@fastify/cors"), {
    origin: (origin, callback) => {
      if (!origin) {
        callback(null, true);
        return;
      }

      // 检查是否匹配配置的域名（支持通配符 *.domain.com）
      const isAllowed = allowedOrigins.some((pattern) => {
        if (pattern === origin) return true;
        if (pattern.startsWith("*.")) {
          const suffix = pattern.slice(1); // .domain.com
          return origin.endsWith(suffix);
        }
        return false;
      });

      // 同时允许所有 localhost/127.0.0.1 端口
      if (
        origin.startsWith("http://localhost") ||
        origin.startsWith("http://127.0.0.1") ||
        origin.startsWith("https://localhost") ||
        origin.startsWith("https://127.0.0.1")
      ) {
        callback(null, true);
        return;
      }

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"), false);
      }
    },
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
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
          "https://cdn.jsdelivr.net",
        ],
        fontSrc: ["'self'", "data:", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:", "blob:", `http://localhost:${config.port}`, "https:"],
        connectSrc: ["'self'", "ws:", "wss:"],
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
