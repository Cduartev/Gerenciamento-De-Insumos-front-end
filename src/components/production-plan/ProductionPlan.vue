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
              $ {{ formatarMoeda(plano.totalSalesValue) }}
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6">
          <v-card color="secondary" class="pa-4">
            <div class="text-overline text-white">{{ t('productionPlan.totalQtyProduced') }}</div>
            <div class="text-h4 font-weight-bold text-white">
              {{ plano.totalProducedQuantity }}
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
          :items="plano.suggestedItems"
          :no-data-text="t('common.noData')"
          density="comfortable"
          hover
        >
          <template #item.priceUnitario="{ item }">
            $ {{ formatarMoeda(item.priceUnitario) }}
          </template>
          <template #item.totalItemValue="{ item }">
            $ {{ formatarMoeda(item.totalItemValue) }}
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
          :items="plano.rawMaterialConsumptions"
          :no-data-text="t('common.noData')"
          density="comfortable"
          hover
        >
          <template #item.consumedQuantity="{ item }">
            {{ formatarNumero(item.consumedQuantity) }}
          </template>
          <template #item.unitOfMeasurement="{ item }">
            {{ t('units.' + (item.unitOfMeasurement || '').toLowerCase()) || item.unitOfMeasurement }}
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
          :items="plano.rawMaterialBalances"
          :no-data-text="t('common.noData')"
          density="comfortable"
          hover
        >
          <template #item.initialQuantity="{ item }">
            {{ formatarNumero(item.initialQuantity) }}
          </template>
          <template #item.consumedQuantity="{ item }">
            {{ formatarNumero(item.consumedQuantity) }}
          </template>
          <template #item.balanceQuantity="{ item }">
            <v-chip :color="Number(item.balanceQuantity) > 0 ? 'success' : 'warning'" size="small">
              {{ formatarNumero(item.balanceQuantity) }}
            </v-chip>
          </template>
          <template #item.unitOfMeasurement="{ item }">
            {{ t('units.' + (item.unitOfMeasurement || '').toLowerCase()) || item.unitOfMeasurement }}
          </template>
        </v-data-table>
      </v-card>
    </template>
  </div>
</template>

<script lang="ts" setup>
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
  { title: t('product.code'), key: 'codeProduct' },
  { title: t('product.name'), key: 'nameProduct' },
  { title: t('productionPlan.suggestedQty'), key: 'suggestedQuantity', align: 'end' as const },
  { title: t('productionPlan.unitPrice'), key: 'priceUnitario', align: 'end' as const },
  { title: t('productionPlan.totalValue'), key: 'totalItemValue', align: 'end' as const },
])

const colunasConsumo = computed(() => [
  { title: t('rawMaterial.code'), key: 'codeRawMaterial' },
  { title: t('rawMaterial.name'), key: 'nameRawMaterial' },
  { title: t('productionPlan.consumedQty'), key: 'consumedQuantity', align: 'end' as const },
  { title: t('rawMaterial.unit'), key: 'unitOfMeasurement' },
])

const colunasSaldo = computed(() => [
  { title: t('rawMaterial.code'), key: 'codeRawMaterial' },
  { title: t('rawMaterial.name'), key: 'nameRawMaterial' },
  { title: t('productionPlan.initialQty'), key: 'initialQuantity', align: 'end' as const },
  { title: t('productionPlan.consumedQty'), key: 'consumedQuantity', align: 'end' as const },
  { title: t('productionPlan.balance'), key: 'balanceQuantity', align: 'end' as const },
  { title: t('rawMaterial.unit'), key: 'unitOfMeasurement' },
])

function formatarMoeda(valor: number): string {
  return Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function formatarNumero(valor: number): string {
  return Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

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
