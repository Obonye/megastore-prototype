# Trending Cards Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the homepage `Trending Items` section with a warm off-white section background and full-bleed image cards that keep the product copy, price, and `Add to cart` action inside a bottom-gradient overlay.

**Architecture:** Keep the implementation inside the existing homepage and storefront mock-data modules. Replace the current swatch-based card data with local mock image paths, then update the homepage markup so each card is a single `article` with a `next/image` background, a darkening overlay, and bottom-aligned text plus CTA.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library

---

## File Structure

- Modify: `lib/mock-storefront.ts`
  - Replace `badge` and `swatchClassName` in `TrendingStorefrontItem` with `imageSrc`.
  - Point each trending item at a stable mock image path under `public/trending/`.
- Modify: `app/page.tsx`
  - Keep the section heading and grid structure.
  - Replace the nested swatch card layout with a full-bleed image card using `Image fill`, an overlay gradient, and bottom-aligned content.
- Modify: `app/page.test.tsx`
  - Keep the existing section and button assertions.
  - Add a concrete assertion that product images render so the redesign is covered by tests.
- Create: `public/trending/angled-scraper-set.jpg`
- Create: `public/trending/rolled-fondant-ivory.jpg`
- Create: `public/trending/signature-cake-board-pack.jpg`
- Create: `public/trending/piping-nozzle-collection.jpg`
- Create: `public/trending/edible-lustre-duo.jpg`
- Create: `public/trending/turntable-starter-kit.jpg`
- Create: `public/trending/ombre-sprinkle-tin.jpg`
- Create: `public/trending/celebration-ribbon-bundle.jpg`
  - Use simple mock product photography or placeholders sized for card backgrounds.

### Task 1: Lock The Card Contract In Tests

**Files:**
- Modify: `app/page.test.tsx:24-39`

- [ ] **Step 1: Write the failing test**

Replace the current single test with:

```tsx
describe("Home page", () => {
  it("renders a trending items merchandising grid with 8 purchasable image cards", () => {
    render(<Page />)

    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })

    expect(
      within(trendingSection).getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
    expect(
      within(trendingSection).getByAltText("Angled Scraper Set")
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getByText("Sharp edges for smoother buttercream finishes.")
    ).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm test -- app/page.test.tsx`

Expected: FAIL because the current page does not render any product image with alt text `"Angled Scraper Set"`.

- [ ] **Step 3: Commit the failing test**

```bash
git add app/page.test.tsx
git commit -m "test: cover trending product image cards"
```

### Task 2: Replace Swatch Data With Local Image Data

**Files:**
- Modify: `lib/mock-storefront.ts:21-29`
- Modify: `lib/mock-storefront.ts:55-136`
- Create: `public/trending/angled-scraper-set.jpg`
- Create: `public/trending/rolled-fondant-ivory.jpg`
- Create: `public/trending/signature-cake-board-pack.jpg`
- Create: `public/trending/piping-nozzle-collection.jpg`
- Create: `public/trending/edible-lustre-duo.jpg`
- Create: `public/trending/turntable-starter-kit.jpg`
- Create: `public/trending/ombre-sprinkle-tin.jpg`
- Create: `public/trending/celebration-ribbon-bundle.jpg`

- [ ] **Step 1: Update the data type**

Change the trending item type to:

```ts
export type TrendingStorefrontItem = {
  id: string
  category: string
  name: string
  description: string
  price: string
  imageSrc: string
}
```

- [ ] **Step 2: Replace the existing trending item fields with local image paths**

Update the array to:

```ts
export const trendingStorefrontItems: TrendingStorefrontItem[] = [
  {
    id: "angled-scraper-set",
    category: "Tools",
    name: "Angled Scraper Set",
    description: "Sharp edges for smoother buttercream finishes.",
    price: "R189",
    imageSrc: "/trending/angled-scraper-set.jpg",
  },
  {
    id: "rolled-fondant-ivory",
    category: "Fondants",
    name: "Rolled Fondant Ivory",
    description: "Soft stretch and clean coverage for celebration cakes.",
    price: "R129",
    imageSrc: "/trending/rolled-fondant-ivory.jpg",
  },
  {
    id: "signature-cake-board-pack",
    category: "Presentation",
    name: "Signature Cake Board Pack",
    description: "Rigid boards with a satin finish for polished handoff.",
    price: "R149",
    imageSrc: "/trending/signature-cake-board-pack.jpg",
  },
  {
    id: "piping-nozzle-collection",
    category: "Decorating",
    name: "Piping Nozzle Collection",
    description: "Star, petal, and round tips for crisp decorative work.",
    price: "R219",
    imageSrc: "/trending/piping-nozzle-collection.jpg",
  },
  {
    id: "edible-lustre-duo",
    category: "Finishing",
    name: "Edible Lustre Duo",
    description: "Gold and pearl highlights for premium final touches.",
    price: "R99",
    imageSrc: "/trending/edible-lustre-duo.jpg",
  },
  {
    id: "turntable-starter-kit",
    category: "Tools",
    name: "Turntable Starter Kit",
    description: "A stable spin base with the essentials for cleaner icing.",
    price: "R349",
    imageSrc: "/trending/turntable-starter-kit.jpg",
  },
  {
    id: "ombre-sprinkle-tin",
    category: "Decorations",
    name: "Ombre Sprinkle Tin",
    description: "Layered colour blends to brighten cupcakes and cookies.",
    price: "R79",
    imageSrc: "/trending/ombre-sprinkle-tin.jpg",
  },
  {
    id: "celebration-ribbon-bundle",
    category: "Presentation",
    name: "Celebration Ribbon Bundle",
    description: "Texture-rich trims for boxes, boards, and final wrap-up.",
    price: "R109",
    imageSrc: "/trending/celebration-ribbon-bundle.jpg",
  },
]
```

- [ ] **Step 3: Add local mock assets**

Add eight image files under `public/trending/` using the exact filenames above. Use simple product-style placeholder photography with enough contrast for a dark lower overlay.

- [ ] **Step 4: Run the targeted test to confirm it still fails for the intended reason**

Run: `npm test -- app/page.test.tsx`

Expected: FAIL because `app/page.tsx` still references removed `badge` and `swatchClassName` fields or still does not render the new image-based card layout.

- [ ] **Step 5: Commit the data and asset scaffolding**

```bash
git add lib/mock-storefront.ts public/trending
git commit -m "feat: add mock imagery for trending items"
```

### Task 3: Implement The Warm Off-White Section And Full-Bleed Cards

**Files:**
- Modify: `app/page.tsx:64-142`

- [ ] **Step 1: Replace the current trending section markup**

Update the section block to:

```tsx
      <section
        aria-labelledby="trending-items-heading"
        className="bg-[linear-gradient(180deg,#f7f3ec_0%,#f5f1e8_100%)] px-6 py-16 sm:px-10 lg:px-14 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/72">
              Merchandising Edit
            </p>
            <h2
              id="trending-items-heading"
              className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Trending Items
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Eight quick-moving bakery picks arranged as image-led product
              cards for customers who want to browse visually and add to cart
              fast.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {trendingStorefrontItems.map((item) => (
              <article
                key={item.id}
                className="group relative flex min-h-[23rem] overflow-hidden rounded-[2rem] bg-stone-200 shadow-[0_20px_45px_rgba(63,41,24,0.12)] transition-transform duration-200 hover:-translate-y-1"
              >
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(24,18,13,0.08)_0%,rgba(24,18,13,0.18)_38%,rgba(24,18,13,0.86)_100%)]" />

                <div className="relative z-10 mt-auto flex w-full flex-col px-5 pb-5 pt-16 text-white">
                  <h3 className="font-heading text-[1.75rem] font-semibold leading-tight tracking-tight">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                    {item.category}
                  </p>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-white/82">
                    {item.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-2xl font-bold tracking-tight text-white">
                      {item.price}
                    </p>
                    <Button className="bg-white/92 px-4 text-stone-950 hover:bg-white">
                      Add to cart
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
```

- [ ] **Step 2: Verify imports still match the new implementation**

The top of `app/page.tsx` should remain:

```tsx
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { trendingStorefrontItems } from "@/lib/mock-storefront"
```

- [ ] **Step 3: Run the targeted homepage test**

Run: `npm test -- app/page.test.tsx`

Expected: PASS with 1 test passing.

- [ ] **Step 4: Commit the homepage redesign**

```bash
git add app/page.tsx
git commit -m "feat: redesign trending item cards"
```

### Task 4: Verify The Finished Change Set

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/page.test.tsx`
- Verify: `lib/mock-storefront.ts`

- [ ] **Step 1: Run the focused test suite**

Run: `npm test -- app/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx (1 test)
```

- [ ] **Step 2: Run lint**

Run: `npm run lint -- app/page.tsx app/page.test.tsx lib/mock-storefront.ts`

Expected: Exit code `0` with no ESLint errors.

- [ ] **Step 3: Run typecheck**

Run: `npm run typecheck`

Expected: Exit code `0`.

- [ ] **Step 4: Review the diff before handoff**

Run: `git diff -- app/page.tsx app/page.test.tsx lib/mock-storefront.ts`

Expected: The diff shows only the warm off-white section update, full-bleed image card markup, and the mock image data contract change.

- [ ] **Step 5: Commit the verification-clean state**

```bash
git add app/page.tsx app/page.test.tsx lib/mock-storefront.ts public/trending
git commit -m "chore: verify trending cards redesign"
```

## Self-Review

- **Spec coverage:** The plan covers the warm off-white section background, full-bleed card imagery, darker bottom gradient, bottom-aligned content order, compact CTA, retained grid responsiveness, local mock images, and the required verification commands.
- **Placeholder scan:** Removed vague references to remote images and pinned the implementation to local assets and exact filenames.
- **Type consistency:** `imageSrc` is introduced in the type, populated in the mock data, and consumed in `app/page.tsx` with `Image`.
