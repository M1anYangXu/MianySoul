import sharp from "sharp";
import fs from "fs";
import path from "path";

export async function convertToAvif(
  inputPath: string,
  outputPath: string
): Promise<{ success: boolean; size: number }> {
  try {
    const stats = await fs.promises.stat(inputPath);
    if (!stats.isFile()) {
      return { success: false, size: 0 };
    }

    const buffer = await fs.promises.readFile(inputPath);
    const avifBuffer = await sharp(buffer)
      .avif({
        quality: 70,
        lossless: false,
      })
      .toBuffer();

    await fs.promises.writeFile(outputPath, avifBuffer);
    return { success: true, size: avifBuffer.length };
  } catch (error) {
    console.error(`Failed to convert ${inputPath} to AVIF:`, error);
    return { success: false, size: 0 };
  }
}

export async function convertImageBufferToAvif(
  buffer: Buffer
): Promise<{ success: boolean; data: Buffer }> {
  try {
    const avifBuffer = await sharp(buffer)
      .avif({
        quality: 70,
        lossless: false,
      })
      .toBuffer();

    return { success: true, data: avifBuffer };
  } catch (error) {
    console.error("Failed to convert buffer to AVIF:", error);
    return { success: false, data: buffer };
  }
}

export function isImageFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return [".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".svg"].includes(ext);
}

export function isAvifFile(filename: string): boolean {
  return path.extname(filename).toLowerCase() === ".avif";
}
