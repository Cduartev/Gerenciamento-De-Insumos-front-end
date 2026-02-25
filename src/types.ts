export interface MateriaPrima {
  id: number
  codigo: string
  nome: string
  quantidadeEstoque: number
  unidadeMedida: string
}

export interface CriarMateriaPrimaRequest {
  codigo: string
  nome: string
  quantidadeEstoque: number
  unidadeMedida: string
}

export interface AtualizarMateriaPrimaRequest {
  codigo: string
  nome: string
  quantidadeEstoque: number
  unidadeMedida: string
}

export interface ItemComposicaoProduto {
  id?: number
  materiaPrimaId: number
  codigoMateriaPrima?: string
  nomeMateriaPrima?: string
  unidadeMedida?: string
  quantidadeNecessaria: number
}

export interface Produto {
  id: number
  codigo: string
  nome: string
  valor: number
  itensComposicao: ItemComposicaoProduto[]
}

export interface CriarProdutoRequest {
  codigo: string
  nome: string
  valor: number
  itensComposicao: { materiaPrimaId: number; quantidadeNecessaria: number }[]
}

export interface AtualizarProdutoRequest {
  codigo: string
  nome: string
  valor: number
  itensComposicao: { materiaPrimaId: number; quantidadeNecessaria: number }[]
}

export interface ItemSugestaoProducao {
  produtoId: number
  codigoProduto: string
  nomeProduto: string
  quantidadeSugerida: number
  valorUnitario: number
  valorTotalItem: number
}

export interface ConsumoMateriaPrima {
  materiaPrimaId: number
  codigoMateriaPrima: string
  nomeMateriaPrima: string
  unidadeMedida: string
  quantidadeConsumida: number
}

export interface SaldoMateriaPrima {
  materiaPrimaId: number
  codigoMateriaPrima: string
  nomeMateriaPrima: string
  unidadeMedida: string
  quantidadeInicial: number
  quantidadeConsumida: number
  quantidadeSaldo: number
}

export interface SugestaoPlanoProducaoResponse {
  valorTotalVenda: number
  quantidadeTotalProduzida: number
  itensSugeridos: ItemSugestaoProducao[]
  consumosMateriasPrimas: ConsumoMateriaPrima[]
  saldosMateriasPrimas: SaldoMateriaPrima[]
}
