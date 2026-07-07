import { prisma } from "../src/db/index.js";
import fs from "fs";
import path from "path";
import { convertToAvif } from "../src/utils/image-converter.js";

const uploadDir = path.join(process.cwd(), "uploads");

async function main() {
  console.log("开始迁移最近上传的非AVIF图片...");

  const images = await prisma.image.findMany({
    where: {
      deletedAt: null,
      mimetype: { not: "image/avif" },
    },
    select: { id: true, url: true, filename: true, mimetype: true, size: true },
  });

  console.log(`找到 ${images.length} 张非AVIF图片`);

  let successCount = 0;
  let failCount = 0;

  for (const image of images) {
    const ext = path.extname(image.url);
    const imageExts = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff"];

    if (!imageExts.includes(ext.toLowerCase())) {
      console.log(`跳过非图片文件: ${image.url}`);
      continue;
    }

    const inputPath = path.join(uploadDir, image.url.replace("/uploads/", ""));

    if (!fs.existsSync(inputPath)) {
      console.log(`源文件不存在: ${inputPath}`);
      continue;
    }

    const newUrl = image.url.replace(new RegExp(`${ext}$`, "i"), ".avif");
    const outputPath = path.join(uploadDir, newUrl.replace("/uploads/", ""));

    console.log(`转换: ${image.url}`);

    const result = await convertToAvif(inputPath, outputPath);

    if (result.success) {
      await prisma.image.update({
        where: { id: image.id },
        data: {
          url: newUrl,
          mimetype: "image/avif",
          size: result.size,
        },
      });

      await fs.promises.unlink(inputPath).catch(() => {});
      console.log(`  ✓ 成功转换为: ${newUrl}`);
      successCount++;
    } else {
      console.log(`  ✗ 转换失败`);
      failCount++;
    }
  }

  console.log(`\n迁移完成！成功: ${successCount}, 失败: ${failCount}`);
  await prisma.$disconnect();
}

main().catch(console.error);
