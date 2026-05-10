# Trending Split Cards Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the current full-bleed trending cards with a consistent split-card layout that uses a top image panel and a warm dark content panel below while preserving the trending section structure and remote-image support.

**Architecture:** Keep the existing `trendingStorefrontItems` data shape and `next/image` usage. Only reshape the presentation in `app/page.tsx` so each card becomes a two-part shell: an upper image frame with inner rounding and a lower solid content block with item name, description, price, and CTA.

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4, Vitest, Testing Library

---

## File Structure

- Modify: `app/page.tsx`
  - Replace the current overlay-based card layout with a split layout per card.
  - Keep the warm off-white section background and existing grid breakpoints.
- Modify: `app/page.test.tsx`
  - Keep the current section and button-count assertions.
  - Add a concrete assertion for the product description and image alt text that remains valid under the new split layout.
- Verify: `lib/mock-storefront.ts`
  - No schema changes required; continue using `imageSrc`.
- Verify: `next.config.mjs`
  - Remote image host allowance remains in place; no new config work required for this redesign.

### Task 1: Update The Test Contract For Split Cards

**Files:**
- Modify: `app/page.test.tsx:24-52`

- [ ] **Step 1: Write the failing test update**

Replace the current test file body with:

```tsx
describe("Home page", () => {
  it("renders the trending items section with 8 add to cart actions", () => {
    render(<Page />)

    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })
    const trendingSectionQueries = within(trendingSection)

    expect(
      trendingSectionQueries.getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
  })

  it("renders a split-card product preview for the first trending item", () => {
    render(<Page />)

    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })
    const trendingSectionQueries = within(trendingSection)

    expect(
      trendingSectionQueries.getByAltText("Angled Scraper Set")
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getByText("Angled Scraper Set")
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getByText(
        "Sharp edges for smoother buttercream finishes."
      )
    ).toBeInTheDocument()
    expect(trendingSectionQueries.getByText("P189")).toBeInTheDocument()
  })
})
```

- [ ] **Step 2: Run the targeted test to verify the red phase**

Run: `npm.cmd test -- app/page.test.tsx`

Expected: FAIL if the current card markup does not yet satisfy the new split-card contract cleanly, or PASS if the existing assertions are already satisfied. If it passes, continue without adding extra failure churn because this task is locking the contract, not forcing artificial failure.

- [ ] **Step 3: Commit the test contract update**

```bash
git add app/page.test.tsx
git commit -m "test: refine trending split card coverage"
```

### Task 2: Replace The Overlay Card Markup With Split Cards

**Files:**
- Modify: `app/page.tsx:64-123`

- [ ] **Step 1: Replace the current trending card markup**

Update the trending cards section to:

```tsx
      <section
        aria-labelledby="trending-items-heading"
        className="bg-[linear-gradient(180deg,#f7f3ec_0%,#f2ede4_100%)] px-6 py-16 sm:px-10 lg:px-14 lg:py-20"
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
              Eight quick-moving bakery picks arranged as structured product
              cards for customers who want to browse visually and add to cart
              fast.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {trendingStorefrontItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1.6rem] bg-[#2d2926] shadow-[0_20px_40px_rgba(63,41,24,0.18)]"
              >
                <div className="relative h-56 overflow-hidden rounded-[1.15rem] border-[8px] border-[#2d2926] border-b-0 bg-stone-100">
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="bg-[#2d2926] px-5 pb-5 pt-4 text-white">
                  <h3 className="font-heading text-[2rem] font-semibold leading-none tracking-tight text-white">
                    {item.name}
                  </h3>
                  <p className="mt-4 min-h-14 text-sm leading-6 text-white/82">
                    {item.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <p className="text-2xl font-bold tracking-tight text-white">
                      {item.price}
                    </p>
                    <Button className="rounded-full bg-[#b6492d] px-4 text-white hover:bg-[#c55335]">
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

- [ ] **Step 2: Keep the import surface unchanged**

The top of `app/page.tsx` should still be:

```tsx
import Image from "next/image"

import { Button } from "@/components/ui/button"
import { trendingStorefrontItems } from "@/lib/mock-storefront"
```

- [ ] **Step 3: Run the targeted homepage test**

Run: `npm.cmd test -- app/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx (2 tests)
```

- [ ] **Step 4: Commit the split-card implementation**

```bash
git add app/page.tsx
git commit -m "feat: switch trending cards to split layout"
```

### Task 3: Verify The Final Redesign

**Files:**
- Verify: `app/page.tsx`
- Verify: `app/page.test.tsx`
- Verify: `next.config.mjs`

- [ ] **Step 1: Run the focused test suite**

Run: `npm.cmd test -- app/page.test.tsx`

Expected:

```text
✓ app/page.test.tsx (2 tests)
```

- [ ] **Step 2: Run lint**

Run: `npm.cmd run lint -- app/page.tsx app/page.test.tsx lib/mock-storefront.ts next.config.mjs`

Expected: Exit code `0` with no ESLint errors.

- [ ] **Step 3: Run typecheck**

Run: `npm.cmd run typecheck`

Expected: Exit code `0`.

- [ ] **Step 4: Review the focused diff**

Run: `git diff -- app/page.tsx app/page.test.tsx next.config.mjs lib/mock-storefront.ts`

Expected: The diff shows the split-card layout update, any matching test refinements, and the preserved remote-image configuration.

- [ ] **Step 5: Commit the verification-clean state**

```bash
git add app/page.tsx app/page.test.tsx next.config.mjs lib/mock-storefront.ts
git commit -m "chore: verify trending split cards redesign"
```

## Self-Review

- **Spec coverage:** The plan covers the consistent split layout, warm off-white section background, separate image and content panels, rounded shell, muted rust CTA, preserved section structure, and verification steps.
- **Placeholder scan:** Each task names exact files, exact commands, and concrete code blocks with no TBDs or deferred implementation notes.
- **Type consistency:** `TrendingStorefrontItem.imageSrc` remains the only product-media field used by the plan, and `app/page.tsx` continues consuming it through `Image`.
