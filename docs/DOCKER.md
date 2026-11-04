# Docker

Требуются Docker Engine / Docker Desktop в режиме Linux containers и Docker Compose.

Проверено 4 ноября 2026 на Docker Desktop29.7.2: образ собран в Linux, контейнер на3001 отвечал HTTP200, оптимизация изображений работала, поп-ап проекта открывался, healthcheck — healthy, пользователь процесса — node (uid1000). Временный проверочный контейнер удалён; dev на3000 продолжает работать.

```sh
docker compose up --build -d
docker compose ps
docker compose logs -f web
```

Сайт: http://localhost:3000. Остановка: `docker compose down`.

Если локальный dev уже занимает3000, задайте другой внешний порт:

```powershell
$env:PORT = "3001"
docker compose up --build -d
```

Либо без Compose:

```sh
docker build -t prosto-dacha:local .
docker run --rm --init -p 3001:3000 prosto-dacha:local
```

Образ многостадийный: npm ci → Next.js standalone → минимальный runtime. Сервер запускается непривилегированным пользователем node; статика и public копируются отдельно, каталог image cache доступен на запись. Healthcheck проверяет HTTP-ответ главной. Windows node_modules и локальные .env исключены из контекста.

Публичные параметры `NEXT_PUBLIC_SITE_URL`, `NEXT_PUBLIC_LEAD_ENDPOINT`, `NEXT_PUBLIC_PRIVACY_URL` передаются как build args. Для Compose можно создать `.env` рядом с compose.yaml. После изменения нужен `docker compose up --build -d`: Next.js встраивает эти значения при сборке. Если параметры не указаны, форма остаётся демонстрационной. Секреты в NEXT_PUBLIC_* не добавлять.

Для разработки на компьютере остаётся `npm run dev` с Fast Refresh. Dockerfile собирает production, не dev.
