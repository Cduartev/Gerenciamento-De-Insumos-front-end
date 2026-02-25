import api from './api'
import type { MateriaPrima, CriarMateriaPrimaRequest, AtualizarMateriaPrimaRequest } from '@/types'

/**
 * Busca a lista de todas as matérias-primas cadastradas no estoque.
 * @returns Uma Promise com um array de objetos MateriaPrima.
 */
export async function listarTodas(): Promise<MateriaPrima[]> {
    const { data } = await api.get<MateriaPrima[]>('/raw-materials')
    return data
}

/**
 * Busca uma matéria-prima específica pelo seu identificador único.
 * @param id - ID numérico da matéria-prima.
 * @returns Uma Promise com os dados da MateriaPrima.
 */
export async function buscarPorId(id: number): Promise<MateriaPrima> {
    const { data } = await api.get<MateriaPrima>(`/raw-materials/${id}`)
    return data
}

/**
 * Cria/registra uma nova matéria-prima no sistema.
 * @param request - Dados essenciais para o cadastro da matéria-prima.
 * @returns Uma Promise com a matéria-prima criada.
 */
export async function criar(request: CriarMateriaPrimaRequest): Promise<MateriaPrima> {
    const { data } = await api.post<MateriaPrima>('/raw-materials', request)
    return data
}

/**
 * Atualiza as informações (ex: quantidade disponível) de uma matéria-prima.
 * @param id - ID da matéria-prima.
 * @param request - Objeto com os campos para atualização.
 * @returns Uma Promise contendo os dados atualizados.
 */
export async function atualizar(id: number, request: AtualizarMateriaPrimaRequest): Promise<MateriaPrima> {
    const { data } = await api.put<MateriaPrima>(`/raw-materials/${id}`, request)
    return data
}

/**
 * Remove (exclui) uma matéria-prima do sistema.
 * @param id - ID numérico da matéria-prima a excluir.
 */
export async function remover(id: number): Promise<void> {
    await api.delete(`/raw-materials/${id}`)
}
