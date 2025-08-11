import "vuetify/styles"
import { createVuetify } from "vuetify"
import * as components from "vuetify/components"
import * as directives from "vuetify/directives"
import { mdi } from "vuetify/iconsets/mdi"
import "@mdi/font/css/materialdesignicons.css"

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    sets: {
      mdi,
    },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        colors: {
          primary: "#702DFF",
          secondary: "#3F3F3F",
          accent: "#7E22CE",
          error: "#FF5252",
          info: "#2196F3",
          success: "#1A9945",
          warning: "#FEA922",
          progress: '#0F0D14',
          progressTrack: '#ffff'

        },
      },
    },
  },
})
