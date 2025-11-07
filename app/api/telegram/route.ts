import { NextRequest, NextResponse } from 'next/server';

// ============================================
// DEPRECATED ENDPOINT
// ============================================
// Этот endpoint больше не используется.
// Заказы теперь создаются через /api/orders/create
// который автоматически отправляет уведомления в Telegram.
//
// Этот файл оставлен для обратной совместимости
// и будет перенаправлять на новый API.

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        console.warn('DEPRECATED: /api/telegram endpoint is deprecated. Use /api/orders/create instead.');

        // Перенаправляем на новый API
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
        const createOrderUrl = `${baseUrl}/api/orders/create`;

        // Конвертируем старый формат в новый
        const newFormatBody = {
            phone: body.orderData?.phone || '',
            totalPrice: body.totalPrice || 0,
            paymentMethod: body.orderData?.paymentMethod || 'cash',
            deliveryMethod: body.orderData?.deliveryMethod || 'pickup',
            deliveryAddress: body.orderData?.address,
            comment: body.orderData?.comment,
            products: body.products || []
        };

        const response = await fetch(createOrderUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newFormatBody)
        });

        const result = await response.json();

        if (response.ok) {
            return NextResponse.json({ 
                success: true, 
                message: 'Order created and sent to Telegram',
                ...result 
            });
        } else {
            return NextResponse.json(
                { error: 'Failed to create order', details: result },
                { status: response.status }
            );
        }

    } catch (error) {
        console.error('Error in deprecated telegram endpoint:', error);
        return NextResponse.json(
            { error: 'Failed to process order' },
            { status: 500 }
        );
    }
}

// GET endpoint для проверки статуса
export async function GET() {
    return NextResponse.json({
        status: 'deprecated',
        message: 'This endpoint is deprecated. Use /api/orders/create instead.',
        new_endpoint: '/api/orders/create',
        timestamp: new Date().toISOString()
    });
}

