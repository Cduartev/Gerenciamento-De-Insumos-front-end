import api from './api'
import type { Produto, CriarProdutoRequest, AtualizarProdutoRequest } from '@/types'

/**
 * Busca a lista de todos os produtos cadastrados no sistema.
 * @returns Uma Promise com um array de objetos Produto.
 */
export async function listarTodos(): Promise<Produto[]> {
    const { data } = await api.get<Produto[]>('/produtos')
    return data
}

/**
 * Busca um produto específico pelo seu identificador único.
 * @param id - ID numérico do produto.
 * @returns Uma Promise com os dados do Produto.
 */
export async function buscarPorId(id: number): Promise<Produto> {
    const { data } = await api.get<Produto>(`/produtos/${id}`)
    return data
}

/**
 * Cria um novo produto no sistema.
 * @param request - Dados necessários para a criação do Produto.
 * @returns Uma Promise com o Produto recém-criado.
 */
export async function criar(request: CriarProdutoRequest): Promise<Produto> {
    const { data } = await api.post<Produto>('/produtos', request)
    return data
}

/**
 * Atualiza os dados de um produto existente.
 * @param id - ID do produto que será atualizado.
 * @param request - Dados atualizados do produto.
 * @returns Uma Promise com o Produto atualizado.
 */
export async function atualizar(id: number, request: AtualizarProdutoRequest): Promise<Produto> {
    const { data } = await api.put<Produto>(`/produtos/${id}`, request)
    return data
}

/**
 * Remove (exclui) um produto do sistema.
 * @param id - ID do produto a ser removido.
 */
export async function remover(id: number): Promise<void> {
    await api.delete(`/produtos/${id}`)
}
