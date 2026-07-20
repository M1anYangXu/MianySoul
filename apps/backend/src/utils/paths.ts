import path from "path";

const __dirname = path
  .dirname(new URL(import.meta.url).pathname)
  .replace(/^\/([A-Za-z]:)/, "$1")
  .replace(/\\/g, "/");

export const getUploadsDir = (): string => {
  return path.join(__dirname, "../../uploads");
};
