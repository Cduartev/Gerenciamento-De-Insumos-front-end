import api from './api'
import type { Produto, CriarProdutoRequest, AtualizarProdutoRequest } from '@/types'


export async function listarTodos(): Promise<Produto[]> {
    const { data } = await api.get<Produto[]>('/products')
    return data
}


export async function buscarPorId(id: number): Promise<Produto> {
    const { data } = await api.get<Produto>(`/products/${id}`)
    return data
}


export async function criar(request: CriarProdutoRequest): Promise<Produto> {
    const { data } = await api.post<Produto>('/products', request)
    return data
}
export async function atualizar(id: number, request: AtualizarProdutoRequest): Promise<Produto> {
    const { data } = await api.put<Produto>(`/products/${id}`, request)
    return data
}


export async function remover(id: number): Promise<void> {
    await api.delete(`/products/${id}`)
}
