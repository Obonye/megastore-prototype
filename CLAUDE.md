# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server with Turbopack
npm run build        # Production build
npm run lint         # ESLint
npm run format       # Prettier (all .ts/.tsx files)
npm run typecheck    # tsc --noEmit
npm run test         # Vitest (single run)
npm run test:watch   # Vitest (watch mode)
```

To run a single test file: `npx vitest run <path>` — e.g. `npx vitest run app/cart/page.test.tsx`.

## Architecture

**The Mega Store** is a baking supply e-commerce storefront (Next.js 16 App Router, React 19, TypeScript strict mode). All product and storefront data is currently mock data in [lib/mock-storefront.ts](lib/mock-storefront.ts) — there is no backend.

### Routing

| Route | File |
|-------|------|
| `/` | [app/page.tsx](app/page.tsx) |
| `/products` | [app/products/page.tsx](app/products/page.tsx) |
| `/products/[slug]` | [app/products/[slug]/page.tsx](app/products/[slug]/page.tsx) |
| `/cart` | [app/cart/page.tsx](app/cart/page.tsx) |

### Global wrappers (app/layout.tsx)

The root layout wraps the entire app with:
1. `ThemeProvider` — light/dark mode via `next-themes`
2. `StorefrontCartProvider` — cart state (items, quantities, open product sheet) via React Context

### Key components

- **[components/storefront-cart-provider.tsx](components/storefront-cart-provider.tsx)** — The single source of truth for cart state. Provides `StorefrontCartContext` consumed by navbar cart icon, product detail sheet, and cart page.
- **[components/site-navbar.tsx](components/site-navbar.tsx)** — Top navigation with brand, links, search, and cart trigger.
- Product detail content is rendered in a Sheet (drawer) triggered by `StorefrontAddToCartTrigger`, not a separate route.

### Styling

- **Tailwind v4** via `@tailwindcss/postcss` — uses the new CSS-first config (no `tailwind.config.js`).
- **shadcn/ui** components live in [components/ui/](components/ui/) and were added with `npx shadcn@latest add`. Add new ones the same way.
- Icon library is **HugeIcons** (`hugeicons-react`), not Lucide.
- Custom `cn()` utility is in [lib/utils.ts](lib/utils.ts) (wraps `clsx` + `tailwind-merge`).
- Color palette uses warm cream backgrounds (`#fffaf6`) with pink/teal/orange/purple accents defined as CSS variables in oklch color space.

### Testing

Tests use **Vitest + React Testing Library**. Each page and key component has a co-located `.test.tsx` file. Tests mock `next/image` and use accessibility queries (`getByRole`, `screen`, `within`).
