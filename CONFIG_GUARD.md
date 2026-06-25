# 🔐 配置保护说明

> ⚠️ **重要警告：** 以下配置文件和代码 **绝对不能被修改！** 这些配置是项目正常运行的基础，任何更改都可能导致整个项目无法工作。

---

## 🚫 禁止修改的关键配置清单

### 1. Vite 代理配置 (2个文件)

#### 文件: `apps/frontend/vite.config.ts`

```typescript
server: {
  port: 5173,
  host: "0.0.0.0",
  proxy: {
    "/api": {
      target: "http://127.0.0.1:3000",
      changeOrigin: true,
    },
    "/uploads": {
      target: "http://127.0.0.1:3000",
      changeOrigin: true,
    },
  },
}
```

⚠️ **禁止修改原因:** 这是前端访问后端API的核心配置

#### 文件: `apps/frontend/vite.config.js`

⚠️ 内容与 vite.config.ts 相同，**同样禁止修改**

---

### 2. 前端环境变量配置

#### 文件: `apps/frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:3000
VITE_APP_TITLE=MianySoul
```

⚠️ **禁止修改原因:** 这是前端API调用的基础URL配置

---

### 3. 后端服务配置

#### 文件: `apps/backend/src/index.ts`

```typescript
// 静态文件服务（上传文件）- 不能修改
await fastify.register(import("@fastify/static"), {
  root: path.join(process.cwd(), "uploads"),
  prefix: "/uploads/",
  prefixAvoidTrailingSlash: true,
  decorateReply: false,
});

// 监听端口配置
app.listen({ port: 3000, host: "0.0.0.0" });
```

⚠️ **禁止修改原因:** 这是后端静态文件服务和监听端口的核心配置

---

### 4. 后端环境变量配置

#### 文件: `apps/backend/.env`

```env
DATABASE_URL="file:./dev.db"
PORT=3000
```

⚠️ **禁止修改原因:** 数据库连接和服务端口配置

---

### 5. 请求工具配置

#### 文件: `apps/frontend/src/utils/request.ts`

```typescript
const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ? `${import.meta.env.VITE_API_BASE_URL}/api` : "/api",
  // ...
});
```

⚠️ **禁止修改原因:** API请求的基础配置

---

## 🛡️ 为什么这些配置不能修改

| 配置项       | 当前值                | 修改后的后果          |
| ------------ | --------------------- | --------------------- |
| 前端端口     | 5173                  | 前端无法访问          |
| 后端端口     | 3000                  | 前后端无法通信        |
| 代理目标     | http://127.0.0.1:3000 | 代理失败，API请求失败 |
| /uploads路由 | 后端静态文件          | 图片、视频无法显示    |
| 数据库URL    | dev.db                | 数据库连接失败        |

---

## ✅ 如果需要修改端口的正确方式

**如果你确实需要修改端口，请按以下步骤：**

1. 🔄 修改 **所有相关配置文件**，保持一致性
2. 🧪 测试所有功能正常运行
3. 📝 更新此 CONFIG_GUARD.md 文件

---

## 📋 项目端口配置清单

| 服务           | 端口 | 用途              |
| -------------- | ---- | ----------------- |
| 前端 (Vite)    | 5173 | 用户访问界面      |
| 后端 (Fastify) | 3000 | API服务和文件服务 |

---

## 🚨 给AI助手的明确指令

### 如果你是来协助开发的AI，请遵守以下规则：

1. **不要**修改上述任何配置文件
2. **不要**更改端口或代理设置
3. 如果需要涉及网络请求，请使用 **已经配置好** 的方式
4. 如果发现配置有问题，请先 **咨询项目维护者** 再做修改
5. 如果你是在做新功能开发，请在 **不破坏现有配置** 的前提下进行

---

## 📞 联系

如果有任何疑问，请联系项目维护者，不要擅自修改核心配置！

---

**最后更新时间**: 2026-06-25
**维护者**: Miany Soul Team
