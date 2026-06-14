import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("开始初始化数据库...");

  // 创建默认管理员角色
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "超级管理员",
      permissions: JSON.stringify(["*"]),
    },
  });

  console.log("创建管理员角色:", adminRole.name);

  // 创建普通用户角色
  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      description: "普通用户",
      permissions: JSON.stringify(["read"]),
    },
  });

  console.log("创建普通用户角色:", userRole.name);

  // 创建默认管理员账号
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const adminUser = await prisma.user.upsert({
    where: { username: "admin" },
    update: {},
    create: {
      username: "admin",
      email: "admin@example.com",
      password: hashedPassword,
      role: "admin",
      isActive: true,
    },
  });

  console.log("创建管理员账号:", adminUser.username);

  console.log("数据库初始化完成！");
}

main()
  .catch((error) => {
    console.error("数据库初始化失败:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
