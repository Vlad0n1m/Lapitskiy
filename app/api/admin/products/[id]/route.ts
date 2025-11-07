import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const product = await prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                sizes: { orderBy: { createdAt: 'asc' } },
                syrups: { include: { syrup: true } },
                milks: { include: { milk: true } },
                extras: { include: { extra: true } },
            }
        })
        if (!product) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true, product })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const body = await req.json()
        const data: any = {}
        if (typeof body.name === 'string') data.name = body.name
        if (typeof body.price === 'number') data.price = Math.round(body.price)
        if (typeof body.imageUrl === 'string' || body.imageUrl === null) data.imageUrl = body.imageUrl
        if (typeof body.isActive === 'boolean') data.isActive = body.isActive
        if (typeof body.categoryId === 'string') data.categoryId = body.categoryId
        if (typeof body.allowHot === 'boolean') data.allowHot = body.allowHot
        if (typeof body.allowCold === 'boolean') data.allowCold = body.allowCold
        if (typeof body.hotSurcharge === 'number') data.hotSurcharge = Math.round(body.hotSurcharge)
        if (typeof body.coldSurcharge === 'number') data.coldSurcharge = Math.round(body.coldSurcharge)

        const product = await prisma.product.update({
            where: { id },
            data,
            include: {
                category: true,
                sizes: { orderBy: { createdAt: 'asc' } },
                syrups: { include: { syrup: true } },
                milks: { include: { milk: true } },
                extras: { include: { extra: true } },
            }
        })
        return NextResponse.json({ success: true, product })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        if (e?.code === 'P2003') return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 })
        return NextResponse.json({ error: 'Failed to update product' }, { status: 500 })
    }
}

export async function DELETE(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        await prisma.product.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 })
    }
}



