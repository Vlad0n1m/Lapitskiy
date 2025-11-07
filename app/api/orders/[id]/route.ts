import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// ============================================
// GET /api/orders/[id]
// ============================================
// Получает заказ со всеми позициями и историей статусов

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;

        // Получаем заказ с позициями и историей
        const order = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true,
                statusHistory: {
                    orderBy: {
                        changedAt: 'desc'
                    }
                }
            }
        });

        if (!order) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            order: order
        });

    } catch (error) {
        console.error('Unexpected error fetching order:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

