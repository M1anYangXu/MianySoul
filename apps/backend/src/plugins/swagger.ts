import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";

/**
 * Swagger 文档插件
 */
const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
  await fastify.register(import("@fastify/swagger"), {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "MianySoul API",
        description: "TypeScript 全栈基础框架 API 文档",
        version: "1.0.0",
      },
      servers: [
        {
          url: "http://localhost:3000",
          description: "开发服务器",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      tags: [
        { name: "auth", description: "认证相关" },
        { name: "user", description: "用户相关" },
        { name: "upload", description: "文件上传" },
      ],
    },
  });

  await fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/api/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  });
};

export default fp(swaggerPlugin, {
  name: "swagger",
});
