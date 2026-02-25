import axios from 'axios'

/**
 * Instância do Axios configurada para comunicação com a API do back-end.
 * Define a URL base e os cabeçalhos padrão para todas as requisições.
 */
const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default api
