import type { FastifyRequest, FastifyReply, HookHandlerDoneFunction } from "fastify";
import { ResponseUtil } from "../utils/response.js";

/**
 * 认证守卫中间件
 */
export async function authGuard(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  if (!request.user) {
    ResponseUtil.unauthorized(reply, "请先登录");
    return reply;
  }
}

/**
 * 角色权限守卫中间件
 */
export function roleGuard(...roles: string[]) {
  return async function (request: FastifyRequest, reply: FastifyReply): Promise<void> {
    if (!request.user) {
      ResponseUtil.unauthorized(reply, "请先登录");
      return reply;
    }

    if (!roles.includes(request.user.role)) {
      ResponseUtil.forbidden(reply, "权限不足");
      return reply;
    }
  };
}

/**
 * 管理员权限守卫
 */
export const adminGuard = roleGuard("admin");

/**
 * XSS 防护中间件
 */
export async function xssProtection(
  request: FastifyRequest,
  _reply: FastifyReply,
  done: HookHandlerDoneFunction
): Promise<void> {
  const sanitize = (obj: unknown): unknown => {
    if (typeof obj === "string") {
      return obj
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
    }
    if (Array.isArray(obj)) {
      return obj.map(sanitize);
    }
    if (obj && typeof obj === "object") {
      const sanitized: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitize(value);
      }
      return sanitized;
    }
    return obj;
  };

  request.body = sanitize(request.body);
  request.query = sanitize(request.query) as Record<string, string>;
  request.params = sanitize(request.params) as Record<string, string>;

  done();
}

/**
 * 敏感字段脱敏中间件
 */
const SENSITIVE_FIELDS = ["password", "secret", "key", "authorization"];
const EXCLUDED_TOKEN_FIELDS = new Set(["accesstoken", "refreshtoken"]);

export function sanitizeResponse(data: unknown): unknown {
  if (data === null || data === undefined) {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(sanitizeResponse);
  }

  if (typeof data === "object") {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const keyLower = key.toLowerCase();
      const isSensitive = SENSITIVE_FIELDS.some((field) => keyLower.includes(field));
      const isExcluded = EXCLUDED_TOKEN_FIELDS.has(keyLower);
      if (isSensitive && !isExcluded) {
        sanitized[key] = "***";
      } else {
        sanitized[key] = sanitizeResponse(value);
      }
    }
    return sanitized;
  }

  return data;
}
