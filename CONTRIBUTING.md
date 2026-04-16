# Contributing

## Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```text
<type>[optional scope]: <description>
```

**Types:**

- `feat` — end-user visible new functionality or behavior change
- `fix` — end-user visible bug fixes
- `refactor` — restructuring code without changing behavior
- `chore` — dependency updates, config changes, i18n strings, other maintenance
- `ci` — GitHub Actions workflows
- `docs` — documentation only

**Scopes:** `pretalx`, `sheets`, `opass`. Omit scope if not listed here.

**Examples:**

- `feat: add session detail page`
- `fix(pretalx): handle empty speaker response`
- `chore(i18n): add English translations for venue page`

## Branch Names

Use kebab-case: `add-session-page`, `fix-sponsor-logo`

## Development

```bash
pnpm install    # install dependencies
pnpm dev        # start dev server
pnpm build      # static generation (nuxt generate)
pnpm lint       # ESLint (also formats)
pnpm typecheck  # Vue type checking
```

## Code Style

ESLint is the sole formatter — no Prettier. Run `pnpm lint` before committing. Fix formatting and lint errors in the same commit as the code change, not as a separate commit.

## Auto-imports

Auto-import scanning is disabled (`imports: { scan: false }` in `nuxt.config.ts`). Composables and utilities from Vue, Nuxt, and other libraries are still auto-imported, but project-local composables in `composables/` are not. You must use explicit imports for those.

## Styling

Use **UnoCSS** classes (Tailwind Wind4 preset). Do not use Tailwind CSS directly.

## i18n

- UI strings go in `<i18n lang="yaml">` blocks inside Vue SFCs
- Page content goes in `content/{en,zh}/` as Markdown files
- Default locale is `zh` (Traditional Chinese); always provide both `zh` and `en`

## Server API

Nitro server routes live in `server/api/`. External API responses should be cached using `defineCachedFunction`. Shared request/response types go in `shared/types/` as Zod schemas.
