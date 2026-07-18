import { spawn } from "child_process";
import net from "net";
import fs from "fs";
import path from "path";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const rootDir = path.resolve(__dirname, "..");

async function findAvailablePort(startPort, maxPort = 65535) {
  for (let port = startPort; port <= maxPort; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found between ${startPort} and ${maxPort}`);
}

async function isPortAvailable(port) {
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

async function main() {
  const backendPort = await findAvailablePort(3000);
  const frontendPort = await findAvailablePort(5173);

  console.log(`\n🚀 MianySoul Development Server`);
  console.log(`├── Backend: http://localhost:${backendPort}`);
  console.log(`└── Frontend: http://localhost:${frontendPort}\n`);

  const portFilePath = path.join(rootDir, "apps", "backend", ".port");
  fs.writeFileSync(portFilePath, backendPort.toString());

  const env = {
    ...process.env,
    PORT: backendPort.toString(),
  };

  const backend = spawn("pnpm", ["--filter", "@miany-soul/backend", "dev"], {
    cwd: rootDir,
    env,
    stdio: "inherit",
  });

  await new Promise((resolve) => {
    backend.stdout?.on("data", (data) => {
      if (data.toString().includes("服务器启动成功")) {
        resolve(null);
      }
    });
    backend.stderr?.on("data", (data) => {
      if (data.toString().includes("服务器启动成功")) {
        resolve(null);
      }
    });
    setTimeout(() => resolve(null), 5000);
  });

  const frontend = spawn("npx", ["vite"], {
    cwd: path.join(rootDir, "apps", "frontend"),
    env: { ...env, PORT: frontendPort.toString() },
    stdio: "inherit",
  });

  backend.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Backend exited with code ${code}`);
      process.exit(code);
    }
  });

  frontend.on("exit", (code) => {
    if (code !== 0) {
      console.error(`Frontend exited with code ${code}`);
      process.exit(code);
    }
  });

  process.on("SIGINT", () => {
    console.log("\nShutting down...");
    backend.kill();
    frontend.kill();
    process.exit(0);
  });
}

main().catch((error) => {
  console.error("Failed to start development server:", error);
  process.exit(1);
});