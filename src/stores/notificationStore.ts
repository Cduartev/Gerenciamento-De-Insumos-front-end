import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as rawMaterialService from '@/services/rawMaterialService'
import { i18n } from '@/plugins/i18n'

export interface AppNotification {
    id: string
    type: 'warning' | 'error' | 'info' | 'success'
    title: string
    message: string
    read: boolean
    createdAt: Date
}

export const useNotificationStore = defineStore('notifications', () => {
    const notifications = ref<AppNotification[]>([])

    const unreadCount = computed(() => notifications.value.filter(n => !n.read).length)

    function addNotification(notification: Omit<AppNotification, 'id' | 'read' | 'createdAt'>) {
        notifications.value.unshift({
            ...notification,
            id: crypto.randomUUID(),
            read: false,
            createdAt: new Date()
        })
    }

    function removeNotification(id: string) {
        notifications.value = notifications.value.filter(n => n.id !== id)
    }

    function markAsRead(id: string) {
        const notification = notifications.value.find(n => n.id === id)
        if (notification) {
            notification.read = true
        }
    }

    function markAllAsRead() {
        notifications.value.forEach(n => n.read = true)
    }

    function clearAll() {
        notifications.value = []
    }

    async function checkLowStock() {
        try {
            const rawMaterials = await rawMaterialService.listarTodas()
            // Define a low stock threshold, for example 50 units (can vary depending on requirements)
            const LOW_STOCK_THRESHOLD = 50

            const t = (i18n.global as any).t

            rawMaterials.forEach(rm => {
                if (rm.stockQuantity < LOW_STOCK_THRESHOLD) {
                    // Check if we already have an unread notification for this raw material
                    const alreadyNotified = notifications.value.some(
                        n => n.title === t('notifications.lowStockTitle') && n.message.includes(rm.name) && !n.read
                    )

                    if (!alreadyNotified) {
                        addNotification({
                            type: 'warning',
                            title: t('notifications.lowStockTitle'),
                            message: t('notifications.lowStockBody', { name: rm.name, code: rm.code, stock: rm.stockQuantity })
                        })
                    }
                }
            })
        } catch (error) {
            console.error('Failed to check low stock for notifications', error)
        }
    }

    return {
        notifications,
        unreadCount,
        addNotification,
        removeNotification,
        markAsRead,
        markAllAsRead,
        clearAll,
        checkLowStock
    }
})
