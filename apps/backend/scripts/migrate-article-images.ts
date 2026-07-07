import { prisma } from "../src/db/index.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("开始迁移文章内容中的图片...");

  const articles =
    (await prisma.$queryRaw`SELECT id, content FROM Article WHERE deletedAt IS NULL`) as Array<{
      id: string;
      content: string;
    }>;

  let updatedCount = 0;

  for (const article of articles) {
    if (!article.content) continue;

    let content = article.content;
    let hasChanges = false;

    const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"];

    for (const ext of imageExts) {
      const regex = new RegExp(`(/uploads/[^"'>]+)\\${ext}`, "gi");
      const matches = content.match(regex);

      if (matches) {
        for (const match of matches) {
          const newUrl = match.replace(new RegExp(`${ext}$`, "i"), ".avif");
          const filePath = path.join(process.cwd(), "uploads", newUrl.replace("/uploads/", ""));

          if (fs.existsSync(filePath)) {
            content = content.replace(new RegExp(match, "g"), newUrl);
            hasChanges = true;
            console.log(`更新文章 ${article.id} 中的图片: ${match} -> ${newUrl}`);
          }
        }
      }
    }

    if (hasChanges) {
      await prisma.$executeRaw`UPDATE Article SET content = ${content} WHERE id = ${article.id}`;
      updatedCount++;
    }
  }

  console.log(`\n迁移完成！更新了 ${updatedCount} 篇文章`);
  await prisma.$disconnect();
}

main().catch(console.error);
