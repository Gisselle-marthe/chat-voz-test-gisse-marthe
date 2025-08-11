<template>
  <v-app>
    <v-main>
      <v-container fluid class="login-container">
        <v-row no-gutters class="fill-height">
          <v-col cols="12" md="6" class="brand-panel">
            <div class="brand-content">
              <div class="logo-section">
                <v-icon size="48" color="white" class="logo-icon"> mdi-microphone </v-icon>
                <h1 class="brand-title">VOICE CHAT</h1>
              </div>

              <div class="brand-description">
                <h2 class="welcome-title">Bienvenido al Chat de Voz</h2>
                <p class="welcome-subtitle">
                  Practica inglés conversando con mensajes de voz en tiempo real. Solo ingresa un
                  nickname y comienza a hablar.
                </p>
              </div>

              <div class="floating-elements">
                <div class="floating-card card-1">
                  <v-icon color="white" size="20">mdi-microphone</v-icon>
                  <span>Grabar Voz</span>
                </div>
                <div class="floating-card card-2">
                  <v-icon color="white" size="20">mdi-play-circle</v-icon>
                  <span>Reproducir</span>
                </div>
                <div class="floating-card card-3">
                  <v-icon color="white" size="20">mdi-chat</v-icon>
                  <span>Chat en Tiempo Real</span>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="form-panel">
            <div class="form-container">
              <div class="form-header">
                <h2 class="login-title">Iniciar Sesión</h2>
                <p class="login-subtitle">Ingresa tu nickname para comenzar</p>
              </div>

              <v-form @submit.prevent="handleLogin" class="login-form">
                <v-text-field
                  v-model="nickname"
                  label="Nickname"
                  type="text"
                  prepend-inner-icon="mdi-account-outline"
                  variant="outlined"
                  placeholder="Tu nombre o apodo"
                  rounded
                  color="primary"
                  :rules="nicknameRules"
                  class="mb-4"
                  hide-details="auto"
                ></v-text-field>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  rounded
                  class="login-btn"
                  :loading="loading"
                  elevation="0"
                >
                  Comenzar a Chatear
                </v-btn>

                <v-divider class="my-6">
                  <span class="divider-text">¿Es tu primera vez?</span>
                </v-divider>

                <div class="info-section">
                  <p class="info-text">
                    Solo ingresa un nickname y comienza a practicar inglés con mensajes de voz
                  </p>
                  <div class="features-list">
                    <div class="feature-item">
                      <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                      <span>Grabación de hasta 30 segundos</span>
                    </div>
                    <div class="feature-item">
                      <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                      <span>Reproducción a diferentes velocidades</span>
                    </div>
                    <div class="feature-item">
                      <v-icon color="primary" size="20">mdi-check-circle</v-icon>
                      <span>Chat en tiempo real</span>
                    </div>
                  </div>
                </div>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue"
import { useRouter } from "vue-router"

import { useAuth } from "@/composables/auth/use-auth"

const router = useRouter()
const { login } = useAuth()

const nickname = ref("")
const loading = ref(false)

const nicknameRules = [
  (v: string) => !!v || "El nickname es requerido",
  (v: string) => v.length >= 2 || "El nickname debe tener al menos 2 caracteres",
  (v: string) => v.length <= 20 || "El nickname no puede tener más de 20 caracteres",
  (v: string) => /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+$/.test(v) || "Solo letras, números y espacios",
]

const handleLogin = async () => {
  loading.value = true

  try {
    const trimmedNickname = nickname.value.trim()
    if (!trimmedNickname) {
      return
    }

    const success = await login({ username: trimmedNickname })

    if (!success) {
      alert("Error en el login")
    }

    await router.push({ name: "chat" })
  } catch (error) {
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  padding: 0;
}

.brand-panel {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.brand-content {
  text-align: center;
  color: white;
  z-index: 2;
  position: relative;
  padding: 2rem;
}

.logo-section {
  margin-bottom: 3rem;
}

.logo-icon {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 12px;
  margin-bottom: 1rem;
}

.brand-title {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 2px;
  margin: 0;
}

.brand-description {
  max-width: 400px;
  margin: 0 auto;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.welcome-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  line-height: 1.6;
}

.floating-elements {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
  animation: float 6s ease-in-out infinite;
}

.card-1 {
  top: 20%;
  right: 10%;
  animation-delay: 0s;
}

.card-2 {
  top: 60%;
  left: 10%;
  animation-delay: 2s;
}

.card-3 {
  bottom: 20%;
  right: 15%;
  animation-delay: 4s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.form-panel {
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 420px;
  padding: 2rem;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.login-subtitle {
  color: #666;
  font-size: 1rem;
}

.login-form {
  width: 100%;
}

.login-btn {
  height: 48px;
  font-weight: 600;
  text-transform: none;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.divider-text {
  color: #666;
  font-size: 0.9rem;
  background: #fafafa;
  padding: 0 1rem;
}

.info-section {
  text-align: center;
}

.info-text {
  color: #666;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #555;
  font-size: 0.9rem;
}

@media (max-width: 960px) {
  .brand-panel {
    display: none;
  }

  .form-container {
    padding: 1rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}
</style>
