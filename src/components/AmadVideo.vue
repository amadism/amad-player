<template>
  <div 
    class="relative overflow-hidden rounded-lg" 
    @mousemove="showControls" 
    @mouseleave="hideControls"
    @touchstart="showControls" 
    @touchend="hideControls"
  >
    <video ref="videoFile" :loop="loop" :src="file" preload="auto" :controls="false" class="w-full h-auto"
      @loadeddata="onVideoLoaded" @timeupdate="update" @play="onPlay" @pause="onPause" />

    <p v-if="title" :class="{'-top-12 opacity-100': hovering}" class="w-full absolute px-2 overflow-hidden text-nowrap text-xl top-0 transition-all p-1">{{ title }}</p>

<div v-if="!playing" :class="{' opacity-0 transition-all': hovering}" class="absolute top-0 left-0 w-full h-full bg-opacity-0 flex justify-center items-center">
  <PlayIcon @click="togglePlay" class="scale-[2] animate-pulse"/>
</div>
    <!-- Controls -->
    <div class="flex gap-3 items-center absolute bottom-2 w-full px-2 transition-all translate-y-12 opacity-0" :class="{'opacity-100 translate-y-0': hovering}">
      <div class="flex items-center gap-2">
        <a v-if="skip" @click="skip10Seconds" aria-label="Skip -10 seconds">
          <Back15Icon />
        </a>
        <a class="player-play-pause-icon" :aria-label="playing ? 'pause' : 'play'" @click="togglePlay">
          <PlayIcon v-if="!playing" />
          <PauseIcon v-if="playing" />
        </a>
        <a v-if="skip" @click="skip10SecondsForward" aria-label="Skip +10 seconds">
          <Ahead15Icon />
        </a>
      </div>

      <!-- Progress bar -->
      <div class="w-full rounded-lg bg-gray-300 dark:bg-gray-400 relative h-1 cursor-pointer" @click.prevent="seek">
        <div :style="{ width: percentComplete + '%' }"
          class="bg-emerald-600 rounded-lg absolute transition-all h-1 cursor-pointer" />
        <div :style="{ left: pinTracker + '%' }" class="absolute transition-all -top-1 w-3 h-3 rounded-full bg-black dark:bg-white" />
      </div>

      <div v-if="loading" class="min-h-6 min-w-6 border-4 rounded-full border-emerald-600 border-dashed animate-spin"></div>
      <div v-else class="flex items-center gap-2">
        <span class="inline-block text-nowrap">{{ formatTime(currentSeconds) }} - {{ formatTime(durationSeconds) }}</span>

        <a tabindex="0" class="player-volume-icon" :aria-label="muted ? 'unmute' : 'mute'" @click="mute">
          <VolumeIcon v-if="!muted" />
          <VolumeMutedIcon v-if="muted" />
        </a>

        <a tabindex="0" class="flex items-center" :aria-label="fullscreen ? 'exit full-screen' : 'full-screen'"
          @click="toggleFullscreen">
          <FullscreenIcon />
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import PlayIcon from '../components/svg/PlayIcon.vue'
import PauseIcon from '../components/svg/PauseIcon.vue'
import VolumeIcon from '../components/svg/VolumeIcon.vue'
import VolumeMutedIcon from '../components/svg/VolumeMutedIcon.vue'
import Back15Icon from './svg/Back15Icon.vue'
import Ahead15Icon from './svg/Ahead15Icon.vue'
import FullscreenIcon from './svg/FullscreenIcon.vue'

// Props
const props = defineProps({
  skip: { type: Boolean, default: true },
  autoPlay: { type: Boolean, default: false },
  file: { type: String, default: null },
  loop: { type: Boolean, default: false },
  title: { type: String, default: null },
})

// Reactive state
const videoFile = ref(null)
const currentSeconds = ref(0)
const durationSeconds = ref(0)
const playing = ref(false)
const volume = ref(100)
const muted = computed(() => volume.value === 0)
const percentComplete = computed(() => (currentSeconds.value / durationSeconds.value) * 100)
const pinTracker = computed(() => {
  const percentage = (currentSeconds.value / durationSeconds.value) * 100;
  return percentage > 98 ? 98 : percentage;
})
const loading = ref(true)
const fullscreen = ref(false)
const hovering = ref(false) // Track hover state

// Watchers
watch(playing, (value) => {
  if (videoFile.value) {
    if (value) videoFile.value.play()
    else videoFile.value.pause()
  }
})

watch(volume, () => {
  if (videoFile.value) videoFile.value.volume = volume.value / 100
})

// Methods
const togglePlay = () => { playing.value = !playing.value }
const onVideoLoaded = () => {
  if (videoFile.value) {
    durationSeconds.value = Math.floor(videoFile.value.duration)
    loading.value = false
    if (props.autoPlay) {
      playing.value = true
      videoFile.value.play()
    }
  }
}
const update = () => {
  if (videoFile.value) {
    currentSeconds.value = videoFile.value.currentTime
  }
}
const onPlay = () => { playing.value = true }
const onPause = () => { playing.value = false }
const mute = () => { volume.value = muted.value ? 100 : 0 }
const seek = (e) => {
  if (!videoFile.value) return
  const rect = e.target.getBoundingClientRect()
  const seekPos = (e.clientX - rect.left) / rect.width
  videoFile.value.currentTime = videoFile.value.duration * seekPos
}
const skip10Seconds = () => {
  if (!videoFile.value) return
  videoFile.value.currentTime = Math.max(videoFile.value.currentTime - 10, 0)
}
const skip10SecondsForward = () => {
  if (!videoFile.value) return
  videoFile.value.currentTime = Math.min(videoFile.value.currentTime + 10, videoFile.value.duration)
}
const toggleFullscreen = () => {
  if (fullscreen.value) {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen() // Safari
    else if (document.msExitFullscreen) document.msExitFullscreen() // IE
  } else {
    if (videoFile.value.requestFullscreen) videoFile.value.requestFullscreen()
    else if (videoFile.value.webkitRequestFullscreen) videoFile.value.webkitRequestFullscreen() // Safari
    else if (videoFile.value.msRequestFullscreen) videoFile.value.msRequestFullscreen() // IE
  }
  fullscreen.value = !fullscreen.value
}
const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

// Show the controls when the mouse or touch starts inside the video container
function showControls() {
  hovering.value = true;

  // Clear any previous timeouts
  if (hoverTimeout) clearTimeout(hoverTimeout);
  
  // Set a timeout to hide controls after 2 seconds
  hoverTimeout = setTimeout(() => {
    hovering.value = false;
  }, 2000); // Hide after 2 seconds
}

// Hide controls after mouse or touch ends
function hideControls() {
  if (hoverTimeout) clearTimeout(hoverTimeout);
  hoverTimeout = setTimeout(() => {
    hovering.value = false;
  }, 2000); // Hide after 2 seconds
}

let hoverTimeout;
</script>

<style scoped>
.controls {
  opacity: 0;
  transition: opacity 0.3s ease;
}
.controls-visible {
  opacity: 1;
}
</style>
