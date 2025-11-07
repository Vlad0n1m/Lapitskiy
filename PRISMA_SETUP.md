# 🔷 Prisma + Supabase Setup Guide

## Обзор

Теперь проект использует **Prisma ORM** для работы с **Supabase PostgreSQL**.

### Преимущества:

✅ **Типобезопасность** - автогенерация TypeScript типов из схемы  
✅ **Удобный API** - интуитивные методы для работы с БД  
✅ **Миграции** - версионирование схемы базы данных  
✅ **Prisma Studio** - GUI для просмотра и редактирования данных  
✅ **Отличная производительность** - оптимизированные запросы

---

## Быстрый старт

### Шаг 1: Установите зависимости

```bash
npm install
```

### Шаг 2: Настройте DATABASE_URL

Создайте/обновите `.env.local`:

```env
# Supabase Connection String (для Prisma)
# Получите в: Supabase Dashboard → Settings → Database → Connection String → URI
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Direct Connection (для миграций)
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Supabase (для Realtime)
SUPABASE_URL=https://[YOUR-PROJECT-REF].supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Telegram
TELEGRAM_BOT_TOKEN=your_bot_token
TELEGRAM_GROUP_CHAT_ID=your_group_chat_id
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBHOOK_SECRET=your_random_secret

# App URL
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

### Как получить DATABASE_URL:

1. Откройте **Supabase Dashboard**
2. Settings → **Database**
3. Connection String → **URI**
4. Скопируйте и замените `[YOUR-PASSWORD]` на ваш пароль

**Пример:**
```
postgresql://postgres:your_password_here@db.abcdefghijklmn.supabase.co:5432/postgres
```

### Шаг 3: Примените схему к БД

```bash
# Push схему к Supabase (без миграций)
npm run prisma:push
```

**Или** создайте миграцию:

```bash
# Создать миграцию
npm run prisma:migrate

# Введите имя: "init" или "initial_schema"
```

### Шаг 4: Генерация Prisma Client

```bash
npm run prisma:generate
```

Prisma автоматически генерирует типизированный клиент.

### Шаг 5: Запустите приложение

```bash
npm run dev
```

---

## Prisma Schema

Файл: `prisma/schema.prisma`

### Модели:

**Order** - Заказы
```prisma
model Order {
  id                  String   @id @default(uuid())
  orderNumber         String   @unique
  telegramUserId      BigInt?
  telegramUsername    String?
  phone               String
  totalPrice          Int
  paymentMethod       PaymentMethod
  deliveryMethod      DeliveryMethod
  deliveryAddress     String?
  comment             String?
  status              OrderStatus @default(new)
  telegramMessageId   BigInt?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
  
  items               OrderItem[]
  statusHistory       OrderStatusHistory[]
}
```

**OrderItem** - Позиции заказа
```prisma
model OrderItem {
  id          String   @id @default(uuid())
  orderId     String
  productName String
  size        String
  sirop       String?
  quantity    Int
  price       Int
  createdAt   DateTime @default(now())
  
  order       Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

**OrderStatusHistory** - История изменений
```prisma
model OrderStatusHistory {
  id         String    @id @default(uuid())
  orderId    String
  oldStatus  String?
  newStatus  String
  changedBy  ChangedBy
  changedAt  DateTime  @default(now())
  comment    String?
  
  order      Order     @relation(fields: [orderId], references: [id], onDelete: Cascade)
}
```

---

## Prisma Commands

### Основные команды:

```bash
# Генерация Prisma Client
npm run prisma:generate

# Push схемы в БД (без миграций)
npm run prisma:push

# Создать миграцию
npm run prisma:migrate

# Prisma Studio (GUI для БД)
npm run prisma:studio

# Проверить схему
npx prisma validate

# Форматировать схему
npx prisma format
```

### Миграции:

```bash
# Создать миграцию в dev
npx prisma migrate dev --name add_new_field

# Применить миграции в production
npx prisma migrate deploy

# Сбросить БД (осторожно!)
npx prisma migrate reset
```

---

## Использование Prisma Client

### Импорт:

```typescript
import { prisma } from '@/lib/prisma'
```

### Примеры запросов:

#### Создание заказа с позициями:

```typescript
const order = await prisma.order.create({
  data: {
    orderNumber: '1730123456',
    phone: '+77771234567',
    totalPrice: 2500,
    paymentMethod: 'cash',
    deliveryMethod: 'pickup',
    status: 'new',
    items: {
      create: [
        {
          productName: 'Капучино',
          size: 'medium',
          quantity: 2,
          price: 1000
        }
      ]
    }
  },
  include: {
    items: true
  }
})
```

#### Получение заказа со всеми связями:

```typescript
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
})
```

#### Обновление статуса:

```typescript
const updatedOrder = await prisma.order.update({
  where: { id: orderId },
  data: { 
    status: 'accepted'
  }
})
```

#### Создание записи в истории:

```typescript
await prisma.orderStatusHistory.create({
  data: {
    orderId: orderId,
    oldStatus: 'new',
    newStatus: 'accepted',
    changedBy: 'staff',
    comment: 'Order accepted by barista'
  }
})
```

#### Получение всех заказов:

```typescript
const orders = await prisma.order.findMany({
  include: {
    items: true
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 50 // Лимит
})
```

#### Фильтрация по статусу:

```typescript
const pendingOrders = await prisma.order.findMany({
  where: {
    status: {
      in: ['new', 'accepted']
    }
  },
  include: {
    items: true
  }
})
```

#### Подсчет заказов:

```typescript
const orderCount = await prisma.order.count({
  where: {
    status: 'delivered',
    createdAt: {
      gte: new Date('2025-01-01')
    }
  }
})
```

---

## Prisma Studio

Откройте GUI для просмотра данных:

```bash
npm run prisma:studio
```

Откроется в браузере на `http://localhost:5555`

Вы сможете:
- ✅ Просматривать данные
- ✅ Редактировать записи
- ✅ Создавать новые записи
- ✅ Удалять записи
- ✅ Фильтровать и сортировать

---

## Типобезопасность

### Автогенерация типов:

Prisma автоматически генерирует TypeScript типы:

```typescript
import type { Order, OrderItem, OrderStatus } from '@prisma/client'

// Полная типизация!
function processOrder(order: Order) {
  console.log(order.orderNumber) // ✅ TypeScript знает все поля
  // order.invalidField // ❌ Ошибка компиляции
}
```

### Enum типы:

```typescript
import { OrderStatus, PaymentMethod, DeliveryMethod } from '@prisma/client'

const status: OrderStatus = 'accepted' // ✅ Типобезопасно
// const invalid: OrderStatus = 'invalid' // ❌ Ошибка компиляции
```

### Включение связей:

```typescript
import type { Order } from '@prisma/client'

// Order с items
type OrderWithItems = Order & {
  items: OrderItem[]
}

// Prisma Validator для сложных типов
import { Prisma } from '@prisma/client'

const orderWithRelations = Prisma.validator<Prisma.OrderDefaultArgs>()({
  include: { items: true, statusHistory: true }
})

type OrderWithRelations = Prisma.OrderGetPayload<typeof orderWithRelations>
```

---

## Connection Pooling

### Для Vercel / Serverless:

Prisma автоматически использует connection pooling.

Рекомендуемые настройки в `prisma/schema.prisma`:

```prisma
datasource db {
  provider  = "postgresql"
  url       = env("DATABASE_URL")
  directUrl = env("DIRECT_URL")
}
```

- `url` - для query запросов (pooling)
- `directUrl` - для миграций

### Supabase Pooler:

В production используйте Supabase Transaction Pooler:

```env
# Transaction mode pooler (для Prisma)
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:6543/postgres?pgbouncer=true"

# Direct connection (для миграций)
DIRECT_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"
```

---

## Миграции в Production

### Шаг 1: Создайте миграцию локально

```bash
npm run prisma:migrate
# Имя: "add_new_feature"
```

### Шаг 2: Commit миграций

```bash
git add prisma/migrations
git commit -m "Add new feature migration"
git push
```

### Шаг 3: Применение в production

**Vercel автоматически:**

Добавьте в `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "vercel-build": "prisma migrate deploy && next build"
  }
}
```

**Или вручную:**

```bash
npx prisma migrate deploy
```

---

## Troubleshooting

### ❌ "Can't reach database server"

**Причина:** Неверный DATABASE_URL

**Решение:**
1. Проверьте connection string в Supabase
2. Замените `[YOUR-PASSWORD]` на реальный пароль
3. Проверьте что БД запущена

### ❌ "Prisma Client not generated"

**Причина:** Не выполнен `prisma generate`

**Решение:**
```bash
npm run prisma:generate
```

### ❌ "Migration failed"

**Причина:** Конфликт схемы

**Решение:**
```bash
# Сбросить схему (осторожно!)
npx prisma migrate reset

# Или push без миграций
npm run prisma:push --accept-data-loss
```

### ❌ "Too many connections"

**Причина:** Connection limit достигнут

**Решение:**
1. Используйте Supabase Pooler (port 6543)
2. Добавьте `?pgbouncer=true` к DATABASE_URL
3. Увеличьте лимит в Supabase (платно)

### ❌ BigInt Serialization Error

**Причина:** BigInt не сериализуется в JSON

**Решение:**

```typescript
// Конвертируйте BigInt в Number перед отправкой
const order = await prisma.order.findUnique({...})

return NextResponse.json({
  ...order,
  telegramUserId: order.telegramUserId ? Number(order.telegramUserId) : null,
  telegramMessageId: order.telegramMessageId ? Number(order.telegramMessageId) : null
})
```

---

## Сравнение: SQL vs Prisma

### SQL (старый способ):

```sql
INSERT INTO orders (order_number, phone, total_price, payment_method, delivery_method, status)
VALUES ('1730123456', '+77771234567', 2500, 'cash', 'pickup', 'new')
RETURNING *;
```

### Prisma (новый способ):

```typescript
const order = await prisma.order.create({
  data: {
    orderNumber: '1730123456',
    phone: '+77771234567',
    totalPrice: 2500,
    paymentMethod: 'cash',
    deliveryMethod: 'pickup',
    status: 'new'
  }
})
```

**Преимущества Prisma:**
- ✅ Типобезопасность
- ✅ Автокомплит в IDE
- ✅ Защита от SQL injection
- ✅ Легче читать и поддерживать

---

## Полезные ссылки

- [Prisma Docs](https://www.prisma.io/docs)
- [Prisma + Supabase](https://www.prisma.io/docs/guides/database/supabase)
- [Prisma + Next.js](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Prisma Schema Reference](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference)
- [Prisma Client API](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)

---

## Checklist перед Production

- [ ] ✅ DATABASE_URL настроен с pooler (:6543)
- [ ] ✅ DIRECT_URL настроен для миграций (:5432)
- [ ] ✅ `prisma migrate deploy` в build script
- [ ] ✅ `postinstall: prisma generate` в package.json
- [ ] ✅ Все миграции закоммичены в git
- [ ] ✅ Протестированы все API endpoints
- [ ] ✅ Connection pooling настроен
- [ ] ✅ Error handling для Prisma errors

---

**Готово!** 🔷 Теперь у вас полная типобезопасность и удобная работа с БД!

