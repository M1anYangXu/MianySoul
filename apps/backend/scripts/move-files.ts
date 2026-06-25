import * as fs from "fs";
import * as path from "path";

const uploadDir = path.join(process.cwd(), "uploads");

async function main() {
  try {
    const files = await fs.promises.readdir(uploadDir);

    for (const file of files) {
      const filePath = path.join(uploadDir, file);
      const stat = await fs.promises.stat(filePath);

      if (stat.isFile() && !file.startsWith(".")) {
        const uuid = file.split(".")[0];
        const subdir = uuid.substring(0, 2);
        const subdirPath = path.join(uploadDir, subdir);

        await fs.promises.mkdir(subdirPath, { recursive: true });
        await fs.promises.rename(filePath, path.join(subdirPath, file));
        console.log(`Moved ${file} to ${subdir}/${file}`);
      }
    }

    console.log("Done!");
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

main();
