<template>
  <v-app>
    <v-app-bar color="primary" density="default" elevation="2">
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-app-bar-title class="font-weight-bold">
        <v-icon icon="mdi-factory" class="mr-2" />
        {{ t('app.title') }}
      </v-app-bar-title>

      <v-spacer></v-spacer>

      <v-menu v-model="menuNotificacoes" :close-on-content-click="false" location="bottom end">
        <template v-slot:activator="{ props }">
          <v-btn icon variant="text" class="mr-2" v-bind="props">
            <v-badge
              v-if="notificationStore.unreadCount > 0"
              :content="notificationStore.unreadCount"
              color="error"
              floating
            >
              <v-icon>mdi-bell-outline</v-icon>
            </v-badge>
            <v-icon v-else>mdi-bell-outline</v-icon>
          </v-btn>
        </template>

        <v-card min-width="350" max-width="450" class="mt-2" elevation="4">
          <v-card-title class="d-flex justify-space-between align-center px-4 py-2 text-subtitle-1 font-weight-bold">
            {{ t('notifications.title') }}
            <v-btn
              v-if="notificationStore.notifications.length > 0"
              variant="text"
              size="small"
              color="primary"
              @click="notificationStore.markAllAsRead()"
            >
              {{ t('notifications.markAllRead') }}
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-list v-if="notificationStore.notifications.length > 0" class="pa-0" max-height="400" >
            <template v-for="(notif, idx) in notificationStore.notifications" :key="notif.id">
              <v-list-item
                :class="{ 'bg-grey-lighten-4': !notif.read }"
                class="py-3 px-4"
                @click="notificationStore.markAsRead(notif.id)"
              >
                <template v-slot:prepend>
                  <v-icon
                    :color="notif.type === 'error' ? 'error' : notif.type === 'warning' ? 'warning' : 'info'"
                    :icon="notif.type === 'error' ? 'mdi-alert-circle' : notif.type === 'warning' ? 'mdi-alert' : 'mdi-information'"
                    size="large"
                    class="mr-3"
                  ></v-icon>
                </template>

                <v-list-item-title class="font-weight-medium text-body-2 mb-1" style="white-space: normal">
                  {{ notif.title }}
                </v-list-item-title>
                <v-list-item-subtitle class="text-caption" style="white-space: normal">
                  {{ notif.message }}
                </v-list-item-subtitle>
                
                <template v-slot:append>
                  <v-btn
                    icon="mdi-close"
                    variant="text"
                    size="small"
                    color="grey"
                    @click.stop="notificationStore.removeNotification(notif.id)"
                  />
                </template>
              </v-list-item>
              <v-divider v-if="idx < notificationStore.notifications.length - 1"></v-divider>
            </template>
          </v-list>
          
          <div v-else class="pa-6 text-center text-grey-darken-1 text-body-2">
            <v-icon icon="mdi-bell-sleep" size="large" class="mb-2"></v-icon>
            <div>{{ t('notifications.empty') }}</div>
          </div>
        </v-card>
      </v-menu>

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
import { ref, watch, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useNotificationStore } from '@/stores/notificationStore'

const { t, locale } = useI18n()
const drawer = ref(true)
const menuNotificacoes = ref(false)
const notificationStore = useNotificationStore()

const currentLocale = ref(locale.value)

onMounted(() => {
  notificationStore.checkLowStock()
})

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})
</script>
