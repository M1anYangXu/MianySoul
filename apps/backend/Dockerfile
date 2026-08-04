# 后端 Dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm tsup

# 复制依赖文件
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml ./
COPY packages/shared/package.json ./packages/shared/
COPY apps/backend/package.json ./apps/backend/

# 安装依赖
RUN pnpm install --no-frozen-lockfile

# 复制源代码
COPY packages/shared ./packages/shared
COPY apps/backend ./apps/backend

# 构建 shared 包
RUN pnpm --filter @miany-soul/shared build

# 生成 Prisma Client
RUN pnpm --filter @miany-soul/backend db:generate

# 构建后端
RUN pnpm --filter @miany-soul/backend build

# 生产镜像
FROM node:20-alpine AS production

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm tsup

# 复制必要文件
COPY --from=builder /app/package.json ./
COPY --from=builder /app/pnpm-lock.yaml* ./
COPY --from=builder /app/pnpm-workspace.yaml ./
COPY --from=builder /app/packages/shared/dist ./packages/shared/dist
COPY --from=builder /app/packages/shared/package.json ./packages/shared/
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/package.json ./apps/backend/
COPY --from=builder /app/apps/backend/node_modules/.prisma ./apps/backend/node_modules/.prisma
COPY --from=builder /app/apps/backend/prisma ./apps/backend/prisma

# 安装所有依赖（包括 devDependencies 用于 prisma）
RUN pnpm install --no-frozen-lockfile

# 创建 uploads 目录
RUN mkdir -p /app/apps/backend/uploads

# 推送数据库 schema
RUN pnpm --filter @miany-soul/backend db:push

# 设置环境变量
ENV NODE_ENV=production
ENV PORT=3000

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "apps/backend/dist/index.js"]