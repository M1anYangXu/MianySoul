import type { FastifyInstance } from "fastify";
import { authRoutes } from "./auth.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { healthRoutes } from "./health.routes.js";
import { testRoutes } from "./test.routes.js";
import { configRoutes } from "./config.routes.js";
import { sceneRoutes } from "./scene.routes.js";
import { memoirRoutes } from "./memoir.routes.js";
import { dreamRoutes } from "./dream.routes.js";
import { diaryRoutes } from "./diary.routes.js";
import { galleryRoutes } from "./gallery.routes.js";
import { videoRoutes } from "./video.routes.js";
import { articleRoutes } from "./article.routes.js";
import { musicRoutes } from "./music.routes.js";
import { statsRoutes } from "./stats.routes.js";
import { activityRoutes } from "./activity.routes.js";
import { footprintRoutes } from "./footprint.routes.js";

/**
 * 注册所有路由
 */
export async function registerRoutes(fastify: FastifyInstance): Promise<void> {
  // 健康检查
  await fastify.register(healthRoutes);

  // 认证路由
  await fastify.register(authRoutes, { prefix: "/auth" });

  // 文件上传
  await fastify.register(uploadRoutes, { prefix: "/upload" });

  // 系统配置
  await fastify.register(configRoutes, { prefix: "/config" });

  // 场景管理
  await fastify.register(sceneRoutes, { prefix: "/scene" });

  // 回忆录
  await fastify.register(memoirRoutes, { prefix: "/memoir" });

  // 梦境记录
  await fastify.register(dreamRoutes, { prefix: "/dream" });

  // 日记
  await fastify.register(diaryRoutes, { prefix: "/diary" });

  // 图集管理
  await fastify.register(galleryRoutes, { prefix: "/gallery" });

  // 视频管理
  await fastify.register(videoRoutes, { prefix: "/video" });

  // 文章管理
  await fastify.register(articleRoutes, { prefix: "/article" });

  // 音乐歌词
  await fastify.register(musicRoutes, { prefix: "/music" });

  // 统计数据
  await fastify.register(statsRoutes, { prefix: "/stats" });

  // 活动记录
  await fastify.register(activityRoutes, { prefix: "/activity" });

  // 足迹管理
  await fastify.register(footprintRoutes, { prefix: "/footprint" });

  // 测试路由
  await fastify.register(testRoutes, { prefix: "/test" });
}
