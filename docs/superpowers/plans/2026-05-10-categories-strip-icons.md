# Categories Strip Icons Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add small neutral line icons to each homepage category chip while preserving the lightweight horizontal browse-strip behavior.

**Architecture:** Extend the existing category chip mock data with an icon key, then map those keys to a small set of line icons from the installed Hugeicons React package inside `app/page.tsx`. Keep the chip markup simple: icon on the left, label on the right, no extra badge container or active state logic.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library, `@hugeicons/react`

---

## File Structure

- Modify: `lib/mock-storefront.ts`
  - Extend the category chip type with an icon identifier field.
  - Add icon keys to each mock chip entry.
- Modify: `app/page.tsx`
  - Import a small set of neutral line icons from `@hugeicons/react`.
  - Add a local icon map and render the icon before each chip label.
- Modify: `app/page.test.tsx`
  - Keep the existing categories/trending assertions.
  - Add a resilient assertion that the categories links still render their labels after the icon update.

### Task 1: Tighten The Categories Test Contract

**Files:**
- Modify: `app/page.test.tsx:20-60`

- [ ] **Step 1: Update the categories test**

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
    const categoriesQueries = within(categoriesSection)

    expect(
      categoriesQueries.getByRole("heading", {
        name: "Shop Categories",
      })
    ).toBeInTheDocument()
    expect(categoriesQueries.getAllByRole("link")).toHaveLength(8)
    expect(categoriesQueries.getByRole("link", { name: /tools/i })).toBeInTheDocument()
    expect(
      within(trendingSection).getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
  })
```

- [ ] **Step 2: Run the targeted test**

Run: `npm.cmd test -- app/page.test.tsx`

Expected: PASS. The icon work should not require a forced red phase because this task is refining the existing categories contract.

- [ ] **Step 3: Commit the test refinement**

```bash
git add app/page.test.tsx
git commit -m "test: refine categories chip coverage"
```

### Task 2: Add Icon Keys To Category Chip Data

**Files:**
- Modify: `lib/mock-storefront.ts:13-70`

- [ ] **Step 1: Extend the category chip type**

Change the type to:

```ts
export type StorefrontCategoryChip = {
  href: string
  label: string
  icon: string
}
```

- [ ] **Step 2: Add icon keys to the mock data**

Update the array to:

```ts
export const storefrontCategoryChips: StorefrontCategoryChip[] = [
  { href: "/products/tools", label: "Tools", icon: "tools" },
  { href: "/products/fondants", label: "Fondants", icon: "fondants" },
  { href: "/products/cake-boards", label: "Cake Boards", icon: "boards" },
  { href: "/products/decorations", label: "Decorations", icon: "decorations" },
  { href: "/products/packaging", label: "Packaging", icon: "packaging" },
  { href: "/products/edible-colour", label: "Edible Colour", icon: "colour" },
  { href: "/products/sprinkles", label: "Sprinkles", icon: "sprinkles" },
  { href: "/products/baking-basics", label: "Baking Basics", icon: "basics" },
]
```

- [ ] **Step 3: Run the targeted test**

Run: `npm.cmd test -- app/page.test.tsx`

Expected: PASS. The page does not consume `chip.icon` yet, so the current UI contract should remain intact.

- [ ] **Step 4: Commit the icon-key data update**

```bash
git add lib/mock-storefront.ts
git commit -m "feat: add icons to category chip data"
```

### Task 3: Render Neutral Line Icons In The Chips

**Files:**
- Modify: `app/page.tsx:1-120`

- [ ] **Step 1: Add the icon imports**

Update the top of `app/page.tsx` to include:

```tsx
import {
  Cupcake01Icon,
  GiftIcon,
  PackageIcon,
  PaintBrush02Icon,
  Scissors01Icon,
  SparklesIcon,
  SpoonAndForkIcon,
  Store04Icon,
} from "@hugeicons/react"
import Image from "next/image"
```

- [ ] **Step 2: Add a local icon map above the component**

Insert:

```tsx
const categoryChipIcons = {
  tools: Scissors01Icon,
  fondants: Cupcake01Icon,
  boards: Store04Icon,
  decorations: SparklesIcon,
  packaging: PackageIcon,
  colour: PaintBrush02Icon,
  sprinkles: GiftIcon,
  basics: SpoonAndForkIcon,
} as const
```

- [ ] **Step 3: Update the chip rendering**

Replace the chip mapping block with:

```tsx
              {storefrontCategoryChips.map((chip) => {
                const Icon = categoryChipIcons[chip.icon]

                return (
                  <a
                    key={chip.href}
                    href={chip.href}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 py-2 text-sm font-medium whitespace-nowrap text-[#4b3a2e] transition-colors hover:bg-[#f1e6d7] hover:text-[#2f231b]"
                  >
                    <Icon
                      size={16}
                      strokeWidth={1.8}
                      className="shrink-0 text-[#6a5646]"
                    />
                    <span>{chip.label}</span>
                  </a>
                )
              })}
```

- [ ] **Step 4: Run the targeted homepage test**

Run: `npm.cmd test -- app/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx (2 tests)
```

- [ ] **Step 5: Commit the icon rendering**

```bash
git add app/page.tsx
git commit -m "feat: add icons to homepage category chips"
```

### Task 4: Verify The Final Icon Pass

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

Expected: The diff shows the icon-key data, icon imports/map, chip markup update, and the matching test refinement.

- [ ] **Step 5: Commit the verification-clean state**

```bash
git add app/page.tsx app/page.test.tsx lib/mock-storefront.ts
git commit -m "chore: verify category chip icons"
```

## Self-Review

- **Spec coverage:** The plan covers neutral line icons, left-of-label placement, consistent icon sizing, lightweight chip presentation, no extra interaction states, and verification.
- **Placeholder scan:** All steps name exact files, explicit code blocks, and concrete verification commands.
- **Type consistency:** `StorefrontCategoryChip` gains an `icon` key, and `app/page.tsx` resolves that key through a local icon map before rendering.
