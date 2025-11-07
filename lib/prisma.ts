import { PrismaClient } from '@prisma/client'

// ============================================
// Prisma Client Singleton
// ============================================
// Предотвращаем создание множества инстансов в development

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
})

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
}

// ============================================
// Helper Functions
// ============================================

/**
 * Генерирует уникальный номер заказа на основе timestamp
 */
export function generateOrderNumber(): string {
    return Date.now().toString()
}

/**
 * Форматирует номер телефона для единообразия
 */
export function formatPhoneNumber(phone: string): string {
    // Убираем все нецифровые символы кроме +
    return phone.replace(/[^\d+]/g, '')
}

/**
 * Проверяет, является ли строка валидным UUID
 */
export function isValidUUID(uuid: string | null | undefined): boolean {
    if (!uuid) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(uuid);
}

// ============================================
// Re-export Prisma types for convenience
// ============================================
export type { Order, OrderItem, OrderStatusHistory } from '@prisma/client'
export { OrderStatus, PaymentMethod, DeliveryMethod, ChangedBy } from '@prisma/client'

