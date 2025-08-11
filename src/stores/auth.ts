import type { AuthState, User } from "@/domain/entities/user"
import { defineStore } from "pinia"

const STORAGE_KEY = "auth_state"

export const useAuthStore = defineStore("auth", {
  state: (): AuthState => ({
    user: null,
    token: null,
    lastActivity: null,
    isAuthenticated: false,
  }),

  getters: {
    currentUser: (state): User | null => state.user,
    userToken: (state): string | null => state.token,
    userLastActivity: (state): Date | null => state.lastActivity,
    userIsAuthenticated: (state): boolean => state.isAuthenticated,
  },

  actions: {
    setAuthData(userData: User, token: string) {
      this.user = userData
      this.token = token
      this.lastActivity = new Date()
      this.isAuthenticated = true
      this.persistAuthState()
    },

    updateLastActivity() {
      this.lastActivity = new Date()
      this.persistAuthState()
    },

    clearAuthData() {
      this.user = null
      this.token = null
      this.lastActivity = null
      this.isAuthenticated = false
      this.clearPersistedAuthState()
    },

    persistAuthState() {
      const stateToStore = {
        user: this.user,
        token: this.token,
        lastActivity: this.lastActivity?.toISOString(),
        isAuthenticated: this.isAuthenticated,
      }
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(stateToStore))
    },

    loadPersistedAuthState() {
      try {
        const stored = sessionStorage.getItem(STORAGE_KEY)
        if (stored) {
          const authData = JSON.parse(stored)
          this.user = authData.user
          this.token = authData.token
          this.lastActivity = authData.lastActivity ? new Date(authData.lastActivity) : null
          this.isAuthenticated = authData.isAuthenticated
        }
      } catch (error) {
        this.clearPersistedAuthState()
      }
    },

    clearPersistedAuthState() {
      sessionStorage.removeItem(STORAGE_KEY)
    },
  },
})
