import api from './api'

export interface CreateProductionParams {
  productId: number;
  quantity: number;
}

export async function registrarProducao(params: CreateProductionParams): Promise<void> {
  await api.post('/productions', params)
}
