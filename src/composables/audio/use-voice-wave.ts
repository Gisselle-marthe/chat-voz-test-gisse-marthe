import { computed, onBeforeUnmount, onMounted, ref, watch, type Ref } from "vue"
import WaveSurfer, { type WaveSurferOptions } from "wavesurfer.js"

export type VoiceWaveSource = Blob | ArrayBuffer | string

export type UseVoiceWaveParams = {
  source: Ref<VoiceWaveSource>
  heightPx: Ref<number>
  barWidth: Ref<number>
  barGap: Ref<number>
  initialRate: Ref<number>
  onReady?: (durationSeconds: number) => void
  onPlay?: () => void
  onPause?: () => void
  onFinish?: () => void
}

export function useVoiceWave(params: UseVoiceWaveParams) {
  const waveformEl = ref<HTMLElement | null>(null)
  const wavesurfer = ref<WaveSurfer | null>(null)
  const isReady = ref(false)
  const durationSec = ref(0)
  const playbackRate = ref(params.initialRate.value)

  const durationLabel = computed(() => {
    const minutes = Math.floor(durationSec.value / 60)
    const seconds = Math.floor(durationSec.value % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  })

  async function toAudioUrl(input: VoiceWaveSource): Promise<string> {
    if (typeof input === "string") return input
    if (input instanceof Blob) return URL.createObjectURL(input)
    const blob = new Blob([input], { type: "audio/webm" })
    return URL.createObjectURL(blob)
  }

  async function createWaveSurfer(): Promise<void> {
    if (!waveformEl.value) return
    destroyWaveSurfer()

    const options: WaveSurferOptions = {
      container: waveformEl.value,
      height: params.heightPx.value,
      waveColor: "#c9c9cf",
      progressColor: "#9c9caf",
      cursorColor: "transparent",
      barWidth: params.barWidth.value,
      barGap: params.barGap.value,
      barRadius: 2,
      normalize: true,
    }

    const instance = WaveSurfer.create(options)
    wavesurfer.value = instance

    instance.on("ready", () => {
      isReady.value = true
      durationSec.value = instance.getDuration()
      instance.setPlaybackRate(playbackRate.value)
      params.onReady?.(durationSec.value)
    })
    instance.on("decode", duration => {
      durationSec.value = duration
    })
    instance.on("destroy", () => {
      isReady.value = false
    })
    instance.on("play", () => params.onPlay?.())
    instance.on("pause", () => params.onPause?.())
    instance.on("finish", () => params.onFinish?.())

    const src = await toAudioUrl(params.source.value)
    await instance.load(src)
  }

  function destroyWaveSurfer(): void {
    if (wavesurfer.value) {
      wavesurfer.value.destroy()
      wavesurfer.value = null
    }
  }

  function play(): void {
    wavesurfer.value?.play()
  }
  function pause(): void {
    wavesurfer.value?.pause()
  }
  function toggle(): void {
    wavesurfer.value?.isPlaying() ? pause() : play()
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

  watch(
    () => [
      params.source.value,
      params.heightPx.value,
      params.barWidth.value,
      params.barGap.value,
      waveformEl.value,
    ],
    () => {
      createWaveSurfer()
    },
    { immediate: true },
  )

  onMounted(() => {
    if (!isReady.value) createWaveSurfer()
  })
  onBeforeUnmount(() => {
    destroyWaveSurfer()
  })

  return {
    waveformEl,
    isReady,
    durationSec,
    durationLabel,
    playbackRate,
    createWaveSurfer,
    destroyWaveSurfer,
    play,
    pause,
    toggle,
    setRate,
    stop,
    isPlaying,
  }
}
