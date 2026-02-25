<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">{{ t('rawMaterial.title') }}</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirFormulario()">
        {{ t('rawMaterial.new') }}
      </v-btn>
    </div>

    <v-card elevation="1">
      <v-data-table
        :headers="colunas"
        :items="materiasPrimas"
        :loading="carregando"
        :loading-text="t('common.loading')"
        :no-data-text="t('common.noData')"
        hover
      >
        <template #item.stockQuantity="{ item }">
          {{ formatarNumero(item.stockQuantity) }}
        </template>

        <template #item.unitOfMeasurement="{ item }">
          {{ t('units.' + (item.unitOfMeasurement || '').toLowerCase()) || item.unitOfMeasurement }}
        </template>

        <template #item.actions="{ item }">
          <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="abrirFormulario(item)" />
          <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmarExclusao(item)" />
        </template>
      </v-data-table>
    </v-card>

    <RawMaterialForm
      v-model="dialogFormulario"
      :materia-prima="materiaPrimaSelecionada"
      @salvo="carregarDados"
    />

    <v-dialog v-model="dialogExclusao" max-width="420">
      <v-card>
        <v-card-title>{{ t('common.confirmDeletion') }}</v-card-title>
        <v-card-text>
          {{ t('rawMaterial.deleteMsg') }}
          <strong>{{ materiaPrimaParaExcluir?.name }}</strong>?
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="dialogExclusao = false">{{ t('common.cancel') }}</v-btn>
          <v-btn color="error" variant="flat" :loading="excluindo" @click="executarExclusao">
            {{ t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar v-model="snackbar.visivel" :color="snackbar.cor" :timeout="3000" location="bottom right">
      {{ snackbar.mensagem }}
    </v-snackbar>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { MateriaPrima } from '@/types'
import * as rawMaterialService from '@/services/rawMaterialService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'
import RawMaterialForm from './RawMaterialForm.vue'

const { t } = useI18n()

const materiasPrimas = ref<MateriaPrima[]>([])
const carregando = ref(false)
const excluindo = ref(false)

const dialogFormulario = ref(false)
const materiaPrimaSelecionada = ref<MateriaPrima | null>(null)

const dialogExclusao = ref(false)
const materiaPrimaParaExcluir = ref<MateriaPrima | null>(null)

const snackbar = ref({ visivel: false, mensagem: '', cor: 'success' })

const colunas = computed(() => [
  { title: t('rawMaterial.code'), key: 'code', sortable: true },
  { title: t('rawMaterial.name'), key: 'name', sortable: true },
  { title: t('rawMaterial.stockQty'), key: 'stockQuantity', sortable: true },
  { title: t('rawMaterial.unit'), key: 'unitOfMeasurement', sortable: false },
  { title: t('common.actions'), key: 'actions', sortable: false, align: 'center' as const },
])

function formatarNumero(valor: number): string {
  return Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })
}

function mostrarMensagem(mensagem: string, cor = 'success') {
  snackbar.value = { visivel: true, mensagem, cor }
}

async function carregarDados() {
  carregando.value = true
  try {
    materiasPrimas.value = await rawMaterialService.listarTodas()
  } catch (error: any) {
    mostrarMensagem(extrairMensagemErroApi(error, t('rawMaterial.loadError')), 'error')
  } finally {
    carregando.value = false
  }
}

function abrirFormulario(materiaPrima: MateriaPrima | null = null) {
  materiaPrimaSelecionada.value = materiaPrima
  dialogFormulario.value = true
}

function confirmarExclusao(materiaPrima: MateriaPrima) {
  materiaPrimaParaExcluir.value = materiaPrima
  dialogExclusao.value = true
}

async function executarExclusao() {
  if (!materiaPrimaParaExcluir.value) return
  excluindo.value = true
  try {
    await rawMaterialService.remover(materiaPrimaParaExcluir.value.id)
    mostrarMensagem(t('rawMaterial.deleteSuccess'))
    dialogExclusao.value = false
    await carregarDados()
  } catch (error: any) {
    mostrarMensagem(extrairMensagemErroApi(error, t('rawMaterial.deleteError')), 'error')
  } finally {
    excluindo.value = false
  }
}

onMounted(carregarDados)
</script>
