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
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>封面</th>
              <th>标题</th>
              <th>分类</th>
              <th>标签</th>
              <th>状态</th>
              <th>阅读/点赞</th>
              <th>创建时间</th>
              <th class="text-center">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="article in articles" :key="article.id">
              <td>
                <img
                  v-if="article.coverImage"
                  :src="getFullImageUrl(article.coverImage)"
                  :alt="article.title"
                  class="w-28 h-16 object-cover rounded-lg"
                />
                <span
                  v-else
                  class="w-28 h-16 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500 text-xl"
                >
                  📄
                </span>
              </td>
              <td>
                <span class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ article.title }}
                </span>
                <p class="mt-1 line-clamp-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ article.excerpt || stripHtml(article.content).substring(0, 50) }}...
                </p>
              </td>
              <td>
                <span
                  class="px-3 py-1 rounded-full text-xs font-medium"
                  :class="isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'"
                >
                  {{ article.category?.name || "未分类" }}
                </span>
              </td>
              <td>
                <div class="flex flex-wrap gap-1.5">
                  <span
                    v-for="tag in article.tags"
                    :key="tag.id"
                    class="px-2.5 py-1 rounded-full text-xs font-medium"
                    :class="isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ tag.name }}
                  </span>
                  <span v-if="!article.tags.length" class="text-xs text-gray-400">无标签</span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="getStatusClass(article.status)">
                  {{ getStatusText(article.status) }}
                </span>
              </td>
              <td>
                <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  👁️{{ article.viewCount }} / ❤️{{ article.likeCount }}
                </span>
              </td>
              <td>
                <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ formatDate(article.createdAt) }}
                </span>
              </td>
              <td>
                <div class="flex items-center justify-center space-x-2">
                  <button class="btn-action btn-action-edit" @click="openEditor(article)">
                    编辑
                  </button>
                  <button class="btn-action btn-action-status" @click="toggleStatus(article)">
                    {{ article.status === "published" ? "归档" : "发布" }}
                  </button>
                  <button class="btn-action btn-action-danger" @click="deleteArticle(article)">
                    删除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="articles.length === 0">
              <td
                colspan="8"
                class="py-16 text-center"
                :class="isDark ? 'text-gray-400' : 'text-gray-500'"
              >
                暂无文章数据
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 分页 -->
        <div
          v-if="pagination.total > pagination.limit"
          class="px-5 py-4 border-t flex items-center justify-between"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
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

      <div
        class="rounded-xl border shadow-sm p-6"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <!-- 标题输入 -->
        <input
          v-model="form.title"
          type="text"
          placeholder="输入文章标题..."
          class="w-full text-2xl font-bold mb-6 px-0 py-3 bg-transparent border-none focus:outline-none focus:ring-0"
          :class="isDark ? 'text-white placeholder-gray-500' : 'text-black placeholder-gray-400'"
        />

        <!-- 元信息栏 -->
        <div class="mb-6 pb-6 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <!-- 第一行：分类 + 标签（合并）+ 封面 -->
          <div class="flex flex-wrap items-start gap-3 mb-4">
            <!-- 分类（chip 风格） -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                分类
              </span>
              <button
                type="button"
                class="px-3 py-1.5 rounded-full text-sm border transition-colors"
                :class="
                  !form.categoryId
                    ? isDark
                      ? 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
                      : 'border-cyan-400 text-cyan-600 bg-cyan-50'
                    : isDark
                      ? 'border-gray-600 text-gray-400 hover:border-gray-500'
                      : 'border-gray-300 text-gray-500 hover:border-gray-400'
                "
                @click="form.categoryId = ''"
              >
                未选择
              </button>
              <button
                v-for="cat in categories"
                :key="cat.id"
                type="button"
                class="px-3 py-1.5 rounded-full text-sm border transition-colors"
                :class="
                  form.categoryId === cat.id
                    ? isDark
                      ? 'border-cyan-500 text-cyan-300 bg-cyan-500/10'
                      : 'border-cyan-400 text-cyan-600 bg-cyan-50'
                    : isDark
                      ? 'border-gray-600 text-gray-300 hover:border-gray-500'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                "
                @click="form.categoryId = cat.id"
              >
                {{ cat.name }}
              </button>
            </div>
          </div>

          <div class="flex flex-wrap items-start gap-3 mb-4">
            <!-- 标签（chip 风格） -->
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-sm font-medium" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                标签
              </span>
              <span
                v-for="tag in selectedTags"
                :key="tag.id"
                class="px-3 py-1.5 rounded-full text-sm flex items-center gap-1.5"
                :style="{
                  backgroundColor: (tag.color || '#06b6d4') + '20',
                  color: tag.color || '#06b6d4',
                }"
              >
                <span>{{ tag.name }}</span>
                <button
                  type="button"
                  class="hover:opacity-70 text-base leading-none"
                  @click="removeTag(tag)"
                >
                  ×
                </button>
              </span>
              <button
                type="button"
                class="px-3 py-1.5 rounded-full text-sm border border-dashed transition-colors"
                :class="
                  isDark
                    ? 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                    : 'border-gray-300 text-gray-500 hover:border-gray-400 hover:text-gray-700'
                "
                @click="openTagSelector"
              >
                + 添加标签
              </button>
            </div>
          </div>

          <!-- 封面（紧凑布局） -->
          <div class="flex items-start gap-3">
            <span
              class="text-sm font-medium mt-2.5 shrink-0"
              :class="isDark ? 'text-gray-400' : 'text-gray-500'"
            >
              封面
            </span>
            <div class="flex-1 flex flex-wrap items-center gap-3">
              <!-- 封面预览 -->
              <div
                v-if="form.coverImage"
                class="relative w-20 h-14 rounded-lg overflow-hidden border group"
                :class="isDark ? 'border-gray-600' : 'border-gray-200'"
              >
                <img
                  :src="form.coverImage"
                  alt="封面"
                  class="w-full h-full object-cover"
                  @error="form.coverImage = ''"
                />
                <button
                  type="button"
                  class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-xs transition-opacity"
                  @click="form.coverImage = ''"
                >
                  移除
                </button>
              </div>
              <input
                v-model="form.coverImage"
                type="url"
                placeholder="封面图片 URL（可选）"
                class="flex-1 min-w-[200px] px-3 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 text-sm"
                :class="
                  isDark
                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                    : 'border-gray-200 bg-white text-black placeholder-gray-400'
                "
              />
              <button
                type="button"
                class="px-3 py-2 rounded-lg border text-sm transition-colors"
                :class="
                  isDark
                    ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                    : 'border-gray-200 text-gray-700 hover:bg-gray-50'
                "
                @click="$refs.coverInput?.click()"
              >
                📁 本地上传
              </button>
              <input
                ref="coverInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleCoverUpload"
              />
            </div>
          </div>
        </div>

        <!-- 编辑器 -->
        <div class="mb-6 relative">
          <label
            class="block text-sm font-medium mb-3"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            文章内容
          </label>
          <div
            class="w-full min-h-[400px] rounded-xl border yuque-editor-container"
            :class="isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-white'"
          >
            <YuqueRichText ref="editorRef" :value="editorContent" @on-change="handleEditorChange" />
          </div>
        </div>

        <!-- 摘要 -->
        <div>
          <label
            class="block text-sm font-medium mb-2"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            文章摘要（可选）
          </label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="文章摘要，用于列表展示..."
            class="w-full px-4 py-3 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 resize-none"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          ></textarea>
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

// 封面上传
const coverInput = ref<HTMLInputElement | null>(null);

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

// 封面上传
const handleCoverUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  try {
    const formData = new FormData();
    formData.append("file", file);
    const result: any = await http.post("/upload/single", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (result?.url) {
      form.coverImage = result.url;
      success("封面上传成功");
    }
  } catch (err) {
    error("封面上传失败");
  } finally {
    target.value = "";
  }
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

    const result = await http.get("/article", { params });
    console.log("文章列表响应:", result);
    articles.value = result?.list || [];
    pagination.total = result?.total || 0;
  } catch (err) {
    console.error("获取文章列表失败:", err);
    // 不显示错误弹框，避免重复提示
  }
};

// 获取分类列表
const fetchCategories = async () => {
  try {
    const result = await http.get("/article/category");
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
    const result = await http.get("/article/tag");
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

    if (editingArticle.value && editingArticle.value.id) {
      console.log("执行更新文章，ID:", editingArticle.value.id);
      await http.put(`/article/${editingArticle.value.id}`, {
        ...form,
        status: "draft",
        tagIds,
      });
      success("草稿已保存");
      goBack();
      await fetchArticles();
    } else {
      console.log("执行创建草稿");
      await http.post("/article", {
        ...form,
        status: "draft",
        tagIds,
      });
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
    console.log("发布文章 - 表单数据:", form);
    console.log("发布文章 - tagIds:", tagIds);

    if (editingArticle.value && editingArticle.value.id) {
      console.log("执行更新文章，ID:", editingArticle.value.id);
      await http.put(`/article/${editingArticle.value.id}`, {
        ...form,
        status: "published",
        tagIds,
      });
      success("文章已更新");
    } else {
      console.log("执行创建文章");
      await http.post("/article", {
        ...form,
        status: "published",
        tagIds,
      });
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

// 辅助函数
const getStatusClass = (status: string) => {
  switch (status) {
    case "published":
      return "status-badge-published";
    case "draft":
      return "status-badge-draft";
    case "archived":
      return "status-badge-disabled";
    default:
      return "status-badge-inactive";
  }
};

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

const stripHtml = (html: string) => {
  const tmp = document.createElement("DIV");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
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
