<template>
  <div :class="wrapperClasses" class="px-4 py-0 bubble-wrapper">
    <div :class="[isOwn && 'rotate-icon']">
      <div
        v-if="isOwn"
        class="cursor-pointer"
        @click="toggleTranscript"
        :title="showTranscript ? 'Ver onda' : 'Ver transcripción'"
      >
        <AudioIcon v-if="showTranscript" :size="28" />
        <ChatIcon v-else :size="28" />
      </div>

      <div
        v-else-if="!isSystem"
        class="cursor-pointer"
        @click="toggleTranscript"
        :title="showTranscript ? 'Ver onda' : 'Ver transcripción'"
      >
        <AudioIcon v-if="showTranscript" :size="28" />
        <ChatIcon v-else :size="28" />
      </div>
    </div>

    <div
      :class="[bubbleClasses, showTranscript ? 'text-mode' : 'audio-mode']"
      class="position-relative max-w-50 w-fit"
      @mouseenter="onMouseEnter"
      @mouseleave="hovered = false"
    >
      <div :class="['accent', isOwn ? 'accent-right' : 'accent-left']" />
      <div :class="['accent-fade', isOwn ? 'fade-right' : 'fade-left']" />

      <action-toolbar :visible="hovered" :anchor="anchor" @help="onHelp" @info="onInfo" />

      <div
        :class="['content d-flex items-center gap-3 min-w-0', showTranscript ? 'text-mode' : '']"
      >
        <template v-if="!showTranscript && hasValidAudio && !isSystem">
          <v-btn
            class="play-btn"
            icon
            @click="togglePlay"
            :aria-label="isPlaying ? 'Pausar' : 'Reproducir'"
          >
            <v-icon size="24">{{ isPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
          </v-btn>

          <div class="flex-1 min-w-0">
            <voice-wave
              ref="internalRef"
              :source="props.message.audioBlob"
              :initial-rate="1"
              :height-px="24"
              :bar-width="1"
              :bar-gap="1"
              :show-duration="true"
              @play="onPlay"
              @pause="onPause"
              @finish="onFinish"
              @ready="onReady"
            />
          </div>
        </template>

        <template v-else>
          <div class="transcript-box flex-1 min-w-0">
            <div
              v-if="isGenerating && !isSystem"
              class="transcript-loading d-flex align-center gap-2"
            >
              <v-progress-circular indeterminate size="20" color="primary" />
              <span class="text-body-2">{{ loadingText }}</span>
            </div>

            <div v-else-if="isSystem" class="transcript-text system-message">
              {{ transcriptText || "Mensaje del sistema" }}
            </div>

            <div v-else-if="transcriptText && transcriptText.trim() !== ''" class="transcript-text">
              {{ transcriptText }}
            </div>

            <div v-else-if="!hasValidAudio" class="text-message">Mensaje de texto</div>

            <div v-else class="transcript-text">
              Haz click en el icono de chat para generar transcripción
            </div>
          </div>
        </template>
      </div>

      <div class="timestamp text-caption text-medium-emphasis">
        {{ formatTimestamp(props.message.timestamp) }}
      </div>
    </div>

    <div>
      <div v-if="isSystem" class="side-avatar left">
        <v-avatar size="56" class="system-avatar">
          <v-icon color="white">mdi-robot</v-icon>
        </v-avatar>
        <div class="sender-name">{{ message.user.nickname || "Sistema" }}</div>
      </div>

      <div v-else-if="isOther" class="side-avatar left">
        <v-avatar size="56" :style="{ backgroundImage: `url(${avatarUrl})` }">
          <!-- <v-icon color="white">mdi-account</v-icon> -->
        </v-avatar>
        <div class="sender-name">{{ message.user.nickname || "Usuario" }}</div>
      </div>

      <div v-else class="side-avatar right">
        <v-avatar size="56" :style="{ backgroundImage: `url(${avatarUrl})` }">
          <!-- <v-icon color="white">mdi-account</v-icon> -->
        </v-avatar>
        <div class="sender-name">
          {{ message.user.nickname || "Tú" }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue"
import VoiceWave from "@/components/composite/voice-wave.vue"
import ActionToolbar from "@/views/chat/components/action-toolbar.vue"
import ChatIcon from "@/components/ui/ChatIcon.vue"
import AudioIcon from "@/components/ui/AudioIcon.vue"
import type { ChatMessage } from "@/domain/entities/chat"
import { UserType } from "@/domain/entities/user"
import { useAuth } from "@/composables/auth/use-auth"
import { useAvatar } from "@/composables/chat/use-avatar"
import { useAudioRecorder } from "@/composables/audio/use-recorder"

type Props = {
  message: ChatMessage
  showActions?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showActions: true,
})

defineEmits<{ (e: "rate-change", rate: number): void }>()

const { user } = useAuth()

const internalRef = ref<InstanceType<typeof VoiceWave> | null>(null)
const isPlaying = ref(false)
const waveformReady = ref(false)
const hovered = ref(false)
const anchor = ref<DOMRect | null>(null)
const isGenerating = ref(false)
const loadingText = ref("Generando transcripción...")

const isSystem = computed(() => props.message.user?.userType === UserType.SYSTEM)
const isOwn = computed(() => props.message.user?.id === user.value?.id)
const isOther = computed(
  () =>
    props.message?.user.id !== user.value?.id && props.message.user?.userType !== UserType.SYSTEM,
)

const hasValidAudio = computed(() => {
  if (!props.message.audioBlob) return false

  if (props.message.audioBlob instanceof Blob) {
    return props.message.audioBlob.size > 0 && props.message.audioBlob.type.startsWith("audio/")
  }

  if (props.message.audioBlob instanceof ArrayBuffer) {
    return props.message.audioBlob.byteLength > 0
  }

  if (typeof props.message.audioBlob === "string") {
    return props.message.audioBlob.length > 0
  }

  return false
})

const shouldShowTranscriptByDefault = computed(() => {
  return !hasValidAudio.value || isSystem.value
})

const showTranscript = ref(shouldShowTranscriptByDefault.value)

const chatToggleIcon = computed(() => {
  if (!hasValidAudio.value) {
    return "mdi-message-outline"
  }
  return showTranscript.value ? "mdi-volume-high" : "mdi-message-outline"
})

const wrapperClasses = computed(() => {
  return [
    "d-flex",
    isOwn.value ? "justify-end" : "justify-start",
    (isSystem.value || isOther.value) && "flex-row-reverse justify-end",
  ]
})

const bubbleClasses = computed(() => [
  "pa-2 mx-3 rounded-xl bubble-card",
  isOwn.value ? "own-bubble" : isSystem.value ? "system-bubble" : "sender-bubble",
])

const { avatarUrl } = useAvatar(ref(props.message.user))
const {
  isRecording,
  isPaused,
  error: recorderError,
  elapsedMs,
  permissionStatus,
  start: startRecording,
  stop: stopRecording,
} = useAudioRecorder()

function togglePlay() {
  if (internalRef.value) {
    internalRef.value.toggle()
    isPlaying.value = internalRef.value.isPlaying()
  }
}
function onPlay() {
  isPlaying.value = true
}
function onPause() {
  isPlaying.value = false
}
function onFinish() {
  isPlaying.value = false
}
function onReady() {
  waveformReady.value = true
}

watch(
  internalRef,
  newRef => {
    if (newRef) {
      isPlaying.value = newRef.isPlaying()
    }
  },
  { immediate: true },
)

function toggleTranscript() {
  if (isSystem.value) return

  if (!hasValidAudio.value) {
    showTranscript.value = !showTranscript.value
    return
  }

  showTranscript.value = !showTranscript.value
  if (showTranscript.value) {
    internalRef.value?.stop()
    isPlaying.value = false
    if (!transcriptText.value) {
      simulateTranscription()
    }
  }
}
const transcriptText = ref(props.message.transcript ?? "")

watch(
  () => props.message.transcript,
  val => {
    transcriptText.value = val ?? ""
  },
)

async function simulateTranscription() {
  isGenerating.value = true

  const duration = Math.floor(props.message.duration || 0)

  await new Promise(resolve => setTimeout(resolve, 1200))

  const simulatedTexts = [
    `Transcripción simulada para un mensaje de audio de ${duration} segundos. Este es un texto de ejemplo que simula la transcripción de un mensaje de voz.`,
  ]

  const finalText = simulatedTexts[Math.floor(Math.random() * simulatedTexts.length)]

  transcriptText.value = finalText

  try {
    props.message.transcript = finalText
  } catch {}

  isGenerating.value = false
}

function onMouseEnter(event: MouseEvent) {
  hovered.value = true
  const target = event.currentTarget as HTMLElement
  if (target) {
    anchor.value = target.getBoundingClientRect()
  }
}

function onHelp() {}
function onInfo() {}

function formatTimestamp(timestamp: Date): string {
  return timestamp.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
}
</script>

<style scoped>
.content-bubble {
  width: 330px;
}

.bubble-wrapper {
  display: flex;
  align-items: center;
}
.side-avatar {
  top: 50%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.side-avatar.left {
  left: calc(var(--wrapper-px) - 80px);
}
.side-avatar.right {
  right: calc(var(--wrapper-px) - 80px);
}

.system-avatar {
  background: linear-gradient(180deg, #333333, #000000);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.4);
}

.sender-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: #666;
  text-align: center;
  white-space: nowrap;
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 24px;
  position: relative;
  margin-top: 8px;
}

.side-chat {
  top: 50%;
  opacity: 0.9;
  z-index: 2;
}

.side-chat.left {
  left: calc(var(--wrapper-px) - 48px);
}

.side-chat.right {
  right: calc(var(--wrapper-px) - 48px);
}

.bubble-card {
  background: white;
  border: 1px solid rgba(112, 45, 255, 0.35);
  box-shadow: 0 10px 24px rgba(112, 45, 255, 0.18);
  width: 330px !important;
  overflow: hidden;

  --card-radius: 12px;
  --inset-x: 0px;
  --inset-y: 0px;
  --accent-w: 10px;
  --fade-w: 18px;
}
.text-mode {
  width: min(100%, 700px);
}
.audio-mode {
  width: min(100%, 280px);
}
.content {
  padding-left: calc(var(--inset-x) + var(--accent-w) + var(--fade-w) - 14px);
  padding-right: calc(var(--inset-x) + var(--accent-w) + var(--fade-w) + 12px);
  padding-top: 2px;
  padding-bottom: 2px;
  position: relative;
  z-index: 1;
}
.content.text-mode {
  padding-right: 84px;
}
.own-bubble {
  border-color: rgba(33, 150, 243, 0.35);
  box-shadow: 0 10px 24px rgba(33, 150, 243, 0.18);
}

.system-bubble {
  border-color: rgba(0, 0, 0, 0.6);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.15);
  background: #f8f9fa;
}

.accent {
  position: absolute;
  top: var(--inset-y);
  bottom: var(--inset-y);
  width: var(--accent-w);
  border-radius: calc(var(--accent-w) / 2);
  box-shadow: 0 12px 20px rgba(106, 50, 255, 0.22);
  z-index: 0;
  pointer-events: none;
}
.accent-left {
  left: var(--inset-x);
  background: linear-gradient(
    180deg,
    var(--accent-purple-start, #b085ff) 0%,
    var(--accent-purple-end, #6a32ff) 100%
  );
}
.accent-right {
  right: var(--inset-x);
  background: linear-gradient(
    180deg,
    var(--accent-blue-start, #8ec5ff) 0%,
    var(--accent-blue-end, #2da2ff) 100%
  );
}
.accent-fade {
  position: absolute;
  top: var(--inset-y);
  bottom: var(--inset-y);
  width: var(--fade-w);
  pointer-events: none;
  z-index: 0;
}
.fade-left {
  left: calc(var(--inset-x) + var(--accent-w));
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0));
}
.fade-right {
  right: calc(var(--inset-x) + var(--accent-w));
  background: linear-gradient(-90deg, rgba(255, 255, 255, 0.96), rgba(255, 255, 255, 0));
}
.actions {
  position: absolute;
  right: calc(var(--inset-x) + var(--accent-w) + var(--fade-w) + 8px);
  top: 10px;
  color: #2e3a46;
  opacity: 0.9;
  z-index: 3;
}
.action-chip {
  background: white;
  border-color: rgba(46, 58, 70, 0.3);
  height: 28px;
  width: 28px;
}
.play-btn {
  height: 32px;
  width: 32px;
  border-radius: 9999px;
  background: #f2f3f7;
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}
.timestamp {
  position: absolute;
  right: 48px;
  bottom: 10px;
}

.transcript-box {
  padding: 8px 12px;
  border-radius: 8px;
  min-height: 24px;
  display: flex;
  align-items: center;
}

.transcript-text {
  color: #2e3a46;
  font-size: 14px;
  line-height: 1.4;
}

.system-message {
  color: #1a1a1a;
  font-weight: 500;
  font-size: 15px;
}

.text-message {
  color: #666;
  font-style: italic;
  font-size: 14px;
  line-height: 1.4;
}

.system-bubble .accent {
  background: linear-gradient(180deg, #333333, #000000);
}

.side-avatar.left v-avatar,
.side-avatar.right v-avatar {
  background-size: cover;
  background-position: center;
}
</style>
