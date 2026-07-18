# 前端布局设计指南

## 核心布局原则

### 1. 空间高效利用

**原则**：避免功能重复，通过直观的交互设计减少冗余元素。

**示例**：封面图片选择区域，点击图片本身即可打开选择器，无需额外的"更换封面"按钮。

**代码模式**：

```vue
<button @click="openCoverPicker" class="relative w-full aspect-square">
  <img :src="coverUrl" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black/0 hover:bg-black/30">
    <!-- 悬浮提示 -->
  </div>
</button>
```

### 2. 并列布局优化

**原则**：对于关联性强的操作（如封面+音频），采用并排布局而非上下排列，提升操作效率。

**示例**：封面图片和音频文件放在同一行，各占一半宽度。

**代码模式**：

```vue
<div class="flex gap-4">
  <div class="flex-1">
    <!-- 封面选择 -->
  </div>
  <div class="flex-1">
    <!-- 音频选择 -->
  </div>
</div>
```

### 3. 大尺寸按钮设计

**原则**：对于重要的选择操作，使用方形大按钮（aspect-square），提升视觉权重和点击便捷性。

**优势**：

- 更大的点击区域，减少误操作
- 更直观的视觉反馈
- 统一的视觉风格

### 4. 便捷操作按钮

**原则**：在选中内容的右上角添加小型删除按钮，提供一键移除功能。

**代码模式**：

```vue
<button
  class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white"
  @click.stop="removeItem"
>
  <Trash2 class="w-4 h-4" />
</button>
```

## 视觉设计原则

### 1. 悬浮交互反馈

**原则**：悬浮时显示明显的视觉反馈，如半透明遮罩+操作图标。

**效果**：提升可交互性感知，引导用户操作。

### 2. 主题一致性

**原则**：使用统一的主题色（primary）和辅助色（accent），确保全站视觉风格一致。

**应用**：边框颜色、按钮颜色、高亮效果均使用主题色。

### 3. 明暗主题适配

**原则**：所有组件必须适配明暗主题，使用条件类名切换样式。

**代码模式**：

```vue
:class="isDark ? 'bg-gray-800' : 'bg-white'"
```

## 组件设计模式

### 图片选择器

**设计要点**：

- 选中状态使用主题色边框（border-primary-500）
- 添加光环效果（ring-4 ring-primary-500/40）
- 添加阴影效果（shadow-lg shadow-primary-500/30）
- 选中标记放在右上角（w-6 h-6 圆形）
- 未选中状态有悬浮边框反馈

**代码模式**：

```vue
<div
  class="relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
  :class="selected === img.url
    ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
    : isDark ? 'border-gray-700 hover:border-gray-500' : 'border-gray-200 hover:border-gray-400'"
  @click="selectItem(img)"
>
  <img :src="img.url" class="w-full h-32 object-cover" />
  <div v-if="selected === img.url" class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
    <span class="text-white text-xs">✓</span>
  </div>
</div>
```

## 性能优化建议

### 1. 条件渲染

**原则**：使用 v-if 而非 v-show 隐藏不常用的元素，减少 DOM 节点。

### 2. 响应式加载

**原则**：图片使用懒加载（loading="lazy"），提升页面加载速度。

### 3. 动画优化

**原则**：使用 CSS 动画而非 JavaScript 动画，利用 GPU 加速。

## 代码规范

### 1. 类名组织

**原则**：按功能分组类名，使用 Tailwind CSS 的响应式前缀。

**示例**：

```vue
class="w-full md:w-1/2 lg:w-1/3 p-4 md:p-6"
```

### 2. 状态管理

**原则**：使用 ref/reactive 管理组件状态，避免直接操作 DOM。

### 3. 事件处理

**原则**：事件处理函数定义在 script setup 中，避免内联函数。

## 实战案例：歌词页面布局优化

### 1. 动态卡片尺寸

**需求**：根据歌词长度动态调整卡片宽度，形成错落有致的视觉效果。

**实现方案**：

```typescript
const getCardSizeClass = (lyric: LyricItem) => {
  const length = lyric.lyric.length;
  if (length > 400) {
    return "col-span-1 md:col-span-2 lg:col-span-2";
  } else if (length > 250) {
    return "col-span-1 md:col-span-2";
  } else {
    return "col-span-1";
  }
};
```

**效果**：长歌词卡片更宽，短歌词卡片紧凑，整体布局富有层次感。

### 2. 冗余信息隐藏

**需求**：当用户在具体分类下时，卡片内不再显示分类标签（冗余）。

**实现方案**：

```vue
<span
  v-if="
    !selectedCategory &&
    getLyricCategoryName(lyric) !== '未分类' &&
    getLyricCategoryName(lyric) !== '默认分类'
  "
>
  {{ getLyricCategoryName(lyric) }}
</span>
```

**原则**：上下文已明确的信息无需重复显示。

### 3. 信息层级优化

**需求**：歌手和歌名放在同一行，提升空间利用率。

**实现方案**：

```vue
<div class="flex items-center justify-between">
  <div class="flex items-center gap-3 flex-1 min-w-0">
    <span class="px-3 py-1 rounded-full text-xs font-semibold shrink-0">
      {{ lyric.singer }}
    </span>
    <h3 class="text-lg font-bold truncate">
      {{ lyric.songName }}
    </h3>
  </div>
  <button v-if="lyric.audio" class="w-7 h-7 rounded-full shrink-0 ml-3">
    {{ playingId === lyric.id ? "⏸" : "▶" }}
  </button>
</div>
```

**要点**：使用 `flex-1` 和 `truncate` 确保歌名在空间不足时自动截断。

### 4. 内容截断与展开

**需求**：长歌词默认只显示部分内容，避免卡片过长。

**实现方案**：

```vue
<p
  class="text-sm leading-loose"
  :class="expandedLyrics.has(lyric.id) ? '' : 'line-clamp-4'"
  style="white-space: pre-wrap"
>
  {{ lyric.lyric }}
</p>
<button v-if="lyric.lyric.length > 100" @click.stop="toggleLyricExpand(lyric.id)">
  {{ expandedLyrics.has(lyric.id) ? '收起' : '展开' }}
</button>
```

**状态管理**：使用 `Set<string>` 管理展开状态，避免每个歌词项都创建单独的 ref。

### 5. 默认分类选中

**需求**：页面加载时自动选中第一个分类。

**实现方案**：

```typescript
categories.value = Array.from(cats).sort();

if (categories.value.length > 0 && !selectedCategory.value) {
  setTimeout(() => {
    selectCategory(categories.value[0]);
  }, 100);
}
```

**要点**：使用 `setTimeout` 确保 DOM 更新完成后再触发动画。

### 6. 图片完整显示

**需求**：封面图片完整显示，不被裁剪。

**实现方案**：

```vue
<div class="rounded-xl overflow-hidden bg-gray-900">
  <img
    :src="getFullImageUrl(lyric.coverImage)"
    class="w-full h-full object-contain"
  />
</div>
```

**要点**：使用 `object-contain` 而非 `object-cover`，确保图片完整显示。

## 总结

好的布局设计应该：

1. **直观** - 用户无需思考即可完成操作
2. **高效** - 最少的步骤完成目标
3. **美观** - 符合视觉层次和审美原则
4. **一致** - 全站风格统一
5. **适配** - 支持不同屏幕尺寸和主题模式
