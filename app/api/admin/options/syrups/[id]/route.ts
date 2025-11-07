import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const syrup = await prisma.syrup.findUnique({
            where: { id },
        })
        if (!syrup) return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ success: true, syrup })
    } catch {
        return NextResponse.json({ error: 'Failed to fetch syrup' }, { status: 500 })
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
        const syrup = await prisma.syrup.update({
            where: { id },
            data,
        })
        return NextResponse.json({ success: true, syrup })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        if (e?.code === 'P2002') return NextResponse.json({ error: 'Syrup with this name already exists' }, { status: 400 })
        return NextResponse.json({ error: 'Failed to update syrup' }, { status: 500 })
    }
}

export async function DELETE(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        await prisma.syrup.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (e: any) {
        if (e?.code === 'P2025') return NextResponse.json({ error: 'Not found' }, { status: 404 })
        return NextResponse.json({ error: 'Failed to delete syrup' }, { status: 500 })
    }
}

