import { NextRequest, NextResponse } from 'next/server';
import { prisma, generateOrderNumber, formatPhoneNumber } from '@/lib/prisma';
import { sendOrderToStaffGroup } from '@/lib/telegram';
import type { Order, OrderItem } from '@prisma/client';

// ============================================
// Types
// ============================================

interface CreateOrderRequest {
    phone: string;
    totalPrice: number;
    paymentMethod: 'cash' | 'card' | 'kaspi';
    deliveryMethod: 'pickup' | 'delivery';
    deliveryAddress?: string;
    comment?: string;
    telegram_user_id?: number;
    telegram_username?: string;
    products: Array<{
        name: string;
        size: string;
        volumeMl?: number;
        sirop?: string;
        syrupId?: string;
        milkId?: string;
        extraIds?: string[];
        temperature?: 'hot' | 'cold';
        qty: number;
        final_price: number;
    }>;
}

// ============================================
// POST /api/orders/create
// ============================================
// Создает новый заказ в Supabase и отправляет уведомление в Telegram

export async function POST(request: NextRequest) {
    try {
        const body: CreateOrderRequest = await request.json();

        // Валидация
        if (!body.phone || !body.totalPrice || !body.paymentMethod || !body.deliveryMethod) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        if (!body.products || body.products.length === 0) {
            return NextResponse.json(
                { error: 'Order must contain at least one product' },
                { status: 400 }
            );
        }

        if (body.deliveryMethod === 'delivery' && !body.deliveryAddress) {
            return NextResponse.json(
                { error: 'Delivery address is required for delivery orders' },
                { status: 400 }
            );
        }

        // Генерируем номер заказа
        const orderNumber = generateOrderNumber();
        const formattedPhone = formatPhoneNumber(body.phone);

        // Создаем заказ с позициями в одной транзакции
        const order = await prisma.order.create({
            data: {
                orderNumber: orderNumber,
                phone: formattedPhone,
                totalPrice: body.totalPrice,
                paymentMethod: body.paymentMethod,
                deliveryMethod: body.deliveryMethod,
                deliveryAddress: body.deliveryAddress,
                comment: body.comment,
                telegramUserId: body.telegram_user_id ? BigInt(body.telegram_user_id) : null,
                telegramUsername: body.telegram_username,
                status: 'new',
                items: {
                    create: body.products.map(product => ({
                        productName: product.name,
                        size: product.size,
                        volumeMl: product.volumeMl || null,
                        sirop: product.sirop || null,
                        syrupId: product.syrupId || null,
                        milkId: product.milkId || null,
                        extraIds: product.extraIds ? JSON.stringify(product.extraIds) : null,
                        temperature: product.temperature || null,
                        quantity: product.qty,
                        price: product.final_price
                    }))
                }
            },
            include: {
                items: true
            }
        });

        // Отправляем уведомление в Telegram группу сотрудников
        let telegramMessageId: number | null = null;

        try {
            telegramMessageId = await sendOrderToStaffGroup(
                order as Order,
                order.items as OrderItem[]
            );

            // Сохраняем message_id для последующего обновления кнопок
            if (telegramMessageId) {
                await prisma.order.update({
                    where: { id: order.id },
                    data: { telegramMessageId: BigInt(telegramMessageId) }
                });
            }
        } catch (telegramError) {
            console.error('Error sending to Telegram:', telegramError);
            // Не возвращаем ошибку, т.к. заказ уже создан
            // Продолжаем работу даже если Telegram недоступен
        }

        // Логируем создание заказа
        await prisma.orderStatusHistory.create({
            data: {
                orderId: order.id,
                oldStatus: null,
                newStatus: 'new',
                changedBy: 'system',
                comment: 'Order created'
            }
        });

        return NextResponse.json({
            success: true,
            order: {
                id: order.id,
                order_number: orderNumber,
                status: order.status,
                telegram_message_sent: telegramMessageId !== null
            }
        }, { status: 201 });

    } catch (error) {
        console.error('Unexpected error creating order:', error);

        // Prisma specific error handling
        if (error && typeof error === 'object' && 'code' in error) {
            const prismaError = error as { code: string; meta?: any };

            if (prismaError.code === 'P2002') {
                return NextResponse.json(
                    { error: 'Order with this number already exists' },
                    { status: 409 }
                );
            }
        }

        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

