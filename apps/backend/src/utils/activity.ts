import { prisma } from "../db/client.js";

export type ActivityType = "article" | "image" | "lyric" | "video" | "scene" | "audio";

const typeNames: Record<ActivityType, string> = {
  article: "文章",
  image: "图片",
  lyric: "歌词",
  video: "视频",
  scene: "场景",
  audio: "音频",
};

export async function createActivity(
  type: ActivityType,
  targetId: string,
  targetName?: string,
  groupName?: string
): Promise<void> {
  try {
    await prisma.activity.create({
      data: {
        type: typeNames[type],
        targetId,
        targetName: targetName || null,
        description: `新增了${targetName ? `${typeNames[type]}「${targetName}」` : typeNames[type]}`,
        groupName: groupName || null,
      },
    });
  } catch (error) {
    console.error("记录活动失败:", error);
  }
}
