'use client'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

type OrderStatus = 'new' | 'accepted' | 'in_progress' | 'ready' | 'on_the_way' | 'delivered' | 'picked_up' | 'cancelled'
type OrderStatusHistory = { new_status: OrderStatus; changed_at: string }

// ============================================
// Types
// ============================================

interface OrderTrackingProps {
    orderId: string;
    currentStatus: OrderStatus;
    deliveryMethod: 'pickup' | 'delivery';
    statusHistory?: OrderStatusHistory[];
}

interface TimelineStep {
    status: OrderStatus;
    label: string;
    emoji: string;
    completed: boolean;
    current: boolean;
    timestamp?: string;
}

// ============================================
// Order Tracking Component
// ============================================

export default function OrderTracking({
    orderId,
    currentStatus,
    deliveryMethod,
    statusHistory
}: OrderTrackingProps) {
    const [steps, setSteps] = useState<TimelineStep[]>([])

    useEffect(() => {
        const allStatuses: OrderStatus[] =
            deliveryMethod === 'pickup'
                ? ['new', 'accepted', 'in_progress', 'ready', 'picked_up']
                : ['new', 'accepted', 'in_progress', 'ready', 'on_the_way', 'delivered']

        // Определяем индекс текущего статуса
        const currentIndex = allStatuses.indexOf(currentStatus)
        const isCancelled = currentStatus === 'cancelled'

        const timelineSteps: TimelineStep[] = allStatuses.map((status, index) => {
            // Ищем timestamp для этого статуса в истории
            const historyItem = statusHistory?.find(h => h.new_status === status)

            return {
                status: status,
                label: getStatusText(status, 'ru'),
                emoji: getStatusEmoji(status),
                completed: !isCancelled && index <= currentIndex,
                current: !isCancelled && index === currentIndex,
                timestamp: historyItem?.changed_at
            }
        })

        setSteps(timelineSteps)
    }, [currentStatus, deliveryMethod, statusHistory])

    const formatTimestamp = (timestamp?: string) => {
        if (!timestamp) return null
        const date = new Date(timestamp)
        return date.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Если заказ отменен, показываем специальное сообщение
    if (currentStatus === 'cancelled') {
        return (
            <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6">
                <div className="text-center">
                    <div className="text-6xl mb-4">🚫</div>
                    <h3 className="text-xl font-bold text-red-900 mb-2">
                        Заказ отменен
                    </h3>
                    <p className="text-red-700">
                        Для уточнения деталей свяжитесь с нами
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6">
            {/* Header */}
            <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                    Отслеживание заказа
                </h3>
                <p className="text-sm text-gray-600">
                    Заказ #{orderId.slice(-6)}
                </p>
            </div>

            {/* Timeline */}
            <div className="space-y-4">
                {steps.map((step, index) => (
                    <motion.div
                        key={step.status}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative flex items-start gap-4"
                    >
                        {/* Vertical line connector */}
                        {index < steps.length - 1 && (
                            <div
                                className={`absolute left-6 top-12 w-0.5 h-8 transition-colors duration-500 ${step.completed ? 'bg-green-500' : 'bg-gray-300'
                                    }`}
                            />
                        )}

                        {/* Status icon */}
                        <div className={`
                            relative z-10 flex items-center justify-center
                            w-12 h-12 rounded-full text-2xl
                            transition-all duration-500
                            ${step.completed
                                ? 'bg-green-500 shadow-lg shadow-green-200 scale-110'
                                : 'bg-gray-200'
                            }
                            ${step.current && 'ring-4 ring-green-300 animate-pulse'}
                        `}>
                            {step.emoji}
                        </div>

                        {/* Status info */}
                        <div className="flex-1 pt-2">
                            <div className="flex items-center justify-between">
                                <h4 className={`
                                    font-semibold transition-colors duration-300
                                    ${step.completed ? 'text-gray-900' : 'text-gray-500'}
                                    ${step.current && 'text-green-700'}
                                `}>
                                    {step.label}
                                </h4>
                                {step.timestamp && (
                                    <span className="text-sm text-gray-500">
                                        {formatTimestamp(step.timestamp)}
                                    </span>
                                )}
                            </div>

                            {/* Current status description */}
                            {step.current && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-sm text-gray-600 mt-1"
                                >
                                    {getStatusDescription(step.status, deliveryMethod)}
                                </motion.p>
                            )}
                        </div>

                        {/* Checkmark for completed steps */}
                        {step.completed && !step.current && (
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="text-green-600 text-xl"
                            >
                                ✓
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </div>

            {/* Estimated time (if order is in progress) */}
            {!['delivered', 'picked_up', 'cancelled'].includes(currentStatus) && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-white bg-opacity-50 rounded-xl"
                >
                    <div className="flex items-center gap-3">
                        <div className="text-2xl">⏱️</div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Примерное время готовности
                            </p>
                            <p className="text-lg font-bold text-green-700">
                                {getEstimatedTime(currentStatus, deliveryMethod)}
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </div>
    )
}

// ============================================
// Helper Functions
// ============================================

function getStatusDescription(status: OrderStatus, deliveryMethod: 'pickup' | 'delivery'): string {
    const descriptions: Record<OrderStatus, string> = {
        new: 'Ожидаем подтверждения от баристы',
        accepted: 'Бариста принял ваш заказ',
        in_progress: 'Ваш кофе готовится прямо сейчас',
        ready: deliveryMethod === 'pickup'
            ? 'Можно забрать в течение 15 минут'
            : 'Ожидаем курьера',
        on_the_way: 'Курьер уже в пути!',
        delivered: 'Приятного аппетита!',
        picked_up: 'Спасибо за заказ!',
        cancelled: 'Заказ отменен'
    }

    return descriptions[status]
}

function getEstimatedTime(status: OrderStatus, deliveryMethod: 'pickup' | 'delivery'): string {
    // Примерное время для каждого статуса
    const timeEstimates: Record<OrderStatus, string> = {
        new: '15-20 минут',
        accepted: '15-20 минут',
        in_progress: '10-15 минут',
        ready: deliveryMethod === 'pickup' ? 'Готов!' : '15-25 минут',
        on_the_way: '10-15 минут',
        delivered: 'Доставлен',
        picked_up: 'Выдан',
        cancelled: ''
    }

    return timeEstimates[status]
}

function getStatusText(status: OrderStatus, lang: 'ru' | 'en' = 'ru'): string {
    const map: Record<OrderStatus, { ru: string; en: string }> = {
        new: { ru: 'Новый', en: 'New' },
        accepted: { ru: 'Принят', en: 'Accepted' },
        in_progress: { ru: 'Готовится', en: 'In Progress' },
        ready: { ru: 'Готов', en: 'Ready' },
        on_the_way: { ru: 'В пути', en: 'On the way' },
        delivered: { ru: 'Доставлен', en: 'Delivered' },
        picked_up: { ru: 'Выдан', en: 'Picked up' },
        cancelled: { ru: 'Отменен', en: 'Cancelled' }
    }
    return map[status][lang]
}

function getStatusEmoji(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
        new: '🟡',
        accepted: '🔵',
        in_progress: '🟠',
        ready: '🟢',
        on_the_way: '🚗',
        delivered: '✅',
        picked_up: '✅',
        cancelled: '🔴'
    }
    return map[status]
}

