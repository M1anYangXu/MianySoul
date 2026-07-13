<template>
  <div class="max-w-6xl mx-auto">
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
            <FileMusic class="w-7 h-7 inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button
            class="px-6 py-2.5 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="() => openCategoryModal()"
          >
            + 新建分类
          </button>
          <button
            class="px-6 py-2 gradient-success text-white rounded-xl font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="openAddModal"
          >
            + 添加歌词
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
                ? 'bg-violet-500 text-white'
                : 'bg-violet-500 text-white'
              : isDark
                ? 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200',
          ]"
          @click="selectFilterCategory(cat.id)"
        >
          <component :is="getIconComponent(cat.icon)" class="w-4 h-4" />
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
      class="rounded-xl border p-4 mb-6"
      :class="isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white border-gray-200/50'"
    >
      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-md">
          <Search class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索歌手、歌名或歌词..."
            class="w-full pl-11 pr-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-base"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />
        </div>

        <button
          class="px-5 py-2.5 rounded-xl border transition-colors text-base font-medium"
          :class="
            isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          "
          @click="resetFilter"
        >
          重置
        </button>
      </div>
    </div>

    <div class="space-y-3">
      <div
        v-for="lyric in filteredLyrics"
        :key="lyric.id"
        class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
        :class="
          isDark
            ? 'bg-gray-800/60 border-gray-700/50 hover:border-cyan-500/30'
            : 'bg-white border-gray-200/50 hover:border-cyan-200'
        "
      >
        <div class="flex-shrink-0">
          <img
            v-if="lyric.coverImage"
            :src="getFullImageUrl(lyric.coverImage)"
            :alt="lyric.songName"
            class="w-16 h-16 object-cover rounded-lg"
          />
          <span
            v-else
            class="w-16 h-16 flex items-center justify-center rounded-lg"
            :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
          >
            <FileMusic class="w-8 h-8" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
          </span>
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-1">
            <h3
              class="font-medium truncate cursor-pointer transition-colors"
              :class="
                isDark
                  ? 'text-white group-hover:text-cyan-300'
                  : 'text-gray-900 group-hover:text-cyan-600'
              "
              @click="openEditModal(lyric)"
            >
              {{ lyric.songName }}
            </h3>
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              - {{ lyric.singer }}
            </span>
          </div>
          <div class="flex items-center gap-3 text-sm">
            <span
              class="truncate line-clamp-1"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              :title="lyric.lyric"
            >
              {{ truncateText(lyric.lyric, 50) }}
            </span>
          </div>
        </div>

        <div class="flex-shrink-0 flex items-center gap-4">
          <span
            class="px-2 py-1 rounded-full text-xs font-medium"
            :class="isDark ? 'bg-violet-500/20 text-violet-300' : 'bg-violet-100 text-violet-600'"
          >
            {{ lyric.categoryRel?.name || "默认分类" }}
          </span>
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              title="移动到分组"
              @click="openMoveDialog(lyric)"
            >
              <FolderOpen class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              title="编辑"
              @click="openEditModal(lyric)"
            >
              <Edit3 class="w-4 h-4" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              :class="
                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              "
              title="删除"
              @click="deleteLyric(lyric)"
            >
              <Trash2 class="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="lyrics.length === 0" class="text-center py-16">
        <FileMusic
          class="w-16 h-16 mx-auto mb-4"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        />
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">暂无歌词数据</p>
      </div>
    </div>

    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="closeModal"
    >
      <div
        class="w-full max-w-lg rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-5 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-black'">
            {{ editingLyric ? "编辑歌词" : "添加歌词" }}
          </h2>
        </div>

        <div class="p-5 space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                歌手
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.singer"
                type="text"
                class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
                placeholder="歌手名"
              />
            </div>
            <div>
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                歌名
                <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.songName"
                type="text"
                class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
                placeholder="歌曲名"
              />
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              歌词段
              <span class="text-red-500">*</span>
            </label>
            <textarea
              v-model="form.lyric"
              rows="5"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 resize-none"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
              placeholder="输入歌词内容"
            ></textarea>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              封面图片
            </label>
            <div class="flex space-x-2">
              <button
                class="flex-1 px-3 py-2 rounded-lg border border-dashed text-sm flex items-center justify-center space-x-2 transition-colors"
                :class="
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                "
                @click="openCoverPicker"
              >
                <Image class="w-4 h-4" />
                <span>{{ form.coverImage ? "更换封面" : "选择封面" }}</span>
              </button>
              <button
                v-if="form.coverImage"
                class="px-3 py-2 rounded-lg border text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                @click="form.coverImage = ''"
              >
                移除
              </button>
            </div>
            <div v-if="form.coverImage" class="mt-2">
              <div class="relative w-24 h-24 rounded-lg overflow-hidden">
                <img
                  :src="getFullImageUrl(form.coverImage)"
                  alt="封面预览"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              音频文件
            </label>
            <div class="flex space-x-2">
              <button
                class="flex-1 px-3 py-2 rounded-lg border border-dashed text-sm flex items-center justify-center space-x-2 transition-colors"
                :class="
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                    : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100'
                "
                @click="openAudioPicker"
              >
                <Music class="w-4 h-4" />
                <span>{{ selectedAudio ? selectedAudio.filename : "选择音频" }}</span>
              </button>
              <button
                v-if="selectedAudio"
                class="px-3 py-2 rounded-lg border text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
                @click="clearAudio"
              >
                移除
              </button>
            </div>
            <div v-if="selectedAudio" class="mt-2">
              <div
                class="flex items-center gap-2 text-sm"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                <Music class="w-4 h-4 inline mr-2" />
                <span class="truncate">{{ selectedAudio.filename }}</span>
                <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  {{ formatFileSize(selectedAudio.size) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div
          class="p-5 border-t flex justify-end space-x-3"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-5 py-2 border rounded-lg font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="closeModal"
          >
            取消
          </button>
          <button
            :disabled="saving"
            class="px-5 py-2 gradient-success text-white rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
            @click="saveLyric"
          >
            {{ saving ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

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
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
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
                class="w-8 h-8 rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center justify-center"
                :class="
                  categoryForm.icon === option.emoji
                    ? 'ring-2 ring-purple-500 bg-purple-100 dark:bg-purple-900/30'
                    : ''
                "
                @click="categoryForm.icon = option.emoji"
              >
                <component
                  :is="option.icon"
                  class="w-4 h-4"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                />
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

    <div
      v-if="showCoverPicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showCoverPicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
              选择封面图片
            </h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showCoverPicker = false"
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
                  ? 'bg-cyan-500 text-white'
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
            <Image
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
              class="relative cursor-pointer rounded-lg overflow-hidden border-2 hover:border-cyan-500 transition-all group"
              :class="
                form.coverImage === img.url
                  ? 'border-cyan-500 ring-2 ring-cyan-500/50'
                  : isDark
                    ? 'border-gray-700'
                    : 'border-gray-200'
              "
              @click="selectCoverImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-32 object-cover"
              />
              <div
                v-if="form.coverImage === img.url"
                class="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <span class="text-white text-xl">✓</span>
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
            @click="showCoverPicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-xl gradient-success text-white text-sm font-medium"
            @click="confirmCoverImage"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showMoveDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showMoveDialog = false"
    >
      <div
        class="w-full max-w-sm p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          移动歌词
        </h2>
        <div class="space-y-2">
          <div
            v-for="cat in sortedCategories"
            :key="cat.id"
            class="p-3 rounded-lg border cursor-pointer transition-all"
            :class="[
              movingLyric?.categoryId === cat.id
                ? isDark
                  ? 'bg-gray-700 border-purple-500'
                  : 'bg-purple-50 border-purple-500'
                : isDark
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300',
            ]"
            @click="moveLyricTo(cat)"
          >
            <div class="flex items-center space-x-2">
              <component :is="getIconComponent(cat.icon)" class="w-4 h-4" />
              <span class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ cat.name }}
              </span>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showMoveDialog = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showAudioPicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showAudioPicker = false"
    >
      <div
        class="w-full max-w-3xl max-h-[80vh] overflow-hidden rounded-2xl shadow-2xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">选择音频</h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showAudioPicker = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in audioGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                selectedAudioGroupId === group.id
                  ? 'bg-cyan-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="selectedAudioGroupId = group.id"
            >
              <component :is="getIconComponent(group.icon || '📁')" class="w-3 h-3 inline mr-1" />
              {{ group.name }}
            </button>
          </div>
          <div class="mt-3">
            <input
              v-model="audioSearchKeyword"
              type="text"
              placeholder="搜索音频..."
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
            />
          </div>
        </div>
        <div class="p-4 overflow-y-auto max-h-[50vh]">
          <div
            v-if="audiosLoading"
            class="text-center py-8"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            加载中...
          </div>
          <div
            v-else-if="filteredAudios.length === 0"
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <FileMusic
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p>暂无音频</p>
            <p class="text-sm mt-1">请先上传音频文件</p>
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="audio in filteredAudios"
              :key="audio.id"
              class="flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all"
              :class="
                selectedAudio?.id === audio.id
                  ? 'border-cyan-500 bg-cyan-500/10'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-600'
                    : 'border-gray-200 hover:border-gray-300'
              "
              @click="selectAudio(audio)"
            >
              <div
                class="w-10 h-10 rounded-lg flex items-center justify-center"
                :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
              >
                <Music class="w-5 h-5" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
              </div>
              <div class="flex-1 min-w-0">
                <div class="font-medium truncate" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ audio.filename }}
                </div>
                <div class="text-xs" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ formatFileSize(audio.size) }} · {{ audio.mimetype }}
                </div>
              </div>
              <div
                v-if="selectedAudio?.id === audio.id"
                class="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center"
              >
                <span class="text-white text-xs">✓</span>
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
            @click="showAudioPicker = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-xl gradient-success text-white text-sm font-medium"
            @click="confirmAudio"
          >
            确定
          </button>
        </div>
      </div>
    </div>
  </div>

  <!-- 删除确认弹窗 -->
  <div
    v-if="showDeleteConfirm"
    class="fixed inset-0 z-50 flex items-center justify-center"
    style="background: rgba(0, 0, 0, 0.5)"
  >
    <div class="w-full max-w-md p-6 rounded-xl" :class="isDark ? 'bg-gray-800' : 'bg-white'">
      <h3 class="text-xl font-bold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
        确认删除
      </h3>
      <p class="mb-6" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        确定要删除歌词「{{ deletingLyric?.songName }}」吗？此操作不可恢复。
      </p>
      <div class="flex justify-end gap-3">
        <button
          class="px-4 py-2 rounded-lg border font-medium transition-colors"
          :class="
            isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-300 text-gray-700 hover:bg-gray-50'
          "
          @click="showDeleteConfirm = false"
        >
          取消
        </button>
        <button
          class="px-4 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition-colors"
          @click="confirmDeleteLyric"
        >
          确认删除
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";
import {
  Folder,
  Music,
  Piano,
  Headphones,
  Mic,
  Disc,
  FolderOpen,
  FileMusic,
  Edit3,
  Trash2,
  Search,
  Image,
} from "lucide-vue-next";

const appStore = useAppStore();
const { success, error, warning } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

const moduleName = computed(() => getModuleName("music"));
const moduleDescription = computed(() => getModuleDescription("music"));

const truncateText = (text: string, maxLength: number): string => {
  if (!text) return "";
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
};

interface Audio {
  id: string;
  groupId?: string;
  filename: string;
  url: string;
  size: number;
  mimetype: string;
  duration?: number;
}

interface AudioGroup {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
}

interface MusicCategory {
  id: string;
  name: string;
  icon: string;
  isDefault: boolean;
  count: number;
}

interface MusicLyric {
  id: string;
  singer: string;
  songName: string;
  lyric: string;
  coverImage?: string;
  audioId?: string;
  audio?: Audio;
  categoryId: string;
  categoryRel?: { id: string; name: string; icon: string };
  createdAt: string;
  updatedAt: string;
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
}

const lyrics = ref<MusicLyric[]>([]);
const searchKeyword = ref("");
const showModal = ref(false);
const editingLyric = ref<MusicLyric | null>(null);
const saving = ref(false);
const showDeleteConfirm = ref(false);
const deletingLyric = ref<MusicLyric | null>(null);

const categories = ref<MusicCategory[]>([
  { id: "", name: "默认分类", icon: "📁", isDefault: true, count: 0 },
]);
const showCategoryModal = ref(false);
const iconOptions = [
  { emoji: "📁", icon: Folder, name: "Folder" },
  { emoji: "🎵", icon: Music, name: "Music" },
  { emoji: "🎼", icon: Piano, name: "Piano" },
  { emoji: "🎹", icon: Piano, name: "Piano" },
  { emoji: "🎧", icon: Headphones, name: "Headphones" },
  { emoji: "🎤", icon: Mic, name: "Mic" },
  { emoji: "🎷", icon: Music, name: "Music" },
  { emoji: "🎸", icon: Music, name: "Music" },
  { emoji: "💿", icon: Disc, name: "Disc" },
  { emoji: "📂", icon: FolderOpen, name: "FolderOpen" },
];

const getIconComponent = (emoji: string) => {
  return iconOptions.find((opt) => opt.emoji === emoji)?.icon || Folder;
};

const categoryForm = reactive({
  name: "",
  icon: "📁",
});

const filterCategory = ref("");
const showMoveDialog = ref(false);
const movingLyric = ref<MusicLyric | null>(null);

const form = reactive({
  singer: "",
  songName: "",
  lyric: "",
  coverImage: "",
  audioId: "",
  categoryId: "",
});

const showAudioPicker = ref(false);
const audios = ref<Audio[]>([]);
const audiosLoading = ref(false);
const audioSearchKeyword = ref("");
const selectedAudio = ref<Audio | null>(null);
const audioGroups = ref<AudioGroup[]>([]);
const selectedAudioGroupId = ref<string | null>(null);

const filteredAudios = computed(() => {
  let result = audios.value;
  if (selectedAudioGroupId.value) {
    const selectedGroup = audioGroups.value.find((g) => g.id === selectedAudioGroupId.value);
    if (selectedGroup?.isDefault) {
      result = result.filter(
        (audio) => audio.groupId === selectedAudioGroupId.value || audio.groupId === null
      );
    } else {
      result = result.filter((audio) => audio.groupId === selectedAudioGroupId.value);
    }
  }
  if (audioSearchKeyword.value) {
    const keyword = audioSearchKeyword.value.toLowerCase();
    result = result.filter((audio) => audio.filename.toLowerCase().includes(keyword));
  }
  return result;
});

const showCoverPicker = ref(false);
const images = ref<Image[]>([]);
const imagesLoading = ref(false);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);
const tempCoverImage = ref("");

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const filteredLyrics = computed(() => {
  let result = lyrics.value;
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(
      (lyric) =>
        lyric.singer.toLowerCase().includes(keyword) ||
        lyric.songName.toLowerCase().includes(keyword) ||
        lyric.lyric.toLowerCase().includes(keyword)
    );
  }
  if (filterCategory.value) {
    result = result.filter((lyric) => lyric.categoryId === filterCategory.value);
  }
  return result;
});

interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const totalCount = ref(0);

const fetchLyrics = async () => {
  try {
    const data = await http.get<PaginationResult<MusicLyric>>("/music");
    lyrics.value = data.list;
    totalCount.value = data.total;
    await fetchCategories();
  } catch (err) {
    error("获取歌词列表失败");
  }
};

const fetchCategories = async () => {
  try {
    const data = await http.get<MusicCategory[]>("/music/categories/list");
    categories.value = data;
  } catch {
    categories.value = [{ id: "", name: "默认分类", icon: "📁", isDefault: true, count: 0 }];
  }
};

const sortedCategories = computed(() => {
  const result = [...categories.value];
  const defaultIndex = result.findIndex((c) => c.isDefault);
  if (defaultIndex > 0) {
    const defaultCat = result.splice(defaultIndex, 1)[0];
    result.unshift(defaultCat);
  }
  return result;
});

const getCategoryById = (id: string): MusicCategory | undefined => {
  return categories.value.find((c) => c.id === id);
};

const selectFilterCategory = (catId: string) => {
  filterCategory.value = catId;
};

const resetFilter = () => {
  searchKeyword.value = "";
  filterCategory.value = "";
};

const editingCategory = ref<MusicCategory | null>(null);

const openCategoryModal = (category?: MusicCategory) => {
  if (category) {
    editingCategory.value = category;
    categoryForm.name = category.name;
    categoryForm.icon = category.icon;
  } else {
    editingCategory.value = null;
    categoryForm.name = "";
    categoryForm.icon = "📁";
  }
  showCategoryModal.value = true;
};

const saveCategory = async () => {
  const name = categoryForm.name.trim();
  if (!name) {
    warning("请输入分类名称");
    return;
  }
  if (categories.value.some((c) => c.name === name && c.id !== editingCategory.value?.id)) {
    warning("分类已存在");
    return;
  }
  try {
    if (editingCategory.value) {
      await http.put(`/music/categories/${editingCategory.value.id}`, {
        name: categoryForm.name,
        icon: categoryForm.icon,
      });
    } else {
      await http.post("/music/categories", { name: categoryForm.name, icon: categoryForm.icon });
    }
    await fetchCategories();
    categoryForm.name = "";
    categoryForm.icon = "📁";
    editingCategory.value = null;
    showCategoryModal.value = false;
    success(editingCategory.value ? "分类更新成功" : "分类添加成功");
  } catch (err: any) {
    error(err.message || (editingCategory.value ? "更新分类失败" : "添加分类失败"));
  }
};

const deleteCategory = async (catId: string) => {
  const category = getCategoryById(catId);
  if (!category) return;
  if (category.count > 0) {
    warning("该分类下存在歌词，无法删除");
    return;
  }
  try {
    await http.delete(`/music/categories/${catId}`);
    await fetchCategories();
    if (filterCategory.value === catId) {
      filterCategory.value = "";
    }
    success("分类删除成功");
  } catch (err: any) {
    error(err.message || "删除分类失败");
  }
};

const openAddModal = () => {
  editingLyric.value = null;
  form.singer = "";
  form.songName = "";
  form.lyric = "";
  form.coverImage = "";
  form.audioId = "";
  selectedAudio.value = null;
  form.categoryId = categories.value[0]?.id || "";
  showModal.value = true;
};

const openEditModal = (lyric: MusicLyric) => {
  editingLyric.value = lyric;
  form.singer = lyric.singer;
  form.songName = lyric.songName;
  form.lyric = lyric.lyric;
  form.coverImage = lyric.coverImage || "";
  form.audioId = lyric.audioId || "";
  selectedAudio.value = lyric.audio || null;
  showModal.value = true;
};

const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const fetchAudios = async () => {
  audiosLoading.value = true;
  try {
    audioGroups.value = await http.get<AudioGroup[]>("/audio/groups");
    const defaultGroup = audioGroups.value.find((g) => g.isDefault);
    if (defaultGroup) {
      selectedAudioGroupId.value = defaultGroup.id;
    } else if (audioGroups.value.length > 0) {
      selectedAudioGroupId.value = audioGroups.value[0].id;
    } else {
      selectedAudioGroupId.value = null;
    }

    const data = await http.get<{ list: Audio[] }>("/audio?pageSize=100");
    audios.value = data.list || [];
  } catch (e: any) {
    audios.value = [];
    audioGroups.value = [];
  } finally {
    audiosLoading.value = false;
  }
};

const openAudioPicker = () => {
  audioSearchKeyword.value = "";
  fetchAudios();
  showAudioPicker.value = true;
};

const selectAudio = (audio: Audio) => {
  selectedAudio.value = audio;
};

const clearAudio = () => {
  selectedAudio.value = null;
  form.audioId = "";
};

const confirmAudio = () => {
  if (selectedAudio.value) {
    form.audioId = selectedAudio.value.id;
  } else {
    form.audioId = "";
  }
  showAudioPicker.value = false;
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const fetchImages = async () => {
  imagesLoading.value = true;
  try {
    const data = await http.get<{ list: Image[] }>("/gallery/images?pageSize=100");
    images.value = data.list || [];
    imageGroups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || imageGroups.value[0]?.id || null;
  } catch (e: any) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  } finally {
    imagesLoading.value = false;
  }
};

const openCoverPicker = () => {
  tempCoverImage.value = form.coverImage;
  fetchImages();
  showCoverPicker.value = true;
};

const selectCoverImage = (img: Image) => {
  tempCoverImage.value = img.url;
};

const confirmCoverImage = () => {
  form.coverImage = tempCoverImage.value;
  showCoverPicker.value = false;
};

const closeModal = () => {
  showModal.value = false;
  editingLyric.value = null;
};

const openMoveDialog = (lyric: MusicLyric) => {
  movingLyric.value = lyric;
  showMoveDialog.value = true;
};

const moveLyricTo = async (cat: MusicCategory) => {
  if (!movingLyric.value) return;
  try {
    await http.put(`/music/${movingLyric.value.id}/move`, {
      categoryId: cat.id,
    });
    success("移动成功");
    showMoveDialog.value = false;
    movingLyric.value = null;
    await fetchLyrics();
  } catch (e) {
    error(e instanceof Error ? e.message : "移动失败");
  }
};

const saveLyric = async () => {
  if (!form.singer || !form.songName || !form.lyric) {
    warning("请填写所有必填项");
    return;
  }

  saving.value = true;
  try {
    if (editingLyric.value) {
      await http.put(`/music/${editingLyric.value.id}`, {
        singer: form.singer,
        songName: form.songName,
        lyric: form.lyric,
        coverImage: form.coverImage,
        audioId: form.audioId || null,
      });
      success("歌词更新成功");
    } else {
      await http.post("/music", {
        singer: form.singer,
        songName: form.songName,
        lyric: form.lyric,
        coverImage: form.coverImage,
        audioId: form.audioId || null,
        categoryId: filterCategory.value || categories.value[0]?.id || null,
      });
      success("歌词添加成功");
    }
    closeModal();
    await fetchLyrics();
  } catch (err) {
    error(editingLyric.value ? "更新歌词失败" : "添加歌词失败");
  } finally {
    saving.value = false;
  }
};

const deleteLyric = (lyric: MusicLyric) => {
  deletingLyric.value = lyric;
  showDeleteConfirm.value = true;
};

const confirmDeleteLyric = async () => {
  if (!deletingLyric.value) return;
  try {
    await http.delete(`/music/${deletingLyric.value.id}`);
    success("歌词删除成功");
    showDeleteConfirm.value = false;
    deletingLyric.value = null;
    await fetchLyrics();
  } catch (err) {
    error("删除失败");
  }
};

onMounted(async () => {
  await loadConfig();
  await fetchCategories();
  if (categories.value.length > 0) {
    filterCategory.value = categories.value.find((c) => c.isDefault)?.id || categories.value[0].id;
  }
  fetchLyrics();
});
</script>

<style scoped>
.cursor-help {
  cursor: help;
}

.cursor-help:hover {
  opacity: 0.8;
}

.lyric-cell {
  max-width: 400px;
  white-space: normal;
}
</style>
