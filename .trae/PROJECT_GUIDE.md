# MianySoul 项目开发指南

> 本文档为 AI 助手和开发者提供技术参考：架构、模块映射、约定、注意事项等关键信息。

---

## 一、项目概述

**项目名称：** MianySoul（棉羽灵魂）

**项目定位：** 个人内容管理系统 + 个人主页，集文章、日记、梦境、图集、视频、音频、歌词、叙述、场景于一体的全栈应用。

**项目结构：** Monorepo（pnpm workspace），包含 `apps/`（前后端）和 `packages/`（共享代码）。

---

## 二、技术栈

### 后端

| 技术 | 说明 |
|------|------|
| Node.js ≥ 18 | 运行环境 |
| Fastify ^4.28 | Web 框架，高性能 |
| TypeScript ^5.5 | 类型系统 |
| Prisma ^5.15 | ORM，当前 SQLite，可切换 PostgreSQL |
| @fastify/jwt | JWT 认证（宽松模式） |
| @fastify/cors | CORS 跨域 |
| @fastify/helmet | 安全头 |
| @fastify/multipart | 文件上传 |
| @fastify/rate-limit | 限流 |
| @fastify/swagger | API 文档自动生成 |
| bcryptjs | 密码加密 |
| sharp | 图片自动转 AVIF |
| fluent-ffmpeg | 视频自动转 AV1 |
| zod | 参数校验 |
| lru-cache | 内存缓存 |
| uuid | ID 生成 |

### 前端

| 技术 | 说明 |
|------|------|
| Vue 3 + Vite 5 + TypeScript | 前端核心 |
| Pinia | 状态管理，支持持久化 |
| Vue Router 4 | 路由 |
| TailwindCSS 3 | CSS 框架，CSS 变量驱动主题 |
| Naive UI | UI 组件库（后台管理页面） |
| ByteMD | Markdown 编辑器（文章） |
| @iconify/vue | 图标库（Material Design Icons 等） |
| lucide-vue-next | 图标库（Lucide） |
| Axios | HTTP 客户端 |
| turndown | HTML → Markdown 转换 |
| ECharts | 图表库 |
| @vueuse/core | Vue 组合式工具集 |

### 工程化

| 工具 | 说明 |
|------|------|
| pnpm 9.4 | 包管理器，workspace 模式 |
| ESLint + Prettier | 代码规范与格式化 |
| Husky + lint-staged | Git hooks |
| tsx | 后端开发时热重载 |

---

## 三、项目结构

```
miany-soul/
├── apps/
│   ├── backend/                    # 后端服务
│   │   ├── src/
│   │   │   ├── config/index.ts     # 环境变量配置
│   │   │   ├── db/                 # Prisma 数据库客户端
│   │   │   ├── middleware/         # 中间件（响应脱敏等）
│   │   │   ├── plugins/            # Fastify 插件（auth, security, swagger）
│   │   │   ├── routes/             # 路由（核心业务逻辑）
│   │   │   ├── utils/              # 工具函数（响应、日志、缓存、密码、路径）
│   │   │   └── index.ts            # 入口文件
│   │   ├── prisma/
│   │   │   ├── schema.prisma      # 数据模型定义
│   │   │   └── seed.ts            # 种子数据（创建默认分类）
│   │   └── uploads/               # 上传文件目录
│   │
│   └── frontend/                    # 前端应用
│       ├── src/
│       │   ├── components/        # 通用组件（ByteEditor, ScenePlayer, StickyBar 等）
│       │   ├── composables/        # 组合式函数（useModuleConfig, useThemeTransition 等）
│       │   ├── layouts/           # 布局组件（FrontendLayout, LayoutAdminMinimal 等）
│       │   ├── router/index.ts    # 路由配置
│       │   ├── stores/             # Pinia 状态（user, app）
│       │   ├── views/              # 页面视图（frontend/, admin/, error/）
│       │   ├── styles/main.css    # 全局样式 + Tailwind + 主题变量
│       │   └── main.ts            # 入口文件
│       ├── vite.config.ts         # Vite 配置（含动态端口代理）
│       └── tailwind.config.js     # Tailwind 配置（CSS 变量主题）
│
├── packages/
│   └── shared/                     # 前后端共享代码
│       └── src/index.ts           # 类型定义、常量、工具函数
│
├── .trae/                          # Trae 配置和本文档
├── docker-compose.yml              # Docker 编排（需补充 Dockerfile）
├── pnpm-workspace.yaml
└── package.json                    # 根 package
```

---

## 四、模块 → 路由 → 文件映射

### 后端路由映射

| 模块 | 路由前缀 | 路由文件 | 前端页面 |
|------|----------|----------|----------|
| 认证 | `/api/auth` | `auth.routes.ts` | `views/admin/Login.vue` |
| 文件上传 | `/api/upload` | `upload.routes.ts` | 各管理页面共用 |
| 系统配置 | `/api/config` | `config.routes.ts` | `views/admin/Settings.vue`, `SiteInfo.vue` |
| 场景 | `/api/scene` | `scene.routes.ts` | 前台 ScenePlayer 组件 |
| 回忆录 | `/api/memoir` | `memoir.routes.ts` | `views/admin/Memory.vue` |
| 梦境 | `/api/dream` | `dream.routes.ts` | - |
| 日记 | `/api/diary` | `diary.routes.ts` | - |
| 图集 | `/api/gallery` | `gallery.routes.ts` | `views/admin/Gallery.vue` / 前台 Gallery.vue |
| 视频 | `/api/video` | `video.routes.ts` | `views/admin/Video.vue` |
| 文章（漫想） | `/api/article` | `article.routes.ts` | `views/admin/Article.vue` / 前台 ArticleDetail.vue |
| 音乐/歌词 | `/api/music` | `music.routes.ts` | `views/admin/Music.vue` / 前台 Lyrics.vue |
| 音频 | `/api/audio` | `audio.routes.ts` | `views/admin/Audio.vue` |
| 叙述 | `/api/narrative` | `narrative.routes.ts` | `views/admin/Narrative.vue` / 前台 NarrativeView.vue |
| 统计 | `/api/stats` | `stats.routes.ts` | `views/admin/Dashboard.vue` |
| 健康检查 | `/api/health` | `health.routes.ts` | - |

### 前端路由映射

| 路径 | 布局 | 页面 | 说明 |
|------|------|------|------|
| `/` | FrontendLayout | Home.vue | 首页 |
| `/archive` | FrontendLayout | Archive.vue | 文章归档列表 |
| `/archive/:id` | FrontendLayout | ArticleDetail.vue | 文章详情 |
| `/archive/categories` | FrontendLayout | Category.vue | 分类浏览 |
| `/lyrics` | FrontendLayout | Lyrics.vue | 歌词墙 |
| `/gallery` | FrontendLayout | Gallery.vue | 精选图集 |
| `/about` | FrontendLayout | About.vue | 关于我 |
| `/memory` | FrontendLayout | MemoryView.vue | 记忆（需登录） |
| `/narrative` | FrontendLayout | NarrativeView.vue | 往事叙述列表 |
| `/narrative/:id` | FrontendLayout | NarrativeDetail.vue | 叙述详情 |
| `/admin` | LayoutAdminPortal | Dashboard.vue | 后台门户首页 |
| `/admin/gallery` | LayoutAdminMinimal | Gallery.vue | 图集管理 |
| `/admin/videos` | LayoutAdminMinimal | Video.vue | 视频管理 |
| `/admin/articles` | LayoutAdminMinimal | Article.vue | 漫想管理 |
| `/admin/users` | LayoutAdminMinimal | Users.vue | 用户管理 |
| `/admin/siteinfo` | LayoutAdminMinimal | SiteInfo.vue | 网站信息 |
| `/admin/settings` | LayoutAdminMinimal | Settings.vue | 系统配置 |
| `/admin/music` | LayoutAdminMinimal | Music.vue | 音乐管理 |
| `/admin/audio` | LayoutAdminMinimal | Audio.vue | 音频管理 |
| `/admin/memory` | LayoutAdminMinimal | Memory.vue | 记忆管理 |
| `/admin/narrative` | LayoutAdminMinimal | Narrative.vue | 叙述管理 |
| `/admin/login` | - | Login.vue | 登录页 |

---

## 五、数据库模型总览

### 模型关系

```
User ──→ Article (author)
Config (key-value 存储站点配置 JSON)
Scene (场景：白噪音/背景音)
├── MemoirCategory ──→ MemoirEntry（回忆录）
├── Dream（梦境记录）
├── Diary ──→ DiaryImage（日记 + 图片）
├── ImageGroup ──→ Image（图集，含 isDefault 保护）
├── VideoGroup ──→ Video（视频，含 isDefault 保护）
├── AudioGroup ──→ Audio（音频，含 isDefault 保护）
├── MusicCategory ──→ MusicLyric（歌词，含音频关联）
├── ArticleCategory ──→ Article（文章）
├── NarrativeCategory ──→ Narrative ──→ NarrativeMedia（叙述 + 多媒体）
```

### 关键模型字段

| 模型 | 关键字段 | 说明 |
|------|----------|------|
| User | id, username, email, password, avatar, tags, techStack, contactInfo | 用户信息 |
| Config | key (unique), value (JSON string) | 以 key-value 存储，站点配置用 `site_config` |
| Scene | sceneId (unique), name, icon, color, audioUrl | 白噪音场景 |
| ImageGroup / VideoGroup / AudioGroup | isDefault, isVisible, userId | 默认分组受保护不可删除 |
| MusicCategory / NarrativeCategory | isDefault, isPublic | 默认分类受保护，可设公开/私有 |
| MusicLyric | singer, songName, lyric, coverImage, audioId, categoryId, category | 歌词 + 可选音频 |
| Article | title, content, excerpt, categoryId, coverImage, status (draft/published), viewCount | 文章 |
| Narrative | title, description, type (image/video), categoryId, isActive | 叙述条目 |

### 通用字段约定

- 大部分模型含 `deletedAt` — 软删除，不物理删除数据
- 所有模型含 `createdAt` / `updatedAt`
- ID 使用 UUID 自动生成
- 所有分组/分类模型含 `isDefault` — 默认项不可删除、受保护

---

## 六、架构要点

### 6.1 配置系统（Config System）

站点配置以 JSON 格式存储在数据库 `Config` 表中（key = `site_config`），前端通过 `useModuleConfig()` 组合式函数读取。

**配置内容包含：**
- 站点基础信息：logo, title, subtitle, description, copyright, icp
- 模块配置：每个后台模块的 name 和 description（可在 Settings 页面动态修改）
- 页面配置：前台每个页面的 title 和 subtitle
- 主题色：lightThemeColor, darkThemeColor
- 首页壁纸：homeWallpaperLight, homeWallpaperDark
- 地图 Key：amapKey

**工作流程：**
1. 后端启动时从数据库读取 JSON 配置
2. 前端 `useModuleConfig.loadConfig()` 调用 `/api/config` GET 接口获取
3. 配置缓存在 composable 的 `configCache` ref 中
4. Settings 页面通过 PUT `/api/config` 保存配置
5. 后端合并默认值与用户值，确保字段完整

### 6.2 认证模型（宽松模式）

JWT 认证为**宽松模式**：
- Token 无效时**不阻止请求**，仅设置 `request.user = null`
- 路由级的 `preHandler` 检查 `request.user` 是否存在来决定是否放行
- 公开接口（文章列表、图集、歌词等）无需认证
- 管理接口需要登录
- 登录限流：5 次/分钟

### 6.3 动态端口

后端启动时自动探测可用端口（从配置端口开始），将实际端口写入 `apps/backend/.port` 文件。前端 Vite 代理配置读取此文件以动态适配端口。

```
后端 → .port 文件 → 前端 vite.config.ts 读取 → 代理到实际端口
```

### 6.4 响应格式

所有接口统一返回：
```typescript
interface ApiResponse<T = unknown> {
  code: number;    // 0=成功, 1=错误, 401=未授权, 404=未找到, 500=服务端错误
  data: T;         // 响应数据
  message: string; // 提示消息
}
```

分页响应：
```typescript
interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
```

### 6.5 响应脱敏

全局 `onSend` 钩子对 JSON 响应进行脱敏处理（password、token 等敏感字段替换为 `***`），备份导出接口 `/config/backup/export` 除外。

### 6.6 文件上传与媒体转换

- 上传文件存储在 `apps/backend/uploads/`
- 图片上传后自动用 `sharp` 转换为 AVIF 格式（质量 70，约节省 23% 体积）
- 视频上传后自动用 `fluent-ffmpeg`（SVT-AV1 编码器）转换为 AV1 格式
- 后端返回转换后的 URL

### 6.7 数据备份

`/api/config/backup/export` 导出全量数据为 JSON，`/api/config/backup/import` 导入备份。导入时执行唯一性校验、空数据防护、事务性删除+重建。

---

## 七、前端架构

### 7.1 布局体系

| 布局 | 适用场景 | 特点 |
|------|----------|------|
| FrontendLayout | 前台所有页面 | 固定顶部导航栏，滚动毛玻璃效果，场景播放器，回到顶部按钮 |
| LayoutAdminPortal | 后台门户首页 | 卡片式入口，每个模块一个卡片 |
| LayoutAdminMinimal | 后台各模块页面 | 极简顶栏，面包屑导航，用户菜单，返回按钮 |

### 7.2 状态管理

- `useUserStore` — 用户登录态、Token、个人信息，持久化到 localStorage
- `useAppStore` — 主题模式、侧边栏状态、场景播放状态
- `useModuleConfig` — 配置缓存，API 调用结果缓存

### 7.3 主题系统

- CSS 变量驱动（`--color-primary-50` ~ `--color-primary-900`）
- 浅色主题：青绿系（#14b8a6）
- 深色主题：紫红系（#d946ef）
- 主题切换使用 View API 圆形展开过渡动画
- 主题配置可通过 Settings 页面自定义 lightThemeColor / darkThemeColor

### 7.4 编辑器

ByteMD Markdown 编辑器，支持：
- 实时编辑 / 预览分屏
- GFM（表格、任务列表、代码块等）
- 图片上传（从图集选择，非直接上传）
- 深浅主题自适应
- 支持 Tab 缩进

---

## 八、约定与规范

### 命名规范

| 类型 | 风格 | 示例 |
|------|------|------|
| 后端路由文件 | kebab-case | `auth.routes.ts`, `music.routes.ts` |
| 后端路由 | RESTful 复数 | `/articles`, `/music/categories` |
| Prisma 模型 | PascalCase 单数 | `User`, `MusicLyric` |
| 前端组件 | PascalCase | `ByteEditor.vue`, `ScenePlayer.vue` |
| 前端组合式函数 | use 前缀 | `useModuleConfig`, `useThemeTransition` |
| Pinia Store | use 前缀 | `useUserStore`, `useAppStore` |
| 数据库表 | PascalCase | 与模型名一致 |

### 代码组织

- 后端每个路由文件独立导出一个 `fastify.register()` 的 async 函数
- 前端每个视图一个 `.vue` 文件，views 目录按 frontend/admin/error 分类
- 共享类型和工具函数在 `packages/shared/src/index.ts`

### 安全约定

- 敏感字段在响应中自动脱敏
- JWT 为宽松模式，路由自行判断 `request.user`
- 速率限制：全局 100 次/分钟，登录 5 次/分钟
- CORS 白名单控制跨域
- Helmet 设置安全响应头

---

## 九、关键注意事项（Gotchas）

### 开发环境

1. **`127.0.0.1` vs `localhost`：Vite 代理和后端端口监听都使用 `127.0.0.1` / `0.0.0.0`，避免 IPv6 解析问题**

2. **动态端口**：后端自动探测端口并写入 `.port` 文件，前端代理读取此文件。修改端口需重启两端。

3. **软删除**：几乎所有模型使用软删除（`deletedAt`），查询时**必须**加 `where: { deletedAt: null }` 条件。

4. **默认分组/分类保护**：`isDefault = true` 的分组/分类不可删除，删除接口会拒绝。

5. **配置是 JSON**：`Config.value` 是 JSON 字符串，读写时需 `JSON.parse` / `JSON.stringify`。

6. **认证是宽松模式**：不要假设 `request.user` 一定存在，管理接口**必须**在 `preHandler` 中检查。

7. **图片 URL**：存储的是相对路径（如 `/uploads/xxx.avif`），前端使用时拼接 API base URL。

8. **数据库重置**：本地开发使用真实数据，`pnpm db:push` 和 `pnpm db:seed` 可能覆盖数据，操作前必须备份 `apps/backend/prisma/dev.db`。

9. **种子脚本**：seed.ts 只创建默认分类，不创建用户或其他数据。

10. **编辑器图片**：ByteMD 编辑器的图片插入是通过图集选择器实现的，不走传统上传流程。

### 生产部署

11. **Dockerfile 缺失**：`docker-compose.yml` 引用了 `apps/backend/Dockerfile` 和 `apps/frontend/Dockerfile`，需补充这两个文件才能使用 Docker 部署。

12. **JWT_SECRET**：生产环境必须替换默认密钥。

---

## 十、开发命令

```bash
# 安装依赖
pnpm install

# 数据库操作
pnpm db:push          # 推送 schema 到数据库
pnpm db:seed          # 运行种子数据
pnpm db:studio        # 打开 Prisma Studio

# 启动开发环境
pnpm dev              # 前后端同时启动
pnpm --filter @miany-soul/backend dev   # 仅后端
pnpm --filter @miany-soul/frontend dev  # 仅前端

# 构建
pnpm build            # 构建全部
pnpm --filter @miany-soul/backend build   # 仅后端
pnpm --filter @miany-soul/frontend build  # 仅前端

# 代码规范
pnpm lint             # ESLint 检查
pnpm format           # Prettier 格式化
```

---

## 十一、关键文件速查

| 文件 | 作用 |
|------|------|
| `apps/backend/prisma/schema.prisma` | 数据库模型定义（22 个模型） |
| `apps/backend/src/index.ts` | 后端入口，插件注册、路由注册、端口探测 |
| `apps/backend/src/routes/index.ts` | 路由注册中心，所有路由在此汇总 |
| `apps/backend/src/plugins/auth.ts` | JWT 认证插件（宽松模式） |
| `apps/backend/src/plugins/security.ts` | 安全插件（CORS/Helmet/限流） |
| `apps/backend/src/plugins/swagger.ts` | Swagger 文档插件 |
| `apps/backend/src/config/index.ts` | 环境变量配置 |
| `apps/backend/src/utils/response.ts` | 统一响应格式工具类 |
| `apps/backend/src/utils/port-finder.ts` | 动态端口探测 |
| `apps/backend/src/routes/config.routes.ts` | 系统配置 CRUD + 备份导入导出 |
| `apps/backend/src/routes/music.routes.ts` | 音乐/歌词管理（最复杂的路由之一） |
| `apps/backend/src/routes/article.routes.ts` | 文章 CRUD |
| `apps/backend/src/routes/upload.routes.ts` | 文件上传 + AVIF/AV1 转换 |
| `apps/frontend/src/router/index.ts` | 前端路由 + 路由守卫 |
| `apps/frontend/src/stores/user.ts` | 用户状态管理 |
| `apps/frontend/src/stores/app.ts` | 应用全局状态 |
| `apps/frontend/src/composables/useModuleConfig.ts` | 配置系统前端读取 |
| `apps/frontend/src/composables/useThemeTransition.ts` | 主题切换动画 |
| `apps/frontend/src/layouts/FrontendLayout.vue` | 前台布局 |
| `apps/frontend/src/layouts/LayoutAdminMinimal.vue` | 后台布局 |
| `apps/frontend/src/styles/main.css` | 全局样式 + 主题变量 + 动画 |
| `apps/frontend/tailwind.config.js` | Tailwind 配置（CSS 变量主题） |
| `apps/frontend/vite.config.ts` | Vite 配置（动态端口代理） |
| `packages/shared/src/index.ts` | 前后端共享类型和常量 |

---

## 十二、API 路由前缀汇总

所有后端路由挂载在 `/api` 前缀下：

| 模块 | 方法 | 路径 |
|------|------|------|
| 健康 | GET | `/api/health` |
| 认证 | POST | `/api/auth/login` |
| | POST | `/api/auth/register` |
| | GET | `/api/auth/me` |
| | PUT | `/api/auth/me` |
| | PUT | `/api/auth/change-password` |
| | POST | `/api/auth/refresh` |
| | POST | `/api/auth/logout` |
| 上传 | POST | `/api/upload/single` |
| | POST | `/api/upload/multiple` |
| 配置 | GET | `/api/config` |
| | PUT | `/api/config` |
| | GET | `/api/config/backup/export` |
| | POST | `/api/config/backup/import` |
| 场景 | GET | `/api/scene` |
| | POST | `/api/scene` |
| | PUT | `/api/scene/:id` |
| | DELETE | `/api/scene/:id` |
| 图集 | GET | `/api/gallery` |
| | POST | `/api/gallery` |
| | PUT | `/api/gallery/:id` |
| | DELETE | `/api/gallery/:id` |
| 视频 | GET | `/api/video` |
| | POST | `/api/video` |
| | PUT | `/api/video/:id` |
| | DELETE | `/api/video/:id` |
| 文章 | GET | `/api/article` |
| | GET | `/api/article/:id` |
| | GET | `/api/article/recent` |
| | POST | `/api/article` |
| | PUT | `/api/article/:id` |
| | DELETE | `/api/article/:id` |
| 音乐/歌词 | GET | `/api/music` |
| | GET | `/api/music/:id` |
| | POST | `/api/music` |
| | PUT | `/api/music/:id` |
| | DELETE | `/api/music/:id` |
| 音频 | GET | `/api/audio` |
| | POST | `/api/audio` |
| | DELETE | `/api/audio/:id` |
| 叙述 | GET | `/api/narrative` |
| | GET | `/api/narrative/:id` |
| | POST | `/api/narrative` |
| | PUT | `/api/narrative/:id` |
| | DELETE | `/api/narrative/:id` |
| 统计 | GET | `/api/stats` |
| | GET | `/api/stats/public` |
| 回忆录 | GET | `/api/memoir` |
| | POST | `/api/memoir` |
| 梦境 | GET | `/api/dream` |
| | POST | `/api/dream` |
| 日记 | GET | `/api/diary` |
| | POST | `/api/diary` |
