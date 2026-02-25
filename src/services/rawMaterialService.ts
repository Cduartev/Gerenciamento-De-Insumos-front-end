import api from './api'
import type { MateriaPrima, CriarMateriaPrimaRequest, AtualizarMateriaPrimaRequest } from '@/types'

export async function listarTodas(): Promise<MateriaPrima[]> {
    const { data } = await api.get<MateriaPrima[]>('/raw-materials')
    return data
}

export async function buscarPorId(id: number): Promise<MateriaPrima> {
    const { data } = await api.get<MateriaPrima>(`/raw-materials/${id}`)
    return data
}

export async function criar(request: CriarMateriaPrimaRequest): Promise<MateriaPrima> {
    const { data } = await api.post<MateriaPrima>('/raw-materials', request)
    return data
}


export async function atualizar(id: number, request: AtualizarMateriaPrimaRequest): Promise<MateriaPrima> {
    const { data } = await api.put<MateriaPrima>(`/raw-materials/${id}`, request)
    return data
}

export async function remover(id: number): Promise<void> {
    await api.delete(`/raw-materials/${id}`)
}
