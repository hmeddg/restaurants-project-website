# CLAUDE.md

Guidance for Claude Code when working in this repository.

## Stack

- **Framework:** Next.js (App Router, `app/` directory)
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **Data:** external REST API (no direct database access)
- **Validation:** zod
- **Package manager:** npm (use `pnpm`/`yarn` only if a matching lockfile exists)

### Approved dependencies

These may be used without asking: `zod`, `clsx`, `tailwind-merge`, `server-only`, `prettier`, `prettier-plugin-tailwindcss`, `@next/bundle-analyzer`, `vitest`, `@testing-library/react`, `@playwright/test`.
Any other dependency requires asking first, with a one-line reason and its bundle-size impact.

## Commands

```bash
npm run dev          # start dev server
npm run build        # production build — must pass before a task is done
npm run start        # run the production build locally
npm run lint         # ESLint
npx tsc --noEmit     # type-check
npm run format       # Prettier
npm run test         # unit tests (Vitest)
npm run test:e2e     # end-to-end tests (Playwright)
```

Run `lint` and `tsc --noEmit` after every non-trivial change. Fix errors; don't silence them with `// @ts-ignore` or `eslint-disable`.

## Project structure

```
app/
  (marketing)/      # route groups to organise routes without affecting URLs
  api/              # Route Handlers (only for client-side live data, webhooks)
  layout.tsx        # root layout: fonts, metadata, viewport, <html lang>
  page.tsx
  not-found.tsx
  error.tsx
  global-error.tsx
  sitemap.ts
  robots.ts
  manifest.ts
components/
  ui/               # small reusable primitives (Button, Input, Card…)
  sections/         # page-level sections (Hero, Features, Footer…)
  layout/           # Header, Footer, Navigation
hooks/              # custom React hooks (client-only, "use client")
lib/
  api/              # REST API client and resource functions (server-only)
  auth/             # session, cookies, auth schemas (server-only)
  utils.ts          # cn() and small helpers
  env.ts            # validated environment variables
config/
  site.ts           # site name, URL, nav links, social links — single source of truth
types/              # shared TypeScript types
public/             # static assets (images, icons, fonts)
tests/              # unit (Vitest) and e2e (Playwright) tests
```

- Use the `@/` import alias (e.g. `import { Button } from "@/components/ui/button"`). No deep relative paths like `../../../`.
- Site-wide text that repeats (brand name, nav links, contact email, social URLs) lives in `config/site.ts`, never hard-coded across components.

## Next.js rules

### Links — always `next/link`

- Every internal link uses `<Link href="...">` from `next/link`. A plain `<a>` for an internal route is never allowed. The only exception is a full-page redirect into a Route Handler (e.g. the Google OAuth start URL).
- External links use `<a href="..." target="_blank" rel="noopener noreferrer">`.
- Link text must be descriptive (no "click here"), for SEO and screen readers.
- Use `aria-current="page"` on the active nav link.

### Images — always `next/image`, optimized for SEO

- Every image uses the `<Image>` component from `next/image`. A plain `<img>` is never allowed.
- Always set a descriptive, keyword-relevant `alt` (empty `alt=""` only for purely decorative images).
- Always set `width` and `height`, or use `fill` inside a parent with a fixed size, to prevent layout shift (CLS).
- Always set `sizes` when using `fill` or responsive layouts, so the browser downloads the right size.
- Add `priority` only to the above-the-fold / LCP image (usually the hero image); everything else stays lazy-loaded.
- Use `placeholder="blur"` for large local images.
- Store images in `public/` or import them statically; use descriptive kebab-case file names (`modern-office-interior.webp`, not `img_123.jpg`).
- Prefer WebP/AVIF sources; keep source files reasonably sized.
- Remote images must have their domain listed in `images.remotePatterns` in `next.config`.
- Icons are inline SVG components, not image files or icon fonts.

### Server-first architecture

- **Most of the app is server-side.** Every component is a Server Component by default. Pages, layouts, sections and data fetching stay on the server.
- **Client code lives in its own separate file.** When something needs interactivity (state, effects, event handlers, browser APIs), create a dedicated small file that starts with `"use client"` and contains only that interactive part. Never add `"use client"` to a page, layout or large section.
- Name client files clearly, e.g. `mobile-menu.client.tsx`, `contact-form.client.tsx`, and import them into the Server Component that renders them.
- Keep client components as small and as far down the tree as possible; pass server-fetched data to them as props (props must be serializable — no functions or class instances).
- Server Components can be passed into client components as `children` to keep them server-rendered.
- Never import server-only code (secrets, API client, `fs`) into a client file. Mark server-only modules with `import "server-only"`.
- Use `loading.tsx`, `error.tsx`, `not-found.tsx` and `global-error.tsx` where routes need them.

### Fonts

- Load fonts via `next/font` (Google or local), never `<link>` tags to Google Fonts.
- Use `display: "swap"`, load only the weights and subsets actually used, and expose them as CSS variables for Tailwind.

## Data layer — REST API

All data comes from an external REST API. There is no direct database access from this app.

### Structure

```
lib/api/
  client.ts       # single fetch wrapper (base URL, headers, auth, errors, timeout)
  endpoints.ts    # endpoint paths in one place
  products.ts     # one file per resource: getProducts, getProduct, createProduct…
  schemas.ts      # zod schemas for API responses
types/api.ts      # types inferred from the zod schemas
```

- Every API call goes through `lib/api/client.ts`. Never call `fetch` with a raw URL inside a component.
- Each resource file exports small typed functions (`getProducts()`, `getProductBySlug(slug)`), and components only call those.
- Mark every file in `lib/api/` with `import "server-only"` so it can never end up in the client bundle.

### Fetching (server side)

- Fetch data in Server Components, never with `useEffect` in client components.
- Do **not** create a Route Handler just so a Server Component can call it — call the API function directly.
- Run independent requests in parallel with `Promise.all`, never one after another (avoid request waterfalls).
- Wrap reused fetchers in React `cache()` so the same request in a layout and a page runs only once per render.
- Stream slow parts with `<Suspense>` and a skeleton fallback so the rest of the page renders immediately.
- Ask the API only for what the page needs (use query params for fields, filters, pagination, limits). Never fetch a full list to show three items.
- Paginate lists; keep pagination, filters and search in URL search params so they are shareable and crawlable.

### Caching — set it explicitly on every request

Never rely on the default caching behaviour; every call states its strategy:

| Data type | Strategy |
|---|---|
| Rarely changes (settings, categories, static content) | `next: { revalidate: 3600, tags: ["categories"] }` |
| Changes sometimes (products, posts) | `next: { revalidate: 60, tags: ["products"] }` |
| Per-user or real-time (cart, account, dashboard) | `cache: "no-store"` |

- Tag every cached request (`tags`) so it can be invalidated precisely.
- After a mutation, call `revalidateTag("products")` (or `revalidatePath`) so the UI shows fresh data without disabling the cache.
- Use `generateStaticParams` for dynamic routes with a known set of slugs so those pages are pre-rendered.
- If the API sends webhooks on content changes, handle them in `app/api/revalidate/route.ts` (verify a secret) and call `revalidateTag`.

### Mutations (create / update / delete)

- Use **Server Actions** (`"use server"` in `app/**/actions.ts`) that call the API functions. Forms post to them directly.
- Validate input with zod in the Server Action before calling the API.
- Revalidate the affected tags after a successful mutation.
- Return a typed result (`{ ok: true, data } | { ok: false, error, fieldErrors? }`) instead of throwing to the client.

### Validation, types & errors

- Validate every API response with a zod schema and infer TypeScript types from it (`z.infer<typeof ProductSchema>`). Never trust or cast raw JSON with `as`.
- The client wrapper:
  - sets `Content-Type` and auth headers
  - applies a timeout (`signal: AbortSignal.timeout(8000)`)
  - throws a typed `ApiError` (status + message) on non-2xx responses
  - retries only idempotent `GET` requests, at most once, on network errors or `5xx`
- Map `404` to `notFound()`; let other errors reach `error.tsx`.
- Never expose raw API error messages or stack traces to users.

### Secrets & environment

- API base URL and keys live in `.env.local` as server-only variables (`API_URL`, `API_KEY`) — **no** `NEXT_PUBLIC_` prefix.
- All env variables are validated with zod in `lib/env.ts` at startup; the app imports from `lib/env.ts`, never from `process.env` directly.
- Keep an up-to-date `.env.example` with every variable name (no real values).
- If a client component truly needs live data (search-as-you-type, infinite scroll), it calls a Route Handler in `app/api/` that proxies the request; the API key never reaches the browser.

## Forms & client state

- Forms use a Server Action as `action`, with `useActionState` for result/errors and `useFormStatus` for the pending state — in a separate `"use client"` file.
- Forms work without JavaScript where possible (progressive enhancement).
- Show field-level errors next to the field (`aria-invalid`, `aria-describedby`), and disable the submit button while pending.
- Validate on the client for UX only; the Server Action's zod validation is the real check.
- Protect public forms against spam (honeypot field and/or rate limiting in the Server Action).
- State: prefer server data + URL search params. Use `useState` for local UI state. No global state library unless clearly needed (ask first).
- Use `useOptimistic` for instant feedback on mutations where it helps.

## Authentication — login & register

Authentication is handled by the REST API (it issues the tokens). This app never stores passwords and never talks to a database; it only calls the API's auth endpoints and manages the session cookies.

### Structure

```
app/
  (auth)/                 # public auth pages, own minimal layout
    login/page.tsx
    register/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
    actions.ts            # login, register, logout, forgot/reset password Server Actions
  (protected)/            # pages that require a logged-in user
    layout.tsx            # calls requireUser()
    dashboard/page.tsx
    account/page.tsx
lib/auth/
  session.ts              # getSession(), getCurrentUser(), requireUser(), requireRole()
  cookies.ts              # set / read / clear auth cookies (cookie names in one place)
  schemas.ts              # zod: loginSchema, registerSchema, resetPasswordSchema
middleware.ts             # optimistic route protection + token refresh (proxy.ts on Next.js 16+)
```

All files in `lib/auth/` start with `import "server-only"`.

### Login & register flow

1. The form (separate `"use client"` file) posts to a Server Action.
2. The Server Action validates input with zod (`loginSchema` / `registerSchema`).
3. It calls the API (`POST /auth/login` or `POST /auth/register`) through `lib/api`.
4. On success it stores the tokens in cookies via `lib/auth/cookies.ts` and calls `redirect()`.
5. On failure it returns `{ ok: false, error, fieldErrors }` and the form shows the errors, keeping the typed email.

**Register rules**
- Fields: name, email, password, confirm password, and a terms checkbox if required.
- Password: at least 8 characters, validated with zod on the server; show the rules under the field and a live strength hint on the client.
- `confirmPassword` must match (zod `.refine`).
- If the API requires email verification, show a "check your inbox" page and handle the verification link route.

### Tokens & cookies

- Access token (short-lived) and refresh token (long-lived) are stored **only** in cookies with `httpOnly: true`, `secure: true` (in production), `sameSite: "lax"`, `path: "/"` and an explicit `maxAge`.
- Never put tokens or user data in `localStorage`, `sessionStorage`, URL params or client-side JS state.
- Cookies can only be written in Server Actions, Route Handlers and middleware — never in Server Components. Token refresh therefore happens in middleware: if the access token is expired and a refresh token exists, call `POST /auth/refresh`, set the new cookies, and continue; if refresh fails, clear cookies and redirect to `/login`.
- `lib/api/client.ts` reads the access token from cookies and adds `Authorization: Bearer <token>` for authenticated requests.

### Protecting routes

- **Middleware is only an optimistic first check** (cookie present → continue, missing → redirect to `/login?next=/original-path`). It is never the only protection.
- **The real check happens on the server, next to the data:** every protected layout, page, Server Action and Route Handler calls `requireUser()` (or `requireRole("admin")`), which verifies the session with the API and redirects / returns `401` if invalid.
- `getCurrentUser()` is wrapped in React `cache()` so it calls the API only once per request.
- Logged-in users who visit `/login` or `/register` are redirected to the dashboard.
- The `next` redirect parameter is accepted only if it is a relative internal path starting with `/` (and not `//`) — prevents open redirects.

### Authenticated data & caching

- Every request that depends on the logged-in user uses `cache: "no-store"` (or reads cookies, which makes it dynamic). User-specific data must **never** be cached or shared between users.
- Protected pages are dynamic; never use `generateStaticParams` or `revalidate` on them.

### Using the user in client components

- Fetch the user on the server and pass only the fields needed (`name`, `email`, `avatar`, `role`) as props.
- If many client components need it, a small `user-provider.client.tsx` context is fed from the protected layout. Never include tokens in it.
- UI hiding (e.g. hiding an admin button) is cosmetic only; permissions are always enforced on the server and by the API.

### Logout

- A Server Action calls `POST /auth/logout` (to revoke the refresh token), clears all auth cookies, and redirects to `/login` (or home).
- Logout is a `<form>` with a submit button, not a GET link.

### Forgot & reset password

- The forgot-password action always shows the same message ("If an account exists, we've sent a reset link") whether or not the email exists — no account enumeration.
- The reset page reads the token from the URL, validates the new password with zod, and calls the API.

### Sign in with Google (OAuth 2.0)

Users can log in **and** register with Google. The flow is Authorization Code + PKCE. The Google client secret lives **only in the REST API**; this app never sees it.

**Files**

```
app/api/auth/google/route.ts            # start: create state + PKCE, redirect to Google
app/api/auth/google/callback/route.ts   # callback: verify state, send code to the API, set cookies
lib/auth/oauth.ts                       # PKCE (code_verifier / code_challenge S256), state, URL builder
components/auth/google-button.tsx       # "Continue with Google" button (server component)
```

**Flow**

1. The "Continue with Google" button navigates to `/api/auth/google?next=/original-path`.
2. The start Route Handler:
   - creates a random `state` and a PKCE `code_verifier` (+ `code_challenge` with S256)
   - stores `state`, `code_verifier` and the validated `next` in short-lived (10 min) `httpOnly`, `secure`, `sameSite: "lax"` cookies
   - redirects to Google's authorization URL with `response_type=code`, `scope=openid email profile`, `state`, `code_challenge`, `code_challenge_method=S256` and the fixed `redirect_uri`
3. Google redirects back to `/api/auth/google/callback?code=...&state=...`.
4. The callback Route Handler:
   - rejects the request if `state` is missing or doesn't match the cookie (CSRF protection)
   - sends `code`, `code_verifier` and `redirect_uri` to the API (`POST /auth/oauth/google`)
   - the API exchanges the code with Google, verifies the ID token, then finds, creates or links the user and returns the app's own access + refresh tokens
   - sets the normal auth cookies (same as email login), deletes the temporary OAuth cookies, and redirects to the validated `next` path or the dashboard
5. After this, the session works exactly like an email/password session (same cookies, refresh, `requireUser()`).

**Account linking**

- The API links a Google login to an existing account only when Google reports `email_verified: true`.
- If linking isn't allowed (API policy), redirect to `/login?error=account_exists` with a clear message ("This email already has an account — log in with your password").
- New Google users are created as verified; if the app needs extra profile data, send them to a short "complete your profile" step.

**Errors**

- User cancels on Google (`error=access_denied`) → `/login?error=oauth_cancelled`, friendly message, no error log.
- Invalid state, expired cookies or an API failure → `/login?error=oauth_failed`, a generic message, and the details logged on the server (without codes or tokens).
- Error codes in the URL are mapped to fixed messages; never print the raw query value on the page.

**Config**

- `.env.local`: `GOOGLE_CLIENT_ID` and `GOOGLE_REDIRECT_URI` (server-only, validated in `lib/env.ts`). The client secret stays in the API.
- Register every exact redirect URI in Google Cloud Console: `http://localhost:3000/api/auth/google/callback` and the production domain. Vercel preview URLs change, so use a fixed preview/staging domain for OAuth or disable Google login on previews.
- Configure the OAuth consent screen (app name, logo, privacy policy and terms URLs) before going live.

**Button & UX**

- Shown on both `/login` and `/register`, above the email form, separated by an "or" divider.
- Follows Google's branding guidelines: official "G" logo (inline SVG), text "Continue with Google", neutral white or dark style; never restyle the logo.
- Because it starts a full-page redirect to a Route Handler, this button is a plain `<a href="/api/auth/google">` — the one allowed exception to the `next/link` rule (`Link` would try to prefetch it).
- On `/register`, show "By continuing, you agree to our Terms and Privacy Policy" under the button.
- Show a loading state on the button after it is clicked (tiny client file, or CSS `:active`), so a double-click doesn't start two flows.

### Security

- Login errors are generic: "Invalid email or password" — never say which one was wrong.
- Rate-limit login, register and forgot-password (by IP + email) or rely on the API's rate limiting; show a friendly "too many attempts" message on `429`.
- Server Actions have built-in origin checks; any Route Handler that changes data must verify the origin / a CSRF token.
- Never log passwords, tokens or full auth responses.
- Auth pages set `robots: { index: false }`.

### Auth UX

- Correct `autoComplete` values: `email`, `current-password` (login), `new-password` (register / reset), `name`.
- Show/hide password toggle (accessible button with `aria-label`).
- Submit button shows a pending state and is disabled while submitting.
- Field-level errors with `aria-invalid` and `aria-describedby`; a general error at the top announced with `aria-live`.
- Clear links between login ↔ register ↔ forgot password.
- After login, redirect to the `next` page if present, otherwise to the dashboard.

### Auth testing

- Playwright e2e: register, login, wrong password, logout, protected page redirects to login, logged-in user redirected away from `/login`, `next` redirect after login.
- Unit-test the zod auth schemas and the `next` redirect validation.
- Google OAuth: unit-test PKCE and state helpers; e2e-test the callback by mocking the API's `POST /auth/oauth/google` (never hit real Google in tests), plus the cancelled and invalid-state cases.

## SEO

- Every page exports `metadata` or `generateMetadata` with a unique `title` (50–60 chars) and `description` (140–160 chars). Never use manual `<head>` tags.
- Set a `title.template` in the root layout (e.g. `"%s | Brand"`) and `metadataBase` for absolute URLs.
- Include Open Graph and Twitter metadata (`openGraph`, `twitter`) with an OG image (1200×630) for every main page; use `opengraph-image.tsx` for dynamic OG images.
- Set `alternates.canonical` on each page.
- Provide `app/sitemap.ts`, `app/robots.ts` and `app/manifest.ts`, plus `icon` / `apple-icon` files in `app/`.
- Add JSON-LD structured data (e.g. `Organization`, `LocalBusiness`, `Article`, `BreadcrumbList`, `Product`) in a `<script type="application/ld+json">` where relevant.
- Exactly one `<h1>` per page, followed by a logical `h2` → `h3` order.
- Set `lang` on `<html>` in the root layout.
- Clean, readable, kebab-case URLs (`/services/web-design`), no trailing IDs where a slug works.
- Important content must be in the server-rendered HTML, never loaded only on the client.
- Pages that shouldn't be indexed (thank-you pages, previews) set `robots: { index: false }`.

## Performance

Targets on mobile (Lighthouse / Core Web Vitals): **LCP < 2.5s, INP < 200ms, CLS < 0.1**, Lighthouse Performance, SEO, Accessibility and Best Practices ≥ 95.

- Keep client JavaScript minimal: server components first, small client islands.
- Lazy-load heavy client-only widgets (maps, carousels, charts, video players) with `next/dynamic`, and only where they are used.
- Load third-party scripts with `next/script` and the right `strategy` (`lazyOnload` for analytics/chat widgets). Never block rendering.
- No layout shift: reserve space for images, embeds, ads and fonts.
- Avoid large libraries for small tasks (no full lodash, moment, etc.); prefer native APIs.
- Check bundle size with `@next/bundle-analyzer` when adding dependencies.
- Embedded videos (YouTube etc.) use a lightweight facade (thumbnail + play button) and load the iframe on click.

## Security

- Set security headers in `next.config` (`headers()`): `Content-Security-Policy`, `Strict-Transport-Security`, `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `X-Frame-Options: DENY` (or CSP `frame-ancestors`).
- Treat every Server Action and Route Handler as a public endpoint: validate input, check auth/permissions, never trust IDs coming from the client.
- Never render user or API HTML with `dangerouslySetInnerHTML` unless it is sanitized (JSON-LD with `JSON.stringify` is the exception).
- Auth tokens live in `httpOnly`, `secure`, `sameSite` cookies — never in `localStorage`.
- Never log secrets, tokens or personal data.

## TypeScript rules

- No `any`. Use `unknown` and narrow, or define a proper type.
- Type component props with a named `type` (e.g. `type ButtonProps = {...}`).
- Prefer `type` over `interface` unless declaration merging is needed.
- No non-null assertions (`!`) unless the reason is obvious and commented.
- Enable `noUncheckedIndexedAccess` in `tsconfig.json`.
- Use `as const` for fixed config objects and literal unions for variants.
- Shared types go in `types/`; component-local types stay in the component file.

## Tailwind rules

- Style with Tailwind utility classes only. No inline `style={{}}` and no new CSS files unless there's no utility equivalent.
- Design tokens (colors, fonts, spacing, radii, shadows) live in the Tailwind theme config — don't hard-code hex values like `bg-[#1a1a1a]` in components; add a token instead.
- Mobile-first: write base classes for mobile, then `sm:` / `md:` / `lg:` / `xl:` upward.
- Merge conditional classes with a `cn()` helper (`clsx` + `tailwind-merge`) in `lib/utils.ts`.
- Class order is handled automatically by `prettier-plugin-tailwindcss`.
- Support dark mode with `dark:` variants when the design includes it; avoid a flash of the wrong theme on load.

## Responsive design — every screen size, every platform

The site must look and work perfectly on every device: small phones, large phones, tablets (portrait and landscape), laptops, desktops and ultra-wide monitors, across iOS, Android, Windows, macOS and Linux, in Chrome, Safari, Firefox and Edge.

### Approach

- **Mobile-first, always.** Base classes target the smallest screen (320px); larger screens are added with `sm:` → `md:` → `lg:` → `xl:` → `2xl:`.
- No fixed widths or heights on layout containers (`w-[1200px]`, `h-[600px]`). Use `w-full`, `max-w-*`, `min-h-*`, percentages, `flex` and `grid`.
- Page content sits in a centered container: `mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8`. Large-screen layouts must not stretch endlessly on ultra-wide monitors.
- Prefer layouts that adapt by themselves: `grid-cols-[repeat(auto-fit,minmax(16rem,1fr))]`, `flex-wrap`, `gap-*`.
- Use container queries (`@container`, `@md:`) for reusable components that live in containers of different widths (cards, sidebars).

### Screens to test every change against

| Device | Width |
|---|---|
| Small phone | 320px – 375px |
| Large phone | 390px – 430px |
| Tablet portrait | 768px – 834px |
| Tablet landscape / small laptop | 1024px – 1280px |
| Desktop | 1440px – 1536px |
| Large / ultra-wide | 1920px – 2560px+ |

Also check landscape on phones and browser zoom at 200%.

### Rules

- **No horizontal scroll** at any width. Long words, URLs and code wrap (`break-words`, `min-w-0` on flex children).
- **Fluid typography:** headings scale with `clamp()` (e.g. `text-[clamp(2rem,5vw,4rem)]`) or stepped responsive classes; body text never smaller than 16px on mobile.
- **Touch targets** are at least 44×44px, with enough spacing between them.
- **Hover is an enhancement, never required:** anything shown on hover must also be reachable by tap/focus. Use `hover:` only together with `focus-visible:` and wrap hover-only effects in a `@media (hover: hover)` variant where needed.
- **Navigation** collapses into an accessible mobile menu (separate `"use client"` file) below `md` or `lg`; it traps focus while open, closes on `Esc` and on route change, and locks body scroll.
- **Tables** scroll inside their own `overflow-x-auto` wrapper or turn into stacked cards on mobile.
- **Images & media** are responsive: `next/image` with correct `sizes`, `aspect-*` classes to keep proportions, `object-cover` where cropping is fine.
- **Viewport height:** use `min-h-dvh` / `h-svh` instead of `h-screen` so mobile browser toolbars don't cut content.
- **Safe areas:** respect notches and home indicators with `env(safe-area-inset-*)` on fixed headers, footers and bottom bars (`viewportFit: "cover"` in the `viewport` export).
- **Forms** use the right input types (`type="email"`, `inputMode="numeric"`, `autoComplete`) so mobile keyboards match the field, and inputs use at least 16px text to stop iOS zoom-on-focus.
- **Browser support:** avoid CSS or JS features not supported by current Safari (iOS) unless there is a fallback.
- Export a `viewport` object from the root layout (`width: "device-width", initialScale: 1`, `themeColor`), and never disable user zoom.

## Components

- One component per file, file names in kebab-case (`hero-section.tsx`), component names in PascalCase.
- Use named exports for components; default exports only for `page.tsx`, `layout.tsx` and other Next.js special files.
- Keep components small and focused; extract repeated UI into `components/ui`.
- Build variants with props (e.g. `variant="primary" | "secondary"`), not duplicated components.
- Every data-driven component handles all states: loading (skeleton), empty, error and success.
- UI primitives accept `className` (merged with `cn()`) and forward native props (`...props`).

## Accessibility (WCAG 2.2 AA)

- Semantic HTML (`header`, `nav`, `main`, `section`, `footer`, `button` for actions, `Link` for navigation).
- A "Skip to content" link as the first focusable element.
- Every interactive element is keyboard-accessible with a visible focus style (`focus-visible:`).
- Every form input has a visible `<label>`; placeholders are only format hints.
- Color contrast meets WCAG AA (4.5:1 text, 3:1 large text and UI). Never use color alone to convey meaning.
- Icon-only buttons have an `aria-label`.
- Dynamic messages (form success/errors, toasts) are announced with `aria-live`.
- Respect `prefers-reduced-motion` for animations (`motion-safe:` / `motion-reduce:`).

## Animation

- Prefer CSS transitions/animations via Tailwind; animate only `transform` and `opacity`.
- Keep durations short (150–300ms for UI, up to ~600ms for entrances).
- Heavier animation libraries only in client files and only when needed (ask first).

## Testing

- Unit-test utilities, zod schemas and API functions (mock `fetch`) with Vitest.
- Test interactive client components with Testing Library (behaviour, not implementation).
- Cover critical user flows (navigation, forms, key pages) with Playwright on a mobile and a desktop viewport.
- New bugs get a test that reproduces them before the fix.

## Code quality & Git

- Prettier formats everything (with `prettier-plugin-tailwindcss`); ESLint uses the Next.js config (`next/core-web-vitals` + TypeScript).
- No unused code, imports, `console.log` or commented-out blocks in commits.
- Commit messages follow Conventional Commits: `feat:`, `fix:`, `refactor:`, `style:`, `docs:`, `test:`, `chore:`.
- Small, focused commits; never commit `.env*` files (except `.env.example`), build output or `node_modules`.

## Deployment

- Target platform: Vercel. Every branch gets a preview deployment; `main` deploys to production.
- Environment variables are set per environment (Development / Preview / Production) in the hosting dashboard.
- Production build must have zero TypeScript, ESLint and build warnings.

## Working style

- Read existing code before adding new patterns; match what's already there.
- Make the smallest change that solves the task. Don't refactor unrelated code.
- Don't add dependencies outside the approved list without asking first.
- If a requirement is unclear or conflicts with this file, ask before building.
- Explain any trade-off you make (performance vs. design, etc.) in the summary.

## Definition of done

A task is finished only when all of these are true:

- [ ] `npm run lint`, `npx tsc --noEmit` and `npm run build` pass with no errors or warnings
- [ ] Relevant tests pass (and new logic has tests)
- [ ] Internal links use `next/link`; images use `next/image` with `alt`, sizes and correct `priority`
- [ ] New interactivity lives in a separate `"use client"` file; everything else is server-rendered
- [ ] Data goes through `lib/api` with zod validation and an explicit caching strategy
- [ ] Layout checked at 320px, 768px, 1024px, 1440px and 1920px+ with no horizontal scroll
- [ ] Keyboard navigation and focus states work; contrast is AA
- [ ] Page has metadata, canonical URL and correct heading structure
- [ ] Protected pages and actions call `requireUser()` on the server; user data is never cached; tokens only in `httpOnly` cookies
- [ ] No secrets in client code, no `console.log`, no unused code
- [ ] Short summary of what changed and anything that still needs attention
