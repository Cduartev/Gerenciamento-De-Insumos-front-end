<template>
  <v-app>
    <v-app-bar color="primary" density="default" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-factory" class="mr-2" />
        {{ t('app.title') }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-btn-toggle
        v-model="currentLocale"
        color="white"
        variant="outlined"
        density="compact"
        class="mr-4"
        mandatory
      >
        <v-btn value="pt" class="text-caption px-2">PT</v-btn>
        <v-btn value="en" class="text-caption px-2">EN</v-btn>
      </v-btn-toggle>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" :rail="false">
      <v-list nav density="default">
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
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()
const drawer = ref(true)

const currentLocale = ref(locale.value)

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})
</script>
