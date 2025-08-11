<template>
  <div
    ref="listRef"
    class="message-list"
    @mousemove="onMouseMove"
    @mouseleave="onListLeave"
  >
    <action-toolbar
      :visible="toolbarVisible"
      :anchor="toolbarAnchor"
      @help="onHelp"
      @info="onInfo"
      @enter="onToolbarEnter"
      @leave="onToolbarLeave"
    />
    <div class="messages-container mx-auto flex-column gap-6">
      <template v-if="messages.length > 0">
        <voice-chat-bubble v-for="message in messages" :key="message.id" :message="message" />
      </template>

      <div v-else class="text-medium-emphasis text-center mt-8">
        No hay mensajes aún. ¡Graba tu primer mensaje de voz!
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, nextTick } from "vue"
import VoiceChatBubble from "./voice-chat-bubble.vue"
import ActionToolbar from "./action-toolbar.vue"
import { useChat } from "@/composables/chat/use-chat"

const { messages } = useChat()

const toolbarVisible = ref(false)
const toolbarAnchor = ref<DOMRect | null>(null)
let insideToolbar = false
const listRef = ref<HTMLElement | null>(null)

function onMouseMove(e: MouseEvent) {
  const target = (e.target as HTMLElement)?.closest(".bubble-card") as HTMLElement | null
  if (target) {
    toolbarAnchor.value = target.getBoundingClientRect()
    toolbarVisible.value = true
  } else {
    if (!insideToolbar) toolbarVisible.value = false
  }
}

function onToolbarEnter() {
  insideToolbar = true
}

function onToolbarLeave() {
  insideToolbar = false
  toolbarVisible.value = false
}

function onListLeave() {
  if (!insideToolbar) toolbarVisible.value = false
}

function onHelp() {}

function onInfo() {}

function formatTimestamp(timestamp: Date): string {
  return timestamp.toLocaleTimeString([], { hour: "numeric", minute: "numeric" })
}

function scrollToBottom() {
  if (listRef.value) {
    listRef.value.scrollTop = listRef.value.scrollHeight
  }
}

function scrollToBottomSmooth() {
  if (listRef.value) {
    listRef.value.scrollTo({
      top: listRef.value.scrollHeight,
      behavior: "smooth",
    })
  }
}

// Auto-scroll cuando se agregan nuevos mensajes
watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    scrollToBottomSmooth()
  },
)

// Auto-scroll cuando cambia el contenido de los mensajes
watch(
  () => messages.value,
  async () => {
    await nextTick()
    scrollToBottomSmooth()
  },
  { deep: true },
)

onMounted(() => {
  nextTick(() => {
    scrollToBottom()
  })
})
</script>

<style scoped>
.message-list {
  height: calc(100vh - 200px);
  width: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 16px;
  box-sizing: border-box;
  scroll-behavior: smooth;
}

.messages-container {
  max-width: 1024px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 90px 0 150px 0;
}
</style>
