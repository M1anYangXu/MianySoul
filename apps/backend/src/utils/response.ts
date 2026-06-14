import type { FastifyReply } from "fastify";
import { ResponseCode } from "@miany-soul/shared";

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

/**
 * 统一响应格式工具类
 */
export class ResponseUtil {
  /**
   * 成功响应
   */
  static success<T>(reply: FastifyReply, data: T, message = "操作成功"): FastifyReply {
    const response: ApiResponse<T> = {
      code: ResponseCode.SUCCESS,
      data,
      message,
    };
    return reply.status(200).send(response);
  }

  /**
   * 错误响应
   */
  static error(
    reply: FastifyReply,
    message: string,
    code = ResponseCode.ERROR,
    statusCode = 400
  ): FastifyReply {
    const response: ApiResponse<null> = {
      code,
      data: null,
      message,
    };
    return reply.status(statusCode).send(response);
  }

  /**
   * 未授权响应
   */
  static unauthorized(reply: FastifyReply, message = "未授权访问"): FastifyReply {
    return this.error(reply, message, ResponseCode.UNAUTHORIZED, 401);
  }

  /**
   * 禁止访问响应
   */
  static forbidden(reply: FastifyReply, message = "禁止访问"): FastifyReply {
    return this.error(reply, message, ResponseCode.FORBIDDEN, 403);
  }

  /**
   * 资源不存在响应
   */
  static notFound(reply: FastifyReply, message = "资源不存在"): FastifyReply {
    return this.error(reply, message, ResponseCode.NOT_FOUND, 404);
  }

  /**
   * 参数校验失败响应
   */
  static validationError(reply: FastifyReply, message = "参数校验失败"): FastifyReply {
    return this.error(reply, message, ResponseCode.VALIDATION_ERROR, 422);
  }

  /**
   * 服务器错误响应
   */
  static serverError(reply: FastifyReply, message = "服务器内部错误"): FastifyReply {
    return this.error(reply, message, ResponseCode.SERVER_ERROR, 500);
  }

  /**
   * 分页数据响应
   */
  static paginated<T>(
    reply: FastifyReply,
    list: T[],
    total: number,
    page: number,
    pageSize: number,
    message = "获取成功"
  ): FastifyReply {
    const totalPages = Math.ceil(total / pageSize);
    return this.success(
      reply,
      {
        list,
        total,
        page,
        pageSize,
        totalPages,
      },
      message
    );
  }
}
