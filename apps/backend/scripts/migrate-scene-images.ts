import { prisma } from "../src/db/index.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("开始迁移场景中的图片...");

  const scenes =
    (await prisma.$queryRaw`SELECT id, image FROM Scene WHERE deletedAt IS NULL`) as Array<{
      id: string;
      image: string;
    }>;

  let updatedCount = 0;

  for (const scene of scenes) {
    if (!scene.image) continue;

    const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"];
    let newUrl = scene.image;
    let hasChanges = false;

    for (const ext of imageExts) {
      if (scene.image.toLowerCase().endsWith(ext)) {
        newUrl = scene.image.replace(new RegExp(`${ext}$`, "i"), ".avif");
        const filePath = path.join(process.cwd(), "uploads", newUrl.replace("/uploads/", ""));

        if (fs.existsSync(filePath)) {
          hasChanges = true;
          break;
        }
      }
    }

    if (hasChanges) {
      await prisma.$executeRaw`UPDATE Scene SET image = ${newUrl} WHERE id = ${scene.id}`;
      console.log(`更新场景 ${scene.id}: ${scene.image} -> ${newUrl}`);
      updatedCount++;
    }
  }

  console.log(`\n迁移完成！更新了 ${updatedCount} 个场景`);
  await prisma.$disconnect();
}

main().catch(console.error);
