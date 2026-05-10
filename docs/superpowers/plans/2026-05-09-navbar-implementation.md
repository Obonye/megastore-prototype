# Floating Navbar Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and ship a shared responsive floating navbar for the baking supply storefront using shadcn primitives and mock prototype data.

**Architecture:** The navbar will be a single shared client component rendered from the root layout. Static mock storefront data will live in a small `lib` module so the UI stays realistic without inventing backend contracts, and shadcn `Input` plus `Sheet` will handle the search field and mobile navigation overlay.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, shadcn/ui radix components, Hugeicons, Vitest, React Testing Library

---

## File Structure

- Create: `components/site-navbar.tsx`
- Create: `lib/mock-storefront.ts`
- Create: `components/site-navbar.test.tsx`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`
- Modify: `app/globals.css`
- Modify: `package.json`
- Modify: `components/ui/input.tsx`
- Modify: `components/ui/sheet.tsx`

## Data Shape

Use mock prototype data instead of live integrations.

```ts
export type StorefrontNavLink = {
  href: string
  label: string
}

export type StorefrontBrand = {
  mark: string
  name: string
  tagline: string
}

export type StorefrontNavbarData = {
  brand: StorefrontBrand
  links: StorefrontNavLink[]
  searchPlaceholder: string
  cartLabel: string
  cartCount: number
}
```

### Task 1: Add Dependencies And shadcn Primitives

**Files:**
- Modify: `package.json`
- Create: `components/ui/input.tsx`
- Create: `components/ui/sheet.tsx`

- [ ] **Step 1: Add test scripts and UI test dependencies**

Update `package.json` scripts and dev dependencies:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "format": "prettier --write \"**/*.{ts,tsx}\"",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.7.0",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^14.6.1",
    "@types/node": "^25.5.0",
    "@types/react": "^19.2.14",
    "@types/react-dom": "^19.2.3",
    "eslint": "^9.39.4",
    "eslint-config-next": "16.1.7",
    "jsdom": "^26.1.0",
    "postcss": "^8",
    "prettier": "^3.8.1",
    "prettier-plugin-tailwindcss": "^0.7.2",
    "tailwindcss": "^4.2.1",
    "typescript": "^5.9.3",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 2: Install the new packages**

Run:

```powershell
npm install
```

Expected: install completes successfully and `package-lock.json` updates with Vitest and Testing Library packages.

- [ ] **Step 3: Add shadcn `input`**

Run:

```powershell
& npx.cmd shadcn@latest add input
```

Expected: `components/ui/input.tsx` is created and uses the project alias `@/`.

- [ ] **Step 4: Add shadcn `sheet`**

Run:

```powershell
& npx.cmd shadcn@latest add sheet
```

Expected: `components/ui/sheet.tsx` is created and includes the required `SheetTitle` support for accessible sheet content.

- [ ] **Step 5: Review generated UI files**

Confirm `components/ui/input.tsx` and `components/ui/sheet.tsx` follow the current project conventions:

```ts
import { cn } from "@/lib/utils"
```

and:

```ts
import * as SheetPrimitive from "@radix-ui/react-dialog"
```

Expected: no hardcoded alternate aliases and no missing imports.

- [ ] **Step 6: Commit**

Run:

```powershell
git add package.json package-lock.json components/ui/input.tsx components/ui/sheet.tsx
git commit -m "chore: add navbar UI primitives and test dependencies"
```

### Task 2: Add Mock Storefront Data And Test Harness

**Files:**
- Create: `lib/mock-storefront.ts`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `components/site-navbar.test.tsx`

- [ ] **Step 1: Add the mock storefront data module**

Create `lib/mock-storefront.ts`:

```ts
export type StorefrontNavLink = {
  href: string
  label: string
}

export type StorefrontBrand = {
  mark: string
  name: string
  tagline: string
}

export type StorefrontNavbarData = {
  brand: StorefrontBrand
  links: StorefrontNavLink[]
  searchPlaceholder: string
  cartLabel: string
  cartCount: number
}

export const storefrontNavbarData: StorefrontNavbarData = {
  brand: {
    mark: "WB",
    name: "Whisk & Board",
    tagline: "Baking Supply Co.",
  },
  links: [
    { href: "/tools", label: "Tools" },
    { href: "/fondants", label: "Fondants" },
    { href: "/cake-boards", label: "Cake Boards" },
    { href: "/decorations", label: "Decorations" },
  ],
  searchPlaceholder: "Search tools, fondants, boards...",
  cartLabel: "Cart",
  cartCount: 2,
}
```

- [ ] **Step 2: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config"
import path from "node:path"

export default defineConfig({
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
```

- [ ] **Step 3: Add test setup**

Create `vitest.setup.ts`:

```ts
import "@testing-library/jest-dom/vitest"
```

- [ ] **Step 4: Write the failing navbar test**

Create `components/site-navbar.test.tsx`:

```tsx
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { SiteNavbar } from "@/components/site-navbar"

describe("SiteNavbar", () => {
  it("renders the storefront brand, search, nav links, and cart", () => {
    render(<SiteNavbar />)

    expect(screen.getByText("Whisk & Board")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("Search tools, fondants, boards...")
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Tools" })).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /cart/i })).toBeInTheDocument()
  })

  it("opens the mobile menu from the menu trigger", async () => {
    const user = userEvent.setup()

    render(<SiteNavbar />)

    await user.click(screen.getByRole("button", { name: /open navigation menu/i }))

    expect(screen.getByText("Browse the shop")).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Fondants" })).toBeInTheDocument()
  })
})
```

- [ ] **Step 5: Run the test to verify it fails**

Run:

```powershell
npm test -- components/site-navbar.test.tsx
```

Expected: FAIL with a module resolution error because `@/components/site-navbar` does not exist yet.

- [ ] **Step 6: Commit**

Run:

```powershell
git add lib/mock-storefront.ts vitest.config.ts vitest.setup.ts components/site-navbar.test.tsx
git commit -m "test: add navbar mock data and failing coverage"
```

### Task 3: Implement The Shared Floating Navbar

**Files:**
- Create: `components/site-navbar.tsx`

- [ ] **Step 1: Create the client component shell**

Create `components/site-navbar.tsx`:

```tsx
"use client"

import Link from "next/link"

import { HugeiconsIcon } from "@hugeicons/react"
import {
  Menu01Icon,
  Search01Icon,
  ShoppingCart02Icon,
} from "@hugeicons/core-free-icons"

import { storefrontNavbarData } from "@/lib/mock-storefront"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function SiteNavbar() {
  const { brand, cartCount, cartLabel, links, searchPlaceholder } =
    storefrontNavbarData

  return (
    <header className="sticky top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 rounded-[2rem] border border-white/10 bg-[color:color-mix(in_oklch,var(--color-card)_82%,transparent)] px-4 py-3 text-[color:var(--color-navbar-foreground)] shadow-[0_18px_60px_-28px_rgba(15,10,10,0.9)] backdrop-blur-xl sm:px-5">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-semibold tracking-[0.24em] text-[color:var(--color-navbar-foreground)] uppercase">
              {brand.mark}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-heading text-sm font-semibold tracking-[0.08em] text-[color:var(--color-navbar-foreground)] uppercase">
                {brand.name}
              </span>
              <span className="truncate text-[0.7rem] tracking-[0.18em] text-[color:var(--color-navbar-muted)] uppercase">
                {brand.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-4 py-2 text-sm text-[color:var(--color-navbar-muted)] transition-colors hover:bg-white/6 hover:text-[color:var(--color-navbar-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 md:flex">
            <div className="relative w-full max-w-xs">
              <HugeiconsIcon
                icon={Search01Icon}
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[color:var(--color-navbar-muted)]"
              />
              <Input
                aria-label="Search products"
                placeholder={searchPlaceholder}
                className="h-11 rounded-full border-white/10 bg-white/6 pl-10 text-[color:var(--color-navbar-foreground)] placeholder:text-[color:var(--color-navbar-muted)]"
              />
            </div>

            <Button
              type="button"
              variant="secondary"
              className="h-11 rounded-full bg-[color:var(--color-navbar-accent)] px-4 text-[color:var(--color-navbar-accent-foreground)] hover:bg-[color:var(--color-navbar-accent-hover)]"
            >
              <HugeiconsIcon icon={ShoppingCart02Icon} data-icon="inline-start" />
              {cartLabel}
              <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">
                {cartCount}
              </span>
            </Button>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full text-[color:var(--color-navbar-foreground)] hover:bg-white/6"
              aria-label={cartLabel}
            >
              <HugeiconsIcon icon={ShoppingCart02Icon} />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-[color:var(--color-navbar-foreground)] hover:bg-white/6"
                  aria-label="Open navigation menu"
                >
                  <HugeiconsIcon icon={Menu01Icon} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="border-white/10 bg-[color:var(--color-navbar-surface)] text-[color:var(--color-navbar-foreground)]"
              >
                <SheetHeader>
                  <SheetTitle>Browse the shop</SheetTitle>
                  <SheetDescription className="text-[color:var(--color-navbar-muted)]">
                    Jump into the current prototype categories and use mock search.
                  </SheetDescription>
                </SheetHeader>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Fill the mobile sheet body**

Update the `SheetContent` body inside `components/site-navbar.tsx`:

```tsx
<div className="mt-8 flex flex-col gap-6">
  <div className="relative">
    <HugeiconsIcon
      icon={Search01Icon}
      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[color:var(--color-navbar-muted)]"
    />
    <Input
      aria-label="Search products"
      placeholder={searchPlaceholder}
      className="h-11 rounded-full border-white/10 bg-white/6 pl-10 text-[color:var(--color-navbar-foreground)] placeholder:text-[color:var(--color-navbar-muted)]"
    />
  </div>

  <nav className="flex flex-col gap-2">
    {links.map((link) => (
      <Link
        key={link.href}
        href={link.href}
        className="rounded-2xl px-4 py-3 text-sm text-[color:var(--color-navbar-muted)] transition-colors hover:bg-white/6 hover:text-[color:var(--color-navbar-foreground)]"
      >
        {link.label}
      </Link>
    ))}
  </nav>

  <Button
    type="button"
    variant="secondary"
    className="h-11 rounded-full bg-[color:var(--color-navbar-accent)] text-[color:var(--color-navbar-accent-foreground)] hover:bg-[color:var(--color-navbar-accent-hover)]"
  >
    <HugeiconsIcon icon={ShoppingCart02Icon} data-icon="inline-start" />
    {cartLabel}
    <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">
      {cartCount}
    </span>
  </Button>
</div>
```

- [ ] **Step 3: Run the component test**

Run:

```powershell
npm test -- components/site-navbar.test.tsx
```

Expected: PASS for both render and mobile menu tests.

- [ ] **Step 4: Commit**

Run:

```powershell
git add components/site-navbar.tsx
git commit -m "feat: implement shared floating storefront navbar"
```

### Task 4: Integrate The Navbar Into The App Shell And Prototype Page

**Files:**
- Modify: `app/layout.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Render the navbar from the root layout**

Update `app/layout.tsx`:

```tsx
import { Geist, Geist_Mono, Public_Sans } from "next/font/google"

import "./globals.css"
import { SiteNavbar } from "@/components/site-navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })

const publicSans = Public_Sans({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        publicSans.variable,
        geistHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <div className="min-h-svh bg-background">
            <SiteNavbar />
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Replace the placeholder landing page with a prototype stage**

Update `app/page.tsx`:

```tsx
export default function Page() {
  return (
    <main className="min-h-svh px-4 pb-16 pt-10 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-7xl flex-col gap-10 rounded-[2.5rem] border border-border/60 bg-[radial-gradient(circle_at_top,rgba(166,108,88,0.16),transparent_42%),linear-gradient(180deg,rgba(23,18,18,0.96),rgba(10,8,8,0.98))] px-6 py-16 text-primary-foreground shadow-[0_30px_100px_-45px_rgba(0,0,0,0.95)] sm:px-10">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-primary/80">
            Client Prototype
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight sm:text-5xl">
            Bake with tools that deserve the spotlight.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/76">
            This placeholder canvas exists to show the floating navbar in a realistic storefront setting while the rest of the prototype is still under construction.
          </p>
        </div>
      </section>
    </main>
  )
}
```

- [ ] **Step 3: Run the test suite again**

Run:

```powershell
npm test
```

Expected: PASS with the navbar test suite green after layout integration.

- [ ] **Step 4: Commit**

Run:

```powershell
git add app/layout.tsx app/page.tsx
git commit -m "feat: mount navbar in shared app shell"
```

### Task 5: Apply The Boutique Navbar Theme And Final Verification

**Files:**
- Modify: `app/globals.css`

- [ ] **Step 1: Add navbar-specific color tokens**

Append these variables inside `:root` in `app/globals.css`:

```css
    --navbar-surface: oklch(0.19 0.01 20 / 0.76);
    --navbar-foreground: oklch(0.95 0.02 70);
    --navbar-muted: oklch(0.84 0.02 60);
    --navbar-accent: oklch(0.72 0.09 52);
    --navbar-accent-foreground: oklch(0.18 0.02 24);
    --navbar-accent-hover: oklch(0.76 0.08 52);
```

and inside `.dark`:

```css
    --navbar-surface: oklch(0.17 0.01 18 / 0.82);
    --navbar-foreground: oklch(0.95 0.02 70);
    --navbar-muted: oklch(0.82 0.02 60);
    --navbar-accent: oklch(0.69 0.09 50);
    --navbar-accent-foreground: oklch(0.18 0.02 24);
    --navbar-accent-hover: oklch(0.74 0.08 50);
```

- [ ] **Step 2: Expose the tokens in `@theme inline`**

Add to the `@theme inline` block:

```css
    --color-navbar-surface: var(--navbar-surface);
    --color-navbar-foreground: var(--navbar-foreground);
    --color-navbar-muted: var(--navbar-muted);
    --color-navbar-accent: var(--navbar-accent);
    --color-navbar-accent-foreground: var(--navbar-accent-foreground);
    --color-navbar-accent-hover: var(--navbar-accent-hover);
```

- [ ] **Step 3: Give the page a slightly warmer base**

Update the `body` rule:

```css
  body {
    @apply bg-background text-foreground;
    background-image:
      radial-gradient(circle at top, rgba(166, 108, 88, 0.12), transparent 26%),
      linear-gradient(180deg, rgba(255, 255, 255, 0.02), rgba(255, 255, 255, 0));
  }
```

- [ ] **Step 4: Run quality checks**

Run:

```powershell
npm run lint
npm run typecheck
npm test
```

Expected:

```text
lint: no errors
typecheck: no errors
test: all tests passed
```

- [ ] **Step 5: Manual responsive verification**

Run:

```powershell
npm run dev
```

Check in the browser:

```text
- mobile width around 390px: logo, cart icon, and menu trigger fit without touching screen edges
- tablet width around 768px: floating shell remains inset and search stays readable
- desktop width 1280px+: nav links center correctly and search/cart align on the right
- scrolling keeps the navbar sticky with top offset preserved
```

- [ ] **Step 6: Commit**

Run:

```powershell
git add app/globals.css components/site-navbar.tsx app/layout.tsx app/page.tsx lib/mock-storefront.ts components/site-navbar.test.tsx vitest.config.ts vitest.setup.ts package.json package-lock.json components/ui/input.tsx components/ui/sheet.tsx
git commit -m "feat: add responsive floating storefront navbar"
```

## Self-Review

- Spec coverage: shared component, root layout integration, responsiveness, floating offsets, off-black translucent styling, shadcn usage, accessibility, mock prototype data, and verification are all mapped to tasks above.
- Placeholder scan: no `TODO`, `TBD`, or unresolved references remain.
- Type consistency: `StorefrontNavbarData`, `SiteNavbar`, token names, and file paths match across all tasks.
