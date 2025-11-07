# 🔷 Проект теперь использует Prisma ORM!

## ✨ Что изменилось

Проект **успешно мигрирован** с прямого использования Supabase Admin Client на **Prisma ORM**.

### Главные преимущества:

✅ **Полная типобезопасность** - TypeScript типы генерируются автоматически  
✅ **Лучший Developer Experience** - автокомплит, рефакторинг, проверка на этапе компиляции  
✅ **Prisma Studio** - визуальный редактор БД  
✅ **Миграции** - версионирование схемы базы данных  

---

## 🚀 Быстрый старт (3 минуты)

### 1. Установите зависимости

```bash
npm install
```

### 2. Настройте подключение к Supabase

Создайте/обновите `.env.local`:

```env
# Получите в: Supabase Dashboard → Settings → Database → Connection String → URI
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:YOUR_PASSWORD@db.YOUR_PROJECT.supabase.co:5432/postgres"

# Остальные переменные
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_GROUP_CHAT_ID=your_group_chat_id
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBHOOK_SECRET=your_random_secret

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Важно:** Замените `YOUR_PASSWORD`, `YOUR_PROJECT` на реальные значения!

### 3. Примените схему к базе данных

```bash
# Применить Prisma схему к Supabase
npm run prisma:push
```

Эта команда создаст все необходимые таблицы в Supabase.

### 4. Запустите приложение

```bash
npm run dev
```

---

## 📊 Новые возможности

### Prisma Studio - GUI для БД

```bash
npm run prisma:studio
```

Откроется графический интерфейс для работы с данными:
- Просмотр всех таблиц
- Редактирование записей
- Создание тестовых данных
- Поиск и фильтрация

### Типобезопасные запросы

```typescript
import { prisma } from '@/lib/prisma'

// Автокомплит работает!
const order = await prisma.order.create({
  data: {
    orderNumber: '123',
    phone: '+7777...',
    totalPrice: 2500,
    paymentMethod: 'cash', // TypeScript знает допустимые значения!
    deliveryMethod: 'pickup',
    status: 'new',
    items: {
      create: [...] // Создается в одной транзакции
    }
  }
})
```

---

## 📁 Структура проекта

```
prisma/
  └── schema.prisma          # Схема БД с моделями

lib/
  ├── prisma.ts             # Prisma Client (новый)
  └── supabase.ts           # Только для Realtime (упрощен)

app/api/orders/
  ├── create/route.ts       # Переписан на Prisma ✅
  ├── [id]/route.ts         # Переписан на Prisma ✅
  └── [id]/status/route.ts  # Переписан на Prisma ✅

📚 Документация:
  ├── PRISMA_SETUP.md              # Детальная настройка
  ├── PRISMA_MIGRATION_COMPLETE.md # Что изменилось
  └── README_PRISMA.md             # Этот файл
```

---

## 🎯 Основные команды

```bash
# Генерация Prisma Client (после изменения schema)
npm run prisma:generate

# Применить схему к БД (без миграций)
npm run prisma:push

# Создать миграцию
npm run prisma:migrate

# Открыть Prisma Studio
npm run prisma:studio

# Запустить приложение
npm run dev
```

---

## 📖 Документация

### Для быстрого старта:
👉 **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Полная инструкция по настройке

### Для понимания изменений:
👉 **[PRISMA_MIGRATION_COMPLETE.md](./PRISMA_MIGRATION_COMPLETE.md)** - Что было изменено

### Для работы с Telegram:
👉 **[TELEGRAM_ORDER_MANAGEMENT.md](./TELEGRAM_ORDER_MANAGEMENT.md)** - Telegram интеграция

---

## ⚠️ Важные изменения для разработчиков

### Было (Supabase Admin):

```typescript
import { supabaseAdmin } from '@/lib/supabase'

const { data, error } = await supabaseAdmin
  .from('orders')
  .select('*')
  .eq('id', orderId)
  .single()
```

### Стало (Prisma):

```typescript
import { prisma } from '@/lib/prisma'

const order = await prisma.order.findUnique({
  where: { id: orderId },
  include: {
    items: true,
    statusHistory: true
  }
})
```

**Преимущества:**
- ✅ Полная типобезопасность
- ✅ Автокомплит в IDE
- ✅ Меньше кода
- ✅ Автоматические транзакции
- ✅ Лучшая производительность

---

## 🔥 Realtime subscriptions

Supabase Realtime **по-прежнему работает**!

```typescript
import { supabase } from '@/lib/supabase'

// Realtime subscriptions используют supabase client
const channel = supabase
  .channel('orders_realtime')
  .on('postgres_changes', {
    event: 'UPDATE',
    schema: 'public',
    table: 'orders'
  }, (payload) => {
    console.log('Order updated:', payload)
  })
  .subscribe()
```

---

## 🐛 Troubleshooting

### ❌ "Can't reach database server"

**Проблема:** Неверный DATABASE_URL

**Решение:**
1. Откройте Supabase Dashboard
2. Settings → Database → Connection String
3. Скопируйте **URI** connection string
4. Замените `[YOUR-PASSWORD]` на ваш реальный пароль из Supabase

### ❌ "Prisma Client not generated"

**Решение:**
```bash
npm run prisma:generate
```

### ❌ Таблицы не создаются

**Решение:**
```bash
# Примените схему к БД
npm run prisma:push
```

---

## 📦 Что делать дальше?

1. ✅ Настройте `.env.local` с вашими credentials
2. ✅ Выполните `npm run prisma:push`
3. ✅ Запустите `npm run dev`
4. ✅ Создайте тестовый заказ через приложение
5. ✅ Откройте `npm run prisma:studio` чтобы увидеть данные
6. ✅ Настройте Telegram webhook (см. TELEGRAM_ORDER_MANAGEMENT.md)

---

## 🎓 Полезные ссылки

- [Prisma Documentation](https://www.prisma.io/docs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

## 💬 Остались вопросы?

Читайте подробную документацию:
- **[PRISMA_SETUP.md](./PRISMA_SETUP.md)** - Полное руководство
- **[TELEGRAM_ORDER_MANAGEMENT.md](./TELEGRAM_ORDER_MANAGEMENT.md)** - Telegram интеграция
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Деплой на production

---

**Успехов с Prisma!** 🔷✨

_Version: 1.0.0 | Date: October 29, 2025_

