import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const categorySlug = searchParams.get('categorySlug') || undefined
        const take = Number(searchParams.get('take') || 50)
        const skip = Number(searchParams.get('skip') || 0)

        const where: any = { isActive: true }
        
        if (categorySlug) {
            const category = await prisma.category.findUnique({
                where: { slug: categorySlug as any },
            })
            if (category) {
                where.categoryId = category.id
            } else {
                return NextResponse.json({ success: true, items: [], total: 0 })
            }
        }

        const [items, total] = await Promise.all([
            prisma.product.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                include: {
                    category: true,
                    sizes: { where: { isActive: true }, orderBy: { createdAt: 'asc' } },
                    syrups: {
                        where: { isEnabled: true },
                        include: {
                            syrup: true
                        }
                    },
                    milks: {
                        where: { isEnabled: true },
                        include: {
                            milk: true
                        }
                    },
                    extras: {
                        where: { isEnabled: true },
                        include: {
                            extra: true
                        }
                    },
                },
                take,
                skip,
            }),
            prisma.product.count({ where })
        ])

        // Фильтруем опции по isActive на уровне приложения
        const filteredItems = items.map(item => ({
            ...item,
            syrups: item.syrups.filter(ps => ps.syrup?.isActive),
            milks: item.milks.filter(pm => pm.milk?.isActive),
            extras: item.extras.filter(pe => pe.extra?.isActive),
        }))

        return NextResponse.json({ success: true, items: filteredItems, total })
    } catch (error) {
        console.error('Error fetching products:', error)
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
    }
}

