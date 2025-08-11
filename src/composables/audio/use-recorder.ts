import { ref, computed } from "vue"
import { useToast } from "../core/use-toast"

export interface UseAudioRecorderOptions {
  maxDurationMs?: number
  silenceThreshold?: number
  minDurationMs?: number
}

export interface AudioRecorderResult {
  blob: Blob
  durationMs: number
}

export function useAudioRecorder(options: UseAudioRecorderOptions = {}) {
  const { maxDurationMs = 30000, silenceThreshold = 0.01, minDurationMs = 1000 } = options
  const toast = useToast()

  const isRecording = ref(false)
  const isPaused = ref(false)
  const error = ref<string | null>(null)
  const elapsedMs = ref(0)
  const permissionStatus = ref<"checking" | "granted" | "denied" | "prompt">("prompt")

  let mediaRecorder: MediaRecorder | null = null
  let audioStream: MediaStream | null = null
  let recordingInterval: number | null = null
  let startTime: number = 0
  let audioChunks: Blob[] = []
  let pauseStartTime: number = 0
  let totalPausedTime: number = 0

  const elapsedSeconds = computed(() => Math.floor(elapsedMs.value / 1000))
  const isMaxDurationReached = computed(() => elapsedMs.value >= maxDurationMs)
  const canStartRecording = computed(
    () => !isRecording.value && permissionStatus.value !== "denied",
  )

  function pause(): void {
    if (mediaRecorder && isRecording.value && !isPaused.value) {
      try {
        mediaRecorder.pause()

        if (recordingInterval) {
          clearInterval(recordingInterval)
          recordingInterval = null
        }

        pauseStartTime = Date.now()
        isPaused.value = true
        toast.audioPaused()
      } catch (err) {
        error.value = "Error al pausar la grabación"
        toast.audioPauseFailed()
      }
    }
  }

  function resume(): void {
    if (mediaRecorder && isRecording.value && isPaused.value) {
      try {
        mediaRecorder.resume()

        const currentPauseTime = Date.now() - pauseStartTime
        totalPausedTime += currentPauseTime

        recordingInterval = window.setInterval(() => {
          elapsedMs.value = Date.now() - startTime - totalPausedTime
          if (elapsedMs.value >= maxDurationMs) {
            stop()
          }
        }, 100)

        isPaused.value = false
        toast.audioResumed()
      } catch (err) {
        error.value = "Error al reanudar la grabación"
        toast.audioResumeFailed()
      }
    }
  }

  async function start(): Promise<boolean> {
    try {
      permissionStatus.value = "checking"
      error.value = null

      elapsedMs.value = 0
      startTime = Date.now()
      totalPausedTime = 0

      audioStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      permissionStatus.value = "granted"
      error.value = null

      const options = {
        mimeType: "audio/webm;codecs=opus",
        audioBitsPerSecond: 128000,
      }

      if (!MediaRecorder.isTypeSupported(options.mimeType)) {
        options.mimeType = "audio/webm"
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options.mimeType = "audio/mp4"
        }
      }

      mediaRecorder = new MediaRecorder(audioStream, options)

      mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }

      mediaRecorder.start(100)
      isRecording.value = true
      isPaused.value = false

      recordingInterval = window.setInterval(() => {
        elapsedMs.value = Date.now() - startTime - totalPausedTime
        if (elapsedMs.value >= maxDurationMs) {
          stop()
        }
      }, 100)

      toast.audioRecordingStarted()

      return true
    } catch (err) {
      if (err instanceof DOMException && err.name === "NotAllowedError") {
        permissionStatus.value = "denied"
        error.value = "Permiso de micrófono denegado"
        toast.audioPermissionDenied()
      } else {
        permissionStatus.value = "prompt"
        error.value = "Error al iniciar la grabación"
        toast.audioRecordingFailed()
      }

      return false
    }
  }

  async function stop(): Promise<AudioRecorderResult | null> {
    try {
      if (!mediaRecorder || !isRecording.value) {
        return null
      }

      mediaRecorder.stop()
      isRecording.value = false

      if (recordingInterval) {
        clearInterval(recordingInterval)
        recordingInterval = null
      }

      toast.audioRecordingStopped()

      return new Promise(resolve => {
        if (!mediaRecorder) {
          resolve(null)
          return
        }

        const originalOnStop = mediaRecorder.onstop
        mediaRecorder.onstop = async () => {
          try {
            let finalChunks = [...audioChunks]
            let finalDuration = elapsedMs.value + totalPausedTime

            if (finalChunks.length > 0) {
              const isValidAudio = await validateAudioContent(finalChunks)

              if (!isValidAudio) {
                error.value = "El audio está en silencio. Intenta grabar de nuevo."
                toast.audioSilent()
                resolve(null)
                return
              }

              if (finalDuration < minDurationMs) {
                error.value = `El audio es demasiado corto. Debe tener al menos ${minDurationMs / 1000} segundos.`
                toast.audioTooShort()
                resolve(null)
                return
              }

              const result: AudioRecorderResult = {
                blob: new Blob(finalChunks, {
                  type: mediaRecorder?.mimeType || "audio/webm;codecs=opus",
                }),
                durationMs: finalDuration,
              }

              resolve(result)
            } else {
              error.value = "No hay audio grabado para enviar"
              toast.audioEmpty()
              resolve(null)
            }
          } catch (err) {
            error.value = "Error al procesar el audio grabado"
            toast.audioProcessingError()
            resolve(null)
          } finally {
            if (mediaRecorder) {
              mediaRecorder.onstop = originalOnStop
            }
            cleanup()
          }
        }
      })
    } catch (err) {
      error.value = "Error al detener la grabación"
      toast.audioRecordingFailed()
      cleanup()
      return null
    }
  }

  async function validateAudioContent(audioChunks: Blob[]): Promise<boolean> {
    try {
      const audioBlob = new Blob(audioChunks, { type: "audio/webm" })
      const arrayBuffer = await audioBlob.arrayBuffer()

      const audioContext = new AudioContext()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

      const channelData = audioBuffer.getChannelData(0)
      const sampleRate = audioBuffer.sampleRate

      let sum = 0
      for (let i = 0; i < channelData.length; i++) {
        sum += channelData[i] * channelData[i]
      }
      const rms = Math.sqrt(sum / channelData.length)

      audioContext.close()

      return rms > silenceThreshold
    } catch (err) {
      return true
    }
  }

  function cleanup() {
    if (audioStream) {
      audioStream.getTracks().forEach(track => track.stop())
      audioStream = null
    }

    if (recordingInterval) {
      clearInterval(recordingInterval)
      recordingInterval = null
    }

    mediaRecorder = null
    elapsedMs.value = 0
    audioChunks = []

    pauseStartTime = 0
    totalPausedTime = 0
  }

  function cancel() {
    if (mediaRecorder && isRecording.value) {
      mediaRecorder.stop()
    }
    cleanup()
    isRecording.value = false
    error.value = null
    toast.audioCancelled()
  }

  function reset() {
    cleanup()
    isRecording.value = false
    error.value = null
    elapsedMs.value = 0
    permissionStatus.value = "prompt"
  }

  return {
    isRecording,
    isPaused,
    error,
    elapsedMs,
    elapsedSeconds,
    permissionStatus,
    isMaxDurationReached,
    canStartRecording,
    start,
    stop,
    pause,
    resume,
    cancel,
    reset,
  }
}
