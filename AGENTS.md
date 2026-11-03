# Wanderlust

Next.js 16 App Router travel landing page (npm — package-lock.json present; don't use other package managers). Routes so far: the home page (`src/app/page.tsx`) composes section components from `src/components/*`, and `/add-destination` hosts an admin form built from shadcn `field`/`select`/`input`/`textarea` primitives.

## Commands

- `npm run dev` — dev server (Turbopack, default bundler in Next 16)
- `npm run build` — verify build; also runs TypeScript checking (no separate `typecheck` script; there is no test framework)
- `npm run lint` — Biome (not ESLint/Prettier): lint + format check + import sorting in one pass
- `npm run format` — format with Biome (does not fix lint errors; `npx biome check --write` does)
- No CI, pre-commit hooks, or test suite exist.

## Toolchain quirks

- `next.config.ts` enables `cacheComponents: true` — dynamic APIs (`params`, `searchParams`, `cookies`, `headers`) are Promises and must be `await`ed; uncached data must work under the Cache Components model (Suspense boundaries).
- `reactCompiler: true` — don't hand-write `useMemo`/`useCallback` for the compiler; follow the Rules of React.
- Tailwind v4 keyed via a custom Turbopack rule in `next.config.ts` (`@tailwindcss/turbopack` loader), not PostCSS/globals config. No `tailwind.config` — theme tokens live as CSS variables in `src/app/globals.css`.
- Path alias `@/*` → `src/*`. Font is Josefin Sans via `next/font` in `src/app/layout.tsx` (README's Geist claim is stale).

## Components

- Static marketing page; page data (destinations, reviews, nav links) is hardcoded inside components. Images live in `public/assets/` — brand assets are spelled "Wanderlast" (extra "l" vs the project name).
- Section components in `src/components/*` use named exports with kebab-case files; most are `"use client"`. `Footer` renders globally in `layout.tsx`, not in the page.
- `FeaturedDestinations` uses raw Embla (`useEmblaCarousel` + `embla-carousel-autoplay`), not the shadcn `ui/carousel` wrapper in `src/components/ui`.
- Navbar links to routes that don't exist yet (`/destinations`, `/my-bookings`, `/admin`, `/profile`, `/login`, `/sign-up`) — planned, not broken.
- shadcn/ui with the `base-nova` style (see `components.json`): primitives come from `@base-ui/react`, **not** Radix. Add components with `npx shadcn add <name>`; they land in `src/components/ui` and import `cn` from the `"cn"` package (not `@/lib/utils`).
- `@/hooks` alias is configured but the directory doesn't exist yet.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
