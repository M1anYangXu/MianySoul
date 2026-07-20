import { prisma } from "../src/db/client.js";
import fs from "fs";
import path from "path";
import { getUploadsDir } from "../src/utils/paths.js";

async function fixImageUrls() {
  const uploadDir = getUploadsDir();
  const images = await prisma.image.findMany({
    where: { deletedAt: null },
    select: { id: true, url: true, filename: true },
  });

  console.log(`Found ${images.length} images in database`);

  const existingFiles: Map<string, string> = new Map();

  const scanDir = async (dir: string) => {
    const files = await fs.promises.readdir(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = await fs.promises.stat(fullPath);
      if (stat.isDirectory()) {
        await scanDir(fullPath);
      } else {
        const relativePath = fullPath.replace(uploadDir, "").replace(/\\/g, "/");
        existingFiles.set(relativePath.toLowerCase(), relativePath);
      }
    }
  };

  await scanDir(uploadDir);
  console.log(`Found ${existingFiles.size} files in uploads directory`);

  let fixedCount = 0;
  let missingCount = 0;

  for (const image of images) {
    const url = image.url;
    const expectedPath = url.replace("/uploads", "");

    if (existingFiles.has(expectedPath.toLowerCase())) {
      continue;
    }

    if (url.endsWith(".avif")) {
      const jpgPath = expectedPath.replace(".avif", ".jpg");
      const pngPath = expectedPath.replace(".avif", ".png");
      const webpPath = expectedPath.replace(".avif", ".webp");

      if (existingFiles.has(jpgPath.toLowerCase())) {
        const newUrl = url.replace(".avif", ".jpg");
        console.log(`Fixing ${url} -> ${newUrl}`);
        await prisma.image.update({
          where: { id: image.id },
          data: { url: newUrl, mimetype: "image/jpeg" },
        });
        fixedCount++;
      } else if (existingFiles.has(pngPath.toLowerCase())) {
        const newUrl = url.replace(".avif", ".png");
        console.log(`Fixing ${url} -> ${newUrl}`);
        await prisma.image.update({
          where: { id: image.id },
          data: { url: newUrl, mimetype: "image/png" },
        });
        fixedCount++;
      } else if (existingFiles.has(webpPath.toLowerCase())) {
        const newUrl = url.replace(".avif", ".webp");
        console.log(`Fixing ${url} -> ${newUrl}`);
        await prisma.image.update({
          where: { id: image.id },
          data: { url: newUrl, mimetype: "image/webp" },
        });
        fixedCount++;
      } else {
        console.log(`File not found: ${uploadDir}${expectedPath}`);
        missingCount++;
      }
    } else {
      console.log(`File not found: ${uploadDir}${expectedPath}`);
      missingCount++;
    }
  }

  const articles = await prisma.article.findMany({
    where: { deletedAt: null, coverImage: { not: null } },
    select: { id: true, coverImage: true },
  });

  console.log(`\nFound ${articles.length} articles with cover images`);

  for (const article of articles) {
    const url = article.coverImage!;
    const expectedPath = url.replace("/uploads", "");

    if (existingFiles.has(expectedPath.toLowerCase())) {
      continue;
    }

    if (url.endsWith(".avif")) {
      const jpgPath = expectedPath.replace(".avif", ".jpg");
      const pngPath = expectedPath.replace(".avif", ".png");

      if (existingFiles.has(jpgPath.toLowerCase())) {
        const newUrl = url.replace(".avif", ".jpg");
        console.log(`Fixing article cover ${url} -> ${newUrl}`);
        await prisma.article.update({
          where: { id: article.id },
          data: { coverImage: newUrl },
        });
        fixedCount++;
      } else if (existingFiles.has(pngPath.toLowerCase())) {
        const newUrl = url.replace(".avif", ".png");
        console.log(`Fixing article cover ${url} -> ${newUrl}`);
        await prisma.article.update({
          where: { id: article.id },
          data: { coverImage: newUrl },
        });
        fixedCount++;
      }
    }
  }

  console.log(`\nFixed: ${fixedCount}, Missing: ${missingCount}`);
  console.log("Done!");
}

fixImageUrls()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
