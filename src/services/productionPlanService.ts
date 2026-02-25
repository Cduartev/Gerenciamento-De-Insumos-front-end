import api from './api'
import type { SugestaoPlanoProducaoResponse } from '@/types'

/**
 * Solicita ao back-end uma sugestão de plano ótimo de produção,  
 * levando em conta os produtos e as matérias-primas disponíveis.
 * @returns Uma Promise contendo o plano de produção com o lucro máximo e o detalhamento da produção.
 */
export async function sugerirPlanoOtimo(): Promise<SugestaoPlanoProducaoResponse> {
    const { data } = await api.post<SugestaoPlanoProducaoResponse>('/planos-producao/sugerir')
    return data
}
