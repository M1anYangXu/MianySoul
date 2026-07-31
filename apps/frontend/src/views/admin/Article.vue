<template>
  <div class="w-full admin-root" :data-admin-module="'article'">
    <div v-if="viewMode === 'list'">
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-3">
          <button class="btn-admin-md btn-admin-ghost" @click="openCategoryModal">
            <IconPark type="FolderClose" :size="16" class="inline mr-1" />
            分类管理
          </button>
          <button class="btn-admin-md btn-admin-ghost" @click="toggleBatchMode">
            <IconPark type="List" :size="16" class="inline mr-1" />
            批量操作
          </button>
        </div>
        <button class="btn-admin-lg btn-admin-primary" @click="openEditor">+ 新建文章</button>
      </div>
      <!-- 搜索和筛选 -->
      <div
        class="rounded-xl border shadow-sm p-4 mb-6"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <div class="grid grid-cols-1 sm:flex sm:flex-wrap sm:items-center gap-3">
          <!-- 搜索框 + 搜索按钮 -->
          <div class="flex flex-1 min-w-0 sm:min-w-[280px] items-center gap-2">
            <div class="relative flex-1">
              <IconPark
                type="Search"
                :size="20"
                class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                v-model="searchKeyword"
                type="text"
                placeholder="搜索文章标题或内容..."
                class="admin-input w-full pl-9 pr-4 py-2.5 rounded-lg"
                @keyup.enter="handleSearch"
              />
            </div>
            <button class="btn-admin-md btn-admin-primary" @click="handleSearch">搜索</button>
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
              ? 'bg-gray-800/60 border-gray-700/50 hover:border-blue-500/30'
              : 'bg-white border-gray-200/50 hover:border-blue-200'
          "
        >
          <div
            v-if="batchMode"
            class="flex-shrink-0 cursor-pointer"
            @click.stop="toggleArticleSelection(article.id)"
          >
            <div
              class="w-5 h-5 rounded border-2 flex items-center justify-center transition-all"
              :class="
                selectedArticles.has(article.id)
                  ? 'bg-blue-500 border-blue-500'
                  : isDark
                    ? 'border-gray-500'
                    : 'border-gray-300'
              "
            >
              <IconPark
                v-if="selectedArticles.has(article.id)"
                type="CheckOne"
                :size="12"
                class="text-white"
              />
            </div>
          </div>
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
              <IconPark
                type="FileText"
                :size="32"
                :class="isDark ? 'text-gray-500' : 'text-gray-400'"
              />
            </span>
          </div>

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <h3
                class="font-medium truncate cursor-pointer transition-colors"
                :class="
                  isDark
                    ? 'text-white group-hover:text-blue-300'
                    : 'text-gray-900 group-hover:text-blue-600'
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
            </div>
          </div>

          <div class="flex-shrink-0 flex items-center gap-4">
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ getStatusText(article.status) }}
            </span>
            <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              {{ formatDate(article.createdAt) }}
            </span>
            <div v-if="!batchMode" class="flex items-center gap-2">
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                "
                title="编辑"
                @click="openEditor(article)"
              >
                <IconPark type="Editor" :size="16" />
              </button>
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                :class="
                  isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                "
                :title="article.status === 'published' ? '设为前端不可见' : '发布'"
                @click="toggleStatus(article)"
              >
                <IconPark
                  :type="article.status === 'published' ? 'PreviewClose' : 'Rocket'"
                  :size="16"
                />
              </button>
              <button
                class="p-2 rounded-lg transition-all duration-200 hover:bg-red-50 dark:hover:bg-red-900/20"
                :class="
                  isDark ? 'text-gray-400 hover:text-red-400' : 'text-gray-500 hover:text-red-500'
                "
                title="删除"
                @click="deleteArticle(article)"
              >
                <IconPark type="Delete" :size="16" />
              </button>
            </div>
          </div>
        </div>

        <div v-if="articles.length === 0" class="text-center py-16">
          <IconPark
            type="FileText"
            :size="64"
            class="mx-auto mb-4"
            :class="isDark ? 'text-gray-500' : 'text-gray-400'"
          />
          <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">暂无文章数据</p>
        </div>
      </div>

      <!-- 分页 -->
      <div v-if="articles.length > 0" class="mt-6 flex items-center justify-between">
        <span :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          共 {{ pagination.total }} 篇文章
        </span>
        <div v-if="pagination.total > pagination.limit" class="flex items-center space-x-2">
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

      <!-- 批量操作栏 -->
      <div
        v-if="batchMode"
        class="sticky bottom-0 left-0 right-0 z-20 flex items-center justify-between px-6 py-3 rounded-xl border shadow-lg"
        :class="isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'"
      >
        <span class="text-sm font-medium" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
          已选 {{ selectedArticles.size }} 项
        </span>
        <div class="flex items-center gap-2">
          <button class="btn-admin-sm btn-admin-primary" @click="batchToggleStatus">
            <IconPark type="Rocket" :size="14" class="inline mr-1" />
            切换状态
          </button>
          <button class="btn-admin-sm btn-admin-danger" @click="batchDelete">
            <IconPark type="Delete" :size="14" class="inline mr-1" />
            批量删除
          </button>
          <button class="btn-admin-sm btn-admin-ghost" @click="toggleBatchMode">退出</button>
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
            <IconPark type="Setting" :size="16" />
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
            class="px-6 py-2.5 bg-red-500 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            @click="publishArticle"
          >
            {{ editingArticle ? "更新文章" : "发布文章" }}
          </button>
        </div>
      </div>

      <div class="space-y-6">
        <!-- 标题输入 -->
        <div class="admin-card">
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
        <div class="admin-card">
          <div class="flex items-center justify-between mb-4">
            <h3
              class="text-lg font-semibold flex items-center gap-2"
              :class="isDark ? 'text-white' : 'text-gray-900'"
            >
              <IconPark type="Editor" :size="16" />
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
              <IconPark type="Pic" :size="16" />
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
        <div class="admin-card">
          <h3
            class="text-lg font-semibold mb-4 flex items-center gap-2"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <IconPark type="FileText" :size="16" />
            文章摘要
          </h3>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="简短描述文章内容，用于列表页展示..."
            class="admin-input w-full px-4 py-3 rounded-xl resize-none"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- 发布设置弹窗 -->
    <div
      v-if="showPublishSettingsModal"
      class="admin-modal-backdrop"
      @click.self="closePublishSettingsModal"
    >
      <div class="admin-modal admin-modal-md">
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="admin-modal-title">发布设置</h2>
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
              <span class="px-3 py-1.5 rounded-lg text-sm font-medium bg-blue-500/20 text-blue-400">
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
              <IconPark type="Pic" :size="16" />
              <span>{{ form.coverImage ? "更换封面" : "选择封面图片" }}</span>
            </button>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="handleCancelPublishSettings">
            取消
          </button>
          <button class="btn-admin-sm btn-admin-primary" @click="closePublishSettingsModal">
            确定
          </button>
        </div>
      </div>
    </div>

    <!-- 分类管理弹窗 -->
    <div v-if="showCategoryModal" class="admin-modal-backdrop" @click.self="closeCategoryModal">
      <div class="admin-modal admin-modal-md">
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="admin-modal-title">分类管理</h2>
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
          <div class="flex items-center gap-2 mb-4">
            <input
              v-model="categorySearch"
              type="text"
              placeholder="搜索分类..."
              class="admin-input flex-1 px-4 py-2 rounded-lg"
            />
          </div>
          <button class="btn-admin-md btn-admin-primary w-full mb-4" @click="openAddCategoryModal">
            + 新建分类
          </button>
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
                  class="btn-admin-sm btn-admin-danger"
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
      class="admin-modal-backdrop"
      @click.self="closeAddCategoryModal"
    >
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
              placeholder="输入分类名称 *"
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
          <button class="btn-admin-sm btn-admin-ghost" @click="closeAddCategoryModal">取消</button>
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

    <!-- 分类选择弹窗 -->
    <div
      v-if="showCategorySelector"
      class="admin-modal-backdrop"
      @click.self="closeCategorySelector"
    >
      <div class="admin-modal admin-modal-md">
        <div
          class="flex items-center justify-between p-6 border-b"
          :class="isDark ? 'border-gray-700' : 'border-gray-200'"
        >
          <h2 class="admin-modal-title">选择分类</h2>
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
            class="admin-input w-full px-4 py-2 rounded-lg mb-4"
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
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="closeCategorySelector">取消</button>
          <button class="btn-admin-sm btn-admin-primary" @click="confirmCategorySelection">
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 图片选择弹窗 -->
    <div
      v-if="showImagePicker"
      class="admin-modal-backdrop"
      style="z-index: 10000"
      @click.self="handleCloseImagePicker"
    >
      <div class="admin-modal admin-modal-lg">
        <div class="p-4 border-b" :class="isDark ? 'border-gray-700' : 'border-gray-200'">
          <div class="flex items-center justify-between">
            <h3 class="admin-modal-title">选择图片</h3>
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
              <AppIcon :icon="group.icon || 'mdi:folder'" :size="12" class="inline mr-1" />
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
import AppIcon from "@/components/AppIcon.vue";
import { IconPark } from "@icon-park/vue-next/es/all";
import { useIcon } from "@/composables/useIcon";

const appStore = useAppStore();
const { success, error, warning } = useMessage();
const { loadConfig } = useModuleConfig();
const { formatIconName } = useIcon();

const isDark = computed(() => appStore.themeMode === "dark");

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
  newCategoryName.value = "";
  newCategoryIcon.value = "mdi:folder";
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

// 分类管理
const showCategoryModal = ref(false);
const categorySearch = ref("");
const showAddCategoryModal = ref(false);
const newCategoryName = ref("");
const newCategoryIcon = ref("mdi:folder");

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

const saveDraft = async () => {
  form.content = editorContent.value;
  if (!form.title) {
    warning("请填写标题");
    return;
  }
  try {
    const payload = {
      ...form,
      categoryId: form.categoryId || null,
      excerpt: form.excerpt || null,
      coverImage: form.coverImage || null,
      status: "draft",
    };
    await http.post("/article", payload);
    success("草稿已保存");
    goBack();
    await fetchArticles();
  } catch (err) {
    console.error("保存失败:", err);
    error("保存失败");
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

// Batch mode
const batchMode = ref(false);
const selectedArticles = ref<Set<string>>(new Set());

const toggleBatchMode = () => {
  batchMode.value = !batchMode.value;
  if (!batchMode.value) {
    selectedArticles.value.clear();
  }
};

const toggleArticleSelection = (id: string) => {
  if (selectedArticles.value.has(id)) {
    selectedArticles.value.delete(id);
  } else {
    selectedArticles.value.add(id);
  }
};

const batchDelete = async () => {
  if (selectedArticles.value.size === 0) return;
  if (!confirm(`确定删除选中的 ${selectedArticles.value.size} 篇文章吗？`)) return;
  try {
    const ids = Array.from(selectedArticles.value);
    await Promise.all(ids.map((id) => http.delete(`/article/${id}`)));
    success(`成功删除 ${ids.length} 篇文章`);
    selectedArticles.value.clear();
    batchMode.value = false;
    await fetchArticles();
  } catch (e: any) {
    error(e.message || "批量删除失败");
  }
};

const batchToggleStatus = async () => {
  if (selectedArticles.value.size === 0) return;
  try {
    const ids = Array.from(selectedArticles.value);
    const articlesToPublish = articles.value.filter(
      (a) => ids.includes(a.id) && a.status !== "published"
    );
    const articlesToHide = articles.value.filter(
      (a) => ids.includes(a.id) && a.status === "published"
    );

    await Promise.all([
      ...articlesToPublish.map((a) => http.put(`/article/${a.id}`, { status: "published" })),
      ...articlesToHide.map((a) => http.put(`/article/${a.id}`, { status: "hidden" })),
    ]);
    success(`已批量更新 ${ids.length} 篇文章状态`);
    selectedArticles.value.clear();
    batchMode.value = false;
    await fetchArticles();
  } catch (e: any) {
    error(e.message || "批量操作失败");
  }
};

// 分类管理
const openCategoryModal = () => {
  showCategoryModal.value = true;
};

const closeCategoryModal = () => {
  showCategoryModal.value = false;
  showAddCategoryModal.value = false;
  newCategoryName.value = "";
  newCategoryIcon.value = "mdi:folder";
};

const openAddCategoryModal = () => {
  newCategoryName.value = "";
  newCategoryIcon.value = "mdi:folder";
  showAddCategoryModal.value = true;
};

const closeAddCategoryModal = () => {
  showAddCategoryModal.value = false;
  newCategoryName.value = "";
  newCategoryIcon.value = "mdi:folder";
};

const addCategory = async () => {
  const name = newCategoryName.value.trim();
  if (!name) {
    warning("请填写分类名称");
    return;
  }

  try {
    await http.post("/article/category", {
      name,
      icon: formatIconName(newCategoryIcon.value || "mdi:folder"),
    });
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
