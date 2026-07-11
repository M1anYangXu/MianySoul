import * as LucideIcons from "lucide-vue-next";

export interface SceneIconItem {
  name: string;
  icon: any;
}

export const sceneIcons: SceneIconItem[] = Object.entries(LucideIcons)
  .filter(([, value]) => typeof value === "object" && value !== null && "render" in value)
  .map(([name, icon]) => ({ name, icon }))
  .sort((a, b) => a.name.localeCompare(b.name));

export const sceneIconMap: Record<string, any> = {};
sceneIcons.forEach((item) => {
  sceneIconMap[item.name] = item.icon;
});

export const getSceneIcon = (iconName: string): any => {
  return sceneIconMap[iconName] || (LucideIcons as Record<string, any>).Mountain || null;
};

export const isValidIconName = (name: string): boolean => {
  return !!sceneIconMap[name];
};
