<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-information</v-icon>
            Acerca de
          </v-card-title>
          <v-card-text>
            <p>Esta es la página About de nuestra aplicación Vue 3 con:</p>
            <v-list>
              <v-list-item>
                <v-list-item-title>✅ Vue 3 + Composition API</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>✅ TypeScript</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>✅ Vuetify 3</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>✅ Pinia</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>✅ Vite</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>✅ ESLint + Prettier</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts"></script>
