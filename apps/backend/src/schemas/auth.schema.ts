import { z } from "zod";

/**
 * 登录请求 Schema
 */
export const loginSchema = z.object({
  body: z.object({
    username: z.string().min(2, "用户名至少2个字符").max(50, "用户名最多50个字符"),
    password: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
  }),
});

/**
 * 注册请求 Schema
 */
export const registerSchema = z.object({
  body: z.object({
    username: z.string().min(2, "用户名至少2个字符").max(50, "用户名最多50个字符"),
    email: z.string().email("邮箱格式不正确"),
    password: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
  }),
});

/**
 * 刷新 Token Schema
 */
export const refreshTokenSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, "刷新令牌不能为空"),
  }),
});

/**
 * 更新用户信息 Schema
 */
export const updateUserSchema = z.object({
  body: z.object({
    email: z.string().email("邮箱格式不正确").optional(),
    avatar: z.string().url("头像必须是有效的URL").optional(),
  }),
});

/**
 * 修改密码 Schema
 */
export const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(6, "密码至少6个字符"),
    newPassword: z.string().min(6, "密码至少6个字符").max(100, "密码最多100个字符"),
  }),
});
