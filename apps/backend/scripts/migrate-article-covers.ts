import { prisma } from "../src/db/index.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("开始迁移文章封面图片...");

  const articles = await prisma.article.findMany({
    where: { coverImage: { not: null }, deletedAt: null },
    select: { id: true, title: true, coverImage: true },
  });

  let updatedCount = 0;

  for (const article of articles) {
    if (!article.coverImage) continue;

    const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"];
    let newUrl = article.coverImage;
    let hasChanges = false;

    for (const ext of imageExts) {
      if (article.coverImage.toLowerCase().endsWith(ext)) {
        newUrl = article.coverImage.replace(new RegExp(`${ext}$`, "i"), ".avif");
        const filePath = path.join(process.cwd(), "uploads", newUrl.replace("/uploads/", ""));

        if (fs.existsSync(filePath)) {
          hasChanges = true;
          break;
        }
      }
    }

    if (hasChanges) {
      await prisma.article.update({
        where: { id: article.id },
        data: { coverImage: newUrl },
      });
      console.log(`更新文章封面 ${article.id}: ${article.title}`);
      console.log(`  ${article.coverImage} -> ${newUrl}`);
      updatedCount++;
    }
  }

  console.log(`\n迁移完成！更新了 ${updatedCount} 篇文章封面`);
  await prisma.$disconnect();
}

main().catch(console.error);
