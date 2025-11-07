import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const includeInactive = searchParams.get('includeInactive') === 'true'

        const where: any = {}
        if (!includeInactive) where.isActive = true

        const milks = await prisma.milk.findMany({
            where,
            orderBy: { name: 'asc' },
        })

        return NextResponse.json({ success: true, milks })
    } catch (error) {
        console.error('Error fetching milks:', error)
        return NextResponse.json({ error: 'Failed to fetch milks' }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { name, price, isActive } = body as {
            name?: string
            price?: number
            isActive?: boolean
        }

        if (!name || typeof price !== 'number') {
            return NextResponse.json({ error: 'name and price required' }, { status: 400 })
        }

        const milk = await prisma.milk.create({
            data: {
                name: name.trim(),
                price: Math.round(price),
                isActive: typeof isActive === 'boolean' ? isActive : true,
            },
        })

        return NextResponse.json({ success: true, milk }, { status: 201 })
    } catch (e: any) {
        if (e?.code === 'P2002') {
            return NextResponse.json({ error: 'Milk with this name already exists' }, { status: 400 })
        }
        console.error('Error creating milk:', e)
        return NextResponse.json({ error: 'Failed to create milk' }, { status: 500 })
    }
}


