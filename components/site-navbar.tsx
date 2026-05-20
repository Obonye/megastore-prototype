"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

import {
  ArrowRight01Icon,
  Menu01Icon,
  Search01Icon,
  ShoppingCart01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStorefrontCart } from "@/components/storefront-cart-provider"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { storefrontNavbarData } from "@/lib/mock-storefront"

const mobileNavChevronClasses = [
  "text-[#ff6b9a]",
  "text-[#32c7b0]",
  "text-[#ff9f43]",
  "text-[#7c8cff]",
]

const desktopNavUnderlineClasses = [
  "bg-[#ff6b9a]",
  "bg-[#32c7b0]",
  "bg-[#ff9f43]",
  "bg-[#7c8cff]",
]

export function SiteNavbar() {
  const { brand, cartLabel, links, searchPlaceholder } = storefrontNavbarData
  const { cartCount } = useStorefrontCart()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentQuery = searchParams.get("q") ?? ""
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname, searchParams])

  return (
    <header className="sticky top-0 z-50 border-b border-[oklch(0.86_0.03_40)] bg-[rgba(252,248,242,0.9)] backdrop-blur-xl">
      <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-24 items-center justify-between gap-4">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-[oklch(0.43_0.16_170)] text-sm font-semibold tracking-[0.24em] text-[oklch(0.98_0.01_85)] uppercase">
              {brand.mark}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-heading text-lg font-semibold tracking-[-0.04em] text-[oklch(0.23_0.03_30)]">
                {brand.name}
              </span>
              <span className="truncate text-[0.68rem] tracking-[0.22em] text-[oklch(0.51_0.04_45)] uppercase">
                {brand.tagline}
              </span>
            </span>
          </Link>

          <nav className="hidden items-center gap-8 lg:flex">
            {links.map((link, index) => (
              <Link
                key={link.href}
                href={link.href}
                className="group relative pb-2 text-sm font-semibold tracking-[0.16em] text-[oklch(0.4_0.04_40)] uppercase transition-colors hover:text-[oklch(0.23_0.03_30)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
              >
                <span>{link.label}</span>
                <span
                  aria-hidden="true"
                  className={`absolute bottom-0 left-0 h-[3px] w-full origin-left scale-x-0 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
                    desktopNavUnderlineClasses[
                      index % desktopNavUnderlineClasses.length
                    ]
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
            <form action="/products" className="relative w-full max-w-sm">
              <HugeiconsIcon
                icon={Search01Icon}
                className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-[oklch(0.57_0.03_45)]"
              />
              <Input
                name="q"
                aria-label="Search products"
                placeholder={searchPlaceholder}
                defaultValue={currentQuery}
                className="h-12 rounded-full border-[oklch(0.86_0.03_40)] bg-white pl-11 text-[oklch(0.23_0.03_30)] placeholder:text-[oklch(0.57_0.03_45)]"
              />
            </form>

            <Button
              asChild
              variant="ghost"
              className="h-12 rounded-full border border-[oklch(0.86_0.03_40)] bg-white px-4 text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.97_0.02_40)]"
            >
              <Link href="/cart">
                <HugeiconsIcon
                  icon={ShoppingCart01Icon}
                  data-icon="inline-start"
                />
                {cartLabel}
                <span className="rounded-full bg-[oklch(0.68_0.18_350)] px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              </Link>
            </Button>

            <Button
              type="button"
              variant="ghost"
              className="h-12 rounded-full px-5 text-sm font-semibold tracking-[0.16em] text-[oklch(0.23_0.03_30)] uppercase hover:bg-[oklch(0.97_0.02_40)]"
            >
              Login
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-full border border-[oklch(0.86_0.03_40)] px-3 text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.97_0.02_40)]"
              aria-label="Open basket"
            >
              <Link href="/cart">
                <HugeiconsIcon icon={ShoppingCart01Icon} />
                <span className="rounded-full bg-[oklch(0.68_0.18_350)] px-2 py-0.5 text-center text-[10px] leading-none font-semibold text-white">
                  {cartCount}
                </span>
              </Link>
            </Button>

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-[oklch(0.86_0.03_40)] text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.97_0.02_40)]"
                  aria-label="Open navigation menu"
                >
                  <HugeiconsIcon icon={Menu01Icon} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="!inset-0 !left-0 !right-0 !h-dvh !w-screen !max-w-none border-0 bg-[#fffaf6] text-[oklch(0.23_0.03_30)] sm:!inset-y-0 sm:!right-0 sm:!left-auto sm:!h-full sm:!w-[25rem] sm:!max-w-sm sm:border-l sm:border-[oklch(0.86_0.03_40)]"
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pb-5 pt-16 sm:px-6 sm:pb-6 sm:pt-16">
                  <form action="/products" className="relative">
                    <HugeiconsIcon
                      icon={Search01Icon}
                      className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[oklch(0.57_0.03_45)]"
                    />
                    <Input
                      name="q"
                      aria-label="Search products"
                      placeholder={searchPlaceholder}
                      defaultValue={currentQuery}
                      className="h-11 rounded-full border-[oklch(0.86_0.03_40)] bg-white pl-10 text-[oklch(0.23_0.03_30)] placeholder:text-[oklch(0.57_0.03_45)]"
                    />
                  </form>

                  <nav className="mt-6 flex flex-col gap-2">
                    {links.map((link, index) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between gap-4 px-1 py-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-black transition-colors hover:text-[oklch(0.43_0.16_170)]"
                      >
                        <span>{link.label}</span>
                        <HugeiconsIcon
                          icon={ArrowRight01Icon}
                          strokeWidth={2.4}
                          className={`size-5 shrink-0 ${mobileNavChevronClasses[index % mobileNavChevronClasses.length]}`}
                        />
                      </Link>
                    ))}
                  </nav>

                  <div className="mt-auto pt-6">
                    <Button
                      asChild
                      variant="ghost"
                      className="h-12 w-full rounded-full border-0 bg-[#d9dcff] text-base font-semibold text-[oklch(0.23_0.03_30)] hover:bg-[#cdd2ff]"
                    >
                      <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                        <HugeiconsIcon
                          icon={ShoppingCart01Icon}
                          data-icon="inline-start"
                        />
                        {cartLabel}
                        <span className="rounded-full bg-[oklch(0.68_0.18_350)] px-2 py-0.5 text-xs text-white">
                          {cartCount}
                        </span>
                      </Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
