<template>
  <div class="memory-page w-full admin-root" :data-admin-module="'memory'">
    <div class="admin-page-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <IconPark type="Like" :size="28" class="inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex space-x-2 mb-6">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="admin-tab"
        :class="{ 'admin-tab-active': activeTab === tab.key }"
        @click="activeTab = tab.key"
      >
        <span class="flex items-center gap-2">
          <IconPark :type="tab.icon" :size="16" />
          <span>{{ tab.name }}</span>
        </span>
      </button>
    </div>

    <!-- 日记 Tab -->
    <div v-if="activeTab === 'diary'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button class="btn-admin-md btn-admin-primary" @click="openDiaryDialog()">+ 写日记</button>
      </div>
      <div
        v-if="diaryLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="diaries.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <IconPark
          type="FileText"
          :size="48"
          class="mx-auto mb-3"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        />
        <p>还没有日记</p>
        <p class="text-sm mt-1">记录下今天的心情吧</p>
      </div>
      <div v-else class="space-y-4">
        <div v-for="item in diaries" :key="item.id" class="admin-card">
          <div class="p-3">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-3">
                <span
                  class="text-base font-medium"
                  :class="isDark ? 'text-gray-300' : 'text-gray-700'"
                >
                  {{ formatDate(item.diaryDate) }}
                </span>
                <span v-if="item.weather" class="text-xl">{{ getWeatherEmoji(item.weather) }}</span>
                <span v-if="item.mood" class="text-xl">{{ getMoodEmoji(item.mood) }}</span>
                <span
                  v-if="item.isOutside"
                  class="text-sm px-2 py-0.5 rounded-full"
                  :class="isDark ? 'bg-green-900/50 text-green-400' : 'bg-green-100 text-green-700'"
                >
                  <span class="inline-flex items-center">外出</span>
                </span>
              </div>
              <div class="flex gap-2">
                <button
                  class="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
                  @click="openDiaryDialog(item)"
                >
                  <IconPark type="Editor" :size="16" />
                </button>
                <button
                  class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                  @click="deleteDiary(item)"
                >
                  <IconPark type="Delete" :size="16" />
                </button>
              </div>
            </div>

            <!-- 图片展示 -->
            <div v-if="item.images && item.images.length > 0" class="mb-3">
              <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                <div
                  v-for="(img, index) in item.images"
                  :key="index"
                  class="flex-shrink-0 w-28 h-28 rounded-lg overflow-hidden"
                >
                  <img
                    :src="getFullImageUrl(img.imageUrl)"
                    :alt="formatDate(item.diaryDate)"
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

            <p
              class="text-base whitespace-pre-wrap leading-relaxed"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>

      <div v-if="diaries.length > 0" class="mt-6 flex items-center justify-between">
        <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          共 {{ diaryPagination.total }} 条日记
        </span>
        <div class="flex items-center space-x-2">
          <button
            :disabled="dreamPagination.page === 1"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="prevDiaryPage"
          >
            上一页
          </button>
          <span class="font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            {{ diaryPagination.page }} /
            {{ Math.ceil(diaryPagination.total / diaryPagination.pageSize) }}
          </span>
          <button
            :disabled="
              diaryPagination.page >= Math.ceil(diaryPagination.total / diaryPagination.pageSize)
            "
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="nextDiaryPage"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 回忆录 Tab -->
    <div v-if="activeTab === 'memoir'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-medium"
          @click="openMemoirDialog()"
        >
          + 写回忆录
        </button>
      </div>

      <!-- 普通回忆录 -->
      <div class="mb-8">
        <h3
          class="text-lg font-semibold mb-4 flex items-center"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <IconPark type="Book" :size="20" class="mr-2" />
          回忆录
        </h3>
        <div
          v-if="memoirLoading"
          class="text-center py-8"
          :class="isDark ? 'text-gray-400' : 'text-gray-500'"
        >
          加载中...
        </div>
        <div
          v-else-if="memoirEntriesFiltered.length === 0"
          class="text-center py-12 rounded-xl border-2 border-dashed"
          :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
        >
          <IconPark
            type="Book"
            :size="48"
            class="mx-auto mb-3"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          />
          <p>还没有回忆录</p>
          <p class="text-sm mt-1">记录下你的回忆吧</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="item in memoirEntriesFiltered"
            :key="item.id"
            class="group p-3 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all"
            :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
            @click="openMemoirDialog(item)"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ item.title }}
              </h3>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  @click.stop="openMemoirDialog(item)"
                >
                  <IconPark type="Editor" :size="14" />
                </button>
                <button
                  class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                  @click.stop="deleteMemoir(item)"
                >
                  <IconPark type="Delete" :size="14" />
                </button>
              </div>
            </div>
            <div class="flex items-center gap-2 text-xs">
              <span
                v-if="item.category"
                class="px-2 py-0.5 rounded-full"
                :class="isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'"
              >
                {{ item.category.icon }} {{ item.category.name }}
              </span>
              <span v-if="item.eventDate" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                <IconPark type="Calendar" :size="12" class="inline mr-1" />
                {{ formatDate(item.eventDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="memoirEntriesFiltered.length > 0" class="mt-6 flex items-center justify-between">
        <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          共 {{ memoirPagination.total }} 条回忆录
        </span>
        <div class="flex items-center space-x-2">
          <button
            :disabled="memoirPagination.page === 1"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="prevMemoirPage"
          >
            上一页
          </button>
          <span class="font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            {{ memoirPagination.page }} /
            {{ Math.ceil(memoirPagination.total / memoirPagination.pageSize) }}
          </span>
          <button
            :disabled="
              memoirPagination.page >= Math.ceil(memoirPagination.total / memoirPagination.pageSize)
            "
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="nextMemoirPage"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 梦境 Tab -->
    <div v-if="activeTab === 'dream'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 rounded-lg bg-blue-500 text-white text-sm font-medium"
          @click="openDreamDialog()"
        >
          + 记录梦境
        </button>
      </div>
      <div
        v-if="dreamLoading"
        class="text-center py-8"
        :class="isDark ? 'text-gray-400' : 'text-gray-500'"
      >
        加载中...
      </div>
      <div
        v-else-if="dreams.length === 0"
        class="text-center py-12 rounded-xl border-2 border-dashed"
        :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
      >
        <IconPark
          type="Moon"
          :size="48"
          class="mx-auto mb-3"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        />
        <p>还没有梦境记录</p>
        <p class="text-sm mt-1">记录下你记得的梦</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="item in dreams"
          :key="item.id"
          class="p-4 rounded-xl border shadow-sm"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="flex items-start justify-between mb-2">
            <span class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
              {{ formatDate(item.dreamDate) }}
            </span>
            <div class="flex space-x-1">
              <button
                class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                @click="openDreamDialog(item)"
              >
                <IconPark type="Editor" :size="14" />
              </button>
              <button
                class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                @click="deleteDream(item)"
              >
                <IconPark type="Delete" :size="14" />
              </button>
            </div>
          </div>
          <p
            class="text-sm whitespace-pre-wrap"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            {{ item.content }}
          </p>
        </div>
      </div>

      <div v-if="dreams.length > 0" class="mt-6 flex items-center justify-between">
        <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          共 {{ dreamPagination.total }} 条梦境
        </span>
        <div class="flex items-center space-x-2">
          <button
            :disabled="dreamPagination.page === 1"
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="prevDreamPage"
          >
            上一页
          </button>
          <span class="font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            {{ dreamPagination.page }} /
            {{ Math.ceil(dreamPagination.total / dreamPagination.pageSize) }}
          </span>
          <button
            :disabled="
              dreamPagination.page >= Math.ceil(dreamPagination.total / dreamPagination.pageSize)
            "
            class="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
            :class="
              isDark
                ? 'bg-gray-700 text-white hover:bg-gray-600'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            "
            @click="nextDreamPage"
          >
            下一页
          </button>
        </div>
      </div>
    </div>

    <!-- 日记弹窗 -->
    <div v-if="showDiaryDialog" class="admin-modal-backdrop" @click.self="showDiaryDialog = false">
      <div class="admin-modal admin-modal-lg">
        <h2 class="admin-modal-title">
          {{ editingDiary ? "编辑日记" : "写日记" }}
        </h2>
        <div class="space-y-4">
          <!-- 天气选择 -->
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              天气
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="w in weatherOptions"
                :key="w.value"
                class="px-3 py-2 rounded-lg text-lg transition-all"
                :class="
                  diaryForm.weather === w.value
                    ? 'bg-pink-100 dark:bg-pink-900/40 ring-2 ring-pink-500'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                "
                @click="diaryForm.weather = diaryForm.weather === w.value ? '' : w.value"
              >
                {{ w.emoji }}
              </button>
            </div>
          </div>

          <!-- 心情选择 -->
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              心情
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="m in moodOptions"
                :key="m.value"
                class="px-3 py-2 rounded-lg text-lg transition-all"
                :class="
                  diaryForm.mood === m.value
                    ? 'bg-pink-100 dark:bg-pink-900/40 ring-2 ring-pink-500'
                    : isDark
                      ? 'bg-gray-700 hover:bg-gray-600'
                      : 'bg-gray-100 hover:bg-gray-200'
                "
                @click="diaryForm.mood = diaryForm.mood === m.value ? '' : m.value"
              >
                {{ m.emoji }}
              </button>
            </div>
          </div>

          <!-- 是否外出 -->
          <div class="flex items-center space-x-3">
            <label class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              今日是否外出
            </label>
            <button
              class="relative w-12 h-6 rounded-full transition-colors"
              :class="diaryForm.isOutside ? 'bg-pink-500' : 'bg-gray-300 dark:bg-gray-600'"
              @click="diaryForm.isOutside = !diaryForm.isOutside"
            >
              <span
                class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                :class="diaryForm.isOutside ? 'left-7' : 'left-1'"
              ></span>
            </button>
            <span class="text-sm" :class="diaryForm.isOutside ? 'text-pink-500' : 'text-gray-400'">
              {{ diaryForm.isOutside ? "是" : "否" }}
            </span>
          </div>

          <!-- 图片选择 -->
          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              图片（可选）
            </label>
            <div class="flex space-x-3">
              <button
                class="flex-1 px-3 py-2 rounded-lg border border-dashed text-sm flex items-center justify-center space-x-2"
                :class="
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                "
                @click="openImagePicker"
              >
                <IconPark type="Pic" :size="16" />
                <span>{{ diaryForm.imageUrls.length > 0 ? "添加图片" : "从图集中选择" }}</span>
              </button>
              <button
                v-if="diaryForm.imageUrls.length > 0"
                class="px-3 py-2 rounded-lg border text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30"
                @click="diaryForm.imageUrls = []"
              >
                清空
              </button>
            </div>
            <div v-if="diaryForm.imageUrls.length > 0" class="mt-2 flex flex-wrap gap-2">
              <div
                v-for="(url, index) in diaryForm.imageUrls"
                :key="index"
                class="relative w-24 h-24 rounded-lg overflow-hidden"
              >
                <img
                  :src="getFullImageUrl(url)"
                  :alt="`图片${index + 1}`"
                  class="w-full h-full object-cover"
                />
                <button
                  class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80"
                  @click="diaryForm.imageUrls.splice(index, 1)"
                >
                  ×
                </button>
              </div>
            </div>
          </div>

          <!-- 内容 -->
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              内容 *
            </label>
            <textarea
              v-model="diaryForm.content"
              rows="6"
              placeholder="记录今天发生的事情..."
              class="admin-input"
            ></textarea>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showDiaryDialog = false">
            取消
          </button>
          <button
            class="btn-admin-sm btn-admin-primary"
            :disabled="!diaryForm.content.trim()"
            @click="saveDiary"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 日记图片选择弹窗 -->
    <div v-if="showImagePicker" class="admin-modal-backdrop" @click.self="showImagePicker = false">
      <div class="admin-modal admin-modal-lg overflow-hidden">
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="admin-modal-title">选择图片</h3>
            <button
              class="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
              @click="showImagePicker = false"
            >
              ✕
            </button>
          </div>
          <!-- 分组选择器 -->
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              v-for="group in imageGroups"
              :key="group.id"
              class="admin-chip"
              :class="{ 'admin-chip-active': selectedGroupId === group.id }"
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
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showImagePicker = false">
            取消
          </button>
          <button class="btn-admin-sm btn-admin-primary" @click="confirmImages">确定</button>
        </div>
      </div>
    </div>

    <!-- 回忆录弹窗 -->
    <div
      v-if="showMemoirDialog"
      class="admin-modal-backdrop"
      @click.self="showMemoirDialog = false"
    >
      <div class="admin-modal admin-modal-lg">
        <h2 class="admin-modal-title">
          {{ editingMemoir ? "编辑回忆录" : "写回忆录" }}
        </h2>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              标题 *
            </label>
            <input
              v-model="memoirForm.title"
              type="text"
              placeholder="回忆的标题"
              class="admin-input"
            />
          </div>

          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              内容 *
            </label>
            <textarea
              v-model="memoirForm.content"
              rows="6"
              placeholder="记录你的回忆..."
              class="admin-input"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              分类
            </label>
            <div class="flex flex-wrap gap-2 mb-2">
              <button
                v-for="cat in memoirCategories"
                :key="cat.id"
                class="admin-chip inline-flex items-center gap-1"
                :class="{ 'admin-chip-active': memoirForm.categoryId === cat.id }"
                @click="memoirForm.categoryId = cat.id"
              >
                <span>{{ cat.icon }}</span>
                <span>{{ cat.name }}</span>
                <button
                  v-if="!cat.isDefault"
                  title="删除分类"
                  class="ml-1 w-4 h-4 rounded-full flex items-center justify-center hover:bg-black/20"
                  @click.stop="deleteMemoirCategory(cat.id)"
                >
                  <IconPark type="Close" :size="12" />
                </button>
              </button>
            </div>
            <div class="flex gap-2">
              <input
                v-model="newMemoirCategoryName"
                type="text"
                placeholder="输入新分类名称..."
                class="admin-input flex-1 text-sm"
                @keyup.enter="addMemoirCategory"
              />
              <button
                class="btn-admin-md btn-admin-primary"
                :disabled="!newMemoirCategoryName.trim()"
                @click="addMemoirCategory"
              >
                + 添加
              </button>
            </div>
          </div>

          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              事件日期
            </label>
            <input v-model="memoirForm.eventDate" type="date" class="admin-input" />
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showMemoirDialog = false">
            取消
          </button>
          <button
            class="btn-admin-sm btn-admin-primary"
            :disabled="!memoirForm.title.trim() || !memoirForm.content.trim()"
            @click="saveMemoir"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 梦境弹窗 -->
    <div v-if="showDreamDialog" class="admin-modal-backdrop" @click.self="showDreamDialog = false">
      <div class="admin-modal admin-modal-md">
        <h2 class="admin-modal-title">
          {{ editingDream ? "编辑梦境" : "记录梦境" }}
        </h2>
        <textarea
          v-model="dreamForm.content"
          rows="8"
          placeholder="记录你梦到了什么..."
          class="admin-input"
        ></textarea>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showDreamDialog = false">
            取消
          </button>
          <button
            class="btn-admin-sm btn-admin-primary"
            :disabled="!dreamForm.content.trim()"
            @click="saveDream"
          >
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import { useMessage, useModuleConfig } from "@/composables";
import { IconPark } from "@icon-park/vue-next/es/all";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error, warning } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const moduleName = computed(() => getModuleName("memory"));
const moduleDescription = computed(() => getModuleDescription("memory"));

const tabs = [
  { key: "diary", name: "日记", icon: "FileText" },
  { key: "memoir", name: "回忆录", icon: "Book" },
  { key: "dream", name: "梦境", icon: "Moon" },
];

const activeTab = ref("diary");

// ===== 日记 =====
interface DiaryImage {
  id: string;
  imageUrl: string;
  sortOrder: number;
}

interface Diary {
  id: string;
  content: string;
  weather: string | null;
  mood: string | null;
  images: DiaryImage[];
  isOutside: boolean | null;
  diaryDate: string;
}

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
}

const weatherOptions = [
  { value: "sunny", emoji: "☀️", label: "晴" },
  { value: "cloudy", emoji: "☁️", label: "多云" },
  { value: "overcast", emoji: "☁️", label: "阴" },
  { value: "rainy", emoji: "🌧️", label: "雨" },
  { value: "drizzle", emoji: "🌦️", label: "小雨" },
  { value: "thunderstorm", emoji: "⛈️", label: "雷雨" },
  { value: "snowy", emoji: "❄️", label: "雪" },
  { value: "hail", emoji: "🌨️", label: "冰雹" },
  { value: "windy", emoji: "💨", label: "大风" },
  { value: "foggy", emoji: "🌫️", label: "雾" },
];

const moodOptions = [
  { value: "happy", emoji: "😊", label: "开心" },
  { value: "excited", emoji: "🤩", label: "兴奋" },
  { value: "content", emoji: "😋", label: "满足" },
  { value: "grateful", emoji: "🙏", label: "感恩" },
  { value: "hopeful", emoji: "🌟", label: "期待" },
  { value: "calm", emoji: "😌", label: "平静" },
  { value: "tired", emoji: "😴", label: "疲惫" },
  { value: "confused", emoji: "😕", label: "困惑" },
  { value: "anxious", emoji: "😰", label: "焦虑" },
  { value: "sad", emoji: "😢", label: "难过" },
  { value: "lonely", emoji: "🥺", label: "孤独" },
  { value: "angry", emoji: "😠", label: "生气" },
];

const diaries = ref<Diary[]>([]);
const diaryLoading = ref(true);
const diaryPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
const showDiaryDialog = ref(false);
const editingDiary = ref<Diary | null>(null);
const diaryForm = reactive({
  content: "",
  weather: "",
  mood: "",
  imageUrls: [] as string[],
  isOutside: false,
});

const showImagePicker = ref(false);
const images = ref<any[]>([]);
const imagesLoading = ref(false);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);
const tempSelectedImages = ref<string[]>([]);

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const getWeatherEmoji = (weather: string) => {
  return weatherOptions.find((w) => w.value === weather)?.emoji || "";
};

const getMoodEmoji = (mood: string) => {
  return moodOptions.find((m) => m.value === mood)?.emoji || "";
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchDiaries = async () => {
  diaryLoading.value = true;
  try {
    const data = await http.get<PaginationResult<Diary>>("/diary", {
      params: { page: diaryPagination.page, pageSize: diaryPagination.pageSize },
    });
    diaries.value = data.list;
    diaryPagination.total = data.total || 0;
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    diaryLoading.value = false;
  }
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
    imageGroups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || null;
  } catch (e: any) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  } finally {
    imagesLoading.value = false;
  }
};

const openImagePicker = () => {
  fetchImages();
  tempSelectedImages.value = [...diaryForm.imageUrls];
  showImagePicker.value = true;
};

const toggleTempImage = (img: any) => {
  const index = tempSelectedImages.value.indexOf(img.url);
  if (index > -1) {
    tempSelectedImages.value.splice(index, 1);
  } else {
    tempSelectedImages.value.push(img.url);
  }
};

const confirmImages = () => {
  diaryForm.imageUrls = [...tempSelectedImages.value];
  showImagePicker.value = false;
};

const openDiaryDialog = (item?: Diary) => {
  if (item) {
    editingDiary.value = item;
    diaryForm.content = item.content;
    diaryForm.weather = item.weather || "";
    diaryForm.mood = item.mood || "";
    diaryForm.imageUrls = item.images ? item.images.map((img) => img.imageUrl) : [];
    diaryForm.isOutside = item.isOutside || false;
  } else {
    editingDiary.value = null;
    diaryForm.content = "";
    diaryForm.weather = "";
    diaryForm.mood = "";
    diaryForm.imageUrls = [];
    diaryForm.isOutside = false;
  }
  showDiaryDialog.value = true;
};

const saveDiary = async () => {
  try {
    const payload = {
      content: diaryForm.content,
      weather: diaryForm.weather || null,
      mood: diaryForm.mood || null,
      imageUrls: diaryForm.imageUrls,
      isOutside: diaryForm.isOutside,
    };
    if (editingDiary.value) {
      await http.put(`/diary/${editingDiary.value.id}`, payload);
      success("更新成功");
    } else {
      await http.post("/diary", payload);
      success("记录成功");
    }
    showDiaryDialog.value = false;
    await fetchDiaries();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteDiary = async (item: Diary) => {
  if (!confirm("确定删除这条日记吗？")) return;
  try {
    await http.delete(`/diary/${item.id}`);
    success("删除成功");
    await fetchDiaries();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

// ===== 回忆录 =====
interface MemoirCategory {
  id: string;
  name: string;
  icon: string;
  description: string | null;
  isDefault: boolean;
}

interface MemoirEntry {
  id: string;
  userId: string;
  type: string;
  title: string;
  content: string;
  imageUrl: string | null;
  categoryId: string | null;
  category?: MemoirCategory;
  eventDate: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
const memoirEntries = ref<MemoirEntry[]>([]);
const memoirCategories = ref<MemoirCategory[]>([]);
const memoirLoading = ref(true);
const memoirPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
const showMemoirDialog = ref(false);
const editingMemoir = ref<MemoirEntry | null>(null);
const memoirForm = reactive({
  title: "",
  content: "",
  categoryId: "",
  eventDate: "",
});
const newMemoirCategoryName = ref("");

const memoirEntriesFiltered = computed(() => memoirEntries.value.filter((m) => m.type === "text"));

const fetchMemoirs = async () => {
  memoirLoading.value = true;
  try {
    const [entriesData, categoriesData] = await Promise.all([
      http.get<PaginationResult<MemoirEntry>>("/memoir/entries", {
        params: { page: memoirPagination.page, pageSize: memoirPagination.pageSize },
      }),
      http.get<MemoirCategory[]>("/memoir/categories"),
    ]);
    memoirEntries.value = entriesData.list;
    memoirPagination.total = entriesData.total || 0;
    memoirCategories.value = categoriesData;
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    memoirLoading.value = false;
  }
};

const openMemoirDialog = (item?: MemoirEntry) => {
  if (item) {
    editingMemoir.value = item;
    memoirForm.title = item.title;
    memoirForm.content = item.content;
    memoirForm.categoryId = item.categoryId || "";
    memoirForm.eventDate = item.eventDate
      ? new Date(item.eventDate).toISOString().split("T")[0]
      : "";
  } else {
    editingMemoir.value = null;
    memoirForm.title = "";
    memoirForm.content = "";
    memoirForm.categoryId = memoirCategories.value.find((c) => c.isDefault)?.id || "";
    memoirForm.eventDate = "";
  }
  showMemoirDialog.value = true;
};

const saveMemoir = async () => {
  try {
    const payload = {
      type: "text",
      title: memoirForm.title,
      content: memoirForm.content,
      categoryId: memoirForm.categoryId || null,
      eventDate: memoirForm.eventDate || null,
    };
    if (editingMemoir.value) {
      await http.put(`/memoir/entries/${editingMemoir.value.id}`, payload);
      success("更新成功");
    } else {
      await http.post("/memoir/entries", payload);
      success("创建成功");
    }
    showMemoirDialog.value = false;
    await fetchMemoirs();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteMemoir = async (item: MemoirEntry) => {
  if (!confirm(`确定删除「${item.title}」吗？`)) return;
  try {
    await http.delete(`/memoir/entries/${item.id}`);
    success("删除成功");
    await fetchMemoirs();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

const addMemoirCategory = async () => {
  const name = newMemoirCategoryName.value.trim();
  if (!name) {
    warning("请输入分类名称");
    return;
  }
  if (memoirCategories.value.some((c) => c.name === name)) {
    warning("分类已存在");
    return;
  }
  try {
    const newCat = await http.post<MemoirCategory>("/memoir/categories", {
      name,
      icon: "📖",
    });
    memoirCategories.value.push(newCat);
    memoirForm.categoryId = newCat.id;
    newMemoirCategoryName.value = "";
    success("分类添加成功");
  } catch (e: any) {
    error(e.message || "添加分类失败");
  }
};

const deleteMemoirCategory = async (categoryId: string) => {
  const category = memoirCategories.value.find((c) => c.id === categoryId);
  if (!category) return;
  if (!confirm(`确定删除分类「${category.name}」吗？该分类下的条目将变为未分类。`)) return;
  try {
    await http.delete(`/memoir/categories/${categoryId}`);
    if (memoirForm.categoryId === categoryId) {
      memoirForm.categoryId = "";
    }
    await fetchMemoirs();
    success("删除成功");
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

// ===== 梦境 =====
interface Dream {
  id: string;
  content: string;
  dreamDate: string;
}
const dreams = ref<Dream[]>([]);
const dreamLoading = ref(true);
const dreamPagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
});
const showDreamDialog = ref(false);
const editingDream = ref<Dream | null>(null);
const dreamForm = reactive({ content: "" });

const fetchDreams = async () => {
  dreamLoading.value = true;
  try {
    const data = await http.get<PaginationResult<Dream>>("/dream", {
      params: { page: dreamPagination.page, pageSize: dreamPagination.pageSize },
    });
    dreams.value = data.list;
    dreamPagination.total = data.total || 0;
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    dreamLoading.value = false;
  }
};

const openDreamDialog = (item?: Dream) => {
  if (item) {
    editingDream.value = item;
    dreamForm.content = item.content;
  } else {
    editingDream.value = null;
    dreamForm.content = "";
  }
  showDreamDialog.value = true;
};

const saveDream = async () => {
  try {
    if (editingDream.value) {
      await http.put(`/dream/${editingDream.value.id}`, { content: dreamForm.content });
      success("更新成功");
    } else {
      await http.post("/dream", { content: dreamForm.content });
      success("记录成功");
    }
    showDreamDialog.value = false;
    await fetchDreams();
  } catch (e: any) {
    error(e.message || "保存失败");
  }
};

const deleteDream = async (item: Dream) => {
  if (!confirm("确定删除这条梦境记录吗？")) return;
  try {
    await http.delete(`/dream/${item.id}`);
    success("删除成功");
    await fetchDreams();
  } catch (e: any) {
    error(e.message || "删除失败");
  }
};

// ===== 日记分页 =====
const prevDiaryPage = () => {
  if (diaryPagination.page > 1) {
    diaryPagination.page--;
    fetchDiaries();
  }
};

const nextDiaryPage = () => {
  const maxPage = Math.ceil(diaryPagination.total / diaryPagination.pageSize);
  if (diaryPagination.page < maxPage) {
    diaryPagination.page++;
    fetchDiaries();
  }
};

// ===== 回忆录分页 =====
const prevMemoirPage = () => {
  if (memoirPagination.page > 1) {
    memoirPagination.page--;
    fetchMemoirs();
  }
};

const nextMemoirPage = () => {
  const maxPage = Math.ceil(memoirPagination.total / memoirPagination.pageSize);
  if (memoirPagination.page < maxPage) {
    memoirPagination.page++;
    fetchMemoirs();
  }
};

// ===== 梦境分页 =====
const prevDreamPage = () => {
  if (dreamPagination.page > 1) {
    dreamPagination.page--;
    fetchDreams();
  }
};

const nextDreamPage = () => {
  const maxPage = Math.ceil(dreamPagination.total / dreamPagination.pageSize);
  if (dreamPagination.page < maxPage) {
    dreamPagination.page++;
    fetchDreams();
  }
};

// ===== 通用 =====
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
};

watch(activeTab, (tab) => {
  diaryPagination.page = 1;
  memoirPagination.page = 1;
  dreamPagination.page = 1;
  if (tab === "diary") fetchDiaries();
  if (tab === "memoir") fetchMemoirs();
  if (tab === "dream") fetchDreams();
});

onMounted(async () => {
  await loadConfig();
  fetchDiaries();
});
</script>
