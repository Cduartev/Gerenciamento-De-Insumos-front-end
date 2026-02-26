<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="4">
        <v-card elevation="4" class="pa-6 rounded-xl">
          <div class="text-center mb-6">
            <v-icon size="64" color="primary">mdi-shield-account</v-icon>
            <h1 class="text-h4 font-weight-bold mt-2">{{ t('auth.loginTitle') }}</h1>
            <p class="text-subtitle-1 text-grey-darken-1">{{ t('auth.loginSubtitle') }}</p>
          </div>

          <v-form @submit.prevent="handleLogin" ref="form">
            <v-text-field
              v-model="email"
              :label="t('auth.email')"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              :rules="[v => !!v || 'Email is required']"
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
              :rules="[v => !!v || 'Password is required']"
              required
              class="mt-2"
            ></v-text-field>

            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-btn
              type="submit"
              color="primary"
              size="x-large"
              block
              :loading="loading"
              class="mt-4 rounded-lg font-weight-bold"
            >
              {{ t('auth.loginAction') }}
            </v-btn>
          </v-form>

          <div class="text-center mt-6">
            <span class="text-body-2 text-grey-darken-1">{{ t('auth.noAccount') }}</span>
            <v-btn variant="text" color="primary" class="font-weight-bold" to="/register">
              {{ t('auth.createAccount') }}
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import * as authService from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'

const { t } = useI18n()
const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  if (!email.value || !password.value) return

  loading.value = true
  error.value = ''

  try {
    const response = await authService.login({ email: email.value, password: password.value })
    authStore.setLoginData(response.token, { name: response.name, email: response.email, role: response.role })
    router.push('/')
  } catch (err: any) {
    error.value = extrairMensagemErroApi(err, t('auth.loginFailed'))
  } finally {
    loading.value = false
  }
}
</script>
