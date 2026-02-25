<template>
  <v-dialog :model-value="modelValue" @update:model-value="fechar" max-width="450">
    <v-card v-if="produto">
      <v-card-title>
        <span class="text-h6">Registrar Produção</span>
      </v-card-title>
      
      <v-card-text>
        <v-form ref="form" @submit.prevent="salvar">
          <p class="mb-4">
            Produto: <strong>{{ produto.name }}</strong> ({{ produto.code }})
          </p>
          <v-text-field
            v-model.number="quantidade"
            label="Quantidade a Produzir"
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
          Cancelar
        </v-btn>
        <v-btn
          color="primary"
          variant="flat"
          :loading="salvando"
          @click="salvar"
        >
          Salvar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue'
import type { Produto } from '@/types'
import * as productionService from '@/services/productionService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'

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
  (v: any) => !!v || 'Quantidade é obrigatória',
  (v: number) => v >= 1 || 'Mínimo de 1 unidade'
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
    erroApi.value = extrairMensagemErroApi(error, 'Erro ao registrar produção')
  } finally {
    salvando.value = false
  }
}
</script>
