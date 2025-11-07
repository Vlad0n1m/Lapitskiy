# 🧪 Quick Test Guide

## Быстрое тестирование системы

### Предварительные требования

```bash
# 1. Установлены зависимости
npm install

# 2. Настроены env переменные в .env.local
# - TELEGRAM_BOT_TOKEN
# - TELEGRAM_GROUP_CHAT_ID
# - SUPABASE_URL
# - SUPABASE_SERVICE_KEY
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 3. Выполнен SQL скрипт в Supabase
# supabase-schema.sql

# 4. Запущен dev server
npm run dev
```

---

## Тест 1: Создание заказа через API

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d @test-order.json
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "order": {
    "id": "uuid-here",
    "order_number": "1730123456",
    "status": "new",
    "telegram_message_sent": true
  }
}
```

**Проверьте:**
- ✅ HTTP 201 Created
- ✅ Сообщение появилось в Telegram группе
- ✅ Сообщение содержит кнопки
- ✅ Заказ есть в Supabase (Table Editor → orders)

---

## Тест 2: Получение заказа

```bash
# Замените ORDER_ID на id из предыдущего теста
curl http://localhost:3000/api/orders/ORDER_ID
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "order": {
    "id": "uuid",
    "order_number": "1730123456",
    "status": "new",
    "order_items": [...]
  }
}
```

---

## Тест 3: Обновление статуса

```bash
# Замените ORDER_ID на id из теста 1
curl -X PUT http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "accepted",
    "changed_by": "staff",
    "comment": "Тест обновления статуса"
  }'
```

**Ожидаемый результат:**
```json
{
  "success": true,
  "message": "Order status updated successfully",
  "order": {
    "id": "uuid",
    "old_status": "new",
    "new_status": "accepted"
  }
}
```

**Проверьте:**
- ✅ Кнопки в Telegram обновились
- ✅ Статус в сообщении изменился на "🔵 Принят"
- ✅ История в Supabase (Table Editor → order_status_history)

---

## Тест 4: Webhook (через Telegram кнопки)

**Требования:**
- Webhook должен быть настроен: `npm run webhook:info`

**Шаги:**
1. Откройте Telegram группу
2. Найдите сообщение с тестовым заказом
3. Нажмите кнопку "⏳ В работе"

**Ожидаемый результат:**
- ✅ Кнопки обновились (показывает "☕ Готов")
- ✅ Статус в сообщении: "🟠 Готовится"
- ✅ Уведомление "⏳ Заказ в работе" появилось

---

## Тест 5: Полный цикл заказа

### Через Telegram кнопки:

1. **Создайте заказ** (Тест 1)
2. **Принять:** Нажмите "✅ Принять"
   - Статус: accepted
   - Кнопки: [⏳ В работе] [🚫 Отклонить]
3. **В работе:** Нажмите "⏳ В работе"
   - Статус: in_progress
   - Кнопки: [☕ Готов]
4. **Готов:** Нажмите "☕ Готов"
   - Статус: ready
   - Кнопки: [✅ Выдан] (для pickup)
5. **Выдан:** Нажмите "✅ Выдан"
   - Статус: picked_up
   - Кнопки: нет (финальный статус)

**Проверьте в Supabase:**
```sql
-- История статусов
SELECT * FROM order_status_history 
WHERE order_id = 'YOUR_ORDER_ID' 
ORDER BY changed_at DESC;

-- Должно быть 5 записей:
-- new → accepted → in_progress → ready → picked_up
```

---

## Тест 6: Realtime обновления в UI

**Требования:**
- Realtime включен в Supabase (Database → Replication → orders)

**Шаги:**
1. Откройте приложение в браузере: http://localhost:3000
2. Откройте "История заказов"
3. В другой вкладке/окне откройте Telegram
4. Измените статус через кнопки

**Ожидаемый результат:**
- ✅ Статус обновился автоматически в браузере
- ✅ Без перезагрузки страницы
- ✅ Анимация перехода

---

## Тест 7: OrderTracking компонент

**В приложении:**
1. Создайте заказ через UI
2. Откройте историю заказов
3. Кликните на заказ для деталей

**Ожидаемый результат:**
- ✅ Показывается timeline с шагами
- ✅ Текущий статус выделен
- ✅ Завершенные шаги отмечены галочкой
- ✅ Примерное время готовности показано

---

## Тест 8: Отмена заказа

```bash
curl -X PUT http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status": "cancelled",
    "changed_by": "staff",
    "comment": "Тест отмены заказа"
  }'
```

**Ожидаемый результат:**
- ✅ Статус: cancelled
- ✅ Кнопки исчезли в Telegram
- ✅ Сообщение показывает "🔴 Отменен"

---

## Тест 9: Ошибки и Edge Cases

### 9.1 Создание заказа без телефона

```bash
curl -X POST http://localhost:3000/api/orders/create \
  -H "Content-Type: application/json" \
  -d '{
    "totalPrice": 1000,
    "paymentMethod": "cash",
    "deliveryMethod": "pickup",
    "products": []
  }'
```

**Ожидаемый результат:**
```json
{
  "error": "Missing required fields"
}
```
Status: 400

### 9.2 Обновление несуществующего заказа

```bash
curl -X PUT http://localhost:3000/api/orders/invalid-uuid/status \
  -H "Content-Type: application/json" \
  -d '{"status": "accepted"}'
```

**Ожидаемый результат:**
```json
{
  "error": "Order not found"
}
```
Status: 404

### 9.3 Невалидный статус

```bash
curl -X PUT http://localhost:3000/api/orders/ORDER_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status": "invalid_status"}'
```

**Ожидаемый результат:**
```json
{
  "error": "Invalid status"
}
```
Status: 400

---

## Тест 10: Webhook Management

### Проверка текущего webhook

```bash
npm run webhook:info
```

**Ожидаемый результат:**
```
📊 Current webhook info:

URL: https://your-url.com/api/telegram/webhook
Has custom certificate: false
Pending update count: 0
Max connections: Default (40)

✅ No errors
```

### Удаление webhook

```bash
npm run webhook:delete
```

**Ожидаемый результат:**
```
🗑️ Deleting webhook...
✅ Webhook deleted successfully!
```

### Установка webhook

```bash
# Development с ngrok
npm run webhook:set https://abc123.ngrok.io

# Production
npm run webhook:set https://your-app.vercel.app
```

**Ожидаемый результат:**
```
🔧 Setting webhook to: https://...
✅ Webhook set successfully!

📊 Current webhook info:
URL: https://...
✅ No errors
```

---

## Performance Tests

### Нагрузочный тест (создание 10 заказов)

```bash
# Создайте скрипт test-load.sh
for i in {1..10}; do
  curl -X POST http://localhost:3000/api/orders/create \
    -H "Content-Type: application/json" \
    -d @test-order.json &
done
wait

echo "✅ 10 заказов созданы"
```

**Проверьте:**
- ✅ Все 10 сообщений в Telegram
- ✅ Все 10 заказов в Supabase
- ✅ Нет ошибок в консоли

---

## Checklist полного теста

### Базовые функции:
- [ ] ✅ Создание заказа через API
- [ ] ✅ Получение заказа через API
- [ ] ✅ Обновление статуса через API
- [ ] ✅ Webhook обработка callback_query
- [ ] ✅ Telegram сообщения отправляются
- [ ] ✅ Inline-кнопки работают

### UI функции:
- [ ] ✅ Создание заказа через форму
- [ ] ✅ История заказов загружается
- [ ] ✅ Realtime обновления работают
- [ ] ✅ OrderTracking компонент
- [ ] ✅ Детали заказа показываются

### Edge cases:
- [ ] ✅ Валидация required полей
- [ ] ✅ 404 для несуществующих заказов
- [ ] ✅ Невалидные статусы отклоняются
- [ ] ✅ Отмена заказа работает

### Infrastructure:
- [ ] ✅ Webhook регистрируется
- [ ] ✅ Webhook удаляется
- [ ] ✅ Webhook info показывается
- [ ] ✅ Supabase подключение работает
- [ ] ✅ Telegram Bot API доступен

---

## Troubleshooting

### Если тест не проходит:

1. **"Connection refused" / "ECONNREFUSED"**
   - Проверьте что `npm run dev` запущен
   - Проверьте порт: http://localhost:3000

2. **"Telegram configuration missing"**
   - Проверьте .env.local
   - Перезапустите `npm run dev`

3. **"Failed to create order in Supabase"**
   - Проверьте SUPABASE_URL и SUPABASE_SERVICE_KEY
   - Выполните supabase-schema.sql

4. **Webhook не работает**
   - Проверьте `npm run webhook:info`
   - Для dev используйте ngrok
   - Проверьте TELEGRAM_WEBHOOK_SECRET

5. **Realtime не работает**
   - Включите Realtime в Supabase Dashboard
   - Database → Replication → orders → Enable

---

## Автоматизированные тесты

Для создания автоматизированных тестов (будущее):

```typescript
// __tests__/api/orders.test.ts
import { POST } from '@/app/api/orders/create/route'

describe('Orders API', () => {
  test('creates order successfully', async () => {
    const request = new Request('http://localhost:3000/api/orders/create', {
      method: 'POST',
      body: JSON.stringify({
        phone: '+77771234567',
        totalPrice: 1000,
        paymentMethod: 'cash',
        deliveryMethod: 'pickup',
        products: [...]
      })
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.order).toHaveProperty('id')
  })
})
```

---

**Успешного тестирования!** 🧪✅

