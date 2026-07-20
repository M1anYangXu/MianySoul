import net from "net";
import fs from "fs";
import path from "path";

const __dirname = path
  .dirname(new URL(import.meta.url).pathname)
  .replace(/^\/([A-Za-z]:)/, "$1")
  .replace(/\\/g, "/");

export async function findAvailablePort(
  startPort: number,
  maxPort: number = 65535
): Promise<number> {
  for (let port = startPort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found between ${startPort} and ${maxPort}`);
}

async function isPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once("error", () => resolve(false));
    server.once("listening", () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

export function writePortFile(port: number): void {
  const portFilePath = path.join(__dirname, "../../.port");
  fs.writeFileSync(portFilePath, port.toString());
}

export function readPortFile(): number | null {
  const portFilePath = path.join(__dirname, "../../.port");
  try {
    const content = fs.readFileSync(portFilePath, "utf-8");
    return parseInt(content, 10);
  } catch {
    return null;
  }
}
