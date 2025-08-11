import { computed, onMounted, readonly, type Ref } from "vue"
import { useAuthStore } from "@/stores/auth"
import { UserType, type User } from "@/domain/entities/user"
import { generateUUID } from "../common/use-common"

export interface LoginCredentials {
  username: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface AuthComposable {
  user: Readonly<Ref<User | null>>
  token: Readonly<Ref<string | null>>
  lastActivity: Readonly<Ref<Date | null>>
  isAuthenticated: Readonly<Ref<boolean>>

  login: (credentials: LoginCredentials) => Promise<boolean>
  logout: () => void
  updateActivity: () => void
  checkAuthStatus: () => boolean
  isTokenExpired: () => boolean
}

export const useAuth = (): AuthComposable => {
  const authStore = useAuthStore()

  const user = computed(() => authStore.currentUser)
  const token = computed(() => authStore.userToken)
  const lastActivity = computed(() => authStore.userLastActivity)
  const isAuthenticated = computed(() => authStore.userIsAuthenticated)

  onMounted(() => {
    authStore.loadPersistedAuthState()
  })

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      const response = {
        data: {
          user: {
            nickname: credentials.username,
            id: generateUUID(),
            userType: UserType.TEACHER,
            email: `${credentials.username}@gemail.com`,
          },
          token: generateUUID(),
        },
        ok: true,
      }

      if (!response.ok) {
        throw new Error("Login failed")
      }

      const data: LoginResponse = response.data

      authStore.setAuthData(data.user, data.token)

      return true
    } catch (error) {
      return false
    }
  }

  const logout = (): void => {
    authStore.clearAuthData()
  }

  const updateActivity = (): void => {
    if (authStore.isAuthenticated) {
      authStore.updateLastActivity()
    }
  }

  const checkAuthStatus = (): boolean => {
    if (!authStore.isAuthenticated || !authStore.lastActivity) {
      return false
    }

    const SESSION_TIMEOUT = 30 * 60 * 1000
    const now = new Date().getTime()
    const lastActivityTime = authStore.lastActivity.getTime()

    if (now - lastActivityTime > SESSION_TIMEOUT) {
      logout()
      return false
    }

    if (isTokenExpired()) {
      logout()
      return false
    }

    return true
  }

  const isTokenExpired = (): boolean => {
    if (!authStore.token) return true

    try {
      return false
    } catch (error) {
      return true
    }
  }

  return {
    user: readonly(user),
    token: readonly(token),
    lastActivity: readonly(lastActivity),
    isAuthenticated: readonly(isAuthenticated),

    login,
    logout,
    updateActivity,
    checkAuthStatus,
    isTokenExpired,
  }
}
