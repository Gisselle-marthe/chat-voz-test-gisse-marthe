<template>
  <v-main>

    <v-container>
      <v-row>
        <v-col>
          <v-row class="my-10">
            <banner />
          </v-row>

          <v-row class="my-10">
            <template v-for="card in countCards" :key="card.title">
              <v-col>
                <card-count
                  :title="card.title"
                  :value="card.value"
                  :icon="card.icon"
                  :color="card.color"
                />
              </v-col>
            </template>
          </v-row>

          <v-row class="my-10">
            <ConversationPanel :height="430" />
          </v-row>

          <v-row class="my-10">
            <v-col cols="12" md="6">
              <practice-panel
                :words-practiced="wordsData"
                :phrases-practiced="phrasesData"
                section="words"
                title="Words Practiced"
              />
            </v-col>

            <v-col cols="12" md="6">
              <practice-panel
                :words-practiced="wordsData"
                :phrases-practiced="phrasesData"
                section="phrases"
                title="Phrases Practice"
              />
            </v-col>
          </v-row>

          <v-row class="my-10"> </v-row>
        </v-col>
      </v-row>
    </v-container>
    <aside-student-review />
  </v-main>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, reactive } from "vue"

import CardCount from "@/components/composite/card-count.vue"
import AsideStudentReview from "./components/aside-student-review.vue"
import banner from "./components/banner.vue"
import PracticePanel from "@/views/dashboard/components/practice-panel.vue"
import ConversationPanel from "./components/conversation-panel.vue"


interface PracticeItem {
  word?: string
  phrase?: string
  definition?: string
  score: number
  duration: string
  playbackSpeed: string
  isPlaying: boolean
  audioUrl: string
}

const wordsData = reactive<PracticeItem[]>([
  {
    word: "skills",
    definition: "Abilities",
    score: 53,
    duration: "0:09",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/skills.mp3",
  },
  {
    word: "experience",
    definition: "Knowledge gained",
    score: 67,
    duration: "0:08",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/experience.mp3",
  },
  {
    word: "innovative",
    definition: "Creative approach",
    score: 81,
    duration: "0:11",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/innovative.mp3",
  },
  {
    word: "collaboration",
    definition: "Working together",
    score: 45,
    duration: "0:13",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/collaboration.mp3",
  },
])

const phrasesData = reactive<PracticeItem[]>([
  {
    phrase: "I think entrepreneurs need to be creative and flexible.",
    score: 53,
    duration: "0:09",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/phrase1.mp3",
  },
  {
    phrase: "My experience in startup environments has taught me...",
    score: 72,
    duration: "0:12",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/phrase2.mp3",
  },
  {
    phrase: "I believe innovation comes from diverse perspectives.",
    score: 89,
    duration: "0:10",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/phrase3.mp3",
  },
  {
    phrase: "Collaboration is key to successful startups.",
    score: 65,
    duration: "0:11",
    playbackSpeed: "1.0",
    isPlaying: false,
    audioUrl: "/audio/phrase4.mp3",
  },
])

const countCards = [
  {
    title: "Total Duration",
    value: "3 min",
    icon: "mdi-timer-check-outline",
    color: "deep-purple-lighten-4",
  },
  {
    title: "Student Duration",
    value: "1 min",
    icon: "mdi-timer-alert-outline",
    color: "deep-purple-lighten-4",
  },
  {
    title: "Total Messages",
    value: "12",
    icon: "mdi-message-bulleted",
    color: "deep-purple-lighten-4",
  },
  {
    title: "Words & Phrases",
    value: "9",
    icon: "mdi-invoice-text-edit-outline",
    color: "deep-purple-lighten-4",
  },
]
</script>
