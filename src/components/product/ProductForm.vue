<template>
  <v-dialog :model-value="modelValue" max-width="700" persistent @update:model-value="fecharDialog">
    <v-card>
      <v-card-title>
        {{ isEditando ? t('product.edit') : t('product.new') }}
      </v-card-title>

      <v-card-text>
        <v-form ref="formRef" @submit.prevent="salvar">
          <v-row>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="formulario.code"
                :label="t('product.code')"
                :rules="[regras.obrigatorio, regras.maxCodigo]"
                counter="50"
              />
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="formulario.name"
                :label="t('product.name')"
                :rules="[regras.obrigatorio, regras.maxNome]"
                counter="120"
              />
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                v-model.number="formulario.price"
                :label="t('product.price')"
                type="number"
                min="0"
                step="0.01"
                prefix="$"
                :rules="[regras.obrigatorio, regras.naoNegativo]"
                class="mb-4"
              />
            </v-col>
          </v-row>

          <v-divider class="mb-4" />

          <div class="d-flex align-center justify-space-between mb-3">
            <span class="text-subtitle-1 font-weight-medium">{{ t('product.composition') }}</span>
            <v-btn size="small" variant="tonal" color="primary" prepend-icon="mdi-plus" @click="adicionarItem">
              {{ t('common.addItem') }}
            </v-btn>
          </div>

          <v-alert v-if="erroComposicao" type="error" variant="tonal" class="mb-4" density="compact">
            {{ erroComposicao }}
          </v-alert>

          <v-table density="compact" class="mb-4">
            <thead>
              <tr>
                <th class="text-left w-50">{{ t('product.rawMaterial') }}</th>
                <th class="text-left">{{ t('product.qty') }}</th>
                <th class="text-center w-0"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in formulario.compositionItems" :key="index">
                <td class="pt-2">
                  <v-select
                    v-model="item.rawMaterialId"
                    :items="materiasPrimas"
                    item-title="name"
                    item-value="id"
                    density="compact"
                    variant="outlined"
                    hide-details
                    placeholder="Selecione..."
                  />
                </td>
                <td class="pt-2">
                  <v-text-field
                    v-model.number="item.requiredQuantity"
                    type="number"
                    min="0"
                    step="0.01"
                    density="compact"
                    variant="outlined"
                    hide-details
                  />
                </td>
                <td class="pt-2 text-center">
                  <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="removerItem(index)" />
                </td>
              </tr>
              <tr v-if="formulario.compositionItems.length === 0">
                <td colspan="3" class="text-center text-body-2 text-grey pa-4">
                  {{ t('product.addCompositionItem') }}
                </td>
              </tr>
            </tbody>
          </v-table>
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
import { ref, watch, computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Produto, MateriaPrima, ItemComposicaoProduto } from '@/types'
import * as productService from '@/services/productService'
import * as rawMaterialService from '@/services/rawMaterialService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'

const { t } = useI18n()

const props = defineProps<{
  modelValue: boolean
  produto: Produto | null
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'salvo'): void
}>()

const formRef = ref()
const salvando = ref(false)
const materiasPrimas = ref<MateriaPrima[]>([])
const erroComposicao = ref('')

const isEditando = computed(() => !!props.produto)

const formularioInicial = () => ({
  code: '',
  name: '',
  price: 0,
  compositionItems: [] as ItemComposicaoProduto[],
})

const formulario = ref(formularioInicial())

const regras = computed(() => ({
  obrigatorio: (v: any) => !!v || v === 0 || t('common.requiredField'),
  maxCodigo: (v: string) => !v || v.length <= 50 || 'Max length is 50 characters.',
  maxNome: (v: string) => !v || v.length <= 120 || 'Max length is 120 characters.',
  naoNegativo: (v: number) => v >= 0 || 'Cannot be negative.',
}))

async function carregarMateriasPrimas() {
  try {
    materiasPrimas.value = await rawMaterialService.listarTodas()
  } catch (error) {
    console.error('Failed to load raw materials', error)
  }
}

watch(() => props.modelValue, (isOpen) => {
  if (isOpen) {
    erroComposicao.value = ''
    if (props.produto) {
      formulario.value = {
        code: props.produto.code,
        name: props.produto.name,
        price: props.produto.price,
        compositionItems: props.produto.compositionItems.map(item => ({ ...item })),
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

function adicionarItem() {
  formulario.value.compositionItems.push({
    rawMaterialId: materiasPrimas.value[0]?.id || 0,
    requiredQuantity: 1,
  })
}

function removerItem(index: number) {
  formulario.value.compositionItems.splice(index, 1)
}

function validarComposicao(): boolean {
  erroComposicao.value = ''
  if (formulario.value.compositionItems.length === 0) {
    erroComposicao.value = t('product.addCompositionItem')
    return false
  }

  const matPrimasSelecionadas = new Set()
  for (const item of formulario.value.compositionItems) {
    if (!item.rawMaterialId || item.requiredQuantity <= 0) {
      erroComposicao.value = 'All composition items must have a raw material and quantity greater than 0.'
      return false
    }
    if (matPrimasSelecionadas.has(item.rawMaterialId)) {
      erroComposicao.value = 'Duplicate raw materials are not allowed in the composition.'
      return false
    }
    matPrimasSelecionadas.add(item.rawMaterialId)
  }
  return true
}

async function salvar() {
  const { valid } = await formRef.value.validate()
  if (!valid || !validarComposicao()) return

  salvando.value = true
  try {
    const payload = {
      ...formulario.value,
      compositionItems: formulario.value.compositionItems.map(i => ({
        rawMaterialId: i.rawMaterialId,
        requiredQuantity: i.requiredQuantity
      }))
    }

    if (isEditando.value && props.produto) {
      await productService.atualizar(props.produto.id, payload)
    } else {
      await productService.criar(payload)
    }
    emit('salvo')
    fecharDialog()
  } catch (error: any) {
    alert(extrairMensagemErroApi(error, t('product.saveError')))
  } finally {
    salvando.value = false
  }
}

onMounted(() => {
  carregarMateriasPrimas()
})
</script>
