import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export async function convertToAv1(
  inputPath: string,
  outputPath: string
): Promise<{ success: boolean; size: number }> {
  return new Promise((resolve) => {
    fs.promises
      .stat(inputPath)
      .then((stats) => {
        if (!stats.isFile()) {
          resolve({ success: false, size: 0 });
          return;
        }

        ffmpeg(inputPath)
          .output(outputPath)
          .videoCodec("libsvtav1")
          .audioCodec("libopus")
          .outputOptions(["-crf 30", "-g 240", "-pix_fmt yuv420p", "-preset 6"])
          .on("end", async () => {
            try {
              const outputStats = await fs.promises.stat(outputPath);
              resolve({ success: true, size: outputStats.size });
            } catch {
              resolve({ success: false, size: 0 });
            }
          })
          .on("error", (err) => {
            console.error(`Failed to convert ${inputPath} to AV1:`, err);
            resolve({ success: false, size: 0 });
          })
          .run();
      })
      .catch(() => {
        resolve({ success: false, size: 0 });
      });
  });
}

export async function convertVideoBufferToAv1(
  buffer: Buffer,
  outputPath: string
): Promise<{ success: boolean; size: number }> {
  return new Promise((resolve) => {
    const inputPath = `${outputPath}.tmp`;
    fs.promises
      .writeFile(inputPath, buffer)
      .then(() => {
        ffmpeg(inputPath)
          .output(outputPath)
          .videoCodec("libsvtav1")
          .audioCodec("libopus")
          .outputOptions(["-crf 30", "-g 240", "-pix_fmt yuv420p", "-preset 6"])
          .on("end", async () => {
            try {
              await fs.promises.unlink(inputPath);
              const outputStats = await fs.promises.stat(outputPath);
              resolve({ success: true, size: outputStats.size });
            } catch {
              resolve({ success: false, size: 0 });
            }
          })
          .on("error", async (err) => {
            console.error("Failed to convert buffer to AV1:", err);
            try {
              await fs.promises.unlink(inputPath);
            } catch (e) {
              console.error("Failed to clean up temp file:", e);
            }
            resolve({ success: false, size: 0 });
          })
          .run();
      })
      .catch(() => {
        resolve({ success: false, size: 0 });
      });
  });
}

export function isVideoFile(filename: string): boolean {
  const ext = path.extname(filename).toLowerCase();
  return [".mp4", ".webm", ".mov", ".avi", ".mkv", ".flv", ".wmv"].includes(ext);
}

export function isAv1File(filename: string): boolean {
  return path.extname(filename).toLowerCase() === ".webm";
}
