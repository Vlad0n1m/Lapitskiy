'use client'
import { useEffect, useState } from 'react'

export default function DateFilters() {
    const [nowIso, setNowIso] = useState<string | null>(null)

    useEffect(() => {
        // Вычисляем время только на клиенте после монтирования,
        // чтобы избежать рассинхрона SSR/CSR
        setNowIso(new Date().toISOString())
    }, [])

    const items = [
        { label: 'Сегодня', days: 0 },
        { label: '7 дней', days: 7 },
        { label: '30 дней', days: 30 },
    ]

    return (
        <div className="flex gap-2 overflow-auto">
            {items.map(({ label, days }) => {
                if (!nowIso) {
                    return (
                        <span key={label} className="px-3 py-2 border rounded text-sm opacity-70">
                            {label}
                        </span>
                    )
                }
                const from = new Date(new Date(nowIso).getTime() - days * 86400000).toISOString()
                return (
                    <a
                        key={label}
                        href={`?from=${encodeURIComponent(from)}`}
                        className="px-3 py-2 border rounded text-sm"
                    >
                        {label}
                    </a>
                )
            })}
        </div>
    )
}

