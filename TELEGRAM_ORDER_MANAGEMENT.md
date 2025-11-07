# 🤖 Telegram Order Management System - Полное руководство

## 📋 Содержание

1. [Обзор системы](#обзор-системы)
2. [Быстрый старт](#быстрый-старт)
3. [Детальная настройка](#детальная-настройка)
4. [Тестирование](#тестирование)
5. [Troubleshooting](#troubleshooting)
6. [API Reference](#api-reference)

---

## Обзор системы

### Что реализовано

✅ **Полный цикл управления заказами:**
- Создание заказов через Mini App
- Автоматическая отправка в Telegram группу сотрудников
- Inline-кнопки для управления статусами
- Автоматические уведомления клиентам
- История изменений статусов
- Realtime обновления в интерфейсе

✅ **Технологии:**
- Next.js API Routes
- Supabase PostgreSQL
- Telegram Bot API
- Zustand + Realtime subscriptions

### Бизнес-процесс

```
Клиент оформляет заказ в Mini App
          ↓
Заказ сохраняется в Supabase
          ↓
Уведомление в Telegram группу с кнопками
          ↓
Бариста нажимает кнопки: Принять → В работе → Готов → Выдан
          ↓
Клиент получает уведомления при каждом изменении статуса
```

---

## Быстрый старт

### Шаг 1: Установите зависимости

```bash
npm install
```

### Шаг 2: Настройте Supabase

1. Создайте проект на https://supabase.com
2. Откройте SQL Editor
3. Выполните скрипт `supabase-schema.sql`
4. Включите Realtime для таблицы `orders` (Database → Replication)

Подробнее: [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)

### Шаг 3: Настройте Telegram бота

1. Создайте бота через [@BotFather](https://t.me/BotFather)
2. Создайте группу и добавьте бота как админа
3. Получите Chat ID через [@userinfobot](https://t.me/userinfobot)

### Шаг 4: Переменные окружения

Создайте файл `.env.local`:

```env
# Telegram
TELEGRAM_BOT_TOKEN=123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
TELEGRAM_GROUP_CHAT_ID=-1001234567890
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBHOOK_SECRET=your_random_secret_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key

# App URL (для production)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Шаг 5: Запустите приложение

```bash
npm run dev
```

### Шаг 6: Настройте webhook

**Development (с ngrok):**
```bash
# Терминал 1
ngrok http 3000

# Терминал 2
npm run webhook:set https://your-url.ngrok.io
```

**Production (Vercel):**
```bash
npm run webhook:set https://your-app.vercel.app
```

### Шаг 7: Проверка

```bash
npm run webhook:info
```

Должно показать URL webhook и "No errors" ✅

---

## Детальная настройка

### 1. Supabase Configuration

#### Создание таблиц

Файл `supabase-schema.sql` содержит:
- ✅ Таблицы: `orders`, `order_items`, `order_status_history`
- ✅ Индексы для быстрых запросов
- ✅ Triggers для автоматического логирования
- ✅ RLS Policies для безопасности
- ✅ Helper functions

#### RLS (Row Level Security)

Политики уже настроены в SQL скрипте:
- Public read/insert для `orders` и `order_items`
- Authenticated update для изменения статусов
- Public read для истории статусов

#### Realtime

Включите в Supabase Dashboard:
1. Database → Replication
2. Найдите таблицу `orders`
3. Enable → Save

### 2. Telegram Bot Setup

#### Создание бота

```
/newbot → @BotFather
Название: Lapitskiy Orders
Username: lapitskiy_orders_bot
```

Сохраните токен из ответа.

#### Настройка группы

1. Создайте группу в Telegram
2. Добавьте вашего бота
3. Сделайте его админом (права на отправку сообщений)
4. Добавьте @userinfobot
5. Скопируйте Chat ID (начинается с `-100`)
6. Удалите @userinfobot

#### Webhook Secret

Сгенерируйте случайную строку:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3. API Endpoints

Система предоставляет следующие endpoints:

#### POST `/api/orders/create`
Создает новый заказ

**Request:**
```json
{
  "phone": "+77771234567",
  "totalPrice": 2500,
  "paymentMethod": "cash",
  "deliveryMethod": "pickup",
  "deliveryAddress": "optional",
  "comment": "optional",
  "products": [
    {
      "name": "Капучино",
      "size": "medium",
      "sirop": "vanilla",
      "qty": 2,
      "final_price": 1000
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "order_number": "1730123456",
    "status": "new",
    "telegram_message_sent": true
  }
}
```

#### GET `/api/orders/[id]`
Получает заказ с историей

**Response:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "order_number": "1730123456",
    "status": "accepted",
    "order_items": [...],
    "history": [...]
  }
}
```

#### PUT `/api/orders/[id]/status`
Обновляет статус заказа

**Request:**
```json
{
  "status": "accepted",
  "changed_by": "staff",
  "comment": "Optional comment"
}
```

#### POST `/api/telegram/webhook`
Обрабатывает webhook от Telegram

Автоматически вызывается Telegram при нажатии на кнопки.

### 4. Frontend Integration

#### Создание заказа

```typescript
import { useCart } from '@/app/context'

const { addOrder } = useCart()

await addOrder({
  phone: '+77771234567',
  paymentMethod: 'cash',
  deliveryMethod: 'pickup',
  comment: 'Без сахара'
})
```

#### История заказов с Realtime

```typescript
import OrderHistory from '@/components/OrderHistory'

<OrderHistory 
  orders={orders} 
  isOpen={isOpen} 
  onClose={onClose} 
/>
```

Компонент автоматически:
- Загружает заказы из Supabase
- Подписывается на Realtime обновления
- Обновляет статусы в реальном времени

#### Отслеживание заказа

```typescript
import OrderTracking from '@/components/OrderTracking'

<OrderTracking 
  orderId="uuid"
  currentStatus="in_progress"
  deliveryMethod="pickup"
  statusHistory={history}
/>
```

---

## Тестирование

### 1. Тест создания заказа

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+77771234567",
    "totalPrice": 2500,
    "paymentMethod": "cash",
    "deliveryMethod": "pickup",
    "products": [
      {
        "name": "Капучино",
        "size": "medium",
        "sirop": "vanilla",
        "qty": 2,
        "final_price": 1000
      }
    ]
  }'
```

**Ожидаемый результат:**
- ✅ HTTP 201 Created
- ✅ Сообщение в Telegram группе с кнопками
- ✅ Заказ в Supabase

### 2. Тест обновления статуса через кнопки

1. Откройте Telegram группу
2. Найдите сообщение с заказом
3. Нажмите "✅ Принять"

**Ожидаемый результат:**
- ✅ Кнопки обновились
- ✅ Статус в сообщении изменился
- ✅ Запись в `order_status_history`

### 3. Тест Realtime обновлений

1. Откройте приложение в двух вкладках
2. В первой вкладке откройте историю заказов
3. Во второй вкладке измените статус через Telegram
4. Проверьте первую вкладку

**Ожидаемый результат:**
- ✅ Статус обновился автоматически без перезагрузки

### 4. Полный цикл заказа

```
1. Создать заказ в Mini App
2. Проверить сообщение в Telegram
3. Нажать "✅ Принять" → статус: accepted
4. Нажать "⏳ В работе" → статус: in_progress
5. Нажать "☕ Готов" → статус: ready
6. Нажать "✅ Выдан" → статус: picked_up
7. Проверить финальное состояние в истории заказов
```

---

## Troubleshooting

### ❌ "Telegram configuration missing"

**Причина:** Не заданы env переменные

**Решение:**
```bash
# Проверьте .env.local
cat .env.local | grep TELEGRAM

# Перезапустите сервер
npm run dev
```

### ❌ "Failed to create order in Supabase"

**Причина:** Неверные Supabase credentials или не выполнен SQL скрипт

**Решение:**
1. Проверьте SUPABASE_URL и SUPABASE_SERVICE_KEY
2. Выполните `supabase-schema.sql` в SQL Editor
3. Проверьте RLS policies (должны разрешать insert)

### ❌ Webhook не работает

**Причина:** Неверный URL или не зарегистрирован webhook

**Решение:**
```bash
# Проверьте текущий webhook
npm run webhook:info

# Переустановите webhook
npm run webhook:delete
npm run webhook:set https://your-url.com

# Проверьте снова
npm run webhook:info
```

### ❌ "Chat not found"

**Причина:** Неверный Chat ID или бот не админ

**Решение:**
1. Chat ID должен начинаться с `-100`
2. Бот должен быть админом группы
3. Проверьте через @userinfobot

### ❌ Realtime не работает

**Причина:** Не включен Realtime в Supabase

**Решение:**
1. Supabase Dashboard → Database → Replication
2. Включите для таблицы `orders`
3. Save
4. Перезагрузите страницу

### ❌ Кнопки не обновляются

**Причина:** Не сохранен telegram_message_id

**Решение:**
Проверьте в Supabase:
```sql
SELECT telegram_message_id FROM orders 
WHERE order_number = 'YOUR_ORDER_NUMBER';
```

Должен быть числовой ID. Если NULL - пересоздайте заказ.

---

## API Reference

### Status Flow

#### Самовывоз (pickup):
```
new → accepted → in_progress → ready → picked_up
       ↓
   cancelled
```

#### Доставка (delivery):
```
new → accepted → in_progress → ready → on_the_way → delivered
       ↓
   cancelled
```

### Callback Data Format

Inline-кнопки используют формат:
```
order:{orderId}:{action}
```

**Возможные actions:**
- `accept` → status: `accepted`
- `progress` → status: `in_progress`
- `ready` → status: `ready`
- `on_the_way` → status: `on_the_way`
- `delivered` → status: `delivered`
- `picked_up` → status: `picked_up`
- `cancel` → status: `cancelled`

### Database Schema

**orders:**
- id (uuid, PK)
- order_number (text, unique)
- telegram_user_id (bigint, nullable)
- phone (text)
- total_price (integer)
- payment_method (cash/card/kaspi)
- delivery_method (pickup/delivery)
- delivery_address (text, nullable)
- status (OrderStatus)
- telegram_message_id (bigint, nullable)
- created_at, updated_at (timestamp)

**order_items:**
- id (uuid, PK)
- order_id (uuid, FK)
- product_name (text)
- size (text)
- sirop (text, nullable)
- quantity (integer)
- price (integer)

**order_status_history:**
- id (uuid, PK)
- order_id (uuid, FK)
- old_status (text)
- new_status (text)
- changed_by (staff/system/customer)
- changed_at (timestamp)
- comment (text, nullable)

---

## Production Checklist

Перед деплоем на production:

- [ ] ✅ Supabase проект создан и настроен
- [ ] ✅ SQL схема выполнена без ошибок
- [ ] ✅ Realtime включен для таблицы orders
- [ ] ✅ RLS policies проверены
- [ ] ✅ Telegram бот создан
- [ ] ✅ Бот добавлен в группу как админ
- [ ] ✅ Chat ID получен и проверен
- [ ] ✅ Webhook secret сгенерирован
- [ ] ✅ Все env переменные заданы в Vercel
- [ ] ✅ Webhook зарегистрирован на production URL
- [ ] ✅ Проверено создание тестового заказа
- [ ] ✅ Проверена работа кнопок
- [ ] ✅ Проверены Realtime обновления
- [ ] ✅ Проверен полный цикл заказа
- [ ] ✅ Backup настроен в Supabase

---

## Архитектура

```
┌─────────────────────┐
│   Mini App          │
│   (Browser/TG)      │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────────────┐
│   Next.js API Routes        │
│   /api/orders/create        │
│   /api/orders/[id]/status   │
│   /api/telegram/webhook     │
└──────┬─────────────┬────────┘
       │             │
       ▼             ▼
┌──────────┐   ┌────────────┐
│ Supabase │   │  Telegram  │
│   DB     │   │  Bot API   │
└────┬─────┘   └─────┬──────┘
     │               │
     │ Realtime      │ Webhook
     ▼               ▼
┌──────────────────────────┐
│   Client Components      │
│   OrderHistory           │
│   OrderTracking          │
└──────────────────────────┘
```

---

## Поддержка

### Документация

- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Детальная настройка Supabase
- [supabase-schema.sql](./supabase-schema.sql) - SQL схема
- [START_HERE.md](./START_HERE.md) - Быстрый старт базовой Telegram интеграции

### Логи

**Server (Terminal):**
```bash
npm run dev
# Смотрите логи API requests
```

**Client (Browser Console):**
- Realtime subscriptions
- Order updates
- API responses

**Supabase (Dashboard):**
- Logs → API
- Database → Query logs

**Telegram:**
- Webhook updates через `npm run webhook:info`

---

## Версия

**1.0.0** - October 29, 2025

**Автор:** AI Assistant  
**Стек:** Next.js 16, Supabase, Telegram Bot API

---

**Готово к использованию!** 🚀☕

