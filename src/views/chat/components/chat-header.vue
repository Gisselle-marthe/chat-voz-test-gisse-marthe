<template>
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
            <v-img v-if="p.avatarUrl" :src="p.avatarUrl" alt="Avatar participante" />
            <v-icon v-else>mdi-account</v-icon>
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

          <p class="status">
            {{ participants.length ? "En línea" : "Última conexión: " + lastSeen }}
          </p>
        </div>
      </div>

      <v-btn
        icon="mdi-logout"
        variant="text"
        size="small"
        @click="handleLogout"
        title="Cerrar sesión"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from "vue"
import { useAuth } from "@/composables/auth/use-auth"
import { useBroadcastChannel } from "@/composables/core/use-broadcast-channel"
import { useAvatar } from "@/composables/chat/use-avatar"

const { user, logout, lastActivity } = useAuth()
const { othersOnline, onMessage, offMessage } = useBroadcastChannel()
const { makeAvatar } = useAvatar(user)

const lastSeen = computed(() => {
  if (!lastActivity.value) return "Desconocido"
  const diff = Math.floor((Date.now() - new Date(lastActivity.value).getTime()) / 1000)
  if (diff < 60) return "Hace menos de un minuto"
  if (diff < 3600) return `Hace ${Math.floor(diff / 60)} minutos`
  if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`
  return `Hace ${Math.floor(diff / 86400)} días`
})

type UserProfile = { nickname?: string; avatarUrl?: string }
const profiles = ref<Map<string, UserProfile>>(new Map())

const onlineHandler = (data: any) => {
  if (!data?.userId) return
  const prev = profiles.value.get(data.userId) ?? {}
  profiles.value.set(data.userId, {
    nickname: data.nickname ?? prev.nickname,
    avatarUrl: data.avatarUrl ?? prev.avatarUrl,
  })
}
onMessage("ONLINE_STATUS", onlineHandler)
onUnmounted(() => offMessage("ONLINE_STATUS", onlineHandler))

const participants = computed(() =>
  Array.from(othersOnline.value.keys()).map(id => {
    const p = profiles.value.get(id)
    const nick = p?.nickname || id
    return { id, nickname: nick, avatarUrl: p?.avatarUrl || makeAvatar(nick) }
  }),
)

const handleLogout = () => {
  logout()
  window.location.href = "/login"
}
</script>

<style scoped>
.chat-header {
  position: fixed;
  z-index: 10;
  width: calc(100% - 56px);
  background: #a3a7e91a;
  border-bottom: 1px solid #e0e0e0;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px); /* soporte Safari */
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
</style>
