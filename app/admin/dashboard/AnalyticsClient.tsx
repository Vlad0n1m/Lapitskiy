'use client'
import { useState, useEffect } from 'react'

async function fetchAnalytics(search: string) {
    const res = await fetch(`/api/admin/analytics${search ? `?${search}` : ''}`, { cache: 'no-store' })
    if (!res.ok) throw new Error('Failed to load analytics')
    return res.json()
}

export default function AnalyticsClient({ search }: { search: string }) {
    const [state, setState] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(true)
        fetchAnalytics(search)
            .then(setState)
            .catch(() => setState({ error: true }))
            .finally(() => setLoading(false))
    }, [search])

    if (loading) return <div>Загружаем метрики…</div>
    if (!state || state.error) return <div>Не удалось загрузить аналитику</div>

    const { revenueTotal, ordersCount, avgOrderValue, topProducts, statusFunnel, timeseries } = state

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <KPI title="Выручка" value={`${revenueTotal} ₸`} />
                <KPI title="Заказы" value={ordersCount} />
                <KPI title="Средний чек" value={`${avgOrderValue} ₸`} />
            </div>

            <section>
                <h3 className="font-semibold mb-2">Динамика</h3>
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[480px] w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 text-left">Дата</th>
                                <th className="p-2 text-right">Заказы</th>
                                <th className="p-2 text-right">Выручка</th>
                            </tr>
                        </thead>
                        <tbody>
                            {timeseries?.map((r: any) => (
                                <tr key={r.date} className="border-t">
                                    <td className="p-2">{r.date}</td>
                                    <td className="p-2 text-right">{r.orders}</td>
                                    <td className="p-2 text-right">{r.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h3 className="font-semibold mb-2">Топ товаров</h3>
                <div className="w-full overflow-x-auto">
                    <table className="min-w-[480px] w-full text-sm border">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="p-2 text-left">Товар</th>
                                <th className="p-2 text-right">Кол-во</th>
                                <th className="p-2 text-right">Выручка</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topProducts?.map((p: any) => (
                                <tr key={p.name} className="border-t">
                                    <td className="p-2">{p.name}</td>
                                    <td className="p-2 text-right">{p.qty}</td>
                                    <td className="p-2 text-right">{p.revenue}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>

            <section>
                <h3 className="font-semibold mb-2">Воронка статусов</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                    {Object.entries(statusFunnel || {}).map(([k, v]) => (
                        <div key={k} className="border rounded p-2 flex items-center justify-between">
                            <span>{k}</span>
                            <span className="font-semibold">{v as any}</span>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    )
}

function KPI({ title, value }: { title: string; value: number | string }) {
    return (
        <div className="border rounded p-3">
            <div className="text-xs text-gray-500">{title}</div>
            <div className="text-lg font-semibold">{value}</div>
        </div>
    )
}



