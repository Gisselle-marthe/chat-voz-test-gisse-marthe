<template>
  <v-card color="primary" class="w-100 rounded-2xl p-6 shadow-xl">
    <div class="flex justify-between">
      <div class="flex">
        <v-avatar class="ma-3" size="150">
          <v-img :src="avatarSrc" alt="Avatar aleatorio" />
        </v-avatar>
        <div>
          <h1>Gisselle Marthe M</h1>
          <div class="flex ">
            <v-chip class="ma-2 bg-grey-lighten-3" prepend-icon="mdi-crown"> A1 level </v-chip>
            <v-chip class="ma-2 bg-grey-lighten-3" prepend-icon="mdi-clock"> 15 Min </v-chip>
            <v-chip class="ma-2 bg-grey-lighten-3" prepend-icon="mdi-calendar"> 11/08/25 </v-chip>
          </div>
          <h2>Preparing for a Startup Interview</h2>
          <v-progress-linear
            color="progress"
            bg-color="progressTrack"
            :model-value="70"
            rounded
            :height="7"
            v-tooltip="'70% completed'"
          />
        </div>
      </div>
      <div class="flex flex-column justify-between items-center">
        <reward :value="200" :max-value="500" />
        <v-btn color="secondary" size="large" rounded>
          SEND FEEDBACK
          <template #append>
            <v-icon icon="mdi-send"></v-icon>
          </template>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>
<script lang="ts" setup>
import { useAvatar } from "@/composables/chat/use-avatar"
import Reward from "./reward.vue"
const { getPersistentAvatar } = useAvatar()
const avatarSrc = getPersistentAvatar("Gisselle Marthe")
</script>
<style scope></style>
