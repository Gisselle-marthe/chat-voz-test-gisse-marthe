<template>
  <v-card class="mx-auto rounded-lg shadow-lg">
    <div class="p-4">
      <div class="flex gap-2">
        <v-avatar :color="color">
          <v-icon :icon="icon" color="deep-purple-darken-2"></v-icon>
        </v-avatar>
        <div>
          <p class="text-sm">{{ title }}</p>
          <span class="text-xl font-bold">{{ value }}</span>
        </div>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
defineProps({
  title: {
    type: String,
  },
  value: {
    type: String,
  },
  icon: {
    type: String,
  },
  color: {
    type: String,
  },
})
</script>
