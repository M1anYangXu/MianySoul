#!/usr/bin/env node
/**
 * 🔐 配置检查脚本
 * 检查关键配置是否被意外修改
 */

const fs = require("fs");
const path = require("path");

console.log("=".repeat(60));
console.log("🔐 Miany Soul 配置检查工具");
console.log("=".repeat(60));

const projectRoot = __dirname + "/..";

// 配置检查定义
const configChecks = [
  {
    name: "vite.config.ts",
    file: path.join(projectRoot, "apps/frontend/vite.config.ts"),
    checks: [
      {
        name: "API代理目标",
        pattern: /target:\s*["']http:\/\/127\.0\.0\.1:3000["']/,
        required: true,
        fix: '保持 target: "http://127.0.0.1:3000"',
      },
      {
        name: "上传代理目标",
        pattern: /"\/uploads":\s*\{[^}]*target:\s*["']http:\/\/127\.0\.0\.1:3000["']/,
        required: true,
        fix: "保持 /uploads 代理指向 3000 端口",
      },
      {
        name: "前端端口",
        pattern: /port:\s*5173/,
        required: true,
        fix: "保持前端端口 5173",
      },
    ],
  },
  {
    name: "vite.config.js",
    file: path.join(projectRoot, "apps/frontend/vite.config.js"),
    checks: [
      {
        name: "API代理目标",
        pattern: /target:\s*["']http:\/\/127\.0\.0\.1:3000["']/,
        required: true,
        fix: '保持 target: "http://127.0.0.1:3000"',
      },
      {
        name: "前端端口",
        pattern: /port:\s*5173/,
        required: true,
        fix: "保持前端端口 5173",
      },
    ],
  },
  {
    name: "前端环境变量",
    file: path.join(projectRoot, "apps/frontend/.env"),
    checks: [
      {
        name: "API基础URL",
        pattern: /VITE_API_BASE_URL=http:\/\/localhost:3000/,
        required: true,
        fix: "保持 VITE_API_BASE_URL=http://localhost:3000",
      },
    ],
  },
  {
    name: "后端环境变量",
    file: path.join(projectRoot, "apps/backend/.env"),
    checks: [
      {
        name: "后端端口",
        pattern: /PORT=3000/,
        required: true,
        fix: "保持 PORT=3000",
      },
    ],
  },
  {
    name: "后端服务配置",
    file: path.join(projectRoot, "apps/backend/src/index.ts"),
    checks: [
      {
        name: "后端监听端口",
        pattern: /port:\s*3000/,
        required: true,
        fix: "保持后端端口 3000",
      },
      {
        name: "静态文件路由",
        pattern: /prefix:\s*["']\/uploads\/["']/,
        required: true,
        fix: "保持 /uploads 路由配置",
      },
    ],
  },
];

let allPassed = true;

configChecks.forEach((checkDef) => {
  console.log(`\n📋 检查: ${checkDef.name}`);

  if (!fs.existsSync(checkDef.file)) {
    console.log(`❌ 文件不存在: ${checkDef.file}`);
    allPassed = false;
    return;
  }

  const content = fs.readFileSync(checkDef.file, "utf-8");

  checkDef.checks.forEach((check) => {
    const found = check.pattern.test(content);
    if (check.required && !found) {
      console.log(`  ❌ 失败: ${check.name}`);
      console.log(`     💡 提示: ${check.fix}`);
      allPassed = false;
    } else if (found) {
      console.log(`  ✅ 通过: ${check.name}`);
    }
  });
});

console.log("\n" + "=".repeat(60));
if (allPassed) {
  console.log("✅ 所有关键配置检查通过！");
  console.log("=".repeat(60));
  process.exit(0);
} else {
  console.log("❌ 检测到配置问题！请查看上面的提示。");
  console.log("⚠️  请参考 CONFIG_GUARD.md 文件了解如何修复。");
  console.log("=".repeat(60));
  process.exit(1);
}
