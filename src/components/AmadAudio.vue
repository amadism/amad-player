<template>
  <div :class="['relative bg-[#fff] text-black dark:bg-[#333] dark:text-white pt-4', customClass]">
    <p v-if="title" class="w-full text-center pb-2 font-semibold">{{ title }}</p>

    <div class="flex justify-between items-center px-3 pb-2">
      <div class="flex items-center gap-2">
        <a @click="skip15Seconds" aria-label="Skip -10 seconds">
          <Back15Icon />
        </a>
        <a class="player-play-pause-icon" :aria-label="playing ? 'pause' : 'play'" @click="togglePlay">
          <PlayIcon v-if="!playing" />
          <PauseIcon v-if="playing" />
        </a>
        <a @click="skip15SecondsForward" aria-label="Skip +10 seconds">
          <Ahead15Icon />
        </a>
      </div>

      <div v-if="loading" class="h-6 w-6 border-4 rounded-full border-emerald-600 border-dashed animate-spin"></div>
      <div v-else class=" flex  items-center gap-2">
        <span>{{ formatTime(currentSeconds) }} - {{ formatTime(durationSeconds) }}</span>

        <a tabindex="0" class="player-volume-icon" :aria-label="muted ? 'unmute' : 'mute'" @click="mute">
          <VolumeIcon v-if="!muted" />
          <VolumeMutedIcon v-if="muted" />
        </a>
      </div>
    </div>

    <div :class="['w-full bg-gray-300 dark:bg-gray-600 absolute top-0 h-2 cursor-pointer', barStyle]"
      @click.prevent="seek">
      <div :style="{ width: percentComplete + '%' }"
        :class="['bg-emerald-600 absolute transition-all h-2 cursor-pointer', barSeeker]" />
    </div>
    <audio ref="audioFile" :loop="loop" :src="file" preload="auto" style="display: none" />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import PlayIcon from '../components/svg/PlayIcon.vue'
import PauseIcon from '../components/svg/PauseIcon.vue'
import VolumeIcon from '../components/svg/VolumeIcon.vue'
import VolumeMutedIcon from '../components/svg/VolumeMutedIcon.vue'
import Back15Icon from './svg/Back15Icon.vue'
import Ahead15Icon from './svg/Ahead15Icon.vue'

// Props
const props = defineProps({
  autoPlay: { type: Boolean, default: false },
  file: { type: String, default: null },
  loop: { type: Boolean, default: false },
  title: { type: String, default: null },
  customClass: { type: String, default: '' },
  barStyle: { type: String, default: '' },
  barSeeker: { type: String, default: '' }
})

// Reactive state
const audioFile = ref(null)
const currentSeconds = ref(0)
const durationSeconds = ref(0)
const playing = ref(false)
const volume = ref(100)
const muted = computed(() => volume.value === 0)
const percentComplete = computed(() => (currentSeconds.value / durationSeconds.value) * 100)
const loading = ref(true)

// Watchers
watch(playing, (value) => {
  if (audioFile.value) {
    if (value) audioFile.value.play()
    else audioFile.value.pause()
  }
})

watch(volume, () => {
  if (audioFile.value) audioFile.value.volume = volume.value / 100
})

watch(() => props.file, (newFile, oldFile) => {
  loading.value = true
  if (newFile !== oldFile && playing.value) {
    playing.value = false
  }
})

onMounted(() => {
  audioFile.value = document.querySelector('audio')
  if (audioFile.value) {
    audioFile.value.addEventListener('timeupdate', update)
    audioFile.value.addEventListener('loadeddata', load)
    audioFile.value.addEventListener('play', () => { playing.value = true })
    audioFile.value.addEventListener('pause', () => { playing.value = false })
  }
})

// Methods
const togglePlay = () => { playing.value = !playing.value }

const load = () => {
  if (audioFile.value.readyState >= 2) {
    durationSeconds.value = parseInt(audioFile.value.duration)
    loading.value = false
    if (props.autoPlay) togglePlay()
  }
}

const update = () => {
  currentSeconds.value = audioFile.value.currentTime
}

const mute = () => {
  volume.value = muted.value ? 100 : 0
}

const seek = (e) => {
  if (!audioFile.value) return
  const rect = e.target.getBoundingClientRect()
  const seekPos = (e.clientX - rect.left) / rect.width
  audioFile.value.currentTime = audioFile.value.duration * seekPos
}

const skip15Seconds = () => {
  if (!audioFile.value) return
  audioFile.value.currentTime = Math.max(audioFile.value.currentTime - 10, 0)
}

const skip15SecondsForward = () => {
  if (!audioFile.value) return
  audioFile.value.currentTime = Math.min(audioFile.value.currentTime + 10, audioFile.value.duration)
}

const formatTime = (time) => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}

</script>

<style scoped>
input[type="range"] {
  -webkit-appearance: none;
  background: transparent;
  width: 100%;
}
</style>
