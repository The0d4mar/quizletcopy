# Remfront

Remfront - тренажер карточек по типу Quizlet на Next.js App Router.

## Стек

- Next.js App Router
- TypeScript
- Prisma ORM
- PostgreSQL
- Auth.js / NextAuth
- TanStack Query
- Redux Toolkit для UI-state и временного legacy-зеркала
- Zod
- Vitest
- CSS design tokens без Tailwind в UI

## Локальный запуск

1. Установить зависимости:

```bash
npm install
```

2. Создать `.env` из примера:

```powershell
Copy-Item .env.example .env
```

3. Сгенерировать `AUTH_SECRET` и положить его в `.env`:

```bash
npx auth secret
```

4. Поднять PostgreSQL:

```bash
npm run db:up
```

Если Docker не установлен, можно использовать локальный PostgreSQL, Neon, Supabase или Railway. Главное - указать корректный `DATABASE_URL` в `.env`.

5. Применить миграции и сгенерировать Prisma Client:

```bash
npm run db:migrate
npm run db:generate
```

6. Запустить dev server:

```bash
npm run dev
```

Открыть `http://localhost:3000`.

## Production env

Минимальные переменные окружения для деплоя:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"
AUTH_SECRET="long-random-secret"
AUTH_URL="https://your-domain.com"
AUTH_TRUST_HOST="true"
```

Для Vercel обычно достаточно добавить эти переменные в Project Settings. Для Railway/Render/Fly.io переменные добавляются в настройках сервиса.

## Production deploy

Перед первым запуском production нужно применить миграции:

```bash
npm run db:deploy
```

Build script уже выполняет `prisma generate` перед `next build`:

```bash
npm run build
npm run start
```

Для managed Postgres можно использовать:

- Neon
- Supabase
- Railway PostgreSQL
- Render PostgreSQL

Важно: `DATABASE_URL` должен быть доступен во время build и runtime, потому что Prisma 7 config читает его из окружения.

## Проверка перед деплоем

```bash
npm run deploy:check
```

Эта команда выполняет:

- Prisma Client generation
- TypeScript check
- ESLint
- Vitest
- production build

## Полезные страницы

- `/register` - регистрация
- `/login` - вход
- `/profile` - личный кабинет и статистика пользователя
- `/sets` - личная библиотека
- `/community/decks` - публичные колоды сообщества

## Архитектура backend

Route handlers находятся в `app/api`. Они должны оставаться тонкими:

- получить текущего пользователя;
- провалидировать body через Zod;
- вызвать service;
- вернуть `NextResponse.json`.

Бизнес-логика живет в `services`:

- проверка ownership;
- проверка ролей owner/editor/viewer;
- правила публичных и приватных колод;
- операции копирования, импорта, экспорта, прогресса.

Доступ к Prisma изолируется в `repositories`:

- `deckRepository`
- `cardRepository`
- `folderRepository`

Основные сущности:

- `User`
- `Deck`
- `Card`
- `Folder`
- `CardProgress`
- `DeckShare`
- Auth.js модели `Account`, `Session`, `VerificationToken`

## Sharing и публичные колоды

- Владелец может сделать колоду публичной через `Deck.isPublic`.
- Публичные колоды доступны на `/community/decks`.
- Чужую публичную колоду можно открыть только для просмотра карточек и скопировать себе.
- Тесты, заучивание и прогресс для чужой публичной колоды отключены до копирования.
- Редактирование чужих колод запрещено backend-проверками ownership/access.
- Точечный доступ реализован через `DeckShare` с ролями `VIEWER` и `EDITOR`.

## Import / Export

- `GET /api/decks/[id]/export` экспортирует читаемую колоду в JSON.
- `POST /api/decks/import` импортирует JSON и создает приватную копию у текущего пользователя.
- Импортируемые данные проходят Zod-валидацию.

## Текущее состояние миграции frontend

- Server data постепенно переносится в API и TanStack Query.
- Redux остается для UI-state: модалки, фильтры, выбранные режимы, временное состояние форм.
- `localStorage` не должен быть основным источником данных для Deck/Card/Folder/CardProgress.

## Production checklist

- Настроить production `DATABASE_URL`.
- Настроить `AUTH_SECRET`, `AUTH_URL`, `AUTH_TRUST_HOST`.
- Выполнить `npm run db:deploy` перед запуском production.
- Проверить `npm run deploy:check`.
- Проверить регистрацию, вход, создание колоды, добавление карточек, публичную библиотеку и копирование публичной колоды.
- Добавить централизованное логирование ошибок перед большим публичным релизом.
- Добавить e2e tests для auth, создания колоды, публичной библиотеки и копирования колоды.