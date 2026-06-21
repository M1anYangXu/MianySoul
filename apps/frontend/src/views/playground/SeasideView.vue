<template>
  <div class="immersive-container">
    <div v-if="!currentScene" class="loading-state">
      <span class="loading-icon">⏳</span>
      <span class="loading-text">加载中...</span>
    </div>

    <template v-else>
      <div class="scene-background" :style="{ backgroundImage: `url('${currentScene.image}')` }">
        <div class="scene-overlay"></div>
      </div>

      <div class="main-content">
        <div class="scene-selector">
          <button
            v-for="scene in scenes"
            :key="scene.sceneId"
            class="scene-btn"
            :class="{ active: currentScene.sceneId === scene.sceneId }"
            @click="switchScene(scene)"
          >
            <span class="scene-icon">{{ scene.icon }}</span>
            <span class="scene-name">{{ scene.name }}</span>
          </button>
        </div>

        <div class="scene-info">
          <h1 class="scene-title">{{ currentScene.name }}</h1>
          <p class="scene-desc">{{ currentScene.description }}</p>
        </div>

        <div class="sound-control">
          <button class="play-btn" :class="{ playing: isPlaying }" @click="toggleSound">
            <span v-if="isPlaying">⏸️</span>
            <span v-else>▶️</span>
          </button>
          <div class="volume-control">
            <span class="volume-icon">🔊</span>
            <input
              v-model="volume"
              type="range"
              min="0"
              max="100"
              class="volume-slider"
              @input="updateVolume"
            />
            <span class="volume-value">{{ volume }}%</span>
          </div>
        </div>

        <div class="timer-section">
          <div class="timer-buttons">
            <button
              class="timer-btn"
              :class="{ active: timerMinutes === 15 }"
              @click="setTimer(15)"
            >
              15分
            </button>
            <button
              class="timer-btn"
              :class="{ active: timerMinutes === 30 }"
              @click="setTimer(30)"
            >
              30分
            </button>
            <button
              class="timer-btn"
              :class="{ active: timerMinutes === 60 }"
              @click="setTimer(60)"
            >
              1小时
            </button>
            <button v-if="timerMinutes > 0" class="timer-btn" @click="setTimer(0)">∞</button>
          </div>
          <div v-if="timerMinutes > 0 && timerRemaining > 0" class="timer-display">
            <span class="timer-time">{{ formatTime(timerRemaining) }}</span>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { http } from "@/utils/request";

interface Scene {
  sceneId: string;
  name: string;
  icon: string;
  description?: string;
  image: string;
  audioUrl: string;
}

const scenes = ref<Scene[]>([]);
const currentScene = ref<Scene | null>(null);
const volume = ref(60);
const isPlaying = ref(false);
const timerMinutes = ref(0);
const timerRemaining = ref(0);

let audio: HTMLAudioElement | null = null;
let timerInterval: number | null = null;
let audioContext: AudioContext | null = null;
let noiseSource: AudioBufferSourceNode | null = null;

const fetchScenes = async () => {
  try {
    const data = await http.get<Scene[]>("/scene");
    scenes.value = data;
    if (scenes.value.length > 0 && !currentScene.value) {
      currentScene.value = scenes.value[0];
    }
  } catch (err) {
    console.error("获取场景失败:", err);
  }
};

onMounted(() => {
  fetchScenes();
});

const startSound = () => {
  if (!currentScene.value) return;

  if (!audio) {
    audio = new Audio(currentScene.value.audioUrl);
    audio.loop = true;
    audio.volume = volume.value / 100;
  }

  audio.play().catch((err) => {
    console.error("播放失败:", err);
    fallbackToNoise();
  });
  isPlaying.value = true;
};

const fallbackToNoise = () => {
  audioContext = new AudioContext();
  const bufferSize = 2 * audioContext.sampleRate;
  const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
  const output = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noiseSource = audioContext.createBufferSource();
  noiseSource.buffer = buffer;
  noiseSource.loop = true;

  const gainNode = audioContext.createGain();
  gainNode.gain.value = (volume.value / 100) * 0.3;

  const filter = audioContext.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 1000;

  noiseSource.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  noiseSource.start();
};

const stopSound = () => {
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  if (noiseSource) {
    noiseSource.stop();
    noiseSource = null;
  }
  if (audioContext) {
    audioContext.close();
    audioContext = null;
  }
  isPlaying.value = false;
};

const toggleSound = () => {
  if (isPlaying.value) {
    stopSound();
  } else {
    startSound();
  }
};

const switchScene = (scene: Scene) => {
  if (isPlaying.value) {
    stopSound();
    audio = null;
    noiseSource = null;
    audioContext = null;
  }
  currentScene.value = scene;
  clearTimer();
};

const updateVolume = () => {
  if (audio) {
    audio.volume = volume.value / 100;
  }
};

const setTimer = (minutes: number) => {
  if (timerInterval) clearInterval(timerInterval);

  timerMinutes.value = minutes;

  if (minutes === 0) {
    timerRemaining.value = 0;
    return;
  }

  timerRemaining.value = minutes * 60;

  timerInterval = window.setInterval(() => {
    timerRemaining.value--;
    if (timerRemaining.value <= 0) {
      clearTimer();
      if (isPlaying.value) stopSound();
    }
  }, 1000);
};

const clearTimer = () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
  timerMinutes.value = 0;
  timerRemaining.value = 0;
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
};

onUnmounted(() => {
  stopSound();
  clearTimer();
  if (audio) {
    audio = null;
  }
});
</script>

<style scoped>
.immersive-container {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  position: relative;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
}

.scene-background {
  position: absolute;
  inset: 0;
  background-size: cover;
  background-position: center;
  transition: background-image 1s ease;
}

.scene-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
}

.main-content {
  position: relative;
  z-index: 10;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  gap: 40px;
}

.scene-selector {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.scene-btn {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid transparent;
  border-radius: 16px;
  padding: 16px 24px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 10px;
  color: white;
}

.scene-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-3px);
}

.scene-btn.active {
  background: rgba(255, 255, 255, 0.25);
  border-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 8px 30px rgba(255, 255, 255, 0.2);
}

.scene-icon {
  font-size: 2rem;
}

.scene-name {
  font-size: 1rem;
  font-weight: 500;
}

.scene-info {
  text-align: center;
  color: white;
}

.scene-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin: 0;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
  letter-spacing: 2px;
}

.scene-desc {
  font-size: 1.2rem;
  opacity: 0.8;
  margin-top: 15px;
  font-weight: 300;
}

.sound-control {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 30px;
}

.play-btn {
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
}

.play-btn:hover {
  transform: scale(1.1);
}

.play-btn.playing {
  background: rgba(100, 200, 100, 0.9);
}

.play-btn span {
  font-size: 2rem;
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 15px 25px;
}

.volume-icon {
  font-size: 1.5rem;
}

.volume-slider {
  width: 150px;
  height: 6px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 3px;
  appearance: none;
  cursor: pointer;
}

.volume-slider::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  background: white;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.volume-value {
  color: white;
  font-size: 1rem;
  min-width: 50px;
}

.timer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
}

.timer-buttons {
  display: flex;
  gap: 15px;
}

.timer-btn {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px 20px;
  color: white;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.timer-btn:hover {
  background: rgba(255, 255, 255, 0.25);
}

.timer-btn.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.timer-display {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 10px 20px;
}

.timer-time {
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .main-content {
    padding: 20px;
    gap: 30px;
  }

  .scene-title {
    font-size: 2.5rem;
  }

  .scene-desc {
    font-size: 1rem;
  }

  .scene-selector {
    gap: 10px;
  }

  .scene-btn {
    padding: 12px 16px;
  }

  .scene-icon {
    font-size: 1.5rem;
  }

  .scene-name {
    font-size: 0.85rem;
  }

  .play-btn {
    width: 60px;
    height: 60px;
  }

  .play-btn span {
    font-size: 1.5rem;
  }

  .volume-control {
    padding: 10px 15px;
  }

  .volume-slider {
    width: 100px;
  }

  .timer-btn {
    padding: 10px 15px;
    font-size: 0.8rem;
  }
}

.loading-state {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  background: rgba(0, 0, 0, 0.7);
}

.loading-icon {
  font-size: 4rem;
  animation: spin 2s linear infinite;
}

.loading-text {
  color: white;
  font-size: 1.2rem;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
