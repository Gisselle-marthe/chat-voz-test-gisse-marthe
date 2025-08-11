<template>
  <v-card class="practice-card" elevation="2" :style="{ '--panel-h': `${panelHeight}px` }">
    <v-card-title class="d-flex align-center pa-4">
      <v-icon :color="section === 'words' ? 'primary' : 'secondary'" size="24" class="mr-3">
        {{ section === "words" ? "mdi-alphabetical-variant" : "mdi-format-quote-open" }}
      </v-icon>
      <span class="text-h6 font-weight-bold">{{ title }}</span>
      <v-chip
        :color="section === 'words' ? 'primary' : 'secondary'"
        variant="flat"
        size="small"
        class="ml-auto"
      >
        {{ currentData.length }} items
      </v-chip>
    </v-card-title>

    <v-divider />

    <v-card-text class="content">
      <div class="practice-items">
        <div v-for="(item, index) in currentData" :key="index" class="practice-item">
          <div class="item-header">
            <div class="item-content">
              <h4 class="item-title" :class="{ 'phrase-title': section === 'phrases' }">
                {{ section === "words" ? item.word : item.phrase }}
              </h4>
              <span v-if="section === 'words'" class="item-subtitle">{{ item.definition }}</span>
            </div>

            <div class="item-actions">
              <v-chip :color="getScoreColor(item.score)" variant="flat" size="small" class="mr-2">
                Score: {{ item.score }}
              </v-chip>

              <v-btn icon variant="text" size="small" @click="$emit('play-audio', item.audioUrl)">
                <v-icon>mdi-volume-high</v-icon>
              </v-btn>
            </div>
          </div>

          <div class="waveform-container mt-3">
            <div class="waveform-wrapper">
              <div class="waveform">
                <div
                  v-for="n in 80"
                  :key="n"
                  class="wave-bar"
                  :style="{ height: Math.random() * 100 + '%' }"
                ></div>
              </div>

              <div class="playback-controls">
                <v-btn
                  icon
                  variant="text"
                  size="small"
                  @click="$emit('toggle-playback', index, section)"
                >
                  <v-icon>{{ item.isPlaying ? "mdi-pause" : "mdi-play" }}</v-icon>
                </v-btn>

                <span class="time-display">{{ item.duration || "0:09" }}</span>

                <v-btn icon variant="text" size="small" class="speed-control">
                  x {{ item.playbackSpeed || "1.0" }}
                </v-btn>
              </div>
            </div>

            <v-icon color="success" size="20" class="checkmark">mdi-check-circle</v-icon>
          </div>
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup lang="ts">
import { computed } from "vue"

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

const props = withDefaults(
  defineProps<{
    wordsPracticed: PracticeItem[]
    phrasesPracticed: PracticeItem[]
    section: "words" | "phrases"
    title: string

    panelHeight?: number
  }>(),
  {
    panelHeight: 420,
  },
)

defineEmits<{
  "play-audio": [audioUrl: string]
  "toggle-playback": [index: number, type: string]
}>()

const currentData = computed(() =>
  props.section === "words" ? props.wordsPracticed : props.phrasesPracticed,
)

const getScoreColor = (score: number): string => {
  if (score >= 80) return "success"
  if (score >= 60) return "warning"
  return "error"
}
</script>

<style scoped>
.practice-card {
  height: var(--panel-h, 420px);
  border-radius: 16px !important;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.practice-card .v-card-title {
  background: linear-gradient(135deg, rgba(98, 0, 234, 0.05) 0%, rgba(98, 0, 234, 0.02) 100%);
}

.content {
  flex: 1;
  padding: 0 !important;
  overflow: hidden;
}
.practice-items {
  height: 100%;
  overflow-y: auto;
  padding: 0 0 6px 0;
  scroll-behavior: smooth;
}

.practice-item {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  transition: 0.2s;
}
.practice-item:last-child {
  border-bottom: none;
}
.practice-item:hover {
  background: rgba(98, 0, 234, 0.02);
}

.item-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}
.item-content {
  flex: 1;
  min-width: 0;
}
.item-title {
  font-size: 16px;
  font-weight: 600;
  color: #212121;
  margin: 0 0 4px;
  line-height: 1.4;
}
.phrase-title {
  font-style: italic;
  color: #555;
  font-size: 14px;
}
.item-subtitle {
  font-size: 14px;
  color: #757575;
}

.item-actions {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.waveform-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  padding: 12px 16px;
  background: rgba(0, 0, 0, 0.02);
  border-radius: 12px;
}
.waveform-wrapper {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
}
.waveform {
  flex: 1;
  height: 32px;
  display: flex;
  align-items: end;
  gap: 1px;
  padding: 0 8px;
}
.wave-bar {
  width: 2px;
  background: linear-gradient(to top, #6200ea, #9c27b0);
  border-radius: 1px;
  min-height: 2px;
  opacity: 0.6;
}
.wave-bar:hover {
  opacity: 1;
}
.playback-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}
.time-display {
  font-size: 12px;
  color: #757575;
  font-weight: 500;
  min-width: 32px;
}
.speed-control {
  font-size: 11px !important;
  font-weight: 600;
  min-width: 40px !important;
}
.checkmark {
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .practice-card {
    height: min(var(--panel-h, 420px), 60vh);
  }
  .item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
  .item-actions {
    align-self: stretch;
    justify-content: space-between;
  }
  .waveform-container {
    flex-direction: column;
    gap: 12px;
  }
  .waveform-wrapper {
    width: 100%;
  }
  .phrase-title {
    font-size: 13px;
  }
}
</style>
