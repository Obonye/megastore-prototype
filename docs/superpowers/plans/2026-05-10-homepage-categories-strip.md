# Homepage Categories Strip Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a lightweight, horizontally scrollable categories chip strip between the homepage hero and the `Trending Items` section using static mock links.

**Architecture:** Extend the storefront mock data with a small categories list, then render it directly in `app/page.tsx` as a single nowrap horizontal chip row placed before the trending section. Keep the behavior purely presentational and update the homepage test to verify the strip renders expected mock links.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library

---

## File Structure

- Modify: `lib/mock-storefront.ts`
  - Add a lightweight `StorefrontCategoryChip` type and a `storefrontCategoryChips` mock data array.
- Modify: `app/page.tsx`
  - Import the new categories array.
  - Insert a categories section between the hero and trending cards.
  - Render the chips in a single horizontally scrollable row with static mock links.
- Modify: `app/page.test.tsx`
  - Add a test assertion for the categories section label and mock link count.

### Task 1: Add Test Coverage For The Categories Strip

**Files:**
- Modify: `app/page.test.tsx:24-55`

- [ ] **Step 1: Update the homepage test**

Change the first test to:

```tsx
  it("renders the categories strip and trending items section", () => {
    render(<Page />)

    const categoriesSection = screen.getByRole("region", {
      name: /shop categories/i,
    })
    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })

    expect(
      within(categoriesSection).getByRole("heading", { name: "Shop Categories" })
    ).toBeInTheDocument()
    expect(within(categoriesSection).getAllByRole("link")).toHaveLength(8)
    expect(
      within(trendingSection).getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
  })
```

- [ ] **Step 2: Run the targeted test to verify it fails**

Run: `npm.cmd test -- app/page.test.tsx`

Expected: FAIL because the homepage does not yet render a `Shop Categories` region or its links.

- [ ] **Step 3: Commit the failing test**

```bash
git add app/page.test.tsx
git commit -m "test: cover homepage categories strip"
```

### Task 2: Add Mock Category Chip Data

**Files:**
- Modify: `lib/mock-storefront.ts:1-120`

- [ ] **Step 1: Add the categories chip type**

Insert this type near the other storefront types:

```ts
export type StorefrontCategoryChip = {
  href: string
  label: string
}
```

- [ ] **Step 2: Add the mock categories array**

Add this export below `storefrontNavbarData`:

```ts
export const storefrontCategoryChips: StorefrontCategoryChip[] = [
  { href: "/products/tools", label: "Tools" },
  { href: "/products/fondants", label: "Fondants" },
  { href: "/products/cake-boards", label: "Cake Boards" },
  { href: "/products/decorations", label: "Decorations" },
  { href: "/products/packaging", label: "Packaging" },
  { href: "/products/edible-colour", label: "Edible Colour" },
  { href: "/products/sprinkles", label: "Sprinkles" },
  { href: "/products/baking-basics", label: "Baking Basics" },
]
```

- [ ] **Step 3: Run the targeted test to confirm it still fails for the intended reason**

Run: `npm.cmd test -- app/page.test.tsx`

Expected: FAIL because `app/page.tsx` still does not render the categories strip.

- [ ] **Step 4: Commit the mock data**

```bash
git add lib/mock-storefront.ts
git commit -m "feat: add homepage category chip data"
```

### Task 3: Render The Categories Strip On The Homepage

**Files:**
- Modify: `app/page.tsx:1-120`

- [ ] **Step 1: Update imports**

Change the imports at the top of the file to:

```tsx
import Image from "next/image"

import { Button } from "@/components/ui/button"
import {
  storefrontCategoryChips,
  trendingStorefrontItems,
} from "@/lib/mock-storefront"
```

- [ ] **Step 2: Insert the categories section before Trending Items**

Add this section between the hero section and the trending section:

```tsx
      <section
        aria-labelledby="shop-categories-heading"
        className="bg-[linear-gradient(180deg,#f7f3ec_0%,#f3eee6_100%)] px-6 py-8 sm:px-10 lg:px-14 lg:py-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2
              id="shop-categories-heading"
              className="font-heading text-2xl font-semibold tracking-tight text-foreground sm:text-3xl"
            >
              Shop Categories
            </h2>
          </div>

          <div className="mt-5 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {storefrontCategoryChips.map((chip) => (
                <a
                  key={chip.href}
                  href={chip.href}
                  className="rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 py-2 text-sm font-medium whitespace-nowrap text-[#4b3a2e] transition-colors hover:bg-[#f1e6d7] hover:text-[#2f231b]"
                >
                  {chip.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
```

- [ ] **Step 3: Run the targeted homepage test**

Run: `npm.cmd test -- app/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx (2 tests)
```

- [ ] **Step 4: Commit the homepage categories strip**

```bash
git add app/page.tsx
git commit -m "feat: add homepage categories strip"
```

### Task 4: Verify The Final Categories Strip

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/page.test.tsx`
- Verify: `lib/mock-storefront.ts`

- [ ] **Step 1: Run the focused test suite**

Run: `npm.cmd test -- app/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx (2 tests)
```

- [ ] **Step 2: Run lint**

Run: `npm.cmd run lint -- app/page.tsx app/page.test.tsx lib/mock-storefront.ts`

Expected: Exit code `0` with no ESLint errors.

- [ ] **Step 3: Run typecheck**

Run: `npm.cmd run typecheck`

Expected: Exit code `0`.

- [ ] **Step 4: Review the focused diff**

Run: `git diff -- app/page.tsx app/page.test.tsx lib/mock-storefront.ts`

Expected: The diff shows the new category chip data, the categories strip section, and the matching homepage test update.

- [ ] **Step 5: Commit the verification-clean state**

```bash
git add app/page.tsx app/page.test.tsx lib/mock-storefront.ts
git commit -m "chore: verify homepage categories strip"
```

## Self-Review

- **Spec coverage:** The plan covers placement before trending items, warm off-white integration, a single horizontal chip row, static mock links, no selected state, and verification.
- **Placeholder scan:** The plan specifies exact file edits, concrete code blocks, and exact commands with expected outcomes.
- **Type consistency:** `storefrontCategoryChips` uses a dedicated `StorefrontCategoryChip` type and is consumed directly by `app/page.tsx`.
