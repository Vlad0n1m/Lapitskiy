import { NextRequest, NextResponse } from 'next/server';
import { parseCallbackData, actionToStatus, answerCallbackQuery } from '@/lib/telegram';

// ============================================
// POST /api/telegram/webhook
// ============================================
// Обрабатывает webhook от Telegram Bot API
// Получает callback_query от inline-кнопок

export async function POST(request: NextRequest) {
    try {
        // Проверяем secret token для безопасности
        const secretToken = request.headers.get('X-Telegram-Bot-Api-Secret-Token');
        const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET;

        if (expectedToken && secretToken !== expectedToken) {
            console.error('Invalid webhook secret token');
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const update = await request.json();

        // Обрабатываем callback_query (нажатия на inline-кнопки)
        if (update.callback_query) {
            const callbackQuery = update.callback_query;
            const callbackData = callbackQuery.data;
            const callbackQueryId = callbackQuery.id;
            const user = callbackQuery.from;

            console.log('Received callback_query:', {
                data: callbackData,
                user: user.username || user.id
            });

            // Парсим callback_data
            const parsed = parseCallbackData(callbackData);

            if (!parsed) {
                await answerCallbackQuery(callbackQueryId, 'Неверный формат данных', true);
                return NextResponse.json({ ok: true });
            }

            const { orderId, action } = parsed;

            // Конвертируем action в статус
            const newStatus = actionToStatus(action);

            if (!newStatus) {
                await answerCallbackQuery(callbackQueryId, 'Неизвестное действие', true);
                return NextResponse.json({ ok: true });
            }

            // Обновляем статус заказа через наш API
            try {
                const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
                const statusUpdateUrl = `${baseUrl}/api/orders/${orderId}/status`;

                const response = await fetch(statusUpdateUrl, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        status: newStatus,
                        changed_by: 'staff',
                        comment: `Changed by @${user.username || user.id} via Telegram`
                    })
                });

                const result = await response.json();

                if (response.ok) {
                    // Успешно обновили статус
                    const statusMessages: Record<string, string> = {
                        'accepted': '✅ Заказ принят',
                        'in_progress': '⏳ Заказ в работе',
                        'ready': '☕ Заказ готов',
                        'on_the_way': '🚗 Курьер в пути',
                        'delivered': '✅ Заказ доставлен',
                        'picked_up': '✅ Заказ выдан',
                        'cancelled': '🚫 Заказ отменен'
                    };

                    await answerCallbackQuery(
                        callbackQueryId,
                        statusMessages[newStatus] || 'Статус обновлен',
                        false
                    );
                } else {
                    // Ошибка при обновлении статуса
                    console.error('Error updating status:', result);
                    await answerCallbackQuery(
                        callbackQueryId,
                        'Ошибка обновления статуса',
                        true
                    );
                }
            } catch (error) {
                console.error('Error calling status update API:', error);
                await answerCallbackQuery(
                    callbackQueryId,
                    'Ошибка сервера',
                    true
                );
            }

            return NextResponse.json({ ok: true });
        }

        // Обрабатываем обычные сообщения (если нужно в будущем)
        if (update.message) {
            const message = update.message;
            const chatId = message.chat.id;
            const text = message.text;

            // Можно добавить обработку команд /start, /help и т.д.
            if (text === '/start') {
                // Здесь можно реализовать регистрацию клиента
                // Сохранить telegram_user_id для последующих уведомлений
                console.log('User started bot:', message.from);
            }

            return NextResponse.json({ ok: true });
        }

        // Если это не callback_query и не message, просто возвращаем ok
        return NextResponse.json({ ok: true });

    } catch (error) {
        console.error('Error processing webhook:', error);
        // Всегда возвращаем 200 OK для Telegram, чтобы он не переотправлял webhook
        return NextResponse.json({ ok: true });
    }
}

// ============================================
// GET /api/telegram/webhook
// ============================================
// Для проверки работы webhook

export async function GET() {
    return NextResponse.json({
        status: 'Telegram webhook endpoint is running',
        timestamp: new Date().toISOString()
    });
}

