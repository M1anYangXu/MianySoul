<template>
  <div class="max-w-7xl mx-auto">
    <!-- 列表视图 -->
    <div v-if="viewMode === 'list'">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold mb-2" :class="isDark ? 'text-white' : 'text-black'">
            文章管理
          </h1>
          <p :class="isDark ? 'text-gray-300' : 'text-gray-700'">管理博客文章内容</p>
        </div>
        <div class="flex items-center space-x-4">
          <button
            class="px-4 py-2 rounded-lg border transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
            @click="openCategoryModal"
          >
            📁 分类管理
          </button>
          <button
            class="px-4 py-2 rounded-lg border transition-colors"
            :class="
              isDark
                ? 'border-gray-600 text-gray-300 hover:bg-gray-700'
                : 'border-gray-200 text-gray-700 hover:bg-gray-50'
            "
            @click="openTagModal"
          >
            🏷️ 标签管理
          </button>
          <button
            class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            @click="openEditor"
          >
            + 写文章
          </button>
        </div>
      </div>

      <!-- 搜索和筛选 -->
      <div
        class="rounded-xl border shadow-sm p-4 mb-6"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="flex flex-wrap items-center gap-4">
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="搜索文章标题或内容..."
            class="flex-1 min-w-[200px] px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />
          <select
            v-model="filterCategory"
            class="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-200 bg-white text-black'
            "
          >
            <option value="">全部分类</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
          <select
            v-model="filterStatus"
            class="px-4 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-200 bg-white text-black'
            "
          >
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="archived">已归档</option>
          </select>
          <button
            class="px-4 py-2.5 rounded-xl border transition-colors"
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
      <div
        class="rounded-xl border shadow-sm overflow-hidden"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <table class="w-full">
          <thead>
            <tr :class="isDark ? 'bg-gray-700' : 'bg-gray-50'">
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                封面
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                标题
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                分类
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                标签
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                状态
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                阅读/点赞
              </th>
              <th
                class="px-6 py-4 text-left text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                创建时间
              </th>
              <th
                class="px-6 py-4 text-center text-sm font-semibold"
                :class="isDark ? 'text-gray-300' : 'text-gray-600'"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="article in articles"
              :key="article.id"
              :class="
                isDark ? 'border-gray-700 hover:bg-gray-700/50' : 'border-gray-100 hover:bg-gray-50'
              "
              class="border-t"
            >
              <td class="px-6 py-4">
                <img
                  v-if="article.coverImage"
                  :src="getFullImageUrl(article.coverImage)"
                  :alt="article.title"
                  class="w-16 h-16 object-cover rounded-lg"
                />
                <span
                  v-else
                  class="w-16 h-16 flex items-center justify-center rounded-lg bg-gray-200 text-gray-500"
                >
                  📄
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="font-medium" :class="isDark ? 'text-white' : 'text-black'">
                  {{ article.title }}
                </span>
                <p
                  class="text-sm mt-1 line-clamp-2"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  {{ article.excerpt || stripHtml(article.content).substring(0, 50) }}...
                </p>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'"
                >
                  {{ article.category?.name || "未分类" }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex flex-wrap gap-1">
                  <span
                    v-for="tag in article.tags"
                    :key="tag.id"
                    class="px-2 py-0.5 rounded-full text-xs font-medium"
                    :class="isDark ? 'bg-gray-600 text-gray-300' : 'bg-gray-100 text-gray-600'"
                  >
                    {{ tag.name }}
                  </span>
                  <span v-if="!article.tags.length" class="text-xs text-gray-400">无标签</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <span
                  class="px-2.5 py-1 rounded-full text-xs font-medium"
                  :class="getStatusClass(article.status)"
                >
                  {{ getStatusText(article.status) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  👁️{{ article.viewCount }} / ❤️{{ article.likeCount }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
                  {{ formatDate(article.createdAt) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center justify-center space-x-2">
                  <button
                    class="px-3 py-1.5 text-sm rounded-lg hover:opacity-80 transition-opacity"
                    :class="isDark ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-800'"
                    @click="openEditor(article)"
                  >
                    编辑
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm rounded-lg hover:opacity-80 transition-opacity"
                    :class="
                      article.status === 'published'
                        ? 'bg-amber-500 text-white'
                        : 'bg-green-500 text-white'
                    "
                    @click="toggleStatus(article)"
                  >
                    {{ article.status === "published" ? "归档" : "发布" }}
                  </button>
                  <button
                    class="px-3 py-1.5 text-sm rounded-lg hover:opacity-80 transition-opacity bg-red-500 text-white"
                    @click="deleteArticle(article)"
                  >
                    删除
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="articles.length === 0">
              <td
                colspan="8"
                class="px-6 py-12 text-center"
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
          class="px-6 py-4 border-t flex items-center justify-between"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            共 {{ pagination.total }} 篇文章
          </span>
          <div class="flex items-center space-x-2">
            <button
              :disabled="pagination.page === 1"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'"
              @click="prevPage"
            >
              上一页
            </button>
            <span class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-600'">
              {{ pagination.page }} / {{ Math.ceil(pagination.total / pagination.limit) }}
            </span>
            <button
              :disabled="pagination.page >= Math.ceil(pagination.total / pagination.limit)"
              class="px-3 py-1.5 rounded-lg text-sm transition-colors disabled:opacity-50"
              :class="isDark ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-700'"
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
            class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
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
        <div
          class="flex flex-wrap gap-4 mb-6 pb-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <select
            v-model="form.categoryId"
            class="px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white'
                : 'border-gray-200 bg-white text-black'
            "
          >
            <option value="">选择分类</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>

          <input
            v-model="form.coverImage"
            type="url"
            placeholder="封面图片 URL..."
            class="flex-1 min-w-[200px] px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
            :class="
              isDark
                ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-500'
                : 'border-gray-200 bg-white text-black placeholder-gray-400'
            "
          />

          <!-- 标签选择 -->
          <div class="flex items-center space-x-2">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">标签:</span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="tag in selectedTags"
                :key="tag.id"
                class="px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1"
                :style="{ backgroundColor: tag.color + '20', color: tag.color }"
              >
                <span>{{ tag.name }}</span>
                <button @click="removeTag(tag)">×</button>
              </span>
              <button
                class="px-2 py-1 rounded-full text-xs border"
                :class="isDark ? 'border-gray-600 text-gray-400' : 'border-gray-300 text-gray-600'"
                @click="openTagSelector"
              >
                + 添加标签
              </button>
            </div>
          </div>
        </div>

        <!-- 编辑器 -->
        <div class="mb-6">
          <label
            class="block text-sm font-medium mb-2"
            :class="isDark ? 'text-gray-300' : 'text-gray-700'"
          >
            文章内容
          </label>
          <div
            class="w-full min-h-[500px] rounded-xl border overflow-hidden"
            :class="isDark ? 'border-gray-600 bg-gray-900' : 'border-gray-200 bg-white'"
          >
            <YuqueRichText
              ref="editorRef"
              :value="form.content"
              @on-change="(val: string) => (form.content = val)"
            />
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
            class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400 resize-none"
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
              class="ml-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium"
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
              class="ml-4 px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-medium"
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
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
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
            class="px-6 py-2.5 border rounded-xl font-medium transition-colors"
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
            class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
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
              class="w-full px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-400"
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
            class="px-6 py-2.5 border rounded-xl font-medium transition-colors"
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
            class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
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
            class="px-6 py-2.5 border rounded-xl font-medium transition-colors"
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
            class="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
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
import { useMessage } from "@/composables/useMessage";
import { http } from "@/utils/request";
import { YuqueRichText } from "yuque-rich-text";
import type { IEditorRef } from "yuque-rich-text";

const appStore = useAppStore();
const { success, error, warning } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

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

// 分类和标签
const categories = ref<any[]>([]);
const tags = ref<any[]>([]);
const selectedTags = ref<any[]>([]);

// ESC 键关闭弹窗
const handleEscKey = (event: KeyboardEvent) => {
  if (event.key === "Escape") {
    closeAllModals();
  }
};

const closeAllModals = () => {
  showCategoryModal.value = false;
  showTagModal.value = false;
  showAddCategoryModal.value = false;
  showAddTagModal.value = false;
  showTagSelector.value = false;
};

onMounted(() => {
  document.addEventListener("keydown", handleEscKey);
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleEscKey);
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
  } else {
    form.title = "";
    form.content = "";
    form.excerpt = "";
    form.categoryId = "";
    form.coverImage = "";
    form.status = "draft";
    selectedTags.value = [];
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
      return "bg-green-500 text-white";
    case "draft":
      return "bg-gray-400 text-white";
    case "archived":
      return "bg-amber-500 text-white";
    default:
      return "bg-gray-400 text-white";
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

onMounted(() => {
  fetchArticles();
  fetchCategories();
  fetchTags();
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
