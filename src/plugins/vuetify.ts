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
          // Vale brand colors
          primary: '#007E7A', // Verde Vale (Pantone 328 C)
          secondary: '#ECB11F', // Amarelo Vale (Pantone 124 C)
          // Support / neutrals
          'vale-gray': '#747678', // Cinza Vale (Pantone Cool Gray 9 C)
          'white': '#FFFFFF',

          // map common semantic colors to accessible variants
          accent: '#00574f',
          error: '#D32F2F',
          warning: '#F57C00',
          info: '#0288D1',
          success: '#388E3C',
        },
      },
      dark: {
        colors: {
          primary: '#007E7A',
          secondary: '#ECB11F',
          'vale-gray': '#747678',
          'white': '#FFFFFF',
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
