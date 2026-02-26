<template>
  <v-container fluid class="fill-height bg-grey-lighten-4">
    <v-row justify="center" align="center">
      <v-col cols="12" sm="8" md="5" lg="4">
        <v-card elevation="4" class="pa-6 rounded-xl">
          <div class="text-center mb-6">
            <v-icon size="64" color="secondary">mdi-account-plus</v-icon>
            <h1 class="text-h4 font-weight-bold mt-2">{{ t('auth.registerTitle') }}</h1>
            <p class="text-subtitle-1 text-grey-darken-1">{{ t('auth.registerSubtitle') }}</p>
          </div>

          <v-form @submit.prevent="handleRegister" ref="form">
            <v-text-field
              v-model="name"
              :label="t('auth.name')"
              prepend-inner-icon="mdi-account"
              variant="outlined"
              :rules="[v => !!v || 'Name is required']"
              required
            ></v-text-field>

            <v-text-field
              v-model="email"
              :label="t('auth.email')"
              prepend-inner-icon="mdi-email"
              variant="outlined"
              :rules="[v => !!v || 'Email is required']"
              required
              class="mt-2"
            ></v-text-field>

            <v-text-field
              v-model="password"
              :label="t('auth.password')"
              prepend-inner-icon="mdi-lock"
              :type="showPassword ? 'text' : 'password'"
              :append-inner-icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"
              @click:append-inner="showPassword = !showPassword"
              variant="outlined"
              :rules="[v => !!v || 'Password is required', v => v.length >= 6 || 'Password must be at least 6 characters']"
              required
              class="mt-2"
            ></v-text-field>

            <v-alert v-if="error" type="error" variant="tonal" class="mb-4">
              {{ error }}
            </v-alert>

            <v-alert v-if="success" type="success" variant="tonal" class="mb-4">
              {{ t('auth.registerSuccess') }}
            </v-alert>

            <v-btn
              type="submit"
              color="secondary"
              size="x-large"
              block
              :loading="loading"
              class="mt-4 rounded-lg font-weight-bold"
            >
              {{ t('auth.registerAction') }}
            </v-btn>
          </v-form>

          <div class="text-center mt-6">
            <span class="text-body-2 text-grey-darken-1">{{ t('auth.alreadyHasAccount') }}</span>
            <v-btn variant="text" color="primary" class="font-weight-bold" to="/login">
              {{ t('auth.loginHere') }}
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
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'

const { t } = useI18n()
const router = useRouter()

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
