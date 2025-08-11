<template>
  <v-sheet class="voice-input-bar px-3 py-1 fixed w-full" rounded="0">
    <div class="d-flex flex-column align-center justify-center position-relative">
      <div class="main-controls">
        <button
          class="control-btn pause-btn"
          @click="togglePause"
          :class="{ paused: isPaused }"
          :disabled="!isRecording || isSending"
        >
          <v-icon size="28">{{ isPaused ? "mdi-play" : "mdi-pause" }}</v-icon>
        </button>

        <div class="assistant-avatar" :class="{ recording: isRecording, sending: isSending }">
          <div class="container" @click="toggleRecording">
            <span></span>
            <span></span>
            <span></span>
            <span></span>

            <div class="microphone-center">
              <v-icon size="30">
                {{ isRecording ? "mdi-send" : "mdi-microphone" }}
              </v-icon>
            </div>
          </div>
        </div>

        <button
          class="control-btn delete-btn"
          @click="cancelRecording"
          :disabled="!isRecording || isSending"
        >
          <v-icon size="28">mdi-delete</v-icon>
        </button>
      </div>
    </div>
  </v-sheet>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue"

import { useAudioRecorder } from "@/composables/audio/use-recorder"
import { useToast } from "@/composables/core/use-toast"
import { useChat } from "@/composables/chat/use-chat"

const { sendMessage } = useChat()
const toast = useToast()

const {
  isRecording,
  isPaused,
  error: recorderError,
  elapsedMs,
  permissionStatus,
  start: startRecording,
  stop: stopRecording,
  pause: pauseRecording,
  resume: resumeRecording,
  cancel: cancelRecording,
  reset: resetRecorder,
} = useAudioRecorder({
  maxDurationMs: 30000,
  silenceThreshold: 0.01,
  minDurationMs: 1000,
})

const audioBlob = ref<Blob | null>(null)
const isSending = ref(false)

async function toggleRecording() {
  if (isRecording.value) {
    if (isPaused.value) {
      await sendPausedAudio()
    } else {
      const result = await stopRecording()
      if (result) {
        audioBlob.value = result.blob

        isSending.value = true
        await handleSendMessage()
        isSending.value = false
      }
    }
  } else {
    await startRecording()
  }
}

async function togglePause() {
  if (isRecording.value) {
    if (isPaused.value) {
      await resumeRecording()
    } else {
      pauseRecording()
    }
  }
}

async function sendPausedAudio() {
  try {
    const result = await stopRecording()

    if (result && result.blob) {
      audioBlob.value = result.blob

      isSending.value = true
      await handleSendMessage()
      isSending.value = false
    }
  } catch (error) {}
}

async function handleSendMessage() {
  if (audioBlob.value) {
    try {
      const audioContext = new AudioContext()
      const arrayBuffer = await audioBlob.value.arrayBuffer()
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)
      const realDuration = audioBuffer.duration

      if (realDuration < 0.5) {
        toast.audioTooShort()
        return
      }

      const channelData = audioBuffer.getChannelData(0)
      let sum = 0
      for (let i = 0; i < channelData.length; i++) {
        sum += channelData[i] * channelData[i]
      }
      const rms = Math.sqrt(sum / channelData.length)

      if (rms < 0.01) {
        toast.audioSilent()
        return
      }

      audioContext.close()

      const success = await sendMessage("", audioBlob.value, realDuration)

      if (success) {
        toast.audioSentSuccessfully()
        audioBlob.value = null
      } else {
        toast.audioSendFailed()
      }
    } catch (error) {
      toast.audioSendFailed()
    }
  } else {
    toast.audioEmpty()
  }
}

onBeforeUnmount(() => {
  resetRecorder()
})
</script>

<style scoped>
.voice-input-bar {
  position: sticky;

  bottom: 0;
  z-index: 2;
  background: #f5f5f51f;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.assistant-avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 100%;
}

.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  height: 80px;
  width: 80px;
  background-color: #9b59b6;
  background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
  transition: all 0.3s ease;
  animation: idle-float 4s ease-in-out infinite;
  cursor: pointer;
}

.container span {
  position: absolute;
  border-radius: 50%;
  height: 100%;
  width: 100%;
  background-color: #9b59b6;
  background-image: linear-gradient(#9b59b6, #84cdfa, #5ad1cd);
}

.container span:nth-of-type(1) {
  filter: blur(5px);
}

.container span:nth-of-type(2) {
  filter: blur(10px);
}

.container span:nth-of-type(3) {
  filter: blur(25px);
}

.container span:nth-of-type(4) {
  filter: blur(50px);
}

.container::after {
  content: "";
  position: absolute;
  top: 10px;
  left: 10px;
  right: 10px;
  bottom: 10px;
  background-color: #ffffffc6;
  border: solid 5px #ffffff1d;
  border-radius: 50%;
}

.microphone-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  background-color: rgba(255, 255, 255, 0.17);
  border-radius: 50%;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
}

.microphone-center:hover {
  background-color: rgba(255, 255, 255, 0.114);
  transform: translate(-50%, -50%) scale(1.1);
}

.assistant-avatar.recording .microphone-center {
  background-color: rgba(255, 255, 255, 0.096);
  transform: translate(-50%, -50%) scale(1.05);
}

@keyframes rotate_3922 {
  from {
    transform: translate(-50%, -50%) rotate(0deg);
  }

  to {
    transform: translate(-50%, -50%) rotate(360deg);
  }
}

.assistant-avatar.recording .container {
  animation:
    rotate_3922 0.8s linear infinite,
    recording-pulse 2s ease-in-out infinite;
  background-image: linear-gradient(#ff6b6b, #ff8e53, #ffb347);
  box-shadow:
    0px -8px 25px 0px rgba(255, 107, 107, 0.6),
    0px 8px 25px 0px rgba(255, 142, 83, 0.6);
  transform: translate(-50%, -50%) translateY(0) scale(1);
}

.assistant-avatar.recording .container span {
  filter: blur(8px), blur(15px), blur(30px), blur(60px);
  background-image: linear-gradient(#ff6b6b, #ff8e53, #ffb347);
}

.assistant-avatar.sending .container {
  animation:
    rotate_3922 1.5s linear infinite,
    sending-pulse 1.5s ease-in-out infinite;
  background-image: linear-gradient(#4facfe, #00f2fe, #43e97b);
  box-shadow:
    0px -8px 25px 0px rgba(79, 172, 254, 0.6),
    0px 8px 25px 0px rgba(0, 242, 254, 0.6);
  transform: translate(-50%, -50%) translateY(0) scale(1);
}

.assistant-avatar.sending .container span {
  filter: blur(8px), blur(15px), blur(30px), blur(60px);
  background-image: linear-gradient(#4facfe, #00f2fe, #43e97b);
}

@keyframes recording-pulse {
  0%,
  100% {
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) scale(1.1);
  }
}

@keyframes sending-pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes idle-float {
  0%,
  100% {
    transform: translate(-50%, -50%) translateY(0) scale(1);
  }
  50% {
    transform: translate(-50%, -50%) translateY(-5px) scale(1.02);
  }
}

@keyframes recording-blink {
  0%,
  50% {
    opacity: 1;
  }
  51%,
  100% {
    opacity: 0.3;
  }
}

.main-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 30px;
}

.control-buttons {
  display: flex;
  justify-content: center;
  gap: 120px;
  margin: 15px 0;
}

.control-btn {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.control-btn:hover:not(:disabled) {
  transform: scale(1.05);
}

.control-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.pause-btn {
  color: #ffa726;
}

.pause-btn:hover:not(:disabled) {
  color: #ff9800;
}

.pause-btn.paused {
  color: #4caf50;
}

.pause-btn.paused:hover:not(:disabled) {
  color: #45a049;
}

.delete-btn {
  color: #f44336;
}

.delete-btn:hover:not(:disabled) {
  color: #d32f2f;
}
</style>
