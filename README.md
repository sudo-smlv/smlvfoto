# Viktoria — Photographer Portfolio

Одностраничный сайт-портфолио фотографа Viktoria (Фрайбург • Базель • Баден-Баден), построенный на SvelteKit 2 + Svelte 5 + Tailwind CSS v4 + shadcn-svelte.

> Содержание и поведение определены в [`spec/spec-design-photographer-portfolio-website.md`](./spec/spec-design-photographer-portfolio-website.md).

## Стек

- **SvelteKit ≥ 2** с Svelte 5 (runes mode, forced)
- **Tailwind CSS v4** (через `@tailwindcss/vite`)
- **shadcn-svelte** (стиль `nova`, `lucide` иконки, `base` primitives)
- **Zod 4** для валидации формы
- **TypeScript** (strict)

## Структура

```
src/
├── app.html                    # html[lang="ru"] + preconnect к Google Fonts (Cormorant Garamond)
├── lib/
│   ├── components/
│   │   ├── site-header.svelte  # sticky nav + scroll-spy
│   │   ├── ui/                 # shadcn-svelte примитивы
│   │   ├── icons/
│   │   │   └── instagram.svelte
│   │   └── sections/
│   │       ├── hero.svelte
│   │       ├── about.svelte
│   │       ├── services.svelte
│   │       ├── locations.svelte
│   │       ├── photobooks.svelte
│   │       └── contact.svelte
│   ├── content/
│   │   ├── localize.ts         # Sanity {ru,de,en} → один язык, картинки → CDN-URL
│   │   └── build.ts            # документы Sanity → словарь i18n.content и настройки сайта
│   ├── sanity/config.ts        # projectId, dataset, адрес Studio
│   ├── server/cms.ts           # запрос к Sanity + кэш на 30 секунд
│   └── utils.ts
└── routes/
    ├── +layout.server.ts       # загружает контент из Sanity для языка страницы
    ├── +layout.svelte          # глобальный CSS + Toaster
    └── [lang]/
        ├── +page.svelte        # композиция секций + SEO/JSON-LD
        └── +page.server.ts     # `contact` form action (Zod, rate-limit, honeypot)
sanity/
├── schema.js                   # схема Sanity (развёрнута через Sanity MCP)
└── migrate-content.py          # разовый перенос старых текстов в Sanity
```

## Запуск

```bash
npm install
npm run dev          # http://localhost:5173
npm run check        # svelte-check
npm run lint         # prettier + eslint
npm run build        # production build
```

## Переменные окружения

| Переменная           | Описание                                                                              |
| -------------------- | ------------------------------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN` | Токен бота, который присылает заявки с формы в Telegram.                              |
| `TELEGRAM_CHAT_ID`   | ID чата, куда приходят заявки.                                                        |
| `SMTP_URL`           | SMTP-connection string для отправки лидов. Если не задана — лиды логируются в stdout. |

Опционально: `npm i nodemailer` — для реальной отправки писем.

## Контент (Sanity)

Все тексты на трёх языках, цены, фото, портфолио и контакты редактируются в Sanity Studio:
**https://smlvfoto.sanity.studio** (проект `6uyeptt9`, датасет `production`).

- **Главная страница** — вкладки по блокам сайта: первый экран, обо мне, портфолио, услуги и цены,
  локации, фотокниги, вопросы, контакты и форма, подвал, меню и служебные тексты.
- **Настройки и контакты** — название сайта, email, телефон, WhatsApp, Instagram, SEO-описание.

У каждого текста есть поля RU / DE / EN; если перевод пустой, сайт покажет другой язык.
Изменения появляются на сайте примерно через 30 секунд после нажатия **Publish** — пересобирать
и перезапускать сайт не нужно.

Схема живёт в `sanity/schema.js`. Studio развёрнут через Sanity MCP (`deploy_schema` +
`deploy_studio`): после правки схемы разверните её заново тем же способом.
