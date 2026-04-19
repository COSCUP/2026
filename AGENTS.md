## Project Overview

COSCUP 2026 conference website built with Nuxt 4, statically generated and deployed to GitHub Pages.

Follow @CONTRIBUTING.md for commit, branch, code style, and workflow conventions.

## Architecture

**Framework:** Nuxt 4 (Vue 3) with static generation, base URL `/2026/`.

**Styling:** UnoCSS with Tailwind Wind4 preset. Theme colors: `primary-50` through `primary-800`, `cp-green`.

**i18n:** Content collections are defined in `content.config.ts` as `content_en` and `content_zh`. The `useLocaleContent` composable fetches the right locale's markdown and falls back to the default locale.

**Content pages:** `pages/[...slug].vue` is the catch-all that renders Markdown from `content/`. Custom MDC components (`app/components/content/`) like `LeafletMap`, `BusRoutes`, `Info`, and `Copyable` are auto-registered for use in Markdown.

**Layouts:** `default` (with nav) and `empty` (for landing/sponsorship pages).

**Server API:** Nitro server routes in `server/api/`:

- `session/` — Fetches from Pretalx API
- `sponsorship/` — Fetches from Google Sheets (CSV export)
- `opass.json.get.ts` — OPass integration

**Icons:** Custom icon collection in `app/assets/icons/`, referenced as `local:icon-name`.
