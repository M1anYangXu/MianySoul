<template>
  <div class="w-full max-w-5xl md:max-w-6xl lg:max-w-7xl mx-auto">
    <div v-if="viewMode === 'list'">
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
              <FileText class="w-7 h-7 inline mr-2" />
              {{ moduleName }}
            </h1>
            <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              {{ moduleDescription }}
            </p>
          </div>
          <div class="flex items-center space-x-4">
            <button
              class="px-4 py-2 rounded-lg gradient-warning text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              @click="openCategoryModal"
            >
              <Folder class="w-4 h-4 inline mr-1" />
              分类管理
            </button>
            <button
              class="px-6 py-2.5 gradient-danger text-white rounded-lg font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
              @click="openEditor"
            >
              + 写文章
            </button>
          </div>
        </div>
      </div>
      <!-- 搜索和筛选 -->
      <div
        class="rounded-xl border shadow-sm p-4 mb-6"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="flex flex-wrap items-center gap-3">
          <!-- 搜索框 + 搜索按钮 -->
          <div class="flex flex-1 min-w-[280px] items-center gap-2">
            <div class="relative flex-1">
              <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索文章标题或内容..."
                class="w-full pl-9 pr-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
                @keyup.enter="handleSearch"
              />
            </div>
            <button
              class="px-5 py-2.5 rounded-lg font-medium text-white gradient-secondary hover:opacity-90 transition-opacity"
              @click="handleSearch"
            >
              搜索
            </button>
          </div>

          <!-- 分类自定义下拉 -->
          <div ref="filterCategoryRef" class="relative">
            <button
              type="button"
              class="px-4 py-2.5 rounded-lg border min-w-[140px] flex items-center justify-between gap-2 transition-colors"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                  : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
              "
              @click="filterCategoryOpen = !filterCategoryOpen"
            >
              <span class="truncate">{{ getFilterCategoryLabel() }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': filterCategoryOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="filterCategoryOpen"
              class="absolute z-20 mt-2 w-56 max-h-64 overflow-y-auto rounded-xl border shadow-lg"
              :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'"
            >
              <button
                type="button"
                class="w-full px-4 py-2 text-left text-sm transition-colors"
                :class="
                  filterCategory === ''
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-cyan-50 text-cyan-600'
                    : isDark
                      ? 'hover:bg-gray-600 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-800'
                "
                @click="selectFilterCategory('')"
              >
                全部分类
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                class="w-full px-4 py-2 text-left text-sm transition-colors"
                :class="
                  filterCategory === cat.id
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-cyan-50 text-cyan-600'
                    : isDark
                      ? 'hover:bg-gray-600 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-800'
                "
                @click="selectFilterCategory(cat.id)"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <!-- 状态自定义下拉 -->
          <div ref="filterStatusRef" class="relative">
            <button
              type="button"
              class="px-4 py-2.5 rounded-lg border min-w-[140px] flex items-center justify-between gap-2 transition-colors"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white hover:bg-gray-600'
                  : 'border-gray-200 bg-white text-gray-800 hover:bg-gray-50'
              "
              @click="filterStatusOpen = !filterStatusOpen"
            >
              <span class="truncate">{{ getFilterStatusLabel() }}</span>
              <svg
                class="w-4 h-4 transition-transform"
                :class="{ 'rotate-180': filterStatusOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            <div
              v-if="filterStatusOpen"
              class="absolute z-20 mt-2 w-40 max-h-64 overflow-y-auto rounded-xl border shadow-lg"
              :class="isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-200'"
            >
              <button
                v-for="opt in statusOptions"
                :key="opt.value"
                type="button"
                class="w-full px-4 py-2 text-left text-sm transition-colors"
                :class="
                  filterStatus === opt.value
                    ? isDark
                      ? 'bg-cyan-500/20 text-cyan-300'
                      : 'bg-cyan-50 text-cyan-600'
                    : isDark
                      ? 'hover:bg-gray-600 text-gray-200'
                      : 'hover:bg-gray-50 text-gray-800'
                "
                @click="selectFilterStatus(opt.value)"
              >
                {{ opt.label }}
              </button>
            </div>
          </div>

          <button
            class="px-4 py-2.5 rounded-lg border transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
            @click="resetFilters"
          >
            重置
          </button>
        </div>
      </div>

      <!-- 文章列表 -->
      <div class="space-y-3">
        <div
          v-for="article in articles"
          :key="article.id"
          class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
          :class="
            isDark
              ? 'bg-gray-800/60 border-gray-700/50 hover:border-violet-500/30'
              : 'bg-white border-gray-200/50 hover:border-violet-200'
          "
        >
          <div class="flex-shrink-0">
            <img
              v-if="article.coverImage"
              :src="getFullImageUrl(article.coverImage)"
              :alt="article.title"
              class="w-20 h-14 object-cover rounded-lg"
            />
            <span
              v-else
              class="w-20 h-14 flex items-center justify-center rounded-lg"
              :class="isDark ? 'bg-gray-700' : 'bg-gray-100'"
            >
              <FileText class="w-8 h-8" :class="isDark ? 'text-gray-500' : 'text-gray-400'" />
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3
                class="font-medium truncate cursor-pointer transition-colors"
                :class="
                  isDark
                    ? 'text-white group-hover:text-violet-300'
                    : 'text-gray-900 group-hover:text-violet-600'
                "
                @click="openEditor(article)"
              >
                {{ article.title }}
              </h3>
              <span
                class="w-2 h-2 rounded-full flex-shrink-0"
                :class="article.status === 'published' ? 'bg-green-500' : 'bg-red-500'"
              ></span>
            </div>
            <div class="flex items-center gap-3 text-sm">
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                分类：{{ article.category?.name || "默认分类" }}
              </span>
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                阅读 {{ article.viewCount }}
              </span>
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">评论 0</span>
            </div>
          </div>

          <div class="flex-shrink-0 flex items-center gap-4">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ getStatusText(article.status) }}
            </span>
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ formatDate(article.createdAt) }}
            </span>
            <div class="flex items-center gap-2">
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                "
                title="编辑"
                @click="openEditor(article)"
              >
                <Edit3 class="w-4 h-4" />
              </button>
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                "
                :title="article.status === 'published' ? '设为前端不可见' : '发布'"
                @click="toggleStatus(article)"
              >
                <component :is="article.status === 'published' ? EyeOff : Rocket" class="w-4 h-4" />
              </button>
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                :class="
                  isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                "
                title="删除"
                @click="deleteArticle(article)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="articles.length === 0" class="text-center py-16">
          <FileText
            class="w-16 h-16 mx-auto mb-4"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          />
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">暂无文章数据</p>
        </div>
      </div>

      <!-- 分页 -->
      <div
        v-if="pagination.total > pagination.limit"
        class="mt-6 flex items-center justify-between"
      >
        <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          共 {{ pagination.total }} 篇文章
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
    </div>

    <!-- 编辑器视图 -->
    <div v-else>
      <div class="mb-6 flex items-center justify-between">
        <button
          class="flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors"
          :class="
            isDark
              ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
              : 'border-gray-200 text-gray-700 hover:bg-gray-50'
          "
          @click="goBack"
        >
          <span>←</span>
          <span>返回列表</span>
        </button>
        <div class="flex items-center space-x-3">
          <button
            v-if="editingArticle"
            class="flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
            @click="openPublishSettingsModal"
          >
            <Settings class="w-4 h-4" />
            设置
          </button>
          <button
            class="px-4 py-2 rounded-lg border transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
            @click="saveDraft"
          >
            存为草稿
          </button>
          <button
            class="px-6 py-2.5 gradient-danger text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            @click="publishArticle"
          >
            {{ editingArticle ? "更新文章" : "发布文章" }}
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- 标题输入 -->
        <div
          class="rounded-2xl border p-6"
          :class="isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'"
          style="backdrop-filter: blur(12px)"
        >
          <input
            v-model="form.title"
            type="text"
            placeholder="输入文章标题..."
            class="w-full text-3xl font-bold bg-transparent border-none focus:outline-none focus:ring-0"
            :class="
              isDark ? 'text-white placeholder-gray-500' : 'text-gray-900 placeholder-gray-400'
            "
          />
        </div>

        <!-- 编辑器 -->
        <div
          class="rounded-2xl border p-6"
          :class="isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'"
          style="backdrop-filter: blur(12px)"
        >
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-lg font-semibold flex items-center gap-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              <Edit3 class="w-4 h-4" />
              文章内容
            </h3>
            <button
              class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105"
              :class="
                isDark
                  ? 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              "
              @click="openEditorImagePicker"
            >
              <Image class="w-4 h-4" />
              从图集选择图片
            </button>
          </div>
          <div
            class="w-full h-[600px] rounded-xl byte-editor-container"
            :class="isDark ? 'bg-gray-900/50' : 'bg-white'"
          >
            <ByteEditor
              ref="editorRef"
              v-model="editorContent"
              :upload-image="handleEditorUpload"
              @on-load="handleEditorLoad"
              @on-select-image="openEditorImagePicker"
            />
          </div>
        </div>

        <!-- 摘要 -->
        <div
          class="rounded-2xl border p-6"
          :class="isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'"
          style="backdrop-filter: blur(12px)"
        >
          <h3
            class="text-lg font-semibold mb-4 flex items-center gap-2"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <FileText class="w-4 h-4" />
            文章摘要
          </h3>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="简短描述文章内容，用于列表页展示..."
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700/50 text-white placeholder-gray-500'
                : 'border-gray-200 bg-gray-50/50 text-gray-900 placeholder-gray-400'
            "
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 发布设置弹窗 -->
    <div
      v-if="showPublishSettingsModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closePublishSettingsModal"
    >
      <div
        class="w-full max-w-lg rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">发布设置</h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="closePublishSettingsModal"
          >
            <svg
              class="w-5 h-5"
              :class="isDark ? 'text-white' : 'text-black'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-6">
          <!-- 分类 -->
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              文章分类
            </label>
            <div class="flex items-center gap-2">
              <span
                class="px-3 py-1.5 rounded-lg text-sm font-medium bg-violet-500/20 text-violet-400"
              >
                {{ currentCategoryName }}
              </span>
              <button
                type="button"
                class="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                @click="openCategorySelector"
              >
                <svg
                  class="w-4 h-4"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- 封面 -->
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              封面图片
            </label>
            <div
              v-if="form.coverImage"
              class="relative w-full aspect-video rounded-xl overflow-hidden border group mb-2"
              :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            >
              <img
                :src="getFullImageUrl(form.coverImage)"
                alt="封面"
                class="w-full h-full object-cover"
                @error="form.coverImage = ''"
              />
              <button
                type="button"
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                @click="form.coverImage = ''"
              >
                移除封面
              </button>
            </div>
            <button
              type="button"
              class="w-full px-4 py-2.5 rounded-xl border border-dashed text-sm flex items-center justify-center gap-2 transition-all"
              :class="
                isDark
                  ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:bg-gray-700/30'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:bg-gray-50'
              "
              @click="openImagePicker"
            >
              <Image class="w-4 h-4" />
              <span>{{ form.coverImage ? "更换封面" : "选择封面图片" }}</span>
            </button>
          </div>
        </div>
        <div
          class="flex items-center justify-end gap-3 p-6 border-t"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-4 py-2 rounded-lg border transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
            @click="handleCancelPublishSettings"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 gradient-danger text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            @click="closePublishSettingsModal"
          >
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 分类管理弹窗 -->
    <div
      v-if="showCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeCategoryModal"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">分类管理</h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="closeCategoryModal"
          >
            <svg
              class="w-5 h-5"
              :class="isDark ? 'text-white' : 'text-black'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="flex items-center justify-between mb-4">
            <input
              v-model="categorySearch"
              type="text"
              placeholder="搜索分类..."
              class="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
            />
            <button
              class="ml-4 px-4 py-2 gradient-warning text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              @click="openAddCategory"
            >
              + 添加
            </button>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-if="filteredCategories.length === 0" class="p-4 text-center text-gray-500">
              暂无分类
            </div>
            <div
              v-for="cat in filteredCategories"
              :key="cat.id"
              class="flex items-center justify-between p-3 rounded-lg"
              :class="isDark ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <span class="font-medium" :class="isDark ? 'text-white' : 'text-black'">
                {{ cat.name }}
              </span>
              <div class="flex items-center space-x-2">
                <button
                  v-if="cat.name !== '默认分类'"
                  class="px-3 py-1 rounded-lg text-sm bg-red-500 text-white"
                  @click="deleteCategory(cat)"
                >
                  删除
                </button>
                <span v-else class="px-3 py-1 rounded-lg text-sm bg-gray-200 text-gray-500">
                  默认
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 添加分类弹窗 -->
    <div
      v-if="showAddCategoryModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeAddCategoryModal"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">添加分类</h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="closeAddCategoryModal"
          >
            <svg
              class="w-5 h-5"
              :class="isDark ? 'text-white' : 'text-black'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              分类名称
            </label>
            <input
              v-model="categoryForm.name"
              type="text"
              class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-200 bg-white text-black'
              "
              placeholder="输入分类名称"
            />
          </div>
        </div>
        <div
          class="p-6 border-t flex justify-end space-x-4"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-6 py-2.5 border rounded-lg font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="closeAddCategoryModal"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 gradient-warning text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            @click="saveCategory"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 分类选择弹窗 -->
    <div
      v-if="showCategorySelector"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeCategorySelector"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">选择分类</h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="closeCategorySelector"
          >
            <svg
              class="w-5 h-5"
              :class="isDark ? 'text-white' : 'text-black'"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <input
            v-model="categorySelectorSearch"
            type="text"
            placeholder="搜索分类..."
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 mb-4"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <label
              v-for="cat in filteredCategoriesForSelector"
              :key="cat.id"
              class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:opacity-80"
              :class="isDark ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <input
                type="radio"
                :checked="form.categoryId === cat.id"
                class="w-4 h-4"
                @change="selectCategory(cat.id)"
              />
              <span class="font-medium" :class="isDark ? 'text-white' : 'text-black'">
                {{ cat.name }}
              </span>
            </label>
          </div>
        </div>
        <div
          class="p-6 border-t flex justify-end space-x-4"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <button
            class="px-6 py-2.5 border rounded-lg font-medium transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-300 text-gray-700 hover:bg-gray-50'
            "
            @click="closeCategorySelector"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            @click="confirmCategorySelection"
          >
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 图片选择弹窗 -->
    <div
      v-if="showImagePicker"
      class="fixed inset-0 flex items-center justify-center bg-black/50 p-4"
      style="z-index: 10000"
      @click.self="handleCloseImagePicker"
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
              @click="handleCloseImagePicker"
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
              <component :is="getIconComponent(group.icon || '📁')" class="w-3 h-3 inline mr-1" />
              {{ group.name }}
            </button>
          </div>
        </div>
        <div class="p-4 overflow-y-auto max-h-[60vh]">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in filteredImages"
              :key="img.id"
              class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
              :class="
                form.coverImage === img.url
                  ? 'border-primary-500 ring-4 ring-primary-500/40 shadow-lg shadow-primary-500/30'
                  : isDark
                    ? 'border-gray-700 hover:border-gray-500'
                    : 'border-gray-200 hover:border-gray-400'
              "
              @click="selectImage(img)"
            >
              <img
                :src="getFullImageUrl(img.url)"
                :alt="img.filename"
                class="w-full h-full object-cover"
              />
              <div
                v-if="form.coverImage === img.url"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, watch } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";
import ByteEditor from "@/components/ByteEditor.vue";
import TurndownService from "turndown";
import { FileText, Folder, Edit3, Rocket, Trash2, Search, Settings, EyeOff } from "lucide-vue-next";

const appStore = useAppStore();
const { success, error, warning } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

const moduleName = computed(() => getModuleName("article"));
const moduleDescription = computed(() => getModuleDescription("article"));

interface GalleryImage {
  id: string;
  url: string;
  filename: string;
  group?: { id: string; name: string; icon: string };
}

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const getEditorImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const viewMode = ref<"list" | "editor">("list");

const editorRef = ref<InstanceType<typeof ByteEditor> | null>(null);

const editorContent = ref("");

const turndownService = new TurndownService();

const handleEditorLoad = () => {};

const convertHtmlToMarkdown = (html: string): string => {
  if (!html) return "";
  if (html.startsWith("{")) {
    try {
      const lakeJson = JSON.parse(html);
      if (lakeJson?.content) {
        return lakeJson.content;
      }
    } catch {
      return html;
    }
  }
  if (html.trim().startsWith("<")) {
    try {
      return turndownService.turndown(html);
    } catch {
      return html;
    }
  }
  return html;
};

// 文章列表
const articles = ref<any[]>([]);
const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
});

// 搜索筛选
const searchKeyword = ref("");
const filterCategory = ref("");
const filterStatus = ref("");

// 自定义下拉状态
const filterCategoryOpen = ref(false);
const filterStatusOpen = ref(false);
const filterCategoryRef = ref<HTMLElement | null>(null);
const filterStatusRef = ref<HTMLElement | null>(null);

// 状态选项
const statusOptions = [
  { value: "", label: "全部状态" },
  { value: "published", label: "已发布" },
  { value: "hidden", label: "前端不可见" },
];

// 分类
const categories = ref<any[]>([]);

interface ImageGroup {
  id: string;
  name: string;
  icon: string;
  isDefault?: boolean;
}

const iconOptions = [
  { emoji: "📁", icon: Folder, name: "Folder" },
  { emoji: "📂", icon: Folder, name: "Folder" },
];

const getIconComponent = (emoji: string) => {
  return iconOptions.find((opt) => opt.emoji === emoji)?.icon || Folder;
};

const showImagePicker = ref(false);
const images = ref<GalleryImage[]>([]);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);
const imagePickerMode = ref<"cover" | "editor">("cover");

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const fetchImages = async () => {
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
    selectedGroupId.value = defaultGroup?.id || imageGroups.value[0]?.id || null;
  } catch (e) {
    images.value = [];
    imageGroups.value = [];
    selectedGroupId.value = null;
  }
};

const openImagePicker = () => {
  fetchImages();
  showImagePicker.value = true;
};

const openEditorImagePicker = () => {
  imagePickerMode.value = "editor";
  fetchImages();
  showImagePicker.value = true;
};

const selectImage = async (img: GalleryImage) => {
  if (imagePickerMode.value === "cover") {
    form.coverImage = img.url;
  } else {
    const editorUrl = getEditorImageUrl(img.url);
    const imageMarkdown = `\n![${img.filename}](${editorUrl})\n`;
    editorContent.value += imageMarkdown;
  }
  showImagePicker.value = false;
};

const handleEditorUpload = async (files: File[]) => {
  const results: { url: string; alt?: string }[] = [];
  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const uploadResult = await http.post<{ url: string; filename: string; size: number }>(
      "/upload/single",
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    results.push({ url: getFullImageUrl(uploadResult.url), alt: uploadResult.filename });
  }
  return results;
};

const handleCloseImagePicker = () => {
  showImagePicker.value = false;
};

// ESC 键关闭弹窗
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeAllModals();
    filterCategoryOpen.value = false;
    filterStatusOpen.value = false;
  }
};

const closeAllModals = () => {
  showCategoryModal.value = false;
  showAddCategoryModal.value = false;
  showCategorySelector.value = false;
  showImagePicker.value = false;
};

// 点击外部关闭下拉
const handleClickOutside = (event: MouseEvent) => {
  if (filterCategoryRef.value && !filterCategoryRef.value.contains(event.target as Node)) {
    filterCategoryOpen.value = false;
  }
  if (filterStatusRef.value && !filterStatusRef.value.contains(event.target as Node)) {
    filterStatusOpen.value = false;
  }
};

// 搜索
const handleSearch = () => {
  pagination.page = 1;
  fetchArticles();
};

// 自定义下拉选项
const getFilterCategoryLabel = () => {
  if (!filterCategory.value) return "全部分类";
  const cat = categories.value.find((c) => c.id === filterCategory.value);
  return cat?.name || "全部分类";
};

const getFilterStatusLabel = () => {
  const opt = statusOptions.find((s) => s.value === filterStatus.value);
  return opt?.label || "全部状态";
};

const selectFilterCategory = (id: string) => {
  filterCategory.value = id;
  filterCategoryOpen.value = false;
  handleSearch();
};

const selectFilterStatus = (value: string) => {
  filterStatus.value = value;
  filterStatusOpen.value = false;
  handleSearch();
};

onMounted(async () => {
  document.addEventListener("keydown", handleEscKey);
  document.addEventListener("click", handleClickOutside);
  await loadConfig();
  fetchArticles();
  fetchCategories();
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscKey);
  document.removeEventListener("click", handleClickOutside);
});

// 表单数据
const form = reactive({
  title: "",
  content: "",
  excerpt: "",
  categoryId: "",
  coverImage: "",
  status: "published",
});

const editingArticle = ref<any>(null);

// 发布设置弹窗
const showPublishSettingsModal = ref(false);
const openPublishSettingsModal = () => {
  showPublishSettingsModal.value = true;
};
const closePublishSettingsModal = () => {
  showPublishSettingsModal.value = false;
};

const handleCancelPublishSettings = () => {
  pendingAction.value = null;
  showPublishSettingsModal.value = false;
};

// 分类管理弹窗
const showCategoryModal = ref(false);
const categorySearch = ref("");
const showAddCategoryModal = ref(false);
const categoryForm = reactive({
  name: "",
});

// 分类选择器
const showCategorySelector = ref(false);
const categorySelectorSearch = ref("");

// 筛选后的分类
const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value;
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  );
});

const filteredCategoriesForSelector = computed(() => {
  if (!categorySelectorSearch.value) return categories.value;
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(categorySelectorSearch.value.toLowerCase())
  );
});

const currentCategoryName = computed(() => {
  if (!form.categoryId) return "默认分类";
  const cat = categories.value.find((c) => c.id === form.categoryId);
  return cat?.name || "默认分类";
});

// 获取文章列表
const fetchArticles = async () => {
  try {
    const params: any = {
      page: pagination.page,
      limit: pagination.limit,
    };
    if (searchKeyword.value) params.keyword = searchKeyword.value;
    if (filterCategory.value) params.categoryId = filterCategory.value;
    if (filterStatus.value) params.status = filterStatus.value;

    const result = await http.get<{ list: any[]; total: number }>("/article", { params });
    console.log("文章列表响应:", result);
    const list = result?.list || [];
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    articles.value = list;
    pagination.total = result?.total || 0;
  } catch (err) {
    console.error("获取文章列表失败:", err);
    // 不显示错误弹框，避免重复提示
  }
};

// 获取分类列表
const fetchCategories = async () => {
  try {
    const result = await http.get<any[]>("/article/category");
    console.log("分类列表响应:", result);
    categories.value = result || [];
  } catch (err) {
    console.error("获取分类列表失败:", err);
    // 不显示错误弹框
  }
};

const openEditor = async (article?: any) => {
  editingArticle.value = article;
  if (article) {
    form.title = article.title || "";
    form.content = article.content || "";
    form.excerpt = article.excerpt || "";
    form.categoryId = article.categoryId || "";
    form.coverImage = article.coverImage || "";
    form.status = article.status || "published";
    editorContent.value = convertHtmlToMarkdown(article.content || "");
  } else {
    form.title = "";
    form.content = "";
    form.excerpt = "";
    form.categoryId = "";
    form.coverImage = "";
    form.status = "published";
    editorContent.value = "";
  }
  viewMode.value = "editor";
};

// 返回列表
const goBack = () => {
  viewMode.value = "list";
  editingArticle.value = null;
};

const pendingAction = ref<"publish" | null>(null);

watch(showPublishSettingsModal, (newVal) => {
  if (!newVal && pendingAction.value) {
    doPublish();
  }
});

const doPublish = async () => {
  try {
    const payload = {
      ...form,
      categoryId: form.categoryId || null,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      status: "published",
    };

    await http.post("/article", payload);
    success("文章已发布");
    goBack();
    await fetchArticles();
  } catch (err) {
    console.error("发布失败:", err);
    error("发布失败");
  } finally {
    pendingAction.value = null;
  }
};

const publishArticle = async () => {
  form.content = editorContent.value;

  if (!form.title || !form.content) {
    warning("请填写标题和内容");
    return;
  }

  if (!editingArticle.value || !editingArticle.value.id) {
    pendingAction.value = "publish";
    showPublishSettingsModal.value = true;
    return;
  }

  try {
    const payload = {
      ...form,
      categoryId: form.categoryId || null,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      status: "published",
    };

    await http.put(`/article/${editingArticle.value.id}`, payload);
    success("文章已更新");
    goBack();
    await fetchArticles();
  } catch (err) {
    console.error("发布失败:", err);
    error("发布失败");
  }
};

// 切换状态
const toggleStatus = async (article: any) => {
  try {
    const newStatus = article.status === "published" ? "hidden" : "published";
    await http.put(`/article/${article.id}`, { status: newStatus });
    success(newStatus === "published" ? "文章已发布" : "文章已设为前端不可见");
    await fetchArticles();
  } catch (err) {
    error("操作失败");
  }
};

// 删除文章
const deleteArticle = async (article: any) => {
  if (!confirm(`确定要删除文章「${article.title}」吗？`)) return;

  try {
    await http.delete(`/article/${article.id}`);
    success("文章已删除");
    await fetchArticles();
  } catch (err) {
    error("删除失败");
  }
};

// 分类管理
const openCategoryModal = () => {
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
};

const openAddCategory = () => {
  categoryForm.name = "";
  showAddCategoryModal.value = true;
};

const closeAddCategoryModal = () => {
  showAddCategoryModal.value = false;
};

const saveCategory = async () => {
  if (!categoryForm.name) {
    warning("请填写分类名称");
    return;
  }

  try {
    await http.post("/article/category", categoryForm);
    success("分类已创建");
    closeAddCategoryModal();
    await fetchCategories();
  } catch (err) {
    error("保存失败");
  }
};

const deleteCategory = async (cat: any) => {
  if (!confirm(`确定要删除分类「${cat.name}」吗？`)) return;

  try {
    await http.delete(`/article/category/${cat.id}`);
    success("分类已删除");
    await fetchCategories();
  } catch (err) {
    error("删除失败");
  }
};

// 分类选择器
const openCategorySelector = () => {
  showCategorySelector.value = true;
};

const closeCategorySelector = () => {
  showCategorySelector.value = false;
};

const selectCategory = (categoryId: string) => {
  form.categoryId = categoryId;
};

const confirmCategorySelection = () => {
  showCategorySelector.value = false;
};

// 辅助函数
const getStatusText = (status: string) => {
  switch (status) {
    case "published":
      return "已发布";
    case "hidden":
      return "前端不可见";
    default:
      return status;
  }
};

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const resetFilters = () => {
  searchKeyword.value = "";
  filterCategory.value = "";
  filterStatus.value = "";
  pagination.page = 1;
  fetchArticles();
};

const prevPage = () => {
  if (pagination.page > 1) {
    pagination.page--;
    fetchArticles();
  }
};

const nextPage = () => {
  if (pagination.page < Math.ceil(pagination.total / pagination.limit)) {
    pagination.page++;
    fetchArticles();
  }
};
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
