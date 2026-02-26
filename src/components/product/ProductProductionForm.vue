<template>
  <v-dialog :model-value="modelValue" @update:model-value="fechar" max-width="450">
    <v-card v-if="produto">
      <v-card-title>
        <span class="text-h6">{{ t('product.production.title') }}</span>
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" @submit.prevent="salvar">
          <p class="mb-4">
            {{ t('product.production.productLabel') }} <strong>{{ produto.name }}</strong> ({{ produto.code }})
          </p>
          <v-text-field
            v-model.number="quantidade"
            :label="t('product.production.quantityLabel')"
            type="number"
            min="1"
            :rules="regras"
            required
            variant="outlined"
          />
        </v-form>

        <v-alert
          v-if="erroApi"
          type="error"
          variant="tonal"
          class="mt-2"
          closable
          @click:close="erroApi = ''"
        >
          {{ erroApi }}
        </v-alert>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="grey-darken-1" variant="text" @click="fechar">
          {{ t('common.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="salvando"
          @click="salvar"
        >
          {{ t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Produto } from '@/types'
import * as productionService from '@/services/productionService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'
import { useNotificationStore } from '@/stores/notificationStore'

const { t } = useI18n()
const notificationStore = useNotificationStore()


const props = defineProps<{
  modelValue: boolean
  produto: Produto | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'salvo'): void
}>()

const form = ref<any>(null)
const quantidade = ref<number | null>(null)
const salvando = ref(false)
const erroApi = ref('')

const regras = [
  (v: any) => !!v || t('product.production.quantityRequired'),
  (v: number) => v >= 1 || t('product.production.minQuantity')
]

watch(
  () => props.modelValue,
  (aberto) => {
    if (aberto) {
      quantidade.value = 1
      erroApi.value = ''
      if (form.value) {
        form.value.resetValidation()
      }
    }
  }
)

function fechar() {
  emit('update:modelValue', false)
}

async function salvar() {
  if (!form.value) return
  
  const { valid } = await form.value.validate()
  if (!valid || !props.produto || !quantidade.value) return

  salvando.value = true
  erroApi.value = ''

  try {
    await productionService.registrarProducao({
      productId: props.produto.id,
      quantity: quantidade.value
    })
    
    emit('salvo')
    fechar()
  } catch (error: any) {
    const errorMsg = extrairMensagemErroApi(error, t('product.production.saveError'))
    erroApi.value = errorMsg

    const rawMsg = error?.response?.data?.mensagem || error?.response?.data?.message || ''
    if (rawMsg.includes('Estoque insuficiente')) {
      notificationStore.addNotification({
        type: 'error',
        title: t('notifications.productionBlockedTitle'),
        message: t('notifications.productionBlockedBody')
      })
    }
  } finally {
    salvando.value = false
  }
}
</script>
