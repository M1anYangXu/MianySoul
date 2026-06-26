# MianySoul 项目规则

## 一、技术规范

### 1.1 代码风格

- 使用 TypeScript，严格模式
- 前端：Vue 3 Composition API + `<script setup>`
- 后端：Fastify + Prisma ORM
- 格式化：Prettier + ESLint

### 1.2 命名规范

- 文件：kebab-case（如 `user-management.ts`）
- 组件：PascalCase（如 `UserManagement.vue`）
- 组合式函数：`use` 前缀（如 `useAuth`）
- 路由：RESTful 风格，复数形式（如 `/articles`）

### 1.3 样式规范

- 优先使用 Tailwind CSS
- 玻璃拟态效果：`backdrop-blur-xl bg-white/70 border border-gray-200/30`
- 渐变按钮：使用 `from-*-500 to-*-500` 格式
- 禁止硬编码颜色值，使用 Tailwind 类

## 二、数据库规范

### 2.1 约束规则

- 分类选择必须有效，`categoryId` 不能为空字符串
- 外键约束：SQLite 强制执行外键关系
- 空字符串处理：可选字段（如 `excerpt`, `coverImage`）的空字符串应转换为 `null`

### 2.2 操作规范

- 修改 schema 后必须执行 `pnpm db:push` 或 `pnpm db:migrate`
- 使用软删除：`deletedAt` 字段标记删除状态
- authorId 应从 JWT 认证用户中获取

## 三、开发流程

### 3.1 启动项目

```bash
pnpm install
pnpm db:push
pnpm db:seed
pnpm dev
```

### 3.2 提交规范

- 提交信息使用中文，简洁明了
- 格式：`[模块] 描述`（如 `[前端] 更新登录页面样式`）
- 每次提交只包含一个逻辑改动

### 3.3 Git 工作流

- Gitee：推送至 `master` 分支
- GitHub：推送至 `main` 分支
- 使用 SSH 连接

## 四、安全规范

### 4.1 认证安全

- JWT Token 有效期：2 小时
- 登录限流：5 次/分钟
- 全局限流：单 IP 100 次/分钟

### 4.2 数据安全

- 敏感字段脱敏：password、token 等自动替换为 `***`
- XSS 防护：自动转义危险字符
- CORS 白名单：只允许指定域名跨域

### 4.3 文件上传

- 最大文件大小：100MB
- 上传目录：`apps/backend/uploads/`
- 文件类型校验：仅允许图片和视频格式

## 五、部署规范

### 5.1 开发环境

- 前端端口：5173
- 后端端口：3000
- 数据库：SQLite（`dev.db`）

### 5.2 生产环境

- 数据库：PostgreSQL
- JWT_SECRET：必须在环境变量中设置
- 前端 API 地址：通过环境变量配置

## 六、注意事项

1. **语雀编辑器**：依赖外部 CDN 资源，首次加载较慢
2. **Vite 代理**：使用 `127.0.0.1` 而非 `localhost`，避免 IPv6 解析问题
3. **状态持久化**：Pinia 插件自动保存用户登录态
4. **路由守卫**：后台路由需要认证，401 自动跳转登录页
5. **全局异常处理**：后端统一捕获并返回友好错误信息
