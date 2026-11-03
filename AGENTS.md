# Wanderlust

Next.js 16 App Router travel app (npm — package-lock.json present; don't use other package managers). Two halves to know about:

- **This repo**: the Next.js UI. Home (`src/app/page.tsx`) composes section components; `/destinations` + `/destinations/[ID]` (list/filter, detail with update/delete dialog), `/add-destination` admin form, auth via `(auth)/sign-up` and `(auth)/sign-in`.
- **Sibling backend**: an Express + Mongo API lives OUTSIDE this repo at `../wanderlust-server` (port 5000). Destinations data comes from it. `README.md` is stale create-next-app boilerplate — ignore it.

## Commands

- `npm run dev` — dev server (Turbopack, default bundler in Next 16)
- `npm run build` — verify build; also runs TypeScript checking (no separate typecheck; no test framework exists). **Requires the Express API on :5000 to be running** — prerendering fetches real destinations data.
- `npm run lint` — Biome (not ESLint/Prettier): lint + format check + import sorting in one pass
- `npm run format` — Biome format only. `npx biome check --write` fixes lint AND formatting for specific files.
- No CI, pre-commit hooks, or test suite exist.

## Data layer — Cache Components model

- `next.config.ts`: `cacheComponents: true` + `reactCompiler: true`. Dynamic APIs (`params`, etc.) are Promises — `await` them **inside** a Suspense boundary or inside `"use cache"` functions; an uncached `fetch` or `params` read directly in a page fails the build.
- All destination reads go through `src/lib/destination-data.ts` (file-level `"use cache"`, tagged `cacheTag("destinations")`). `/destinations/[ID]` prerenders every destination via `generateStaticParams()`; unknown IDs fall back to on-demand rendering behind Suspense.
- After any mutation (add/update/delete), call the server action `refreshDestinations()` (`src/app/actions.ts`, uses `updateTag`) or the UI stays stale for 15 min. This is already wired into the add form, update dialog, and delete flow.
- Avoid adding Suspense boundaries whose fallback→content swap resolves during navigation (the streaming replacement during navigations logs a React "children should not have changed" console error — prefer `use cache` + full prerender).
- `reactCompiler: true` — don't hand-write `useMemo`/`useCallback`; follow the Rules of React.

## Backend API quirks (`../wanderlust-server/index.js`)

- Routes: `GET /destinations`, `GET /destinations/:id`, `PATCH /destinations/:id`, `DELETE /destination/:id` (**singular** — forgetting this 404s deletions), `POST /add-destination` (inserts the payload verbatim).
- Fields: `destinationName, country, categories, price (number), duration, departureCode, imageUrl, description`. No rating; ratings only render when present.
- `PATCH` does `$set` on **every** field — omitting a field wipes it in Mongo. Send the complete payload.
- The PATCH handler never sends a response; delete by non-hex `_id` throws (`new ObjectId`). Frontend does the PATCH fire-and-forget — don't `await` its body.

## Auth (better-auth)

- Server: `src/app/api/auth/[...all]/route.ts` + `src/lib/auth.ts` (Mongo adapter, writes `user`/`session`/`account` collections into the same `wanderlustDB`). Needs `MONGODB_URL` + `BETTER_AUTH_SECRET`/`BETTER_AUTH_URL` from `.env` (no spaces/backticks — dotenv doesn't parse them).
- Client: `src/lib/auth-client.ts` exports `signIn`, `signOut`, `signUp`, `useSession` from the single configured `createAuthClient()`. Email/password only: `signUp.email({ name, email, password })`, `signIn.email({ email, password, rememberMe })`.
- Error-code mapping in the forms: signup duplicate is `USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL`, bad credentials is `INVALID_EMAIL_OR_PASSWORD` (codes differ from older better-auth versions — verify against the live response before renaming).
- Signup/sign-in live in `src/components/sign-in-form.tsx` / `sign-up-form.tsx` (client components; pass exists in navbar `UserMenu`). Success redirects to `/destinations`.

## Conventions & gotchas

- shadcn/ui, `base-nova` style (`components.json`): primitives are `@base-ui/react`, **not** Radix, and import `cn` from the `"cn"` package (not `@/lib/utils`). `npx shadcn add <name> -y -s` (it interactively prompts to overwrite existing files otherwise; keep repo files, don't pass `--overwrite` carelessly).
- `src/components/*` — named exports, kebab-case filenames. **Exceptions are user-made**: `Delete.tsx`, `Dialog.tsx` (export `DeleteConfirmationDialog`, `UpdateTravelPackageDialog`).
- Destination images come from user-submitted URLs (unsplash, etc.) — rendered with plain `<img>` guarded by a biome-ignore (next/image would need remotePatterns; keep the ignore comment when refactoring).
- Theme tokens are CSS variables in `src/app/globals.css`; Tailwind v4 via the custom Turbopack rule in `next.config.ts`, no `tailwind.config`.
- Path alias `@/*` → `src/*`. Font is Josefin Sans via `next/font` in `src/app/layout.tsx`.
- Brand assets in `public/assets/` are spelled "Wanderlast" (extra "l").
- Navbar still links to `/my-bookings`, `/admin`, `/profile` — routes that don't exist yet (planned, not broken). Auth pages already route: `/sign-in`, `/sign-up`.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
