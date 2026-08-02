// IconPark 图标预设与工具
// 统一图标方案：字节跳动 IconPark

export interface IconPreset {
  /** IconPark type 名称，如 "FolderClose" */
  type: string;
  /** 显示名称 */
  label: string;
}

// 常用 IconPark 图标预设（按类别组织）
export const iconPresets: IconPreset[] = [
  // 文件夹
  { type: "FolderClose", label: "文件夹" },
  { type: "FolderOpen", label: "文件夹开" },
  { type: "FolderSuccess", label: "成功文件夹" },
  { type: "FolderFocus", label: "焦点文件夹" },
  { type: "FolderWithdrawal", label: "退款文件夹" },
  // 媒体
  { type: "Pic", label: "图片" },
  { type: "PicOne", label: "多图" },
  { type: "Video", label: "视频" },
  { type: "VideoOne", label: "视频一" },
  { type: "Music", label: "音乐" },
  { type: "MusicOne", label: "音乐一" },
  { type: "Headset", label: "耳机" },
  { type: "Microphone", label: "麦克风" },
  { type: "Piano", label: "钢琴" },
  { type: "Cd", label: "光盘" },
  { type: "Film", label: "胶片" },
  { type: "Camera", label: "相机" },
  { type: "Videocamera", label: "摄像机" },
  // 文档
  { type: "FileText", label: "文档" },
  { type: "File", label: "文件" },
  { type: "Notebook", label: "笔记" },
  { type: "Book", label: "书本" },
  { type: "BookOpen", label: "翻开的书" },
  { type: "Bookmark", label: "书签" },
  { type: "NewspaperFolding", label: "报纸" },
  { type: "Editor", label: "编辑" },
  { type: "Pencil", label: "铅笔" },
  // 情感
  { type: "Like", label: "点赞" },
  { type: "Star", label: "星星" },
  { type: "Good", label: "好评" },
  { type: "SmilingFace", label: "微笑" },
  { type: "Heart", label: "心形" },
  // 时间与日期
  { type: "Calendar", label: "日历" },
  { type: "Time", label: "时间" },
  { type: "Refresh", label: "刷新" },
  // 标签
  { type: "Tag", label: "标签" },
  { type: "TagOne", label: "标签一" },
  { type: "Label", label: "标记" },
  // 自然与场景
  { type: "Mountain", label: "山" },
  { type: "Water", label: "水" },
  { type: "Sun", label: "太阳" },
  { type: "Moon", label: "月亮" },
  { type: "Cloudy", label: "多云" },
  { type: "LightRain", label: "雨" },
  { type: "Snow", label: "雪" },
  { type: "Fire", label: "火" },
  { type: "Leaf", label: "叶子" },
  { type: "Tree", label: "树" },
  // 创意
  { type: "Magic", label: "魔法" },
  { type: "Tips", label: "提示" },
  { type: "Lamp", label: "灯" },
  { type: "Theme", label: "主题" },
  { type: "Paint", label: "画笔" },
  // 通用
  { type: "Search", label: "搜索" },
  { type: "Setting", label: "设置" },
  { type: "Info", label: "信息" },
  { type: "Remind", label: "提醒" },
  { type: "Help", label: "帮助" },
  { type: "Success", label: "成功" },
  { type: "Error", label: "错误" },
  { type: "Caution", label: "警告" },
];

// Lucide PascalCase 名 → IconPark type 映射（用于旧数据兼容）
const lucideToIconPark: Record<string, string> = {
  // 文件夹
  Folder: "FolderClose",
  FolderOpen: "FolderOpen",
  // 媒体
  Image: "Pic",
  ImageIcon: "Pic",
  Video: "Video",
  Music: "Music",
  FileMusic: "Music",
  Headphones: "Headset",
  Mic: "Microphone",
  Microphone: "Microphone",
  Film: "Film",
  Camera: "Camera",
  // 文档
  FileText: "FileText",
  Book: "Book",
  BookOpen: "Book",
  Bookmark: "Bookmark",
  Newspaper: "NewspaperFolding",
  File: "File",
  Notebook: "Notebook",
  Edit3: "Editor",
  Pencil: "Pencil",
  // 情感
  Heart: "Like",
  Star: "Star",
  Sparkles: "Magic",
  // 时间
  Calendar: "Calendar",
  Clock: "Time",
  // 标签
  Tag: "Tag",
  // 自然
  Mountain: "Mountain",
  Sun: "Sun",
  Moon: "Moon",
  Cloud: "Cloudy",
  CloudRain: "LightRain",
  Snowflake: "Snow",
  Flame: "Fire",
  Leaf: "Leaf",
  // 创意
  Lightbulb: "Tips",
  Palette: "Theme",
  Paintbrush: "FormatBrush",
  // 通用
  Search: "Search",
  Settings: "Setting",
  Info: "Info",
  AlertTriangle: "Caution",
  AlertCircle: "Remind",
  HelpCircle: "Help",
  CheckCircle: "Success",
  XCircle: "Fail",
  // 操作
  Upload: "UploadOne",
  Download: "DownloadOne",
  Trash2: "Delete",
  Edit: "Editor",
  Save: "SaveOne",
  Rocket: "Rocket",
  Eye: "PreviewOpen",
  EyeOff: "PreviewClose",
  Play: "PlayOne",
  Pause: "Pause",
  X: "Close",
  ChevronLeft: "Left",
  ChevronRight: "Right",
  ChevronUp: "Up",
  ChevronDown: "Down",
  ArrowLeft: "Left",
  ArrowRight: "Right",
  Plus: "Add",
  Minus: "Minus",
  Check: "Correct",
  User: "User",
  Users: "People",
  Mail: "Mail",
  Globe: "Globe",
  HardDrive: "HardDisk",
  Lock: "Lock",
  PenTool: "Edit",
  Wrench: "Tool",
  Inbox: "Inbox",
  Archive: "Box",
  MessageSquare: "Message",
  // 补充
  ClipboardList: "List",
  Type: "TextStyle",
  Footprints: "Sport",
  Plug: "Connection",
  Map: "Local",
  Database: "DatabaseConfig",
  Monitor: "Computer",
  Ticket: "Ticket",
  Bell: "Remind",
  RefreshCw: "Refresh",
  ExternalLink: "Link",
  ArrowUpRight: "OpenOne",
  Loader: "Loading",
  Loader2: "Loading",
};

// kebab-case 图标名 → IconPark type 映射（用于后端返回的 Lucide/MDI kebab-case 名称）
const kebabToIconPark: Record<string, string> = {
  "cloud-rain": "LightRain",
  "cloud-sun": "Cloudy",
  cloud: "Cloudy",
  zap: "Lightning",
  trees: "Tree",
  "waves-arrow-down": "Waves",
  waves: "Waves",
  moon: "Moon",
  coffee: "CoffeeMachine",
  "flame-kindling": "Fire",
  flame: "Fire",
  sun: "Sun",
  wind: "Wind",
  snowflake: "Snow",
  thunderstorm: "Lightning",
  rainbow: "Rainbow",
  mountain: "Mountain",
  "mountain-snow": "Mountain",
  sea: "Water",
  ocean: "Water",
  lake: "Water",
  river: "Water",
  forest: "Tree",
  bird: "Bird",
  feather: "Feather",
  leaf: "Leaf",
  flower: "Flower",
  music: "Music",
  "music-note": "Music",
  headphones: "Headset",
  play: "PlayOne",
  pause: "Pause",
  video: "Video",
  image: "Pic",
  camera: "Camera",
  star: "Star",
  heart: "Like",
  bookmark: "Bookmark",
  fire: "Fire",
  "coffee-cup": "CoffeeMachine",
};

// MDI 图标名 → IconPark type 映射（用于旧数据兼容）
const mdiToIconPark: Record<string, string> = {
  home: "Home",
  folder: "FolderClose",
  "folder-multiple": "FolderClose",
  "folder-star": "FolderSuccess",
  "folder-heart": "FolderFocus",
  "folder-image": "FolderClose",
  "folder-music": "FolderClose",
  "folder-play": "FolderClose",
  filmstrip: "Film",
  archive: "Box",
  image: "Pic",
  "image-multiple": "PicOne",
  palette: "Theme",
  music: "Music",
  "music-note": "Music",
  "music-note-eighth": "Music",
  headphones: "Headset",
  piano: "Piano",
  disc: "Cd",
  book: "Book",
  "book-open": "Book",
  bookmark: "Bookmark",
  "file-document": "FileText",
  "file-document-outline": "FileText",
  "file-edit": "Editor",
  creation: "Magic",
  lightbulb: "Tips",
  "auto-fix": "Magic",
  star: "Star",
  "star-outline": "Star",
  heart: "Like",
  "heart-outline": "Like",
  "cards-heart": "Like",
  calendar: "Calendar",
  "calendar-outline": "Calendar",
  clock: "Time",
  "clock-outline": "Time",
  tag: "Tag",
  "tag-outline": "Tag",
  camera: "Camera",
  "camera-outline": "Camera",
  video: "Video",
  "video-outline": "Video",
  microphone: "Microphone",
  "microphone-outline": "Microphone",
  newspaper: "NewspaperFolding",
  "newspaper-variant": "NewspaperFolding",
  pencil: "Pencil",
  note: "Notebook",
  "note-outline": "Notebook",
  inbox: "Inbox",
  "inbox-outline": "Inbox",
  user: "User",
  brain: "Magic",
  // 联系方式 / 社交媒体
  email: "Mail",
  "email-outline": "Mail",
  at: "Mail",
  github: "Github",
  "github-circle": "Github",
  twitter: "Twitter",
  "twitter-circle": "Twitter",
  facebook: "Facebook",
  "facebook-circle": "Facebook",
  instagram: "Instagram",
  "instagram-outline": "Instagram",
  youtube: "Youtube",
  "youtube-play": "Youtube",
  wechat: "Weixin",
  weixin: "Weixin",
  qq: "Qq",
  "qq-chat": "Qq",
  whatsapp: "Whatsapp",
  telegram: "Telegram",
  linkedin: "Linkedin",
  "linkedin-box": "Linkedin",
  discord: "Discord",
  bilibili: "Video",
  "bilibili-line": "Video",
  tiktok: "Tiktok",
  "tiktok-line": "Tiktok",
  "500px": "Pic",
  phone: "PhoneTelephone",
  "phone-outline": "PhoneTelephone",
  link: "Link",
  "link-variant": "Link",
  web: "Globe",
  earth: "Globe",
  "map-marker": "Local",
  "map-marker-outline": "Local",
  rss: "Rss",
  "rss-box": "Rss",
};

// 其他 Iconify 前缀图标名（小写部分）→ IconPark type 映射
const iconifyToIconPark: Record<string, string> = {
  // 通用名称（不区分前缀）
  github: "Github",
  twitter: "Twitter",
  facebook: "Facebook",
  instagram: "Instagram",
  youtube: "Youtube",
  wechat: "Weixin",
  weixin: "Weixin",
  qq: "Qq",
  whatsapp: "Whatsapp",
  telegram: "Telegram",
  linkedin: "Linkedin",
  discord: "Discord",
  tiktok: "Tiktok",
  bilibili: "Video",
  "bilibili-line": "Video",
  bilibilline: "Video",
  "500px": "Pic",
  email: "Mail",
  mail: "Mail",
  phone: "PhoneTelephone",
  link: "Link",
  globe: "Globe",
  earth: "Globe",
  rss: "Rss",
};

/** 将任意图标名（mdi:xxx / Lucide PascalCase / kebab-case / IconPark type）解析为 IconPark type */
export function resolveIconParkType(icon: string): string {
  if (!icon) return "Pic";
  // IconPark type 直接返回（含 emoji 则返回原值）
  if (!icon.includes(":") && !/^[a-z]/.test(icon)) {
    // 大写开头 - 可能是 Lucide 名或 IconPark type
    return lucideToIconPark[icon] || icon;
  }
  // 处理所有 Iconify 格式（mdi:xxx / Mingcute:xxx / Uil:xxx / Ic:xxx 等）
  if (icon.includes(":")) {
    const prefix = icon.split(":")[0].toLowerCase();
    const name = icon.split(":").slice(1).join(":");
    // 将名称统一转为小写 kebab-case 进行查找
    const normalizedName = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
    // 先查通用 iconify 映射
    if (iconifyToIconPark[normalizedName] || iconifyToIconPark[name.toLowerCase()]) {
      return iconifyToIconPark[normalizedName] || iconifyToIconPark[name.toLowerCase()];
    }
    // 再查 MDI 映射（MDI 名最常用）
    if (mdiToIconPark[normalizedName] || mdiToIconPark[name.toLowerCase()]) {
      return mdiToIconPark[normalizedName] || mdiToIconPark[name.toLowerCase()];
    }
    // 前缀为 mdi 时单独查一次
    if (prefix === "mdi" && mdiToIconPark[name.toLowerCase()]) {
      return mdiToIconPark[name.toLowerCase()];
    }
    // 兜底：返回 Link 图标（适合联系方式场景）
    return "Link";
  }
  // kebab-case 或小写名称（如 "cloud-rain", "zap", "moon"）
  if (/^[a-z]/.test(icon) && !icon.includes(":")) {
    // 先查 kebab-case 映射
    if (kebabToIconPark[icon]) {
      return kebabToIconPark[icon];
    }
    // 再查 MDI 映射（MDI 名也是小写的）
    if (mdiToIconPark[icon]) {
      return mdiToIconPark[icon];
    }
    // 再查通用 iconify 映射
    if (iconifyToIconPark[icon]) {
      return iconifyToIconPark[icon];
    }
    // 兜底：转为 PascalCase 返回（IconPark 内部也会做 toPascalCase）
    // 如果仍无效，DynamicIcon 组件会捕获错误并显示默认图标
    return icon;
  }
  return icon;
}

/** 是否为 emoji（非字符串图标） */
export function isEmoji(icon: string): boolean {
  return !!icon && !icon.includes(":") && [...icon].some((c) => c.codePointAt(0)! > 127);
}

/** 检查图标值是否为旧 Iconify 格式（包含冒号） */
export function isIconifyFormat(icon: string): boolean {
  return icon.includes(":");
}

/** 获取图标显示名称 */
export function getIconDisplayName(icon: string): string {
  if (isIconifyFormat(icon)) {
    return icon.split(":")[1] || icon;
  }
  return icon;
}

export function useIcon() {
  const formatIconName = (name: string): string => {
    // 新方案：直接使用 IconPark type 名，不再自动加 mdi: 前缀
    if (!name.includes(":")) {
      return name;
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
    resolveIconParkType,
  };
}
