<template>
  <div class="min-h-screen py-24 px-6">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-8">
        <h1
          class="text-4xl md:text-5xl font-bold mb-4"
          :class="isDark ? 'text-white' : 'text-gray-900'"
        >
          <span
            :class="
              isDark
                ? 'bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-400'
                : 'bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600'
            "
            class="bg-clip-text text-transparent"
          >
            足迹
          </span>
        </h1>
        <p :class="isDark ? 'text-gray-400' : 'text-gray-500'" class="text-lg">
          记录走过的每一个城市
        </p>
      </div>

      <div
        class="rounded-xl p-6 mb-8"
        :class="
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-lg'
        "
        style="backdrop-filter: blur(10px)"
      >
        <div class="grid grid-cols-2 gap-6">
          <div class="text-center">
            <div
              class="text-5xl font-black bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent"
            >
              {{ stats.provinces }}/{{ stats.totalProvinces }}
            </div>
            <div class="text-sm mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              去过的省份
            </div>
          </div>
          <div class="text-center">
            <div
              class="text-5xl font-black bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
            >
              {{ stats.cities }}/{{ stats.totalCities }}
            </div>
            <div class="text-sm mt-2" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
              去过的城市
            </div>
          </div>
        </div>
      </div>

      <div
        class="rounded-xl p-6 mb-8"
        :class="
          isDark ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-100 shadow-lg'
        "
        style="backdrop-filter: blur(10px)"
      >
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-3">
            <button
              v-if="currentProvince"
              class="flex items-center gap-1 text-sm px-3 py-1 rounded-lg transition-colors"
              :class="
                isDark
                  ? 'bg-white/10 text-gray-300 hover:bg-white/20'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              "
              @click="goBack"
            >
              <span>←</span>
              返回中国地图
            </button>
            <h3 class="text-lg font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
              {{ currentProvince ? `${currentProvince} - 市级地图` : "中国地图" }}
            </h3>
          </div>
          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded" :style="{ background: visitedColor }"></div>
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">已去过</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 rounded" :style="{ background: unvisitedColor }"></div>
              <span :class="isDark ? 'text-gray-400' : 'text-gray-500'">未去过</span>
            </div>
          </div>
        </div>

        <div ref="mapContainer" class="aspect-[16/10] w-full"></div>
      </div>

      <div class="space-y-6">
        <div
          v-for="(provinceData, provinceName) in groupedFootprints"
          :key="provinceName"
          class="rounded-xl p-6"
          :class="
            isDark
              ? 'bg-white/5 border border-white/10'
              : 'bg-white border border-gray-100 shadow-lg'
          "
          style="backdrop-filter: blur(10px)"
        >
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-3">
              <span class="text-2xl">📍</span>
              <h3 class="text-xl font-bold" :class="isDark ? 'text-white' : 'text-gray-900'">
                {{ provinceName }}
              </h3>
            </div>
            <span
              class="text-sm px-3 py-1 rounded-full"
              :class="isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'"
            >
              {{ provinceData.cities.length }}/{{ getAllCitiesInProvince(provinceName) }}
            </span>
          </div>

          <div class="space-y-3">
            <div
              v-for="city in provinceData.cities"
              :key="city.id"
              class="rounded-lg p-4"
              :class="isDark ? 'bg-white/5' : 'bg-gray-50'"
            >
              <div class="flex items-center justify-between mb-2">
                <h4 class="font-semibold" :class="isDark ? 'text-white' : 'text-gray-900'">
                  {{ city.city }}
                </h4>
                <span class="text-sm" :class="isDark ? 'text-gray-400' : 'text-gray-500'">
                  {{ city.places ? getPlaces(city.places).length : 0 }} 个地方
                </span>
              </div>
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="(place, index) in getPlaces(city.places)"
                  :key="index"
                  class="px-3 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-lg"
                >
                  {{ place }}
                </span>
                <span
                  v-if="!city.places"
                  class="text-sm"
                  :class="isDark ? 'text-gray-500' : 'text-gray-400'"
                >
                  暂无具体地点记录
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer class="py-8 mt-12 border-t" :class="isDark ? 'border-white/10' : 'border-gray-200'">
        <div class="text-center">
          <p :class="isDark ? 'text-gray-500' : 'text-gray-400'" class="text-sm">
            © {{ new Date().getFullYear() }} {{ siteConfig?.title || "MianySoul" }}
          </p>
        </div>
      </footer>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch, nextTick } from "vue";
import { useAppStore } from "@/stores";
import { http } from "@/utils/request";
import * as echarts from "echarts";

const appStore = useAppStore();
const isDark = computed(() => appStore.themeMode === "dark");

interface Footprint {
  id: string;
  province: string;
  city: string;
  places: string;
  createdAt: string;
  updatedAt: string;
}

interface SiteConfig {
  title: string;
}

const siteConfig = ref<SiteConfig | null>(null);
const footprints = ref<Footprint[]>([]);
const currentProvince = ref<string | null>(null);
const mapContainer = ref<HTMLElement | null>(null);

let chart: echarts.ECharts | null = null;

const visitedColor = computed(() => (isDark.value ? "#818cf8" : "#6366f1"));
const unvisitedColor = computed(() => (isDark.value ? "#374151" : "#e5e7eb"));

const provinceCityCounts: Record<string, number> = {
  北京: 1,
  天津: 1,
  河北: 11,
  山西: 11,
  内蒙古: 9,
  辽宁: 14,
  吉林: 9,
  黑龙江: 12,
  上海: 1,
  江苏: 13,
  浙江: 11,
  安徽: 16,
  福建: 9,
  江西: 11,
  山东: 16,
  河南: 17,
  湖北: 12,
  湖南: 14,
  广东: 21,
  广西: 14,
  海南: 4,
  重庆: 1,
  四川: 21,
  贵州: 6,
  云南: 8,
  西藏: 6,
  陕西: 10,
  甘肃: 12,
  青海: 8,
  宁夏: 5,
  新疆: 14,
  香港: 1,
  澳门: 1,
  台湾: 6,
};

const provinceNameMap: Record<string, string> = {
  北京: "北京市",
  天津: "天津市",
  河北: "河北省",
  山西: "山西省",
  内蒙古: "内蒙古自治区",
  辽宁: "辽宁省",
  吉林: "吉林省",
  黑龙江: "黑龙江省",
  上海: "上海市",
  江苏: "江苏省",
  浙江: "浙江省",
  安徽: "安徽省",
  福建: "福建省",
  江西: "江西省",
  山东: "山东省",
  河南: "河南省",
  湖北: "湖北省",
  湖南: "湖南省",
  广东: "广东省",
  广西: "广西壮族自治区",
  海南: "海南省",
  重庆: "重庆市",
  四川: "四川省",
  贵州: "贵州省",
  云南: "云南省",
  西藏: "西藏自治区",
  陕西: "陕西省",
  甘肃: "甘肃省",
  青海: "青海省",
  宁夏: "宁夏回族自治区",
  新疆: "新疆维吾尔自治区",
  香港: "香港特别行政区",
  澳门: "澳门特别行政区",
  台湾: "台湾省",
};

const getAllCitiesInProvince = (provinceName: string): number => {
  return provinceCityCounts[provinceName] || 0;
};

const getPlaces = (places: string): string[] => {
  if (!places) return [];
  return places
    .split(/[,，]/)
    .map((p) => p.trim())
    .filter(Boolean);
};

const groupedFootprints = computed(() => {
  const groups: Record<string, { cities: Footprint[] }> = {};
  footprints.value.forEach((footprint) => {
    if (!groups[footprint.province]) {
      groups[footprint.province] = { cities: [] };
    }
    groups[footprint.province].cities.push(footprint);
  });
  return groups;
});

const stats = computed(() => {
  const provinceSet = new Set(footprints.value.map((f) => f.province));
  const citySet = new Set(footprints.value.map((f) => `${f.province}-${f.city}`));
  return {
    provinces: provinceSet.size,
    totalProvinces: Object.keys(provinceCityCounts).length,
    cities: citySet.size,
    totalCities: Object.values(provinceCityCounts).reduce((a, b) => a + b, 0),
  };
});

const hasProvince = (provinceName: string): boolean => {
  return footprints.value.some((f) => f.province === provinceName);
};

const hasCity = (provinceName: string, cityName: string): boolean => {
  return footprints.value.some((f) => f.province === provinceName && f.city === cityName);
};

const getProvinceFullName = (shortName: string): string => {
  return provinceNameMap[shortName] || shortName;
};

const getProvinceShortName = (fullName: string): string => {
  for (const [short, full] of Object.entries(provinceNameMap)) {
    if (full === fullName) return short;
  }
  return fullName;
};

const fetchChinaGeoJSON = async (): Promise<any> => {
  try {
    const response = await fetch("https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json");
    return await response.json();
  } catch (e) {
    console.error("加载中国地图失败:", e);
    return null;
  }
};

const fetchProvinceGeoJSON = async (provinceName: string): Promise<any> => {
  try {
    const provinceCodes: Record<string, string> = {
      北京: "110000",
      天津: "120000",
      河北: "130000",
      山西: "140000",
      内蒙古: "150000",
      辽宁: "210000",
      吉林: "220000",
      黑龙江: "230000",
      上海: "310000",
      江苏: "320000",
      浙江: "330000",
      安徽: "340000",
      福建: "350000",
      江西: "360000",
      山东: "370000",
      河南: "410000",
      湖北: "420000",
      湖南: "430000",
      广东: "440000",
      广西: "450000",
      海南: "460000",
      重庆: "500000",
      四川: "510000",
      贵州: "520000",
      云南: "530000",
      西藏: "540000",
      陕西: "610000",
      甘肃: "620000",
      青海: "630000",
      宁夏: "640000",
      新疆: "650000",
      香港: "810000",
      澳门: "820000",
      台湾: "710000",
    };
    const code = provinceCodes[provinceName];
    if (!code) return null;
    const response = await fetch(`https://geo.datav.aliyun.com/areas_v3/bound/${code}_full.json`);
    return await response.json();
  } catch (e) {
    console.error(`加载${provinceName}地图失败:`, e);
    return null;
  }
};

const initChinaMap = async () => {
  if (!chart) return;
  const geoJSON = await fetchChinaGeoJSON();
  if (!geoJSON) return;

  echarts.registerMap("china", geoJSON);

  const data = Object.keys(provinceNameMap).map((shortName) => ({
    name: getProvinceFullName(shortName),
    value: hasProvince(shortName) ? 1 : 0,
    shortName,
  }));

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const shortName = params.data?.shortName || getProvinceShortName(params.name);
        const visited = hasProvince(shortName);
        return `${params.name}<br/>${visited ? "✅ 已去过" : "❌ 未去过"}`;
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        color: [unvisitedColor.value, visitedColor.value],
      },
    },
    series: [
      {
        type: "map",
        map: "china",
        roam: true,
        label: {
          show: true,
          fontSize: 9,
          color: isDark.value ? "#9ca3af" : "#6b7280",
        },
        emphasis: {
          label: {
            color: "#fff",
          },
          itemStyle: {
            areaColor: "#a78bfa",
          },
        },
        itemStyle: {
          borderColor: isDark.value ? "#4b5563" : "#d1d5db",
          borderWidth: 0.5,
        },
        data,
      },
    ],
  };

  chart.setOption(option);
};

const initProvinceMap = async (provinceName: string) => {
  if (!chart) return;
  const geoJSON = await fetchProvinceGeoJSON(provinceName);
  if (!geoJSON) {
    chart.setOption({
      title: {
        text: `${provinceName} 暂无地图数据`,
        left: "center",
        top: "center",
        textStyle: {
          color: isDark.value ? "#9ca3af" : "#6b7280",
          fontSize: 16,
        },
      },
      series: [],
    });
    return;
  }

  echarts.registerMap(provinceName, geoJSON);

  const cities = geoJSON.features?.map((f: any) => f.properties.name) || [];
  const data = cities.map((cityName: string) => ({
    name: cityName,
    value: hasCity(provinceName, cityName.replace(/市|地区|自治州|盟/g, "")) ? 1 : 0,
  }));

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: "item",
      formatter: (params: any) => {
        const cityShort = params.name.replace(/市|地区|自治州|盟/g, "");
        const visited = hasCity(provinceName, cityShort);
        return `${params.name}<br/>${visited ? "✅ 已去过" : "❌ 未去过"}`;
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 1,
      inRange: {
        color: [unvisitedColor.value, visitedColor.value],
      },
    },
    series: [
      {
        type: "map",
        map: provinceName,
        roam: true,
        label: {
          show: true,
          fontSize: 9,
          color: isDark.value ? "#9ca3af" : "#6b7280",
        },
        emphasis: {
          label: {
            color: "#fff",
          },
          itemStyle: {
            areaColor: "#a78bfa",
          },
        },
        itemStyle: {
          borderColor: isDark.value ? "#4b5563" : "#d1d5db",
          borderWidth: 0.5,
        },
        data,
      },
    ],
  };

  chart.setOption(option, true);
};

const initChart = () => {
  if (!mapContainer.value) return;
  chart = echarts.init(mapContainer.value);
  chart.on("click", (params: any) => {
    if (!currentProvince.value && params.componentType === "series") {
      const shortName = getProvinceShortName(params.name);
      if (provinceNameMap[shortName] || provinceCityCounts[shortName]) {
        currentProvince.value = shortName;
      }
    }
  });
  window.addEventListener("resize", handleResize);
};

const handleResize = () => {
  chart?.resize();
};

const updateMap = async () => {
  if (currentProvince.value) {
    await initProvinceMap(currentProvince.value);
  } else {
    await initChinaMap();
  }
};

const goBack = () => {
  currentProvince.value = null;
};

const fetchFootprints = async () => {
  try {
    const data = await http.get<Footprint[]>("/footprint/footprints/public");
    footprints.value = data;
  } catch (e) {
    console.error("获取足迹失败:", e);
  }
};

const fetchConfig = async () => {
  try {
    const data = await http.get<SiteConfig>("/config");
    siteConfig.value = data;
  } catch (e) {
    console.error("获取配置失败:", e);
  }
};

watch(currentProvince, () => {
  nextTick(() => {
    updateMap();
  });
});

watch(isDark, () => {
  nextTick(() => {
    updateMap();
  });
});

onMounted(async () => {
  await fetchFootprints();
  await fetchConfig();
  await nextTick();
  initChart();
  await updateMap();
});

onUnmounted(() => {
  window.removeEventListener("resize", handleResize);
  chart?.dispose();
  chart = null;
});
</script>
