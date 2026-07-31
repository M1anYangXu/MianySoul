// ==================== 通用类型定义 ====================
export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  message: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==================== 用户相关类型 ====================
export interface UserInfo {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  tags?: string;
  techStack?: string;
  contactInfo?: string;
  createdAt: string;
  updatedAt: string;
}

// ==================== 常量定义 ====================
export const API_PREFIX = "/api";
export const TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user_info";

export const ResponseCode = {
  SUCCESS: 0,
  ERROR: 1,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 422,
  SERVER_ERROR: 500,
} as const;

// ==================== 工具函数 ====================
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().split("T")[0];
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString().replace("T", " ").slice(0, 19);
}

export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
}

export function omit<T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}

export function pick<T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

// ==================== 站点配置类型 ====================

export interface ModuleConfig {
  name: string;
  description: string;
}

export interface ModuleConfigs {
  article: ModuleConfig;
  memory: ModuleConfig;
  gallery: ModuleConfig;
  video: ModuleConfig;
  audio: ModuleConfig;
  music: ModuleConfig;
  settings: ModuleConfig;
  siteinfo: ModuleConfig;
  narrative: ModuleConfig;
  users: ModuleConfig;
  [key: string]: ModuleConfig;
}

export type ModuleKey = keyof ModuleConfigs;

export interface PageConfig {
  title: string;
  subtitle: string;
}

export interface PageConfigs {
  archive: PageConfig;
  categories: PageConfig;
  tags: PageConfig;
  lyrics: PageConfig;
  gallery: PageConfig;
  about: PageConfig;
  narrative: PageConfig;
  memory: PageConfig;
}

export type PageKey = keyof PageConfigs;

export interface SiteConfig {
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

export const defaultModuleConfigs: ModuleConfigs = {
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
  audio: {
    name: "音频",
    description: "上传和管理音频文件",
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

export const defaultPageConfigs: PageConfigs = {
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

export function getDefaultSiteConfig(): SiteConfig {
  return {
    logo: "",
    title: "MianySoul",
    subtitle: "创作者的灵感空间",
    description:
      "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
    copyright: "© 2024 MianySoul",
    icp: "",
    startTime: "",
    modules: { ...defaultModuleConfigs },
    pages: { ...defaultPageConfigs },
    homeWallpaperLight: "",
    homeWallpaperDark: "",
    lightThemeColor: "#14b8a6",
    darkThemeColor: "#d946ef",
    amapKey: "",
  };
}
