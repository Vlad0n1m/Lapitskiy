import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { OrderStatus, ChangedBy } from '@prisma/client';
import type { Order, OrderItem } from '@prisma/client';
import { updateOrderMessage, sendNotificationToCustomer } from '@/lib/telegram';

// ============================================
// Types
// ============================================

interface UpdateStatusRequest {
    status: OrderStatus;
    changed_by?: ChangedBy;
    comment?: string;
}

// ============================================
// PUT /api/orders/[id]/status
// ============================================
// Обновляет статус заказа, историю и отправляет уведомления

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const orderId = params.id;
        const body: UpdateStatusRequest = await request.json();

        // Валидация
        if (!body.status) {
            return NextResponse.json(
                { error: 'Status is required' },
                { status: 400 }
            );
        }

        // Получаем текущий заказ
        const currentOrder = await prisma.order.findUnique({
            where: { id: orderId },
            include: {
                items: true
            }
        });

        if (!currentOrder) {
            return NextResponse.json(
                { error: 'Order not found' },
                { status: 404 }
            );
        }

        const oldStatus = currentOrder.status;

        // Проверяем, не пытаемся ли мы установить тот же статус
        if (oldStatus === body.status) {
            return NextResponse.json(
                { success: true, message: 'Status is already set to this value', order: currentOrder }
            );
        }

        // Обновляем статус заказа и логируем изменение
        const updatedOrder = await prisma.order.update({
            where: { id: orderId },
            data: {
                status: body.status
            }
        });

        // Логируем изменение статуса
        await prisma.orderStatusHistory.create({
            data: {
                orderId: orderId,
                oldStatus: oldStatus,
                newStatus: body.status,
                changedBy: body.changed_by || 'staff',
                comment: body.comment
            }
        });

        // Обновляем сообщение в Telegram группе (кнопки и статус)
        if (currentOrder.telegramMessageId) {
            try {
                await updateOrderMessage(
                    Number(currentOrder.telegramMessageId),
                    updatedOrder,
                    currentOrder.items
                );
            } catch (telegramError) {
                console.error('Error updating Telegram message:', telegramError);
                // Не возвращаем ошибку, статус уже обновлен
            }
        }

        // Отправляем уведомление клиенту (если есть telegram_user_id)
        if (currentOrder.telegramUserId) {
            try {
                await sendNotificationToCustomer(
                    Number(currentOrder.telegramUserId),
                    currentOrder.orderNumber,
                    body.status
                );
            } catch (notificationError) {
                console.error('Error sending customer notification:', notificationError);
                // Не возвращаем ошибку, т.к. клиент мог не запустить бота
            }
        }

        return NextResponse.json({
            success: true,
            message: 'Order status updated successfully',
            order: {
                id: updatedOrder.id,
                order_number: updatedOrder.orderNumber,
                old_status: oldStatus,
                new_status: updatedOrder.status,
                updated_at: updatedOrder.updatedAt
            }
        });

    } catch (error) {
        console.error('Unexpected error updating order status:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

