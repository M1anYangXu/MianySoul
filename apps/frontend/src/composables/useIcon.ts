// 常用 Iconify 图标预设（来自 @iconify-json/mdi）
export const iconPresets = [
  "mdi:folder",
  "mdi:folder-multiple",
  "mdi:folder-star",
  "mdi:folder-heart",
  "mdi:folder-image",
  "mdi:folder-music",
  "mdi:folder-play",
  "mdi:filmstrip",
  "mdi:image",
  "mdi:image-multiple",
  "mdi:palette",
  "mdi:music",
  "mdi:music-note",
  "mdi:music-note-eighth",
  "mdi:headphones",
  "mdi:piano",
  "mdi:disc",
  "mdi:book",
  "mdi:book-open",
  "mdi:bookmark",
  "mdi:file-document",
  "mdi:file-document-outline",
  "mdi:file-edit",
  "mdi:creation",
  "mdi:lightbulb",
  "mdi:auto-fix",
  "mdi:star",
  "mdi:star-outline",
  "mdi:heart",
  "mdi:heart-outline",
  "mdi:calendar",
  "mdi:calendar-outline",
  "mdi:clock",
  "mdi:clock-outline",
  "mdi:tag",
  "mdi:tag-outline",
  "mdi:camera",
  "mdi:camera-outline",
  "mdi:video",
  "mdi:video-outline",
  "mdi:microphone",
  "mdi:microphone-outline",
  "mdi:newspaper",
  "mdi:newspaper-variant",
  "mdi:pencil",
  "mdi:note",
  "mdi:note-outline",
  "mdi:cards-heart",
  "mdi:inbox",
  "mdi:inbox-outline",
];

// 检查图标值是否为 Iconify 格式（包含冒号）
export function isIconifyFormat(icon: string): boolean {
  return icon.includes(":");
}

// 获取图标显示名称
export function getIconDisplayName(icon: string): string {
  if (isIconifyFormat(icon)) {
    return icon.split(":")[1] || icon;
  }
  return icon;
}

export function useIcon() {
  const formatIconName = (name: string): string => {
    // 如果用户输入的图标名不含冒号，默认添加 mdi: 前缀
    if (!name.includes(":")) {
      return `mdi:${name}`;
    }
    return name;
  };

  const isValidIcon = (name: string): boolean => {
    return !!name && name.length > 0;
  };

  return {
    formatIconName,
    isValidIcon,
    isIconifyFormat,
    getIconDisplayName,
    iconPresets,
  };
}
