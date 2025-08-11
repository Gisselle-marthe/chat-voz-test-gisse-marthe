<template>
  <div class="voice-wave d-flex items-center justify-between gap-1 min-w-0 mt-6">
    <div ref="el" class="flex-1 min-w-0" :style="{ height: `${heightPx}px` }" />
    <div class="rate-wrapper d-flex justify-center align-center">
      <v-chip
        v-if="showRateChip"
        size="small"
        variant="outlined"
        class="select-none cursor-pointer"
        @click="cycleRate"
        :title="`Velocidad: x${playbackRate.toFixed(1)} (clic para cambiar)`"
      >
        x {{ playbackRate.toFixed(1) }}
      </v-chip>
    </div>
  </div>
  <div v-if="showDuration" class="text-caption mt-2">{{ durationLabel }}</div>
</template>

<script setup lang="ts">
import { toRef } from "vue"
import { useVoiceWave } from "@/composables/audio/use-voice-wave"

type Props = {
  source: Blob | ArrayBuffer | string
  initialRate?: number
  heightPx?: number
  barWidth?: number
  barGap?: number
  showDuration?: boolean
  showRateChip?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialRate: 1,
  heightPx: 64,
  barWidth: 2,
  barGap: 1,
  showDuration: true,
  showRateChip: true,
})

const initialRateRef = toRef(props, "initialRate")
const heightPxRef = toRef(props, "heightPx")
const barWidthRef = toRef(props, "barWidth")
const barGapRef = toRef(props, "barGap")
const sourceRef = toRef(props, "source")

const emit = defineEmits<{ (e: "play"): void; (e: "pause"): void; (e: "finish"): void }>()

const {
  isReady,
  durationLabel,
  playbackRate,
  play,
  pause,
  toggle,
  setRate,
  stop,
  isPlaying,
  waveformEl: el,
} = useVoiceWave({
  source: sourceRef,
  heightPx: heightPxRef,
  barWidth: barWidthRef,
  barGap: barGapRef,
  initialRate: initialRateRef,
  onPlay: () => emit("play"),
  onPause: () => emit("pause"),
  onFinish: () => emit("finish"),
})

function cycleRate(): void {
  const rates = [1, 1.5, 2]
  const currentIndex = rates.findIndex(r => Math.abs(r - playbackRate.value) < 0.0001)
  const next = rates[(currentIndex + 1) % rates.length]
  setRate(next)
}

defineExpose({ play, pause, toggle, setRate, stop, isPlaying, isReady })
</script>

<style scoped>
.voice-wave {
  user-select: none;
}

.rate-wrapper {
  min-width: 56px;
  display: flex;
  justify-content: center;
}
</style>
