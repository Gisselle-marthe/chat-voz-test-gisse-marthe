<template>
  <v-layout>
    <drawer />
    <RouterView />
  </v-layout>
</template>

<script setup lang="ts">
import Drawer from "@/components/composite/drawer.vue"
</script>

<style scoped></style>
