import Link from "next/link"

import { Button } from "@/components/ui/button"

const socialLinks = [
  {
    href: "https://instagram.com",
    label: "Instagram",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    href: "https://facebook.com",
    label: "Facebook",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    href: "https://twitter.com",
    label: "Twitter / X",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    href: "https://youtube.com",
    label: "YouTube",
    svg: (
      <svg
        viewBox="0 0 24 24"
        className="size-4"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
        <polygon
          fill="white"
          points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02"
        />
      </svg>
    ),
  },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-[#fffaf6] py-20">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_10px_10px,rgba(255,107,154,0.55)_0,rgba(255,107,154,0.55)_2px,transparent_2.4px),radial-gradient(circle_at_32px_20px,rgba(50,199,176,0.5)_0,rgba(50,199,176,0.5)_2px,transparent_2.4px),radial-gradient(circle_at_22px_34px,rgba(255,159,67,0.45)_0,rgba(255,159,67,0.45)_2px,transparent_2.4px),radial-gradient(circle_at_44px_42px,rgba(124,140,255,0.42)_0,rgba(124,140,255,0.42)_2px,transparent_2.4px)] [background-size:56px_56px] opacity-70"
      />
      <div className="relative mx-auto grid max-w-[96rem] gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.2fr)_16rem_16rem_16rem] lg:px-10">
        <div>
          <p className="text-sm font-semibold tracking-[0.28em] text-[#8e0048] uppercase">
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

          <div className="mt-8 flex items-center gap-3">
            {socialLinks.map(({ href, label, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex size-10 items-center justify-center rounded-full border border-[#e0d4cc] bg-white text-[#66717f] transition-colors hover:border-[#32c7b0] hover:bg-[#eefbf8] hover:text-[#32c7b0]"
              >
                {svg}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.22em] text-[#2f231b] uppercase">
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
              Ingredients
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
          <h3 className="text-sm font-semibold tracking-[0.22em] text-[#2f231b] uppercase">
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
              href="/#shop-by-need-heading"
              className="transition-colors hover:text-[#00685f]"
            >
              Shop by need
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-[0.22em] text-[#2f231b] uppercase">
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
