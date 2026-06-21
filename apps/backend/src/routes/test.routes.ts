import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { ResponseUtil } from "../utils/response.js";
import { adminGuard } from "../middleware/index.js";

/**
 * 测试路由 - 用于验证权限
 */
export async function testRoutes(fastify: FastifyInstance): Promise<void> {
  // 需要登录的测试接口
  fastify.get(
    "/protected",
    {
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
        },
      ],
      schema: {
        tags: ["test"],
        summary: "需要登录的测试接口",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              data: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  user: {
                    type: "object",
                    properties: {
                      id: { type: "string" },
                      username: { type: "string" },
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
      return ResponseUtil.success(reply, {
        message: "这是一个受保护的接口",
        user: request.user,
      });
    }
  );

  // 需要管理员权限的测试接口
  fastify.get(
    "/admin",
    {
      preHandler: [adminGuard],
      schema: {
        tags: ["test"],
        summary: "需要管理员权限的测试接口",
        security: [{ bearerAuth: [] }],
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              data: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      return ResponseUtil.success(reply, {
        message: "这是管理员专属接口",
      });
    }
  );
}
