import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
});

/**
 * 软删除中间件
 */
prisma.$use(async (params, next) => {
  // 查询时过滤已删除数据
  if (params.action === "findMany" || params.action === "findFirst") {
    if (params.model && !params.args?.where?.deletedAt) {
      params.args = params.args || {};
      params.args.where = params.args.where || {};
      params.args.where.deletedAt = null;
    }
  }

  // 统计时过滤已删除数据
  if (params.action === "count") {
    if (params.model && !params.args?.where?.deletedAt) {
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
    params.action = "updateMany";
    params.args = params.args || {};
    params.args.data = { deletedAt: new Date() };
  }

  return next(params);
});

export { prisma };
export default prisma;
