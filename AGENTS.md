## Project Overview

COSCUP 2026 conference website built with Nuxt 4, statically generated and deployed to GitHub Pages.

## Architecture

**Framework:** Nuxt 4 (Vue 3) with static generation, base URL `/2026/`.

**Styling:** UnoCSS with Tailwind Wind4 preset. Theme colors: `primary-50` through `primary-800`, `cp-green`. No Tailwind CSS directly — use UnoCSS classes.

**i18n:** Two locales — `zh` (default, Traditional Chinese) and `en`. Translations live in two places:

- `<i18n lang="yaml">` blocks inside Vue SFCs for UI strings
- `content/{en,zh}/` directories for Markdown page content

Content collections are defined in `content.config.ts` as `content_en` and `content_zh`. The `useLocaleContent` composable fetches the right locale's markdown and falls back to the default locale.

**Content pages:** `pages/[...slug].vue` is the catch-all that renders Markdown from `content/`. Custom MDC components (`app/components/content/`) like `LeafletMap`, `BusRoutes`, `Info`, and `Copyable` are auto-registered for use in Markdown.

**Layouts:** `default` (with nav) and `empty` (for landing/sponsorship pages).

**Server API:** Nitro server routes in `server/api/`:

- `session/` — Fetches from Pretalx API (cached via `defineCachedFunction`)
- `sponsorship/` — Fetches from Google Sheets (CSV export)
- `opass.get.ts` — OPass integration

**Shared types:** `shared/types/` contains Zod schemas shared between server and client (e.g., sponsorship tier validation).

**Icons:** Custom icon collection in `app/assets/icons/`, referenced as `local:icon-name`.

## ESLint Conventions

Uses `@antfu/eslint-config` with these notable rules:

- Vue attributes must be alphabetical and one-per-line
- `1tbs` brace style with `curly: multi-line, consistent`
- Arrow functions always need parens: `(x) => x`
- ESLint is the formatter — no Prettier
