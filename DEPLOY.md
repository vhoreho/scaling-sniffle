# Инструкция по деплою на Render

Это руководство поможет вам развернуть full-stack CRUD приложение на Render.

## Предварительные требования

1. Аккаунт на [Render.com](https://render.com)
2. Git репозиторий с вашим кодом (GitHub, GitLab, или Bitbucket)

## Способ 1: Автоматический деплой через Render Blueprint

### Шаги:

1. **Подготовьте репозиторий:**
   - Убедитесь, что все изменения закоммичены и запушены в ваш Git репозиторий
   - Файл `render.yaml` уже создан в корне проекта

2. **Создайте новый Blueprint на Render:**
   - Зайдите на [Render Dashboard](https://dashboard.render.com)
   - Нажмите "New +" → "Blueprint"
   - Подключите ваш Git репозиторий
   - Render автоматически обнаружит `render.yaml` и создаст все необходимые сервисы

3. **Настройте переменные окружения:**
   После создания сервисов, настройте следующие переменные:
   
   **Для Backend сервиса (`crud-app-backend`):**
   - `FRONTEND_URL` - URL вашего frontend сервиса (например: `https://crud-app-frontend.onrender.com`)
   - `JWT_SECRET` - сгенерируйте безопасный секретный ключ (можно использовать: `openssl rand -base64 32`)
   
   **Для Frontend сервиса (`crud-app-frontend`):**
   - `VITE_API_URL` - URL вашего backend сервиса (например: `https://crud-app-backend.onrender.com`)

4. **Дождитесь завершения деплоя:**
   - Render автоматически создаст PostgreSQL базу данных
   - Выполнит миграции Prisma
   - Задеплоит backend и frontend

## Способ 2: Ручной деплой

### Шаг 1: Создание PostgreSQL базы данных

1. На Render Dashboard нажмите "New +" → "PostgreSQL"
2. Выберите:
   - **Name**: `crud-app-db`
   - **Plan**: Free (или другой по вашему выбору)
   - **Database**: `crudapp`
   - **User**: `crudapp`
3. Нажмите "Create Database"
4. Скопируйте **Internal Database URL** (он будет использован для подключения)

### Шаг 2: Деплой Backend

1. На Render Dashboard нажмите "New +" → "Web Service"
2. Подключите ваш Git репозиторий
3. Настройте сервис:
   - **Name**: `crud-app-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free (или другой)

4. Добавьте переменные окружения:
   - `DATABASE_URL` - Internal Database URL из шага 1
   - `JWT_SECRET` - сгенерируйте безопасный ключ (например: `openssl rand -base64 32`)
   - `NODE_ENV` = `production`
   - `FRONTEND_URL` - оставьте пустым пока, добавите после деплоя frontend
   - `PORT` = `10000` (Render автоматически установит это, но можно указать явно)

5. Нажмите "Create Web Service"

### Шаг 3: Деплой Frontend

1. На Render Dashboard нажмите "New +" → "Static Site"
2. Подключите ваш Git репозиторий
3. Настройте сервис:
   - **Name**: `crud-app-frontend`
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Publish Directory**: `frontend/dist`

4. Добавьте переменную окружения:
   - `VITE_API_URL` - URL вашего backend сервиса (например: `https://crud-app-backend.onrender.com`)

5. Нажмите "Create Static Site"

### Шаг 4: Обновление переменных окружения

После деплоя frontend, вернитесь в настройки backend и обновите:
- `FRONTEND_URL` - URL вашего frontend сервиса

## Важные замечания

### PostgreSQL

- Приложение было переведено с SQLite на PostgreSQL для продакшена
- Prisma автоматически выполнит миграции при сборке (`prisma migrate deploy`)

### CORS

- Backend настроен на прием запросов с URL, указанного в `FRONTEND_URL`
- Убедитесь, что `FRONTEND_URL` в backend совпадает с реальным URL frontend сервиса

### Cookies и HTTPS

- В production cookies настроены с `secure: true` для работы через HTTPS
- Render автоматически предоставляет HTTPS для всех сервисов

### Миграции базы данных

- При первом деплое Prisma автоматически выполнит все миграции
- Для последующих изменений схемы создавайте новые миграции:
  ```bash
  cd backend
  npx prisma migrate dev --name migration_name
  ```
  Затем закоммитьте изменения и запушьте в репозиторий

## Проверка деплоя

1. **Backend Health Check:**
   Откройте `https://your-backend-url.onrender.com/api/health`
   Должен вернуться: `{"status":"ok"}`

2. **Frontend:**
   Откройте URL вашего frontend сервиса
   Должно загрузиться приложение

3. **Тестирование:**
   - Попробуйте зарегистрировать нового пользователя
   - Войдите в систему
   - Создайте несколько постов

## Troubleshooting

### Проблемы с подключением к базе данных

- Убедитесь, что используете **Internal Database URL** для `DATABASE_URL` в backend
- Проверьте, что база данных создана и запущена

### CORS ошибки

- Проверьте, что `FRONTEND_URL` в backend совпадает с реальным URL frontend
- Убедитесь, что нет лишних слешей в конце URL

### Ошибки миграций

- Проверьте логи сборки backend сервиса
- Убедитесь, что `DATABASE_URL` правильно настроен
- При необходимости выполните миграции вручную через Render Shell

### Frontend не может подключиться к API

- Проверьте переменную `VITE_API_URL` в настройках frontend
- Убедитесь, что backend сервис запущен и доступен
- Проверьте CORS настройки в backend

## Локальная разработка с PostgreSQL

Если хотите разрабатывать локально с PostgreSQL:

1. Установите PostgreSQL локально или используйте Docker
2. Создайте базу данных: `createdb crudapp`
3. Создайте файл `backend/.env` на основе `backend/.env.example`
4. Установите `DATABASE_URL` в формате: `postgresql://user:password@localhost:5432/crudapp?schema=public`
5. Выполните миграции: `cd backend && npm run prisma:migrate`

## Дополнительные ресурсы

- [Render Documentation](https://render.com/docs)
- [Prisma Deploy Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-render)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

