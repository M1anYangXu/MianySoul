import { prisma } from "../db/client.js";

export type ActivityType = "article" | "image" | "lyric" | "scene";

const typeNames: Record<ActivityType, string> = {
  article: "文章",
  image: "图片",
  lyric: "歌词",
  scene: "场景",
};

export async function createActivity(
  type: ActivityType,
  targetId: string,
  targetName?: string
): Promise<void> {
  try {
    await prisma.activity.create({
      data: {
        type: typeNames[type],
        targetId,
        targetName: targetName || null,
        description: `新增了${typeNames[type]}${targetName ? `「${targetName}」` : ""}`,
      },
    });
  } catch (error) {
    console.error("记录活动失败:", error);
  }
}
