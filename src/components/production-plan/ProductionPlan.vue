<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">{{ t('productionPlan.title') }}</h1>
      <v-btn
        color="primary"
        prepend-icon="mdi-calculator"
        size="large"
        :loading="isCalculando"
        @click="calcularPlano"
      >
        {{ t('productionPlan.calculateBtn') }}
      </v-btn>
    </div>

    <v-alert v-if="erro" type="error" variant="tonal" class="mb-6" closable @click:close="erro = ''">
      {{ erro }}
    </v-alert>

    <v-card v-if="!plano && !isCalculando" elevation="1" class="pa-8 text-center">
      <v-icon icon="mdi-chart-line" size="64" color="grey" class="mb-4" />
      <p class="text-h6 text-grey">
        {{ t('productionPlan.emptyTitle') }}
      </p>
      <p class="text-body-2 text-grey-darken-1 mt-2">
        {{ t('productionPlan.emptySubtitle') }}
      </p>
    </v-card>

    <template v-if="plano">
      <v-row class="mb-4">
        <v-col cols="12" sm="6">
          <v-card color="primary" class="pa-4">
            <div class="text-overline text-white">{{ t('productionPlan.totalSalesValue') }}</div>
            <div class="text-h4 font-weight-bold text-white">
              $ {{ formatarMoeda(plano.valorTotalVenda) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="secondary" class="pa-4">
            <div class="text-overline text-white">{{ t('productionPlan.totalQtyProduced') }}</div>
            <div class="text-h4 font-weight-bold text-white">
              {{ plano.quantidadeTotalProduzida }}
            </div>
          </v-card>
        </v-col>
      </v-row>

      <v-card elevation="1" class="mb-4">
        <v-card-title class="text-h6">
          <v-icon icon="mdi-clipboard-check-outline" class="mr-2" />
          {{ t('productionPlan.suggestedItems') }}
        </v-card-title>
        <v-data-table
          :headers="colunasSugeridos"
          :items="plano.itensSugeridos"
          :no-data-text="t('common.noData')"
          density="comfortable"
          hover
        >
          <template #item.valorUnitario="{ item }">
            $ {{ formatarMoeda(item.valorUnitario) }}
          </template>
          <template #item.valorTotalItem="{ item }">
            $ {{ formatarMoeda(item.valorTotalItem) }}
          </template>
        </v-data-table>
      </v-card>

      <v-card elevation="1" class="mb-4">
        <v-card-title class="text-h6">
          <v-icon icon="mdi-package-variant-closed" class="mr-2" />
          {{ t('productionPlan.rawMaterialConsumption') }}
        </v-card-title>
        <v-data-table
          :headers="colunasConsumo"
          :items="plano.consumosMateriasPrimas"
          :no-data-text="t('common.noData')"
          density="comfortable"
          hover
        >
          <template #item.quantidadeConsumida="{ item }">
            {{ formatarNumero(item.quantidadeConsumida) }}
          </template>
          <template #item.unidadeMedida="{ item }">
            {{ t('units.' + (item.unidadeMedida || '').toLowerCase()) || item.unidadeMedida }}
          </template>
        </v-data-table>
      </v-card>

      <v-card elevation="1">
        <v-card-title class="text-h6">
          <v-icon icon="mdi-scale-balance" class="mr-2" />
          {{ t('productionPlan.rawMaterialBalance') }}
        </v-card-title>
        <v-data-table
          :headers="colunasSaldo"
          :items="plano.saldosMateriasPrimas"
          :no-data-text="t('common.noData')"
          density="comfortable"
          hover
        >
          <template #item.quantidadeInicial="{ item }">
            {{ formatarNumero(item.quantidadeInicial) }}
          </template>
          <template #item.quantidadeConsumida="{ item }">
            {{ formatarNumero(item.quantidadeConsumida) }}
          </template>
          <template #item.quantidadeSaldo="{ item }">
            <v-chip :color="Number(item.quantidadeSaldo) > 0 ? 'success' : 'warning'" size="small">
              {{ formatarNumero(item.quantidadeSaldo) }}
            </v-chip>
          </template>
          <template #item.unidadeMedida="{ item }">
            {{ t('units.' + (item.unidadeMedida || '').toLowerCase()) || item.unidadeMedida }}
          </template>
        </v-data-table>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
/**
 * Componente para exibição e cálculo do Plano Ótimo de Produção.
 * Se comunica com o algoritmo do back-end para determinar a rentabilidade máxima com o estoque atual.
 */
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SugestaoPlanoProducaoResponse } from '@/types'
import * as productionPlanService from '@/services/productionPlanService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'

const { t } = useI18n()

const plano = ref<SugestaoPlanoProducaoResponse | null>(null)
const isCalculando = ref(false)
const erro = ref('')

const colunasSugeridos = computed(() => [
  { title: t('product.code'), key: 'codigoProduto' },
  { title: t('product.name'), key: 'nomeProduto' },
  { title: t('productionPlan.suggestedQty'), key: 'quantidadeSugerida', align: 'end' as const },
  { title: t('productionPlan.unitPrice'), key: 'valorUnitario', align: 'end' as const },
  { title: t('productionPlan.totalValue'), key: 'valorTotalItem', align: 'end' as const },
])

const colunasConsumo = computed(() => [
  { title: t('rawMaterial.code'), key: 'codigoMateriaPrima' },
  { title: t('rawMaterial.name'), key: 'nomeMateriaPrima' },
  { title: t('productionPlan.consumedQty'), key: 'quantidadeConsumida', align: 'end' as const },
  { title: t('rawMaterial.unit'), key: 'unidadeMedida' },
])

const colunasSaldo = computed(() => [
  { title: t('rawMaterial.code'), key: 'codigoMateriaPrima' },
  { title: t('rawMaterial.name'), key: 'nomeMateriaPrima' },
  { title: t('productionPlan.initialQty'), key: 'quantidadeInicial', align: 'end' as const },
  { title: t('productionPlan.consumedQty'), key: 'quantidadeConsumida', align: 'end' as const },
  { title: t('productionPlan.balance'), key: 'quantidadeSaldo', align: 'end' as const },
  { title: t('rawMaterial.unit'), key: 'unidadeMedida' },
])

function formatarMoeda(valor: number): string {
  return Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatarNumero(valor: number): string {
  return Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

/**
 * Dispara o cálculo de sugestão do plano de produção e reflete o resultado em tela.
 */
async function calcularPlano() {
  isCalculando.value = true
  erro.value = ''
  plano.value = null

  try {
    plano.value = await productionPlanService.sugerirPlanoOtimo()
  } catch (e: any) {
    erro.value = extrairMensagemErroApi(e, t('productionPlan.calcError'))
  } finally {
    isCalculando.value = false
  }
}
</script>
