import { test, expect } from "@playwright/test"

test.describe("Funcionalidad Core del Chat de Voz", () => {
  test("debe permitir login y navegar al chat", async ({ page }) => {
    await page.goto("/login")

    await expect(page).toHaveURL("/login")

    await page.fill('input[placeholder="Tu nombre o apodo"]', "UsuarioTest")
    await page.click('button:has-text("Comenzar a Chatear")')

    await expect(page).toHaveURL("/chat")
  })

  test("debe validar nickname vacío", async ({ page }) => {
    await page.goto("/login")

    await page.click('button:has-text("Comenzar a Chatear")')

    await expect(page).toHaveURL("/login")
  })

  test("debe redirigir usuario no autenticado", async ({ page }) => {
    await page.goto("/chat")

    await expect(page).toHaveURL("/login")
  })

  test("debe mantener sesión después de recargar", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[placeholder="Tu nombre o apodo"]', "UsuarioTest")
    await page.click('button:has-text("Comenzar a Chatear")')

    await expect(page).toHaveURL("/chat")

    await page.reload()

    await expect(page).toHaveURL("/chat")
  })

  test("debe permitir navegación a dashboard", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[placeholder="Tu nombre o apodo"]', "UsuarioTest")
    await page.click('button:has-text("Comenzar a Chatear")')

    await page.goto("/dashboard")
    await expect(page).toHaveURL("/dashboard")
  })
})
