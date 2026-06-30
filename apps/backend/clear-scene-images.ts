import { prisma } from "./src/db/index.js";

async function main() {
  const updated = await prisma.scene.updateMany({
    where: {},
    data: { image: "" },
  });
  console.log(`更新了 ${updated.count} 个场景的图片为空`);

  const scenes = await prisma.scene.findMany({
    where: { deletedAt: null },
    select: { name: true, image: true },
  });
  console.log("场景图片状态:");
  scenes.forEach((scene) => {
    console.log(`${scene.name}: ${scene.image || "(空)"}`);
  });

  await prisma.$disconnect();
}

main().catch(console.error);
