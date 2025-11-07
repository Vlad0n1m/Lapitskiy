import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const categoryId = searchParams.get('categoryId') || undefined
        const q = searchParams.get('q') || undefined
        const includeInactive = searchParams.get('includeInactive') === 'true'
        const take = Number(searchParams.get('take') || 50)
        const skip = Number(searchParams.get('skip') || 0)

        const where: any = {}
        if (categoryId) where.categoryId = categoryId
        if (!includeInactive) where.isActive = true
        if (q) where.name = { contains: q, mode: 'insensitive' }

        const [items, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: { category: true },
                take,
                skip,
            }),
            prisma.product.count({ where })
        ])

        return NextResponse.json({ success: true, items, total })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, price, categoryId, imageUrl, isActive } = body as {
            name?: string; price?: number; categoryId?: string; imageUrl?: string; isActive?: boolean
        }
        if (!name || typeof price !== 'number' || !categoryId) {
            return NextResponse.json({ error: 'name, price, categoryId required' }, { status: 400 })
        }
        const product = await prisma.product.create({
            data: {
                name,
                price: Math.round(price),
                categoryId,
                imageUrl: imageUrl || '/cup.png',
                isActive: typeof isActive === 'boolean' ? isActive : true,
            }
        })
        return NextResponse.json({ success: true, product }, { status: 201 })
    } catch (e: any) {
        if (e?.code === 'P2003') {
            return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 })
        }
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
    }
}


