import { createVuetify } from 'vuetify'
import { pt, en } from 'vuetify/locale'
import { createVueI18nAdapter as createVuetifyI18nAdapter } from 'vuetify/locale/adapters/vue-i18n'
import { useI18n, i18n } from './i18n'

import '@mdi/font/css/materialdesignicons.css'
import '../styles/layers.css'
import 'vuetify/styles'

export default createVuetify({
  locale: {
    adapter: createVuetifyI18nAdapter({ i18n, useI18n }),
  },
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        colors: {
          primary: '#1565C0',
          secondary: '#42A5F5',
          accent: '#FF6F00',
          error: '#D32F2F',
          warning: '#FFA000',
          info: '#0288D1',
          success: '#2E7D32',
        },
      },
    },
  },
  display: {
    mobileBreakpoint: 'md',
    thresholds: {
      xs: 0,
      sm: 600,
      md: 840,
      lg: 1145,
      xl: 1545,
      xxl: 2138,
    },
  },
})
