import { prisma } from "../src/db/index.js";

async function main() {
  const settings = await prisma.settings.findMany();
  console.log("Settings 表数据:");
  settings.forEach((s) => {
    console.log(`key: ${s.key}, value: ${s.value}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
