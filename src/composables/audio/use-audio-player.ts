import { ref, computed } from "vue"

export interface AudioPlayerState {
  isPlaying: boolean
  currentTime: number
  duration: number
  playbackRate: number
  volume: number
}

export interface AudioPlayerControls {
  play: () => Promise<void>
  pause: () => void
  stop: () => void
  seek: (time: number) => void
  setPlaybackRate: (rate: number) => void
  setVolume: (volume: number) => void
}

export function useAudioPlayer(audioBlob: Blob | null) {
  const audio = ref<HTMLAudioElement | null>(null)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const playbackRate = ref(1)
  const volume = ref(1)
  const error = ref<string | null>(null)

  const progress = computed(() => {
    if (duration.value === 0) return 0
    return (currentTime.value / duration.value) * 100
  })

  const formattedCurrentTime = computed(() => {
    return formatTime(currentTime.value)
  })

  const formattedDuration = computed(() => {
    return formatTime(duration.value)
  })

  async function initializeAudio() {
    if (!audioBlob) return

    try {
      const audioUrl = URL.createObjectURL(audioBlob)

      audio.value = new Audio(audioUrl)

      audio.value.addEventListener("loadedmetadata", () => {
        duration.value = audio.value?.duration || 0
      })

      audio.value.addEventListener("timeupdate", () => {
        currentTime.value = audio.value?.currentTime || 0
      })

      audio.value.addEventListener("ended", () => {
        isPlaying.value = false
        currentTime.value = 0
      })

      audio.value.addEventListener("error", e => {
        error.value = "Error al cargar el audio"
      })

      if (audio.value) {
        audio.value.playbackRate = playbackRate.value
        audio.value.volume = volume.value
      }
    } catch (err) {
      error.value = "Error al inicializar el reproductor de audio"
    }
  }

  async function play() {
    if (!audio.value) {
      await initializeAudio()
    }

    try {
      if (audio.value) {
        await audio.value.play()
        isPlaying.value = true
        error.value = null
      }
    } catch (err) {
      error.value = "Error al reproducir el audio"
    }
  }

  function pause() {
    if (audio.value) {
      audio.value.pause()
      isPlaying.value = false
    }
  }

  function stop() {
    if (audio.value) {
      audio.value.pause()
      audio.value.currentTime = 0
      isPlaying.value = false
      currentTime.value = 0
    }
  }

  function seek(time: number) {
    if (audio.value) {
      audio.value.currentTime = Math.max(0, Math.min(time, duration.value))
      currentTime.value = audio.value.currentTime
    }
  }

  function setPlaybackRate(rate: number) {
    playbackRate.value = rate
    if (audio.value) {
      audio.value.playbackRate = rate
    }
  }

  function setVolume(vol: number) {
    volume.value = Math.max(0, Math.min(1, vol))
    if (audio.value) {
      audio.value.volume = volume.value
    }
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  function cleanup() {
    if (audio.value) {
      audio.value.pause()
      audio.value.src = ""
      URL.revokeObjectURL(audio.value.src)
      audio.value = null
    }
    isPlaying.value = false
    currentTime.value = 0
    duration.value = 0
    error.value = null
  }

  return {
    isPlaying,
    currentTime,
    duration,
    playbackRate,
    volume,
    error,

    progress,
    formattedCurrentTime,
    formattedDuration,

    play,
    pause,
    stop,
    seek,
    setPlaybackRate,
    setVolume,
    cleanup,
  }
}
