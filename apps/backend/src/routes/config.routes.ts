import type { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../db/index.js";
import { ResponseUtil } from "../utils/response.js";

interface ModuleConfig {
  name: string;
  description: string;
}

interface ModuleConfigs {
  article: ModuleConfig;
  memory: ModuleConfig;
  gallery: ModuleConfig;
  video: ModuleConfig;
  music: ModuleConfig;
  settings: ModuleConfig;
  siteinfo: ModuleConfig;
  narrative: ModuleConfig;
  users: ModuleConfig;
}

interface PageConfig {
  title: string;
  subtitle: string;
}

interface PageConfigs {
  archive: PageConfig;
  categories: PageConfig;
  tags: PageConfig;
  lyrics: PageConfig;
  gallery: PageConfig;
  about: PageConfig;
  narrative: PageConfig;
  memory: PageConfig;
}

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
  startTime: string;
  modules: ModuleConfigs;
  pages: PageConfigs;
  homeWallpaperLight: string;
  homeWallpaperDark: string;
  lightThemeColor: string;
  darkThemeColor: string;
  amapKey: string;
}

const defaultModuleConfigs: ModuleConfigs = {
  article: {
    name: "漫想",
    description: "记录突发奇想、宇宙思考、社会发展等各种小思考",
  },
  memory: {
    name: "记忆",
    description: "记录生活中的每一个精彩瞬间",
  },
  gallery: {
    name: "图集",
    description: "上传和管理图片资源",
  },
  video: {
    name: "视频",
    description: "上传和管理视频内容",
  },
  narrative: {
    name: "叙述",
    description: "记录过去的故事，上传图片或视频并编写描述",
  },
  music: {
    name: "音乐",
    description: "收藏和管理音乐歌词",
  },
  settings: {
    name: "系统配置",
    description: "配置后台模块和前台页面信息",
  },
  siteinfo: {
    name: "网站信息",
    description: "配置网站基本信息和外观设置",
  },
  users: {
    name: "用户信息",
    description: "管理网站用户账号",
  },
};

const defaultPageConfigs: PageConfigs = {
  archive: {
    title: "归档",
    subtitle: "记录我的思考与感悟",
  },
  categories: {
    title: "分类",
    subtitle: "按分类浏览全部内容",
  },
  tags: {
    title: "标签云",
    subtitle: "探索文章的标签世界",
  },
  lyrics: {
    title: "歌词墙",
    subtitle: "那些打动我的旋律",
  },
  gallery: {
    title: "精选图集",
    subtitle: "记录生活中的美好瞬间",
  },
  narrative: {
    title: "往事叙述",
    subtitle: "每一张照片，都是一段故事的开始",
  },
  about: {
    title: "关于我",
    subtitle: "了解更多关于这个网站和我",
  },
  memory: {
    title: "记忆",
    subtitle: "记录生活中的每一个精彩瞬间",
  },
};

const defaultConfig: SiteConfig = {
  logo: "",
  title: "MianySoul",
  subtitle: "创作者的灵感空间",
  description: "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
  copyright: "© 2024 MianySoul",
  icp: "",
  startTime: "",
  modules: defaultModuleConfigs,
  pages: defaultPageConfigs,
  homeWallpaperLight: "",
  homeWallpaperDark: "",
  lightThemeColor: "#14b8a6",
  darkThemeColor: "#d946ef",
  amapKey: "",
};

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
      preHandler: [
        async (request, reply) => {
          if (!request.user) {
            return ResponseUtil.unauthorized(reply, "请先登录");
          }
          if ((request.user as any).role !== "admin") {
            return ResponseUtil.forbidden(reply, "需要管理员权限");
          }
        },
      ],
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
}
