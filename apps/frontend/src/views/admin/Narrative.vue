<template>
  <div class="narrative-page max-w-6xl mx-auto">
    <div
      class="mb-6 px-6 py-4 rounded-xl"
      :class="
        isDark
          ? 'bg-gray-800/40 border border-gray-700/30'
          : 'bg-white/40 border border-gray-200/30'
      "
      style="backdrop-filter: blur(12px)"
    >
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <BookOpen class="w-7 h-7 inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            class="px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="openCategoryModal()"
          >
            + 新建分类
          </button>
          <button
            class="px-6 py-2.5 rounded-lg gradient-success text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="openDialog()"
          >
            + 新建叙述
          </button>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="cat in sortedCategories"
          :key="cat.id"
          class="px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center space-x-2"
          :class="[
            filterCategory === cat.id
              ? isDark
                ? 'bg-amber-500 text-white'
                : 'bg-amber-500 text-white'
              : isDark
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
          ]"
          @click="selectFilterCategory(cat.id)"
        >
          <span>{{ cat.icon }}</span>
          <span>{{ cat.name }}</span>
          <span
            class="px-2 py-0.5 rounded-full text-xs"
            :class="
              isDark
                ? filterCategory === cat.id
                  ? 'bg-white/20'
                  : 'bg-gray-700'
                : filterCategory === cat.id
                  ? 'bg-white/20'
                  : 'bg-gray-100'
            "
          >
            {{ cat.count }}
          </span>
        </button>
      </div>
      <div class="flex items-center space-x-2">
        <button
          v-if="filterCategory && !getCategoryById(filterCategory)?.isDefault"
          class="px-3 py-2 text-sm rounded-lg transition-all"
          :class="
            isDark
              ? 'text-gray-400 hover:text-white hover:bg-gray-700'
              : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
          "
          @click="() => openCategoryModal(getCategoryById(filterCategory))"
        >
          <Edit3 class="w-4 h-4 inline mr-1" />
          编辑分类
        </button>
        <button
          v-if="filterCategory && !getCategoryById(filterCategory)?.isDefault"
          class="px-3 py-2 text-sm rounded-lg transition-all"
          :class="
            isDark
              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/20'
              : 'text-red-500 hover:text-red-600 hover:bg-red-50'
          "
          @click="deleteCategory(filterCategory)"
        >
          <Trash2 class="w-4 h-4 inline mr-1" />
          删除分类
        </button>
      </div>
    </div>

    <div
      v-if="loading"
      class="text-center py-8"
      :class="isDark ? 'text-gray-400' : 'text-gray-500'"
    >
      加载中...
    </div>
    <div
      v-else-if="narratives.length === 0"
      class="text-center py-12 rounded-xl border-2 border-dashed"
      :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
    >
      <BookOpen
        class="w-12 h-12 mx-auto mb-3"
        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
      />
      <p>还没有叙述</p>
      <p class="text-sm mt-1">记录下过去的故事吧</p>
    </div>
    <div v-else class="space-y-3">
      <div
        v-for="item in narratives"
        :key="item.id"
        class="narrative-card flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
        :class="[
          isDark
            ? 'bg-gray-800/60 border-gray-700/50 hover:border-amber-500/30'
            : 'bg-white/70 border-gray-200/50 hover:border-amber-200',
        ]"
        style="backdrop-filter: blur(12px)"
      >
        <div class="flex-shrink-0 relative">
          <div
            v-if="item.media.length > 0"
            class="w-24 h-16 rounded-lg overflow-hidden border"
            :class="isDark ? 'border-gray-700' : 'border-gray-200'"
          >
            <img
              v-if="item.media[0].type === 'image'"
              :src="getFullImageUrl(item.media[0].mediaUrl)"
              :alt="item.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="relative w-full h-full bg-gray-700">
              <img
                v-if="item.media[0].thumbnail && item.media[0].thumbnail !== item.media[0].mediaUrl"
                :src="getFullImageUrl(item.media[0].thumbnail)"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
              <video
                v-else
                :src="getFullImageUrl(item.media[0].mediaUrl)"
                class="w-full h-full object-cover"
                muted
                preload="metadata"
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                <Video class="w-5 h-5 text-white" />
              </div>
            </div>
            <span
              v-if="item.media.length > 1"
              class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-xs font-medium"
              :class="isDark ? 'bg-gray-900/80 text-gray-300' : 'bg-black/60 text-white'"
            >
              +{{ item.media.length - 1 }}
            </span>
          </div>
          <div
            v-else
            class="w-24 h-16 flex items-center justify-center rounded-lg"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <component
              :is="item.type === 'video' ? Video : ImageIcon"
              class="w-8 h-8"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
          </div>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3
              class="font-medium truncate cursor-pointer transition-colors"
              :class="
                isDark
                  ? 'text-white group-hover:text-amber-300'
                  : 'text-gray-900 group-hover:text-amber-600'
              "
              @click="openDialog(item)"
            >
              {{ item.title }}
            </h3>
            <span
              class="px-2 py-0.5 rounded-md text-xs font-medium flex-shrink-0"
              :class="
                item.type === 'video'
                  ? 'bg-blue-500/20 text-blue-400'
                  : 'bg-violet-500/20 text-violet-400'
              "
            >
              {{ item.type === "video" ? "视频" : "图片" }}
            </span>
          </div>
          <p
            class="text-sm leading-relaxed line-clamp-2"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            {{ item.description }}
          </p>
          <div class="flex items-center gap-3 text-sm">
            <span
              class="px-2 py-0.5 rounded-full text-xs font-medium"
              :class="isDark ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-100 text-amber-600'"
            >
              {{ item.category?.name || "默认分类" }}
            </span>
          </div>
        </div>

        <div class="flex-shrink-0 flex flex-col items-end gap-2">
          <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            {{ item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "" }}
          </span>
          <div class="flex items-center gap-1">
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
              "
              title="编辑"
              @click="openDialog(item)"
            >
              <Edit3 class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              :class="
                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              "
              title="删除"
              @click="deleteNarrative(item)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑对话框 -->
    <div
      v-if="showDialog"
      class="fixed inset-0 z-50 flex items-center justify-center"
      @click.self="closeDialog()"
    >
      <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        class="relative w-full max-w-2xl mx-4 rounded-2xl border shadow-2xl max-h-[90vh] overflow-hidden"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="px-6 py-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h2 class="text-lg font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ editingItem ? "编辑叙述" : "新建叙述" }}
            </h2>
            <button
              class="p-2 rounded-lg transition-all"
              :class="
                isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-500'
              "
              @click="closeDialog()"
            >
              <X class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div class="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div class="space-y-5">
            <div>
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                标题
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all duration-300"
                :class="
                  isDark
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                    : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
                "
                placeholder="输入叙述标题"
              />
            </div>

            <div>
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                描述
                <span class="text-red-500">*</span>
              </label>
              <textarea
                v-model="form.description"
                rows="4"
                class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none transition-all duration-300"
                :class="
                  isDark
                    ? 'border-gray-600/50 bg-gray-700/50 text-white placeholder-gray-500'
                    : 'border-gray-200/50 bg-white/50 text-gray-900 placeholder-gray-400'
                "
                placeholder="写下这段故事..."
              ></textarea>
            </div>

            <div>
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                分类
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="cat in categories"
                  :key="cat.id"
                  class="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                  :class="[
                    form.categoryId === cat.id
                      ? 'bg-amber-500 text-white'
                      : isDark
                        ? 'bg-gray-700 text-gray-400 hover:bg-gray-600 border border-gray-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-gray-200',
                  ]"
                  @click="form.categoryId = cat.id"
                >
                  {{ cat.icon }} {{ cat.name }}
                </button>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-2">
                <label
                  class="text-sm font-medium"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  类型与媒体
                </label>
                <div class="flex items-center gap-2">
                  <div
                    class="flex rounded-lg overflow-hidden border"
                    :class="isDark ? 'border-gray-600' : 'border-gray-200'"
                  >
                    <button
                      class="px-4 py-1.5 text-sm font-medium transition-all"
                      :class="
                        form.type === 'image'
                          ? 'bg-violet-500 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-400 hover:text-gray-200'
                            : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                      "
                      @click="
                        form.type = 'image';
                        form.media = [];
                      "
                    >
                      <ImageIcon class="w-4 h-4 inline mr-1" />
                      图片
                    </button>
                    <button
                      class="px-4 py-1.5 text-sm font-medium transition-all"
                      :class="
                        form.type === 'video'
                          ? 'bg-violet-500 text-white'
                          : isDark
                            ? 'bg-gray-700 text-gray-400 hover:text-gray-200'
                            : 'bg-gray-100 text-gray-500 hover:text-gray-700'
                      "
                      @click="
                        form.type = 'video';
                        form.media = [];
                      "
                    >
                      <Video class="w-4 h-4 inline mr-1" />
                      视频
                    </button>
                  </div>
                </div>
              </div>

              <div
                class="relative rounded-xl border-2 border-dashed p-6 text-center transition-all cursor-pointer"
                :class="
                  form.media.length > 0
                    ? isDark
                      ? 'border-gray-600 bg-gray-700/30'
                      : 'border-gray-300 bg-gray-50'
                    : isDark
                      ? 'border-gray-700 hover:border-gray-500 bg-gray-800/30'
                      : 'border-gray-200 hover:border-gray-400 bg-white/50'
                "
                @click="openMediaPicker"
              >
                <template v-if="form.media.length === 0">
                  <component
                    :is="form.type === 'image' ? ImageIcon : Video"
                    class="w-12 h-12 mx-auto mb-3"
                    :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                  />
                  <p class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    {{ form.type === "video" ? "点击选择视频" : "点击选择图片" }}
                  </p>
                </template>
                <template v-else>
                  <div class="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    <div
                      v-for="(media, index) in form.media"
                      :key="media.id || index"
                      class="relative aspect-square rounded-lg overflow-hidden border"
                      :class="isDark ? 'border-gray-700' : 'border-gray-200'"
                    >
                      <img
                        v-if="media.type === 'image'"
                        :src="getFullImageUrl(media.mediaUrl)"
                        :alt="`媒体${index + 1}`"
                        class="w-full h-full object-cover"
                      />
                      <div v-else class="relative w-full h-full bg-gray-700">
                        <img
                          v-if="media.thumbnail && media.thumbnail !== media.mediaUrl"
                          :src="getFullImageUrl(media.thumbnail)"
                          :alt="`视频${index + 1}`"
                          class="w-full h-full object-cover"
                        />
                        <video
                          v-else
                          :src="getFullImageUrl(media.mediaUrl)"
                          class="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                          <Video class="w-6 h-6 text-white" />
                        </div>
                      </div>
                      <button
                        class="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500/90 text-white flex items-center justify-center hover:bg-red-600 transition-colors z-10"
                        @click.stop="removeMedia(index)"
                      >
                        <X class="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                  <p class="mt-3 text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                    已选择 {{ form.media.length }} 个{{
                      form.type === "video" ? "视频" : "图片"
                    }}，点击继续添加
                  </p>
                </template>
              </div>
            </div>
          </div>
        </div>

        <div
          class="px-6 py-4 border-t flex justify-end space-x-3"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-6 py-2.5 rounded-lg text-sm font-medium transition-all"
            :class="
              isDark
                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="closeDialog()"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 rounded-lg gradient-primary text-white text-sm font-medium hover:opacity-90 transition-all duration-300"
            @click="saveNarrative()"
          >
            {{ editingItem ? "保存" : "创建" }}
          </button>
        </div>
      </div>
    </div>

    <!-- 图片选择弹窗 -->
    <div
      v-if="showImagePicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showImagePicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">选择图片</h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showImagePicker = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in imageGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                selectedGroupId === group.id
                  ? 'bg-pink-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="selectedGroupId = group.id"
            >
              {{ group.icon }} {{ group.name }}
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div
            v-if="imagesLoading"
            class="text-center py-8"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            加载中...
          </div>
          <div
            v-else-if="filteredImages.length === 0"
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <ImageIcon
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p>该分组暂无图片</p>
            <p class="text-sm mt-1">请选择其他分组或先上传图片</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in filteredImages"
              :key="img.id"
              class="relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
              :class="
                tempSelectedImages.includes(img.url)
                  ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-400'
              "
              @click="toggleTempImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-32 object-cover"
              />
              <div
                v-if="tempSelectedImages.includes(img.url)"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="p-4 border-t flex justify-end space-x-3"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="showImagePicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-xl gradient-success text-white text-sm font-medium"
            @click="confirmImages"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 视频选择弹窗 -->
    <div
      v-if="showVideoPicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showVideoPicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">选择视频</h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showVideoPicker = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in videoGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                selectedVideoGroupId === group.id
                  ? 'bg-pink-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="selectVideoGroup(group.id)"
            >
              {{ group.icon }} {{ group.name }}
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div
            v-if="videosLoading"
            class="text-center py-8"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            加载中...
          </div>
          <div
            v-else-if="videos.length === 0"
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <Video
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p>该分组暂无视频</p>
            <p class="text-sm mt-1">请选择其他分组或先上传视频</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="video in videos"
              :key="video.id"
              class="relative aspect-video cursor-pointer rounded-lg overflow-hidden border-2 transition-all"
              :class="
                tempSelectedVideos.includes(video.url)
                  ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-400'
              "
              @click="toggleTempVideo(video)"
            >
              <img
                v-if="video.thumbnail"
                :src="getFullImageUrl(video.thumbnail)"
                :alt="video.filename"
                class="w-full h-full object-cover"
              />
              <video
                v-else
                :src="getFullImageUrl(video.url)"
                class="w-full h-full object-cover"
                muted
              />
              <div class="absolute inset-0 flex items-center justify-center bg-black/30">
                <div class="w-12 h-12 rounded-full bg-black/50 flex items-center justify-center">
                  <Video class="w-6 h-6 text-white" />
                </div>
              </div>
              <div
                v-if="tempSelectedVideos.includes(video.url)"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
        <div
          class="p-4 border-t flex justify-end space-x-3"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-4 py-2 rounded-xl border text-sm font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="showVideoPicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-xl gradient-success text-white text-sm font-medium"
            @click="confirmVideos"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 分类管理弹窗 -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showCategoryModal = false"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-5 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">
            {{ editingCategory ? "编辑分类" : "新建分类" }}
          </h2>
        </div>

        <div class="p-5">
          <div class="mb-4">
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              分类名称
            </label>
            <input
              v-model="categoryForm.name"
              type="text"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="请输入分类名称"
            />
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              图标
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="option in iconOptions"
                :key="option.emoji"
                class="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center text-lg"
                :class="
                  categoryForm.icon === option.emoji
                    ? 'ring-2 ring-amber-500 bg-amber-100 dark:bg-amber-900/30'
                    : ''
                "
                @click="categoryForm.icon = option.emoji"
              >
                {{ option.emoji }}
              </button>
            </div>
          </div>

          <div class="flex justify-end space-x-2 mt-4">
            <button
              class="px-4 py-2 rounded-lg text-sm"
              :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
              @click="showCategoryModal = false"
            >
              取消
            </button>
            <button
              class="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium"
              :disabled="!categoryForm.name.trim()"
              @click="saveCategory"
            >
              保存
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { BookOpen, Edit3, Trash2, X, Video, ImageIcon } from "lucide-vue-next";
import { useMessage, useModuleConfig } from "@/composables";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription } = useModuleConfig();

const moduleName = computed(() => getModuleName("narrative"));
const moduleDescription = computed(() => getModuleDescription("narrative"));

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const loading = ref(false);
const narratives = ref<any[]>([]);
const showDialog = ref(false);
const editingItem = ref<any>(null);
const showImagePicker = ref(false);
const showVideoPicker = ref(false);

const images = ref<any[]>([]);
const imagesLoading = ref(false);
const imageGroups = ref<any[]>([]);
const selectedGroupId = ref<string | null>(null);
const tempSelectedImages = ref<string[]>([]);

const videos = ref<any[]>([]);
const videosLoading = ref(false);
const videoGroups = ref<any[]>([]);
const selectedVideoGroupId = ref<string | null>(null);
const tempSelectedVideos = ref<string[]>([]);

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const categories = ref<any[]>([]);
const filterCategory = ref("");
const showCategoryModal = ref(false);
const editingCategory = ref<any>(null);
const iconOptions = [
  { emoji: "📁" },
  { emoji: "📚" },
  { emoji: "📖" },
  { emoji: "✨" },
  { emoji: "💫" },
  { emoji: "🌙" },
  { emoji: "☀️" },
  { emoji: "🌸" },
  { emoji: "🌺" },
  { emoji: "🍃" },
];

const categoryForm = ref({
  name: "",
  icon: "📁",
});

const sortedCategories = computed(() => {
  const result = [...categories.value];
  const defaultIndex = result.findIndex((c) => c.isDefault);
  if (defaultIndex > 0) {
    const defaultCat = result.splice(defaultIndex, 1)[0];
    result.unshift(defaultCat);
  }
  return result;
});

const getCategoryById = (id: string): any => {
  return categories.value.find((c) => c.id === id);
};

const form = ref({
  title: "",
  description: "",
  type: "image",
  categoryId: "",
  media: [] as { id?: string; mediaUrl: string; thumbnail?: string; type?: string }[],
});

const fetchCategories = async () => {
  try {
    const data = await http.get<any[]>("/narrative/categories/list");
    categories.value =
      data.length > 0
        ? data
        : [{ id: "", name: "默认分类", icon: "📁", isDefault: true, count: 0 }];
  } catch {
    categories.value = [{ id: "", name: "默认分类", icon: "📁", isDefault: true, count: 0 }];
  }
};

const fetchNarratives = async () => {
  loading.value = true;
  try {
    const url = filterCategory.value
      ? `/narrative/admin/list?categoryId=${filterCategory.value}`
      : "/narrative/admin/list";
    const res = await http.get<{ list: any[] }>(url);
    narratives.value = res.list || res;
  } catch (e) {
    console.error("获取叙述列表失败:", e);
  } finally {
    loading.value = false;
  }
};

const selectFilterCategory = (catId: string) => {
  filterCategory.value = catId;
  fetchNarratives();
};

const openCategoryModal = (category?: any) => {
  if (category) {
    editingCategory.value = category;
    categoryForm.value = {
      name: category.name,
      icon: category.icon,
    };
  } else {
    editingCategory.value = null;
    categoryForm.value = {
      name: "",
      icon: "📁",
    };
  }
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  const name = categoryForm.value.name.trim();
  if (!name) {
    error("请输入分类名称");
    return;
  }
  if (categories.value.some((c) => c.name === name && c.id !== editingCategory.value?.id)) {
    error("分类已存在");
    return;
  }
  try {
    if (editingCategory.value) {
      await http.put(`/narrative/categories/${editingCategory.value.id}`, {
        name: categoryForm.value.name,
        icon: categoryForm.value.icon,
      });
    } else {
      await http.post("/narrative/categories", {
        name: categoryForm.value.name,
        icon: categoryForm.value.icon,
      });
    }
    await fetchCategories();
    categoryForm.value = { name: "", icon: "📁" };
    editingCategory.value = null;
    showCategoryModal.value = false;
    success(editingCategory.value ? "分类更新成功" : "分类添加成功");
  } catch (e) {
    error(e instanceof Error ? e.message : editingCategory.value ? "更新分类失败" : "添加分类失败");
  }
};

const deleteCategory = async (catId: string) => {
  const category = getCategoryById(catId);
  if (!category) return;
  if (category.count > 0) {
    error("该分类下存在叙述，无法删除");
    return;
  }
  try {
    await http.delete(`/narrative/categories/${catId}`);
    await fetchCategories();
    if (filterCategory.value === catId) {
      filterCategory.value = "";
      fetchNarratives();
    }
    success("分类删除成功");
  } catch (e) {
    error(e instanceof Error ? e.message : "删除分类失败");
  }
};

const openDialog = (item?: any) => {
  if (item) {
    editingItem.value = item;
    form.value = {
      title: item.title,
      description: item.description,
      type: item.type,
      categoryId: item.categoryId || "",
      media: item.media.map((m: any) => ({
        id: m.id,
        mediaUrl: m.mediaUrl,
        thumbnail: m.thumbnail,
        type: m.type,
      })),
    };
  } else {
    editingItem.value = null;
    form.value = {
      title: "",
      description: "",
      type: "image",
      categoryId: categories.value.find((c) => c.isDefault)?.id || categories.value[0]?.id || "",
      media: [],
    };
  }
  showDialog.value = true;
};

const closeDialog = () => {
  showDialog.value = false;
  editingItem.value = null;
  form.value = {
    title: "",
    description: "",
    type: "image",
    categoryId: "",
    media: [],
  };
};

const fetchImages = async () => {
  imagesLoading.value = true;
  try {
    const imgData = await http.get<any>("/gallery/images?pageSize=100");
    images.value = (imgData.list || []).map((img: any) => ({
      id: img.id,
      url: img.url,
      filename: img.filename,
      group: img.group ? { id: img.group.id, name: img.group.name, icon: img.group.icon } : null,
    }));
    imageGroups.value = await http.get<any[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || imageGroups.value[0]?.id || null;
  } catch (e) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  } finally {
    imagesLoading.value = false;
  }
};

const fetchVideos = async () => {
  videosLoading.value = true;
  try {
    videoGroups.value = await http.get<any[]>("/video/groups");
    const defaultGroup =
      videoGroups.value.find((g) => g.name === "默认分组") || videoGroups.value[0];
    if (defaultGroup) {
      await selectVideoGroup(defaultGroup.id);
    }
  } catch (e) {
    videoGroups.value = [];
    videos.value = [];
    selectedVideoGroupId.value = null;
  } finally {
    videosLoading.value = false;
  }
};

const selectVideoGroup = async (groupId: string) => {
  selectedVideoGroupId.value = groupId;
  videosLoading.value = true;
  try {
    const videoData = await http.get<any>(`/video/groups/${groupId}/videos?pageSize=50`);
    videos.value = videoData.list || videoData;
  } catch (e) {
    videos.value = [];
  } finally {
    videosLoading.value = false;
  }
};

const openMediaPicker = () => {
  if (form.value.type === "image") {
    fetchImages();
    tempSelectedImages.value = form.value.media
      .filter((m) => m.type === "image")
      .map((m) => m.mediaUrl);
    showImagePicker.value = true;
  } else {
    fetchVideos();
    tempSelectedVideos.value = form.value.media
      .filter((m) => m.type === "video")
      .map((m) => m.mediaUrl);
    showVideoPicker.value = true;
  }
};

const toggleTempImage = (img: any) => {
  const index = tempSelectedImages.value.indexOf(img.url);
  if (index > -1) {
    tempSelectedImages.value.splice(index, 1);
  } else {
    tempSelectedImages.value.push(img.url);
  }
};

const toggleTempVideo = (video: any) => {
  const index = tempSelectedVideos.value.indexOf(video.url);
  if (index > -1) {
    tempSelectedVideos.value.splice(index, 1);
  } else {
    tempSelectedVideos.value.push(video.url);
  }
};

const confirmImages = () => {
  const currentVideos = form.value.media.filter((m) => m.type === "video");
  const newImages = tempSelectedImages.value.map((url) => ({
    mediaUrl: url,
    thumbnail: url,
    type: "image",
  }));
  form.value.media = [...currentVideos, ...newImages];
  showImagePicker.value = false;
};

const confirmVideos = () => {
  const currentImages = form.value.media.filter((m) => m.type === "image");
  const newVideos = tempSelectedVideos.value.map((url) => {
    const video = videos.value.find((v) => v.url === url);
    const mediaItem: { mediaUrl: string; thumbnail?: string; type: string } = {
      mediaUrl: url,
      type: "video",
    };
    if (video && video.thumbnail && video.thumbnail !== url) {
      mediaItem.thumbnail = video.thumbnail;
    }
    return mediaItem;
  });
  form.value.media = [...currentImages, ...newVideos];
  showVideoPicker.value = false;
};

const removeMedia = (index: number) => {
  form.value.media.splice(index, 1);
};

const saveNarrative = async () => {
  if (!form.value.title.trim() || !form.value.description.trim()) {
    error("请填写标题和描述");
    return;
  }

  try {
    if (editingItem.value) {
      await http.put(`/narrative/${editingItem.value.id}`, form.value);
      success("更新成功");
    } else {
      await http.post("/narrative", form.value);
      success("创建成功");
    }
    closeDialog();
    await fetchNarratives();
  } catch (e) {
    error("保存失败");
  }
};

const deleteNarrative = async (item: any) => {
  if (!confirm(`确定要删除"${item.title}"吗？`)) return;

  try {
    await http.delete(`/narrative/${item.id}`);
    success("删除成功");
    await fetchNarratives();
  } catch (e) {
    error("删除失败");
  }
};

onMounted(async () => {
  await fetchCategories();
  await fetchNarratives();
});
</script>

<style scoped>
.narrative-card:hover {
  box-shadow:
    0 10px 20px -8px rgba(245, 158, 11, 0.15),
    0 0 20px rgba(245, 158, 11, 0.04);
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
