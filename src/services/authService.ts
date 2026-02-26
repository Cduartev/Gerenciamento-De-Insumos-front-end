import api from './api'
import type { LoginResponse } from '@/types'

export async function login(data: any): Promise<LoginResponse> {
    const response = await api.post('/auth/login', data)
    return response.data
}

export async function register(data: any): Promise<void> {
    await api.post('/auth/register', data)
}
