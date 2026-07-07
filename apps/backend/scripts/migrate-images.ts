import { prisma } from "../src/db/index.js";
import { convertToAvif, isImageFile, isAvifFile } from "../src/utils/image-converter.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("开始迁移图片为 AVIF 格式...");

  const images = await prisma.image.findMany({
    where: {
      deletedAt: null,
    },
  });

  console.log(`找到 ${images.length} 张图片`);

  let convertedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const image of images) {
    const url = image.url;
    const filename = url.split("/").pop() || "";

    if (isAvifFile(filename)) {
      skippedCount++;
      continue;
    }

    if (!isImageFile(filename)) {
      skippedCount++;
      continue;
    }

    const ext = path.extname(filename);
    const baseName = filename.replace(ext, "");
    const newFilename = `${baseName}.avif`;
    const newUrl = url.replace(filename, newFilename);

    const inputPath = path.join(process.cwd(), "uploads", url.replace("/uploads/", ""));
    const outputPath = path.join(process.cwd(), "uploads", newUrl.replace("/uploads/", ""));

    try {
      console.log(`正在转换: ${filename} -> ${newFilename}`);
      const result = await convertToAvif(inputPath, outputPath);

      if (result.success) {
        await prisma.image.update({
          where: { id: image.id },
          data: {
            url: newUrl,
            size: result.size,
            mimetype: "image/avif",
          },
        });

        await fs.promises.unlink(inputPath);
        convertedCount++;
        console.log(`转换成功: ${filename}`);
      } else {
        failedCount++;
        console.log(`转换失败: ${filename}`);
      }
    } catch (error) {
      failedCount++;
      console.log(`转换异常: ${filename}`, error);
    }
  }

  console.log(`\n迁移完成！`);
  console.log(`转换成功: ${convertedCount}`);
  console.log(`跳过: ${skippedCount}`);
  console.log(`失败: ${failedCount}`);

  await prisma.$disconnect();
}

main().catch(console.error);
