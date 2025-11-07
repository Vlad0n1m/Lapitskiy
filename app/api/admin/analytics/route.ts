import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function parseDate(value: string | null, fallbackDays: number): Date {
    if (value) {
        const d = new Date(value)
        if (!isNaN(d.getTime())) return d
    }
    const d = new Date()
    d.setDate(d.getDate() - fallbackDays)
    d.setHours(0, 0, 0, 0)
    return d
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const from = parseDate(searchParams.get('from'), 7)
        const to = parseDate(searchParams.get('to'), 0)
        to.setHours(23, 59, 59, 999)

        const [orders, items] = await Promise.all([
            prisma.order.findMany({
                where: { createdAt: { gte: from, lte: to } },
                select: { id: true, totalPrice: true, status: true, createdAt: true }
            }),
            prisma.orderItem.findMany({
                where: { createdAt: { gte: from, lte: to } },
                select: { productName: true, quantity: true, price: true }
            })
        ])

        const revenueTotal = orders.reduce((s, o) => s + o.totalPrice, 0)
        const ordersCount = orders.length
        const avgOrderValue = ordersCount ? Math.round(revenueTotal / ordersCount) : 0

        // Status funnel
        const statuses = [
            'new', 'accepted', 'in_progress', 'ready', 'on_the_way', 'delivered', 'picked_up', 'cancelled'
        ] as const
        const statusFunnel: Record<string, number> = {}
        for (const s of statuses) statusFunnel[s] = 0
        for (const o of orders) statusFunnel[o.status] = (statusFunnel[o.status] || 0) + 1

        // Top products
        const productAgg = new Map<string, { name: string; qty: number; revenue: number }>()
        for (const it of items) {
            const entry = productAgg.get(it.productName) || { name: it.productName, qty: 0, revenue: 0 }
            entry.qty += it.quantity
            entry.revenue += it.quantity * it.price
            productAgg.set(it.productName, entry)
        }
        const topProducts = Array.from(productAgg.values())
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 20)

        // Timeseries by day
        const byDay = new Map<string, { date: string; orders: number; revenue: number }>()
        for (const o of orders) {
            const key = o.createdAt.toISOString().slice(0, 10)
            const entry = byDay.get(key) || { date: key, orders: 0, revenue: 0 }
            entry.orders += 1
            entry.revenue += o.totalPrice
            byDay.set(key, entry)
        }
        const timeseries = Array.from(byDay.values()).sort((a, b) => a.date.localeCompare(b.date))

        return NextResponse.json({
            success: true,
            range: { from, to },
            revenueTotal,
            ordersCount,
            avgOrderValue,
            topProducts,
            statusFunnel,
            timeseries,
        })
    } catch (e) {
        return NextResponse.json({ error: 'Failed to compute analytics' }, { status: 500 })
    }
}




