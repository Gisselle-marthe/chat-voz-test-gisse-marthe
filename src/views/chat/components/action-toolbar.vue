<template>
  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="visible && anchor"
        class="action-toolbar d-flex align-center px-2 py-1"
        :style="toolbarStyle"
        @mouseenter="onEnter"
        @mouseleave="onLeave"
      >
        <v-btn icon variant="text" class="me-1" @click="$emit('help')" density="comfortable">
          <v-icon size="18">mdi-help-circle-outline</v-icon>
        </v-btn>
        <v-btn icon variant="text" @click="$emit('info')" density="comfortable">
          <v-icon size="18">mdi-alert-circle-outline</v-icon>
        </v-btn>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed } from "vue"

type Props = {
  visible: boolean
  anchor: DOMRect | null
}

const props = defineProps<Props>()
const toolbarWidth = 120
const offset = 10

const toolbarStyle = computed(() => {
  if (!props.anchor) return {}
  const top = window.scrollY + props.anchor.top - 40
  const left = window.scrollX + props.anchor.left + props.anchor.width - toolbarWidth - 8
  return {
    position: "absolute" as const,
    top: `${top}px`,
    left: `${left}px`,
    width: `${toolbarWidth}px`,
  }
})

const emit = defineEmits<{
  (e: "help"): void
  (e: "info"): void
  (e: "enter"): void
  (e: "leave"): void
}>()

function onEnter() {
  emit("enter")
}
function onLeave() {
  emit("leave")
}
</script>

<style scoped>
.action-toolbar {
  border-radius: 999px;
  background: rgba(223, 228, 245, 0);
  box-shadow: 0 6px 18px rgba(153, 135, 252, 0.233);
  backdrop-filter: blur(15px);
  z-index: 1000;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
