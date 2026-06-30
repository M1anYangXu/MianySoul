import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("开始初始化数据库...");

  // 创建默认管理员角色
  const adminRole = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: {
      name: "admin",
      description: "超级管理员",
      permissions: JSON.stringify(["*"]),
    },
  });

  console.log("创建管理员角色:", adminRole.name);

  // 创建普通用户角色
  const userRole = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: {
      name: "user",
      description: "普通用户",
      permissions: JSON.stringify(["read"]),
    },
  });

  console.log("创建普通用户角色:", userRole.name);

  // 创建默认管理员账号
  const hashedPassword = await bcrypt.hash("admin123", 10);

  // 先检查是否存在使用该邮箱的用户，如果有则更新用户名
  const existingUser = await prisma.user.findFirst({
    where: { email: "admin@example.com" },
  });

  if (existingUser && existingUser.username !== "admin") {
    await prisma.user.update({
      where: { email: "admin@example.com" },
      data: { username: "admin", role: "admin", password: hashedPassword },
    });
    console.log("更新管理员账号:", "admin");
  } else {
    const adminUser = await prisma.user.upsert({
      where: { username: "admin" },
      update: { password: hashedPassword, role: "admin", isActive: true },
      create: {
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        isActive: true,
      },
    });
    console.log("创建管理员账号:", adminUser.username);
  }

  console.log("数据库初始化完成！");

  console.log("开始创建默认场景数据...");

  const scenes = [
    {
      sceneId: "rain",
      name: "雨天",
      icon: "🌧️",
      description: "窗外细雨绵绵，宁静祥和",
      image: "https://picsum.photos/seed/rain/1280/720",
      audioUrl:
        "https://cdn.pixabay.com/download/audio/2024/10/30/audio_42e6870f29.mp3?filename=liecio-calming-rain-257596.mp3",
      sortOrder: 1,
    },
    {
      sceneId: "thunder",
      name: "雷暴",
      icon: "⛈️",
      description: "雷声轰鸣，大雨倾盆",
      image: "https://picsum.photos/seed/thunder/1280/720",
      audioUrl:
        "https://cdn.pixabay.com/download/audio/2026/04/21/audio_8b35083762.mp3?filename=loswin23-thunderstorm-2-516370.mp3",
      sortOrder: 2,
    },
    {
      sceneId: "forest",
      name: "森林",
      icon: "🌲",
      description: "鸟鸣虫声，溪水潺潺",
      image: "https://picsum.photos/seed/forest/1280/720",
      audioUrl:
        "https://cdn.pixabay.com/download/audio/2025/02/03/audio_7599bcb342.mp3?filename=audiopapkin-forest-ambience-296528.mp3",
      sortOrder: 3,
    },
    {
      sceneId: "ocean",
      name: "海边",
      icon: "🌊",
      description: "海浪拍岸，海风轻拂",
      image: "https://picsum.photos/seed/ocean/1280/720",
      audioUrl:
        "https://cdn.pixabay.com/download/audio/2026/03/10/audio_3b82b8ec69.mp3?filename=dragon-studio-gentle-ocean-shore-waves-499665.mp3",
      sortOrder: 4,
    },
    {
      sceneId: "night",
      name: "夜晚",
      icon: "🌙",
      description: "虫鸣悠扬，星空璀璨",
      image: "https://picsum.photos/seed/night/1280/720",
      audioUrl: "https://cdn.pixabay.com/download/audio/2021/08/09/audio_12b0c7443c.mp4",
      sortOrder: 5,
    },
    {
      sceneId: "fire",
      name: "篝火",
      icon: "🔥",
      description: "火焰跳动，温暖安宁",
      image: "https://picsum.photos/seed/fire/1280/720",
      audioUrl: "https://cdn.pixabay.com/download/audio/2022/03/24/audio_5a029e5be1.mp4",
      sortOrder: 6,
    },
    {
      sceneId: "cafe",
      name: "咖啡馆",
      icon: "☕",
      description: "咖啡香气，慵懒时光",
      image: "https://picsum.photos/seed/cafe/1280/720",
      audioUrl:
        "https://cdn.pixabay.com/download/audio/2024/09/24/audio_49c4114346.mp3?filename=stefan-chirila-coffee-shop-ambience-245498.mp3",
      sortOrder: 7,
    },
  ];

  for (const scene of scenes) {
    await prisma.scene.upsert({
      where: { sceneId: scene.sceneId },
      update: scene,
      create: scene,
    });
    console.log("创建场景:", scene.name);
  }

  console.log("默认场景数据创建完成！");
}

main()
  .catch((error) => {
    console.error("数据库初始化失败:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
