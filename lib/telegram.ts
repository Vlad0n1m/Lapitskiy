import axios from 'axios';
import { Order, OrderItem, OrderStatus, DeliveryMethod } from './prisma';

// ============================================
// Telegram Bot API Configuration
// ============================================

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_GROUP_CHAT_ID = process.env.TELEGRAM_GROUP_CHAT_ID || '';
const TELEGRAM_API_URL = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}`;

// ============================================
// Types
// ============================================

export interface InlineKeyboardButton {
    text: string;
    callback_data: string;
}

export interface InlineKeyboardMarkup {
    inline_keyboard: InlineKeyboardButton[][];
}

export interface TelegramMessage {
    chat_id: string | number;
    text: string;
    parse_mode?: 'HTML' | 'Markdown';
    reply_markup?: InlineKeyboardMarkup;
}

// ============================================
// Message Formatting
// ============================================

function getStatusText(status: OrderStatus, lang: 'ru' | 'en' = 'ru'): string {
    const map: Record<OrderStatus, { ru: string; en: string }> = {
        new: { ru: 'Новый', en: 'New' },
        accepted: { ru: 'Принят', en: 'Accepted' },
        in_progress: { ru: 'Готовится', en: 'In Progress' },
        ready: { ru: 'Готов', en: 'Ready' },
        on_the_way: { ru: 'В пути', en: 'On the way' },
        delivered: { ru: 'Доставлен', en: 'Delivered' },
        picked_up: { ru: 'Выдан', en: 'Picked up' },
        cancelled: { ru: 'Отменен', en: 'Cancelled' }
    };
    return map[status][lang];
}

function getStatusEmoji(status: OrderStatus): string {
    const map: Record<OrderStatus, string> = {
        new: '🟡',
        accepted: '🔵',
        in_progress: '🟠',
        ready: '🟢',
        on_the_way: '🚗',
        delivered: '✅',
        picked_up: '✅',
        cancelled: '🔴'
    };
    return map[status];
}

/**
 * Форматирует заказ для отправки в Telegram группу
 */
export function formatOrderMessage(
    order: Order,
    items: OrderItem[]
): string {
    const orderDate = new Date(order.createdAt);
    const formattedDate = orderDate.toLocaleDateString('ru-RU', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    const formattedTime = orderDate.toLocaleTimeString('ru-RU', {
        hour: '2-digit',
        minute: '2-digit'
    });

    const paymentMethodNames: Record<string, string> = {
        cash: 'Наличными',
        card: 'Картой',
        kaspi: 'Kaspi Pay'
    };

    const deliveryMethodNames: Record<string, string> = {
        pickup: 'Самовывоз',
        delivery: 'Доставка'
    };

    const sizeNames: Record<string, string> = {
        small: 'Маленький',
        medium: 'Средний',
        big: 'Большой'
    };

    let message = `🔔 <b>НОВЫЙ ЗАКАЗ #${order.orderNumber}</b>\n`;
    message += `──────────────────────\n\n`;

    // Товары
    message += `☕ <b>Заказ:</b>\n`;
    items.forEach((item, index) => {
        message += `${index + 1}. <b>${item.product_name}</b>`;
        message += ` (${sizeNames[item.size] || item.size})`;

        if (item.sirop && item.sirop !== 'none' && item.sirop !== 'Нет') {
            message += ` + ${item.sirop}`;
        }

        message += ` x${item.quantity}`;
        message += ` - ${item.price * item.quantity} тг\n`;
    });

    message += `\n💰 <b>ИТОГО: ${order.totalPrice} тг</b>\n`;
    message += `──────────────────────\n`;

    // Детали заказа
    message += `💳 <b>Оплата:</b> ${paymentMethodNames[order.paymentMethod] || order.paymentMethod}\n`;
    message += `🚚 <b>Доставка:</b> ${deliveryMethodNames[order.deliveryMethod] || order.deliveryMethod}\n`;
    message += `📱 <b>Телефон:</b> ${order.phone}\n`;

    if (order.deliveryMethod === 'delivery' && order.deliveryAddress) {
        message += `📍 <b>Адрес:</b> ${order.deliveryAddress}\n`;
    }

    if (order.comment) {
        message += `💬 <b>Комментарий:</b> ${order.comment}\n`;
    }

    if (order.telegramUsername) {
        message += `👤 <b>Telegram:</b> @${order.telegramUsername}\n`;
    }

    message += `\n⏱️ <b>Время:</b> ${formattedDate} ${formattedTime}\n`;
    message += `📊 <b>Статус:</b> ${getStatusEmoji(order.status)} ${getStatusText(order.status)}\n`;

    return message;
}

/**
 * Генерирует inline-кнопки в зависимости от статуса заказа
 */
export function getInlineKeyboard(
    orderId: string,
    currentStatus: OrderStatus,
    deliveryMethod: DeliveryMethod
): InlineKeyboardMarkup {
    const buttons: InlineKeyboardButton[][] = [];

    switch (currentStatus) {
        case 'new':
            buttons.push([
                { text: '✅ Принять', callback_data: `order:${orderId}:accept` },
                { text: '🚫 Отклонить', callback_data: `order:${orderId}:cancel` }
            ]);
            break;

        case 'accepted':
            buttons.push([
                { text: '⏳ В работе', callback_data: `order:${orderId}:progress` },
                { text: '🚫 Отклонить', callback_data: `order:${orderId}:cancel` }
            ]);
            break;

        case 'in_progress':
            buttons.push([
                { text: '☕ Готов', callback_data: `order:${orderId}:ready` }
            ]);
            break;

        case 'ready':
            if (deliveryMethod === 'pickup') {
                buttons.push([
                    { text: '✅ Выдан', callback_data: `order:${orderId}:picked_up` }
                ]);
            } else {
                buttons.push([
                    { text: '🚗 В пути', callback_data: `order:${orderId}:on_the_way` }
                ]);
            }
            break;

        case 'on_the_way':
            buttons.push([
                { text: '✅ Доставлен', callback_data: `order:${orderId}:delivered` }
            ]);
            break;

        // Финальные статусы - кнопок нет
        case 'delivered':
        case 'picked_up':
        case 'cancelled':
            break;
    }

    return { inline_keyboard: buttons };
}

// ============================================
// Telegram API Functions
// ============================================

/**
 * Отправляет сообщение в Telegram
 */
export async function sendMessage(
    chatId: string | number,
    text: string,
    replyMarkup?: InlineKeyboardMarkup
): Promise<any> {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/sendMessage`, {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            reply_markup: replyMarkup
        });

        return response.data.result;
    } catch (error) {
        console.error('Error sending Telegram message:', error);
        throw error;
    }
}

/**
 * Отправляет заказ в группу сотрудников
 */
export async function sendOrderToStaffGroup(
    order: Order,
    items: OrderItem[]
): Promise<number | null> {
    try {
        const message = formatOrderMessage(order, items);
        const keyboard = getInlineKeyboard(order.id, order.status, order.deliveryMethod);

        const result = await sendMessage(TELEGRAM_GROUP_CHAT_ID, message, keyboard);

        // Возвращаем message_id для последующего обновления кнопок
        return result.message_id;
    } catch (error) {
        console.error('Error sending order to staff group:', error);
        return null;
    }
}

/**
 * Обновляет кнопки в существующем сообщении
 */
export async function updateMessageButtons(
    messageId: number,
    newStatus: OrderStatus,
    deliveryMethod: DeliveryMethod,
    orderId: string
): Promise<boolean> {
    try {
        const keyboard = getInlineKeyboard(orderId, newStatus, deliveryMethod);

        await axios.post(`${TELEGRAM_API_URL}/editMessageReplyMarkup`, {
            chat_id: TELEGRAM_GROUP_CHAT_ID,
            message_id: messageId,
            reply_markup: keyboard
        });

        return true;
    } catch (error) {
        console.error('Error updating message buttons:', error);
        return false;
    }
}

/**
 * Обновляет текст сообщения с новым статусом
 */
export async function updateOrderMessage(
    messageId: number,
    order: Order,
    items: OrderItem[]
): Promise<boolean> {
    try {
        const message = formatOrderMessage(order, items);
        const keyboard = getInlineKeyboard(order.id, order.status, order.deliveryMethod);

        await axios.post(`${TELEGRAM_API_URL}/editMessageText`, {
            chat_id: TELEGRAM_GROUP_CHAT_ID,
            message_id: messageId,
            text: message,
            parse_mode: 'HTML',
            reply_markup: keyboard
        });

        return true;
    } catch (error) {
        console.error('Error updating order message:', error);
        return false;
    }
}

/**
 * Отправляет уведомление клиенту
 */
export async function sendNotificationToCustomer(
    telegramUserId: number,
    orderNumber: string,
    newStatus: OrderStatus
): Promise<boolean> {
    try {
        const notifications: Record<OrderStatus, string> = {
            new: `🟡 Ваш заказ #${orderNumber} создан. Ожидайте подтверждения.`,
            accepted: `✅ Ваш заказ #${orderNumber} принят в работу!`,
            in_progress: `⏳ Ваш заказ #${orderNumber} готовится...`,
            ready: `☕ Ваш кофе готов! Можно забрать в течение 15 минут.`,
            on_the_way: `🚗 Ваш кофе в пути! Курьер уже направляется к вам.`,
            delivered: `✅ Ваш заказ доставлен. Спасибо, что выбрали нас ❤️\n\nОцените ваш заказ:`,
            picked_up: `✅ Спасибо за заказ! Приятного аппетита ☕`,
            cancelled: `🚫 Ваш заказ #${orderNumber} отменен. Для уточнения деталей свяжитесь с нами.`
        };

        const message = notifications[newStatus];

        await sendMessage(telegramUserId, message);
        return true;
    } catch (error) {
        console.error('Error sending notification to customer:', error);
        // Не бросаем ошибку, т.к. клиент мог не запустить бота
        return false;
    }
}

/**
 * Отвечает на callback query (убирает "часики" на кнопке)
 */
export async function answerCallbackQuery(
    callbackQueryId: string,
    text?: string,
    showAlert: boolean = false
): Promise<boolean> {
    try {
        await axios.post(`${TELEGRAM_API_URL}/answerCallbackQuery`, {
            callback_query_id: callbackQueryId,
            text: text,
            show_alert: showAlert
        });

        return true;
    } catch (error) {
        console.error('Error answering callback query:', error);
        return false;
    }
}

/**
 * Регистрирует webhook для получения обновлений от Telegram
 */
export async function setWebhook(webhookUrl: string, secretToken?: string): Promise<boolean> {
    try {
        const params: any = {
            url: webhookUrl,
            allowed_updates: ['callback_query', 'message']
        };

        if (secretToken) {
            params.secret_token = secretToken;
        }

        const response = await axios.post(`${TELEGRAM_API_URL}/setWebhook`, params);

        console.log('Webhook set successfully:', response.data);
        return response.data.ok;
    } catch (error) {
        console.error('Error setting webhook:', error);
        return false;
    }
}

/**
 * Получает информацию о текущем webhook
 */
export async function getWebhookInfo(): Promise<any> {
    try {
        const response = await axios.get(`${TELEGRAM_API_URL}/getWebhookInfo`);
        return response.data.result;
    } catch (error) {
        console.error('Error getting webhook info:', error);
        return null;
    }
}

/**
 * Удаляет webhook
 */
export async function deleteWebhook(): Promise<boolean> {
    try {
        const response = await axios.post(`${TELEGRAM_API_URL}/deleteWebhook`);
        return response.data.ok;
    } catch (error) {
        console.error('Error deleting webhook:', error);
        return false;
    }
}

// ============================================
// Helper Functions
// ============================================

/**
 * Проверяет, валиден ли Telegram User ID
 */
export function isValidTelegramUserId(userId: number | null | undefined): boolean {
    return userId !== null && userId !== undefined && userId > 0;
}

/**
 * Создает deep link для запуска бота с параметром заказа
 */
export function createOrderDeepLink(orderId: string): string {
    const botUsername = process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || '';
    return `https://t.me/${botUsername}?start=order_${orderId}`;
}

/**
 * Парсит callback_data от inline-кнопки
 * Формат: "order:orderId:action"
 */
export function parseCallbackData(callbackData: string): {
    type: string;
    orderId: string;
    action: string;
} | null {
    const parts = callbackData.split(':');

    if (parts.length !== 3 || parts[0] !== 'order') {
        return null;
    }

    return {
        type: parts[0],
        orderId: parts[1],
        action: parts[2]
    };
}

/**
 * Конвертирует action из callback_data в статус заказа
 */
export function actionToStatus(action: string): OrderStatus | null {
    const actionMap: Record<string, OrderStatus> = {
        'accept': 'accepted',
        'progress': 'in_progress',
        'ready': 'ready',
        'on_the_way': 'on_the_way',
        'delivered': 'delivered',
        'picked_up': 'picked_up',
        'cancel': 'cancelled'
    };

    return actionMap[action] || null;
}

