import { createRouter, createWebHistory } from "vue-router"
import MainLayout from "@/layouts/MainLayout.vue"
import { useAuthStore } from "@/stores/auth"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "main-layout",
      component: MainLayout,
      meta: {
        requiredAuth: true,
      },
      children: [
        {
          path: "",
          name: "home",
          component: () => import("@/views/dashboard/dashboard-view.vue"),
        },
        {
          path: "chat",
          name: "chat",
          component: () => import("@/views/chat/chat-view.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/pages/login.vue"),
    },
    {
      path: "/sign-up",
      name: "sign-up",
      component: () => import("@/pages/register.vue"),
    },
    {
      path: "/:catchAll(.*)",
      name: "NotFound404",
      component: () => import("@/pages/404.vue"),
    },
  ],
})

export default router

router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.isAuthenticated && !authStore.user) {
    authStore.loadPersistedAuthState()
  }

  if (to.meta.requiredAuth && to.name !== "login") {
    if (!authStore.isAuthenticated) {
      return next({ name: "login" })
    }
    next()
  } else if (to.name === "login") {
    if (authStore.isAuthenticated) {
      return next({ name: "chat" })
    }
    next()
  } else {
    next()
  }
})
