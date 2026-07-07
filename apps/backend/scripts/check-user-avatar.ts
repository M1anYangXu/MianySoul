import { prisma } from "../src/db/index.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log("用户数据:");
  users.forEach((u) => {
    console.log(`id: ${u.id}, avatar: ${u.avatar}`);
  });

  const settings = await prisma.settings.findMany();
  console.log("\n设置数据:");
  settings.forEach((s) => {
    console.log(`key: ${s.key}, value: ${s.value.substring(0, 100)}...`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
