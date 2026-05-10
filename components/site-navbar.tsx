"use client"

import Link from "next/link"

import {
  Menu01Icon,
  Search01Icon,
  ShoppingCart02Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useStorefrontCart } from "@/components/storefront-cart-provider"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { storefrontNavbarData } from "@/lib/mock-storefront"

export function SiteNavbar() {
  const { brand, cartLabel, links, searchPlaceholder } = storefrontNavbarData
  const { cartCount } = useStorefrontCart()

  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-4 sm:pt-4">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-3 rounded-[2rem] border border-white/10 bg-[color:var(--color-navbar-surface)] px-4 py-3 text-[color:var(--color-navbar-foreground)] shadow-[0_18px_60px_-28px_rgba(15,10,10,0.9)] backdrop-blur-xl sm:px-5">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <span className="flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/6 text-sm font-semibold uppercase tracking-[0.24em] text-[color:var(--color-navbar-foreground)]">
              {brand.mark}
            </span>
            <span className="flex min-w-0 flex-col">
              <span className="truncate font-heading text-sm font-semibold uppercase tracking-[0.08em] text-[color:var(--color-navbar-foreground)]">
                {brand.name}
              </span>
              <span className="truncate text-[0.7rem] uppercase tracking-[0.18em] text-[color:var(--color-navbar-muted)]">
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

          <div className="hidden flex-1 items-center justify-end gap-3 lg:flex">
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
              asChild
              variant="secondary"
              className="h-11 rounded-full bg-[color:var(--color-navbar-accent)] px-4 text-[color:var(--color-navbar-accent-foreground)] hover:bg-[color:var(--color-navbar-accent-hover)]"
            >
              <Link href="/cart">
                <HugeiconsIcon
                  icon={ShoppingCart02Icon}
                  data-icon="inline-start"
                />
                {cartLabel}
                <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">
                  {cartCount}
                </span>
              </Link>
            </Button>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-full px-3 text-[color:var(--color-navbar-foreground)] hover:bg-white/6"
              aria-label="Open basket"
            >
              <Link href="/cart">
                <HugeiconsIcon icon={ShoppingCart02Icon} />
                <span className="rounded-full bg-[color:var(--color-navbar-accent)] px-2 py-0.5 text-center text-[10px] font-semibold leading-none text-[color:var(--color-navbar-accent-foreground)]">
                  {cartCount}
                </span>
              </Link>
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
                    Jump into the current prototype categories and use mock
                    search.
                  </SheetDescription>
                </SheetHeader>

                <div className="mt-8 flex flex-col gap-6 px-6 pb-6">
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
                    asChild
                    variant="secondary"
                    className="h-11 rounded-full bg-[color:var(--color-navbar-accent)] text-[color:var(--color-navbar-accent-foreground)] hover:bg-[color:var(--color-navbar-accent-hover)]"
                  >
                    <Link href="/cart">
                      <HugeiconsIcon
                        icon={ShoppingCart02Icon}
                        data-icon="inline-start"
                      />
                      {cartLabel}
                      <span className="rounded-full bg-black/15 px-2 py-0.5 text-xs">
                        {cartCount}
                      </span>
                    </Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
