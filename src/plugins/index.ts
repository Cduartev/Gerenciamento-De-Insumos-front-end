import type { App } from 'vue'
import vuetify from './vuetify'
import router from '../router'
import { createPinia } from 'pinia'
import { i18n } from './i18n'

export function registerPlugins(app: App) {
    app.use(i18n)
    app.use(vuetify)
    app.use(router)
    app.use(createPinia())
}