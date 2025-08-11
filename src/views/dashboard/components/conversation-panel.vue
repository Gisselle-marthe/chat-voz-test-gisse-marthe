<template>
  <div class="w-100 bg-grey-lighten-4 rounded-xl shadow-lg" style="height: 530px">
    <header class="chat-header">
      <div class="header-inner">
        <div class="user-info">
          <div v-if="participants.length" style="display: flex; align-items: center; gap: 8px">
            <v-avatar
              v-for="p in participants"
              :key="p.id"
              size="48"
              class="user-avatar"
              :title="p.nickname"
            >
              <v-img :src="p.avatarUrl" alt="Avatar participante" />
            </v-avatar>
          </div>

          <v-avatar v-else size="48" class="user-avatar">
            <v-icon color="black">mdi-robot</v-icon>
          </v-avatar>

          <div class="user-details">
            <h2 class="nickname" v-if="participants.length">
              <template v-for="(p, i) in participants" :key="p.id">
                {{ p.nickname }}<span v-if="i < participants.length - 1">, </span>
              </template>
            </h2>
            <h2 class="nickname" v-else>Esperando participantes…</h2>

            <p class="status">Preparing for a Startup Interview</p>
          </div>
        </div>
      </div>
    </header>

    <div class="scroll">
      <voice-chat-bubble v-for="m in localMessages" :key="m.id" :message="m" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue"
import VoiceChatBubble from "@/views/chat/components/voice-chat-bubble.vue"
import type { ChatMessage } from "@/domain/entities/chat"
import { UserType } from "@/domain/entities/user"
import { useAuth } from "@/composables/auth/use-auth"

type Props = {
  height?: number
  messages?: ChatMessage[] | null
}
const props = withDefaults(defineProps<Props>(), { height: 430, messages: null })

const { user } = useAuth()
const meId = computed(() => user.value?.id ?? "me-demo")
const meNick = computed(() => user.value?.nickname ?? "Tú")

const localMessages = ref<ChatMessage[]>([])
const uid = () => `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

const makeAvatar = (seed: string) =>
  `https://api.dicebear.com/6.x/adventurer/svg?seed=${encodeURIComponent(seed || "anon")}`

const participants = computed(() => {
  const map = new Map<string, { nickname: string }>()
  for (const m of localMessages.value) {
    const u = m.user
    if (!u) continue
    if (u.userType === UserType.SYSTEM) continue
    if (u.id === meId.value) continue
    if (!map.has(u.id)) map.set(u.id, { nickname: u.nickname || u.id })
  }
  return Array.from(map.entries()).map(([id, u]) => ({
    id,
    nickname: u.nickname,
    avatarUrl: makeAvatar(u.nickname || id),
  }))
})

async function makeToneWav(
  freq = 440,
  seconds = 2,
  sampleRate = 44100,
  gain = 0.85,
): Promise<Blob> {
  const length = Math.floor(seconds * sampleRate)
  const samples = new Float32Array(length)
  for (let i = 0; i < length; i++) {
    const t = i / sampleRate
    const env = Math.min(1, i / (sampleRate * 0.02), (length - i) / (sampleRate * 0.02))
    samples[i] = Math.sin(2 * Math.PI * freq * t) * gain * env
  }
  return encodeWavPCM16(samples, sampleRate)
}
function encodeWavPCM16(samples: Float32Array, sampleRate: number): Blob {
  const numChannels = 1,
    bitsPerSample = 16
  const blockAlign = (numChannels * bitsPerSample) / 8
  const byteRate = sampleRate * blockAlign
  const dataSize = samples.length * blockAlign
  const buf = new ArrayBuffer(44 + dataSize)
  const v = new DataView(buf)
  const w = (o: number, s: string) => {
    for (let i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i))
  }
  w(0, "RIFF")
  v.setUint32(4, 36 + dataSize, true)
  w(8, "WAVE")
  w(12, "fmt ")
  v.setUint32(16, 16, true)
  v.setUint16(20, 1, true)
  v.setUint16(22, numChannels, true)
  v.setUint32(24, sampleRate, true)
  v.setUint32(28, byteRate, true)
  v.setUint16(32, blockAlign, true)
  v.setUint16(34, bitsPerSample, true)
  w(36, "data")
  v.setUint32(40, dataSize, true)
  let off = 44
  for (let i = 0; i < samples.length; i++, off += 2) {
    const s = Math.max(-1, Math.min(1, samples[i]))
    v.setInt16(off, s < 0 ? s * 0x8000 : s * 0x7fff, true)
  }
  return new Blob([v], { type: "audio/wav" })
}

onMounted(async () => {
  if (props.messages?.length) {
    localMessages.value = props.messages
    return
  }
  const tone1 = await makeToneWav(420, 2.0)
  const tone2 = await makeToneWav(520, 1.8)
  const now = new Date()

  localMessages.value = [
    {
      id: uid(),
      transcript: "Bienvenido a Preparing for a Startup Interview.",
      audioBlob: "",
      duration: 0,
      timestamp: now,
      roomId: "dashboard-demo",
      user: { id: "system", nickname: "IA", userType: UserType.SYSTEM },
    },
    {
      id: uid(),
      transcript: "",
      audioBlob: tone1,
      duration: 2.0,
      timestamp: now,
      roomId: "dashboard-demo",
      user: { id: meId.value, nickname: meNick.value, userType: user.value?.userType },
    },
    {
      id: uid(),
      transcript: "Lingo se ha unido al chat.",
      audioBlob: "",
      duration: 0,
      timestamp: now,
      roomId: "dashboard-demo",
      user: { id: "system", nickname: "IA", userType: UserType.SYSTEM },
    },
    {
      id: uid(),
      transcript: "",
      audioBlob: tone2,
      duration: 1.8,
      timestamp: now,
      roomId: "dashboard-demo",
      user: { id: "other-1", nickname: "LingoQuesto" },
    },
    {
      id: uid(),
      transcript: "",
      audioBlob: tone2,
      duration: 1.8,
      timestamp: now,
      roomId: "dashboard-demo",
      user: { id: meId.value, nickname: meNick.value, userType: user.value?.userType },
    },
  ]
})
</script>

<style scoped>
.chat-header {
  position: sticky;
  top: 0;
  z-index: 2;
  width: 100%;
  background: #a3a7e900;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
}
.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}
.user-avatar {
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.user-details {
  display: flex;
  flex-direction: column;
}
.nickname {
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
  color: #333;
}
.status {
  font-size: 0.875rem;
  color: #666;
}

.scroll {
  height: calc(100% - 72px);
  overflow: auto;
  padding: 16px;
}
</style>
