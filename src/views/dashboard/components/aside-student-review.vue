<template>
  <v-navigation-drawer v-model="drawer" location="right" class="c-drawer--fixed" :width="320">
    <div class="flex flex-column px-3 bg-grey-lighten-4" style="height: 100%">
      <div class="flex flex-column justify-center items-center gap-6 mt-5">
        <v-progress-circular
          model-value="46"
          :rotate="310"
          :size="100"
          :width="10"
          color="primary"
          v-tooltip="'46% Progress to next level'"
        >
          <template v-slot:default>
            <v-img :src="avatarSrc" width="90" />
          </template>
        </v-progress-circular>
        <p class="font-semibold text-h5">Scenario Information</p>
        <p class="text-gray-600 text-sm">
          You are preparing for a startup interview, and I will act as the interviewer. I will ask
          you various questions related to your skills, experience, and views on entrepreneurship.
          Let's practice your responses and make sure you feel confident going into the interview.
        </p>
        <div class="w-full flex justify-around gap-2">
          <v-btn icon="mdi-bell-outline" variant="outlined" size="small"></v-btn>
          <v-btn icon="mdi-inbox-arrow-down-outline" variant="outlined" size="small"></v-btn>
          <v-btn icon="mdi-square-edit-outline" variant="outlined" size="small"></v-btn>
        </div>

        <v-card class="w-100 rounded-2xl p-3">
          <div class="flex justify-between items-center">
            <h3 class="text-md">Conversation Grading</h3>
            <v-btn icon="mdi-crown" variant="outlined" size="x-small"></v-btn>
          </div>
          <template v-for="item in listSkill" :key="item.name">
            <div class="flex flex-column justify-center gap-2 my-4">
              <span>{{ item.name }}</span>
              <v-progress-linear
                :color="item.color"
                :model-value="item.value"
                rounded
                :height="7"
                v-tooltip="`${item.value} score`"
              />
            </div>
          </template>
        </v-card>

        <div class="w-100">
          <h3 class="text-center">Notes &Feedback</h3>
          <v-card class="w-100 rounded-2xl p-3 my-4" variant="outlined">
            <div class="d-flex flex-column gap-4">
              <div class="d-flex align-center gap-2">
                <v-avatar size="44">
                  <v-img :src="avatarSrc" alt="Avatar de Gisselle Marthe" />
                </v-avatar>
                <h3 class="text-subtitle-1 font-medium mb-0">Gisselle Marthe</h3>
              </div>

              <div class="d-flex justify-space-between align-center">
                <p class="text-body-2 text-medium-emphasis mb-0 text-truncate">
                  I need some maintenac...
                </p>
                <v-icon icon="mdi-chevron-right" size="20" />
              </div>

              <span class="text-caption text-medium-emphasis text-end"> Jan 2, 12:31 PM </span>
            </div>
          </v-card>
        </div>
        <!-- <div class="w-100">
            <div class="flex justify-between items-center gap-5">
              <h3>Evaluation Settings</h3>
              <v-btn icon="mdi-plus" variant="outlined" size="x-small"></v-btn>
            </div>
            <v-card class="w-100 rounded-2xl p-3">
              <template v-for="item in listSetting" :key="item.name">
                <div class="flex flex-column justify-center gap-2">
                  <span>{{ item.name }}</span>
                  <v-chip v-if="item.isChip" class="w-fit">{{ item.value }}</v-chip>
                  <span v-else class="text-gray-600 text-sm">{{ item.value }}</span>
                </div>
                <v-divider class="my-2"></v-divider>
              </template>
            </v-card>
          </div> -->
      </div>
    </div>
  </v-navigation-drawer>
</template>
<script setup lang="ts">
import { useAvatar } from "@/composables/chat/use-avatar"
const { getPersistentAvatar } = useAvatar()
const avatarSrc = getPersistentAvatar("Gisselle Marthe")
const drawer = defineModel({
  type: Boolean,
  default: true,
})

const listSkill = [
  {
    name: "Speaking",
    value: 80,
    color: "#4361EE",
  },
  {
    name: "Reading ",
    value: 60,
    color: "#FFBDD3",
  },
  {
    name: "Gramat",
    value: 78,
    color: "#1A9945",
  },
  {
    name: "Vocabulary",
    value: 67,
    color: "#FEA922",
  },
  {
    name: "Vocabulary",
    value: 27,
    color: "#FA5922",
  },
]
</script>
<style scoped></style>
