import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Используем явный массив, так как enum может быть еще не сгенерирован
const VALID_SLUGS = ['coffe', 'tea', 'croisant', 'macaroon', 'rahat', 'cheese'] as const
type CategorySlug = typeof VALID_SLUGS[number]

export async function GET(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const category = await prisma.category.findUnique({
            where: { id: params.id },
            include: { products: true }
        })
        if (!category) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true, category })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await req.json()
        const data: { name?: string; slug?: CategorySlug } = {}
        if (typeof body.name === 'string') data.name = body.name
        if (typeof body.slug === 'string') {
            if (!VALID_SLUGS.includes(body.slug as CategorySlug)) {
                return NextResponse.json({
                    error: `slug must be one of: ${VALID_SLUGS.join(', ')}`
                }, { status: 400 })
            }
            data.slug = body.slug as CategorySlug
        }
        const category = await prisma.category.update({ where: { id: params.id }, data })
        return NextResponse.json({ success: true, category })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        if (e?.code === 'P2002') return NextResponse.json({ error: 'slug must be unique' }, { status: 409 })
        return NextResponse.json({ error: 'Failed to update category' }, { status: 500 })
    }
}

export async function DELETE(
    _req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const count = await prisma.product.count({ where: { categoryId: params.id } })
        if (count > 0) {
            return NextResponse.json({ error: 'Category has products' }, { status: 400 })
        }
        await prisma.category.delete({ where: { id: params.id } })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 })
    }
}


