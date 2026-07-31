# MianySoul

棉羽灵魂 —— 一个专为创作者打造的全栈个人内容管理系统和个人主页。

集文章、日记、梦境、图集、视频、音频、歌词、叙述、场景于一体，支持丰富的媒体管理和内容创作。

---

## 技术栈

### 后端

- **Fastify** + TypeScript — 高性能 Web 框架
- **Prisma** ORM — 当前 SQLite，可切换 PostgreSQL
- **@fastify/jwt** — JWT 认证
- **@fastify/swagger** — API 文档自动生成
- **sharp** — 图片自动转换为 AVIF
- **fluent-ffmpeg** — 视频自动转换为 AV1
- **zod** — 参数校验
- **bcryptjs** — 密码加密
- **lru-cache** — 内存缓存

### 前端

- **Vue 3** + Vite 5 + TypeScript — 前端核心
- **Pinia** — 状态管理，支持持久化
- **Vue Router 4** — 路由
- **TailwindCSS** — CSS 框架，CSS 变量驱动的主题系统
- **Naive UI** — 后台管理组件库
- **ByteMD** — Markdown 编辑器（实时编辑/预览、GFM 支持）
- **@iconify/vue** — 图标库
- **lucide-vue-next** — 图标库
- **ECharts** — 图表库

### 工程化

- **pnpm** Monorepo workspace
- **ESLint** + **Prettier** 代码规范
- **Husky** + **lint-staged** Git hooks

---

## 项目结构

```
miany-soul/
├── apps/
│   ├── backend/          # 后端 API 服务（Fastify + Prisma）
│   │   ├── src/          # 入口、路由、插件、工具
│   │   ├── prisma/       # 数据模型 + 种子数据
│   │   └── uploads/      # 上传文件目录
│   └── frontend/         # 前端应用（Vue 3 + Vite）
│       ├── src/          # 组件、视图、路由、状态
│       ├── vite.config.ts
│       └── tailwind.config.js
├── packages/
│   └── shared/           # 前后端共享类型和工具
├── docker-compose.yml    # Docker 编排
├── pnpm-workspace.yaml
└── package.json
```

---

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

```bash
# 后端
cp apps/backend/.env.example apps/backend/.env
```

需要配置：
- `JWT_SECRET` — JWT 密钥（生产环境必须修改）
- `DATABASE_URL` — 数据库连接（默认 `file:./dev.db`）
- `CORS_ORIGIN` — 允许的跨域来源

### 3. 初始化数据库

```bash
pnpm db:push    # 推送 schema 到数据库
pnpm db:seed    # 创建默认分类
```

### 4. 启动开发环境

```bash
pnpm dev        # 前后端同时启动
```

或者分别启动：

```bash
pnpm --filter @miany-soul/backend dev
pnpm --filter @miany-soul/frontend dev
```

### 5. 访问服务

- 前台：http://localhost:5173
- 后台：http://localhost:5173/admin
- Swagger API 文档：http://localhost:3000/docs

> 后端启动时会自动探测可用端口（避免端口冲突），端口信息写入 `.port` 文件，前端代理会自动适配。

---

## 功能模块

### 前台页面

| 页面 | 说明 |
|------|------|
| 首页 | 最近文章、图集、日记概览 |
| 归档 | 按年份分组展示文章，支持封面预览 |
| 分类 | 按分类浏览文章 |
| 歌词墙 | 瀑布流卡片布局，分类切换，音频播放 |
| 图集 | 精选图集浏览 |
| 叙述 | 往事叙述列表，图文/视频故事 |
| 关于我 | 个人信息、技术栈展示 |
| 记忆 | 精彩瞬间记录（需登录） |

### 后台管理

| 模块 | 说明 |
|------|------|
| 门户首页 | Dashboard，统计数据、快捷入口 |
| 漫想 | 文章管理，ByteMD Markdown 编辑器，分类/标签 |
| 图集 | 图片分组管理，支持 AVIF 格式转换 |
| 视频 | 视频分组管理，支持 AV1 格式转换 |
| 音频 | 音频分组管理，关联歌词 |
| 音乐/歌词 | 歌词 CRUD，分类管理，音频关联 |
| 叙述 | 叙述条目管理，支持图片/视频多媒体 |
| 记忆 | 回忆录条目管理 |
| 用户 | 用户信息管理（标签、技术栈、联系方式） |
| 网站信息 | 站点基础配置（logo、标题、主题色等） |
| 系统配置 | 模块/页面名称自定义、数据库备份导入导出 |

---

## 核心特性

### 媒体自动转换

- 图片上传后自动转换为 **AVIF** 格式（质量 70，约节省 23% 体积）
- 视频上传后自动转换为 **AV1** 格式（SVT-AV1 编码器，高压缩比）
- 兼容主流浏览器的高性能媒体格式

### 配置系统

- 站点配置以 **JSON 格式存储在数据库**中，支持动态修改
- 模块名称、页面标题、主题色、首页壁纸等均可通过后台配置
- 前端自动缓存配置，减少请求次数

### 主题系统

- CSS 变量驱动的双主题（浅色青绿系 / 深色紫红系）
- 主题切换使用 View API **圆形展开过渡动画**
- 可通过设置页面自定义主题色

### 编辑器

- **ByteMD** Markdown 编辑器，支持实时编辑/预览分屏
- GFM 支持（表格、任务列表、代码块、脚注等）
- 深浅主题自适应
- 图片从图集选择（非直接上传）

### 安全

- JWT 宽松模式认证（Token 失效不阻塞请求）
- 全局响应脱敏（password/token 自动替换为 `***`）
- 速率限制（全局 100 次/分钟，登录 5 次/分钟）
- Helmet 安全响应头

### 数据备份

- 一键导出全量数据为 JSON
- 一键导入备份，含完整性校验
- 事务性操作，保证数据一致性

---

## 开发命令

```bash
# 开发
pnpm dev                    # 同时启动前后端

# 数据库
pnpm db:push                # 推送数据库结构
pnpm db:seed                # 初始化种子数据
pnpm db:studio              # 打开 Prisma Studio

# 构建
pnpm build                  # 构建全部

# 代码规范
pnpm lint                   # ESLint 检查
pnpm format                 # Prettier 格式化
```

---

## API 概览

| 模块 | 路径前缀 | 说明 |
|------|----------|------|
| 认证 | `/api/auth` | 登录、注册、用户信息、密码修改 |
| 上传 | `/api/upload` | 单文件/多文件上传 |
| 配置 | `/api/config` | 站点配置 CRUD、备份导入导出 |
| 场景 | `/api/scene` | 白噪音场景管理 |
| 图集 | `/api/gallery` | 图片/分组管理 |
| 视频 | `/api/video` | 视频/分组管理 |
| 文章 | `/api/article` | 文章 CRUD、分类管理 |
| 音乐 | `/api/music` | 歌词 CRUD、分类管理 |
| 音频 | `/api/audio` | 音频/分组管理 |
| 叙述 | `/api/narrative` | 叙述条目 + 多媒体 |
| 统计 | `/api/stats` | 统计数据（公开/管理） |
| 回忆录 | `/api/memoir` | 回忆录管理 |
| 日记 | `/api/diary` | 日记管理 |
| 梦境 | `/api/dream` | 梦境记录 |

所有接口返回统一格式：`{ code, data, message }`

---

## 环境变量

### 后端 (`.env`)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=file:./dev.db
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=2h
CORS_ORIGIN=http://localhost:5173
```

### 前端 (`.env`)

```env
VITE_API_BASE_URL=/api
VITE_APP_TITLE=MianySoul
```

---

## 生产部署

### Docker

`docker-compose.yml` 已配置后端和前端服务编排，需要补充对应的 `Dockerfile`：

- `apps/backend/Dockerfile` — 后端 Node.js 服务
- `apps/frontend/Dockerfile` — 前端静态文件服务（Nginx）

```bash
docker-compose up -d
```

### 注意事项

- 生产环境**必须**替换 `JWT_SECRET` 为强随机密钥
- 建议使用 PostgreSQL 替代 SQLite
- 后端监听 `0.0.0.0`，确保可被外部访问
- 媒体文件存储在 `apps/backend/uploads/`，需持久化

---

## License

MIT
