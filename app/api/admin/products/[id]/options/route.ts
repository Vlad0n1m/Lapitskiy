import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    _req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const [syrups, milks, extras, productSyrups, productMilks, productExtras] = await Promise.all([
            prisma.syrup.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
            prisma.milk.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
            prisma.extra.findMany({ where: { isActive: true }, orderBy: { name: 'asc' } }),
            prisma.productSyrup.findMany({ where: { productId: id } }),
            prisma.productMilk.findMany({ where: { productId: id } }),
            prisma.productExtra.findMany({ where: { productId: id } }),
        ])

        // Map enabled options
        const enabledSyrupIds = new Set(productSyrups.filter(ps => ps.isEnabled).map(ps => ps.syrupId))
        const enabledMilkIds = new Set(productMilks.filter(pm => pm.isEnabled).map(pm => pm.milkId))
        const enabledExtraIds = new Set(productExtras.filter(pe => pe.isEnabled).map(pe => pe.extraId))

        return NextResponse.json({
            success: true,
            syrups: syrups.map(s => ({ ...s, isEnabled: enabledSyrupIds.has(s.id) })),
            milks: milks.map(m => ({ ...m, isEnabled: enabledMilkIds.has(m.id) })),
            extras: extras.map(e => ({ ...e, isEnabled: enabledExtraIds.has(e.id) })),
        })
    } catch (error) {
        console.error('Error fetching options:', error)
        return NextResponse.json({ error: 'Failed to fetch options' }, { status: 500 })
    }
}

export async function PATCH(
    req: NextRequest,
    ctx: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await ctx.params
        const body = await req.json()
        const { syrupIds, milkIds, extraIds } = body as {
            syrupIds?: string[]
            milkIds?: string[]
            extraIds?: string[]
        }

        // Check if product exists
        const product = await prisma.product.findUnique({ where: { id } })
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 })
        }

        // Update syrups
        if (Array.isArray(syrupIds)) {
            // Get all active syrups
            const allSyrups = await prisma.syrup.findMany({ where: { isActive: true } })
            const allSyrupIds = new Set(allSyrups.map(s => s.id))
            const enabledSyrupIds = new Set(syrupIds.filter(syrupId => allSyrupIds.has(syrupId)))

            // Delete all existing relations
            await prisma.productSyrup.deleteMany({ where: { productId: id } })

            // Create new relations
            if (enabledSyrupIds.size > 0) {
                await prisma.productSyrup.createMany({
                    data: Array.from(enabledSyrupIds).map(syrupId => ({
                        productId: id,
                        syrupId,
                        isEnabled: true,
                    })),
                })
            }
        }

        // Update milks
        if (Array.isArray(milkIds)) {
            const allMilks = await prisma.milk.findMany({ where: { isActive: true } })
            const allMilkIds = new Set(allMilks.map(m => m.id))
            const enabledMilkIds = new Set(milkIds.filter(milkId => allMilkIds.has(milkId)))

            await prisma.productMilk.deleteMany({ where: { productId: id } })

            if (enabledMilkIds.size > 0) {
                await prisma.productMilk.createMany({
                    data: Array.from(enabledMilkIds).map(milkId => ({
                        productId: id,
                        milkId,
                        isEnabled: true,
                    })),
                })
            }
        }

        // Update extras
        if (Array.isArray(extraIds)) {
            const allExtras = await prisma.extra.findMany({ where: { isActive: true } })
            const allExtraIds = new Set(allExtras.map(e => e.id))
            const enabledExtraIds = new Set(extraIds.filter(extraId => allExtraIds.has(extraId)))

            await prisma.productExtra.deleteMany({ where: { productId: id } })

            if (enabledExtraIds.size > 0) {
                await prisma.productExtra.createMany({
                    data: Array.from(enabledExtraIds).map(extraId => ({
                        productId: id,
                        extraId,
                        isEnabled: true,
                    })),
                })
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error updating options:', error)
        return NextResponse.json({ error: 'Failed to update options' }, { status: 500 })
    }
}

