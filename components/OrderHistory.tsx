'use client'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { IOrder } from '@/app/context'
import Image from 'next/image'
// Supabase удалён. Историю показываем из локального состояния без realtime

interface OrderHistoryProps {
    orders: IOrder[];
    isOpen: boolean;
    onClose: () => void;
}

export default function OrderHistory({ orders: localOrders, isOpen, onClose }: OrderHistoryProps) {
    const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null)
    const [orders, setOrders] = useState<IOrder[]>(localOrders)
    const [loading, setLoading] = useState(false)

    // При открытии берём заказы из пропсов
    useEffect(() => {
        if (isOpen) {
            setOrders(localOrders)
        }
    }, [isOpen, localOrders])

    // Supabase‑mapping больше не нужен

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    const getStatusText = (status: string) => {
        const statusMap = {
            'pending': 'Ожидает подтверждения',
            'confirmed': 'Подтвержден',
            'preparing': 'Готовится',
            'ready': 'Готов к выдаче',
            'delivered': 'Доставлен'
        }
        return statusMap[status as keyof typeof statusMap] || status
    }

    const getStatusColor = (status: string) => {
        const colorMap = {
            'pending': 'text-yellow-600 bg-yellow-100',
            'confirmed': 'text-blue-600 bg-blue-100',
            'preparing': 'text-orange-600 bg-orange-100',
            'ready': 'text-green-600 bg-green-100',
            'delivered': 'text-gray-600 bg-gray-100'
        }
        return colorMap[status as keyof typeof colorMap] || 'text-gray-600 bg-gray-100'
    }

    const getPaymentMethodText = (method: string) => {
        const methodMap = {
            'cash': 'Наличными',
            'card': 'Картой',
            'kaspi': 'Kaspi Pay'
        }
        return methodMap[method as keyof typeof methodMap] || method
    }

    const getDeliveryMethodText = (method: string) => {
        const methodMap = {
            'pickup': 'Самовывоз',
            'delivery': 'Доставка'
        }
        return methodMap[method as keyof typeof methodMap] || method
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-gray-900">История заказов</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin text-6xl mb-4">⏳</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Загрузка заказов...</h3>
                        </div>
                    ) : orders.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="text-6xl mb-4">📦</div>
                            <h3 className="text-xl font-semibold text-gray-900 mb-2">Заказов пока нет</h3>
                            <p className="text-gray-600">Ваши заказы будут отображаться здесь</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow cursor-pointer"
                                    onClick={() => setSelectedOrder(order)}
                                >
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <h3 className="font-semibold text-gray-900">
                                                Заказ #{order.id.slice(-6)}
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                {formatDate(order.date)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-lg font-bold text-gray-900">
                                                {order.totalPrice} тг
                                            </p>
                                            <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {getStatusText(order.status)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <span>💳 {getPaymentMethodText(order.orderData.paymentMethod)}</span>
                                        <span>•</span>
                                        <span>🚚 {getDeliveryMethodText(order.orderData.deliveryMethod)}</span>
                                        <span>•</span>
                                        <span>{order.products.length} товар{order.products.length > 1 ? 'ов' : ''}</span>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Order Details Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 z-60 flex items-center justify-center p-4"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-green-100 to-green-200 p-6">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">
                                        Заказ #{selectedOrder.id.slice(-6)}
                                    </h3>
                                    <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="w-8 h-8 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                                    >
                                        ✕
                                    </button>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">
                                    {formatDate(selectedOrder.date)}
                                </p>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-y-auto max-h-[60vh]">
                                {/* Order Info */}
                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Статус:</span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusText(selectedOrder.status)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Оплата:</span>
                                        <span>{getPaymentMethodText(selectedOrder.orderData.paymentMethod)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">Доставка:</span>
                                        <span>{getDeliveryMethodText(selectedOrder.orderData.deliveryMethod)}</span>
                                    </div>
                                    {selectedOrder.orderData.address && (
                                        <div>
                                            <span className="text-gray-600">Адрес:</span>
                                            <p className="text-sm mt-1">{selectedOrder.orderData.address}</p>
                                        </div>
                                    )}
                                    {selectedOrder.orderData.phone && (
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Телефон:</span>
                                            <span>{selectedOrder.orderData.phone}</span>
                                        </div>
                                    )}
                                    {selectedOrder.orderData.comment && (
                                        <div>
                                            <span className="text-gray-600">Комментарий:</span>
                                            <p className="text-sm mt-1">{selectedOrder.orderData.comment}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Products */}
                                <div>
                                    <h4 className="font-semibold text-gray-900 mb-3">Товары:</h4>
                                    <div className="space-y-3">
                                        {selectedOrder.products.map((product) => (
                                            <div key={product.uid} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                                                <Image
                                                    src={product.image_url}
                                                    alt={product.name}
                                                    width={50}
                                                    height={50}
                                                    className="w-12 h-12 rounded-lg object-cover"
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <h5 className="font-medium text-gray-900 truncate">{product.name}</h5>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <span>{product.size}</span>
                                                        {product.sirop !== 'Нет' && (
                                                            <>
                                                                <span>•</span>
                                                                <span>{product.sirop}</span>
                                                            </>
                                                        )}
                                                        <span>•</span>
                                                        <span>x{product.qty}</span>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-semibold text-gray-900">
                                                        {product.final_price * product.qty} тг
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Total */}
                                <div className="mt-6 pt-4 border-t border-gray-200">
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>Итого:</span>
                                        <span>{selectedOrder.totalPrice} тг</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
