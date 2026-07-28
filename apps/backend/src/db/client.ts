import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

const SOFT_DELETE_MODELS = new Set([
  "User",
  "Scene",
  "MemoirCategory",
  "MemoirEntry",
  "Dream",
  "Diary",
  "DiaryImage",
  "ImageGroup",
  "Image",
  "VideoGroup",
  "Video",
  "ArticleCategory",
  "Article",
  "AudioGroup",
  "Audio",
  "MusicCategory",
  "MusicLyric",
  "NarrativeCategory",
  "Narrative",
  "NarrativeMedia",
]);

/**
 * 软删除中间件
 */
prisma.$use(async (params, next) => {
  const modelHasSoftDelete = params.model && SOFT_DELETE_MODELS.has(params.model);

  if (modelHasSoftDelete) {
    // 查询时过滤已删除数据
    if (params.action === "findMany" || params.action === "findFirst") {
      if (!params.args?.where?.deletedAt) {
        params.args = params.args || {};
        params.args.where = params.args.where || {};
        params.args.where.deletedAt = null;
      }
    }

    // 统计时过滤已删除数据
    if (params.action === "count") {
      if (!params.args?.where?.deletedAt) {
        params.args = params.args || {};
        params.args.where = params.args.where || {};
        params.args.where.deletedAt = null;
      }
    }

    // 软删除
    if (params.action === "delete") {
      params.action = "update";
      params.args = params.args || {};
      params.args.data = { deletedAt: new Date() };
    }

    if (params.action === "deleteMany") {
      const hasWhere =
        params.args?.where && Object.keys(params.args.where).length > 0;

      if (!hasWhere) {
        // 全表 deleteMany 执行硬删除（如数据备份导入时的清空操作）
        // 不做任何转换，保持原始 deleteMany 行为
      } else {
        // 带条件的 deleteMany 执行软删除
        params.action = "updateMany";
        params.args = params.args || {};
        params.args.data = { deletedAt: new Date() };
      }
    }
  }

  return next(params);
});

export { prisma };
export default prisma;
