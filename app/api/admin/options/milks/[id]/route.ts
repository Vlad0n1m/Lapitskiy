import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const milk = await prisma.milk.findUnique({
            where: { id },
        })
        if (!milk) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true, milk })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch milk' }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const body = await req.json()
        const data: any = {}
        if (typeof body.name === 'string') data.name = body.name.trim()
        if (typeof body.price === 'number') data.price = Math.round(body.price)
        if (typeof body.isActive === 'boolean') data.isActive = body.isActive

        const { id } = await ctx.params
        const milk = await prisma.milk.update({
            where: { id },
            data,
        })
        return NextResponse.json({ success: true, milk })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        if (e?.code === 'P2002') return NextResponse.json({ error: 'Milk with this name already exists' }, { status: 400 })
        return NextResponse.json({ error: 'Failed to update milk' }, { status: 500 })
    }
}

export async function DELETE(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        await prisma.milk.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ error: 'Failed to delete milk' }, { status: 500 })
    }
}

