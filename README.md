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
│   ├── config/
│   │   └── site.ts             # бренд, контакты, OG
│   ├── content/
│   │   ├── index.ts
│   │   └── ru.ts               # единый каталог копий (single source of truth)
│   └── utils.ts
└── routes/
    ├── +layout.svelte          # глобальный CSS + Toaster
    ├── +layout.css             # тема: warm clay primary, off-white bg
    ├── +page.svelte            # композиция секций + SEO/JSON-LD
    └── +page.server.ts         # `contact` form action (Zod, rate-limit, honeypot)
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

| Переменная   | Описание                                                                              |
| ------------ | ------------------------------------------------------------------------------------- |
| `SMTP_URL`   | SMTP-connection string для отправки лидов. Если не задана — лиды логируются в stdout. |
| `PUBLIC_URL` | Каноничный URL сайта (используется в OG/JSON-LD).                                     |

Опционально: `npm i nodemailer` — для реальной отправки писем.

## Контент

Весь копирайт хранится в `src/lib/content/ru.ts`. Редактируйте только этот файл, чтобы обновить тексты, цены или ссылки пакетов. Для добавления `en.ts` / `de.ts` — следуйте паттерну `PAT-002` в спеке.

## Контакты

`src/lib/config/site.ts` — Instagram, WhatsApp, email, телефон, OG image.
