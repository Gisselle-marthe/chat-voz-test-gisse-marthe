import { globalIgnores } from "eslint/config"
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript"
import pluginVue from "eslint-plugin-vue"
import pluginVitest from "@vitest/eslint-plugin"
import pluginPlaywright from "eslint-plugin-playwright"
import skipFormatting from "@vue/eslint-config-prettier/skip-formatting"

// To allow more languages other than `ts` in `.vue` files, uncomment the following lines:
// import { configureVueProject } from '@vue/eslint-config-typescript'
// configureVueProject({ scriptLangs: ['ts', 'tsx'] })
// More info at https://github.com/vuejs/eslint-config-typescript/#advanced-setup

export default defineConfigWithVueTs(
  {
    name: "app/files-to-lint",
    files: ["**/*.{ts,mts,tsx,vue}"],
  },

  globalIgnores(["**/dist/**", "**/dist-ssr/**", "**/coverage/**"]),

  pluginVue.configs["flat/essential"],
  vueTsConfigs.recommended,

  {
    ...pluginVitest.configs.recommended,
    files: ["src/**/__tests__/*"],
  },

  {
    ...pluginPlaywright.configs["flat/recommended"],
    files: ["e2e/**/*.{test,spec}.{js,ts,jsx,tsx}"],
  },

  // Reglas personalizadas
  {
    name: "app/custom-rules",
    rules: {
      // Vue rules
      "no-direct-store-mutation": "error",
      "vue/multi-word-component-names": "off",
      "vue/no-unused-components": "warn",
      "vue/component-api-style": ["error", ["script-setup"]],
      "vue/component-name-in-template-casing": ["error", "snake-case"],
      "vue/no-unused-vars": "warn",
      "vue/attributes-order": [
        "error",
        {
          order: [
            "DEFINITION", // Ej: is
            "LIST_RENDERING", // Ej: v-for, v-if
            "CONDITIONALS", // Ej: v-if, v-else
            "RENDER_MODIFIERS", // Ej: v-once, v-pre
            "GLOBAL", // Ej: id
            "UNIQUE", // Ej: ref, key
            "OTHER_ATTR", // Atributos normales como class, style
            "EVENTS", // Eventos como v-on
            "CONTENT", // Ej: v-text, v-html
          ],
        },
      ],
      "vue/block-lang": "off",

      // TypeScript rules
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",

      // General rules
      "no-console": process.env.NODE_ENV === "production" ? "error" : "warn",
      "no-debugger": process.env.NODE_ENV === "production" ? "error" : "warn",
      "prefer-const": "error",
      "no-var": "error",
    },
  },

  skipFormatting,
)
