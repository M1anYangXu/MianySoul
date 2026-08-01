<template>
  <div class="site-info-page w-full overflow-x-hidden admin-root" :data-admin-module="'siteinfo'">
    <div class="admin-page-header">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
            <IconPark type="Globe" :size="28" class="inline mr-2" />
            网站信息
          </h1>
          <p class="text-sm mt-1" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
            配置网站的基本信息和外观设置
          </p>
        </div>
      </div>
    </div>

    <div class="flex flex-wrap gap-2 mb-6">
      <button
        class="admin-tab"
        :class="activeTab === 'info' ? 'admin-tab-active' : ''"
        @click="activeTab = 'info'"
      >
        <span class="flex items-center gap-2">
          <IconPark type="Globe" :size="16" />
          网站信息
        </span>
      </button>
      <button
        class="admin-tab"
        :class="activeTab === 'theme' ? 'admin-tab-active' : ''"
        @click="activeTab = 'theme'"
      >
        <span class="flex items-center gap-2">
          <IconPark type="Theme" :size="16" />
          主题样式
        </span>
      </button>
      <button
        class="admin-tab"
        :class="activeTab === 'scenes' ? 'admin-tab-active' : ''"
        @click="activeTab = 'scenes'"
      >
        <span class="flex items-center gap-2">
          <IconPark type="Headset" :size="16" />
          背景音乐
        </span>
      </button>
      <button
        class="admin-tab"
        :class="activeTab === 'api' ? 'admin-tab-active' : ''"
        @click="activeTab = 'api'"
      >
        <span class="flex items-center gap-2">
          <IconPark type="Connection" :size="16" />
          API接口
        </span>
      </button>
      <button
        class="admin-tab"
        :class="activeTab === 'backup' ? 'admin-tab-active' : ''"
        @click="activeTab = 'backup'"
      >
        <span class="flex items-center gap-2">
          <IconPark type="DatabaseConfig" :size="16" />
          数据备份
        </span>
      </button>
    </div>

    <div v-if="activeTab === 'info'" class="space-y-6">
      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="Theme" :size="16" />
          </span>
          <span>网站 Logo</span>
        </h2>
        <div class="flex items-center space-x-6">
          <div class="relative">
            <div
              class="w-20 h-20 rounded-xl overflow-hidden border-2 shadow-lg bg-blue-500"
              :class="isDark ? 'border-gray-600/50' : 'border-white/50'"
            >
              <img
                v-if="form.logo"
                :src="form.logo"
                alt="网站 Logo"
                class="w-full h-full object-contain"
              />
              <div v-else class="w-full h-full flex items-center justify-center">
                <span class="text-white text-2xl font-bold">M</span>
              </div>
            </div>
            <label
              class="absolute -bottom-2 -right-2 w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center cursor-pointer hover:opacity-90 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              <input type="file" accept="image/*" class="hidden" @change="handleLogoUpload" />
              <IconPark type="Camera" :size="20" class="text-white" />
            </label>
          </div>
          <div>
            <p class="text-sm mb-2" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
              支持 JPG、PNG、SVG 格式
            </p>
            <button v-if="form.logo" class="btn-admin-sm btn-admin-danger" @click="removeLogo">
              移除 Logo
            </button>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="TextStyle" :size="16" />
          </span>
          <span>网站信息</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              网站标题
            </label>
            <input v-model="form.title" type="text" class="w-full admin-input py-3" />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              副标题
            </label>
            <input v-model="form.subtitle" type="text" class="w-full admin-input py-3" />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              网站描述
            </label>
            <textarea
              v-model="form.description"
              rows="3"
              class="w-full admin-input py-3 resize-none"
            ></textarea>
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              站点开始时间
            </label>
            <input v-model="form.startTime" type="date" class="w-full admin-input py-3" />
          </div>
        </div>
      </div>

      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="Sport" :size="16" />
          </span>
          <span>页脚信息</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              版权信息
            </label>
            <input v-model="form.copyright" type="text" class="w-full admin-input py-3" />
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              备案信息
            </label>
            <input v-model="form.icp" type="text" class="w-full admin-input py-3" />
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'theme'" class="space-y-6">
      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="Pic" :size="16" />
          </span>
          <span>首页壁纸</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              <IconPark type="Sun" :size="16" class="inline mr-1" />
              亮主题壁纸
            </label>
            <div
              v-if="form.homeWallpaperLight"
              class="relative w-full aspect-video rounded-xl overflow-hidden border group mb-2"
              :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            >
              <img
                :src="getFullImageUrl(form.homeWallpaperLight)"
                alt="亮主题壁纸"
                class="w-full h-full object-cover"
                @error="form.homeWallpaperLight = ''"
              />
              <button
                type="button"
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                @click="form.homeWallpaperLight = ''"
              >
                移除图片
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
              @click="openImagePicker('light')"
            >
              <IconPark type="Pic" :size="16" />
              <span>{{ form.homeWallpaperLight ? "更换图片" : "从图集选择图片" }}</span>
            </button>
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              <IconPark type="Moon" :size="16" class="inline mr-1" />
              暗主题壁纸
            </label>
            <div
              v-if="form.homeWallpaperDark"
              class="relative w-full aspect-video rounded-xl overflow-hidden border group mb-2"
              :class="isDark ? 'border-gray-600' : 'border-gray-200'"
            >
              <img
                :src="getFullImageUrl(form.homeWallpaperDark)"
                alt="暗主题壁纸"
                class="w-full h-full object-cover"
                @error="form.homeWallpaperDark = ''"
              />
              <button
                type="button"
                class="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-sm transition-opacity"
                @click="form.homeWallpaperDark = ''"
              >
                移除图片
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
              @click="openImagePicker('dark')"
            >
              <IconPark type="Pic" :size="16" />
              <span>{{ form.homeWallpaperDark ? "更换图片" : "从图集选择图片" }}</span>
            </button>
          </div>
        </div>
      </div>

      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="Sun" :size="16" />
          </span>
          <span>主题颜色</span>
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              亮色主题颜色
            </label>
            <div class="flex items-center space-x-4">
              <input
                v-model="form.lightThemeColor"
                type="text"
                class="flex-1 admin-input py-3"
                placeholder="#8b5cf6"
              />
              <div
                class="w-12 h-12 rounded-lg shadow-lg"
                :style="{ backgroundColor: form.lightThemeColor }"
              ></div>
            </div>
          </div>
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              暗色主题颜色
            </label>
            <div class="flex items-center space-x-4">
              <input
                v-model="form.darkThemeColor"
                type="text"
                class="flex-1 admin-input py-3"
                placeholder="#d946ef"
              />
              <div
                class="w-12 h-12 rounded-lg shadow-lg"
                :style="{ backgroundColor: form.darkThemeColor }"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'scenes'" class="space-y-6">
      <div class="admin-card">
        <div class="flex items-center justify-between mb-4">
          <h2
            class="text-lg font-semibold flex items-center space-x-2"
            :class="isDark ? 'text-white' : 'text-gray-900'"
          >
            <span
              class="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-sm"
            >
              <IconPark type="Headset" :size="16" />
            </span>
            <span>背景音乐</span>
          </h2>
          <button class="btn-admin-md btn-admin-primary" @click="openAddSceneModal">
            + 添加音乐
          </button>
        </div>

        <div
          class="rounded-xl border p-4 mb-4"
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
                placeholder="搜索音乐名称..."
                class="w-full pl-11 pr-4 py-2.5 admin-input text-base"
              />
            </div>
            <button class="btn-admin-md btn-admin-ghost" @click="searchKeyword = ''">重置</button>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="scene in filteredScenes"
            :key="scene.sceneId"
            class="flex items-center gap-4 p-4 rounded-xl border transition-all duration-300 hover:shadow-md group"
            :class="
              isDark
                ? 'bg-gray-800/60 border-gray-700/50 hover:border-cyan-500/30'
                : 'bg-white border-gray-200/50 hover:border-cyan-200'
            "
          >
            <div class="flex-shrink-0">
              <DynamicIcon :name="scene.icon" class="w-10 h-10" :style="{ color: scene.color }" />
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
                  @click="openEditSceneModal(scene)"
                >
                  {{ scene.name }}
                </h3>
                <span
                  class="w-2 h-2 rounded-full flex-shrink-0"
                  :class="scene.isActive ? 'bg-green-500' : 'bg-yellow-500'"
                ></span>
              </div>
              <div class="flex items-center gap-3 text-sm">
                <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  ID: {{ scene.sceneId }}
                </span>
                <span
                  v-if="scene.description"
                  class="truncate"
                  :class="isDark ? 'text-gray-400' : 'text-gray-500'"
                >
                  {{ scene.description }}
                </span>
              </div>
            </div>

            <div class="flex-shrink-0 flex items-center gap-4">
              <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                {{ scene.isActive ? "启用" : "禁用" }}
              </span>
              <div class="flex items-center gap-2">
                <button
                  class="btn-admin-sm btn-admin-ghost"
                  title="编辑"
                  @click="openEditSceneModal(scene)"
                >
                  <IconPark type="Editor" :size="16" />
                </button>
                <button
                  class="btn-admin-sm btn-admin-ghost"
                  :title="scene.isActive ? '禁用' : '启用'"
                  @click="toggleSceneStatus(scene)"
                >
                  <IconPark :type="scene.isActive ? 'Pause' : 'PlayOne'" :size="16" />
                </button>
                <button
                  class="btn-admin-sm btn-admin-danger"
                  title="删除"
                  @click="deleteScene(scene)"
                >
                  <IconPark type="Delete" :size="16" />
                </button>
              </div>
            </div>
          </div>

          <div v-if="scenes.length === 0" class="text-center py-8">
            <DynamicIcon
              name="Mountain"
              class="w-12 h-12 mx-auto mb-3"
              :class="isDark ? 'text-gray-500' : 'text-gray-400'"
            />
            <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-sm">暂无音乐数据</p>
          </div>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'api'" class="space-y-6">
      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-cyan-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="Local" :size="16" />
          </span>
          <span>高德地图</span>
        </h2>
        <div class="space-y-4">
          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              API Key
            </label>
            <input
              v-model="form.amapKey"
              type="text"
              name="amap-key-input"
              autocomplete="new-password"
              autocorrect="off"
              autocapitalize="off"
              spellcheck="false"
              inputmode="text"
              class="w-full admin-input py-3 font-mono text-sm"
              placeholder="请输入高德地图API Key"
            />
          </div>
          <p class="text-xs" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            用于获取天气信息和地理位置服务。请在高德开放平台申请 Web 服务类型的 Key。
          </p>
        </div>
      </div>
    </div>

    <div v-if="activeTab === 'backup'" class="space-y-6">
      <!-- 完整备份（ZIP）-->
      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="DownloadOne" :size="16" />
          </span>
          <span>完整备份（推荐）</span>
        </h2>
        <p class="text-sm mb-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          导出 ZIP
          压缩包，包含数据库文件（dev.db）和所有上传的图片、视频、音频文件。可用于跨机器完整迁移项目。
        </p>
        <button
          :disabled="exporting"
          class="btn-admin-lg btn-admin-primary flex items-center gap-2"
          @click="handleFullExport"
        >
          <IconPark type="DownloadOne" :size="16" />
          {{ exporting ? "导出中（正在打包文件）..." : "一键导出完整备份（ZIP）" }}
        </button>
      </div>

      <!-- 完整导入（ZIP）-->
      <div class="admin-card">
        <h2
          class="text-lg font-semibold mb-4 flex items-center space-x-2"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="UploadOne" :size="16" />
          </span>
          <span>完整导入（ZIP）</span>
        </h2>
        <div
          class="rounded-xl border-2 border-dashed p-6 text-center transition-all duration-300"
          :class="
            isDark
              ? 'border-gray-600 hover:border-gray-500 hover:bg-gray-700/30'
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          "
        >
          <IconPark
            type="UploadOne"
            :size="48"
            class="mx-auto mb-3"
            :class="isDark ? 'text-gray-400' : 'text-gray-500'"
          />
          <p class="text-sm mb-2" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            选择 ZIP 备份文件进行完整导入
          </p>
          <p class="text-xs mb-4" :class="isDark ? 'text-gray-500' : 'text-gray-400'">
            导入将覆盖当前数据库和所有上传文件，请谨慎操作！
          </p>
          <input
            ref="zipInputRef"
            type="file"
            accept=".zip,application/zip"
            class="hidden"
            @change="handleZipSelect"
          />
          <div class="flex items-center justify-center gap-3">
            <button
              :disabled="importing"
              class="btn-admin-md btn-admin-primary flex items-center gap-2"
              @click="triggerZipSelect"
            >
              <IconPark type="UploadOne" :size="16" />
              选择 ZIP 文件
            </button>
            <button
              v-if="selectedZipFile"
              :disabled="importing"
              class="btn-admin-md btn-admin-danger flex items-center gap-2"
              @click="confirmFullImport"
            >
              <IconPark type="Caution" :size="16" />
              {{ importing ? "导入中（正在解压文件）..." : "确认导入" }}
            </button>
          </div>
          <p
            v-if="selectedZipFile"
            class="text-sm mt-3"
            :class="isDark ? 'text-cyan-400' : 'text-cyan-600'"
          >
            已选择: {{ selectedZipFile.name }} ({{
              (selectedZipFile.size / 1024 / 1024).toFixed(2)
            }}
            MB)
          </p>
        </div>
      </div>

      <!-- 仅数据库（JSON，轻量） -->
      <details class="admin-card">
        <summary
          class="text-lg font-semibold mb-4 flex items-center space-x-2 cursor-pointer"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            class="w-8 h-8 rounded-lg bg-gray-500 flex items-center justify-center text-white text-sm"
          >
            <IconPark type="File" :size="16" />
          </span>
          <span>仅数据库备份（JSON，轻量）</span>
        </summary>
        <p class="text-sm mb-4 mt-4" :class="isDark ? 'text-gray-400' : 'text-gray-600'">
          仅导出数据库记录为 JSON 文件，不包含上传的文件。适合仅需迁移数据结构的场景。
        </p>
        <div class="flex flex-wrap gap-3">
          <button
            :disabled="exporting"
            class="btn-admin-md btn-admin-secondary flex items-center gap-2"
            @click="handleExport"
          >
            <IconPark type="DownloadOne" :size="16" />
            导出 JSON
          </button>
          <input
            ref="fileInputRef"
            type="file"
            accept=".json"
            class="hidden"
            @change="handleFileSelect"
          />
          <button
            :disabled="importing"
            class="btn-admin-md btn-admin-secondary flex items-center gap-2"
            @click="triggerFileSelect"
          >
            <IconPark type="UploadOne" :size="16" />
            导入 JSON
          </button>
          <button
            v-if="selectedBackupFile"
            :disabled="importing"
            class="btn-admin-md btn-admin-danger flex items-center gap-2"
            @click="confirmImport"
          >
            <IconPark type="Caution" :size="16" />
            {{ importing ? "导入中..." : "确认导入 JSON" }}
          </button>
          <p
            v-if="selectedBackupFile"
            class="text-sm w-full mt-2"
            :class="isDark ? 'text-cyan-400' : 'text-cyan-600'"
          >
            已选择: {{ selectedBackupFile.name }}
          </p>
        </div>
      </details>

      <div class="admin-card">
        <div class="flex items-start gap-3">
          <IconPark
            type="Caution"
            :size="20"
            class="flex-shrink-0 mt-0.5"
            :class="isDark ? 'text-red-400' : 'text-red-500'"
          />
          <div class="text-sm" :class="isDark ? 'text-gray-300' : 'text-gray-700'">
            <p class="font-medium mb-1">重要提示</p>
            <ul class="list-disc list-inside space-y-1 text-xs opacity-80">
              <li>完整备份（ZIP）包含数据库和所有上传文件，可用于跨机器完整迁移</li>
              <li>仅数据库备份（JSON）只包含数据记录，不包含上传的图片/视频/音频文件</li>
              <li>导入操作将覆盖当前数据，请谨慎操作！</li>
              <li>建议在导入前先导出一份当前数据作为备份</li>
              <li>跨机器迁移流程：git clone 代码 → 安装依赖 → 导入 ZIP 备份 → 启动服务</li>
              <li>此功能仅授权管理员使用</li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <StickyBar :has-changes="hasChanges" :saving="saving" @save="saveAll" @reset="resetForm" />

    <div
      v-if="showImagePicker"
      class="admin-modal-backdrop"
      style="z-index: 10000"
      @click.self="showImagePicker = false"
    >
      <div class="admin-modal admin-modal-lg max-w-3xl max-h-[80vh] overflow-hidden">
        <div class="flex items-center justify-between mb-3">
          <h3 class="admin-modal-title">选择图片</h3>
          <button class="btn-admin-sm btn-admin-ghost" @click="showImagePicker = false">✕</button>
        </div>
        <div class="flex flex-wrap gap-2 mb-4">
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
        <div class="admin-modal-body p-0">
          <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            <div
              v-for="img in filteredImages"
              :key="img.id"
              class="relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all"
              :class="
                selectedWallpaper === img.url
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
                v-if="selectedWallpaper === img.url"
                class="absolute top-2 right-2 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center shadow-lg"
              >
                <span class="text-white text-xs font-bold">✓</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showSceneModal" class="admin-modal-backdrop" @click.self="closeSceneModal">
      <div class="admin-modal admin-modal-lg max-w-2xl overflow-hidden">
        <h2 class="admin-modal-title">
          {{ editingScene ? "编辑音乐" : "添加音乐" }}
        </h2>

        <div class="admin-modal-body">
          <div class="flex gap-4 mb-4">
            <div class="w-[140px]">
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                音乐ID
              </label>
              <input
                v-model="sceneForm.sceneId"
                type="text"
                :disabled="!!editingScene"
                class="w-full admin-input text-sm"
                :class="editingScene ? 'opacity-50 cursor-not-allowed' : ''"
                placeholder="rain"
              />
            </div>

            <div class="w-[120px]">
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                名称
              </label>
              <input
                v-model="sceneForm.name"
                type="text"
                class="w-full admin-input text-sm"
                placeholder="雨天"
              />
            </div>

            <div class="flex-1 min-w-0">
              <label
                class="block text-sm font-medium mb-2"
                :class="isDark ? 'text-gray-300' : 'text-gray-700'"
              >
                图标
              </label>
              <div class="flex gap-2">
                <input
                  v-model="sceneForm.icon"
                  type="text"
                  class="flex-1 admin-input text-sm"
                  placeholder="输入 lucide 图标名，参考 https://lucide.dev/icons"
                />
                <button
                  class="btn-admin-sm btn-admin-ghost flex-shrink-0 flex items-center gap-2"
                  title="选择图标颜色"
                  @click="showSceneColorPicker = true"
                >
                  <DynamicIcon
                    v-if="sceneForm.icon"
                    :name="sceneForm.icon"
                    class="w-4 h-4"
                    :style="{ color: sceneForm.color }"
                  />
                  <div class="w-4 h-4 rounded" :style="{ backgroundColor: sceneForm.color }"></div>
                </button>
              </div>
            </div>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              描述
            </label>
            <textarea
              v-model="sceneForm.description"
              rows="2"
              class="w-full admin-input resize-none"
              placeholder="描述这个音乐..."
            ></textarea>
          </div>

          <div>
            <label
              class="block text-sm font-medium mb-2"
              :class="isDark ? 'text-gray-300' : 'text-gray-700'"
            >
              音频URL
            </label>
            <input
              v-model="sceneForm.audioUrl"
              type="url"
              class="w-full admin-input"
              placeholder="https://..."
            />
          </div>
        </div>

        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="closeSceneModal">取消</button>
          <button :disabled="sceneSaving" class="btn-admin-sm btn-admin-primary" @click="saveScene">
            {{ sceneSaving ? "保存中..." : "保存" }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showSceneDeleteConfirm" class="admin-modal-backdrop">
      <div class="admin-modal admin-modal-md max-w-md">
        <h3 class="admin-modal-title">确认删除</h3>
        <div class="admin-modal-body mb-4">
          <p :class="isDark ? 'text-gray-300' : 'text-gray-600'">
            确定要删除音乐「{{ deletingScene?.name }}」吗？此操作不可恢复。
          </p>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showSceneDeleteConfirm = false">
            取消
          </button>
          <button class="btn-admin-sm btn-admin-danger" @click="confirmDeleteScene">
            确认删除
          </button>
        </div>
      </div>
    </div>

    <div
      v-if="showSceneColorPicker"
      class="admin-modal-backdrop"
      @click.self="showSceneColorPicker = false"
    >
      <div class="admin-modal admin-modal-md max-w-md overflow-hidden">
        <h3 class="admin-modal-title">选择颜色</h3>
        <div class="admin-modal-body">
          <div class="flex items-center gap-4 mb-6">
            <div
              class="w-12 h-12 rounded-xl border-2 border-gray-300 shadow-lg"
              :style="{ backgroundColor: sceneForm.color }"
            ></div>
            <input
              v-model="sceneForm.color"
              type="color"
              class="w-12 h-12 rounded-lg cursor-pointer border-0"
            />
            <input
              v-model="sceneForm.color"
              type="text"
              class="flex-1 admin-input font-mono text-sm"
            />
          </div>
          <div class="grid grid-cols-8 gap-2">
            <button
              v-for="color in presetColors"
              :key="color"
              class="w-8 h-8 rounded-lg border-2 transition-transform hover:scale-110"
              :class="
                sceneForm.color === color
                  ? 'border-white ring-2 ring-offset-2 ring-cyan-500'
                  : 'border-transparent'
              "
              :style="{ backgroundColor: color }"
              @click="sceneForm.color = color"
            ></button>
          </div>
        </div>
        <div class="admin-modal-footer">
          <button class="btn-admin-sm btn-admin-ghost" @click="showSceneColorPicker = false">
            取消
          </button>
          <button class="btn-admin-sm btn-admin-primary" @click="showSceneColorPicker = false">
            确认
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, onMounted, ref } from "vue";
import { useAppStore } from "@/stores/app";
import { useMessage } from "@/composables";
import { http } from "@/utils/request";
import { getAccessToken } from "@/utils/auth-token";
import { IconPark } from "@icon-park/vue-next/es/all";
import DynamicIcon from "@/components/DynamicIcon.vue";
import StickyBar from "@/components/StickyBar.vue";

const appStore = useAppStore();
const { success, error, warning } = useMessage();

const isDark = computed(() => appStore.themeMode === "dark");

interface SiteInfoConfig {
  logo: string;
  title: string;
  subtitle: string;
  description: string;
  copyright: string;
  icp: string;
  startTime: string;
  homeWallpaperLight: string;
  homeWallpaperDark: string;
  lightThemeColor: string;
  darkThemeColor: string;
  amapKey: string;
}

const defaultConfig: SiteInfoConfig = {
  logo: "",
  title: "MianySoul",
  subtitle: "创作者的灵感空间",
  description: "一个专为创作者打造的内容管理平台，支持图片、视频、文章等多种内容形式的创作与管理。",
  copyright: "© 2024 MianySoul",
  icp: "",
  startTime: "",
  homeWallpaperLight: "",
  homeWallpaperDark: "",
  lightThemeColor: "#14b8a6",
  darkThemeColor: "#d946ef",
  amapKey: "1560db1cdb6f71f169d02454758d2e40",
};

const deepClone = <T,>(obj: T): T => {
  return JSON.parse(JSON.stringify(obj));
};

const form = reactive<SiteInfoConfig>(deepClone(defaultConfig));
const originalValues = reactive<SiteInfoConfig>(deepClone(defaultConfig));
const saving = ref(false);

const hasChanges = computed(() => {
  return JSON.stringify(form) !== JSON.stringify(originalValues);
});

const resetForm = () => {
  Object.assign(form, deepClone(originalValues));
};

const activeTab = ref<"info" | "theme" | "scenes" | "api" | "backup">("info");

const showImagePicker = ref(false);

interface Scene {
  sceneId: string;
  name: string;
  icon: string;
  color: string;
  description?: string;
  audioUrl: string;
  isActive: boolean;
}

const presetColors = [
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#64748b",
  "#1e293b",
  "#0f172a",
];

const scenes = ref<Scene[]>([]);
const searchKeyword = ref("");
const showSceneModal = ref(false);
const showSceneColorPicker = ref(false);
const editingScene = ref<Scene | null>(null);
const sceneSaving = ref(false);
const showSceneDeleteConfirm = ref(false);
const deletingScene = ref<Scene | null>(null);

const sceneForm = reactive({
  sceneId: "",
  name: "",
  icon: "",
  color: "#6366f1",
  description: "",
  audioUrl: "",
});

const filteredScenes = computed(() => {
  if (!searchKeyword.value) return scenes.value;
  const keyword = searchKeyword.value.toLowerCase();
  return scenes.value.filter(
    (scene) =>
      scene.name.toLowerCase().includes(keyword) || scene.sceneId.toLowerCase().includes(keyword)
  );
});

interface PaginationResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const fetchScenes = async () => {
  try {
    const data = await http.get<PaginationResult<Scene>>("/scene?activeOnly=false");
    scenes.value = data.list;
  } catch (err) {
    error("获取音乐列表失败");
  }
};

const openAddSceneModal = () => {
  editingScene.value = null;
  sceneForm.sceneId = "";
  sceneForm.name = "";
  sceneForm.icon = "";
  sceneForm.color = "#6366f1";
  sceneForm.description = "";
  sceneForm.audioUrl = "";
  showSceneModal.value = true;
};

const openEditSceneModal = (scene: Scene) => {
  editingScene.value = scene;
  sceneForm.sceneId = scene.sceneId;
  sceneForm.name = scene.name;
  sceneForm.icon = scene.icon;
  sceneForm.color = scene.color || "#6366f1";
  sceneForm.description = scene.description || "";
  sceneForm.audioUrl = scene.audioUrl;
  showSceneModal.value = true;
};

const closeSceneModal = () => {
  showSceneModal.value = false;
  editingScene.value = null;
};

const saveScene = async () => {
  if (!sceneForm.sceneId || !sceneForm.name || !sceneForm.icon || !sceneForm.audioUrl) {
    warning("请填写所有必填项");
    return;
  }

  sceneSaving.value = true;
  try {
    if (editingScene.value) {
      await http.put(`/scene/${sceneForm.sceneId}`, {
        name: sceneForm.name,
        icon: sceneForm.icon,
        color: sceneForm.color,
        description: sceneForm.description,
        audioUrl: sceneForm.audioUrl,
      });
      success("音乐更新成功");
    } else {
      await http.post("/scene", {
        sceneId: sceneForm.sceneId,
        name: sceneForm.name,
        icon: sceneForm.icon,
        color: sceneForm.color,
        description: sceneForm.description,
        audioUrl: sceneForm.audioUrl,
      });
      success("音乐添加成功");
    }
    closeSceneModal();
    await fetchScenes();
  } catch (err) {
    error(editingScene.value ? "更新音乐失败" : "添加音乐失败");
  } finally {
    sceneSaving.value = false;
  }
};

const toggleSceneStatus = async (scene: Scene) => {
  try {
    await http.put(`/scene/${scene.sceneId}`, {
      isActive: !scene.isActive,
    });
    success(scene.isActive ? "音乐已禁用" : "音乐已启用");
    await fetchScenes();
  } catch (err) {
    error("操作失败");
  }
};

const deleteScene = (scene: Scene) => {
  deletingScene.value = scene;
  showSceneDeleteConfirm.value = true;
};

const confirmDeleteScene = async () => {
  if (!deletingScene.value) return;
  try {
    await http.delete(`/scene/${deletingScene.value.sceneId}`);
    success("音乐删除成功");
    showSceneDeleteConfirm.value = false;
    deletingScene.value = null;
    await fetchScenes();
  } catch (err) {
    error("删除失败");
  }
};
const imageGroups = ref<{ id: string; name: string; icon: string; isDefault?: boolean }[]>([]);
const selectedGroupId = ref("");
const selectedWallpaper = ref("");
const wallpaperType = ref("light");
const images = ref<{ id: string; url: string; filename: string; groupId: string }[]>([]);

const filteredImages = computed(() => {
  if (!selectedGroupId.value) return images.value;
  return images.value.filter((img) => img.groupId === selectedGroupId.value);
});

const deepMerge = (target: any, source: any) => {
  const result = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === "object" && !Array.isArray(source[key])) {
      result[key] = deepMerge(result[key] || {}, source[key]);
    } else {
      result[key] = source[key];
    }
  }
  return result;
};

const loadConfig = async () => {
  try {
    const data = await http.get<SiteInfoConfig>("/config");
    const merged = deepMerge(defaultConfig, data || {});
    Object.assign(form, deepClone(merged));
    Object.assign(originalValues, deepClone(merged));
  } catch {
    Object.assign(form, deepClone(defaultConfig));
    Object.assign(originalValues, deepClone(defaultConfig));
  }
};

const saveAll = async () => {
  saving.value = true;
  try {
    await http.put("/config", form);
    Object.assign(originalValues, deepClone(form));
    success("网站信息保存成功！");
  } catch (err: any) {
    error(err.message || "保存失败，请稍后重试");
  } finally {
    saving.value = false;
  }
};

const handleLogoUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const res = (await http.post("/uploads", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })) as { url: string };
    form.logo = res.url;
    target.value = "";
  } catch (err: any) {
    error(err.message || "上传失败");
  }
};

const removeLogo = () => {
  form.logo = "";
};

const getFullImageUrl = (url: string) => {
  if (!url) return "";
  if (url.startsWith("http")) return url;
  if (url.startsWith("/uploads")) return url;
  return `${import.meta.env.VITE_API_BASE_URL}${url}`;
};

const openImagePicker = (type: string) => {
  wallpaperType.value = type;
  selectedWallpaper.value = type === "light" ? form.homeWallpaperLight : form.homeWallpaperDark;
  showImagePicker.value = true;
  loadImageGroups();
};

const loadImageGroups = async () => {
  try {
    const res =
      await http.get<{ id: string; name: string; icon: string; isDefault?: boolean }[]>(
        "/gallery/groups"
      );
    imageGroups.value = res;
    const defaultGroup = res.find((g) => g.isDefault);
    if (defaultGroup) {
      selectedGroupId.value = defaultGroup.id;
    } else if (res.length > 0) {
      selectedGroupId.value = res[0].id;
    }
    loadImages();
  } catch {
    imageGroups.value = [];
  }
};

const loadImages = async () => {
  if (!selectedGroupId.value) return;
  try {
    const res = await http.get<{ id: string; url: string; filename: string; groupId: string }[]>(
      `/gallery/groups/${selectedGroupId.value}/images`
    );
    images.value = res;
  } catch {
    images.value = [];
  }
};

const selectImage = (img: { url: string }) => {
  selectedWallpaper.value = img.url;
  if (wallpaperType.value === "light") {
    form.homeWallpaperLight = img.url;
  } else {
    form.homeWallpaperDark = img.url;
  }
};

const exporting = ref(false);
const importing = ref(false);
const selectedBackupFile = ref<File | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);

// 完整备份（ZIP）相关
const selectedZipFile = ref<File | null>(null);
const zipInputRef = ref<HTMLInputElement | null>(null);

const handleFullExport = async () => {
  exporting.value = true;
  try {
    const token = getAccessToken() || "";
    const response = await fetch("/api/config/backup/export-full", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(errText || `导出失败 (${response.status})`);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `full-backup-${timestamp}.zip`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success(`完整备份导出成功！文件大小 ${(blob.size / 1024 / 1024).toFixed(2)} MB`);
  } catch (err: any) {
    error(err.message || "导出失败，请重试");
  } finally {
    exporting.value = false;
  }
};

const handleZipSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    if (!file.name.endsWith(".zip")) {
      warning("请选择 ZIP 格式的文件");
      target.value = "";
      return;
    }
    selectedZipFile.value = file;
  }
};

const triggerZipSelect = () => {
  zipInputRef.value?.click();
};

const confirmFullImport = async () => {
  if (!selectedZipFile.value) {
    warning("请先选择 ZIP 备份文件");
    return;
  }

  if (
    !confirm(
      `确定要导入此 ZIP 备份文件吗？\n\n文件: ${selectedZipFile.value.name}\n大小: ${(selectedZipFile.value.size / 1024 / 1024).toFixed(2)} MB\n\n⚠️ 当前数据库和所有上传文件将被覆盖！`
    )
  ) {
    return;
  }

  importing.value = true;
  try {
    const token = getAccessToken() || "";
    const formData = new FormData();
    formData.append("file", selectedZipFile.value);

    const response = await fetch("/api/config/backup/import-full", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = await response.json();
    if (!response.ok || result.code !== 0) {
      throw new Error(result.message || `导入失败 (${response.status})`);
    }

    success("完整备份导入成功！页面即将刷新...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (err: any) {
    error(err.message || "导入失败，请检查备份文件格式");
  } finally {
    importing.value = false;
  }
};

const handleExport = async () => {
  exporting.value = true;
  try {
    const backupData = await http.get<any>("/config/backup/export");
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    a.download = `database-backup-${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    success("数据库导出成功！");
  } catch (err: any) {
    error(err.message || "导出失败，请重试");
  } finally {
    exporting.value = false;
  }
};

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    selectedBackupFile.value = file;
  }
};

const triggerFileSelect = () => {
  fileInputRef.value?.click();
};

const confirmImport = async () => {
  if (!selectedBackupFile.value) {
    warning("请先选择备份文件");
    return;
  }

  importing.value = true;
  try {
    const text = await selectedBackupFile.value.text();
    const backup = JSON.parse(text);

    if (!backup.data || typeof backup.data !== "object") {
      error("备份文件格式错误：缺少 data 字段");
      return;
    }

    const collectionKeys = [
      "users",
      "configs",
      "scenes",
      "memoirCategories",
      "memoirEntries",
      "dreams",
      "diaries",
      "diaryImages",
      "imageGroups",
      "images",
      "videoGroups",
      "videos",
      "articleCategories",
      "audioGroups",
      "audios",
      "musicCategories",
      "musicLyrics",
      "articles",
      "narrativeCategories",
      "narratives",
      "narrativeMedias",
    ];

    const totalItems = collectionKeys.reduce((sum, key) => {
      return sum + (Array.isArray(backup.data[key]) ? backup.data[key].length : 0);
    }, 0);

    if (totalItems === 0) {
      error("备份文件为空，已拒绝导入以防止数据丢失！");
      return;
    }

    if (!confirm(`检测到 ${totalItems} 条数据。确定要导入此备份文件吗？\n当前所有数据将被覆盖！`)) {
      return;
    }

    await http.post("/config/backup/import", { backup });
    success("数据库导入成功！页面即将刷新...");
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  } catch (err: any) {
    error(err.message || "导入失败，请检查备份文件格式");
  } finally {
    importing.value = false;
  }
};

onMounted(async () => {
  await loadConfig();
  await fetchScenes();
});
</script>
