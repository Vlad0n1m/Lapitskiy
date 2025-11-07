'use client'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CheckoutFormProps {
    isOpen: boolean;
    onClose: () => void;
    totalPrice: number;
    onOrderSubmit: (orderData: any) => void;
}

export default function CheckoutForm({ isOpen, onClose, totalPrice, onOrderSubmit }: CheckoutFormProps) {
    const [currentStep, setCurrentStep] = useState(0)
    const [formData, setFormData] = useState({
        paymentMethod: '',
        deliveryMethod: '',
        address: '',
        phone: '',
        comment: ''
    })

    const paymentMethods = [
        { id: 'cash', name: 'Наличными', icon: '💵' },
        { id: 'card', name: 'Картой', icon: '💳' },
        { id: 'kaspi', name: 'Kaspi Pay', icon: '📱' }
    ]

    const deliveryMethods = [
        { id: 'pickup', name: 'Самовывоз', description: 'Забрать в кафе', icon: '🏪' },
        { id: 'delivery', name: 'Доставка', description: 'Доставка по Astanahub', icon: '🚚' }
    ]

    const steps = [
        { title: 'Способ оплаты', subtitle: 'Выберите удобный способ' },
        { title: 'Доставка', subtitle: 'Самовывоз или доставка' },
        { title: 'Детали заказа', subtitle: 'Адрес и комментарий' }
    ]

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1)
        }
    }

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1)
        }
    }

    const handleSubmit = () => {
        onOrderSubmit(formData)
        onClose()
    }

    const isStepValid = () => {
        switch (currentStep) {
            case 0:
                return formData.paymentMethod !== ''
            case 1:
                return formData.deliveryMethod !== ''
            case 2:
                if (formData.deliveryMethod === 'pickup') {
                    return formData.phone !== ''
                }
                return formData.address !== '' && formData.phone !== ''
            default:
                return false
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden"
            >
                {/* Header */}
                <div className="bg-gradient-to-r from-green-100 to-green-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">Оформление заказа</h2>
                        <button
                            onClick={onClose}
                            className="w-8 h-8 bg-gray-800 bg-opacity-50 rounded-full flex items-center justify-center text-white hover:bg-opacity-70 transition-all"
                        >
                            ✕
                        </button>
                    </div>

                    {/* Progress bar */}
                    <div className="flex items-center gap-2">
                        {steps.map((_, index) => (
                            <div key={index} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${index <= currentStep ? 'bg-green-600 text-white' : 'bg-gray-300 text-gray-600'
                                    }`}>
                                    {index + 1}
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 h-0.5 mx-2 ${index < currentStep ? 'bg-green-600' : 'bg-gray-300'
                                        }`} />
                                )}
                            </div>
                        ))}
                    </div>

                    <div className="mt-3">
                        <h3 className="text-lg font-semibold text-gray-900">{steps[currentStep].title}</h3>
                        <p className="text-sm text-gray-600">{steps[currentStep].subtitle}</p>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ x: 300, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -300, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* Step 0: Payment Method */}
                            {currentStep === 0 && (
                                <div className="space-y-4">
                                    {paymentMethods.map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                                            className={`w-full p-4 rounded-xl border-2 transition-all ${formData.paymentMethod === method.id
                                                    ? 'border-green-600 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{method.icon}</span>
                                                <span className="font-semibold text-gray-900">{method.name}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 1: Delivery Method */}
                            {currentStep === 1 && (
                                <div className="space-y-4">
                                    {deliveryMethods.map(method => (
                                        <button
                                            key={method.id}
                                            onClick={() => setFormData({ ...formData, deliveryMethod: method.id })}
                                            className={`w-full p-4 rounded-xl border-2 transition-all ${formData.deliveryMethod === method.id
                                                    ? 'border-green-600 bg-green-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="text-2xl">{method.icon}</span>
                                                <div className="text-left">
                                                    <div className="font-semibold text-gray-900">{method.name}</div>
                                                    <div className="text-sm text-gray-600">{method.description}</div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Step 2: Order Details */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Телефон *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                            placeholder="+7 (777) 123-45-67"
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none transition-colors"
                                        />
                                    </div>

                                    {/* Address (only for delivery) */}
                                    {formData.deliveryMethod === 'delivery' && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-900 mb-2">
                                                Адрес доставки *
                                            </label>
                                            <textarea
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                placeholder="Укажите точный адрес доставки"
                                                rows={3}
                                                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none transition-colors resize-none"
                                            />
                                        </div>
                                    )}

                                    {/* Comment */}
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-900 mb-2">
                                            Комментарий к заказу
                                        </label>
                                        <textarea
                                            value={formData.comment}
                                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                            placeholder="Дополнительные пожелания..."
                                            rows={3}
                                            className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-green-600 focus:outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer */}
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-lg font-semibold text-gray-900">Итого: {totalPrice} тг</span>
                    </div>

                    <div className="flex gap-3">
                        {currentStep > 0 && (
                            <button
                                onClick={handleBack}
                                className="flex-1 py-3 px-4 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors"
                            >
                                Назад
                            </button>
                        )}

                        <button
                            onClick={currentStep === steps.length - 1 ? handleSubmit : handleNext}
                            disabled={!isStepValid()}
                            className={`flex-1 py-3 px-4 font-semibold rounded-xl transition-colors ${isStepValid()
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                }`}
                        >
                            {currentStep === steps.length - 1 ? 'Подтвердить заказ' : 'Далее'}
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}
