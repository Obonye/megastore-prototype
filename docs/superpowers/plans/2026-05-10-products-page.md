# Products Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `View all` action to the homepage trending section and build a server-rendered `/products` page with URL-backed search, category filtering, and pagination over mock storefront data.

**Architecture:** Extend the storefront mock data with a dedicated products catalogue and helper types. Use an App Router page at `app/products/page.tsx` that reads `searchParams`, filters mock products on the server, computes pagination, and renders URL-backed controls and grid links without client-only state.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library

---

## File Structure

- Modify: `lib/mock-storefront.ts`
  - Add a reusable `StorefrontProduct` type and a products catalogue array.
  - Reuse existing category values for the products page filter.
- Modify: `app/page.tsx`
  - Add a `View all` link on the right side of the `Trending Items` section heading row.
- Modify: `app/page.test.tsx`
  - Add an assertion that the homepage renders the `View all` link targeting `/products`.
- Create: `app/products/page.tsx`
  - Server-rendered products page that reads `searchParams`, filters mock data, paginates, and renders search/filter controls plus the product grid.
- Create: `app/products/page.test.tsx`
  - Verify the page renders with defaults and responds to URL-backed search/filter/page parameters.

### Task 1: Lock The Homepage View-All Contract In Tests

**Files:**
- Modify: `app/page.test.tsx:20-65`

- [ ] **Step 1: Update the homepage test**

Change the first test to:

```tsx
  it("renders the categories strip, view-all link, and trending items section", () => {
    render(<Page />)

    const categoriesSection = screen.getByRole("region", {
      name: /shop categories/i,
    })
    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })

    expect(
      within(categoriesSection).getByRole("heading", {
        name: "Shop Categories",
      })
    ).toBeInTheDocument()
    expect(within(categoriesSection).getAllByRole("link")).toHaveLength(8)
    expect(
      within(trendingSection).getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getByRole("link", { name: /view all/i })
    ).toHaveAttribute("href", "/products")
    expect(
      within(trendingSection).getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
  })
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm.cmd test -- app/page.test.tsx`

Expected: FAIL because the homepage does not yet render a `View all` link in the trending section.

- [ ] **Step 3: Commit the failing test**

```bash
git add app/page.test.tsx
git commit -m "test: cover homepage view all link"
```

### Task 2: Add Mock Catalogue Data For The Products Page

**Files:**
- Modify: `lib/mock-storefront.ts:1-220`

- [ ] **Step 1: Add the products catalogue type**

Insert this type near the other storefront types:

```ts
export type StorefrontProduct = {
  id: string
  category: string
  name: string
  description: string
  price: string
  imageSrc: string
}
```

- [ ] **Step 2: Add the products catalogue export**

Add a new export below `trendingStorefrontItems` using at least 12 items so pagination is meaningful. Start with:

```ts
export const storefrontProducts: StorefrontProduct[] = [
  {
    id: "angled-scraper-set",
    category: "Tools",
    name: "Angled Scraper Set",
    description: "Sharp edges for smoother buttercream finishes.",
    price: "P189",
    imageSrc:
      "https://images.unsplash.com/photo-1760445528772-01c57126f275?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "rolled-fondant-ivory",
    category: "Fondants",
    name: "Rolled Fondant Ivory",
    description: "Soft stretch and clean coverage for celebration cakes.",
    price: "P129",
    imageSrc:
      "https://images.unsplash.com/photo-1582180834946-f3d376b18376?q=80&w=688&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: "signature-cake-board-pack",
    category: "Cake Boards",
    name: "Signature Cake Board Pack",
    description: "Rigid boards with a satin finish for polished handoff.",
    price: "P149",
    imageSrc: "/trending/signature-cake-board-pack.svg",
  },
  {
    id: "piping-nozzle-collection",
    category: "Decorations",
    name: "Piping Nozzle Collection",
    description: "Star, petal, and round tips for crisp decorative work.",
    price: "P219",
    imageSrc: "/trending/piping-nozzle-collection.svg",
  },
]
```

Then continue the array with additional mock products spanning existing categories until there are at least 12 total products.

- [ ] **Step 3: Run the existing homepage test**

Run: `npm.cmd test -- app/page.test.tsx`

Expected: FAIL only for the still-missing `View all` link; data changes should not break existing homepage rendering.

- [ ] **Step 4: Commit the products data**

```bash
git add lib/mock-storefront.ts
git commit -m "feat: add products catalogue mock data"
```

### Task 3: Add The Homepage View-All Link

**Files:**
- Modify: `app/page.tsx:120-170`

- [ ] **Step 1: Add `Link` import**

Update the imports to include:

```tsx
import Link from "next/link"
import Image from "next/image"
```

- [ ] **Step 2: Replace the trending header block**

Update the top of the trending section to:

```tsx
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h2
                id="trending-items-heading"
                className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
              >
                Trending Items
              </h2>
            </div>

            <Link
              href="/products"
              className="inline-flex shrink-0 items-center rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 py-2 text-sm font-medium text-[#4b3a2e] transition-colors hover:bg-[#f1e6d7] hover:text-[#2f231b]"
            >
              View all
            </Link>
          </div>
```

- [ ] **Step 3: Run the homepage test**

Run: `npm.cmd test -- app/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx (2 tests)
```

- [ ] **Step 4: Commit the homepage link**

```bash
git add app/page.tsx
git commit -m "feat: add homepage view all link"
```

### Task 4: Build The Server-Rendered Products Page

**Files:**
- Create: `app/products/page.tsx`

- [ ] **Step 1: Create the products page**

Add this file:

```tsx
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { storefrontProducts } from "@/lib/mock-storefront"

const PAGE_SIZE = 8

type ProductsPageProps = {
  searchParams?: Promise<{
    q?: string
    category?: string
    page?: string
  }>
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = (await searchParams) ?? {}
  const query = params.q?.trim().toLowerCase() ?? ""
  const category = params.category?.trim() ?? ""
  const page = Math.max(1, Number(params.page ?? "1") || 1)

  const categories = Array.from(
    new Set(storefrontProducts.map((product) => product.category))
  )

  const filteredProducts = storefrontProducts.filter((product) => {
    const matchesQuery =
      query.length === 0 ||
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)

    const matchesCategory =
      category.length === 0 || product.category === category

    return matchesQuery && matchesCategory
  })

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  )

  const buildHref = (overrides: {
    q?: string
    category?: string
    page?: number
  }) => {
    const next = new URLSearchParams()
    const nextQuery = overrides.q ?? params.q ?? ""
    const nextCategory = overrides.category ?? category
    const nextPage = overrides.page ?? currentPage

    if (nextQuery) next.set("q", nextQuery)
    if (nextCategory) next.set("category", nextCategory)
    if (nextPage > 1) next.set("page", String(nextPage))

    const queryString = next.toString()
    return queryString ? `/products?${queryString}` : "/products"
  }

  return (
    <main className="bg-[linear-gradient(180deg,#f7f3ec_0%,#f2ede4_100%)] px-6 py-10 sm:px-10 lg:px-14 lg:py-14">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-foreground/62">
            Catalogue
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Products
          </h1>
        </div>

        <form action="/products" className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center">
          <input
            type="search"
            name="q"
            defaultValue={params.q ?? ""}
            placeholder="Search products, tools, decorations..."
            className="h-11 w-full rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 text-sm outline-none"
          />

          <select
            name="category"
            defaultValue={category}
            className="h-11 rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 text-sm outline-none"
          >
            <option value="">All categories</option>
            {categories.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <Button type="submit" className="rounded-full bg-[#b6492d] px-5 text-white hover:bg-[#c55335]">
            Apply
          </Button>
        </form>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {paginatedProducts.map((product) => (
            <article
              key={product.id}
              className="overflow-hidden rounded-[1rem] bg-[#2d2926] shadow-[0_20px_40px_rgba(63,41,24,0.18)]"
            >
              <div className="relative h-56 overflow-hidden rounded-[1rem] border-[8px] border-[#2d2926] border-b-0 bg-stone-100">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="bg-[#2d2926] px-5 pb-5 pt-4 text-white">
                <p className="text-xs uppercase tracking-[0.2em] text-white/58">
                  {product.category}
                </p>
                <h2 className="mt-2 font-heading text-[1.25rem] font-semibold leading-none tracking-tight text-white">
                  {product.name}
                </h2>
                <p className="mt-4 min-h-14 text-sm leading-6 text-white/82">
                  {product.description}
                </p>
                <div className="mt-6 flex items-center justify-between gap-3">
                  <p className="text-2xl font-bold tracking-tight text-white">
                    {product.price}
                  </p>
                  <Button className="rounded-full bg-[#b6492d] px-4 text-white hover:bg-[#c55335]">
                    Add to cart
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <Link
            href={buildHref({ page: currentPage - 1 })}
            aria-disabled={currentPage === 1}
            className="rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 py-2 text-sm font-medium text-[#4b3a2e]"
          >
            Previous
          </Link>
          <p className="text-sm text-foreground/68">
            Page {currentPage} of {totalPages}
          </p>
          <Link
            href={buildHref({ page: currentPage + 1 })}
            aria-disabled={currentPage === totalPages}
            className="rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 py-2 text-sm font-medium text-[#4b3a2e]"
          >
            Next
          </Link>
        </div>
      </div>
    </main>
  )
}
```

- [ ] **Step 2: Run typecheck to catch route/component issues early**

Run: `npm.cmd run typecheck`

Expected: PASS or type errors isolated to the new products page implementation.

- [ ] **Step 3: Commit the new route**

```bash
git add app/products/page.tsx
git commit -m "feat: add products catalogue page"
```

### Task 5: Add Route-Aware Tests For The Products Page

**Files:**
- Create: `app/products/page.test.tsx`

- [ ] **Step 1: Add the products page test file**

Create:

```tsx
import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import ProductsPage from "@/app/products/page"

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    priority?: boolean
  }) => {
    void fill
    void priority

    return <img {...props} alt={alt ?? ""} />
  },
}))

describe("Products page", () => {
  it("renders the catalogue controls and grid", async () => {
    render(await ProductsPage({}))

    expect(
      screen.getByRole("heading", { name: "Products" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("searchbox", { name: "" })
    ).toBeInTheDocument()
    expect(screen.getByRole("combobox")).toBeInTheDocument()
    expect(screen.getAllByRole("button", { name: /add to cart/i }).length).toBeGreaterThan(0)
  })

  it("filters products from URL-backed search params", async () => {
    render(
      await ProductsPage({
        searchParams: Promise.resolve({
          q: "fondant",
          category: "Fondants",
          page: "1",
        }),
      })
    )

    expect(screen.getByText("Rolled Fondant Ivory")).toBeInTheDocument()
    expect(screen.queryByText("Angled Scraper Set")).not.toBeInTheDocument()
    expect(screen.getByText(/page 1 of/i)).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the products page test**

Run: `npm.cmd test -- app/products/page.test.tsx`

Expected: FAIL until the route implementation and test details align, then PASS after any necessary minimal fixes.

- [ ] **Step 3: Run both homepage and products tests together**

Run: `npm.cmd test -- app/page.test.tsx app/products/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx
✓ app/products/page.test.tsx
```

- [ ] **Step 4: Commit the test coverage**

```bash
git add app/page.test.tsx app/products/page.test.tsx
git commit -m "test: add products page coverage"
```

### Task 6: Verify The Final Products Flow

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/page.test.tsx`
- Verify: `app/products/page.tsx`
- Verify: `app/products/page.test.tsx`
- Verify: `lib/mock-storefront.ts`

- [ ] **Step 1: Run the focused test suite**

Run: `npm.cmd test -- app/page.test.tsx app/products/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx
✓ app/products/page.test.tsx
```

- [ ] **Step 2: Run lint**

Run: `npm.cmd run lint -- app/page.tsx app/page.test.tsx app/products/page.tsx app/products/page.test.tsx lib/mock-storefront.ts`

Expected: Exit code `0` with no ESLint errors.

- [ ] **Step 3: Run typecheck**

Run: `npm.cmd run typecheck`

Expected: Exit code `0`.

- [ ] **Step 4: Review the focused diff**

Run: `git diff -- app/page.tsx app/page.test.tsx app/products/page.tsx app/products/page.test.tsx lib/mock-storefront.ts`

Expected: The diff shows the homepage `View all` link, mock catalogue data, the new `/products` route, and tests covering URL-backed rendering.

- [ ] **Step 5: Commit the verification-clean state**

```bash
git add app/page.tsx app/page.test.tsx app/products/page.tsx app/products/page.test.tsx lib/mock-storefront.ts
git commit -m "chore: verify products page flow"
```

## Self-Review

- **Spec coverage:** The plan covers the homepage `View all` link, a server-rendered `/products` page, URL-backed search/category/page params, a paginated grid, safe defaults, and verification.
- **Placeholder scan:** Every task includes exact paths, concrete code, exact commands, and expected outcomes with no TBDs.
- **Type consistency:** The plan introduces one `StorefrontProduct` type, uses `storefrontProducts` as the products-page source of truth, and keeps the homepage trending/category data separate.
