/**
 * 重置用户密码脚本
 * 用法: node scripts/reset-password.js <用户名> <新密码>
 * 示例: node scripts/reset-password.js Miany xmy123
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const username = process.argv[2];
  const newPassword = process.argv[3];

  if (!username || !newPassword) {
    console.error("用法: node scripts/reset-password.js <用户名> <新密码>");
    console.error("示例: node scripts/reset-password.js Miany xmy123");
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  const result = await prisma.user.updateMany({
    where: { username },
    data: {
      password: hashedPassword,
      isActive: true,
      deletedAt: null,
    },
  });

  if (result.count === 0) {
    console.error(`未找到用户: ${username}`);
    process.exit(1);
  }

  console.log(`用户 ${username} 密码已重置成功！`);
  console.log(`新密码: ${newPassword}`);
}

main()
  .catch((e) => {
    console.error("重置失败:", e.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
