'use client'
import { useEffect, useMemo, useState, useRef } from 'react'

type CategorySlug = 'coffe' | 'tea' | 'croisant' | 'macaroon' | 'rahat' | 'cheese'
type Category = { id: string; name: string; slug: CategorySlug }
type Product = { id: string; name: string; price: number; isActive: boolean; categoryId: string }
type Syrup = { id: string; name: string; price: number; isActive: boolean }
type Milk = { id: string; name: string; price: number; isActive: boolean }
type Extra = { id: string; name: string; price: number; isActive: boolean }
type ProductSize = { id: string; name: string; volumeMl: number; price: number; isActive: boolean }

type TabType = 'products' | 'syrups' | 'milks' | 'extras'

export default function MenuPage() {
    const [activeTab, setActiveTab] = useState<TabType>('products')
    const [categories, setCategories] = useState<Category[]>([])
    const [items, setItems] = useState<Product[]>([])
    const [q, setQ] = useState('')
    const [categoryId, setCategoryId] = useState('')
    const [includeInactive, setIncludeInactive] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)

    const load = async () => {
        const [c, p] = await Promise.all([
            fetch('/api/admin/categories').then(r => r.json()),
            fetch(`/api/admin/products?${new URLSearchParams({ q, categoryId, includeInactive: String(includeInactive) })}`).then(r => r.json())
        ])
        setCategories(c.categories || [])
        setItems(p.items || [])
    }

    useEffect(() => {
        if (activeTab === 'products') {
            load()
        }
    }, [q, categoryId, includeInactive, activeTab])

    const byCategory = useMemo(() => {
        const map: Record<string, Product[]> = {}
        for (const it of items) {
            const key = it.categoryId || 'uncat'
            if (!map[key]) map[key] = []
            map[key].push(it)
        }
        return map
    }, [items])

    return (
        <div className="space-y-4">
            <div className="flex gap-2 border-b">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-4 py-2 ${activeTab === 'products' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                >
                    Продукты
                </button>
                <button
                    onClick={() => setActiveTab('syrups')}
                    className={`px-4 py-2 ${activeTab === 'syrups' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                >
                    Сиропы
                </button>
                <button
                    onClick={() => setActiveTab('milks')}
                    className={`px-4 py-2 ${activeTab === 'milks' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                >
                    Молоко
                </button>
                <button
                    onClick={() => setActiveTab('extras')}
                    className={`px-4 py-2 ${activeTab === 'extras' ? 'border-b-2 border-blue-500 font-semibold' : ''}`}
                >
                    Прочее
                </button>
            </div>

            {activeTab === 'products' && (
                <>
                    <div className="flex gap-2 items-center">
                        <input value={q} onChange={e => setQ(e.target.value)} placeholder="Поиск" className="border px-3 py-2 rounded w-full" />
                        <label className="flex items-center gap-2 text-sm whitespace-nowrap">
                            <input type="checkbox" checked={includeInactive} onChange={e => setIncludeInactive(e.target.checked)} />
                            Показать неактивные
                        </label>
                    </div>

                    <div className="flex gap-2 overflow-auto">
                        <button onClick={() => setCategoryId('')} className={`px-3 py-2 border rounded text-sm whitespace-nowrap ${categoryId === '' ? 'bg-gray-100' : ''}`}>Все</button>
                        {categories.map(c => (
                            <button key={c.id} onClick={() => setCategoryId(c.id)} className={`px-3 py-2 border rounded text-sm whitespace-nowrap ${categoryId === c.id ? 'bg-gray-100' : ''}`}>{c.name}</button>
                        ))}
                    </div>

                    <div className="space-y-3">
                        {Object.entries(byCategory).map(([cid, list]) => (
                            <section key={cid} className="border rounded p-2">
                                <h3 className="font-semibold mb-2 text-sm">{cid === '' ? 'Без категории' : (categories.find(c => c.id === cid)?.name || 'Категория')}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {list.map(p => (
                                        <div key={p.id} className="border rounded p-2 flex items-center justify-between">
                                            <div>
                                                <div className="font-semibold">{p.name}</div>
                                                <div className="text-sm text-gray-500">{p.price} ₸</div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => setEditingProduct(p)} className="px-2 py-1 border rounded text-sm">Настроить</button>
                                                <button onClick={() => toggleActive(p)} className="px-2 py-1 border rounded text-sm">
                                                    {p.isActive ? 'Выключить' : 'Включить'}
                                                </button>
                                                <button onClick={() => remove(p)} className="px-2 py-1 border rounded text-sm">Удалить</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        ))}
                    </div>

                    <CreateForms onCreated={load} categories={categories} selectedCategoryId={categoryId} />
                </>
            )}

            {activeTab === 'syrups' && <OptionsManager type="syrups" />}
            {activeTab === 'milks' && <OptionsManager type="milks" />}
            {activeTab === 'extras' && <OptionsManager type="extras" />}

            {editingProduct && (
                <ProductEditor
                    product={editingProduct}
                    categories={categories}
                    onClose={() => setEditingProduct(null)}
                    onSaved={() => { setEditingProduct(null); load() }}
                />
            )}
        </div>
    )

    async function toggleActive(p: Product) {
        await fetch(`/api/admin/products/${p.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ isActive: !p.isActive }) })
        load()
    }

    async function remove(p: Product) {
        if (!confirm(`Удалить продукт "${p.name}"?`)) return
        await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' })
        load()
    }
}

function OptionsManager({ type }: { type: 'syrups' | 'milks' | 'extras' }) {
    const [items, setItems] = useState<(Syrup | Milk | Extra)[]>([])
    const [name, setName] = useState('')
    const [price, setPrice] = useState('')
    const [bulkInput, setBulkInput] = useState('')
    const [includeInactive, setIncludeInactive] = useState(false)

    const load = async () => {
        const res = await fetch(`/api/admin/options/${type}?includeInactive=${includeInactive}`)
        const data = await res.json()
        setItems(data[type] || [])
    }

    useEffect(() => {
        load()
    }, [includeInactive, type])

    const create = async () => {
        if (!name || !price) return
        await fetch(`/api/admin/options/${type}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name.trim(), price: Number(price), isActive: true })
        })
        setName('')
        setPrice('')
        load()
    }

    const bulkCreate = async () => {
        const lines = bulkInput.split(',').map(s => s.trim()).filter(Boolean)
        for (const line of lines) {
            const [namePart, pricePart] = line.split(':').map(s => s.trim())
            if (namePart && pricePart) {
                await fetch(`/api/admin/options/${type}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name: namePart, price: Number(pricePart), isActive: true })
                })
            }
        }
        setBulkInput('')
        load()
    }

    const toggleActive = async (item: Syrup | Milk | Extra) => {
        await fetch(`/api/admin/options/${type}/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isActive: !item.isActive })
        })
        load()
    }

    const remove = async (item: Syrup | Milk | Extra) => {
        if (!confirm(`Удалить "${item.name}"?`)) return
        await fetch(`/api/admin/options/${type}/${item.id}`, { method: 'DELETE' })
        load()
    }

    const update = async (item: Syrup | Milk | Extra, field: 'name' | 'price', value: string | number) => {
        await fetch(`/api/admin/options/${type}/${item.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ [field]: value })
        })
        load()
    }

    return (
        <div className="space-y-4">
            <div className="flex gap-2 items-center">
                <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={includeInactive} onChange={e => setIncludeInactive(e.target.checked)} />
                    Показать неактивные
                </label>
            </div>

            <div className="border rounded p-3 space-y-2">
                <div className="font-semibold">Добавить {type === 'syrups' ? 'сироп' : type === 'milks' ? 'молоко' : 'добавку'}</div>
                <div className="grid grid-cols-2 gap-2">
                    <input value={name} onChange={e => setName(e.target.value)} placeholder="Название" className="border px-3 py-2 rounded" />
                    <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Цена" type="number" className="border px-3 py-2 rounded" />
                </div>
                <button onClick={create} disabled={!name || !price} className="px-3 py-2 border rounded w-full disabled:opacity-50">
                    Добавить
                </button>
            </div>

            <div className="border rounded p-3 space-y-2">
                <div className="font-semibold">Массовое добавление (через запятую)</div>
                <div className="text-xs text-gray-500 mb-2">Формат: Название:Цена, Название:Цена</div>
                <textarea
                    value={bulkInput}
                    onChange={e => setBulkInput(e.target.value)}
                    placeholder="Клубника:200, Ваниль:150, Карамель:180"
                    className="border px-3 py-2 rounded w-full"
                    rows={3}
                />
                <button onClick={bulkCreate} disabled={!bulkInput.trim()} className="px-3 py-2 border rounded w-full disabled:opacity-50">
                    Добавить все
                </button>
            </div>

            <div className="space-y-2">
                {items.map(item => (
                    <div key={item.id} className="border rounded p-2 flex items-center justify-between gap-2">
                        <div className="flex-1 grid grid-cols-2 gap-2">
                            <input
                                value={item.name}
                                onChange={e => update(item, 'name', e.target.value)}
                                onBlur={() => load()}
                                className="border px-2 py-1 rounded text-sm"
                            />
                            <input
                                value={item.price}
                                onChange={e => update(item, 'price', Number(e.target.value))}
                                onBlur={() => load()}
                                type="number"
                                className="border px-2 py-1 rounded text-sm"
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <button onClick={() => toggleActive(item)} className={`px-2 py-1 border rounded text-sm ${item.isActive ? 'bg-green-100' : 'bg-gray-100'}`}>
                                {item.isActive ? 'Активен' : 'Неактивен'}
                            </button>
                            <button onClick={() => remove(item)} className="px-2 py-1 border rounded text-sm">Удалить</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function ProductEditor({ product, categories, onClose, onSaved }: { product: Product; categories: Category[]; onClose: () => void; onSaved: () => void }) {
    const [productData, setProductData] = useState<any>(null)
    const [sizes, setSizes] = useState<ProductSize[]>([])
    const [syrups, setSyrups] = useState<Syrup[]>([])
    const [milks, setMilks] = useState<Milk[]>([])
    const [extras, setExtras] = useState<Extra[]>([])
    const [loading, setLoading] = useState(true)
    const [newImage, setNewImage] = useState<File | null>(null)
    const [imagePreview, setImagePreview] = useState<string>('')
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        loadProductData()
    }, [product.id])

    const loadProductData = async () => {
        setLoading(true)
        try {
            const [productRes, optionsRes] = await Promise.all([
                fetch(`/api/admin/products/${product.id}`).then(r => r.json()),
                fetch(`/api/admin/products/${product.id}/options`).then(r => r.json())
            ])
            setProductData(productRes.product)
            setSizes(productRes.product.sizes || [])
            setSyrups(optionsRes.syrups || [])
            setMilks(optionsRes.milks || [])
            setExtras(optionsRes.extras || [])
        } catch (error) {
            console.error('Error loading product data:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setNewImage(file)
            // Создаем превью
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const saveProduct = async () => {
        if (!productData) return
        
        setUploading(true)
        let imageUrl = productData.imageUrl

        try {
            // Если есть новое изображение, загружаем его
            if (newImage) {
                const formData = new FormData()
                formData.append('file', newImage)
                const uploadResponse = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                })
                const uploadResult = await uploadResponse.json()
                if (uploadResult.success && uploadResult.url) {
                    imageUrl = uploadResult.url
                }
            }

            await fetch(`/api/admin/products/${product.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: productData.name,
                    price: productData.price,
                    imageUrl: imageUrl,
                    isActive: productData.isActive,
                    categoryId: productData.categoryId,
                    allowHot: productData.allowHot,
                    allowCold: productData.allowCold,
                    hotSurcharge: productData.hotSurcharge || 0,
                    coldSurcharge: productData.coldSurcharge || 0,
                })
            })

            // Save options
            await fetch(`/api/admin/products/${product.id}/options`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    syrupIds: syrups.filter(s => s.isEnabled).map(s => s.id),
                    milkIds: milks.filter(m => m.isEnabled).map(m => m.id),
                    extraIds: extras.filter(e => e.isEnabled).map(e => e.id),
                })
            })

            onSaved()
        } catch (error) {
            console.error('Error saving product:', error)
            alert('Ошибка при сохранении продукта. Попробуйте снова.')
        } finally {
            setUploading(false)
        }
    }

    const addSize = async () => {
        const name = prompt('Название размера:')
        const volumeMl = Number(prompt('Объем (мл):'))
        const price = Number(prompt('Цена:'))
        if (!name || !volumeMl || !price) return

        await fetch(`/api/admin/products/${product.id}/sizes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, volumeMl, price, isActive: true })
        })
        loadProductData()
    }

    const updateSize = async (size: ProductSize, field: 'name' | 'volumeMl' | 'price', value: string | number) => {
        await fetch(`/api/admin/products/${product.id}/sizes`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: size.id, [field]: value, name: size.name, volumeMl: size.volumeMl, price: size.price, isActive: size.isActive })
        })
        loadProductData()
    }

    const deleteSize = async (sizeId: string) => {
        if (!confirm('Удалить размер?')) return
        await fetch(`/api/admin/products/${product.id}/sizes?sizeId=${sizeId}`, { method: 'DELETE' })
        loadProductData()
    }

    if (loading || !productData) return <div className="p-4">Загрузка...</div>

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Настройка продукта: {productData.name}</h2>
                        <button onClick={onClose} className="text-2xl">×</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">Название</label>
                            <input
                                value={productData.name}
                                onChange={e => setProductData({ ...productData, name: e.target.value })}
                                className="border px-3 py-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">Базовая цена</label>
                            <input
                                value={productData.price}
                                onChange={e => setProductData({ ...productData, price: Number(e.target.value) })}
                                type="number"
                                className="border px-3 py-2 rounded w-full"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Изображение</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="border px-3 py-2 rounded w-full text-sm"
                        />
                        <div className="mt-2 relative w-full h-48 rounded overflow-hidden border">
                            <img
                                src={imagePreview || productData.imageUrl || '/cup.png'}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>
                        {newImage && (
                            <p className="text-xs text-gray-600 mt-1">Новое изображение будет загружено при сохранении</p>
                        )}
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Размеры</h3>
                        <div className="space-y-2">
                            {sizes.map(size => (
                                <div key={size.id} className="flex gap-2 items-center border p-2 rounded">
                                    <input
                                        value={size.name}
                                        onChange={e => updateSize(size, 'name', e.target.value)}
                                        onBlur={() => loadProductData()}
                                        placeholder="Название"
                                        className="border px-2 py-1 rounded flex-1"
                                    />
                                    <input
                                        value={size.volumeMl}
                                        onChange={e => updateSize(size, 'volumeMl', Number(e.target.value))}
                                        onBlur={() => loadProductData()}
                                        type="number"
                                        placeholder="мл"
                                        className="border px-2 py-1 rounded w-20"
                                    />
                                    <input
                                        value={size.price}
                                        onChange={e => updateSize(size, 'price', Number(e.target.value))}
                                        onBlur={() => loadProductData()}
                                        type="number"
                                        placeholder="Цена"
                                        className="border px-2 py-1 rounded w-24"
                                    />
                                    <button onClick={() => deleteSize(size.id)} className="px-2 py-1 border rounded text-sm">Удалить</button>
                                </div>
                            ))}
                            <button onClick={addSize} className="px-3 py-2 border rounded w-full text-sm">+ Добавить размер</button>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Температура</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={productData.allowHot}
                                    onChange={e => setProductData({ ...productData, allowHot: e.target.checked })}
                                />
                                <label>Горячий</label>
                                {productData.allowHot && (
                                    <input
                                        value={productData.hotSurcharge || 0}
                                        onChange={e => setProductData({ ...productData, hotSurcharge: Number(e.target.value) })}
                                        type="number"
                                        placeholder="Надбавка"
                                        className="border px-2 py-1 rounded w-24 ml-auto"
                                    />
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={productData.allowCold}
                                    onChange={e => setProductData({ ...productData, allowCold: e.target.checked })}
                                />
                                <label>Холодный</label>
                                {productData.allowCold && (
                                    <input
                                        value={productData.coldSurcharge || 0}
                                        onChange={e => setProductData({ ...productData, coldSurcharge: Number(e.target.value) })}
                                        type="number"
                                        placeholder="Надбавка"
                                        className="border px-2 py-1 rounded w-24 ml-auto"
                                    />
                                )}
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Доступные сиропы</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {syrups.map(syrup => (
                                <label key={syrup.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={syrup.isEnabled}
                                        onChange={e => {
                                            const updated = syrups.map(s => s.id === syrup.id ? { ...s, isEnabled: e.target.checked } : s)
                                            setSyrups(updated)
                                        }}
                                    />
                                    <span>{syrup.name} (+{syrup.price}₸)</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Доступное молоко</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {milks.map(milk => (
                                <label key={milk.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={milk.isEnabled}
                                        onChange={e => {
                                            const updated = milks.map(m => m.id === milk.id ? { ...m, isEnabled: e.target.checked } : m)
                                            setMilks(updated)
                                        }}
                                    />
                                    <span>{milk.name} (+{milk.price}₸)</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-2">Доступные добавки</h3>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                            {extras.map(extra => (
                                <label key={extra.id} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={extra.isEnabled}
                                        onChange={e => {
                                            const updated = extras.map(ext => ext.id === extra.id ? { ...ext, isEnabled: e.target.checked } : ext)
                                            setExtras(updated)
                                        }}
                                    />
                                    <span>{extra.name} (+{extra.price}₸)</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t">
                        <button 
                            onClick={saveProduct} 
                            disabled={uploading}
                            className="px-4 py-2 bg-blue-500 text-white rounded flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {uploading ? 'Сохранение...' : 'Сохранить'}
                        </button>
                        <button onClick={onClose} className="px-4 py-2 border rounded">Отмена</button>
                    </div>
                </div>
            </div>
        </div>
    )
}

function CreateForms({ onCreated, categories, selectedCategoryId }: { onCreated: () => void; categories: Category[]; selectedCategoryId: string }) {
    const [cName, setCName] = useState('')
    const [cSlug, setCSlug] = useState('')
    const [pName, setPName] = useState('')
    const [pPrice, setPPrice] = useState('')
    const [pImage, setPImage] = useState<File | null>(null)
    const [pImagePreview, setPImagePreview] = useState<string>('')
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const pCategory = selectedCategoryId

    useEffect(() => {
        setPName('')
        setPPrice('')
        setPImage(null)
        setPImagePreview('')
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }, [selectedCategoryId])

    const createCategory = async () => {
        if (!cName || !cSlug) return
        await fetch('/api/admin/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: cName, slug: cSlug }) })
        setCName(''); setCSlug(''); onCreated()
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setPImage(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPImagePreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const createProduct = async () => {
        if (!pName || !pPrice || !pCategory) return

        setUploading(true)
        let imageUrl = '/cup.png'

        try {
            if (pImage) {
                const formData = new FormData()
                formData.append('file', pImage)
                const uploadResponse = await fetch('/api/admin/upload', {
                    method: 'POST',
                    body: formData,
                })
                const uploadResult = await uploadResponse.json()
                if (uploadResult.success && uploadResult.url) {
                    imageUrl = uploadResult.url
                }
            }

            await fetch('/api/admin/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: pName,
                    price: Number(pPrice),
                    categoryId: pCategory,
                    imageUrl: imageUrl,
                })
            })

            setPName('')
            setPPrice('')
            setPImage(null)
            setPImagePreview('')
            if (fileInputRef.current) {
                fileInputRef.current.value = ''
            }
            onCreated()
        } catch (error) {
            console.error('Error creating product:', error)
            alert('Ошибка при создании продукта. Попробуйте снова.')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="border rounded p-3 space-y-2">
                <div className="font-semibold">Новая категория</div>
                <input value={cName} onChange={e => setCName(e.target.value)} placeholder="Название" className="border px-3 py-2 rounded w-full" />
                <input value={cSlug} onChange={e => setCSlug(e.target.value)} placeholder="slug" className="border px-3 py-2 rounded w-full" />
                <button onClick={createCategory} className="px-3 py-2 border rounded w-full">Создать</button>
            </div>
            {selectedCategoryId && (
                <div className="border rounded p-3 space-y-2">
                    <div className="font-semibold">Новый продукт</div>
                    <div className="text-sm text-gray-600 mb-2">
                        Категория: {categories.find(c => c.id === selectedCategoryId)?.name || 'Неизвестно'}
                    </div>
                    <input
                        value={pName}
                        onChange={e => setPName(e.target.value)}
                        placeholder="Название"
                        className="border px-3 py-2 rounded w-full"
                    />
                    <input
                        value={pPrice}
                        onChange={e => setPPrice(e.target.value)}
                        placeholder="Цена"
                        type="number"
                        className="border px-3 py-2 rounded w-full"
                    />
                    <div>
                        <label className="block text-sm font-medium mb-1">Изображение (опционально)</label>
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/jpeg,image/jpg,image/png,image/webp"
                            onChange={handleImageChange}
                            className="border px-3 py-2 rounded w-full text-sm"
                        />
                        {(pImagePreview || !pImage) && (
                            <div className="mt-2 relative w-full h-32 rounded overflow-hidden border">
                                <img
                                    src={pImagePreview || '/cup.png'}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={createProduct}
                        disabled={uploading || !pName || !pPrice}
                        className="px-3 py-2 border rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {uploading ? 'Загрузка...' : 'Добавить продукт'}
                    </button>
                </div>
            )}
        </div>
    )
}
