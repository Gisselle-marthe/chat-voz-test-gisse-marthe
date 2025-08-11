<template>
  <v-navigation-drawer permanent rail class="c-drawer--fixed">
    <div class="d-flex flex-column justify-space-between align-content-space-between h-100 py-6">
      <div>
        <v-list density="compact" class="avatar-list">
          <v-list-item class="avatar-item">
            <v-avatar size="50" class="avatar-centered">
              <v-img :src="avatarSrc" alt="Logo" />
            </v-avatar>
          </v-list-item>
        </v-list>
        <v-list density="compact">
          <v-list-item
            link
            slim
            to="/"
            exact
            color="primary"
            rounded="xl"
            prepend-icon="mdi-home-outline"
            title="Dashboard"
            value="home"
          ></v-list-item>
          <v-list-item
            link
            slim
            to="chat"
            color="primary"
            rounded="xl"
            prepend-icon="mdi-chat-outline"
            title="Inbox"
            value="Inbox"
          ></v-list-item>
          <v-list-item
            link
            slim
            to="lesson"
            color="primary"
            rounded="xl"
            prepend-icon="mdi-folder-upload-outline"
            title="Lesson"
            value="Lesson"
          ></v-list-item>
          <v-list-item
            slim
            to="task"
            color="primary"
            rounded="xl"
            prepend-icon="mdi-checkbox-marked-circle-auto-outline"
            title="Task"
            value="Task"
          ></v-list-item>
          <v-list-item
            slim
            to="group"
            color="primary"
            rounded="xl"
            prepend-icon="mdi-account-group-outline"
            title="Group"
            value="Group"
          ></v-list-item>
        </v-list>
      </div>
      <div>
        <v-list density="compact">
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="mdi-cog"
            title="Settings"
            value="settings"
          ></v-list-item>
          <v-list-item
            color="primary"
            rounded="xl"
            prepend-icon="mdi-logout"
            title="Logout"
            value="logout"
            @click="handleLogout"
          ></v-list-item>
        </v-list>
      </div>
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import { useAuth } from "@/composables/auth/use-auth"
const { logout } = useAuth()
import { useAvatar } from '@/composables/chat/use-avatar';

const { getPersistentAvatar } = useAvatar();
const avatarSrc = getPersistentAvatar('Teacher User');
const handleLogout = () => {
  logout()
  window.location.href = "/login"
}
</script>

<style lang="scss" scoped>
.avatar-list {
  margin-bottom: 8px;
}

.avatar-item {
  min-height: 48px;
  padding: 0;
  justify-content: center;
}

.avatar-centered {
  margin: 0 auto;
}
</style>
