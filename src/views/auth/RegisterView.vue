<template>
  <div class="login-background d-flex align-center justify-center fill-height">
    <!-- Language Switcher absolutely positioned at the top right -->
    <div class="lang-switcher">
      <v-btn-toggle
        v-model="currentLocale"
        color="primary"
        variant="flat"
        density="compact"
        class="rounded-pill elevation-2 lang-toggle-bg"
        mandatory
      >
        <v-btn value="pt" class="px-3" title="Português">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 504" width="24" height="18">
            <rect width="720" height="504" fill="#009b3a"/>
            <path d="M360 84L636 252L360 420L84 252Z" fill="#fedf00"/>
            <circle cx="360" cy="252" r="118" fill="#002776"/>
          </svg>
        </v-btn>
        <v-btn value="en" class="px-3" title="English">
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
    </div>

    <v-container fluid>
      <v-row justify="center" align="center">
        <v-col cols="12" sm="8" md="5" lg="4">
          <v-card elevation="12" class="pa-8 pb-10 rounded-xl login-card">
            
            <!-- Graphic Industrial Header -->
            <div class="text-center mb-8 form-header">
              <div class="logo-wrapper mx-auto mb-6">
                <img src="/Logotipo_Vale.svg" alt="Vale Logo" style="max-height: 50px; width: auto; display: block;" />
              </div>
              <h1 class="text-h4 font-weight-black text-primary text-uppercase mb-2" style="letter-spacing: 1px;">
                {{ t('auth.registerTitle') }}
              </h1>
              <p class="text-subtitle-1 text-grey-darken-2">{{ t('auth.registerSubtitle') }}</p>
            </div>

            <v-form @submit.prevent="handleRegister" ref="form">
              <v-text-field
                v-model="name"
                :label="t('auth.name')"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                color="primary"
                base-color="grey-darken-1"
                class="mb-2"
                :rules="[v => !!v || t('auth.nameRequired', 'Name is required')]"
                required
              ></v-text-field>

              <v-text-field
                v-model="email"
                :label="t('auth.email')"
                prepend-inner-icon="mdi-email"
                variant="outlined"
                color="primary"
                base-color="grey-darken-1"
                class="mb-2"
                :rules="[v => !!v || t('auth.emailRequired', 'Email is required')]"
                required
              ></v-text-field>

              <v-text-field
                v-model="password"
                :label="t('auth.password')"
                prepend-inner-icon="mdi-lock"
                :type="showPassword ? 'text' : 'password'"
                :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
                @click:append-inner="showPassword = !showPassword"
                variant="outlined"
                color="primary"
                base-color="grey-darken-1"
                class="mb-2"
                :rules="[v => !!v || t('auth.passwordRequired', 'Password is required'), v => v.length >= 6 || t('auth.passwordLength', 'Password must be at least 6 characters')]"
                required
              ></v-text-field>

              <v-alert v-if="error" type="error" variant="tonal" class="mb-4 font-weight-medium" border="start">
                {{ error }}
              </v-alert>

              <v-alert v-if="success" type="success" variant="tonal" class="mb-4 font-weight-medium" border="start">
                {{ t('auth.registerSuccess') }}
              </v-alert>

              <v-btn
                type="submit"
                color="secondary"
                size="x-large"
                block
                :loading="loading"
                elevation="4"
                class="mt-4 rounded-lg font-weight-bold text-uppercase button-glow"
              >
                {{ t('auth.registerAction') }}
              </v-btn>
            </v-form>

            <div class="text-center mt-8">
              <span class="text-body-2 text-grey-darken-1 font-weight-medium">{{ t('auth.haveAccount', 'Já possui uma conta?') }}</span>
              <v-btn variant="text" color="primary" class="font-weight-bold ml-2" to="/login">
                {{ t('auth.loginLink') }}
              </v-btn>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as authService from '@/services/authService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'

const { t, locale } = useI18n()
const router = useRouter()

const currentLocale = ref(locale.value)

watch(currentLocale, (newLocale) => {
  locale.value = newLocale
})

const name = ref('')
const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')
const success = ref(false)

const handleRegister = async () => {
  if (!email.value || !password.value || !name.value) return

  loading.value = true
  error.value = ''
  success.value = false

  try {
    await authService.register({ name: name.value, email: email.value, password: password.value, role: 'USER' })
    success.value = true
    setTimeout(() => {
      router.push('/login')
    }, 2000)
  } catch (err: any) {
    error.value = extrairMensagemErroApi(err, t('auth.registerFailed'))
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-background {
  background: linear-gradient(135deg, #004731 0%, #008e5b 100%);
  min-height: 100vh;
  position: relative;
}

.login-background::before {
  content: "";
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background-image: radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
  background-size: 32px 32px;
  pointer-events: none;
}

.lang-switcher {
  position: absolute;
  top: 24px;
  right: 24px;
  z-index: 10;
}

.lang-toggle-bg {
  background-color: rgba(255, 255, 255, 0.9) !important;
  backdrop-filter: blur(4px);
}

.login-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(10px);
  position: relative;
  z-index: 1;
  border-radius: 24px !important;
  box-shadow: 0 20px 40px rgba(0,0,0,0.2) !important;
}

.logo-wrapper {
  display: inline-flex;
  padding: 12px 24px;
  background: transparent;
}

.button-glow:hover {
  box-shadow: 0 0 15px rgba(255, 184, 28, 0.4) !important;
}

/* For dark mode consistency if they switch */
:deep(.v-theme--dark) .login-card {
  background: #1e1e1e !important;
}
:deep(.v-theme--dark) .lang-toggle-bg {
  background-color: rgba(30, 30, 30, 0.9) !important;
}
</style>
