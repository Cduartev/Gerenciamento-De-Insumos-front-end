<template>
  <v-app>
    <v-app-bar color="primary" density="default" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="font-weight-bold d-flex align-center">
        <img src="/Logotipo_Vale.svg" alt="Vale Logo" height="32" class="mr-3" style="display: block;" />
        <span class="d-none d-sm-inline">{{ t('app.title', 'Inventory Manager') }}</span>
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn icon @click="toggleTheme" class="mr-2">
        <v-icon>{{ theme.global.current.value.dark ? 'mdi-weather-sunny' : 'mdi-weather-night' }}</v-icon>
      </v-btn>



      <v-btn-toggle
        v-model="currentLocale"
        color="white"
        variant="text"
        density="compact"
        class="mr-4 rounded"
        mandatory
      >
        <v-btn value="pt" class="px-2" title="Português">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 504" width="24" height="18">
            <rect width="720" height="504" fill="#009b3a"/>
            <path d="M360 84L636 252L360 420L84 252Z" fill="#fedf00"/>
            <circle cx="360" cy="252" r="118" fill="#002776"/>
          </svg>
        </v-btn>
        <v-btn value="en" class="px-2" title="English">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7410 3900" width="24" height="15.6">
            <rect width="7410" height="3900" fill="#b22234"/>
            <g fill="#fff">
              <rect y="300" width="7410" height="300"/>
              <rect y="900" width="7410" height="300"/>
              <rect y="1500" width="7410" height="300"/>
              <rect y="2100" width="7410" height="300"/>
              <rect y="2700" width="7410" height="300"/>
              <rect y="3300" width="7410" height="300"/>
            </g>
            <rect width="2964" height="2100" fill="#3c3b6e"/>
          </svg>
        </v-btn>
      </v-btn-toggle>

      <v-btn icon @click="handleLogout" title="Logout">
        <v-icon>mdi-logout</v-icon>
      </v-btn>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :rail="false">
      <v-list nav density="default">
        <v-list-item
          prepend-icon="mdi-view-dashboard"
          :title="t('dashboard.title', 'Dashboard')"
          value="dashboard"
          to="/"
        />
        <v-list-item
          prepend-icon="mdi-package-variant-closed"
          :title="t('app.nav.rawMaterials')"
          value="materias-primas"
          to="/materias-primas"
        />
        <v-list-item
          prepend-icon="mdi-cube-outline"
          :title="t('app.nav.products')"
          value="produtos"
          to="/produtos"
        />
        <v-list-item
          prepend-icon="mdi-chart-line"
          :title="t('app.nav.productionPlan')"
          value="plano-producao"
          to="/plano-producao"
        />
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container fluid class="pa-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'
import { useAuthStore } from '@/stores/authStore'

const { t, locale } = useI18n()
const theme = useTheme()
const drawer = ref(true)
const authStore = useAuthStore()

const currentLocale = ref(locale.value)

function toggleTheme() {
  theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
}

function handleLogout() {
  authStore.logout()
}



watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})
</script>
