<template>
  <!-- <v-main style="height: 100vh"> -->
  <v-main>
    <div class="flex flex-column w-full">
      <chat-header />
      <chat-messages />
      <voice-input-bar />
    </div>
  </v-main>
</template>

<script setup lang="ts">
import ChatHeader from "./components/chat-header.vue"
import ChatMessages from "./components/chat-messages.vue"
import VoiceInputBar from "./components/voice-input-bar.vue"
</script>

<style scoped></style>
