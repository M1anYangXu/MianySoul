# MianySoul 项目开发文档

> 本文档用于记录项目的技术栈、功能模块、开发进度、已知问题等关键信息，方便后续开发和跨设备协作。
> 最后更新：2026-07-07

---

## 一、项目概述

**项目名称：** MianySoul（棉羽灵魂）

**项目类型：** 全栈个人内容管理系统 / 个人主页

**项目结构：** Monorepo（pnpm workspace）

**核心定位：** 集文章、日记、梦境、图集、视频、回忆录、场景等多种内容形式于一体的个人管理后台。

---

## 二、技术栈

### 2.1 后端技术栈

| 技术                | 版本      | 说明                                    |
| ------------------- | --------- | --------------------------------------- |
| Node.js             | >= 18.0.0 | 运行环境                                |
| Fastify             | ^4.28.1   | Web 框架                                |
| TypeScript          | ^5.5.3    | 类型系统                                |
| Prisma              | ^5.15.1   | ORM 数据库工具                          |
| SQLite              | -         | 开发数据库（可切换为 PostgreSQL/MySQL） |
| @fastify/jwt        | ^8.0.0    | JWT 认证                                |
| @fastify/cors       | ^9.0.1    | 跨域处理                                |
| @fastify/helmet     | ^11.1.1   | 安全头                                  |
| @fastify/multipart  | ^8.3.0    | 文件上传                                |
| @fastify/rate-limit | ^9.1.0    | 限流                                    |
| @fastify/swagger    | ^8.14.0   | API 文档                                |
| bcryptjs            | ^2.4.3    | 密码加密                                |
| zod                 | ^3.23.8   | 参数校验                                |
| lru-cache           | ^10.2.2   | 缓存                                    |
| tsx                 | ^4.16.2   | 开发运行时                              |

### 2.2 前端技术栈

| 技术                        | 版本    | 说明                       |
| --------------------------- | ------- | -------------------------- |
| Vue                         | ^3.4.31 | 前端框架                   |
| Vue Router                  | ^4.4.0  | 路由                       |
| Pinia                       | ^2.1.7  | 状态管理                   |
| TypeScript                  | ^5.5.3  | 类型系统                   |
| Vite                        | ^5.3.3  | 构建工具                   |
| TailwindCSS                 | ^3.4.4  | CSS 框架                   |
| Naive UI                    | ^2.38.1 | UI 组件库                  |
| Axios                       | ^1.7.2  | HTTP 客户端                |
| yuque-rich-text             | ^1.0.2  | 语雀富文本编辑器           |
| @vueup/vue-quill            | ^1.5.5  | Quill 富文本编辑器（备用） |
| lucide-vue-next             | ^1.0.0  | 图标库                     |
| pinia-plugin-persistedstate | ^3.2.1  | 状态持久化                 |

### 2.3 工程化工具

| 工具         | 说明               |
| ------------ | ------------------ |
| pnpm         | 包管理器（v9.4.0） |
| ESLint       | 代码规范           |
| Prettier     | 代码格式化         |
| Husky        | Git hooks          |
| lint-staged  | 暂存区检查         |
| concurrently | 并发命令           |

---

## 三、Git 配置

### 3.1 用户信息

```bash
git config --global user.name '小绵羊'
git config --global user.email '1556855894@qq.com'
```

### 3.2 远程仓库

| 平台   | 仓库地址                                       | 默认分支 |
| ------ | ---------------------------------------------- | -------- |
| Gitee  | `git@gitee.com:Little-Mianyang/miany-soul.git` | main     |
| GitHub | `git@github.com:M1anYangXu/MianySoul.git`      | main     |

---

## 四、项目结构

```
miany-soul/
├── apps/
│   ├── backend/                 # 后端服务
│   │   ├── src/
│   │   │   ├── config/          # 配置
│   │   │   ├── db/              # 数据库
│   │   │   ├── middleware/      # 中间件
│   │   │   ├── plugins/         # Fastify 插件（auth, security, swagger）
│   │   │   ├── routes/          # 路由
│   │   │   ├── schemas/         # 数据校验 schema
│   │   │   ├── utils/           # 工具函数
│   │   │   └── index.ts         # 入口文件
│   │   ├── prisma/              # Prisma 配置
│   │   │   ├── schema.prisma    # 数据模型
│   │   │   ├── seed.ts          # 种子数据
│   │   │   └── dev.db           # SQLite 数据库文件
│   │   ├── uploads/             # 上传文件目录
│   │   └── package.json
│   │
│   ├── frontend/                # 前端应用
│   │   ├── src/
│   │   │   ├── components/      # 组件
│   │   │   ├── composables/     # 组合式函数
│   │   │   ├── layouts/         # 布局组件
│   │   │   ├── router/          # 路由
│   │   │   ├── stores/          # Pinia 状态
│   │   │   ├── utils/           # 工具函数
│   │   │   ├── views/           # 页面视图
│   │   │   └── main.ts          # 入口文件
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── package.json
│   │
│   └── shared/                  # 共享代码
│
├── .trae/                       # Trae 配置和文档
│   ├── rules/
│   └── PROJECT_GUIDE.md         # 本文档
│
├── package.json                 # 根 package
├── pnpm-workspace.yaml
└── README.md
```

---

## 五、数据库模型总览

| 模型               | 说明          |
| ------------------ | ------------- |
| User               | 用户          |
| Role               | 角色          |
| Config             | 系统配置      |
| Scene              | 场景          |
| MemoirCategory     | 回忆录分类    |
| MemoirEntry        | 回忆录条目    |
| Dream              | 梦境记录      |
| Diary              | 日记          |
| ImageGroup / Image | 图集/图片     |
| VideoGroup / Video | 视频分组/视频 |
| AudioGroup / Audio | 音频分组/音频 |
| ArticleCategory    | 文章分类      |
| ArticleTag         | 文章标签      |
| ArticleTagRelation | 文章-标签关联 |
| Article            | 文章          |

---

## 六、功能模块状态

| 模块     | 后端 API | 前端页面  | 状态                                                               |
| -------- | -------- | --------- | ------------------------------------------------------------------ |
| 用户认证 | ✅       | ✅ 登录页 | 基础完成                                                           |
| 系统配置 | ✅       | ✅        | 完成                                                               |
| 场景管理 | ✅       | ✅        | 完成                                                               |
| 图集管理 | ✅       | ✅        | 完成                                                               |
| 视频管理 | ✅       | ✅        | 完成                                                               |
| 回忆录   | ✅       | ✅        | 完成                                                               |
| 文章管理 | ✅       | ✅        | **基础功能可用**（分类、标签、写文章、保存），集成语雀富文本编辑器 |
| 日记管理 | ✅       | ⚠️        | 待完善                                                             |
| 梦境记录 | ✅       | ⚠️        | 待完善                                                             |
| 用户管理 | ✅       | ✅        | 基础完成                                                           |
| 文件上传 | ✅       | ✅        | 完成                                                               |
| 音乐管理 | ✅       | ✅        | **完成**（歌词管理、分类管理、前端歌词墙展示、音频播放）           |
| 音频管理 | ✅       | ✅        | **完成**（音频上传、分组管理、歌词关联、前端播放）                 |

> 说明：获取文章列表、分类、标签列表已测试基础可用，但细节待完善。歌词墙采用新颖的浮动卡片布局设计。

---

## 七、重要配置

### 7.1 后端配置

**配置文件：** `apps/backend/.env` 或环境变量

| 配置项          | 默认值                              | 说明             |
| --------------- | ----------------------------------- | ---------------- |
| NODE_ENV        | development                         | 运行环境         |
| PORT            | 3000                                | 服务端口         |
| DATABASE_URL    | file:./dev.db                       | 数据库连接       |
| JWT_SECRET      | default-secret-change-in-production | JWT 密钥         |
| JWT_EXPIRES_IN  | 2h                                  | Token 有效期     |
| CORS_ORIGIN     | http://localhost:5173               | 允许的跨域来源   |
| RATE_LIMIT_MAX  | 100                                 | 限流次数/窗口    |
| UPLOAD_MAX_SIZE | 104857600 (100MB)                   | 上传文件大小限制 |

### 7.2 前端配置

**配置文件：** `apps/frontend/.env`

| 配置项            | 值                    | 说明         |
| ----------------- | --------------------- | ------------ |
| VITE_API_BASE_URL | http://localhost:3000 | API 基础地址 |
| VITE_APP_TITLE    | MianySoul             | 应用标题     |

### 7.3 Vite 代理配置

**文件：** [vite.config.ts](file:///home/devbox/project/miany-soul/apps/frontend/vite.config.ts)

- 开发服务器端口：5173
- `/api` 代理到 `http://127.0.0.1:3000`
- `/uploads` 代理到 `http://127.0.0.1:3000`

> ⚠️ **重要：** 使用 `127.0.0.1` 而非 `localhost`，避免 IPv6 解析导致的连接失败问题。

---

## 八、当前开发状态

> **⚠️ 重要提醒：** 当前处于本地测试阶段，正在使用真实数据进行测试，**严禁执行数据库重置操作**！

| 项目     | 状态   | 说明                                                             |
| -------- | ------ | ---------------------------------------------------------------- |
| 测试阶段 | 进行中 | 使用真实数据本地测试，持续收集反馈                               |
| 数据库   | 保留   | **不要执行 `pnpm db:push`、`pnpm db:seed` 等可能覆盖数据的命令** |
| 文档更新 | 实时   | 每个开发任务完成后，需同步更新本指南文档                         |

**开发规范：**

1. 任何涉及数据库 schema 修改的操作，需先备份当前数据库文件 (`apps/backend/prisma/dev.db`)
2. 每个任务完成后，必须更新本指南文档的对应章节（如更新日志、功能状态等）
3. 测试数据包含真实内容，删除或修改需谨慎

---

## 九、开发指南

### 9.1 启动项目

```bash
# 安装依赖
pnpm install

# 数据库初始化
pnpm db:push
pnpm db:seed

# 启动开发环境（前后端同时启动）
pnpm dev
```

**单独启动：**

```bash
# 仅后端
pnpm --filter @miany-soul/backend dev

# 仅前端
pnpm --filter @miany-soul/frontend dev
```

### 9.2 数据库操作

```bash
# 推送 schema 到数据库
pnpm db:push

# 创建迁移
pnpm db:migrate

# 种子数据
pnpm db:seed

# 打开 Prisma Studio
pnpm db:studio
```

---

---

## 十一、API 接口总览

**基础路径：** `/api`

---

## 十二、关键文件速查

| 文件                                                                                               | 作用                         |
| -------------------------------------------------------------------------------------------------- | ---------------------------- |
| [schema.prisma](file:///home/devbox/project/miany-soul/apps/backend/prisma/schema.prisma)          | 数据库模型定义               |
| [index.ts](file:///home/devbox/project/miany-soul/apps/backend/src/index.ts)                       | 后端入口                     |
| [routes/index.ts](file:///home/devbox/project/miany-soul/apps/backend/src/routes/index.ts)         | 路由注册中心                 |
| [plugins/auth.ts](file:///home/devbox/project/miany-soul/apps/backend/src/plugins/auth.ts)         | JWT 认证插件                 |
| [plugins/security.ts](file:///home/devbox/project/miany-soul/apps/backend/src/plugins/security.ts) | 安全插件（CORS/Helmet/限流） |
| [utils/request.ts](file:///home/devbox/project/miany-soul/apps/frontend/src/utils/request.ts)      | 前端 HTTP 请求封装           |
| [router/index.ts](file:///home/devbox/project/miany-soul/apps/frontend/src/router/index.ts)        | 前端路由配置                 |
| [vite.config.ts](file:///home/devbox/project/miany-soul/apps/frontend/vite.config.ts)              | Vite 配置（含代理）          |
| [Article.vue](file:///home/devbox/project/miany-soul/apps/frontend/src/views/admin/Article.vue)    | 文章管理页面                 |

---

## 十三、开发规范

### 13.1 命名规范

- 后端路由：RESTful 风格，复数形式，如 `/articles`
- 数据库表：PascalCase 单数形式，如 `Article`
- 前端组件：PascalCase，如 `ArticleList.vue`
- 组合式函数：`use` 开头，如 `useMessage`

### 13.2 注意事项

1. **数据库迁移：** 修改 schema 后执行 `pnpm db:push` 或 `pnpm db:migrate`
2. **文件上传：** 上传文件存储在 `apps/backend/uploads/` 目录
3. **软删除：** 大部分模型使用 `deletedAt` 软删除
4. **JWT 认证：** 后端认证是宽松模式，token 无效不阻止请求，仅设置 `request.user = undefined`
5. **语雀编辑器：** 依赖外部 CDN 资源，首次加载较慢，注意白屏时间

---

## 十五、设计理念与技术选型原则

### 15.1 前端设计理念

**核心理念：前沿、华丽、不花哨**

在设计和实现前端界面时，应优先采用现代、前沿的技术和设计风格，注重视觉效果的同时保持功能的实用性和性能的优化。

#### 推荐技术和设计风格：

| 技术/风格                    | 说明                                   | 应用场景             |
| ---------------------------- | -------------------------------------- | -------------------- |
| **玻璃拟态 (Glassmorphism)** | `backdrop-filter: blur()` + 半透明背景 | 卡片、模态框、导航栏 |
| **Canvas 粒子动画**          | 使用 HTML5 Canvas API 绘制动态背景     | 登录页、首页背景     |
| **CSS 渐变**                 | 多色渐变、动态渐变                     | 按钮、背景、装饰元素 |
| **微交互动画**               | 悬停效果、过渡动画、状态反馈           | 按钮、输入框、卡片   |
| **光泽扫过效果**             | 白色渐变层滑入                         | 按钮悬停             |
| **深色模式**                 | 完整的暗色主题支持                     | 全局                 |

#### 设计原则：

1. **视觉层次分明**：通过阴影、深度、色彩对比度创造清晰的视觉层级
2. **动效克制优雅**：动画时长适中（300-500ms），避免过度动画
3. **响应式优先**：确保移动端和桌面端都有良好体验
4. **性能优先**：复杂动画使用 requestAnimationFrame，避免主线程阻塞

#### 登录页设计参考：

- 玻璃拟态卡片 + Canvas 粒子背景
- 渐变按钮 + 光泽扫过效果
- 输入框聚焦动画 + 图标反馈
- 多色模糊装饰元素营造氛围

### 15.2 后端技术原则

**核心理念：简洁、高效、可扩展**

后端开发注重代码质量、性能优化和架构设计。

#### 技术选型原则：

1. **现代框架优先**：使用 Fastify 替代 Express，利用其高性能和现代特性
2. **类型安全**：全面使用 TypeScript，严格的类型定义
3. **数据库设计**：使用 Prisma ORM，合理的模型关系设计
4. **API 设计**：RESTful 风格，统一的响应格式
5. **安全性**：JWT 认证、CORS、Helmet 安全头、限流
6. **代码组织**：模块化设计，清晰的目录结构

#### 最佳实践：

- 使用 `pnpm` 作为包管理器，支持 workspace
- 使用 `tsx` 进行开发时热重载
- 使用 `zod` 进行参数校验
- 使用 `bcryptjs` 进行密码加密
- 数据库使用软删除模式（`deletedAt` 字段）

### 15.3 开发优先级

1. **视觉效果**：优先考虑现代化、有吸引力的 UI 设计
2. **用户体验**：流畅的交互、清晰的反馈
3. **代码质量**：类型安全、模块化、可维护性
4. **性能优化**：减少不必要的渲染和请求

---

## 十六、更新日志

| 日期       | 更新内容                                                                                                                                                                        |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 2026-07-02 | 添加「当前开发状态」章节；强调本地测试阶段使用真实数据，禁止数据库重置；要求每个任务完成后实时更新文档                                                                          |
| 2026-07-02 | 联系我图标改为使用 Iconify 图标库；后台输入图标名称（如 mdi:github、ri:twitter-x-fill），可在 https://icon-sets.iconify.design 查找                                             |
| 2026-07-02 | 修复网站 logo 不显示系统配置问题；前台和后台布局组件现在会读取系统配置中的 logo 和 title，若未配置则显示默认的 "M" 图标和 "MianySoul" 名称                                      |
| 2026-07-02 | 修复浏览器标签页标题和图标不跟随系统配置问题；路由守卫标题使用配置的 siteTitle；App.vue 动态设置 favicon 使用配置的 logo                                                        |
| 2026-07-02 | 语雀编辑器上传图片功能修复；编辑器图片上传按钮现在调用图集选择器，从图集中选择图片插入到文章中，与日记功能保持一致                                                              |
| 2026-07-02 | 修复图集选择器无法调用问题；后端新增 `/gallery/images` 接口返回所有图片及分组信息；前端修复响应数据解析，适配 group 字段结构                                                    |
| 2026-07-02 | 语雀编辑器图片按钮拦截；点击编辑器中的图片按钮时，拦截默认文件选择器行为，改为打开图集选择器，从图集中选择图片插入                                                              |
| 2026-07-03 | 修复语雀编辑器 uploadImage 不生效问题；删除全局点击监听器中的图片上传拦截逻辑，让编辑器正常调用 createUploadPromise 参数                                                        |
| 2026-07-03 | 修改语雀编辑器源码（lake-rich.ts）；删除硬编码的 uploadFileURL 和 crawlURL，强制编辑器使用 createUploadPromise 自定义上传方法                                                   |
| 2026-07-03 | 新增音频管理模块：创建 Audio 数据库模型；创建音频管理后端路由（上传、查询、删除）；修改音乐路由支持音频关联                                                                     |
| 2026-07-03 | 歌词管理页面添加音频上传/选择功能：编辑弹窗中添加音频选择按钮和音频选择器弹窗；支持搜索、选择、移除音频                                                                         |
| 2026-07-04 | 默认分组保护：音频、图片、视频的默认分组禁止编辑和删除；前端选中默认分组时隐藏编辑和删除按钮；后端接口添加保护检查                                                              |
| 2026-07-04 | 音频选择器优化：打开音频选择器时自动选中默认分组；修复默认分组未正确标记 isDefault 的问题；后端自动标记已有分组中的"默认分组"                                                   |
| 2026-07-04 | 图集选择器图标修复：修复分组图标为空时显示奇怪图标的问题；添加默认图标处理                                                                                                      |
| 2026-07-06 | 图片转AVIF格式：后端添加图片自动转换工具，上传时自动转换为AVIF；创建迁移脚本转换已有21张图片为AVIF；修复头像、背景图、场景图片URL更新问题                                       |
| 2026-07-06 | 视频转AV1格式：后端添加视频自动转换工具，上传时自动转换为AV1；创建迁移脚本转换已有2个视频为AV1；使用SVT-AV1编码器                                                               |
| 2026-07-06 | 移除不分组选项：图片和视频移动对话框中移除"不分组"选项                                                                                                                          |
| 2026-07-06 | 用户管理修复：后端 `/auth/me` 和登录接口添加 `tags`、`techStack`、`contactInfo` 字段返回，修复后端用户管理页面个人标签为空问题                                                  |
| 2026-07-07 | 修复图片选择器问题：添加分页参数显示更多图片；修复upload.routes.ts扩展名比较bug（path.extname返回带点扩展名）；图片选择器默认选中默认分组                                       |
| 2026-07-07 | 修复场景管理图片不显示：Scenes.vue中getFullImageUrl函数缺少/uploads前缀判断，导致图片URL被错误拼接                                                                              |
| 2026-07-07 | 修复歌词分类不同步：移动分组时只更新categoryId，category字符串字段未同步更新；修复数据库中已有数据的category字段；修复前端歌词墙显示重复内容                                    |
| 2026-07-07 | 系统配置页面优化："模块配置"改名为"后台配置"，"页面配置"改名为"前台配置"；统一使用3列网格布局提高空间利用率；添加音频管理、足迹管理、用户管理到后台配置；添加足迹页面到前台配置 |
| 2026-07-07 | AVIF压缩质量调整：从80调整为70，肉眼几乎无法分辨画质差异但压缩率更高；重新压缩数据库中29个AVIF文件，平均节省约23%体积                                                           |
| 2026-07-06 | 用户头像选择优化：头像上传改为从图集选择，移除文件管理器上传方式                                                                                                                |
| 2026-07-03 | 前端歌词卡片添加播放按钮：只有配置了音频的歌词卡片显示播放按钮；点击播放/暂停音频；支持深色模式样式                                                                             |
| 2026-06-30 | 场景管理：背景图片改为从图集选择（参考文章/日记），移除图片必填项；删除确认机制（场景/歌词管理）                                                                                |
| 2026-06-30 | 歌词墙前端页面：新颖浮动卡片布局、分类切换功能；歌词管理：分类字段、分类管理弹窗；关于页：修复联系图标、合并技术栈为"我的技术栈"；文章编辑器：左右分栏布局重设计                |
| 2026-06-28 | 添加设计理念章节；登录页重设计（玻璃拟态 + Canvas 粒子动画）；Dashboard 统计数据接入真实 API                                                                                    |
| 2026-06-26 | 后台管理界面视觉升级：玻璃拟态设计、渐变按钮、便当风格布局；统一顶部导航栏样式；优化路由配置                                                                                    |
| 2026-06-25 | 初始版本创建；修复文章保存外键约束问题；集成语雀富文本编辑器；修复草稿保存后不刷新问题；添加 Git 配置                                                                           |
