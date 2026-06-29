# MianySoul

TypeScript 全栈基础框架 - 零业务、高可拓展的底层基建。

## 技术栈

### 前端

- Vue 3 + Vite 5 + TypeScript
- Pinia (状态管理，支持持久化)
- Vue Router 4 (路由)
- Tailwind CSS (样式)
- Naive UI (组件库)
- Axios (HTTP 客户端)

### 后端

- Fastify + TypeScript
- Prisma ORM
- SQLite (开发) / PostgreSQL (生产)
- JWT 认证
- Swagger API 文档

### 工程化

- pnpm workspace (Monorepo)
- ESLint + Prettier
- husky + lint-staged
- Docker + docker-compose

## 项目结构

```
MianySoul/
├── apps/
│   ├── frontend/          # 前端项目
│   │   ├── src/
│   │   │   ├── layouts/   # 布局组件
│   │   │   ├── views/     # 页面组件
│   │   │   ├── router/    # 路由配置
│   │   │   ├── stores/    # 状态管理
│   │   │   ├── utils/     # 工具函数
│   │   │   └── composables/ # 组合式函数
│   │   └── public/        # 静态资源
│   └── backend/           # 后端 API 服务
│       ├── src/
│       │   ├── config/    # 配置
│       │   ├── db/        # 数据库
│       │   ├── plugins/   # Fastify 插件
│       │   ├── middleware/ # 中间件
│       │   ├── routes/    # 路由
│       │   ├── schemas/   # Schema 定义
│       │   └── utils/     # 工具函数
│       └── prisma/        # Prisma 配置
├── packages/
│   └── shared/            # 前后端共享代码
│       └── src/
│           ├── types/     # 类型定义
│           ├── constants/ # 常量
│           └── utils/     # 工具函数
├── .husky/                # Git hooks
├── pnpm-workspace.yaml    # Workspace 配置
├── docker-compose.yml     # Docker 编排
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 初始化数据库

```bash
# 复制环境变量配置
cp apps/backend/.env.example apps/backend/.env

# 推送数据库结构
pnpm db:push

# 初始化种子数据（创建默认管理员账号）
pnpm db:seed
```

默认管理员账号：`admin` / `admin123`

### 3. 启动开发服务

```bash
# 同时启动前后端
pnpm dev

# 或单独启动
pnpm --filter @miany-soul/backend dev
pnpm --filter @miany-soul/frontend dev
```

### 4. 访问服务

- 前端：http://localhost:5173
- 后端 API：http://localhost:3000/api
- Swagger 文档：http://localhost:3000/api/docs

## 常用命令

```bash
# 开发
pnpm dev                  # 同时启动前后端开发服务
pnpm build                # 构建前后端

# 数据库
pnpm db:push              # 推送数据库结构（开发）
pnpm db:migrate           # 创建迁移（生产）
pnpm db:seed              # 初始化种子数据
pnpm db:studio            # 打开 Prisma Studio

# 代码规范
pnpm lint                 # ESLint 检查
pnpm format               # Prettier 格式化

# Docker
docker-compose up -d      # 启动所有服务
docker-compose down       # 停止所有服务
docker-compose logs -f    # 查看日志
```

## API 接口

### 认证接口

| 接口                 | 方法 | 说明                  |
| -------------------- | ---- | --------------------- |
| `/api/auth/login`    | POST | 登录（限流 5次/分钟） |
| `/api/auth/register` | POST | 注册                  |
| `/api/auth/refresh`  | POST | 刷新 Token            |
| `/api/auth/me`       | GET  | 获取当前用户信息      |
| `/api/auth/logout`   | POST | 登出                  |

### 文件上传

| 接口                   | 方法 | 说明       |
| ---------------------- | ---- | ---------- |
| `/api/upload/single`   | POST | 单文件上传 |
| `/api/upload/multiple` | POST | 多文件上传 |

### 测试接口

| 接口                  | 方法 | 说明         |
| --------------------- | ---- | ------------ |
| `/api/test/protected` | GET  | 需登录       |
| `/api/test/admin`     | GET  | 需管理员权限 |
| `/api/health`         | GET  | 健康检查     |

## 环境变量

### 后端 (.env)

```env
NODE_ENV=development
PORT=3000
DATABASE_URL="file:./dev.db"
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
CORS_ORIGIN=http://localhost:5173
```

### 前端 (.env)

```env
VITE_API_BASE_URL=/api
VITE_APP_TITLE=MianySoul
```

## Docker 部署

### 构建镜像

```bash
docker-compose build
```

### 启动服务

```bash
docker-compose up -d
```

### 访问服务

- 前端：http://localhost
- 后端 API：http://localhost:3000/api

## Git 仓库配置

### GitHub

```bash
git remote add github https://github.com/your-username/MianySoul.git
git push -u github main
```

### Gitee

```bash
git remote add gitee https://gitee.com/your-username/MianySoul.git
git push -u gitee main
```

### 同时推送双仓库

```bash
git remote set-url --add --push github https://github.com/your-username/MianySoul.git
git remote set-url --add --push gitee https://gitee.com/your-username/MianySoul.git
git push
```

## 特性说明

### 后端特性

- **统一响应格式**：所有接口返回 `{ code, data, message }`
- **全局异常处理**：自动捕获并返回友好错误信息
- **JWT 认证**：支持访问 Token + 刷新 Token
- **角色权限**：预留 admin 超级管理员角色
- **登录限流**：5 次/分钟，防止暴力破解
- **全局限流**：单 IP 100 次/分钟
- **CORS 白名单**：只允许指定域名跨域访问
- **XSS 防护**：自动转义危险字符
- **敏感字段脱敏**：password、token 等自动替换为 \*\*\*
- **LRU 缓存**：内存缓存，预留 Redis 接口
- **软删除**：数据删除时标记 deletedAt
- **Swagger 文档**：自动生成 API 文档
- **请求日志**：分级输出请求信息

### 前端特性

- **三组路由**：前台、后台、实验场独立布局
- **路由守卫**：后台鉴权、401 跳登录
- **状态持久化**：用户登录态自动保存
- **Axios 封装**：请求拦截、错误处理、401 跳转
- **Vite 代理**：开发环境 API 转发
- **Tailwind CSS**：预留主题变量，支持玻璃拟态效果
- **Naive UI**：集成组件库
- **消息提示**：全局消息、确认弹窗
- **语雀富文本编辑器**：集成 yuque-rich-text，支持富文本编辑
- **玻璃拟态设计**：后台管理界面采用现代玻璃拟态风格
- **渐变按钮**：各管理模块使用差异化渐变色按钮
- **便当风格布局**：Dashboard 采用模块化卡片布局

### 前台页面

- **首页**：展示最近文章、图集、日记概览
- **归档**：按年份分组展示文章，悬浮显示分类和标签，支持封面图预览
- **分类**：展示所有分类，点击查看对应分类文章
- **标签云**：展示所有标签，点击查看对应标签文章
- **图集**：分组筛选图片，网格布局一行 4-5 张，预览弹窗支持点击关闭
- **歌词**：展示歌词作品
- **场景**：白噪音场景卡片，支持播放控制
- **关于我**：个人信息、统计数据、技术栈展示

## License

MIT
