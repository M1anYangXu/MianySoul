import "dotenv/config";

export const config = {
  // 服务配置
  nodeEnv: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),

  // 数据库配置
  databaseUrl: process.env.DATABASE_URL || "file:./dev.db",

  // JWT 配置
  jwt: {
    secret: process.env.JWT_SECRET || "default-secret-change-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "2h",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "default-refresh-secret",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },

  // CORS 配置
  cors: {
    origin: (process.env.CORS_ORIGIN || "http://localhost:5173").split(","),
  },

  // 限流配置
  rateLimit: {
    max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10),
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10),
  },

  // 缓存配置
  cache: {
    maxItems: parseInt(process.env.CACHE_MAX_ITEMS || "1000", 10),
    maxAge: parseInt(process.env.CACHE_MAX_AGE || "3600000", 10),
  },

  // 文件上传配置
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || "10485760", 10),
    allowedTypes: (
      process.env.UPLOAD_ALLOWED_TYPES ||
      "image/jpeg,image/png,image/gif,image/webp,application/pdf"
    ).split(","),
  },

  // 日志配置
  logLevel: process.env.LOG_LEVEL || "info",
};
