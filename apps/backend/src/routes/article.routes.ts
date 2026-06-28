import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/client.js";
import { ResponseUtil } from "../utils/response.js";

export async function articleRoutes(fastify: FastifyInstance): Promise<void> {
  // ==================== 文章分类 ====================

  // 获取所有分类
  fastify.get("/category", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const categories = await prisma.articleCategory.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
      return ResponseUtil.success(reply, categories);
    } catch (error) {
      return ResponseUtil.error(reply, "获取分类失败");
    }
  });

  // 创建分类
  fastify.post(
    "/category",
    async (request: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) => {
      const body = request.body;
      try {
        const category = await prisma.articleCategory.create({
          data: {
            name: body.name,
          },
        });
        return ResponseUtil.success(reply, category, "分类创建成功");
      } catch (error) {
        return ResponseUtil.error(reply, "创建分类失败");
      }
    }
  );

  // 删除分类（软删除）
  fastify.delete(
    "/category/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        await prisma.articleCategory.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
        return ResponseUtil.success(reply, null, "分类删除成功");
      } catch (error) {
        return ResponseUtil.error(reply, "删除分类失败");
      }
    }
  );

  // ==================== 文章标签 ====================

  // 获取所有标签
  fastify.get("/tag", async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const tags = await prisma.articleTag.findMany({
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
      });
      return ResponseUtil.success(reply, tags);
    } catch (error) {
      return ResponseUtil.error(reply, "获取标签失败");
    }
  });

  // 创建标签
  fastify.post(
    "/tag",
    async (request: FastifyRequest<{ Body: { name: string } }>, reply: FastifyReply) => {
      const body = request.body;
      try {
        const tag = await prisma.articleTag.create({
          data: {
            name: body.name,
          },
        });
        return ResponseUtil.success(reply, tag, "标签创建成功");
      } catch (error: any) {
        if (error.code === "P2002") {
          return ResponseUtil.error(reply, "标签名称已存在");
        }
        return ResponseUtil.error(reply, "创建标签失败");
      }
    }
  );

  // 删除标签（软删除）
  fastify.delete(
    "/tag/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        await prisma.articleTag.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
        return ResponseUtil.success(reply, null, "标签删除成功");
      } catch (error) {
        return ResponseUtil.error(reply, "删除标签失败");
      }
    }
  );

  // ==================== 文章 ====================

  // 获取文章列表
  fastify.get(
    "/",
    async (
      request: FastifyRequest<{
        Querystring: {
          page?: number;
          limit?: number;
          keyword?: string;
          categoryId?: string;
          status?: string;
        };
      }>,
      reply: FastifyReply
    ) => {
      const query = request.query;

      const page = query.page ? Number(query.page) : 1;
      const limit = query.limit ? Number(query.limit) : 10;
      const skip = (page - 1) * limit;

      try {
        const where: any = { deletedAt: null };

        if (query.keyword) {
          where.OR = [
            { title: { contains: query.keyword } },
            { content: { contains: query.keyword } },
          ];
        }

        if (query.categoryId) {
          where.categoryId = query.categoryId;
        }

        if (query.status) {
          where.status = query.status;
        }

        const [articles, total] = await Promise.all([
          prisma.article.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
              category: true,
              tags: { include: { tag: true } },
            },
          }),
          prisma.article.count({ where }),
        ]);

        const result = articles.map((article) => ({
          ...article,
          tags: article.tags.map((t) => t.tag),
        }));

        return ResponseUtil.success(reply, { list: result, total, page, limit });
      } catch (error) {
        console.error("获取文章列表错误:", error);
        return ResponseUtil.error(reply, "获取文章列表失败");
      }
    }
  );

  // 获取单个文章
  fastify.get(
    "/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        const article = await prisma.article.findUnique({
          where: { id, deletedAt: null },
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
        });

        if (!article) {
          return ResponseUtil.notFound(reply, "文章不存在");
        }

        await prisma.article.update({
          where: { id },
          data: { viewCount: { increment: 1 } },
        });

        return ResponseUtil.success(reply, {
          ...article,
          tags: article.tags.map((t) => t.tag),
        });
      } catch (error) {
        return ResponseUtil.error(reply, "获取文章失败");
      }
    }
  );

  // 创建文章
  fastify.post(
    "/",
    async (
      request: FastifyRequest<{
        Body: {
          title: string;
          content: string;
          excerpt?: string;
          categoryId?: string;
          coverImage?: string;
          status?: string;
          tagIds?: string[];
        };
      }>,
      reply: FastifyReply
    ) => {
      const body = request.body;

      try {
        const article = await prisma.article.create({
          data: {
            title: body.title,
            content: body.content,
            excerpt: body.excerpt || null,
            categoryId: body.categoryId || null,
            coverImage: body.coverImage || null,
            status: body.status || "draft",
            authorId: request.user?.id || "admin",
          },
        });

        if (body.tagIds && body.tagIds.length > 0) {
          await prisma.articleTagRelation.createMany({
            data: body.tagIds.map((tagId: string) => ({
              articleId: article.id,
              tagId,
            })),
          });
        }

        return ResponseUtil.success(reply, article, "文章创建成功");
      } catch (error) {
        return ResponseUtil.error(reply, "创建文章失败");
      }
    }
  );

  // 更新文章
  fastify.put(
    "/:id",
    async (
      request: FastifyRequest<{
        Params: { id: string };
        Body: {
          title?: string;
          content?: string;
          excerpt?: string;
          categoryId?: string;
          coverImage?: string;
          status?: string;
          tagIds?: string[];
        };
      }>,
      reply: FastifyReply
    ) => {
      const { id } = request.params;
      const body = request.body;

      try {
        // 检查文章是否存在
        const existingArticle = await prisma.article.findUnique({
          where: { id },
        });

        if (!existingArticle) {
          return ResponseUtil.notFound(reply, "文章不存在");
        }

        // 只更新有值的字段
        const updateData: any = {
          updatedAt: new Date(),
        };
        if (body.title !== undefined) updateData.title = body.title;
        if (body.content !== undefined) updateData.content = body.content;
        if (body.excerpt !== undefined) updateData.excerpt = body.excerpt || null;
        if (body.categoryId !== undefined) updateData.categoryId = body.categoryId || null;
        if (body.coverImage !== undefined) updateData.coverImage = body.coverImage || null;
        if (body.status !== undefined) updateData.status = body.status;

        await prisma.article.update({
          where: { id },
          data: updateData,
        });

        if (body.tagIds !== undefined) {
          await prisma.articleTagRelation.deleteMany({
            where: { articleId: id },
          });

          if (body.tagIds && body.tagIds.length > 0) {
            await prisma.articleTagRelation.createMany({
              data: body.tagIds.map((tagId: string) => ({
                articleId: id,
                tagId,
              })),
            });
          }
        }

        const updatedArticle = await prisma.article.findUnique({
          where: { id },
          include: {
            category: true,
            tags: { include: { tag: true } },
          },
        });

        return ResponseUtil.success(
          reply,
          {
            ...updatedArticle,
            tags: updatedArticle?.tags.map((t) => t.tag) || [],
          },
          "文章更新成功"
        );
      } catch (error) {
        console.error("更新文章错误:", error);
        return ResponseUtil.error(reply, "更新文章失败");
      }
    }
  );

  // 删除文章（软删除）
  fastify.delete(
    "/:id",
    async (request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
      const { id } = request.params;
      try {
        await prisma.article.update({
          where: { id },
          data: { deletedAt: new Date() },
        });
        return ResponseUtil.success(reply, null, "文章删除成功");
      } catch (error) {
        return ResponseUtil.error(reply, "删除文章失败");
      }
    }
  );
}
