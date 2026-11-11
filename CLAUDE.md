# TBLC — working notes for Claude

Next.js App Router + TypeScript + Tailwind v4 storefront. All commerce data comes from the **z-commerce** GraphQL API (Zerror's MERN backend); this repo never stores products, carts or orders itself.

## Conventions

- **Pages stay thin.** `src/app/**/page.tsx` sets metadata (`createMetadata` / `createPageMetadata` from `src/lib/seo.ts`) and composes components. UI lives in `src/components/<area>/`.
- **Server first.** Catalogue data is fetched in Server Components through `src/services/catalog.ts` — never call Apollo directly from a page. Client Components (`"use client"`) only where there's interaction: cart, auth, forms, checkout.
- **GraphQL.** Every operation lives in `src/graphql/` as a `TypedDocumentNode`, using field strings from `fields.ts` (not fragments). Add new operations there and export them from `src/graphql/index.ts`; add matching types in `src/types/zcommerce.ts`.
- **z-commerce rules.** Requests need `dbtoken` (added by the Apollo links). Signed-in carts use `token`, guests use `guestId`. Strip `__typename` before sending query results back as input (`stripTypename`). Variants are matched by their `selectedOptions` names (`findVariant`).
- **State.** Zustand stores in `src/store/` — persisted ones use `skipHydration` and are rehydrated by `StoreHydration`; check `useAuthStore(s => s.hydrated)` before trusting "signed out". Use `toast.*` from `src/store/toast-store.ts` for notifications.
- **Styling.** Use tokens from `src/styles/globals.css` (`text-ink`, `bg-surface`, `py-section`, `px-gutter`, `gap-grid`, `container`, `text-eyebrow`, `font-primary`…). Don't hard-code colours or add one-off spacing scales. Headings use the h1–h6 scale; one `h1` per page.
- **Type scale.** Font size, line height and tracking come only from the type utilities in `globals.css` (`text-display`, `text-title-xl/lg/–/sm`, `text-lead`, `text-body-lg`, `text-body`, `text-caption`, `text-small`, `text-cta`, `text-eyebrow`, plus `text-flourish` / `text-count`). Never use Tailwind's `text-xl`, `text-[…rem]`, `leading-*` or `tracking-*`; if a size is missing, add it to the scale in `globals.css`.
- **Real 404s.** Pages that call `notFound()` (e.g. `/shop/[slug]`) must not sit under a `loading.tsx` — the streamed loading state commits a 200 status before the page can 404. That's why the shop listing's skeleton lives in the `shop/(listing)/` route group.
- **Images** go through `next/image` with `mediaUrl()`; static files go in the matching `public/` folder (see `public/README.md`).
- **Animation — use the data attributes.** Scroll reveals are global: add an attribute and `<Motion />` (`src/lib/motion.ts`) wires it up on load, navigation and client renders. `data-heading-effect` (masked lines; `="words"`), `data-text-effect` (paragraph lines rise out of a blur), `data-fade` (`="down"`/`="in"`), `data-stagger` (children in sequence, row by row), `data-slide-in` (children slide in from the right screen edge and back out when scrolled above; `="left"`), `data-image-reveal` (wipe + zoom settle on a media wrapper; `="zoom"` for a page's main/LCP image), `data-parallax` (on an image inside a clipped wrapper), `data-counter`, `data-draw` (hairlines), plus `data-delay="0.2"`. Text effects split the DOM: only on static text, not on flex containers or paragraphs with links (use `data-fade`), and key the element by its text if it can change while mounted. Hovers are global too: `Button` labels roll, `link-line` draws an underline. Only write bespoke GSAP for one-off interactions — import from `@/lib/gsap`, use `useGSAP` with a scope and wrap motion in `gsap.matchMedia()` with `prefers-reduced-motion: no-preference`. Scrollable overlays need `data-lenis-prevent`.

## Before finishing a change

Run `npm run check` (typecheck + lint + Prettier) and fix what it reports.
