import { prisma } from "../src/db/index.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("开始迁移配置中的图片...");

  const configs = (await prisma.$queryRaw`SELECT * FROM Config`) as Array<{
    id: string;
    key: string;
    value: string;
  }>;

  let updatedCount = 0;

  for (const config of configs) {
    if (config.key !== "site_config") continue;

    let value = config.value;
    let hasChanges = false;

    const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"];

    for (const ext of imageExts) {
      const regex = new RegExp(`(/uploads/[^"']+)\\${ext}`, "g");
      const matches = value.match(regex);

      if (matches) {
        for (const match of matches) {
          const newUrl = match.replace(new RegExp(`${ext}$`), ".avif");
          const filePath = path.join(process.cwd(), "uploads", newUrl.replace("/uploads/", ""));

          if (fs.existsSync(filePath)) {
            value = value.replace(match, newUrl);
            hasChanges = true;
            console.log(`更新图片: ${match} -> ${newUrl}`);
          }
        }
      }
    }

    if (hasChanges) {
      await prisma.$executeRaw`UPDATE Config SET value = ${value} WHERE key = 'site_config'`;
      updatedCount++;
    }
  }

  console.log(`\n迁移完成！更新了 ${updatedCount} 个配置`);
  await prisma.$disconnect();
}

main().catch(console.error);
