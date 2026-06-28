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
}

interface SiteConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
  modules: ModuleConfigs;
}

const defaultModuleConfigs: ModuleConfigs = {
  article: {
    name: "文章管理",
    description: "创作和编辑文章内容",
  },
  memory: {
    name: "记忆管理",
    description: "记录生活中的每一个精彩瞬间",
  },
  gallery: {
    name: "图集管理",
    description: "上传和管理图片资源",
  },
  video: {
    name: "视频管理",
    description: "上传和管理视频内容",
  },
  music: {
    name: "歌词管理",
    description: "收藏和管理音乐歌词",
  },
  settings: {
    name: "系统配置",
    description: "配置网站的基本信息和外观设置",
  },
};

const defaultConfig: SiteConfig = {
  logo: "",
  title: "MianySoul",
  subtitle: "创作者的灵感空间",
  description: "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
  copyright: "© 2024 MianySoul",
  icp: "",
  modules: defaultModuleConfigs,
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
          if (request.user.role !== "admin") {
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
