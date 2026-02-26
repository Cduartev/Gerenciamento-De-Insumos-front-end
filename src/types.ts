export interface MateriaPrima {
  id: number
  code: string
  name: string
  stockQuantity: number
  unitOfMeasurement: string
}

export interface CriarMateriaPrimaRequest {
  code: string
  name: string
  stockQuantity: number
  unitOfMeasurement: string
}

export interface AtualizarMateriaPrimaRequest {
  code: string
  name: string
  stockQuantity: number
  unitOfMeasurement: string
}

export interface ItemComposicaoProduto {
  id?: number
  rawMaterialId: number
  codeRawMaterial?: string
  nameRawMaterial?: string
  unitOfMeasurement?: string
  requiredQuantity: number
}

export interface Produto {
  id: number
  code: string
  name: string
  price: number
  compositionItems: ItemComposicaoProduto[]
}

export interface CriarProdutoRequest {
  code: string
  name: string
  price: number
  compositionItems: { rawMaterialId: number; requiredQuantity: number }[]
}

export interface AtualizarProdutoRequest {
  code: string
  name: string
  price: number
  compositionItems: { rawMaterialId: number; requiredQuantity: number }[]
}

export interface ItemSugestaoProducao {
  productId: number
  codeProduct: string
  nameProduct: string
  suggestedQuantity: number
  priceUnitario: number
  totalItemValue: number
}

export interface ConsumoMateriaPrima {
  rawMaterialId: number
  codeRawMaterial: string
  nameRawMaterial: string
  unitOfMeasurement: string
  consumedQuantity: number
}

export interface SaldoMateriaPrima {
  rawMaterialId: number
  codeRawMaterial: string
  nameRawMaterial: string
  unitOfMeasurement: string
  initialQuantity: number
  consumedQuantity: number
  balanceQuantity: number
}

export interface SugestaoPlanoProducaoResponse {
  totalSalesValue: number
  totalProducedQuantity: number
  suggestedItems: ItemSugestaoProducao[]
  rawMaterialConsumptions: ConsumoMateriaPrima[]
  rawMaterialBalances: SaldoMateriaPrima[]
}

export interface User {
  name: string
  email: string
  role: string
}

export interface LoginResponse {
  token: string
  name: string
  email: string
  role: string
}
