import type { FastifyInstance } from "fastify";
import { ResponseUtil } from "../utils/response.js";

/**
 * 健康检查路由
 */
export async function healthRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.get(
    "/health",
    {
      schema: {
        tags: ["system"],
        summary: "健康检查",
        response: {
          200: {
            type: "object",
            properties: {
              code: { type: "number" },
              data: {
                type: "object",
                properties: {
                  status: { type: "string" },
                  timestamp: { type: "string" },
                },
              },
              message: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return ResponseUtil.success(reply, {
        status: "ok",
        timestamp: new Date().toISOString(),
      });
    }
  );
}
