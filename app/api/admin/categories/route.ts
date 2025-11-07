import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Используем явный массив, так как enum может быть еще не сгенерирован
const VALID_SLUGS = ['coffe', 'tea', 'croisant', 'macaroon', 'rahat', 'cheese'] as const
type CategorySlug = typeof VALID_SLUGS[number]

export async function GET() {
    try {
        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { products: true } } }
        })
        return NextResponse.json({ success: true, categories })
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, slug } = body as { name?: string; slug?: string }
        if (!name || !slug) {
            return NextResponse.json({ error: 'name and slug are required' }, { status: 400 })
        }
        if (!VALID_SLUGS.includes(slug as CategorySlug)) {
            return NextResponse.json({
                error: `slug must be one of: ${VALID_SLUGS.join(', ')}`
            }, { status: 400 })
        }
        const category = await prisma.category.create({
            data: { name, slug: slug as CategorySlug }
        })
        return NextResponse.json({ success: true, category }, { status: 201 })
    } catch (e: any) {
        if (e?.code === 'P2002') {
            return NextResponse.json({ error: 'slug must be unique' }, { status: 409 })
        }
        return NextResponse.json({ error: 'Failed to create category' }, { status: 500 })
    }
}


