import { defineStore } from 'pinia'
import { ref } from 'vue'
import { jwtDecode } from 'jwt-decode'
import type { User } from '@/types'

export const useAuthStore = defineStore('auth', () => {
    const token = ref<string | null>(localStorage.getItem('@inventory:token'))
    const user = ref<User | null>(null)

    function setLoginData(tokenValue: string, userData: User) {
        localStorage.setItem('@inventory:token', tokenValue)
        localStorage.setItem('@inventory:user', JSON.stringify(userData))
        token.value = tokenValue
        user.value = userData
    }

    function logout() {
        localStorage.removeItem('@inventory:token')
        localStorage.removeItem('@inventory:user')
        token.value = null
        user.value = null
        window.location.reload()
    }

    function loadUserFromStorage() {
        const userStr = localStorage.getItem('@inventory:user')
        if (userStr && token.value) {
            try {
                const decoded = jwtDecode(token.value)
                if (decoded.exp && decoded.exp * 1000 < Date.now()) {
                    logout()
                } else {
                    user.value = JSON.parse(userStr)
                }
            } catch (e) {
                logout()
            }
        }
    }

    loadUserFromStorage()

    return { token, user, setLoginData, logout, loadUserFromStorage }
})
