import Link from "next/link"

import { Button } from "@/components/ui/button"

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#fffaf6] py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_10px_10px,rgba(255,107,154,0.55)_0,rgba(255,107,154,0.55)_2px,transparent_2.4px),radial-gradient(circle_at_32px_20px,rgba(50,199,176,0.5)_0,rgba(50,199,176,0.5)_2px,transparent_2.4px),radial-gradient(circle_at_22px_34px,rgba(255,159,67,0.45)_0,rgba(255,159,67,0.45)_2px,transparent_2.4px),radial-gradient(circle_at_44px_42px,rgba(124,140,255,0.42)_0,rgba(124,140,255,0.42)_2px,transparent_2.4px)] [background-size:56px_56px]"
      />
      <div className="relative mx-auto grid max-w-[96rem] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_16rem_16rem_16rem] lg:px-10">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8e0048]">
            The Mega Store
          </p>
          <h2 className="mt-4 font-heading text-4xl font-semibold tracking-[-0.06em] text-[#1a2330]">
            Baking Supply Co.
          </h2>
          <p className="mt-4 max-w-[36rem] text-base leading-8 text-[#66717f]">
            Premium tools, ingredients, packaging, and finishing details for
            home bakers, boutique decorators, and busy kitchen teams.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              asChild
              className="rounded-full bg-[#1a2330] px-5 text-white hover:bg-[#111923]"
            >
              <Link href="/products">Shop all products</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#d7b4c4] bg-[#f8e7ee] px-5 text-[#4b3a2e] hover:bg-[#f3dbe5] hover:text-[#2f231b]"
            >
              <Link href="/products?sort=price-desc">Current offers</Link>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f231b]">
            Shop
          </h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#66717f]">
            <Link
              href="/products"
              className="transition-colors hover:text-[#00685f]"
            >
              All products
            </Link>
            <Link
              href="/products?category=Tools"
              className="transition-colors hover:text-[#00685f]"
            >
              Tools
            </Link>
            <Link
              href="/products?category=Packaging"
              className="transition-colors hover:text-[#00685f]"
            >
              Packaging
            </Link>
            <Link
              href="/products?category=Decorations"
              className="transition-colors hover:text-[#00685f]"
            >
              Decorations
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f231b]">
            Explore
          </h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#66717f]">
            <Link
              href="/#shop-categories-heading"
              className="transition-colors hover:text-[#00685f]"
            >
              Shop by category
            </Link>
            <Link
              href="/#trending-items-heading"
              className="transition-colors hover:text-[#00685f]"
            >
              Trending items
            </Link>
            <Link
              href="/#shop-by-need-heading"
              className="transition-colors hover:text-[#00685f]"
            >
              Shop by need
            </Link>
            <Link
              href="/#best-sellers-heading"
              className="transition-colors hover:text-[#00685f]"
            >
              Best sellers
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-[#2f231b]">
            Info
          </h3>
          <div className="mt-5 flex flex-col gap-3 text-sm text-[#66717f]">
            <Link
              href="/#why-shop-with-us-heading"
              className="transition-colors hover:text-[#00685f]"
            >
              Why shop with us
            </Link>
            <Link
              href="/products"
              className="transition-colors hover:text-[#00685f]"
            >
              Delivery and pickup
            </Link>
            <Link
              href="/products"
              className="transition-colors hover:text-[#00685f]"
            >
              Terms of use
            </Link>
            <Link
              href="/products"
              className="transition-colors hover:text-[#00685f]"
            >
              Privacy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
