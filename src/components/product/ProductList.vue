<template>
  <div>
    <div class="d-flex align-center justify-space-between mb-6">
      <h1 class="text-h5 font-weight-bold">{{ t('product.title') }}</h1>
      <v-btn color="primary" prepend-icon="mdi-plus" @click="abrirFormulario()">
        {{ t('product.new') }}
      </v-btn>
    </div>

    <v-card elevation="1">
      <v-data-table
        :headers="colunas"
        :items="produtos"
        :loading="carregando"
        :loading-text="t('common.loading')"
        :no-data-text="t('common.noData')"
        hover
      >
        <template #item.price="{ item }">
          $ {{ formatarMoeda(item.price) }}
        </template>

        <template #item.composicao="{ item }">
          {{ t('product.compositionCount', { count: item.compositionItems?.length || 0 }) }}
        </template>

        <template #item.actions="{ item }">
          <v-btn icon="mdi-factory" variant="text" size="small" color="success" class="mr-1" title="Registrar Produção" @click="abrirProducao(item)" />
          <v-btn icon="mdi-pencil" variant="text" size="small" color="primary" @click="abrirFormulario(item)" />
          <v-btn icon="mdi-delete" variant="text" size="small" color="error" @click="confirmarExclusao(item)" />
        </template>
      </v-data-table>
    </v-card>

    <ProductForm
      v-model="dialogFormulario"
      :produto="produtoSelecionado"
      @salvo="aoSalvarProduto"
    />

    <ProductProductionForm
      v-model="dialogProducao"
      :produto="produtoProduzindo"
      @salvo="aoSalvarProducao"
    />

    <v-dialog v-model="dialogExclusao" max-width="420">
      <v-card>
        <v-card-title>{{ t('common.confirmDeletion') }}</v-card-title>
        <v-card-text>
          {{ t('product.deleteMsg') }}
          <strong>{{ produtoParaExcluir?.name }}</strong>?
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
import type { Produto } from '@/types'
import * as productService from '@/services/productService'
import { extrairMensagemErroApi } from '@/utils/extractApiErrorMessage'
import ProductForm from './ProductForm.vue'
import ProductProductionForm from './ProductProductionForm.vue'

const { t } = useI18n()

const produtos = ref<Produto[]>([])
const carregando = ref(false)
const excluindo = ref(false)

const dialogFormulario = ref(false)
const produtoSelecionado = ref<Produto | null>(null)

const dialogProducao = ref(false)
const produtoProduzindo = ref<Produto | null>(null)

const dialogExclusao = ref(false)
const produtoParaExcluir = ref<Produto | null>(null)

const snackbar = ref({ visivel: false, mensagem: '', cor: 'success' })

const colunas = computed(() => [
  { title: t('product.code'), key: 'code', sortable: true },
  { title: t('product.name'), key: 'name', sortable: true },
  { title: t('product.price'), key: 'price', sortable: true },
  { title: t('product.composition'), key: 'composicao', sortable: false },
  { title: t('common.actions'), key: 'actions', sortable: false, align: 'center' as const },
])

function formatarMoeda(valor: number): string {
  return Number(valor).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function mostrarMensagem(mensagem: string, cor = 'success') {
  snackbar.value = { visivel: true, mensagem, cor }
}

async function carregarDados() {
  carregando.value = true
  try {
    produtos.value = await productService.listarTodos()
  } catch (error: any) {
    mostrarMensagem(extrairMensagemErroApi(error, t('product.loadError')), 'error')
  } finally {
    carregando.value = false
  }
}

function abrirFormulario(produto: Produto | null = null) {
  produtoSelecionado.value = produto
  dialogFormulario.value = true
}

function abrirProducao(produto: Produto) {
  produtoProduzindo.value = produto
  dialogProducao.value = true
}

function aoSalvarProduto() {
  mostrarMensagem(t('product.saveSuccess'))
  carregarDados()
}

function aoSalvarProducao() {
  mostrarMensagem(t('product.productionSuccess'))
}

function confirmarExclusao(produto: Produto) {
  produtoParaExcluir.value = produto
  dialogExclusao.value = true
}

async function executarExclusao() {
  if (!produtoParaExcluir.value) return
  excluindo.value = true
  try {
    await productService.remover(produtoParaExcluir.value.id)
    mostrarMensagem(t('product.deleteSuccess'))
    dialogExclusao.value = false
    await carregarDados()
  } catch (error: any) {
    mostrarMensagem(extrairMensagemErroApi(error, t('product.deleteError')), 'error')
  } finally {
    excluindo.value = false
  }
}

onMounted(carregarDados)
</script>
