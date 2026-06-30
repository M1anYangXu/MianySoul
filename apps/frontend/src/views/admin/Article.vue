<template>
  <div class="max-w-7xl mx-auto">
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
            📝 {{ moduleName }}
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
            📁 分类管理
          </button>
          <button
            class="px-4 py-2 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            @click="openTagModal"
          >
            🏷️ 标签管理
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

    <div v-if="viewMode === 'list'">
      <!-- 搜索和筛选 -->
      <div
        class="rounded-xl border shadow-sm p-4 mb-6"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="flex flex-wrap items-center gap-3">
          <!-- 搜索框 + 搜索按钮 -->
          <div class="flex flex-1 min-w-[280px] items-center gap-2">
            <div class="relative flex-1">
              <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
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
              class="w-20 h-14 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500 text-lg"
              :class="isDark ? 'bg-gray-700 text-gray-500' : 'bg-gray-100 text-gray-400'"
            >
              📄
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
                :class="article.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'"
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
                ✏️
              </button>
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                "
                :title="article.status === 'published' ? '归档' : '发布'"
                @click="toggleStatus(article)"
              >
                {{ article.status === "published" ? "📦" : "🚀" }}
              </button>
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                :class="
                  isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                "
                title="删除"
                @click="deleteArticle(article)"
              >
                🗑️
              </button>
            </div>
          </div>
        </div>

        <div v-if="articles.length === 0" class="text-center py-16">
          <div class="text-5xl mb-4">📝</div>
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

      <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <!-- 主编辑区 -->
        <div class="lg:col-span-3 space-y-6">
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
            <div
              class="w-full min-h-[500px] rounded-xl yuque-editor-container"
              :class="isDark ? 'bg-gray-900/50' : 'bg-white'"
            >
              <YuqueRichText
                ref="editorRef"
                :value="editorContent"
                @on-change="handleEditorChange"
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
              <span>📝</span>
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

        <!-- 侧边栏 -->
        <div class="space-y-6">
          <!-- 发布设置 -->
          <div
            class="rounded-2xl border p-5 sticky top-6"
            :class="isDark ? 'bg-gray-800/60 border-gray-700/50' : 'bg-white/80 border-gray-200/50'"
            style="backdrop-filter: blur(12px)"
          >
            <h3
              class="text-base font-semibold mb-4 flex items-center gap-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              <span>⚙️</span>
              发布设置
            </h3>

            <!-- 分类 -->
            <div class="mb-5">
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

            <!-- 标签 -->
            <div class="mb-5">
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                文章标签
              </label>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="tag in selectedTags"
                  :key="tag.id"
                  class="px-3 py-1.5 rounded-lg text-sm flex items-center gap-1"
                  :style="{
                    backgroundColor: (tag.color || '#8b5cf6') + '20',
                    color: tag.color || '#8b5cf6',
                  }"
                >
                  <span>{{ tag.name }}</span>
                  <button
                    type="button"
                    class="hover:opacity-70 text-sm leading-none"
                    @click="removeTag(tag)"
                  >
                    ×
                  </button>
                </span>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg text-sm border border-dashed transition-all"
                  :class="
                    isDark
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                  "
                  @click="openTagSelector"
                >
                  + 添加
                </button>
              </div>
            </div>

            <!-- 封面 -->
            <div class="mb-5">
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
                <span>📷</span>
                <span>{{ form.coverImage ? "更换封面" : "选择封面图片" }}</span>
              </button>
            </div>

            <!-- 操作按钮 -->
            <div
              class="space-y-2 pt-4 border-t"
              :class="isDark ? 'border-gray-700/50' : 'border-gray-200/50'"
            >
              <button
                class="w-full px-4 py-2.5 gradient-danger text-white rounded-xl font-medium hover:opacity-90 transition-all hover:shadow-lg"
                @click="publishArticle"
              >
                {{ editingArticle ? "更新文章" : "发布文章" }}
              </button>
              <button
                class="w-full px-4 py-2.5 border rounded-xl font-medium transition-all"
                :class="
                  isDark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700/50'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                "
                @click="saveDraft"
              >
                存为草稿
              </button>
            </div>
          </div>
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
                  class="px-3 py-1 rounded-lg text-sm bg-red-500 text-white"
                  @click="deleteCategory(cat)"
                >
                  删除
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签管理弹窗 -->
    <div
      v-if="showTagModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeTagModal"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">标签管理</h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="closeTagModal"
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
              v-model="tagSearch"
              type="text"
              placeholder="搜索标签..."
              class="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                  : 'border-gray-200 bg-white text-black placeholder-gray-400'
              "
            />
            <button
              class="ml-4 px-4 py-2 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              @click="openAddTag"
            >
              + 添加
            </button>
          </div>
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-if="filteredTags.length === 0" class="p-4 text-center text-gray-500">
              暂无标签
            </div>
            <div
              v-for="tag in filteredTags"
              :key="tag.id"
              class="flex items-center justify-between p-3 rounded-lg"
              :class="isDark ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <span class="font-medium" :class="isDark ? 'text-white' : 'text-black'">
                {{ tag.name }}
              </span>
              <div class="flex items-center space-x-2">
                <button
                  class="px-3 py-1 rounded-lg text-sm bg-red-500 text-white"
                  @click="deleteTag(tag)"
                >
                  删除
                </button>
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

    <!-- 添加标签弹窗 -->
    <div
      v-if="showAddTagModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeAddTagModal"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">添加标签</h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="closeAddTagModal"
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
              标签名称
            </label>
            <input
              v-model="tagForm.name"
              type="text"
              class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
              :class="
                isDark
                  ? 'border-gray-600 bg-gray-700 text-white'
                  : 'border-gray-200 bg-white text-black'
              "
              placeholder="输入标签名称"
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
            @click="closeAddTagModal"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            @click="saveTag"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 标签选择器弹窗 -->
    <div
      v-if="showTagSelector"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeTagSelector"
    >
      <div
        class="w-full max-w-md rounded-xl shadow-xl overflow-hidden"
        :class="isDark ? 'bg-gray-800' : 'bg-white'"
      >
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-black'">选择标签</h2>
          <button
            class="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            @click="closeTagSelector"
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
            v-model="tagSelectorSearch"
            type="text"
            placeholder="搜索标签..."
            class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 mb-4"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />
          <div class="space-y-2 max-h-64 overflow-y-auto">
            <div v-if="filteredTagsForSelector.length === 0" class="p-4 text-center text-gray-500">
              暂无标签
            </div>
            <label
              v-for="tag in filteredTagsForSelector"
              :key="tag.id"
              class="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:opacity-80"
              :class="isDark ? 'bg-gray-700' : 'bg-gray-50'"
            >
              <input
                type="checkbox"
                :checked="selectedTags.some((t) => t.id === tag.id)"
                class="w-4 h-4 rounded"
                @change="toggleTagSelection(tag)"
              />
              <span class="font-medium" :class="isDark ? 'text-white' : 'text-black'">
                {{ tag.name }}
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
            @click="closeTagSelector"
          >
            取消
          </button>
          <button
            class="px-6 py-2.5 gradient-primary text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            @click="confirmTagSelection"
          >
            确认
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
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in filteredImages"
              :key="img.id"
              class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
              :class="
                form.coverImage === img.url
                  ? 'border-pink-500 ring-2 ring-pink-500/50'
                  : isDark
                    ? 'border-gray-700'
                    : 'border-gray-200'
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
                class="absolute inset-0 bg-black/30 flex items-center justify-center"
              >
                <span class="text-white text-xl">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage, useModuleConfig } from "@/composables";
import { http } from "@/utils/request";
import { YuqueRichText } from "yuque-rich-text";
import type { IEditorRef } from "yuque-rich-text";

const appStore = useAppStore();
const { success, error, warning } = useMessage();
const { getModuleName, getModuleDescription, loadConfig } = useModuleConfig();

const isDark = computed(() => appStore.themeMode === "dark");

const moduleName = computed(() => getModuleName("article"));
const moduleDescription = computed(() => getModuleDescription("article"));

// 处理图片URL
const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL || ""}${url}`;
};

const viewMode = ref<"list" | "editor">("list");

// 语雀富文本编辑器引用
const editorRef = ref<IEditorRef | null>(null);

// 编辑器内容缓存（避免双向绑定导致光标丢失）
const editorContent = ref("");

// 处理编辑器内容变化（不直接更新form.content，避免光标跳转到开头）
const handleEditorChange = (val: string) => {
  editorContent.value = val;
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
  { value: "draft", label: "草稿" },
  { value: "published", label: "已发布" },
  { value: "archived", label: "已归档" },
];

// 分类和标签
const categories = ref<any[]>([]);
const tags = ref<any[]>([]);
const selectedTags = ref<any[]>([]);

// 图片选择器
interface Image {
  id: string;
  url: string;
  filename: string;
  group?: { id: string; name: string; icon: string };
}
interface ImageGroup {
  id: string;
  name: string;
  icon: string;
  isDefault?: boolean;
}

const showImagePicker = ref(false);
const images = ref<Image[]>([]);
const imageGroups = ref<ImageGroup[]>([]);
const selectedGroupId = ref<string | null>(null);

const filteredImages = computed(() => {
  if (!selectedGroupId.value) {
    return [];
  }
  return images.value.filter((img) => img.group?.id === selectedGroupId.value);
});

const fetchImages = async () => {
  try {
    images.value = await http.get<Image[]>("/gallery/images");
    imageGroups.value = await http.get<ImageGroup[]>("/gallery/groups");
    const defaultGroup = imageGroups.value.find((g) => g.name === "默认分组");
    selectedGroupId.value = defaultGroup?.id || null;
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

const selectImage = (img: Image) => {
  form.coverImage = img.url;
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
  showTagModal.value = false;
  showAddCategoryModal.value = false;
  showAddTagModal.value = false;
  showTagSelector.value = false;
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
  fetchTags();
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
  status: "draft",
});

const editingArticle = ref<any>(null);

// 分类管理弹窗
const showCategoryModal = ref(false);
const categorySearch = ref("");
const showAddCategoryModal = ref(false);
const categoryForm = reactive({
  name: "",
});

// 标签管理弹窗
const showTagModal = ref(false);
const tagSearch = ref("");
const showAddTagModal = ref(false);
const tagForm = reactive({
  name: "",
});

// 标签选择器
const showTagSelector = ref(false);
const tagSelectorSearch = ref("");

// 分类选择器
const showCategorySelector = ref(false);
const categorySelectorSearch = ref("");

// 筛选后的分类和标签
const filteredCategories = computed(() => {
  if (!categorySearch.value) return categories.value;
  return categories.value.filter((cat) =>
    cat.name.toLowerCase().includes(categorySearch.value.toLowerCase())
  );
});

const filteredTags = computed(() => {
  if (!tagSearch.value) return tags.value;
  return tags.value.filter((tag) => tag.name.toLowerCase().includes(tagSearch.value.toLowerCase()));
});

const filteredTagsForSelector = computed(() => {
  if (!tagSelectorSearch.value) return tags.value;
  return tags.value.filter((tag) =>
    tag.name.toLowerCase().includes(tagSelectorSearch.value.toLowerCase())
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

// 获取标签列表
const fetchTags = async () => {
  try {
    const result = await http.get<any[]>("/article/tag");
    console.log("标签列表响应:", result);
    tags.value = result || [];
  } catch (err) {
    console.error("获取标签列表失败:", err);
    // 不显示错误弹框
  }
};

// 打开编辑器
const openEditor = async (article?: any) => {
  console.log("openEditor 被调用，文章:", article);
  editingArticle.value = article;
  if (article) {
    form.title = article.title || "";
    form.content = article.content || "";
    form.excerpt = article.excerpt || "";
    form.categoryId = article.categoryId || "";
    form.coverImage = article.coverImage || "";
    form.status = article.status || "draft";
    selectedTags.value = article.tags || [];
    editorContent.value = article.content || "";
  } else {
    form.title = "";
    form.content = "";
    form.excerpt = "";
    form.categoryId = "";
    form.coverImage = "";
    form.status = "draft";
    selectedTags.value = [];
    editorContent.value = "";
  }
  viewMode.value = "editor";
  // 等待编辑器渲染完成后设置内容
  await nextTick();
  if (editorRef.value) {
    if (article?.content) {
      editorRef.value.setContent(article.content);
    } else {
      editorRef.value.setContent("");
    }
  }
};

// 返回列表
const goBack = () => {
  viewMode.value = "list";
  editingArticle.value = null;
};

// 保存草稿
const saveDraft = async () => {
  // 获取编辑器最新内容
  if (editorRef.value) {
    form.content = editorRef.value.getContent("text/html") || "";
  }

  if (!form.title || !form.content) {
    warning("请填写标题和内容");
    return;
  }

  try {
    const tagIds = selectedTags.value.map((t) => t.id);
    console.log("保存草稿 - editingArticle:", editingArticle.value);
    console.log("保存草稿 - 表单数据:", form);
    console.log("保存草稿 - selectedTags:", selectedTags.value);
    console.log("保存草稿 - tagIds:", tagIds);

    // 将空字符串转换为 null
    const payload = {
      ...form,
      categoryId: form.categoryId || null,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      status: "draft",
      tagIds,
    };

    console.log("保存草稿 - 发送的payload:", payload);

    if (editingArticle.value && editingArticle.value.id) {
      console.log("执行更新文章，ID:", editingArticle.value.id);
      await http.put(`/article/${editingArticle.value.id}`, payload);
      success("草稿已保存");
      goBack();
      await fetchArticles();
    } else {
      console.log("执行创建草稿");
      await http.post("/article", payload);
      success("草稿已保存");
      goBack();
      await fetchArticles();
    }
  } catch (err) {
    console.error("保存失败:", err);
    error("保存失败");
  }
};

// 发布文章
const publishArticle = async () => {
  // 获取编辑器最新内容
  if (editorRef.value) {
    form.content = editorRef.value.getContent("text/html") || "";
  }

  if (!form.title || !form.content) {
    warning("请填写标题和内容");
    return;
  }

  try {
    const tagIds = selectedTags.value.map((t) => t.id);
    console.log("发布文章 - editingArticle:", editingArticle.value);
    console.log("发布文章 - editingArticle.id:", editingArticle.value?.id);
    console.log("发布文章 - 表单数据:", form);
    console.log("发布文章 - selectedTags:", selectedTags.value);
    console.log("发布文章 - tagIds:", tagIds);

    // 将空字符串转换为 null
    const payload = {
      ...form,
      categoryId: form.categoryId || null,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      status: "published",
      tagIds,
    };

    console.log("发布文章 - 发送的payload:", payload);

    if (editingArticle.value && editingArticle.value.id) {
      const articleId = editingArticle.value.id;
      console.log("执行更新文章，ID:", articleId);
      console.log("请求 URL:", `/article/${articleId}`);
      await http.put(`/article/${articleId}`, payload);
      success("文章已更新");
    } else {
      console.log("执行创建文章");
      await http.post("/article", payload);
      success("文章已发布");
    }
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
    const newStatus = article.status === "published" ? "archived" : "published";
    await http.put(`/article/${article.id}`, { status: newStatus });
    success(newStatus === "published" ? "文章已发布" : "文章已归档");
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

// 标签管理
const openTagModal = () => {
  showTagModal.value = true;
};

const closeTagModal = () => {
  showTagModal.value = false;
};

const openAddTag = () => {
  tagForm.name = "";
  showAddTagModal.value = true;
};

const closeAddTagModal = () => {
  showAddTagModal.value = false;
};

const saveTag = async () => {
  if (!tagForm.name) {
    warning("请填写标签名称");
    return;
  }

  try {
    await http.post("/article/tag", tagForm);
    success("标签已创建");
    closeAddTagModal();
    await fetchTags();
  } catch (err: any) {
    if (err.response?.data?.message?.includes("已存在")) {
      warning("标签名称已存在");
    } else {
      error("保存失败");
    }
  }
};

const deleteTag = async (tag: any) => {
  if (!confirm(`确定要删除标签「${tag.name}」吗？`)) return;

  try {
    await http.delete(`/article/tag/${tag.id}`);
    success("标签已删除");
    await fetchTags();
  } catch (err) {
    error("删除失败");
  }
};

// 标签选择器
const openTagSelector = () => {
  showTagSelector.value = true;
};

const closeTagSelector = () => {
  showTagSelector.value = false;
};

const toggleTagSelection = (tag: any) => {
  const index = selectedTags.value.findIndex((t) => t.id === tag.id);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
  } else {
    selectedTags.value.push(tag);
  }
};

const confirmTagSelection = () => {
  showTagSelector.value = false;
};

const removeTag = (tag: any) => {
  const index = selectedTags.value.findIndex((t) => t.id === tag.id);
  if (index > -1) {
    selectedTags.value.splice(index, 1);
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
    case "draft":
      return "草稿";
    case "archived":
      return "已归档";
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
