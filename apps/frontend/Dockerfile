# 前端 Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制依赖文件
COPY package.json pnpm-lock.yaml* ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/frontend/package.json ./apps/frontend/

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY packages/shared ./packages/shared
COPY apps/frontend ./apps/frontend

# 构建 shared 包
RUN pnpm --filter @miany-soul/shared build

# 构建前端
RUN pnpm --filter @miany-soul/frontend build

# 生产镜像 - 使用 nginx
FROM nginx:alpine AS production

# 复制构建产物
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html

# 复制 nginx 配置
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动 nginx
CMD ["nginx", "-g", "daemon off;"]