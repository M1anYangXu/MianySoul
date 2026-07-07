import { prisma } from "../src/db/index.js";
import { convertToAv1, isVideoFile, isAv1File } from "../src/utils/video-converter.js";
import fs from "fs";
import path from "path";

async function main() {
  console.log("开始迁移视频为 AV1 格式...");

  const videos = await prisma.video.findMany({
    where: {
      deletedAt: null,
    },
  });

  console.log(`找到 ${videos.length} 个视频`);

  let convertedCount = 0;
  let skippedCount = 0;
  let failedCount = 0;

  for (const video of videos) {
    const url = video.url;
    const filename = url.split("/").pop() || "";

    if (isAv1File(filename)) {
      skippedCount++;
      continue;
    }

    if (!isVideoFile(filename)) {
      skippedCount++;
      continue;
    }

    const newFilename = `${path.basename(filename, path.extname(filename))}.webm`;
    const newUrl = url.replace(filename, newFilename);

    const inputPath = path.join(process.cwd(), "uploads", url.replace("/uploads/", ""));
    const outputPath = path.join(process.cwd(), "uploads", newUrl.replace("/uploads/", ""));

    try {
      console.log(`正在转换: ${filename} -> ${newFilename}`);
      const result = await convertToAv1(inputPath, outputPath);

      if (result.success) {
        await prisma.video.update({
          where: { id: video.id },
          data: {
            url: newUrl,
            size: result.size,
            mimetype: "video/webm",
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
