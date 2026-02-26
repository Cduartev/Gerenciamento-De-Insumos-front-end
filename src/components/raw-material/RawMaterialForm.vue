<template>
  <v-dialog :model-value="modelValue" max-width="520" persistent @update:model-value="fecharDialog">
    <v-card>
      <v-card-title>
        {{ isEditando ? t('rawMaterial.edit') : t('rawMaterial.new') }}
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="salvar">
          <v-text-field
            v-model="formulario.code"
            :label="t('rawMaterial.code')"
            :rules="[regras.obrigatorio, regras.maxCodigo]"
            counter="50"
            class="mb-2"
          />
          <v-text-field
            v-model="formulario.name"
            :label="t('rawMaterial.name')"
            :rules="[regras.obrigatorio, regras.maxNome]"
            counter="120"
            class="mb-2"
          />
          <v-text-field
            v-model.number="formulario.stockQuantity"
            :label="t('rawMaterial.stockQty')"
            type="number"
            min="0"
            step="0.01"
            :rules="[regras.obrigatorio, regras.naoNegativo]"
            class="mb-2"
          />
          <v-select
            v-model="formulario.unitOfMeasurement"
            :label="t('rawMaterial.unit')"
            :items="UNIDADES_MEDIDA"
            item-title="title"
            item-value="value"
            :rules="[regras.obrigatorio]"
          >
            <template #item="{ props, item }">
              <v-list-item v-bind="props" :title="(item as any)?.raw?.value ? t(`units.${(item as any).raw.value.toLowerCase()}`) : (item as any)?.title || ''" />
            </template>
            <template #selection="{ item }">
              {{ (item as any)?.raw?.value ? t(`units.${(item as any).raw.value.toLowerCase()}`) : (item as any)?.title || '' }}
            </template>
          </v-select>
        </v-form>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="text" @click="fecharDialog">{{ t('common.cancel') }}</v-btn>
        <v-btn color="primary" variant="flat" :loading="salvando" @click="salvar">
          {{ t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MateriaPrima } from '@/types'
import { UNIDADES_MEDIDA } from '@/constants/unitOfMeasure'
import * as rawMaterialService from '@/services/rawMaterialService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
  materiaPrima: MateriaPrima | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'salvo'): void
}>()

const formRef = ref()
const salvando = ref(false)

const isEditando = computed(() => !!props.materiaPrima)

const formularioInicial = () => ({
  code: '',
  name: '',
  stockQuantity: 0,
  unitOfMeasurement: '',
})

const formulario = ref(formularioInicial())

const regras = computed(() => ({
  obrigatorio: (v: any) => !!v || v === 0 || t('common.requiredField'),
  maxCodigo: (v: string) => !v || v.length <= 50 || t('common.maxLen', { max: 50 }),
  maxNome: (v: string) => !v || v.length <= 120 || t('common.maxLen', { max: 120 }),
  naoNegativo: (v: number) => v >= 0 || t('common.nonNegative'),
}))

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    if (props.materiaPrima) {
      formulario.value = {
        code: props.materiaPrima.code,
        name: props.materiaPrima.name,
        stockQuantity: props.materiaPrima.stockQuantity,
        unitOfMeasurement: props.materiaPrima.unitOfMeasurement,
      }
    } else {
      formulario.value = formularioInicial()
    }
    if (formRef.value) {
      formRef.value.resetValidation()
    }
  }
})

function fecharDialog() {
  emit('update:modelValue', false)
}

async function salvar() {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  salvando.value = true
  try {
    if (isEditando.value && props.materiaPrima) {
      await rawMaterialService.atualizar(props.materiaPrima.id, formulario.value)
    } else {
      await rawMaterialService.criar(formulario.value)
    }
    emit('salvo')
    fecharDialog()
  } catch (error: any) {
    alert(extrairMensagemErroApi(error, t('rawMaterial.saveError')))
  } finally {
    salvando.value = false
  }
}
</script>
