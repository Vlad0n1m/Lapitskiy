import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const sizes = await prisma.productSize.findMany({
            where: { productId: id },
            orderBy: { createdAt: 'asc' },
        })
        return NextResponse.json({ success: true, sizes })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch sizes' }, { status: 500 })
    }
}

export async function POST(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id: productId } = await ctx.params
        const body = await req.json()
        const { name, volumeMl, price, isActive, id: sizeId } = body as {
            name?: string
            volumeMl?: number
            price?: number
            isActive?: boolean
            id?: string
        }

        if (!name || typeof volumeMl !== 'number' || typeof price !== 'number') {
            return NextResponse.json({ error: 'name, volumeMl, and price required' }, { status: 400 })
        }

        // Check if product exists
        const product = await prisma.product.findUnique({ where: { id: productId } })
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // If id provided, update existing size
        if (sizeId) {
            const size = await prisma.productSize.update({
                where: { id: sizeId },
                data: {
                    name: name.trim(),
                    volumeMl: Math.round(volumeMl),
                    price: Math.round(price),
                    isActive: typeof isActive === 'boolean' ? isActive : true,
                },
            })
            return NextResponse.json({ success: true, size })
        }

        // Create new size
        const size = await prisma.productSize.create({
            data: {
                productId,
                name: name.trim(),
                volumeMl: Math.round(volumeMl),
                price: Math.round(price),
                isActive: typeof isActive === 'boolean' ? isActive : true,
            },
        })

        return NextResponse.json({ success: true, size }, { status: 201 })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        console.error('Error creating/updating size:', e)
        return NextResponse.json({ error: 'Failed to create/update size' }, { status: 500 })
    }
}

export async function DELETE(
    req: NextRequest,
    _ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { searchParams } = new URL(req.url)
        const sizeId = searchParams.get('sizeId')
        if (!sizeId) {
            return NextResponse.json({ error: 'sizeId required' }, { status: 400 })
        }

        await prisma.productSize.delete({ where: { id: sizeId } })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ error: 'Failed to delete size' }, { status: 500 })
    }
}

