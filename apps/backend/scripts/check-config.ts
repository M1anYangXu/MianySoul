import { prisma } from "../src/db/index.js";

async function main() {
  const configs = await prisma.$queryRaw`SELECT * FROM Config`;
  console.log("Config 表数据:");
  configs.forEach((c) => {
    console.log(`key: ${c.key}, value: ${c.value}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
