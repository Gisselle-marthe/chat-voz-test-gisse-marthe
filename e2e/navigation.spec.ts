import { test, expect } from "@playwright/test"

test.describe("Navegación Básica", () => {
  test("debe redirigir usuario no autenticado al login", async ({ page }) => {
    await page.goto("/chat")

    await expect(page).toHaveURL("/login")
  })

  test("debe redirigir usuario autenticado al chat desde login", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[placeholder="Tu nombre o apodo"]', "UsuarioTest")
    await page.click('button:has-text("Comenzar a Chatear")')

    await expect(page).toHaveURL("/chat")

    await page.goto("/login")

    await expect(page).toHaveURL("/chat")
  })

  test("debe permitir navegación desde dashboard", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[placeholder="Tu nombre o apodo"]', "UsuarioTest")
    await page.click('button:has-text("Comenzar a Chatear")')

    await page.goto("/dashboard")
    await expect(page).toHaveURL("/dashboard")

    await page.goto("/chat")
    await expect(page).toHaveURL("/chat")
  })

  test("debe mantener estado de navegación", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[placeholder="Tu nombre o apodo"]', "UsuarioTest")
    await page.click('button:has-text("Comenzar a Chatear")')

    await page.goto("/dashboard")
    await expect(page).toHaveURL("/dashboard")

    await page.goBack()
    await expect(page).toHaveURL("/chat")

    await page.goForward()
    await expect(page).toHaveURL("/dashboard")
  })

  test("debe manejar recarga de página en diferentes rutas", async ({ page }) => {
    await page.goto("/login")
    await page.fill('input[placeholder="Tu nombre o apodo"]', "UsuarioTest")
    await page.click('button:has-text("Comenzar a Chatear")')

    await page.goto("/dashboard")
    await expect(page).toHaveURL("/dashboard")

    await page.reload()
    await expect(page).toHaveURL("/dashboard")

    await expect(page.locator("body")).not.toContainText("Iniciar Sesión")
  })
})
