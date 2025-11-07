'use client'
import Image from 'next/image'
import { useEffect, useState } from "react"
import { IProduct, useCart } from "@/app/context";
import { uid } from 'uid';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerFooter,
    DrawerClose,
} from "@/components/ui/drawer"

interface CoffeeConstructorProps {
    product: IProduct;
    isOpen: boolean;
    onClose: () => void;
    onUpdate?: (product: IProduct) => void;
    isEditMode?: boolean;
}

type Size = { id: string; name: string; volumeMl: number; price: number }
type Option = { id: string; name: string; price: number }

export default function CoffeeConstructor({ product, isOpen, onClose, onUpdate, isEditMode = false }: CoffeeConstructorProps) {
    const [productData, setProductData] = useState<IProduct | null>(null)
    const [sizes, setSizes] = useState<Size[]>([])
    const [syrups, setSyrups] = useState<Option[]>([])
    const [milks, setMilks] = useState<Option[]>([])
    const [extras, setExtras] = useState<Option[]>([])

    const [selectedSize, setSelectedSize] = useState<Size | null>(null)
    const [selectedSyrup, setSelectedSyrup] = useState<string | null>(null) // ID or null
    const [selectedMilk, setSelectedMilk] = useState<string | null>(null) // ID or null
    const [selectedExtras, setSelectedExtras] = useState<Set<string>>(new Set()) // Set of IDs
    const [temperature, setTemperature] = useState<'hot' | 'cold' | null>(null)
    const [finalPrice, setFinalPrice] = useState(0)
    const [activeCategory, setActiveCategory] = useState<'size' | 'temperature' | 'syrups' | 'milks' | 'extras' | null>(null)

    const addToCart = useCart((state) => state.addToCart);

    useEffect(() => {
        if (isOpen && product.id) {
            loadProductData()
        } else {
            // Fallback to legacy mode
            setProductData(product)
            initializeLegacyMode()
        }
    }, [isOpen, product.id])

    const loadProductData = async () => {
        try {
            const res = await fetch(`/api/admin/products/${product.id}`)
            const data = await res.json()
            if (data.success && data.product) {
                const p = data.product
                setProductData({
                    ...product,
                    ...p,
                    sizes: p.sizes?.filter((s: any) => s.isActive) || [],
                    availableSyrups: p.syrups?.filter((ps: any) => ps.isEnabled && ps.syrup?.isActive).map((ps: any) => ({
                        id: ps.syrup.id,
                        name: ps.syrup.name,
                        price: ps.syrup.price
                    })) || [],
                    availableMilks: p.milks?.filter((pm: any) => pm.isEnabled && pm.milk?.isActive).map((pm: any) => ({
                        id: pm.milk.id,
                        name: pm.milk.name,
                        price: pm.milk.price
                    })) || [],
                    availableExtras: p.extras?.filter((pe: any) => pe.isEnabled && pe.extra?.isActive).map((pe: any) => ({
                        id: pe.extra.id,
                        name: pe.extra.name,
                        price: pe.extra.price
                    })) || [],
                })
            }
        } catch (error) {
            console.error('Error loading product data:', error)
            setProductData(product)
            initializeLegacyMode()
        }
    }

    const initializeLegacyMode = () => {
        // Legacy mode: use hardcoded sizes and syrups
        setSizes([
            { id: 's', name: 'Маленький', volumeMl: 250, price: product.small_price || product.final_price || 0 },
            { id: 'm', name: 'Средний', volumeMl: 350, price: product.medium_price || product.final_price || 0 },
            { id: 'l', name: 'Большой', volumeMl: 450, price: product.big_price || product.final_price || 0 },
        ])
        setSelectedSize({ id: 's', name: 'Маленький', volumeMl: 250, price: product.small_price || product.final_price || 0 })

        // Legacy syrups
        setSyrups([
            { id: 'none', name: 'Нет', price: 0 },
            { id: 'strawberry', name: 'Клубника', price: product.sirop_price || 0 },
            { id: 'mint', name: 'Мята', price: product.sirop_price || 0 },
            { id: 'vanilla', name: 'Ваниль', price: product.sirop_price || 0 },
            { id: 'caramel', name: 'Карамель', price: product.sirop_price || 0 },
        ])

        // Initialize from existing product data
        if (product.size) {
            const sizeMap: Record<string, Size> = {
                'Маленький': { id: 's', name: 'Маленький', volumeMl: 250, price: product.small_price || 0 },
                'Средний': { id: 'm', name: 'Средний', volumeMl: 350, price: product.medium_price || 0 },
                'Большой': { id: 'l', name: 'Большой', volumeMl: 450, price: product.big_price || 0 },
            }
            setSelectedSize(sizeMap[product.size] || sizes[0])
        }

        if (product.syrupId) setSelectedSyrup(product.syrupId)
        if (product.milkId) setSelectedMilk(product.milkId)
        if (product.extraIds) setSelectedExtras(new Set(product.extraIds))
        if (product.temperature) setTemperature(product.temperature)
    }

    useEffect(() => {
        if (productData) {
            if (productData.sizes && productData.sizes.length > 0) {
                setSizes(productData.sizes)
                if (!selectedSize && productData.sizes.length > 0) {
                    setSelectedSize(productData.sizes[0])
                }
            }
            if (productData.availableSyrups) {
                // Сортируем: бесплатные первыми, затем по цене
                const sortedSyrups = [...productData.availableSyrups].sort((a, b) => a.price - b.price)
                setSyrups([{ id: 'none', name: 'Нет', price: 0 }, ...sortedSyrups])
            }
            if (productData.availableMilks) {
                // Сортируем: бесплатные первыми, затем по цене
                const sortedMilks = [...productData.availableMilks].sort((a, b) => a.price - b.price)
                setMilks(sortedMilks)
                if (!selectedMilk && sortedMilks.length > 0) {
                    setSelectedMilk(sortedMilks[0].id)
                }
            }
            if (productData.availableExtras) {
                // Сортируем: бесплатные первыми, затем по цене
                const sortedExtras = [...productData.availableExtras].sort((a, b) => a.price - b.price)
                setExtras(sortedExtras)
            }

            // Initialize temperature if allowed
            if (productData.allowHot && !temperature) {
                setTemperature('hot')
            } else if (productData.allowCold && !temperature) {
                setTemperature('cold')
            }
        }
    }, [productData])

    useEffect(() => {
        calculatePrice()
    }, [selectedSize, selectedSyrup, selectedMilk, selectedExtras, temperature, productData])

    const calculatePrice = () => {
        if (!selectedSize) {
            setFinalPrice(product.final_price || product.small_price || 0)
            return
        }

        let price = selectedSize.price

        // Add syrup price
        if (selectedSyrup && selectedSyrup !== 'none') {
            const syrup = syrups.find(s => s.id === selectedSyrup)
            if (syrup) price += syrup.price
        }

        // Add milk price
        if (selectedMilk) {
            const milk = milks.find(m => m.id === selectedMilk)
            if (milk) price += milk.price
        }

        // Add extras prices
        selectedExtras.forEach(extraId => {
            const extra = extras.find(e => e.id === extraId)
            if (extra) price += extra.price
        })

        // Add temperature surcharge
        if (temperature && productData) {
            if (temperature === 'hot' && productData.hotSurcharge) {
                price += productData.hotSurcharge
            } else if (temperature === 'cold' && productData.coldSurcharge) {
                price += productData.coldSurcharge
            }
        }

        setFinalPrice(price)
    }

    const toggleExtra = (extraId: string) => {
        const newExtras = new Set(selectedExtras)
        if (newExtras.has(extraId)) {
            newExtras.delete(extraId)
        } else {
            newExtras.add(extraId)
        }
        setSelectedExtras(newExtras)
        // Don't return to categories - allow multiple selection
    }

    const handleSyrupSelect = (syrupId: string) => {
        setSelectedSyrup(syrupId)
        setActiveCategory(null) // Return to categories after selection
    }

    const handleMilkSelect = (milkId: string) => {
        setSelectedMilk(milkId)
        setActiveCategory(null) // Return to categories after selection
    }

    const handleSizeSelect = (size: Size) => {
        setSelectedSize(size)
        setActiveCategory(null) // Return to categories after selection
    }

    const handleTemperatureSelect = (temp: 'hot' | 'cold') => {
        setTemperature(temp)
        setActiveCategory(null) // Return to categories after selection
    }

    const getTemperatureLabel = () => {
        if (!temperature) return 'Не выбрано'
        return temperature === 'hot' ? 'Горячий' : 'Холодный'
    }

    const getSelectedSyrupName = () => {
        if (!selectedSyrup || selectedSyrup === 'none') return null
        return syrups.find(s => s.id === selectedSyrup)?.name
    }

    const getSelectedMilkName = () => {
        if (!selectedMilk) return null
        return milks.find(m => m.id === selectedMilk)?.name
    }

    const getSelectedExtrasNames = () => {
        return Array.from(selectedExtras).map(id => extras.find(e => e.id === id)?.name).filter(Boolean)
    }

    const handleAddToCart = () => {
        if (!selectedSize) return

        const selectedSyrupObj = syrups.find(s => s.id === selectedSyrup)
        const selectedMilkObj = milks.find(m => m.id === selectedMilk)
        const selectedExtrasObjs = Array.from(selectedExtras).map(id => extras.find(e => e.id === id)).filter(Boolean) as Option[]

        const productToAdd: IProduct = {
            ...product,
            ...(productData || {}),
            uid: product.uid || uid(),
            final_price: finalPrice,
            size: selectedSize.name,
            volumeMl: selectedSize.volumeMl,
            syrupId: selectedSyrup && selectedSyrup !== 'none' ? selectedSyrup : undefined,
            syrupName: selectedSyrupObj?.name,
            sirop: selectedSyrupObj?.name || 'Нет',
            milkId: selectedMilk || undefined,
            milkName: selectedMilkObj?.name,
            extraIds: Array.from(selectedExtras),
            extraNames: selectedExtrasObjs.map(e => e.name),
            temperature: temperature || undefined,
        }

        if (isEditMode && onUpdate) {
            onUpdate(productToAdd)
        } else {
            addToCart(productToAdd)
        }
        onClose()
    }

    const syrupColors: Record<string, string> = {
        'none': '#000000',
        'Клубника': '#dc2626',
        'Мята': '#4ade80',
        'Ваниль': '#f59e0b',
        'Карамель': '#ed8936',
        'Шоколад': '#4b5563',
        'Лесные ягоды': '#7c3aed',
        'Кокос': '#d97706',
    }

    const getSyrupColor = (name: string) => {
        return syrupColors[name] || '#6b7280'
    }

    return (
        <Drawer open={isOpen} onOpenChange={onClose}>
            <DrawerContent className="h-[100vh] bg-elbone overflow-hidden">
                <div style={{
                    backgroundImage: `url(${product.image_url || (productData as any)?.imageUrl || '/cup.png'})`,
                    maskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to bottom, black 0%, black 60%, transparent 100%)',
                }} className={`flex-1 relative overflow-hidden bg-cover bg-center rounded-t-xl bg-elbone`}>
                </div>

                <div className="text-black pb-4 flex flex-col gap-2 pt-0 overflow-y-auto overflow-x-hidden">
                    <DrawerHeader className="text-center py-3">
                        <DrawerTitle className="text-xl font-bold">{product.name}</DrawerTitle>
                    </DrawerHeader>

                    {/* Size and Addons Categories/Options */}
                    {(sizes.length > 0 || (productData && (productData.allowHot || productData.allowCold)) || syrups.length > 1 || milks.length > 0 || extras.length > 0) && (
                        <div className="space-y-2 ">
                            {/* <h3 className="text-sm font-semibold text-center text-gray-300">Настройки</h3> */}

                            <div className="min-h-[120px] flex flex-col relative justify-end">
                                {activeCategory === null ? (
                                    // Show categories horizontally with scroll
                                    <div className="px-4 flex gap-2 overflow-x-auto pb-2 -mx-1 h-full pt-1 items-center animate-in fade-in slide-in-from-right-4 duration-300">
                                        {sizes.length > 0 && (
                                            <button
                                                onClick={() => setActiveCategory('size')}
                                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-black/10 hover:bg-black/20 transition-all min-w-[75px] flex-shrink-0 ${selectedSize ? 'border-1 border border-black/20' : ''
                                                    }`}
                                            >
                                                <div className="text-xl">📏</div>
                                                <span className="text-xs font-medium text-center">Размер</span>
                                                <span className="text-[10px] text-black/70 text-center leading-tight">{selectedSize ? selectedSize.name : 'Не выбрано'}</span>
                                            </button>
                                        )}

                                        {productData && (productData.allowHot || productData.allowCold) && (
                                            <button
                                                onClick={() => setActiveCategory('temperature')}
                                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-black/10 hover:bg-black/20 transition-all min-w-[75px] flex-shrink-0 ${temperature ? ' border-1 border border-black/20' : ''
                                                    }`}
                                            >
                                                <div className="text-xl">🌡️</div>
                                                <span className="text-xs font-medium text-center">Темп.</span>
                                                <span className="text-[10px] text-black/70 text-center leading-tight">{getTemperatureLabel()}</span>
                                            </button>
                                        )}

                                        {syrups.length > 1 && (
                                            <button
                                                onClick={() => setActiveCategory('syrups')}
                                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-black/10 hover:bg-black/20 transition-all min-w-[75px] flex-shrink-0 ${getSelectedSyrupName() ? 'border-1 border border-black/20' : ''
                                                    }`}
                                            >
                                                <div className="text-xl">🍯</div>
                                                <span className="text-xs font-medium text-center">Сироп</span>
                                                <span className="text-[10px] text-black/70 text-center leading-tight">{getSelectedSyrupName() || 'Не выбрано'}</span>
                                            </button>
                                        )}

                                        {milks.length > 0 && (
                                            <button
                                                onClick={() => setActiveCategory('milks')}
                                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-black/10 hover:bg-black/20 transition-all min-w-[75px] flex-shrink-0 ${getSelectedMilkName() ? 'border-1 border border-black/20' : ''
                                                    }`}
                                            >
                                                <div className="text-xl">🥛</div>
                                                <span className="text-xs font-medium text-center">Молоко</span>
                                                <span className="text-[10px] text-black/70 text-center leading-tight">{getSelectedMilkName() || 'Не выбрано'}</span>
                                            </button>
                                        )}

                                        {extras.length > 0 && (
                                            <button
                                                onClick={() => setActiveCategory('extras')}
                                                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg bg-black/10 hover:bg-black/20 transition-all min-w-[75px] flex-shrink-0 ${selectedExtras.size > 0 ? 'border-1 border border-black/20' : ''
                                                    }`}
                                            >
                                                <div className="text-xl">➕</div>
                                                <span className="text-xs font-medium text-center">Прочее</span>
                                                <span className="text-[10px] text-black/70 text-center leading-tight">{selectedExtras.size > 0 ? `${selectedExtras.size} выбрано` : 'Не выбрано'}</span>
                                            </button>
                                        )}
                                    </div>
                                ) : (
                                    // Show options for selected category
                                    <div className="space-y-2 h-full flex flex-col animate-in fade-in slide-in-from-left-4 duration-300">
                                        <button
                                            onClick={() => setActiveCategory(null)}
                                            className="flex items-center gap-1 text-xs text-gray-700 hover:text-black flex-shrink-0 transition-colors pl-4"
                                        >
                                            <span>←</span> Назад к категориям
                                        </button>

                                        <div className="flex-1 flex items-center">
                                            {activeCategory === 'size' && (
                                                <div className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-1 w-full pt-1">
                                                    {sizes.map(size => (
                                                        <button
                                                            key={size.id}
                                                            onClick={() => handleSizeSelect(size)}
                                                            className={`flex flex-col items-center justify-center rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 min-w-[75px] px-3 py-2 flex-shrink-0 ${selectedSize?.id === size.id
                                                                ? 'bg-black text-white scale-105 shadow-lg'
                                                                : 'bg-black/10 text-gray-700 hover:bg-black/20'
                                                                }`}
                                                        >
                                                            <span className="text-xl font-bold">{size.name.charAt(0).toUpperCase()}</span>
                                                            <span className="text-xs font-medium mt-0.5">{size.volumeMl} мл</span>
                                                            <span className="text-[10px] text-gray-500 mt-0.5">{size.price}₸</span>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {activeCategory === 'temperature' && productData && (
                                                <div className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-1 w-full pt-1">
                                                    {productData.allowHot && (
                                                        <button
                                                            onClick={() => handleTemperatureSelect('hot')}
                                                            className={`flex flex-col items-center justify-center rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 min-w-[75px] px-3 py-2 flex-shrink-0 ${temperature === 'hot'
                                                                ? 'bg-red-500 text-white scale-105 shadow-lg'
                                                                : 'bg-black/10 text-gray-700 hover:bg-black/20'
                                                                }`}
                                                        >
                                                            <span className="text-xl">🔥</span>
                                                            <span className="text-xs font-medium mt-0.5">Горячий</span>
                                                            {productData.hotSurcharge && productData.hotSurcharge > 0 && (
                                                                <span className="text-[10px] text-gray-600 mt-0.5">+{productData.hotSurcharge}₸</span>
                                                            )}
                                                        </button>
                                                    )}
                                                    {productData.allowCold && (
                                                        <button
                                                            onClick={() => handleTemperatureSelect('cold')}
                                                            className={`flex flex-col items-center justify-center rounded-lg font-semibold transition-all duration-200 transform hover:scale-105 min-w-[75px] px-3 py-2 flex-shrink-0 ${temperature === 'cold'
                                                                ? 'bg-blue-500 text-white scale-105 shadow-lg'
                                                                : 'bg-black/10 text-gray-700 hover:bg-black/20'
                                                                }`}
                                                        >
                                                            <span className="text-xl">❄️</span>
                                                            <span className="text-xs font-medium mt-0.5">Холодный</span>
                                                            {productData.coldSurcharge && productData.coldSurcharge > 0 && (
                                                                <span className="text-[10px] text-gray-600 mt-0.5">+{productData.coldSurcharge}₸</span>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>
                                            )}

                                            {activeCategory === 'syrups' && (
                                                <div className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-1 pt-1 w-full">
                                                    {syrups.map(syrup => (
                                                        <div
                                                            key={syrup.id}
                                                            onClick={() => handleSyrupSelect(syrup.id)}
                                                            className={`flex flex-col items-center gap-1 cursor-pointer transition-all duration-200 transform hover:scale-105 min-w-[60px] flex-shrink-0 ${selectedSyrup === syrup.id ? 'scale-105' : ''
                                                                }`}
                                                        >
                                                            <div
                                                                className={`w-12 h-12 rounded-full border-2 flex items-center justify-center shadow-lg transition-all duration-200 ${selectedSyrup === syrup.id
                                                                    ? 'border-1 border border-black/20'
                                                                    : 'hover:shadow-md'
                                                                    }`}
                                                                style={{
                                                                    backgroundColor: selectedSyrup === syrup.id ? getSyrupColor(syrup.name) : '#e5e7eb',
                                                                    borderColor: getSyrupColor(syrup.name)
                                                                }}
                                                            >
                                                                {selectedSyrup === syrup.id && (
                                                                    <span className="text-white text-base font-bold drop-shadow-lg">✓</span>
                                                                )}
                                                            </div>
                                                            <span className={`text-[10px] text-center font-medium transition-colors duration-200 leading-tight ${selectedSyrup === syrup.id ? 'text-black' : 'text-gray-700'
                                                                }`}>
                                                                {syrup.name}
                                                            </span>
                                                            {syrup.price > 0 && (
                                                                <span className="text-[10px] text-gray-600">+{syrup.price}₸</span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}

                                            {activeCategory === 'milks' && (
                                                <div className="flex gap-2 overflow-x-auto pb-2 px-4 -mx-1 pt-1 w-full">
                                                    {milks.map(milk => (
                                                        <button
                                                            key={milk.id}
                                                            onClick={() => handleMilkSelect(milk.id)}
                                                            className={`px-3 py-2 rounded-lg text-xs whitespace-nowrap transition-all min-w-[90px] flex-shrink-0 ${selectedMilk === milk.id
                                                                ? 'bg-black text-white'
                                                                : 'bg-black/10 text-gray-700 hover:bg-black/20'
                                                                }`}
                                                        >
                                                            <div className="font-medium">{milk.name}</div>
                                                            {milk.price > 0 && (
                                                                <div className="text-[10px] mt-0.5">+{milk.price}₸</div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}

                                            {activeCategory === 'extras' && (
                                                <div className="flex flex-wrap gap-2 w-full px-4">
                                                    {extras.map(extra => (
                                                        <button
                                                            key={extra.id}
                                                            onClick={() => toggleExtra(extra.id)}
                                                            className={`px-3 py-2 rounded-lg text-xs transition-all ${selectedExtras.has(extra.id)
                                                                ? 'bg-black text-white'
                                                                : 'bg-black/10 text-gray-700 hover:bg-black/20'
                                                                }`}
                                                        >
                                                            <div className="font-medium">{extra.name}</div>
                                                            {extra.price > 0 && (
                                                                <div className="text-[10px] mt-0.5">+{extra.price}₸</div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <DrawerFooter className="flex flex-row ml-4 mr-2 justify-between items-center bg-black/10 border border-black/20 backdrop-blur-lg rounded-full shadow-lg px-3 py-2">
                        <div className="text-base font-bold">
                            {finalPrice} ₸
                        </div>
                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition-colors text-base"
                        >
                            {isEditMode ? 'Изменить' : 'Добавить'}
                        </button>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}
