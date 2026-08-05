<template>
  <div class="w-full admin-root" :data-admin-module="'music'">
    <div class="admin-page-header mb-6 px-6 py-4 rounded-xl">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <IconPark type="Music" :size="28" class="inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
        <div class="flex items-center space-x-3">
          <button class="btn-admin-md btn-admin-primary" @click="openCategoryModal">
            + 新建分类
          </button>
          <button class="btn-admin-lg btn-admin-primary" @click="openAddModal">+ 添加歌词</button>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap items-center justify-between gap-4 mb-6">
      <div class="flex flex-wrap gap-2">
        <div v-for="cat in categories" :key="cat.id" class="flex flex-wrap gap-2">
          <div
            v-if="editingCategoryId === cat.id"
            class="flex items-center gap-1 px-3 py-1.5 rounded-lg"
            :class="isDark ? 'bg-gray-700' : 'bg-white border border-gray-300 shadow-sm'"
          >
            <input
              v-model="editingCategoryName"
              type="text"
              class="w-28 px-2 py-1 rounded border text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-800 text-white'
                  : 'border-gray-300 bg-white text-black'
              "
              @keyup.enter="saveEditedCategory"
              @keyup.esc="cancelEditCategory"
            />
            <button
              class="px-2 py-1 text-xs rounded text-white bg-blue-500"
              :disabled="!editingCategoryName.trim()"
              @click="saveEditedCategory"
            >
              保存
            </button>
            <button
              class="px-2 py-1 text-xs rounded"
              :class="isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-200 text-gray-600'"
              @click="cancelEditCategory"
            >
              取消
            </button>
          </div>
          <button
            v-else
            class="admin-chip"
            :class="{ 'admin-chip-active': filterCategory === cat.id }"
            @click="selectFilterCategory(cat.id)"
          >
            <AppIcon :icon="cat.icon" :size="16" />
            <span>{{ cat.name }}</span>
            <span class="chip-count">
              {{ cat.count }}
            </span>
          </button>
        </div>
      </div>
      <div class="flex items-center space-x-2">
        <button
          v-if="
            filterCategory &&
            !getCategoryById(filterCategory)?.isDefault &&
            editingCategoryId !== filterCategory
          "
          class="btn-admin-sm btn-admin-ghost"
          @click="startEditCategory(filterCategory)"
        >
          <IconPark type="Editor" :size="16" class="inline mr-1" />
          编辑
        </button>
        <button
          v-if="filterCategory && !getCategoryById(filterCategory)?.isDefault"
          class="btn-admin-sm btn-admin-danger"
          @click="deleteCategory(filterCategory)"
        >
          <IconPark type="Delete" :size="16" class="inline mr-1" />
          删除
        </button>
      </div>
    </div>

    <div
      class="rounded-xl border p-4 mb-6"
      :class="isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white border-gray-200/50'"
    >
      <div class="flex items-center gap-3">
        <div class="relative flex-1 max-w-md">
          <IconPark
            type="Search"
            :size="20"
            class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索歌手、歌名或歌词..."
            class="admin-input w-full pl-11 pr-4 py-2.5 rounded-xl text-base"
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
            <IconPark type="Music" :size="32" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
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
          <div class="flex items-center gap-2">
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              title="移动到分类"
              @click="openMoveDialog(lyric)"
            >
              <IconPark type="FolderOpen" :size="16" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="
                isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
              "
              title="编辑"
              @click="openEditModal(lyric)"
            >
              <IconPark type="Editor" :size="16" />
            </button>
            <button
              class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
              :class="
                isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
              "
              title="删除"
              @click="deleteLyric(lyric)"
            >
              <IconPark type="Delete" :size="16" />
            </button>
          </div>
        </div>
      </div>

      <div v-if="lyrics.length === 0" class="text-center py-16">
        <IconPark
          type="Music"
          :size="64"
          class="mx-auto mb-4"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        />
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">暂无歌词数据</p>
      </div>
    </div>

    <div v-if="lyrics.length > 0" class="mt-6 flex items-center justify-between">
      <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
        共 {{ pagination.total }} 首歌词
      </span>
      <div class="flex items-center space-x-2">
        <button
          :disabled="pagination.page === 1"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          :class="
            isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
          @click="prevPage"
        >
          上一页
        </button>
        <span class="font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
          {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.limit) }}
        </span>
        <button
          :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
          class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
          :class="
            isDark
              ? 'bg-gray-700 text-white hover:bg-gray-600'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          "
          @click="nextPage"
        >
          下一页
        </button>
      </div>
    </div>

    <!-- 添加分类弹窗 -->
    <div v-if="showCategoryModal" class="admin-modal-backdrop" @click.self="closeCategoryModal">
      <div class="admin-modal admin-modal-md">
        <div class="p-5 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="admin-modal-title">新建分类</h2>
        </div>
        <div class="p-5 space-y-4">
          <div>
            <input
              v-model="newCategoryName"
              type="text"
              class="admin-input w-full px-3 py-2 rounded-lg"
              placeholder="输入分类名称"
              @keyup.enter="addCategory"
            />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-1.5"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              图标
            </label>
            <IconPicker v-model="newCategoryIcon" placeholder="搜索或输入图标名" />
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="closeCategoryModal">取消</button>
          <button
            class="btn-admin-sm btn-admin-primary disabled:opacity-50"
            :disabled="!newCategoryName.trim()"
            @click="addCategory"
          >
            确认添加
          </button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="admin-modal-backdrop" @click.self="closeModal">
      <div class="admin-modal admin-modal-lg">
        <div class="p-5 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <h2 class="admin-modal-title">
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
                class="admin-input w-full px-3 py-2 rounded-lg"
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
                class="admin-input w-full px-3 py-2 rounded-lg"
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
              class="admin-input w-full px-3 py-2 rounded-lg resize-none"
              placeholder="输入歌词内容"
            ></textarea>
          </div>

          <div class="flex gap-4">
            <div class="flex-1">
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                封面图片
              </label>
              <div class="relative">
                <button
                  class="w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all"
                  :class="[
                    form.coverImage
                      ? isDark
                        ? 'border-gray-600 hover:border-primary-500'
                        : 'border-gray-300 hover:border-primary-500'
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100',
                  ]"
                  @click="openCoverPicker"
                >
                  <template v-if="form.coverImage">
                    <img
                      :src="getFullImageUrl(form.coverImage)"
                      alt="封面"
                      class="absolute inset-0 w-full h-full object-cover rounded-xl"
                    />
                    <div
                      class="absolute inset-0 bg-black/0 hover:bg-black/30 flex items-center justify-center transition-colors"
                    >
                      <div
                        class="w-12 h-12 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg"
                      >
                        <IconPark type="Pic" :size="24" class="text-white" />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <IconPark type="Pic" :size="32" class="mb-2" />
                    <span class="text-sm">选择封面</span>
                  </template>
                </button>
                <button
                  v-if="form.coverImage"
                  class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  @click.stop="form.coverImage = ''"
                >
                  <IconPark type="Delete" :size="16" />
                </button>
              </div>
            </div>

            <div class="flex-1">
              <label
                class="block text-sm font-medium mb-1.5"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                音频文件
              </label>
              <div class="relative">
                <button
                  class="w-full aspect-square rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all"
                  :class="[
                    selectedAudio
                      ? isDark
                        ? 'border-gray-600 hover:border-primary-500'
                        : 'border-gray-300 hover:border-primary-500'
                      : isDark
                        ? 'bg-gray-700 border-gray-600 text-gray-400 hover:bg-gray-600'
                        : 'bg-gray-50 border-gray-300 text-gray-600 hover:bg-gray-100',
                  ]"
                  @click="openAudioPicker"
                >
                  <template v-if="selectedAudio">
                    <div
                      class="absolute inset-0 flex flex-col items-center justify-center rounded-xl"
                      :class="isDark ? 'bg-gray-800' : 'bg-gray-100'"
                    >
                      <IconPark
                        type="Music"
                        :size="48"
                        class="mb-2"
                        :class="isDark ? 'text-primary-400' : 'text-primary-500'"
                      />
                      <span
                        class="text-sm font-medium truncate max-w-[80%]"
                        :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                      >
                        {{ selectedAudio.filename }}
                      </span>
                      <span
                        class="text-xs mt-1"
                        :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                      >
                        {{ formatFileSize(selectedAudio.size) }}
                      </span>
                    </div>
                    <div
                      class="absolute inset-0 bg-black/0 hover:bg-black/20 flex items-center justify-center transition-colors"
                    >
                      <div
                        class="w-12 h-12 rounded-full bg-primary-500/90 flex items-center justify-center shadow-lg"
                      >
                        <IconPark type="Music" :size="24" class="text-white" />
                      </div>
                    </div>
                  </template>
                  <template v-else>
                    <IconPark type="Music" :size="32" class="mb-2" />
                    <span class="text-sm">选择音频</span>
                  </template>
                </button>
                <button
                  v-if="selectedAudio"
                  class="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
                  @click.stop="clearAudio"
                >
                  <IconPark type="Delete" :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="closeModal">取消</button>
          <button
            :disabled="saving"
            class="btn-admin-sm btn-admin-primary disabled:opacity-50"
            @click="saveLyric"
          >
            {{ saving ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showCoverPicker" class="admin-modal-backdrop" @click.self="showCoverPicker = false">
      <div class="admin-modal admin-modal-lg">
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="admin-modal-title">选择封面图片</h3>
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
            <IconPark
              type="Pic"
              :size="48"
              class="mx-auto mb-3"
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
                tempCoverImage === img.url
                  ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-400'
              "
              @click="selectCoverImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-32 object-cover"
              />
              <div
                v-if="tempCoverImage === img.url"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showCoverPicker = false">
            取消
          </button>
          <button class="btn-admin-sm btn-admin-primary" @click="confirmCoverImage">确定</button>
        </div>
      </div>
    </div>

    <div v-if="showMoveDialog" class="admin-modal-backdrop" @click.self="showMoveDialog = false">
      <div class="admin-modal admin-modal-md">
        <h2 class="admin-modal-title">移动歌词</h2>
        <div class="space-y-2">
          <div
            v-for="cat in categories"
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
              <AppIcon :icon="cat.icon" :size="16" />
              <span class="text-sm" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ cat.name }}
              </span>
            </div>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showMoveDialog = false">取消</button>
        </div>
      </div>
    </div>

    <div v-if="showAudioPicker" class="admin-modal-backdrop" @click.self="showAudioPicker = false">
      <div class="admin-modal admin-modal-lg">
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="admin-modal-title">选择音频</h3>
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
              <AppIcon :icon="group.icon || 'mdi:folder'" :size="12" class="inline mr-1" />
              {{ group.name }}
            </button>
          </div>
          <div class="mt-3">
            <input
              v-model="audioSearchKeyword"
              type="text"
              placeholder="搜索音频..."
              class="admin-input w-full px-3 py-2 rounded-lg"
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
            <IconPark
              type="Music"
              :size="48"
              class="mx-auto mb-3"
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
                <IconPark
                  type="Music"
                  :size="20"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                />
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
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showAudioPicker = false">
            取消
          </button>
          <button class="btn-admin-sm btn-admin-primary" @click="confirmAudio">确定</button>
        </div>
      </div>
    </div>
  </div>

  <!-- 删除确认弹窗 -->
  <div v-if="showDeleteConfirm" class="admin-modal-backdrop">
    <div class="admin-modal admin-modal-md">
      <h3 class="admin-modal-title">确认删除</h3>
      <p class="mb-6" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
        确定要删除歌词「{{ deletingLyric?.songName }}」吗？此操作不可恢复。
      </p>
      <div class="admin-modal-footer">
        <button class="btn-admin-sm btn-admin-ghost" @click="showDeleteConfirm = false">
          取消
        </button>
        <button class="btn-admin-sm btn-admin-danger" @click="confirmDeleteLyric">确认删除</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";
import AppIcon from "@/components/AppIcon.vue";
import IconPicker from "@/components/IconPicker.vue";
import { useIcon } from "@/composables/useIcon";
import { IconPark } from "@icon-park/vue-next/es/all";

const appStore = useAppStore();
const { success, error, warning } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();
const { formatIconName } = useIcon();

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
  isPublic: boolean;
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

interface Image {
  id: string;
  url: string;
  filename: string;
  group?: { id: string; name: string; icon: string } | null;
}

const lyrics = ref<MusicLyric[]>([]);
const searchKeyword = ref("");
const showModal = ref(false);
const editingLyric = ref<MusicLyric | null>(null);
const saving = ref(false);
const showDeleteConfirm = ref(false);
const deletingLyric = ref<MusicLyric | null>(null);

const categories = ref<MusicCategory[]>([]);

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
const images = ref<any[]>([]);
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

const pagination = reactive({
  page: 1,
  limit: 20,
  total: 0,
});

const fetchLyrics = async () => {
  try {
    const data = await http.get<PaginationResult<MusicLyric>>("/music", {
      params: { page: pagination.page, pageSize: pagination.limit },
    });
    lyrics.value = data.list;
    pagination.total = data.total;
    await fetchCategories();
  } catch (err) {
    error("获取歌词列表失败");
  }
};

const fetchCategories = async () => {
  try {
    const data = await http.get<MusicCategory[]>("/music/categories/list?admin=true");
    const defIdx = data.findIndex(
      (c) => Boolean(c.isDefault) || c.name === "默认分组" || c.name === "默认分类"
    );
    if (defIdx > 0) {
      const [defCat] = data.splice(defIdx, 1);
      data.unshift(defCat);
    }
    categories.value = data;
  } catch {
    categories.value = [];
  }
};

const getCategoryById = (id: string): MusicCategory | undefined => {
  return categories.value.find((c) => c.id === id);
};

const selectFilterCategory = (catId: string) => {
  filterCategory.value = catId;
  pagination.page = 1;
  fetchLyrics();
};

const resetFilter = () => {
  searchKeyword.value = "";
  filterCategory.value = "";
  pagination.page = 1;
  fetchLyrics();
};

const prevPage = () => {
  if (pagination.page > 1) {
    pagination.page--;
    fetchLyrics();
  }
};

const nextPage = () => {
  if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
    pagination.page++;
    fetchLyrics();
  }
};

watch(searchKeyword, () => {
  pagination.page = 1;
  fetchLyrics();
});

const newCategoryName = ref("");
const newCategoryIcon = ref("mdi:folder");
const showCategoryModal = ref(false);
const editingCategoryId = ref<string | null>(null);
const editingCategoryName = ref("");

const openCategoryModal = () => {
  newCategoryName.value = "";
  newCategoryIcon.value = "mdi:folder";
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
  newCategoryName.value = "";
  newCategoryIcon.value = "mdi:folder";
};

const addCategory = async () => {
  const name = newCategoryName.value.trim();
  if (!name) {
    warning("请输入分类名称");
    return;
  }
  if (categories.value.some((c) => c.name === name)) {
    warning("分类已存在");
    return;
  }
  try {
    await http.post("/music/categories", {
      name,
      icon: formatIconName(newCategoryIcon.value || "mdi:folder"),
      isPublic: true,
    });
    await fetchCategories();
    closeCategoryModal();
    success("分类添加成功");
  } catch (err: any) {
    error(err.message || "添加分类失败");
  }
};

const startEditCategory = (catId: string) => {
  const category = getCategoryById(catId);
  if (!category) return;
  editingCategoryId.value = catId;
  editingCategoryName.value = category.name;
};

const saveEditedCategory = async () => {
  if (!editingCategoryId.value) return;
  const name = editingCategoryName.value.trim();
  if (!name) {
    warning("请输入分类名称");
    return;
  }
  if (categories.value.some((c) => c.name === name && c.id !== editingCategoryId.value)) {
    warning("分类已存在");
    return;
  }
  try {
    const cat = getCategoryById(editingCategoryId.value);
    await http.put(`/music/categories/${editingCategoryId.value}`, {
      name,
      icon: cat?.icon || "📁",
      isPublic: cat?.isPublic !== undefined ? cat.isPublic : true,
    });
    await fetchCategories();
    editingCategoryId.value = null;
    editingCategoryName.value = "";
    success("分类更新成功");
  } catch (err: any) {
    error(err.message || "更新分类失败");
  }
};

const cancelEditCategory = () => {
  editingCategoryId.value = null;
  editingCategoryName.value = "";
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

const getDefaultCategoryId = (cats: MusicCategory[]) => {
  return (
    cats.find((c) => Boolean(c.isDefault))?.id ||
    cats.find((c) => c.name === "默认分组")?.id ||
    cats.find((c) => c.name === "默认分类")?.id ||
    cats[0]?.id
  );
};

onMounted(async () => {
  await loadConfig();
  await fetchCategories();
  if (categories.value.length > 0) {
    filterCategory.value = getDefaultCategoryId(categories.value) || "";
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
