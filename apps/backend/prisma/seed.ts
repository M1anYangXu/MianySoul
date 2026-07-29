import { prisma } from "../src/db/client.js";

async function main() {
  console.log("正在添加默认分类到数据库...");

  const existingDefault = await prisma.narrativeCategory.findFirst({
    where: { isDefault: true, deletedAt: null },
  });

  if (!existingDefault) {
    await prisma.narrativeCategory.create({
      data: {
        name: "默认分类",
        icon: "📁",
        isDefault: true,
        isPublic: true,
      },
    });
    console.log("已添加默认分类到数据库");
  } else {
    console.log("默认分类已存在:", existingDefault.name);
  }

  const existingMusicDefault = await prisma.musicCategory.findFirst({
    where: { isDefault: true, deletedAt: null },
  });

  if (!existingMusicDefault) {
    await prisma.musicCategory.create({
      data: {
        name: "默认分组",
        icon: "📁",
        isDefault: true,
        isPublic: true,
      },
    });
    console.log("已添加音乐默认分组到数据库");
  } else {
    console.log("音乐默认分类已存在:", existingMusicDefault.name);
  }

  console.log("操作完成！");
}

main()
  .catch((e) => {
    console.error("操作失败:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
