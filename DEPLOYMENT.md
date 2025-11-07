# 🚀 Deployment Guide - Telegram Order Management

## Быстрый Deploy на Vercel

### Шаг 1: Подготовка

```bash
# Убедитесь что все зависимости установлены
npm install

# Проверьте что проект собирается
npm run build
```

### Шаг 2: Deploy на Vercel

```bash
# Установите Vercel CLI (если еще не установлен)
npm i -g vercel

# Deploy
vercel

# Следуйте инструкциям:
# - Setup and deploy? Yes
# - Which scope? Выберите ваш аккаунт
# - Link to existing project? No
# - Project name? lapitskiy (или ваше название)
# - Directory? ./
# - Override settings? No
```

### Шаг 3: Настройка Environment Variables

В Vercel Dashboard → Settings → Environment Variables добавьте:

```env
TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
TELEGRAM_GROUP_CHAT_ID=-1001234567890
NEXT_PUBLIC_TELEGRAM_BOT_USERNAME=your_bot_username
TELEGRAM_WEBHOOK_SECRET=your_random_secret_token

SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

**Важно:** Добавьте переменные для всех environments:
- ✅ Production
- ✅ Preview
- ✅ Development

### Шаг 4: Redeploy

```bash
# После добавления переменных
vercel --prod
```

### Шаг 5: Настройка Webhook

```bash
# Получите production URL из Vercel Dashboard
# Например: https://lapitskiy.vercel.app

# В вашем локальном проекте с заполненными env переменными
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app npm run webhook:set

# Проверьте webhook
npm run webhook:info
```

---

## Подробная настройка Production

### Supabase Production

1. **Project Settings:**
   - Убедитесь что проект в Production tier (если нужна высокая нагрузка)
   - Настройте Custom Domain (опционально)

2. **Database:**
   - Выполните `supabase-schema.sql` если еще не выполнили
   - Включите Realtime для таблицы `orders`
   - Проверьте RLS policies

3. **Backups:**
   - Настройте автоматические backups (Project Settings → Database → Backups)
   - Рекомендуемая частота: ежедневно

4. **Monitoring:**
   - Настройте alerts для Database (Settings → Alerts)
   - Мониторьте API usage (Settings → Billing)

### Telegram Bot Production

1. **Bot Settings:**
   - Добавьте описание бота через @BotFather: `/setdescription`
   - Добавьте команды: `/setcommands`
     ```
     start - Начать работу с ботом
     help - Помощь
     ```

2. **Group Settings:**
   - Создайте production группу для сотрудников
   - Добавьте бота как администратора
   - Получите новый Chat ID для production

3. **Webhook:**
   - Используйте HTTPS (Telegram требует)
   - Используйте webhook secret для безопасности
   - Проверяйте webhook регулярно: `npm run webhook:info`

### Vercel Configuration

1. **Custom Domain (опционально):**
   - Settings → Domains → Add Domain
   - Следуйте инструкциям для DNS

2. **Performance:**
   - Используйте Edge Functions для API routes (опционально)
   - Настройте Caching для статических ресурсов

3. **Monitoring:**
   - Включите Analytics (Settings → Analytics)
   - Настройте Log Drains для мониторинга ошибок

---

## Environment Variables Checklist

### Required (Обязательные)

- [ ] `TELEGRAM_BOT_TOKEN` - токен от @BotFather
- [ ] `TELEGRAM_GROUP_CHAT_ID` - ID группы сотрудников
- [ ] `SUPABASE_URL` - URL вашего Supabase проекта
- [ ] `SUPABASE_SERVICE_KEY` - Service role key (секретный!)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon public key
- [ ] `NEXT_PUBLIC_APP_URL` - URL вашего приложения на Vercel

### Optional (Опциональные)

- [ ] `TELEGRAM_WEBHOOK_SECRET` - для безопасности webhook
- [ ] `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` - для deep links

---

## Testing Production

### 1. Smoke Test

```bash
# Проверьте что приложение доступно
curl https://your-app.vercel.app

# Проверьте webhook
curl https://your-app.vercel.app/api/telegram/webhook

# Должно вернуть:
{
  "status": "Telegram webhook endpoint is running",
  "timestamp": "..."
}
```

### 2. Create Test Order

Откройте приложение и создайте тестовый заказ:
1. Добавьте кофе в корзину
2. Оформите заказ
3. Проверьте Telegram группу - должно прийти сообщение
4. Нажмите кнопку "Принять"
5. Проверьте что статус обновился в приложении

### 3. Check Logs

**Vercel:**
```bash
vercel logs
```

**Supabase:**
- Dashboard → Logs → API
- Проверьте нет ли ошибок в запросах

**Telegram:**
```bash
npm run webhook:info
```
Должно показать "No errors"

---

## Monitoring & Maintenance

### Daily Checks

- [ ] Проверьте webhook status: `npm run webhook:info`
- [ ] Проверьте Supabase API usage (не превышен ли лимит)
- [ ] Проверьте Vercel функции (нет ли ошибок)

### Weekly Checks

- [ ] Проверьте Supabase Database size
- [ ] Проверьте логи ошибок в Vercel
- [ ] Проверьте что Realtime работает
- [ ] Проверьте количество заказов в БД

### Monthly Checks

- [ ] Backup базы данных вручную
- [ ] Проверьте security updates для зависимостей: `npm audit`
- [ ] Обновите зависимости: `npm update`
- [ ] Проверьте billing в Supabase и Vercel

---

## Rollback Plan

Если что-то пошло не так на production:

### Быстрый откат

```bash
# Откатитесь на предыдущий деплой в Vercel Dashboard
# Deployments → выберите стабильную версию → Promote to Production
```

### Отключение webhook

```bash
# Временно отключите webhook если есть проблемы
npm run webhook:delete

# Заказы продолжат сохраняться, но не будут отправляться в Telegram
```

### Восстановление из backup

```bash
# В Supabase Dashboard
# Settings → Database → Backups → Restore
```

---

## Security Checklist

- [ ] ✅ `.env.local` в `.gitignore`
- [ ] ✅ `SUPABASE_SERVICE_KEY` только в серверных API routes
- [ ] ✅ RLS policies настроены в Supabase
- [ ] ✅ Webhook secret используется для проверки запросов
- [ ] ✅ Все чувствительные данные в environment variables
- [ ] ✅ HTTPS используется для всех запросов
- [ ] ✅ Telegram bot token нигде не выводится в логи
- [ ] ✅ API endpoints защищены от spam (rate limiting - опционально)

---

## Performance Optimization

### Database

```sql
-- Проверьте что индексы созданы
SELECT * FROM pg_indexes WHERE tablename = 'orders';

-- Очистите старые заказы (опционально, раз в год)
DELETE FROM orders WHERE created_at < NOW() - INTERVAL '1 year';
```

### API Routes

- Используйте кэширование для часто запрашиваемых данных
- Ограничьте количество заказов в истории (pagination)
- Используйте connection pooling в Supabase

### Frontend

- Lazy load OrderHistory компонент
- Debounce Realtime updates
- Используйте виртуализацию для длинных списков заказов

---

## Troubleshooting Production

### Webhook перестал работать

```bash
# Проверьте статус
npm run webhook:info

# Переустановите
npm run webhook:delete
npm run webhook:set https://your-app.vercel.app
```

### Высокая нагрузка на Supabase

- Проверьте query logs
- Добавьте индексы для медленных запросов
- Рассмотрите caching слой (Redis)

### Ошибки в Realtime

- Проверьте что Realtime включен в Supabase
- Проверьте лимиты подключений
- Отключите Realtime в старых сессиях

---

## Cost Estimation

### Supabase (Free tier)

- ✅ 500MB Database
- ✅ 5GB Bandwidth
- ✅ 2GB File storage
- ✅ 50,000 monthly active users

**Достаточно для:** ~10,000 заказов/месяц

### Vercel (Hobby tier)

- ✅ 100GB Bandwidth
- ✅ 100GB-hours Serverless Functions
- ✅ Unlimited deployments

**Достаточно для:** ~50,000 запросов/месяц

### Telegram Bot API

- ✅ Бесплатно
- ✅ Лимит: 30 сообщений/секунду

---

## Next Steps

После успешного deployment:

1. **Настройте мониторинг:**
   - Sentry / Datadog для error tracking
   - Uptime monitoring (UptimeRobot)

2. **Добавьте аналитику:**
   - Количество заказов
   - Среднее время обработки
   - Популярные товары

3. **Расширьте функциональность:**
   - Rating system (оценки заказов)
   - Push notifications для клиентов
   - Admin dashboard для статистики

4. **Обучите команду:**
   - Проведите training для сотрудников
   - Создайте внутреннюю документацию
   - Настройте процессы для edge cases

---

## Support

Если возникли проблемы:

1. Проверьте [TELEGRAM_ORDER_MANAGEMENT.md](./TELEGRAM_ORDER_MANAGEMENT.md) → Troubleshooting
2. Проверьте логи в Vercel и Supabase
3. Проверьте webhook status: `npm run webhook:info`
4. Проверьте что все env переменные заданы

---

**Удачного запуска!** 🚀

_Version: 1.0.0 | Date: October 29, 2025_

