import { prisma } from "../src/db/index.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("开始迁移用户头像...");

  const users = await prisma.user.findMany();
  let updatedCount = 0;

  for (const user of users) {
    if (!user.avatar) continue;

    const avatarUrl = user.avatar;
    const ext = path.extname(avatarUrl);
    const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"];

    if (!imageExts.includes(ext.toLowerCase())) continue;

    const newAvatarUrl = avatarUrl.replace(new RegExp(`${ext}$`), ".avif");
    const filePath = path.join(process.cwd(), "uploads", newAvatarUrl.replace("/uploads/", ""));

    if (fs.existsSync(filePath)) {
      await prisma.user.update({
        where: { id: user.id },
        data: { avatar: newAvatarUrl },
      });
      updatedCount++;
      console.log(`更新用户头像: ${user.username} -> ${newAvatarUrl}`);
    } else {
      console.log(`AVIF 文件不存在: ${filePath}`);
    }
  }

  console.log(`\n迁移完成！更新了 ${updatedCount} 个用户头像`);
  await prisma.$disconnect();
}

main().catch(console.error);
