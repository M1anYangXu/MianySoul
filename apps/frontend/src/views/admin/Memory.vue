<template>
  <div class="memory-page max-w-5xl mx-auto">
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
            <Heart class="w-7 h-7 inline mr-2" />
            {{ moduleName }}
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            {{ moduleDescription }}
          </p>
        </div>
      </div>
    </div>

    <div class="flex space-x-1 p-1 rounded-xl" :class="isDark ? 'bg-gray-700' : 'bg-gray-100'">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-lg text-sm font-medium transition-all duration-200"
        :class="
          activeTab === tab.key
            ? isDark
              ? 'bg-gray-600 text-white shadow-md'
              : 'bg-white text-gray-900 shadow-sm'
            : isDark
              ? 'text-gray-400 hover:text-white'
              : 'text-gray-600 hover:text-gray-900'
        "
        @click="activeTab = tab.key"
      >
        <component :is="tab.icon" class="w-4 h-4" />
        <span>{{ tab.name }}</span>
      </button>
    </div>

    <!-- 日记 Tab -->
    <div v-if="activeTab === 'diary'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 rounded-lg gradient-danger text-white text-sm font-medium"
          @click="openDiaryDialog()"
        >
          + 写日记
        </button>
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
        <FileText
          class="w-12 h-12 mx-auto mb-3"
          :class="isDark ? 'text-gray-500' : 'text-gray-400'"
        />
        <p>还没有日记</p>
        <p class="text-sm mt-1">记录下今天的心情吧</p>
      </div>
      <div v-else class="space-y-4">
        <div
          v-for="item in diaries"
          :key="item.id"
          class="rounded-2xl border shadow-md overflow-hidden"
          :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
        >
          <div class="p-4">
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
                  <Edit3 class="w-4 h-4" />
                </button>
                <button
                  class="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 transition-colors"
                  @click="deleteDiary(item)"
                >
                  <Trash2 class="w-4 h-4" />
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
    </div>

    <!-- 回忆录 Tab -->
    <div v-if="activeTab === 'memoir'" class="mt-6">
      <div class="flex justify-end space-x-2 mb-4">
        <button
          class="px-4 py-2 rounded-lg gradient-warning text-white text-sm font-medium"
          @click="openMemoirDialog('text')"
        >
          + 写回忆录
        </button>
        <button
          class="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium"
          @click="openMemoirDialog('photo')"
        >
          + 照片回忆
        </button>
      </div>

      <!-- 普通回忆录 -->
      <div class="mb-8">
        <h3
          class="text-lg font-semibold mb-4 flex items-center"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <BookOpen class="w-5 h-5 mr-2" />
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
          v-else-if="textMemoirs.length === 0"
          class="text-center py-12 rounded-xl border-2 border-dashed"
          :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
        >
          <BookOpen
            class="w-12 h-12 mx-auto mb-3"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          />
          <p>还没有回忆录</p>
          <p class="text-sm mt-1">记录下你的回忆吧</p>
        </div>
        <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div
            v-for="item in textMemoirs"
            :key="item.id"
            class="group p-3 rounded-xl border shadow-sm cursor-pointer hover:shadow-md transition-all"
            :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
            @click="openMemoirDialog('text', item)"
          >
            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ item.title }}
              </h3>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
                <button
                  class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500"
                  @click.stop="openMemoirDialog('text', item)"
                >
                  <Edit3 class="w-3.5 h-3.5" />
                </button>
                <button
                  class="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                  @click.stop="deleteMemoir(item)"
                >
                  <Trash2 class="w-3.5 h-3.5" />
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
                <Calendar class="w-3 h-3 inline mr-1" />
                {{ formatDate(item.eventDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 照片回忆 -->
      <div>
        <h3
          class="text-lg font-semibold mb-4 flex items-center"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <Image class="w-5 h-5 mr-2" />
          照片回忆
        </h3>
        <div
          v-if="photoMemoirs.length === 0"
          class="text-center py-12 rounded-xl border-2 border-dashed"
          :class="isDark ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'"
        >
          <Image
            class="w-12 h-12 mx-auto mb-3"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          />
          <p>还没有照片回忆</p>
          <p class="text-sm mt-1">上传一张照片，记录背后的故事</p>
        </div>
        <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          <div
            v-for="item in photoMemoirs"
            :key="item.id"
            class="group rounded-xl overflow-hidden border shadow-sm cursor-pointer hover:shadow-md transition-all"
            :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
            @click="openMemoirDialog('photo', item)"
          >
            <div class="relative aspect-square">
              <img
                :src="getFullImageUrl(item.imageUrl || '')"
                :alt="item.title"
                class="w-full h-full object-cover"
              />
              <div
                class="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
              >
                <div class="flex space-x-2">
                  <button
                    class="p-2 rounded-full bg-white/90 text-gray-700 hover:bg-white transition-colors"
                    @click.stop="openMemoirDialog('photo', item)"
                  >
                    <Edit3 class="w-4 h-4" />
                  </button>
                  <button
                    class="p-2 rounded-full bg-white/90 text-red-500 hover:bg-white transition-colors"
                    @click.stop="deleteMemoir(item)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            <div class="p-2">
              <h3
                class="text-sm font-semibold truncate"
                :class="isDark ? 'text-white' : 'text-gray-900'"
              >
                {{ item.title }}
              </h3>
              <div class="flex items-center gap-2 text-xs mt-1">
                <span
                  v-if="item.category"
                  class="px-1.5 py-0.5 rounded-full"
                  :class="isDark ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-500'"
                >
                  {{ item.category.icon }} {{ item.category.name }}
                </span>
                <span v-if="item.eventDate" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
                  <Calendar class="w-3 h-3 inline mr-1" />
                  {{ formatDate(item.eventDate) }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 梦境 Tab -->
    <div v-if="activeTab === 'dream'" class="mt-6">
      <div class="flex justify-end mb-4">
        <button
          class="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium"
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
        <Moon class="w-12 h-12 mx-auto mb-3" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
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
                <Edit3 class="w-3.5 h-3.5" />
              </button>
              <button
                class="p-1 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500"
                @click="deleteDream(item)"
              >
                <Trash2 class="w-3.5 h-3.5" />
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
    </div>

    <!-- 日记弹窗 -->
    <div
      v-if="showDiaryDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showDiaryDialog = false"
    >
      <div
        class="w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
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
                <Image class="w-4 h-4" />
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
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-pink-500 resize-none"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
            ></textarea>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showDiaryDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-danger text-white text-sm font-medium"
            :disabled="!diaryForm.content.trim()"
            @click="saveDiary"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 日记图片选择弹窗 -->
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
          <!-- 分组选择器 -->
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

    <!-- 回忆录弹窗 -->
    <div
      v-if="showMemoirDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showMemoirDialog = false"
    >
      <div
        class="w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ editingMemoir ? "编辑" : memoirForm.type === "photo" ? "照片回忆" : "写回忆录" }}
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
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
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
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500 resize-none"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
            ></textarea>
          </div>

          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              分类
            </label>
            <select
              v-model="memoirForm.categoryId"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
            >
              <option v-for="cat in memoirCategories" :key="cat.id" :value="cat.id">
                {{ cat.icon }} {{ cat.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm mb-1" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              事件日期
            </label>
            <input
              v-model="memoirForm.eventDate"
              type="date"
              class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-rose-500"
              :class="
                isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'
              "
            />
          </div>

          <div v-if="memoirForm.type === 'photo'">
            <label class="block text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
              图片 *
            </label>
            <div class="flex space-x-3">
              <button
                class="flex-1 px-3 py-2 rounded-lg border border-dashed text-sm flex items-center justify-center space-x-2"
                :class="
                  isDark
                    ? 'bg-gray-700 border-gray-600 text-gray-400'
                    : 'bg-gray-50 border-gray-300 text-gray-600'
                "
                @click="openMemoirImagePicker"
              >
                <Image class="w-4 h-4" />
                <span>{{ memoirForm.imageUrl ? "更换图片" : "从图集中选择" }}</span>
              </button>
            </div>
            <div v-if="memoirForm.imageUrl" class="mt-3">
              <div class="relative w-full max-w-xs rounded-lg overflow-hidden">
                <img
                  :src="getFullImageUrl(memoirForm.imageUrl)"
                  :alt="memoirForm.title"
                  class="w-full h-32 object-cover"
                />
                <button
                  class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/60 text-white flex items-center justify-center text-sm hover:bg-black/80"
                  @click="memoirForm.imageUrl = ''"
                >
                  ×
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="flex justify-end space-x-2 mt-6">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showMemoirDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-warning text-white text-sm font-medium"
            :disabled="
              !memoirForm.title.trim() ||
              !memoirForm.content.trim() ||
              (memoirForm.type === 'photo' && !memoirForm.imageUrl)
            "
            @click="saveMemoir"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 回忆录图片选择弹窗 -->
    <div
      v-if="showMemoirImagePicker"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showMemoirImagePicker = false"
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
              @click="showMemoirImagePicker = false"
            >
              ✕
            </button>
          </div>
          <div class="flex flex-wrap gap-2 mt-3">
            <button
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                memoirSelectedGroupId === null
                  ? 'bg-pink-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="memoirSelectedGroupId = null"
            >
              <Image class="w-4 h-4 inline mr-1" />
              全部
            </button>
            <button
              v-for="group in imageGroups"
              :key="group.id"
              class="px-3 py-1.5 rounded-full text-sm transition-all"
              :class="
                memoirSelectedGroupId === group.id
                  ? 'bg-pink-500 text-white'
                  : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="memoirSelectedGroupId = group.id"
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
            v-else-if="memoirFilteredImages.length === 0"
            class="text-center py-12"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          >
            <Image
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p>还没有图片</p>
            <p class="text-sm mt-1">请先上传图片到图集</p>
          </div>
          <div v-else class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in memoirFilteredImages"
              :key="img.id"
              class="relative cursor-pointer rounded-lg overflow-hidden border-2 hover:border-pink-500 transition-all"
              :class="
                memoirForm.imageUrl === img.url
                  ? 'border-pink-500 ring-2 ring-pink-500/50'
                  : isDark
                    ? 'border-gray-700'
                    : 'border-gray-200'
              "
              @click="selectMemoirImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-32 object-cover"
              />
              <div
                v-if="memoirForm.imageUrl === img.url"
                class="absolute inset-0 bg-black/40 flex items-center justify-center"
              >
                <span class="text-white text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 梦境弹窗 -->
    <div
      v-if="showDreamDialog"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showDreamDialog = false"
    >
      <div
        class="w-full max-w-lg p-5 rounded-xl shadow-xl"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <h2 class="text-lg font-semibold mb-4" :class="isDark ? 'text-white' : 'text-gray-900'">
          {{ editingDream ? "编辑梦境" : "记录梦境" }}
        </h2>
        <textarea
          v-model="dreamForm.content"
          rows="8"
          placeholder="记录你梦到了什么..."
          class="w-full px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
          :class="isDark ? 'bg-gray-700 border-gray-600 text-white' : 'bg-white border-gray-300'"
        ></textarea>
        <div class="flex justify-end space-x-2 mt-4">
          <button
            class="px-4 py-2 rounded-lg text-sm"
            :class="isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'"
            @click="showDreamDialog = false"
          >
            取消
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-primary text-white text-sm font-medium"
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
import { Heart, BookOpen, Moon, Calendar, Image, Edit3, Trash2, FileText } from "lucide-vue-next";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");
const { success, error } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const moduleName = computed(() => getModuleName("memory"));
const moduleDescription = computed(() => getModuleDescription("memory"));

const tabs = [
  { key: "diary", name: "日记", icon: FileText },
  { key: "memoir", name: "回忆录", icon: BookOpen },
  { key: "dream", name: "梦境", icon: Moon },
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
const images = ref<Image[]>([]);
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
    const data = await http.get<PaginationResult<Diary>>("/diary");
    diaries.value = data.list;
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
  type: "text" | "photo";
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
const showMemoirDialog = ref(false);
const editingMemoir = ref<MemoirEntry | null>(null);
const memoirForm = reactive({
  type: "text" as "text" | "photo",
  title: "",
  content: "",
  imageUrl: "",
  categoryId: "",
  eventDate: "",
});

const showMemoirImagePicker = ref(false);
const memoirSelectedGroupId = ref<string | null>(null);

const textMemoirs = computed(() => memoirEntries.value.filter((m) => m.type === "text"));
const photoMemoirs = computed(() => memoirEntries.value.filter((m) => m.type === "photo"));

const memoirFilteredImages = computed(() => {
  if (!memoirSelectedGroupId.value) {
    return images.value;
  }
  return images.value.filter((img) => img.group?.id === memoirSelectedGroupId.value);
});

const fetchMemoirs = async () => {
  memoirLoading.value = true;
  try {
    const [entriesData, categoriesData] = await Promise.all([
      http.get<PaginationResult<MemoirEntry>>("/memoir/entries"),
      http.get<MemoirCategory[]>("/memoir/categories"),
    ]);
    memoirEntries.value = entriesData.list;
    memoirCategories.value = categoriesData;
  } catch (e: any) {
    error(e.message || "加载失败");
  } finally {
    memoirLoading.value = false;
  }
};

const openMemoirDialog = (type: "text" | "photo", item?: MemoirEntry) => {
  memoirForm.type = type;
  if (item) {
    editingMemoir.value = item;
    memoirForm.title = item.title;
    memoirForm.content = item.content;
    memoirForm.imageUrl = item.imageUrl || "";
    memoirForm.categoryId = item.categoryId || "";
    memoirForm.eventDate = item.eventDate
      ? new Date(item.eventDate).toISOString().split("T")[0]
      : "";
  } else {
    editingMemoir.value = null;
    memoirForm.title = "";
    memoirForm.content = "";
    memoirForm.imageUrl = "";
    memoirForm.categoryId = memoirCategories.value.find((c) => c.isDefault)?.id || "";
    memoirForm.eventDate = "";
  }
  showMemoirDialog.value = true;
};

const openMemoirImagePicker = () => {
  memoirSelectedGroupId.value = null;
  showMemoirImagePicker.value = true;
};

const selectMemoirImage = (img: Image) => {
  memoirForm.imageUrl = img.url;
};

const saveMemoir = async () => {
  try {
    const payload = {
      type: memoirForm.type,
      title: memoirForm.title,
      content: memoirForm.content,
      imageUrl: memoirForm.imageUrl || null,
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

// ===== 梦境 =====
interface Dream {
  id: string;
  content: string;
  dreamDate: string;
}
const dreams = ref<Dream[]>([]);
const dreamLoading = ref(true);
const showDreamDialog = ref(false);
const editingDream = ref<Dream | null>(null);
const dreamForm = reactive({ content: "" });

const fetchDreams = async () => {
  dreamLoading.value = true;
  try {
    const data = await http.get<PaginationResult<Dream>>("/dream");
    dreams.value = data.list;
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

// ===== 通用 =====
const formatDate = (dateStr: string) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString("zh-CN", { year: "numeric", month: "long", day: "numeric" });
};

watch(activeTab, (tab) => {
  if (tab === "diary") fetchDiaries();
  if (tab === "memoir") fetchMemoirs();
  if (tab === "dream") fetchDreams();
});

onMounted(async () => {
  await loadConfig();
  fetchDiaries();
});
</script>
