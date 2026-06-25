# 🏃‍♂️ Miany Soul 项目启动指南

## 📋 问题诊断

**当前问题**: 前端能运行，但图片无法显示，报错 `ECONNREFUSED ::1:3000`
**原因**: 后端服务未启动！

---

## 🚀 完整启动步骤

### 第 1 步：准备 2 个终端窗口

#### 终端 1 - 启动后端

```bash
cd /home/devbox/project/miany-soul
pnpm --filter @miany-soul/backend dev
```

**预期输出**:

```
服务器启动成功
Port: 3000
Docs: http://localhost:3000/docs
```

#### 终端 2 - 启动前端

```bash
cd /home/devbox/project/miany-soul
pnpm --filter @miany-soul/frontend dev
```

**预期输出**:

```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

---

## 🔧 或者一键启动（同时运行前后端）

```bash
cd /home/devbox/project/miany-soul
pnpm dev
```

---

## 📱 访问地址

| 服务        | 地址                           |
| ----------- | ------------------------------ |
| 前端        | http://localhost:5173          |
| 后端API     | http://localhost:3000/api      |
| Swagger文档 | http://localhost:3000/api/docs |

---

## 🔑 默认登录信息

- **用户名**: `admin`
- **密码**: `admin123`

---

## ✅ 验证启动成功

### 检查后端是否运行

访问: http://localhost:3000/api/health
应该返回: `{"code":0,"data":"OK","message":"success"}`

### 检查前端是否运行

访问: http://localhost:5173
应该看到登录页面

---

## 📁 项目修复内容

### 已修复的配置

1. ✅ `apps/frontend/.env` - 修复了 `VITE_API_BASE_URL`
2. ✅ `apps/frontend/vite.config.ts` - 修复了代理配置（使用 `127.0.0.1`）
3. ✅ `apps/frontend/vite.config.js` - 同样修复
4. ✅ `apps/frontend/src/utils/request.ts` - 修复了baseURL
5. ✅ `apps/backend/src/index.ts` - 优化了静态文件服务
6. ✅ 各个页面的图片URL处理函数

---

## 🚨 如果还有问题

### 检查端口占用

```bash
# Linux/Mac
lsof -i :3000
lsof -i :5173

# Windows
netstat -ano | findstr :3000
```

### 重置项目

```bash
cd /home/devbox/project/miany-soul
# 清理 node_modules（如需要）
rm -rf node_modules apps/*/node_modules
pnpm install
```

---

## 📝 总结

**最关键的一步**: 确保后端在 3000 端口运行！这是当前的主要问题！
