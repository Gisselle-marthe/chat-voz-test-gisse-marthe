<template>
  <v-app>
    <v-main>
      <v-container fluid class="register-container">
        <v-row no-gutters class="fill-height">
          <v-col cols="12" md="6" class="brand-panel">
            <div class="brand-content">
              <div class="logo-section">
                <v-icon size="48" color="white" class="logo-icon"> mdi-school </v-icon>
                <h1 class="brand-title">COURSUE</h1>
              </div>

              <div class="brand-description">
                <h2 class="welcome-title">Únete a nuestra comunidad</h2>
                <p class="welcome-subtitle">
                  Crea tu cuenta y comienza tu viaje de aprendizaje. Accede a miles de cursos y
                  mejora tus habilidades profesionales.
                </p>
              </div>

              <div class="floating-elements">
                <div class="floating-card card-1">
                  <v-icon color="white" size="20">mdi-account-plus</v-icon>
                  <span>Nuevo Usuario</span>
                </div>
                <div class="floating-card card-2">
                  <v-icon color="white" size="20">mdi-book-open</v-icon>
                  <span>1000+ Cursos</span>
                </div>
                <div class="floating-card card-3">
                  <v-icon color="white" size="20">mdi-certificate</v-icon>
                  <span>Certificaciones</span>
                </div>
                <div class="floating-card card-4">
                  <v-icon color="white" size="20">mdi-account-group</v-icon>
                  <span>Comunidad</span>
                </div>
              </div>

              <div class="stats-section">
                <div class="stat-item">
                  <h3>50K+</h3>
                  <span>Estudiantes</span>
                </div>
                <div class="stat-item">
                  <h3>1K+</h3>
                  <span>Cursos</span>
                </div>
                <div class="stat-item">
                  <h3>95%</h3>
                  <span>Satisfacción</span>
                </div>
              </div>
            </div>
          </v-col>

          <v-col cols="12" md="6" class="form-panel">
            <div class="form-container">
              <div class="form-header">
                <h2 class="register-title">Crear Cuenta</h2>
                <p class="register-subtitle">Completa la información para registrarte</p>
              </div>

              <v-form
                ref="registerForm"
                @submit.prevent="register"
                class="register-form"
                v-model="formValid"
              >
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="firstName"
                      label="Nombre"
                      prepend-inner-icon="mdi-account-outline"
                      variant="outlined"
                      color="primary"
                      rounded
                      :rules="nameRules"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="lastName"
                      label="Apellido"
                      prepend-inner-icon="mdi-account-outline"
                      variant="outlined"
                      color="primary"
                      rounded
                      :rules="nameRules"
                      hide-details="auto"
                      class="mb-2"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-text-field
                  v-model="username"
                  label="Nombre de usuario"
                  prepend-inner-icon="mdi-at"
                  variant="outlined"
                  color="primary"
                  rounded
                  :rules="usernameRules"
                  hint="Solo letras, números y guiones. Ej: juan_perez123"
                  persistent-hint
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="email"
                  label="Correo electrónico"
                  type="email"
                  prepend-inner-icon="mdi-email-outline"
                  variant="outlined"
                  color="primary"
                  rounded
                  :rules="emailRules"
                  hide-details="auto"
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="phone"
                  label="Número de celular"
                  prepend-inner-icon="mdi-phone"
                  variant="outlined"
                  color="primary"
                  rounded
                  :rules="phoneRules"
                  hint="+57 300 123 4567"
                  persistent-hint
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="password"
                  :type="showPassword ? 'text' : 'password'"
                  label="Contraseña"
                  prepend-inner-icon="mdi-lock-outline"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  variant="outlined"
                  color="primary"
                  rounded
                  :rules="passwordRules"
                  hide-details="auto"
                  class="mb-2"
                ></v-text-field>

                <v-text-field
                  v-model="confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  label="Confirmar contraseña"
                  prepend-inner-icon="mdi-lock-check-outline"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  variant="outlined"
                  color="primary"
                  rounded
                  :rules="confirmPasswordRules"
                  hide-details="auto"
                  class="mb-3"
                ></v-text-field>

                <div class="password-strength mb-3">
                  <div class="strength-bar">
                    <div
                      class="strength-fill"
                      :class="passwordStrength.class"
                      :style="{ width: passwordStrength.width }"
                    ></div>
                  </div>
                  <span class="strength-text" :class="passwordStrength.class">
                    {{ passwordStrength.text }}
                  </span>
                </div>

                <v-checkbox
                  v-model="acceptTerms"
                  color="primary"
                  :rules="termsRules"
                  hide-details="auto"
                  class="mb-4"
                >
                  <template v-slot:label>
                    <span class="terms-text">
                      Acepto los
                      <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        class="pa-0 text-decoration-underline"
                        @click="showTerms"
                      >
                        términos y condiciones
                      </v-btn>
                      y la
                      <v-btn
                        variant="text"
                        color="primary"
                        size="small"
                        class="pa-0 text-decoration-underline"
                        @click="showPrivacy"
                      >
                        política de privacidad
                      </v-btn>
                    </span>
                  </template>
                </v-checkbox>

                <v-checkbox
                  v-model="acceptNewsletter"
                  color="primary"
                  hide-details
                  class="mb-4"
                  label="Quiero recibir noticias y ofertas por email (opcional)"
                ></v-checkbox>

                <v-btn
                  type="submit"
                  color="primary"
                  size="large"
                  block
                  rounded
                  class="register-btn"
                  :loading="loading"
                  :disabled="!formValid || !acceptTerms"
                  elevation="0"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  Crear Cuenta
                </v-btn>

                <v-divider class="my-6">
                  <span class="divider-text">O regístrate con</span>
                </v-divider>

                <div class="social-buttons">
                  <v-btn
                    variant="outlined"
                    size="large"
                    rounded
                    class="social-btn"
                    @click="registerWithGoogle"
                  >
                    <v-icon start>mdi-google</v-icon>
                    Google
                  </v-btn>

                  <v-btn
                    variant="outlined"
                    size="large"
                    rounded
                    class="social-btn"
                    @click="registerWithMicrosoft"
                  >
                    <v-icon start>mdi-microsoft</v-icon>
                    Microsoft
                  </v-btn>
                </div>

                <div class="login-link">
                  <span>¿Ya tienes cuenta?</span>
                  <v-btn variant="text" color="primary" @click="goToLogin">
                    Inicia sesión aquí
                  </v-btn>
                </div>
              </v-form>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <v-dialog v-model="termsDialog" max-width="600px" scrollable>
        <v-card>
          <v-card-title class="text-h5 bg-primary text-white">
            Términos y Condiciones
            <v-spacer></v-spacer>
            <v-btn icon @click="termsDialog = false" variant="text" color="white">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-card-title>
          <v-card-text class="pa-6">
            <h3>1. Aceptación de términos</h3>
            <p>Al registrarte en COURSUE, aceptas cumplir con estos términos y condiciones...</p>

            <h3>2. Uso de la plataforma</h3>
            <p>Te comprometes a usar la plataforma de manera responsable y ética...</p>

            <h3>3. Contenido y propiedad intelectual</h3>
            <p>Todo el contenido de los cursos está protegido por derechos de autor...</p>

            <h3>4. Pagos y reembolsos</h3>
            <p>Los pagos se procesan de forma segura. Consulta nuestra política de reembolsos...</p>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="termsDialog = false">Entendido</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000">
        {{ snackbar.message }}
        <template v-slot:actions>
          <v-btn variant="text" @click="snackbar.show = false">Cerrar</v-btn>
        </template>
      </v-snackbar>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from "vue"
import { useRouter } from "vue-router"

const router = useRouter()

const registerForm = ref(null)
const formValid = ref(false)
const firstName = ref("")
const lastName = ref("")
const username = ref("")
const email = ref("")
const phone = ref("")
const password = ref("")
const confirmPassword = ref("")
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const acceptTerms = ref(false)
const acceptNewsletter = ref(false)
const loading = ref(false)
const termsDialog = ref(false)

const snackbar = ref({
  show: false,
  message: "",
  color: "success",
})

const nameRules = [
  v => !!v || "Este campo es requerido",
  v => v.length >= 2 || "Debe tener al menos 2 caracteres",
  v => /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(v) || "Solo se permiten letras",
]

const usernameRules = [
  v => !!v || "El nombre de usuario es requerido",
  v => v.length >= 3 || "Debe tener al menos 3 caracteres",
  v => v.length <= 20 || "No debe exceder 20 caracteres",
  v => /^[a-zA-Z0-9_-]+$/.test(v) || "Solo letras, números, guiones y guión bajo",
]

const emailRules = [
  v => !!v || "El email es requerido",
  v => /.+@.+\..+/.test(v) || "El email debe ser válido",
]

const phoneRules = [
  v => !!v || "El teléfono es requerido",
  v => /^[\+]?[0-9\s\-\(\)]{10,15}$/.test(v) || "Formato de teléfono inválido",
]

const passwordRules = [
  v => !!v || "La contraseña es requerida",
  v => v.length >= 8 || "Debe tener al menos 8 caracteres",
  v => /(?=.*[a-z])/.test(v) || "Debe contener al menos una minúscula",
  v => /(?=.*[A-Z])/.test(v) || "Debe contener al menos una mayúscula",
  v => /(?=.*[0-9])/.test(v) || "Debe contener al menos un número",
]

const confirmPasswordRules = [
  v => !!v || "Confirma tu contraseña",
  v => v === password.value || "Las contraseñas no coinciden",
]

const termsRules = [v => !!v || "Debes aceptar los términos y condiciones"]

const passwordStrength = computed(() => {
  if (!password.value) return { width: "0%", class: "", text: "" }

  let score = 0
  const pwd = password.value

  if (pwd.length >= 8) score++
  if (/[a-z]/.test(pwd)) score++
  if (/[A-Z]/.test(pwd)) score++
  if (/[0-9]/.test(pwd)) score++
  if (/[^A-Za-z0-9]/.test(pwd)) score++

  const strengths = [
    { width: "20%", class: "weak", text: "Muy débil" },
    { width: "40%", class: "weak", text: "Débil" },
    { width: "60%", class: "medium", text: "Regular" },
    { width: "80%", class: "strong", text: "Fuerte" },
    { width: "100%", class: "very-strong", text: "Muy fuerte" },
  ]

  return strengths[Math.min(score - 1, 4)] || strengths[0]
})

const register = async () => {
  const { valid } = await registerForm.value.validate()

  if (!valid || !acceptTerms.value) {
    showSnackbar("Por favor completa todos los campos correctamente", "error")
    return
  }

  loading.value = true

  try {
    await new Promise(resolve => setTimeout(resolve, 3000))

    const userData = {
      firstName: firstName.value,
      lastName: lastName.value,
      username: username.value,
      email: email.value,
      phone: phone.value,
      acceptNewsletter: acceptNewsletter.value,
    }

    showSnackbar(
      "¡Cuenta creada exitosamente! Te hemos enviado un email de confirmación.",
      "success",
    )

    resetForm()
  } catch (error) {
    showSnackbar("Error al crear la cuenta. Inténtalo nuevamente.", "error")
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  firstName.value = ""
  lastName.value = ""
  username.value = ""
  email.value = ""
  phone.value = ""
  password.value = ""
  confirmPassword.value = ""
  acceptTerms.value = false
  acceptNewsletter.value = false
  registerForm.value?.reset()
}

const showSnackbar = (message, color = "success") => {
  snackbar.value = {
    show: true,
    message,
    color,
  }
}

const showTerms = () => {
  termsDialog.value = true
}

const showPrivacy = () => {}

const registerWithGoogle = () => {
  showSnackbar("Próximamente disponible", "info")
}

const registerWithMicrosoft = () => {
  showSnackbar("Próximamente disponible", "info")
}

const goToLogin = () => {
  router.push({ name: "login" })
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  padding: 0;
}

.brand-panel {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%);
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
  margin-bottom: 2rem;
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
  margin: 0 auto 3rem;
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

.stats-section {
  display: flex;
  justify-content: space-between;
  max-width: 300px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-item h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
}

.stat-item span {
  font-size: 0.9rem;
  opacity: 0.8;
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
  top: 15%;
  right: 8%;
  animation-delay: 0s;
}

.card-2 {
  top: 35%;
  left: 5%;
  animation-delay: 1s;
}

.card-3 {
  bottom: 30%;
  right: 12%;
  animation-delay: 2s;
}

.card-4 {
  bottom: 10%;
  left: 8%;
  animation-delay: 3s;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

.form-panel {
  background: #fafafa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.form-container {
  width: 100%;
  max-width: 500px;
  padding: 2rem;
  max-height: 100vh;
  overflow-y: auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.register-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1a1a1a;
  margin-bottom: 0.5rem;
}

.register-subtitle {
  color: #666;
  font-size: 1rem;
}

.register-form {
  width: 100%;
}

.password-strength {
  margin-bottom: 1rem;
}

.strength-bar {
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  border-radius: 2px;
  transition:
    width 0.3s ease,
    background-color 0.3s ease;
}

.strength-fill.weak {
  background: #ef4444;
}
.strength-fill.medium {
  background: #f59e0b;
}
.strength-fill.strong {
  background: #10b981;
}
.strength-fill.very-strong {
  background: #059669;
}

.strength-text {
  font-size: 0.85rem;
  font-weight: 500;
}

.strength-text.weak {
  color: #ef4444;
}
.strength-text.medium {
  color: #f59e0b;
}
.strength-text.strong {
  color: #10b981;
}
.strength-text.very-strong {
  color: #059669;
}

.terms-text {
  font-size: 0.9rem;
  color: #666;
}

.register-btn {
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

.social-buttons {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.social-btn {
  flex: 1;
  height: 48px;
  text-transform: none;
  font-weight: 500;
}

.login-link {
  text-align: center;
  color: #666;
}

@media (max-width: 960px) {
  .brand-panel {
    display: none;
  }

  .form-container {
    padding: 1rem;
    max-height: none;
  }

  .register-title {
    font-size: 1.75rem;
  }

  .social-buttons {
    flex-direction: column;
  }

  .social-btn {
    flex: none;
  }

  .form-panel {
    padding: 1rem 0;
  }
}

@media (max-width: 600px) {
  .stats-section {
    max-width: 250px;
  }

  .stat-item h3 {
    font-size: 1.25rem;
  }

  .stat-item span {
    font-size: 0.8rem;
  }
}
</style>
