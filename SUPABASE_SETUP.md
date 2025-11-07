# 🗄️ Supabase Setup Guide

## Шаг 1: Создание проекта

1. Перейдите на https://supabase.com
2. Создайте новый проект
3. Выберите регион (ближайший к вашим пользователям)
4. Дождитесь инициализации проекта (~2 минуты)

## Шаг 2: Создание таблиц

1. Откройте **SQL Editor** в боковом меню Supabase
2. Создайте новый query
3. Скопируйте содержимое файла `supabase-schema.sql`
4. Нажмите **Run** для выполнения
5. Проверьте, что таблицы созданы в **Table Editor**

Должны появиться таблицы:
- ✅ `orders`
- ✅ `order_items`
- ✅ `order_status_history`

## Шаг 3: Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
# Telegram Bot
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_GROUP_CHAT_ID=your_group_chat_id_here
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username_here
TELEGRAM_WEBHOOK_SECRET=your_random_secret_token_here

# Supabase
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# App URL (for production webhook)
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Где взять Supabase credentials:

1. Откройте **Project Settings** (иконка шестеренки)
2. Перейдите в **API**
3. Найдите:
   - **Project URL** → `SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_KEY` ⚠️ (держите в секрете!)

### Генерация TELEGRAM_WEBHOOK_SECRET:

```bash
# В терминале:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Шаг 4: Проверка RLS Policies

В Supabase Dashboard → **Authentication** → **Policies**

Убедитесь, что созданы политики:
- ✅ Allow public read/insert для `orders`
- ✅ Allow authenticated update для `orders`
- ✅ Allow public read/insert для `order_items`
- ✅ Allow public read для `order_status_history`

## Шаг 5: Тестирование подключения

Запустите проект:
```bash
npm run dev
```

Откройте консоль браузера. Ошибок подключения к Supabase быть не должно.

## Шаг 6: Настройка Realtime (опционально)

Для live-обновлений статусов заказов:

1. В Supabase → **Database** → **Replication**
2. Найдите таблицу `orders`
3. Включите **Realtime** для таблицы
4. Повторите для `order_status_history`

## Полезные запросы для тестирования

### Создать тестовый заказ:
```sql
INSERT INTO orders (
    order_number, phone, total_price, 
    payment_method, delivery_method, status
) VALUES (
    '1730123456', '+77771234567', 2500, 
    'cash', 'pickup', 'new'
) RETURNING *;
```

### Посмотреть все заказы:
```sql
SELECT * FROM orders ORDER BY created_at DESC;
```

### Посмотреть заказ с историей:
```sql
SELECT * FROM get_order_with_items('order-uuid-here');
```

### Обновить статус:
```sql
UPDATE orders 
SET status = 'accepted' 
WHERE order_number = '1730123456';
```

### Посмотреть историю изменений:
```sql
SELECT * FROM order_status_history 
ORDER BY changed_at DESC 
LIMIT 10;
```

## Troubleshooting

### ❌ "relation does not exist"
→ Запустите `supabase-schema.sql` еще раз

### ❌ "JWT expired"
→ Перегенерируйте API keys в Project Settings

### ❌ "permission denied"
→ Проверьте RLS policies

### ❌ "connection refused"
→ Проверьте SUPABASE_URL в .env.local

## Безопасность

⚠️ **ВАЖНО:**
- ✅ `.env.local` в `.gitignore`
- ✅ `SUPABASE_SERVICE_KEY` только на сервере (API routes)
- ✅ Никогда не выставляйте service_role key на клиенте
- ✅ Используйте RLS policies для защиты данных
- ✅ Проверяйте webhook secret в `/api/telegram/webhook`

## Production Checklist

- [ ] Supabase проект создан
- [ ] SQL схема выполнена
- [ ] RLS policies настроены
- [ ] Переменные окружения заполнены
- [ ] Realtime включен для нужных таблиц
- [ ] Тестовые запросы выполнены успешно
- [ ] Service role key защищен
- [ ] Backup настроен в Supabase

---

**Готово к работе!** 🚀

