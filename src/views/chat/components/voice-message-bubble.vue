<template>
  <div class="voice-message d-flex items-center justify-between gap-4 min-w-0">
    <div ref="waveformEl" class="waveform flex-1 min-w-0" :style="{ height: `${heightPx}px` }" />
    <v-chip
      size="small"
      variant="outlined"
      class="select-none cursor-pointer"
      @click="cycleRate"
      :aria-label="`Cambiar velocidad a siguiente valor`"
      :title="`Velocidad: x${playbackRate.toFixed(1)} (clic para cambiar)`"
    >
      x {{ playbackRate.toFixed(1) }}
    </v-chip>
  </div>
  <div v-if="showDuration" class="text-caption mt-2">{{ durationLabel }}</div>
</template>

<script setup lang="ts">
import WaveSurfer, { type WaveSurferOptions } from "wavesurfer.js"
import { computed, onBeforeUnmount, ref, watch, defineExpose } from "vue"

type Props = {
  source: Blob | ArrayBuffer | string
  initialRate?: number
  durationMs?: number
  rates?: number[]
  showDuration?: boolean
  heightPx?: number
  barWidth?: number
  barGap?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialRate: 1,
  rates: () => [1, 1.5, 2],
  showDuration: true,
  heightPx: 64,
  barWidth: 2,
  barGap: 1,
})

const emit = defineEmits<{
  (e: "rate-change", rate: number): void
  (e: "play"): void
  (e: "pause"): void
  (e: "finish"): void
  (e: "ready", durationSeconds: number): void
}>()

const waveformEl = ref<HTMLElement | null>(null)
const wavesurfer = ref<WaveSurfer | null>(null)
const isReady = ref(false)
const durationSec = ref(0)
const playbackRate = ref(props.initialRate)

const durationLabel = computed(() => formatDuration(durationSec.value))

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = Math.floor(totalSeconds % 60)
  return `${minutes}:${seconds.toString().padStart(2, "0")}`
}

async function createWaveSurfer(): Promise<void> {
  if (!waveformEl.value) return
  destroyWaveSurfer()

  const options: WaveSurferOptions = {
    container: waveformEl.value,
    height: props.heightPx,
    waveColor: "#c9c9cf",
    progressColor: "#9c9caf",
    cursorColor: "transparent",
    barWidth: props.barWidth,
    barGap: props.barGap,
    barRadius: 2,
    normalize: true,
  }

  const instance = WaveSurfer.create(options)
  wavesurfer.value = instance

  instance.on("ready", () => {
    isReady.value = true
    durationSec.value = instance.getDuration()
    instance.setPlaybackRate(playbackRate.value)
    emit("ready", durationSec.value)
  })
  instance.on("decode", duration => {
    durationSec.value = duration
  })
  instance.on("destroy", () => {
    isReady.value = false
  })
  instance.on("play", () => emit("play"))
  instance.on("pause", () => emit("pause"))
  instance.on("finish", () => emit("finish"))

  const src = await toAudioUrl(props.source)
  await instance.load(src)
}

function destroyWaveSurfer(): void {
  if (wavesurfer.value) {
    wavesurfer.value.destroy()
    wavesurfer.value = null
  }
}

async function toAudioUrl(input: Blob | ArrayBuffer | string): Promise<string> {
  if (typeof input === "string") return input
  if (input instanceof Blob) return URL.createObjectURL(input)
  const blob = new Blob([input], { type: "audio/webm" })
  return URL.createObjectURL(blob)
}

function play(): void {
  wavesurfer.value?.play()
}
function pause(): void {
  wavesurfer.value?.pause()
}
function toggle(): void {
  if (wavesurfer.value?.isPlaying()) {
    pause()
  } else {
    play()
  }
}
function setRate(rate: number): void {
  playbackRate.value = rate
  wavesurfer.value?.setPlaybackRate(rate)
}
function stop(): void {
  wavesurfer.value?.stop()
}

function isPlaying(): boolean {
  return wavesurfer.value?.isPlaying() ?? false
}

defineExpose({ play, pause, toggle, setRate, stop, isPlaying })

function cycleRate(): void {
  const list = props.rates && props.rates.length > 0 ? props.rates : [1, 1.5, 2]
  const currentIndex = list.findIndex(r => Math.abs(r - playbackRate.value) < 0.0001)
  const next = list[(currentIndex + 1) % list.length]
  setRate(next)
  emit("rate-change", next)
}

watch(
  () => props.source,
  () => {
    createWaveSurfer()
  },
  { immediate: true },
)

onBeforeUnmount(() => {
  destroyWaveSurfer()
})
</script>

<style scoped>
.voice-message {
  user-select: none;
}
.waveform {
  height: 80px;
}
</style>
