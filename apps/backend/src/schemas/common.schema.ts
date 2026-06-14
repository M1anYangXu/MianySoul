import { z } from "zod";

/**
 * 分页查询 Schema
 */
export const paginationSchema = z.object({
  query: z.object({
    page: z.string().regex(/^\d+$/).transform(Number).default("1"),
    pageSize: z.string().regex(/^\d+$/).transform(Number).default("10"),
  }),
});

/**
 * ID 参数 Schema
 */
export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1, "ID不能为空"),
  }),
});

/**
 * 文件上传 Schema
 */
export const uploadSchema = z.object({
  file: z.any(),
});
