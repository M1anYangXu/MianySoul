# MianySoul 项目指南

## 项目概述

MianySoul 是一个个人博客系统，包含文章管理、图集管理、日记管理等功能模块。采用 Vue 3 + Fastify + Prisma 全栈技术架构。

## 技术架构

### 前端 (Vue 3)

- **Vue 3 + Vite 5 + TypeScript**：现代前端开发框架
- **Pinia**：状态管理，支持持久化
- **Vue Router 4**：路由管理
- **Tailwind CSS**：原子化 CSS 框架
- **Axios**：HTTP 客户端，统一请求封装
- **yuque-rich-text**：语雀富文本编辑器

### 后端 (Fastify)

- **Fastify + TypeScript**：高性能 Node.js 框架
- **Prisma ORM**：数据库 ORM，支持 SQLite/PostgreSQL
- **JWT**：认证机制
- **Swagger**：API 文档自动生成

## 前端页面

### 前台页面

| 页面   | 路径                  | 功能                                   |
| ------ | --------------------- | -------------------------------------- |
| 首页   | `/`                   | 展示最近文章、图集、日记概览           |
| 归档   | `/archive`            | 按年份分组展示文章，悬浮显示分类和标签 |
| 分类   | `/archive/categories` | 展示所有分类，点击查看对应文章         |
| 标签云 | `/archive/tags`       | 展示所有标签，点击查看对应文章         |
| 图集   | `/gallery`            | 分组筛选图片，网格布局，预览弹窗       |
| 歌词   | `/lyrics`             | 展示歌词作品                           |
| 场景   | `/scenes`             | 白噪音场景卡片                         |
| 关于我 | `/about`              | 个人信息、统计数据、技术栈             |

### 后台页面

| 页面      | 路径              | 功能                            |
| --------- | ----------------- | ------------------------------- |
| Dashboard | `/admin`          | 数据概览、快捷入口              |
| 文章管理  | `/admin/article`  | 文章 CRUD、富文本编辑、封面选择 |
| 图集管理  | `/admin/gallery`  | 图片分组管理、上传删除          |
| 日记管理  | `/admin/diary`    | 日记 CRUD                       |
| 分类管理  | `/admin/category` | 分类 CRUD                       |
| 标签管理  | `/admin/tag`      | 标签 CRUD                       |

## 后端接口

### 认证接口

| 接口                 | 方法 | 说明                  |
| -------------------- | ---- | --------------------- |
| `/api/auth/login`    | POST | 登录（限流 5次/分钟） |
| `/api/auth/register` | POST | 注册                  |
| `/api/auth/refresh`  | POST | 刷新 Token            |
| `/api/auth/me`       | GET  | 获取当前用户信息      |
| `/api/auth/logout`   | POST | 登出                  |

### 文章接口

| 接口               | 方法   | 说明                           |
| ------------------ | ------ | ------------------------------ |
| `/api/article`     | GET    | 获取文章列表（支持分页、筛选） |
| `/api/article/:id` | GET    | 获取文章详情                   |
| `/api/article`     | POST   | 创建文章                       |
| `/api/article/:id` | PUT    | 更新文章                       |
| `/api/article/:id` | DELETE | 删除文章                       |

### 图集接口

| 接口                     | 方法   | 说明                         |
| ------------------------ | ------ | ---------------------------- |
| `/api/gallery/groups`    | GET    | 获取图片分组列表             |
| `/api/gallery/recent`    | GET    | 获取图片列表（支持分组筛选） |
| `/api/gallery/upload`    | POST   | 上传图片                     |
| `/api/gallery/group`     | POST   | 创建分组                     |
| `/api/gallery/group/:id` | PUT    | 更新分组                     |
| `/api/gallery/:id`       | DELETE | 删除图片                     |

## 开发指南

### 启动开发服务

```bash
# 安装依赖
pnpm install

# 初始化数据库
pnpm db:push
pnpm db:seed

# 启动前后端
pnpm dev
```

### 常用命令

```bash
# 数据库
pnpm db:push              # 推送数据库结构
pnpm db:migrate           # 创建迁移
pnpm db:seed              # 初始化种子数据
pnpm db:studio            # 打开 Prisma Studio

# 构建
pnpm build                # 构建前后端

# 代码规范
pnpm lint                 # ESLint 检查
pnpm format               # Prettier 格式化
```

### Git 提交规范

```bash
# 推送到 Gitee
git push gitee master

# 推送到 GitHub
git push github master:main
```

## 核心功能实现

### 1. 图集预览弹窗

使用 Vue 的 `<Teleport>` 组件将预览弹窗渲染到 `<body>` 元素，避免 CSS stacking context 问题：

```vue
<Teleport to="body">
  <div v-if="selectedImage" class="fixed inset-0 z-[100]">
    <!-- 背景遮罩层 -->
    <div class="absolute inset-0 bg-black/90" @click="closeImagePreview"></div>
    <!-- 关闭按钮 -->
    <button @click="closeImagePreview" class="absolute top-6 right-6">...</button>
    <!-- 图片 -->
    <img :src="selectedImage.url" @click="closeImagePreview" />
  </div>
</Teleport>
```

### 2. 文章封面选择

从图集管理中选择封面图片，与日记等模块保持一致：

```vue
<button @click="openImagePicker">从图集中选择</button>
<!-- 图片选择器弹窗 -->
<div v-if="showImagePicker">
  <div v-for="group in groups" @click="selectGroup(group.id)">{{ group.name }}</div>
  <div v-for="image in images" @click="selectImage(image)">
    <img :src="image.url" />
  </div>
</div>
```

### 3. 归档导航悬浮菜单

导航栏归档项悬浮显示分类和标签云两个选项：

```vue
<div class="relative group">
  <a href="/archive">归档</a>
  <div class="absolute top-full left-0 opacity-0 group-hover:opacity-100">
    <a href="/archive/categories">分类</a>
    <a href="/archive/tags">标签云</a>
  </div>
</div>
```

## 常见问题

### Q: 图片预览弹窗点击关闭按钮没反应？

A: 使用 `<Teleport to="body">` 将弹窗渲染到 body 元素，避免 CSS stacking context 问题。确保 z-index 高于导航栏（z-50）。

### Q: 文章发布显示失败但实际数据已更新？

A: 检查前端请求 payload，确保空字符串转换为 null（如 `categoryId: form.categoryId || null`），避免数据库约束错误。

### Q: 图集分组切换后图片不显示？

A: 后端 `/api/gallery/recent` 接口支持 `groupId` 参数筛选，前端切换分组时传入对应 groupId。

## License

MIT
