import api from './api'
import type { SugestaoPlanoProducaoResponse } from '@/types'

export async function sugerirPlanoOtimo(): Promise<SugestaoPlanoProducaoResponse> {
    const { data } = await api.post<SugestaoPlanoProducaoResponse>('/plans-production/suggest')
    return data
}
