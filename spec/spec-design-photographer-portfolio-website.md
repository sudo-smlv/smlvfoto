---
title: Photographer Portfolio Website — Viktoria
version: 1.0
date_created: 2026-06-18
last_updated: 2026-06-18
owner: Viktoria (Photographer) / Engineering
tags: [design, web, svelte, shadcn-svelte, portfolio, photography]
---

# Introduction

This specification defines the design, content, behavior, and acceptance criteria for a single-page marketing and lead-generation website for a professional photographer (Viktoria). The site must communicate the photographer's brand, present three service packages, describe shooting locations, showcase photobook offerings, and provide multiple contact paths. The site is built with SvelteKit and the shadcn-svelte component library, following modern, accessible, and responsive web practices.

# 1. Purpose & Scope

## 1.1 Purpose

- Establish a premium, trust-building online presence for a working photographer.
- Convert visitors into booked clients by presenting a clear value proposition and a frictionless contact flow.
- Serve as a portfolio and service catalog, replacing fragmented social-media presence as the canonical source of truth.

## 1.2 Scope

In scope:

- A single landing page composed of the six sections defined in §3 (Hero, About, Services, Locations, Photobooks, Contact).
- Contact form with server-side submission to an email endpoint and to selected messengers.
- Responsive layout across mobile, tablet, and desktop breakpoints.
- Light-mode first design with optional dark-mode support.
- Bilingual or single-language (Russian) content; English/German optional in later iterations.

Out of scope (v1):

- User accounts, authentication, payments, and e-commerce.
- Admin CMS or blog.
- Booking calendar with availability slots (handled externally in messengers).
- Analytics dashboards (only lightweight, privacy-respecting page-view tracking is allowed).

## 1.3 Audience

- Primary: end clients (couples, families, individuals, content creators) seeking photo, Reels, and photobook services in Freiburg, Basel, Baden-Baden, or anywhere in Europe.
- Secondary: the photographer herself, who must be able to update content (prices, contact handles) without code changes after the build.

## 1.4 Assumptions

- The site is a fresh SvelteKit + shadcn-svelte project, no migration from an existing stack.
- The photographer can supply a logo, brand colors, and portrait photos prior to launch.
- Hosting target is a Node-capable SvelteKit adapter (e.g., adapter-auto / Vercel / Node).
- Default content language is Russian (RU); the site may be extended to EN/DE in a follow-up release.

# 2. Definitions

| Term / Acronym        | Definition                                                                                                                                            |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| SvelteKit             | Full-stack web framework for Svelte, providing routing, SSR/SSG, and form actions.                                                                    |
| shadcn-svelte         | Re-usable component library for Svelte, distributed as copy-paste source rather than a runtime package; built on Tailwind CSS and bits-ui primitives. |
| Tailwind CSS          | Utility-first CSS framework used by shadcn-svelte.                                                                                                    |
| Reels                 | Short-form vertical video (15–60 s), optimized for Instagram / TikTok-style feeds.                                                                    |
| Photobook             | A printed, bound photo album with lay-flat pages, premium cover materials, and optional embossing.                                                    |
| Hero Section          | The top-most, full-viewport promotional block with primary headline and call-to-action.                                                               |
| CTA (Call To Action)  | A UI element (typically a button) that prompts the user to take a specific conversion action.                                                         |
| Lead Form             | A short form that captures prospect information (name, contact, idea) and submits it server-side.                                                     |
| Lay Flat              | A book-binding style that lets pages open completely flat at 180° with no gutter loss.                                                                |
| Eco-leather (экокожа) | Synthetic leather used for premium photobook covers.                                                                                                  |
| Soft Touch            | A velvety matte laminate finish applied to book covers.                                                                                               |
| SSG / SSR             | Static Site Generation / Server-Side Rendering.                                                                                                       |
| i18n                  | Internationalization — preparation of content for multiple languages.                                                                                 |
| A11y (Accessibility)  | Design and engineering practices ensuring the site is usable by people with disabilities.                                                             |
| SEO                   | Search Engine Optimization.                                                                                                                           |
| OG (Open Graph)       | Metadata protocol used by social networks to render link previews.                                                                                    |
| Honeypot              | A hidden form field used to detect bots; legitimate users leave it empty.                                                                             |
| Rate Limiting         | Server-side throttling of repeated requests from a single client.                                                                                     |
| JSON-LD               | A method of encoding structured data inside a `<script type="application/ld+json">` tag.                                                              |

# 3. Requirements, Constraints & Guidelines

## 3.1 Functional Requirements

### 3.1.1 Sections & Content

- **REQ-SEC-001**: The site MUST contain exactly the six sections in the following vertical order: (1) Hero, (2) About Me, (3) Services & Pricing, (4) Locations, (5) Photobooks, (6) Contact.
- **REQ-SEC-002**: Each section MUST be reachable via an anchor link in a sticky top navigation bar.
- **REQ-SEC-003**: The active section in the navigation MUST be visually highlighted based on scroll position.
- **REQ-SEC-004**: All text MUST be defined as a single source of truth (a typed content catalog) so it can be updated without touching component logic.

### 3.1.2 Hero Section (Section 1)

- **REQ-HER-001**: Hero MUST display a primary headline: «Бережно сохраняю ваши чувства в кадрах и книгах».
- **REQ-HER-002**: Hero MUST display a sub-headline: «Создаю визуальные истории. Фотография, атмосферные Reels и печать премиальных фотокниг.».
- **REQ-HER-003**: Hero MUST display a locations line: «📍 Фрайбург • Базель • Баден-Баден • Вся Европа».
- **REQ-HER-004**: Hero MUST contain a primary CTA button labeled «Забронировать дату» that scrolls to or opens the Contact section.
- **REQ-HER-005**: Hero MUST include a visually striking background (high-quality photo, soft gradient overlay, or short looping muted video).
- **REQ-HER-006**: Hero text MUST remain readable against the background, satisfying WCAG AA contrast (≥ 4.5:1 for body, ≥ 3:1 for large text).
- **REQ-HER-007**: The Hero MUST be the first element in the document and contain the single `<h1>` of the page.

### 3.1.3 About Me (Section 2)

- **REQ-ABT-001**: Section MUST contain the heading «Привет! Я — ваш фотограф 🤍» rendered as `<h2>`.
- **REQ-ABT-002**: Section MUST contain a portrait photo of the photographer (circular or rounded-rectangle crop, ≥ 320×320 px on desktop).
- **REQ-ABT-003**: Body copy MUST be the two paragraphs from the brief, verbatim or with equivalent meaning, separated for readability.
- **REQ-ABT-004**: Section MUST be visually balanced: portrait on one side (left on desktop), text on the other; on mobile it MUST stack with the portrait first.

### 3.1.4 Services & Pricing (Section 3)

- **REQ-SRV-001**: Section MUST present exactly three pricing cards, ordered: «Момент», «Атмосфера», «Наследие».
- **REQ-SRV-002**: The middle package («Атмосфера») MUST be visually marked as «Самый популярный» with a distinct accent style (badge, border, or shadow).
- **REQ-SRV-003**: Each card MUST list its deliverables as bulleted features and indicate delivery time.
- **REQ-SRV-004**: Each card MUST expose a CTA that scrolls to the Contact section and pre-selects the chosen package via the `?package=<id>` URL parameter.
- **REQ-SRV-005**: Prices MUST be presented with a consistent currency (e.g., € / EUR) across all three cards. The exact value is a content edit, not a hard-coded constant in the component.

| Package ID   | Display name        | Includes                                                                               | Delivery time |
| ------------ | ------------------- | -------------------------------------------------------------------------------------- | ------------- |
| `moment`     | Момент              | Consultation, 1 h shoot, 50 retouched photos, online gallery                           | 7–10 days     |
| `atmosphere` | Атмосфера (popular) | Consultation, 1.5–2 h shoot, 80+ photos, 15–30 s Reels                                 | 14 days       |
| `legacy`     | Наследие            | 2–3 h shoot, 150+ photos, Reels, premium photobook (20×30 cm, 12 spreads), EU delivery | per contract  |

### 3.1.5 Locations (Section 4)

- **REQ-LOC-001**: Section MUST contain the heading «Где мы можем создать вашу историю?» rendered as `<h2>`.
- **REQ-LOC-002**: Section MUST introduce the topic with the brief's sentence about location scouting.
- **REQ-LOC-003**: Section MUST list exactly two location categories, each with an emoji icon, title, and short description:
  - ☕️ «Городская эстетика и архитектура: Фрайбург, Базель, Баден-Баден» — for stylish walks, terrace coffee, elegant shots.
  - 🌲 «Киношная природа: Озера Титизее и Шлюхзее» — calm water, Black Forest pines, soft light.
- **REQ-LOC-004**: Each category MUST include at least one representative photo, rendered with `loading="lazy"` and explicit `width`/`height` to prevent CLS.
- **REQ-LOC-005**: The two categories MUST be presented side-by-side on desktop and stacked on mobile.

### 3.1.6 Photobooks (Section 5)

- **REQ-PHB-001**: Section MUST contain the heading «Ваши воспоминания, к которым можно прикоснуться» rendered as `<h2>`.
- **REQ-PHB-002**: Section MUST include a sub-heading and intro paragraph stating that photos should not live only on phones and the photobook is a family heirloom.
- **REQ-PHB-003**: Section MUST present three feature pillars in a three-column grid (or stacked on mobile):
  - «Качество» — Lay Flat pages, satin or glossy paper.
  - «Эксклюзивность» — premium fabric, eco-leather, Soft Touch, optional personal embossing.
  - «Забота» — full design and layout service, iterative review, EU delivery.
- **REQ-PHB-004**: At least one product shot of a photobook MUST be displayed.

### 3.1.7 Contact (Section 6)

- **REQ-CON-001**: Section MUST display a short heading «Давайте создадим красоту вместе!» rendered as `<h2>`.
- **REQ-CON-002**: Section MUST contain a short intro paragraph inviting the visitor to fill the form or message directly.
- **REQ-CON-003**: Section MUST contain a lead form with the following fields:
  - `name` (text, required, 1–80 chars)
  - `contact` (text, required, 3–120 chars; accepts phone, email, or messenger handle — validated loosely)
  - `city` (text, optional, ≤ 80 chars)
  - `package` (select, optional; values: `moment`, `atmosphere`, `legacy`; defaulting from `?package=` if present)
  - `message` (textarea, optional, ≤ 1000 chars)
  - `consent` (checkbox, required, must equal `true` to submit) — text references personal-data processing.
- **REQ-CON-004**: Form MUST perform client-side validation and show inline error messages in the user's language.
- **REQ-CON-005**: Form MUST submit via a SvelteKit form action to a server endpoint.
- **REQ-CON-006**: On success, the form MUST be replaced with a success state showing «Спасибо! Я свяжусь с вами в течение дня 🤍» and a CTA to write directly in messengers.
- **REQ-CON-007**: On error, the form MUST preserve user input, show a non-blocking error banner, and offer a retry.
- **REQ-CON-008**: Section MUST also expose direct contact links for: Instagram, WhatsApp/Telegram, Email. Links MUST use `rel="noopener noreferrer"` and open external targets in a new tab.
- **REQ-CON-009**: All contact handles (Instagram username, phone/WhatsApp number, email) MUST be sourced from a single configuration file (`site.config.ts`).
- **REQ-CON-010**: Section MUST include a hidden honeypot field (e.g., `hp`) that real users leave empty; non-empty submissions MUST be silently rejected.

## 3.2 Non-Functional Requirements

### 3.2.1 Performance

- **REQ-PRF-001**: Largest Contentful Paint (LCP) MUST be < 2.5 s on a simulated Slow 4G / Moto G4 profile.
- **REQ-PRF-002**: Cumulative Layout Shift (CLS) MUST be < 0.1.
- **REQ-PRF-003**: First Input Delay (FID) / Interaction to Next Paint (INP) MUST be < 200 ms.
- **REQ-PRF-004**: Total client JavaScript shipped for the first view MUST be < 150 KB gzipped.
- **REQ-PRF-005**: All non-critical images MUST use `loading="lazy"` and modern formats (AVIF or WebP) with PNG/JPEG fallback via `<picture>`.
- **REQ-PRF-006**: Fonts MUST be self-hosted, preloaded, and use `font-display: swap`.
- **REQ-PRF-007**: The Lighthouse Performance score MUST be ≥ 90 on mobile and ≥ 95 on desktop.

### 3.2.2 Accessibility

- **REQ-A11Y-001**: All interactive elements MUST be reachable and operable by keyboard alone, with a visible focus ring.
- **REQ-A11Y-002**: All images MUST have meaningful `alt` text (or `alt=""` for purely decorative).
- **REQ-A11Y-003**: All form fields MUST have associated `<label>` elements (visible or `aria-label`).
- **REQ-A11Y-004**: Color combinations MUST meet WCAG 2.1 AA contrast.
- **REQ-A11Y-005**: Page MUST use a logical heading outline: a single `<h1>` (in the Hero); section headings as `<h2>`; sub-headings as `<h3>`.
- **REQ-A11Y-006**: The site MUST pass automated axe-core checks with zero serious or critical violations.

### 3.2.3 SEO

- **REQ-SEO-001**: Each page MUST define `<title>`, `<meta name="description">`, canonical URL, Open Graph and Twitter Card tags, with content sourced from a single config.
- **REQ-SEO-002**: The site MUST expose a `sitemap.xml` and a `robots.txt`.
- **REQ-SEO-003**: Structured data (`schema.org/Person` and `schema.org/LocalBusiness`) MUST be embedded in JSON-LD.
- **REQ-SEO-004**: The default `<title>` MUST be ≤ 60 characters; `<meta name="description">` MUST be ≤ 160 characters.

### 3.2.4 Security

- **SEC-001**: Form submissions MUST be protected against spam (honeypot field + server-side rate limiting, or integration with a captcha service).
- **SEC-002**: All HTTP responses MUST include `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, and a `Content-Security-Policy` that disallows inline scripts except for nonces.
- **SEC-003**: User-submitted content MUST be HTML-escaped before being rendered or forwarded via email.
- **SEC-004**: The server endpoint MUST enforce a maximum payload size (≤ 32 KB) and reject malformed JSON.
- **SEC-005**: Secrets (SMTP credentials, API keys) MUST be read from environment variables and MUST NOT be bundled into the client.
- **SEC-006**: The site MUST be served exclusively over HTTPS in production.

### 3.2.5 Internationalization

- **REQ-I18N-001**: All user-facing strings MUST be extracted into a typed content catalog (`src/lib/content/ru.ts`) so that an additional locale (e.g., `en.ts`, `de.ts`) can be added without modifying components.
- **REQ-I18N-002**: The `<html lang="…">` attribute MUST match the active locale.
- **REQ-I18N-003**: Date, number, and currency formatting MUST use the `Intl` API with the active locale.

## 3.3 Constraints

- **CON-001**: The project MUST use SvelteKit ≥ 2 with Svelte 5 runes (`$state`, `$derived`, `$props`).
- **CON-002**: The project MUST use shadcn-svelte components; no other UI library is permitted.
- **CON-003**: Styling MUST be done with Tailwind CSS v4 (or the version supported by the chosen shadcn-svelte release).
- **CON-004**: The project MUST NOT introduce a CSS-in-JS runtime (e.g., styled-components, Emotion).
- **CON-005**: All third-party dependencies MUST be MIT, Apache-2.0, or BSD licensed.
- **CON-006**: The contact form endpoint MUST NOT use any third-party form-handling service (Formspree, Netlify Forms, etc.) — submissions are forwarded via SMTP or a transactional email API.
- **CON-007**: The site MUST be deployable as static (`adapter-static`) or as a Node server (`adapter-node`) without code changes beyond `svelte.config.js`.
- **CON-008**: The project MUST be implemented in TypeScript (strict mode).

## 3.4 Guidelines (Recommended)

- **GUD-001**: Use shadcn-svelte's `button`, `card`, `input`, `textarea`, `label`, `checkbox`, `select`, `sonner` (or equivalent) for toasts, and `accordion` for FAQ-style content if added later.
- **GUD-002**: Keep generic components in `src/lib/components/ui/` (shadcn-style) and feature components in `src/lib/components/sections/`.
- **GUD-003**: Use Svelte 5 runes for all reactive logic; avoid legacy stores unless wrapping third-party APIs.
- **GUD-004**: Use SvelteKit form actions for mutations; do not POST directly from `fetch` inside components.
- **GUD-005**: Wrap page metadata in a single `+layout.ts` / `+page.ts` to keep SEO consistent.
- **GUD-006**: Treat the `content/` catalog as the single source of truth for copy; do not embed copy strings inside components.
- **GUD-007**: Apply a typography scale (e.g., 1.250 — Major Third) and a 4/8-px spacing grid.
- **GUD-008**: Use Zod (or an equivalent) for form input validation on both client and server.

## 3.5 Patterns

- **PAT-001 (Section Component Pattern)**: Each section MUST be implemented as `src/lib/components/sections/<Name>.svelte`, accept no props, and read all content from the catalog. The parent `+page.svelte` MUST compose them in order.
- **PAT-002 (Content Catalog Pattern)**: All copy lives in a typed module that exports a single object with the six section keys (`hero`, `about`, `services`, `locations`, `photobooks`, `contact`).
- **PAT-003 (Site Config Pattern)**: `src/lib/config/site.ts` exports the brand name, default locale, social handles, and email.
- **PAT-004 (Form Action Pattern)**: `+page.server.ts` exports a `default` action that validates input against a Zod schema, applies rate limiting, sends email, and returns a typed result.
- **PAT-005 (Anchor Scroll Pattern)**: The sticky nav uses `scroll-spy` via an `IntersectionObserver` to set the active section id; CTA buttons set `?package=…` and call `document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })`.

# 4. Interfaces & Data Contracts

## 4.1 Public Routes

| Path                      | Method | Purpose                         | Auth                 |
| ------------------------- | ------ | ------------------------------- | -------------------- |
| `/`                       | GET    | Landing page (all six sections) | public               |
| `/?/submit` (form action) | POST   | Submit lead form                | public, rate-limited |
| `/sitemap.xml`            | GET    | Auto-generated sitemap          | public               |
| `/robots.txt`             | GET    | Crawler rules                   | public               |

## 4.2 Lead Form Contract

Request body (JSON or `application/x-www-form-urlencoded`):

```ts
type ContactSubmission = {
	name: string; // 1..80
	contact: string; // 3..120
	city?: string; // <=80
	package?: 'moment' | 'atmosphere' | 'legacy';
	message?: string; // <=1000
	consent: true; // must be true
	hp?: string; // honeypot, must be empty
};
```

Server response (form action result):

```ts
type ContactResult =
	| { ok: true; id: string }
	| { ok: false; errors: Partial<Record<keyof ContactSubmission, string>>; formError?: string };
```

## 4.3 Site Config Contract

```ts
type SiteConfig = {
	name: string;
	locale: 'ru' | 'en' | 'de';
	url: string; // canonical, no trailing slash
	email: string;
	phone: string; // E.164
	whatsapp?: string; // E.164 without '+' for wa.me link
	telegram?: string; // 'username' for t.me/username
	instagram?: { handle: string; url: string };
	ogImage: string; // absolute URL
};
```

## 4.4 Content Catalog Contract (excerpt)

```ts
type Package = {
	id: 'moment' | 'atmosphere' | 'legacy';
	name: string;
	tagline: string;
	price: { amount: number; currency: 'EUR' | 'CHF' | 'RUB' };
	features: string[];
	deliveryDays: string;
	popular?: boolean;
	cta: string;
};

type LocationCategory = {
	icon: string;
	title: string;
	description: string;
	image: { src: string; alt: string; width: number; height: number };
};

type PhotobookPillar = { icon: string; title: string; body: string };

type Content = {
	hero: {
		title: string;
		subtitle: string;
		locations: string;
		cta: string;
		background: { src: string; alt: string };
	};
	about: {
		heading: string;
		body: string[];
		portrait: { src: string; alt: string; width: number; height: number };
	};
	services: { heading: string; subheading?: string; packages: Package[] };
	locations: { heading: string; intro: string; items: LocationCategory[] };
	photobooks: {
		heading: string;
		subheading: string;
		pillars: PhotobookPillar[];
		hero?: { src: string; alt: string };
	};
	contact: {
		heading: string;
		intro: string;
		form: {
			submit: string;
			success: string;
			consent: string;
			fields: {
				name: string;
				contact: string;
				city: string;
				package: string;
				message: string;
			};
		};
	};
};
```

## 4.5 Visual Design Tokens

| Token                | Default value                    | Notes                                |
| -------------------- | -------------------------------- | ------------------------------------ |
| `--color-background` | `#FAF7F2` (warm off-white)       | may vary per locale/season           |
| `--color-foreground` | `#1A1A1A`                        | main text                            |
| `--color-accent`     | `#B98A6B` (warm clay)            | CTA, popular badge                   |
| `--color-muted`      | `#E8E1D8`                        | cards, dividers                      |
| `--font-serif`       | `Cormorant Garamond`, `serif`    | display headings                     |
| `--font-sans`        | `Inter`, `system-ui, sans-serif` | body                                 |
| `--radius`           | `0.75rem`                        | card / button corner radius          |
| Container max-width  | `1200px`                         | centered, with 24px gutter on mobile |

## 4.6 URL & Query String Contract

| Query param                                                    | Allowed values                       | Behavior                                                                                                           |
| -------------------------------------------------------------- | ------------------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| `package`                                                      | `moment` \| `atmosphere` \| `legacy` | When present, the Contact form `package` field is pre-selected and the corresponding Services card is highlighted. |
| `utm_source`, `utm_medium`, `utm_campaign`                     | any string                           | Forwarded as hidden inputs to the lead form and copied into the email subject.                                     |
| `#about`, `#services`, `#locations`, `#photobooks`, `#contact` | hash                                 | The page MUST scroll to the matching section id on load.                                                           |

# 5. Acceptance Criteria

- **AC-001**: Given a user lands on `/`, When the page loads, Then the Hero section is fully visible above the fold on a 1366×768 viewport and contains the exact headline «Бережно сохраняю ваши чувства в кадрах и книгах», the sub-headline, the locations line, and the «Забронировать дату» CTA.
- **AC-002**: Given a user clicks the Hero CTA, When the click event fires, Then the browser smooth-scrolls to the `#contact` section within ≤ 600 ms.
- **AC-003**: Given a user scrolls past 30% of the page, When any section enters the viewport, Then the corresponding nav link gains the `aria-current="true"` (or equivalent) state.
- **AC-004**: Given the Services section is rendered, When the user views it, Then exactly three cards appear in the order Момент → Атмосфера → Наследие, and the «Атмосфера» card has a «Самый популярный» badge.
- **AC-005**: Given the user clicks a service card CTA, When the click fires, Then the URL becomes `/?package=<id>` and the Contact section's `package` field is pre-selected with that value.
- **AC-006**: Given a user submits the Contact form with valid input and `consent=true`, When the request is processed, Then the server returns `{ ok: true, id }`, the form is replaced by the success state containing «Спасибо! Я свяжусь с вами в течение дня 🤍», and an email is delivered to the address configured in `site.email`.
- **AC-007**: Given a user submits the Contact form with `consent=false` or with the honeypot `hp` field filled, When the request is processed, Then the server returns a validation error and no email is sent.
- **AC-008**: Given a user submits the form more than 5 times within 10 minutes from the same IP, When the limit is exceeded, Then the server returns HTTP 429 and the form shows a «Слишком много попыток. Попробуйте позже.» message.
- **AC-009**: Given a user opens the site on a 375×812 viewport, When the page renders, Then all sections are stacked vertically, no horizontal scroll appears, and tap targets are ≥ 44×44 CSS pixels.
- **AC-010**: Given the page is loaded on a Slow 4G connection, When measured by Lighthouse mobile, Then LCP < 2.5 s, CLS < 0.1, Performance score ≥ 90.
- **AC-011**: Given a screen reader user navigates the page, When they reach the Contact form, Then each field announces its label, required state, and any error message.
- **AC-012**: Given a user shares the URL on a social network, When the platform fetches the page, Then the preview shows the configured OG image, title, and description from `site.config.ts`.
- **AC-013**: Given a user opens `/?package=legacy`, When the page loads, Then the Contact form's `package` field shows «Наследие» as selected.
- **AC-014**: Given the site is built, When `npm run lint && npm run check && npm run test && npm run build` are executed, Then all commands MUST exit with code 0.

# 6. Test Automation Strategy

- **Test Levels**: Unit, Component, Integration, End-to-End, Visual regression.
- **Unit / Component**: Vitest + `@testing-library/svelte` for component logic; Zod schema unit tests for the ContactSubmission parser.
- **Integration**: Vitest + `@sveltejs/kit/testing` for SvelteKit form actions and load functions; mock SMTP transport.
- **End-to-End**: Playwright with the official `@playwright/test` runner; one spec per section, plus full happy-path conversion flow.
- **Visual Regression**: Playwright `toHaveScreenshot()` for the Hero, Services, and Contact sections at 1440 / 768 / 375 widths.
- **Accessibility**: `@axe-core/playwright` integrated into the Playwright suite; zero serious/critical violations required.
- **Performance**: Lighthouse CI in GitHub Actions, run against a built preview deployment, with assertions on LCP, CLS, and Performance score.
- **Test Data Management**: Test leads generated by a factory (`makeLead(overrides)`); no PII. Form submissions captured by a stub email transport and asserted on.
- **CI/CD Integration**: GitHub Actions workflow that runs `pnpm lint && pnpm check && pnpm test && pnpm build && pnpm test:e2e && pnpm lhci` on every PR; required checks before merge.
- **Coverage Requirements**: ≥ 80 % line coverage for `src/lib/**`; 100 % branch coverage for the Zod schema and rate-limit logic.
- **Performance Testing**: Lighthouse CI on preview URLs after each merge to `main`; budget violations fail the build.
- **Browser Matrix**: Playwright projects for Chromium, Firefox, and WebKit on the latest stable versions.

# 7. Rationale & Context

- **Why a single landing page**: The brief describes a linear funnel (awareness → interest → inquiry). A single page with anchored sections matches that mental model, keeps the user focused, and removes navigation friction.
- **Why shadcn-svelte**: shadcn-svelte provides accessible, themable primitives that are owned by the project source, allowing the photographer's brand to be expressed without inheriting the look of a generic UI library. Its compatibility with Tailwind aligns with the existing `viktoria` workspace.
- **Why Svelte 5 runes**: Runes give explicit, fine-grained reactivity, which keeps the page bundle small (REQ-PRF-004) and avoids the runtime cost of legacy stores.
- **Why content catalog instead of CMS**: A typed module is the simplest possible source of truth for six short sections. It satisfies REQ-SEC-004 (the photographer edits a file, no DB or admin surface to secure) and avoids infrastructure that the v1 budget does not justify.
- **Why server-rendered form action instead of client `fetch`**: SvelteKit form actions are progressive (work without JS), provide free CSRF protection via the framework, and return a typed result that integrates with `use:enhance` for a smooth UX.
- **Why rate limiting + honeypot**: A captcha would damage the premium feel of the site. A combination of a hidden honeypot field and IP-based rate limiting blocks the majority of automated abuse while remaining invisible to legitimate users.
- **Why `EUR` as default currency**: The primary service area is the DACH region (Germany, Switzerland). Displaying `€` keeps the offer comparable across the three locations and matches the photographer's pricing strategy.

# 8. Dependencies & External Integrations

### External Systems

- **EXT-001**: SMTP server (or transactional email API) — required for delivering lead-form submissions to the photographer's inbox.
- **EXT-002**: Hosting platform (Vercel / Netlify / Node server) — required for SSR/SSG and form-action execution.

### Third-Party Services

- **SVC-001**: Google Fonts (or self-hosted equivalent) — display and body typefaces (Cormorant Garamond, Inter). Self-hosting is required by REQ-PRF-006.
- **SVC-002**: A captcha service is OPTIONAL. Only to be integrated if honeypot + rate limiting prove insufficient in production.

### Infrastructure Dependencies

- **INF-001**: HTTPS-capable edge with HTTP/2 or HTTP/3, HSTS, and modern TLS configuration.
- **INF-002**: A secrets store for SMTP credentials and any future API keys (e.g., environment variables in the hosting platform).

### Data Dependencies

- **DAT-001**: Imagery supplied by the photographer — hero background, portrait, location category photos, photobook product shots. All images MUST be supplied in at least 2× the largest render size (for retina) and processed to AVIF + WebP.
- **DAT-002**: Logo / wordmark in SVG with explicit viewBox; light and dark variants if dark mode is supported.

### Technology Platform Dependencies

- **PLT-001**: Node.js LTS (≥ 20) for development and build.
- **PLT-002**: SvelteKit ≥ 2, Svelte 5, Tailwind CSS v4, shadcn-svelte (latest stable aligned with Tailwind v4), TypeScript ≥ 5 (strict), Zod ≥ 3, Vitest ≥ 1, Playwright ≥ 1.40.
- **PLT-003**: Package manager: pnpm ≥ 9 (preferred) or npm ≥ 10.

### Compliance Dependencies

- **COM-001**: GDPR / DSGVO — the lead form MUST obtain explicit consent before processing personal data, and the photographer MUST be able to export or delete a lead's data on request. A privacy policy linked from the footer is required for production.
- **COM-002**: Impressum (legal notice) — required for commercial sites hosted in Germany; linked from the footer.

# 9. Examples & Edge Cases

## 9.1 Content catalog (illustrative)

```ts
// src/lib/content/ru.ts
export const ru = {
	hero: {
		title: 'Бережно сохраняю ваши чувства в кадрах и книгах',
		subtitle:
			'Создаю визуальные истории. Фотография, атмосферные Reels и печать премиальных фотокниг.',
		locations: '📍 Фрайбург • Базель • Баден-Баден • Вся Европа',
		cta: 'Забронировать дату',
		background: { src: '/images/hero.jpg', alt: 'Мягкий свет на рассвете в Шварцвальде' }
	},
	about: {
		heading: 'Привет! Я — ваш фотограф 🤍',
		body: [
			'Для меня фотография — это не просто красивая картинка, это возможность остановить время и сохранить ваши самые искренние эмоции. Я верю, что каждая история уникальна, поэтому предлагаю комплексный подход: от стильных фотографий до верстки печатного альбома.',
			'Я помогу подобрать идеальную локацию, создам комфортную атмосферу на съемке, сниму эстетичные короткие Reels для вашего Instagram и оформлю лучшие кадры в книгу, к которой захочется прикасаться снова и снова.'
		],
		portrait: { src: '/images/portrait.jpg', alt: 'Портрет фотографа', width: 480, height: 480 }
	},
	services: {
		heading: 'Услуги и стоимость',
		packages: [
			{
				id: 'moment',
				name: 'Момент',
				tagline: 'Только фото. Идеально для лёгких прогулок и портретных историй.',
				price: { amount: 250, currency: 'EUR' },
				features: [
					'Консультация и помощь в подборе локации/образов',
					'1 час съёмочного времени',
					'50 фотографий в авторской цветокоррекции и лёгкой ретуши',
					'Передача через красивую онлайн-галерею'
				],
				deliveryDays: '7–10 дней',
				cta: 'Выбрать «Момент»'
			},
			{
				id: 'atmosphere',
				name: 'Атмосфера',
				tagline: 'Фото + Reels. Самый популярный выбор.',
				price: { amount: 450, currency: 'EUR' },
				features: [
					'Консультация и помощь в подготовке',
					'1.5–2 часа съёмочного времени',
					'80+ фотографий в авторской обработке',
					'Эстетичный видеоролик (Reels) на 15–30 секунд'
				],
				deliveryDays: '14 дней',
				popular: true,
				cta: 'Выбрать «Атмосферу»'
			},
			{
				id: 'legacy',
				name: 'Наследие',
				tagline: 'Фото + Reels + фотокнига. Всё включено.',
				price: { amount: 950, currency: 'EUR' },
				features: [
					'2–3 часа съёмочного времени',
					'Все удачные фотографии в обработке (от 150 шт.)',
					'Атмосферный видеоролик (Reels)',
					'Премиальная фотокнига 20×30 см, 12 разворотов',
					'Бесплатная доставка книги по Европе'
				],
				deliveryDays: 'по договорённости',
				cta: 'Выбрать «Наследие»'
			}
		]
	},
	locations: {
		heading: 'Где мы можем создать вашу историю?',
		intro:
			'Я знаю лучшие локации и помогу подобрать место, которое идеально подойдёт под ваше настроение:',
		items: [
			{
				icon: '☕️',
				title: 'Городская эстетика и архитектура: Фрайбург, Базель, Баден-Баден',
				description: 'Идеально для стильных прогулок, кофе на террасах и элегантных кадров.',
				image: {
					src: '/images/locations/city.jpg',
					alt: 'Уютная улочка во Фрайбурге',
					width: 1200,
					height: 800
				}
			},
			{
				icon: '🌲',
				title: 'Киношная природа: Озера Титизее и Шлюхзее',
				description:
					'Спокойствие воды, хвойные леса Шварцвальда и мягкий свет для самых романтичных историй.',
				image: {
					src: '/images/locations/nature.jpg',
					alt: 'Озеро Титизее на рассвете',
					width: 1200,
					height: 800
				}
			}
		]
	},
	photobooks: {
		heading: 'Ваши воспоминания, к которым можно прикоснуться',
		subheading:
			'Фотографии не должны храниться только в телефоне. Я создаю фотокниги, которые становятся семейной реликвией.',
		pillars: [
			{
				icon: '✦',
				title: 'Качество',
				body: 'Плотные страницы (Lay Flat), открывающиеся на 180°, сатиновая или глянцевая бумага.'
			},
			{
				icon: '✦',
				title: 'Эксклюзивность',
				body: 'Обложки из премиальной ткани, экокожи или с покрытием Soft Touch. Возможность добавить персональное тиснение.'
			},
			{
				icon: '✦',
				title: 'Забота',
				body: 'Я полностью беру на себя дизайн и вёрстку. Мы обсуждаем каждую деталь, чтобы довести вашу книгу до абсолютного идеала. Доставка доступна по всей Европе ✈️.'
			}
		],
		hero: { src: '/images/photobook.jpg', alt: 'Премиальная фотокнига в обложке из экокожи' }
	},
	contact: {
		heading: 'Давайте создадим красоту вместе!',
		intro:
			'Заполните короткую форму ниже или напишите мне напрямую в мессенджеры. Расскажите немного о вашей идее: какая съёмка вам нужна (фото, Reels или всё вместе) и в каком городе вы находитесь. Я свяжусь с вами в течение дня!',
		form: {
			submit: 'Отправить',
			success: 'Спасибо! Я свяжусь с вами в течение дня 🤍',
			consent: 'Согласен(на) на обработку персональных данных',
			fields: {
				name: 'Имя',
				contact: 'Телефон, email или ник в мессенджере',
				city: 'Город (необязательно)',
				package: 'Пакет (необязательно)',
				message: 'Расскажите о вашей идее'
			}
		}
	}
} as const;
```

## 9.2 Section component skeleton

```svelte
<!-- src/lib/components/sections/Hero.svelte -->
<script lang="ts">
	import { content } from '$lib/content';
	import { Button } from '$lib/components/ui/button';
	const t = content.hero;
</script>

<section id="hero" class="relative isolate flex min-h-screen items-center">
	<img
		src={t.background.src}
		alt={t.background.alt}
		class="absolute inset-0 -z-10 h-full w-full object-cover"
	/>
	<div class="absolute inset-0 -z-10 bg-black/40" />
	<div class="container text-white">
		<h1 class="font-serif text-5xl md:text-7xl">{t.title}</h1>
		<p class="mt-4 max-w-prose text-lg md:text-xl">{t.subtitle}</p>
		<p class="mt-6 text-sm md:text-base">{t.locations}</p>
		<Button class="mt-8" href="#contact" data-cta="hero">{t.cta}</Button>
	</div>
</section>
```

## 9.3 Form action with Zod and rate limiting

```ts
// src/routes/+page.server.ts
import { z } from 'zod';
import { fail } from '@sveltejs/kit';
import { rateLimit } from '$lib/server/rate-limit';
import { sendLeadEmail } from '$lib/server/email';

const Contact = z.object({
	name: z.string().min(1).max(80),
	contact: z.string().min(3).max(120),
	city: z.string().max(80).optional(),
	package: z.enum(['moment', 'atmosphere', 'legacy']).optional(),
	message: z.string().max(1000).optional(),
	consent: z.literal('on'),
	hp: z.string().max(0).optional()
});

export const actions = {
	default: async ({ request, getClientAddress }) => {
		await rateLimit(getClientAddress());
		const form = Object.fromEntries(await request.formData());
		const parsed = Contact.safeParse(form);
		if (!parsed.success) {
			return fail(400, { ok: false, errors: parsed.error.flatten().fieldErrors });
		}
		if (parsed.data.hp) return fail(400, { ok: false, formError: 'spam' });
		const id = crypto.randomUUID();
		await sendLeadEmail({ ...parsed.data, id });
		return { ok: true, id };
	}
};
```

## 9.4 Edge cases

- **Empty `?package=` value** (e.g., `/?package=`): MUST be ignored; the form shows no pre-selection.
- **Unknown `?package` value** (e.g., `/?package=platinum`): MUST be ignored; the form shows no pre-selection.
- **Form submitted with `consent` missing**: Server returns 400 with `errors.consent = 'required'`; UI highlights the consent checkbox.
- **Network failure on submit**: Form preserves user input, shows «Не удалось отправить. Попробуйте ещё раз.», no toast.
- **Image fails to load**: A neutral background-color fallback is shown; the layout MUST NOT shift.
- **User with `prefers-reduced-motion`**: Smooth-scroll and any hero video autoplay are disabled; the hero video, if used, MUST show a static poster.
- **User on a very small screen (320 px wide)**: All sections remain readable, no horizontal scroll, font sizes never drop below 14 px for body text.
- **Locale `en` not yet implemented**: The site MUST still render the Russian content; the language switcher (if added later) MUST be hidden.

# 10. Validation Criteria

A build is considered compliant with this specification only if ALL of the following are true:

- **VAL-001**: All `REQ-*`, `SEC-*`, `CON-*` items in §3 are satisfied, with a written justification for any deviation.
- **VAL-002**: All `AC-*` items in §5 pass in the latest CI run, with screenshots attached for visual checks.
- **VAL-003**: Lighthouse mobile Performance score ≥ 90; LCP < 2.5 s; CLS < 0.1.
- **VAL-004**: axe-core reports zero serious or critical accessibility violations on the production build.
- **VAL-005**: All third-party dependencies are MIT, Apache-2.0, or BSD licensed.
- **VAL-006**: `pnpm build` produces a deployable artifact that can be served with `pnpm preview` and matches the staging URL in `/spec/`.
- **VAL-007**: A privacy policy and Impressum are reachable from the footer before the site is exposed to public traffic.
- **VAL-008**: A real-submission test (manual or automated) confirms that a completed form delivers an email to `site.email` within 60 seconds.

# 11. Related Specifications / Further Reading

- [shadcn-svelte — Components](https://www.shadcn-svelte.com/docs/components)
- [SvelteKit — Form actions](https://kit.svelte.dev/docs/form-actions)
- [Svelte 5 — Runes](https://svelte.dev/docs/svelte/$state)
- [Tailwind CSS — v4](https://tailwindcss.com/docs)
- [WCAG 2.1 — Quick reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [schema.org — Person](https://schema.org/Person), [LocalBusiness](https://schema.org/LocalBusiness)
- [GDPR — Article 6 (Lawful basis)](https://gdpr-info.eu/art-6-gdpr/)
- [TMG §5 — Impressumspflicht (DE)](https://www.gesetze-im-internet.de/tmg/__5.html)
