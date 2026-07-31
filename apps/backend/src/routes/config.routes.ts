import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";
import { authGuard, adminGuard } from "../middleware/index.js";
import {
  type SiteConfig,
  defaultModuleConfigs,
  defaultPageConfigs,
  getDefaultSiteConfig,
} from "@miany-soul/shared";

const defaultConfig = getDefaultSiteConfig();

const CONFIG_KEY = "site_config";

/**
 * 系统配置路由
 */
export async function configRoutes(fastify: FastifyInstance): Promise<void> {
  // 获取系统配置（公开接口）
  fastify.get(
    "/",
    {
      schema: {
        tags: ["config"],
        summary: "获取系统配置",
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const config = await prisma.config.findUnique({
        where: { key: CONFIG_KEY },
      });

      const siteConfig: SiteConfig = config
        ? { ...defaultConfig, ...JSON.parse(config.value) }
        : defaultConfig;

      siteConfig.modules = { ...defaultModuleConfigs, ...siteConfig.modules };
      siteConfig.pages = { ...defaultPageConfigs, ...siteConfig.pages };

      return ResponseUtil.success(reply, siteConfig);
    }
  );

  // 更新系统配置（需要管理员权限）
  fastify.put<{
    Body: Partial<SiteConfig>;
  }>(
    "/",
    {
      preHandler: [authGuard],
      schema: {
        tags: ["config"],
        summary: "更新系统配置",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            logo: { type: "string" },
            title: { type: "string" },
            subtitle: { type: "string" },
            description: { type: "string" },
            copyright: { type: "string" },
            icp: { type: "string" },
            startTime: { type: "string" },
            homeWallpaperLight: { type: "string" },
            homeWallpaperDark: { type: "string" },
            lightThemeColor: { type: "string" },
            darkThemeColor: { type: "string" },
            amapKey: { type: "string" },
            modules: {
              type: "object",
              properties: {
                article: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                memory: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                gallery: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                video: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                audio: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                music: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                settings: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                siteinfo: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                narrative: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
                users: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    description: { type: "string" },
                  },
                },
              },
            },
            pages: {
              type: "object",
              properties: {
                archive: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                categories: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                tags: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                lyrics: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                gallery: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                about: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                memory: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
                narrative: {
                  type: "object",
                  properties: {
                    title: { type: "string" },
                    subtitle: { type: "string" },
                  },
                },
              },
            },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const existing = await prisma.config.findUnique({
        where: { key: CONFIG_KEY },
      });

      const current: SiteConfig = existing
        ? { ...defaultConfig, ...JSON.parse(existing.value) }
        : defaultConfig;

      const body = request.body as Partial<SiteConfig>;
      const updated: SiteConfig = { ...current, ...body };

      if (body.modules) {
        updated.modules = {
          ...current.modules,
          ...body.modules,
        };
      }

      if (body.pages) {
        updated.pages = {
          ...current.pages,
          ...body.pages,
        };
      }

      await prisma.config.upsert({
        where: { key: CONFIG_KEY },
        update: { value: JSON.stringify(updated) },
        create: {
          key: CONFIG_KEY,
          value: JSON.stringify(updated),
          description: "站点基础配置",
        },
      });

      return ResponseUtil.success(reply, updated, "配置保存成功");
    }
  );

  fastify.get(
    "/backup/export",
    {
      preHandler: [adminGuard],
      schema: {
        tags: ["config"],
        summary: "导出数据库备份",
        security: [{ bearerAuth: [] }],
      },
    },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      try {
        const [
          users,
          configs,
          scenes,
          memoirCategories,
          memoirEntries,
          dreams,
          diaries,
          diaryImages,
          imageGroups,
          images,
          videoGroups,
          videos,
          articleCategories,
          articles,
          audioGroups,
          audios,
          musicCategories,
          musicLyrics,
          narrativeCategories,
          narratives,
          narrativeMedias,
        ] = await Promise.all([
          prisma.user.findMany(),
          prisma.config.findMany(),
          prisma.scene.findMany(),
          prisma.memoirCategory.findMany(),
          prisma.memoirEntry.findMany(),
          prisma.dream.findMany(),
          prisma.diary.findMany(),
          prisma.diaryImage.findMany(),
          prisma.imageGroup.findMany(),
          prisma.image.findMany(),
          prisma.videoGroup.findMany(),
          prisma.video.findMany(),
          prisma.articleCategory.findMany(),
          prisma.article.findMany(),
          prisma.audioGroup.findMany(),
          prisma.audio.findMany(),
          prisma.musicCategory.findMany(),
          prisma.musicLyric.findMany(),
          prisma.narrativeCategory.findMany(),
          prisma.narrative.findMany(),
          prisma.narrativeMedia.findMany(),
        ]);

        const backup = {
          version: "1.0",
          exportedAt: new Date().toISOString(),
          data: {
            users,
            configs,
            scenes,
            memoirCategories,
            memoirEntries,
            dreams,
            diaries,
            diaryImages,
            imageGroups,
            images,
            videoGroups,
            videos,
            articleCategories,
            articles,
            audioGroups,
            audios,
            musicCategories,
            musicLyrics,
            narrativeCategories,
            narratives,
            narrativeMedias,
          },
        };

        return ResponseUtil.success(reply, backup, "导出成功");
      } catch (err: any) {
        console.error("导出备份失败:", err);
        return ResponseUtil.serverError(reply, `导出备份失败: ${err?.message || String(err)}`);
      }
    }
  );

  fastify.post(
    "/backup/import",
    {
      preHandler: [adminGuard],
      schema: {
        tags: ["config"],
        summary: "导入数据库备份",
        security: [{ bearerAuth: [] }],
        body: {
          type: "object",
          properties: {
            backup: { type: "object" },
          },
        },
      },
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const backup = (request.body as any)?.backup;
        if (!backup || !backup.data) {
          return ResponseUtil.badRequest(reply, "无效的备份数据");
        }

        const data = backup.data;

        const collectionKeys = [
          "users", "configs", "scenes", "memoirCategories", "memoirEntries",
          "dreams", "diaries", "diaryImages", "imageGroups", "images",
          "videoGroups", "videos", "articleCategories",
          "audioGroups", "audios", "musicCategories", "musicLyrics",
          "articles", "narrativeCategories",
          "narratives", "narrativeMedias"
        ];

        const totalItems = collectionKeys.reduce((sum, key) => {
          return sum + (Array.isArray(data[key]) ? data[key].length : 0);
        }, 0);

        if (totalItems === 0) {
          return ResponseUtil.error(
            reply,
            "备份文件为空！拒绝导入空数据以防止数据丢失。请确认备份文件内容是否正确",
            1,
            400
          );
        }

        const validationErrors: string[] = [];

        const checkUnique = (label: string, items: any[], fields: string[]) => {
          if (!items?.length) return;
          for (const field of fields) {
            const seen = new Set<string>();
            for (const item of items) {
              const val = item[field];
              if (val !== undefined && val !== null) {
                if (seen.has(val)) {
                  validationErrors.push(`${label}: 字段 "${field}" 存在重复值 "${val}"`);
                }
                seen.add(val);
              }
            }
          }
        };

        checkUnique("用户", data.users, ["username", "email"]);
        checkUnique("配置", data.configs, ["key"]);
        checkUnique("场景", data.scenes, ["sceneId"]);
        checkUnique("文章分类", data.articleCategories, ["name"]);
        checkUnique("音乐分类", data.musicCategories, ["name"]);
        checkUnique("回忆录分类", data.memoirCategories, ["name"]);

        if (validationErrors.length > 0) {
          return ResponseUtil.error(
            reply,
            `备份数据校验失败：\n${validationErrors.join("\n")}`,
            1,
            400
          );
        }

        const upsertAll = async (
          items: any[] | undefined,
          model: any
        ) => {
          if (!items?.length) return;
          for (const item of items) {
            const { id, ...rest } = item;
            await model.upsert({
              where: { id },
              update: rest,
              create: { id, ...rest },
            });
          }
        };

        await prisma.$transaction(async (tx) => {
          await tx.narrativeMedia.deleteMany();
          await tx.narrative.deleteMany();
          await tx.narrativeCategory.deleteMany();
          await tx.musicLyric.deleteMany();
          await tx.musicCategory.deleteMany();
          await tx.audio.deleteMany();
          await tx.audioGroup.deleteMany();
          await tx.article.deleteMany();
          await tx.articleCategory.deleteMany();
          await tx.video.deleteMany();
          await tx.videoGroup.deleteMany();
          await tx.image.deleteMany();
          await tx.imageGroup.deleteMany();
          await tx.diaryImage.deleteMany();
          await tx.diary.deleteMany();
          await tx.dream.deleteMany();
          await tx.memoirEntry.deleteMany();
          await tx.memoirCategory.deleteMany();
          await tx.scene.deleteMany();
          await tx.config.deleteMany();
          await tx.user.deleteMany();

          await upsertAll(data.users, tx.user);
          await upsertAll(data.configs, tx.config);
          await upsertAll(data.scenes, tx.scene);
          await upsertAll(data.memoirCategories, tx.memoirCategory);
          await upsertAll(data.memoirEntries, tx.memoirEntry);
          await upsertAll(data.dreams, tx.dream);
          await upsertAll(data.diaries, tx.diary);
          await upsertAll(data.diaryImages, tx.diaryImage);
          await upsertAll(data.imageGroups, tx.imageGroup);
          await upsertAll(data.images, tx.image);
          await upsertAll(data.videoGroups, tx.videoGroup);
          await upsertAll(data.videos, tx.video);
          await upsertAll(data.articleCategories, tx.articleCategory);
          await upsertAll(data.audioGroups, tx.audioGroup);
          await upsertAll(data.audios, tx.audio);
          await upsertAll(data.musicCategories, tx.musicCategory);
          await upsertAll(data.musicLyrics, tx.musicLyric);
          await upsertAll(data.articles, tx.article);
          await upsertAll(data.narrativeCategories, tx.narrativeCategory);
          await upsertAll(data.narratives, tx.narrative);
          await upsertAll(data.narrativeMedias, tx.narrativeMedia);
        });

        return ResponseUtil.success(reply, null, "导入成功");
      } catch (err: any) {
        console.error("导入备份失败:", err);
        if (err?.code === "P2002") {
          const field = err?.meta?.target || "未知字段";
          return ResponseUtil.error(
            reply,
            `导入失败：字段 "${field}" 存在重复值，请检查备份数据`,
            1,
            400
          );
        }
        return ResponseUtil.serverError(
          reply,
          "导入备份失败，请检查备份文件格式是否正确"
        );
      }
    }
  );
}
