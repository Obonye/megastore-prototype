"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

import {
  ArrowRight,
  ChevronDown,
  Menu,
  Search,
  ShoppingCart,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LoadingIndicator } from "@/components/loading-indicator"
import { useStorefrontCart } from "@/components/storefront-cart-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { storefrontNavbarData } from "@/lib/mock-storefront"

type CurrentUserResponse = {
  user: {
    name: string
  } | null
}

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
  const searchParams = useSearchParams()
  const currentQuery = searchParams?.get("q") ?? ""
  const [customerName, setCustomerName] = useState<string | null>(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  async function readCurrentUser() {
    try {
      const response = await fetch("/api/auth/me")

      if (!response.ok) {
        return null
      }

      const data = (await response.json()) as CurrentUserResponse
      return data.user?.name ?? null
    } catch {
      return null
    }
  }

  async function handleSignOut() {
    await fetch("/api/auth/signout", { method: "POST" })
    setCustomerName(null)
    setIsMenuOpen(false)
    window.location.reload()
  }

  useEffect(() => {
    async function loadCurrentUser() {
      setIsAuthLoading(true)
      setCustomerName(await readCurrentUser())
      setIsAuthLoading(false)
    }

    function handleAuthChanged() {
      void loadCurrentUser()
    }

    void loadCurrentUser()

    window.addEventListener("storefront-auth-changed", handleAuthChanged)

    return () => {
      window.removeEventListener("storefront-auth-changed", handleAuthChanged)
    }
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[oklch(0.86_0.03_40)] bg-[rgba(252,248,242,0.9)] backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-16">
        <div className="flex min-h-16 items-center justify-between gap-6">
          <Link
            href="/"
            className="flex min-w-0 items-center gap-3 rounded-full focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <span className="flex size-11 items-center justify-center rounded-full bg-[oklch(0.43_0.16_170)] text-sm font-semibold tracking-[0.24em] text-[oklch(0.98_0.01_85)] uppercase">
              {brand.mark}
            </span>
            <span className={`flex min-w-0 flex-col transition-all duration-200 ${isSearchOpen ? "hidden" : ""}`}>
              <span className="truncate font-heading text-lg font-semibold tracking-[-0.04em] text-[oklch(0.23_0.03_30)]">
                {brand.name}
              </span>
              <span className="truncate text-[0.68rem] tracking-[0.22em] text-[oklch(0.51_0.04_45)] uppercase">
                {brand.tagline}
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-7 lg:flex">
            {links.map((link, index) => {
              if (link.comingSoon) {
                return (
                  <span
                    key={link.label}
                    className="relative flex items-center gap-1.5 pb-1.5 text-sm font-semibold tracking-[0.06em] text-[oklch(0.65_0.03_40)] uppercase select-none"
                  >
                    {link.label}
                    <span className="rounded-full bg-[oklch(0.92_0.04_170)] px-1.5 py-0.5 text-[0.55rem] font-bold tracking-widest text-[oklch(0.43_0.16_170)] uppercase">
                      Soon
                    </span>
                  </span>
                )
              }

              if (link.items && link.items.length > 0) {
                const isOpen = openDropdown === link.label
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={() => setOpenDropdown(link.label)}
                    onMouseLeave={() => setOpenDropdown(null)}
                  >
                    <button
                      type="button"
                      className="group flex items-center gap-1 pb-1.5 text-sm font-semibold tracking-[0.06em] text-[oklch(0.4_0.04_40)] uppercase transition-colors hover:text-[oklch(0.23_0.03_30)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                      aria-expanded={isOpen}
                    >
                      {link.label}
                      <ChevronDown
                        className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      />
                      <span
                        aria-hidden="true"
                        className={`absolute bottom-0 left-0 h-0.75 w-full origin-left rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                          desktopNavUnderlineClasses[
                            index % desktopNavUnderlineClasses.length
                          ]
                        } ${isOpen ? "scale-x-100" : "scale-x-0"}`}
                      />
                    </button>

                    {isOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                        <div className="min-w-48 overflow-hidden rounded-2xl border border-[oklch(0.86_0.03_40)] bg-[#fffaf6] shadow-xl">
                          {link.items.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              className="flex items-center justify-between px-5 py-3 text-sm font-semibold tracking-[0.14em] text-[oklch(0.4_0.04_40)] uppercase transition-colors hover:bg-[oklch(0.96_0.02_40)] hover:text-[oklch(0.23_0.03_30)]"
                            >
                              {item.label}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              }

              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className="group relative pb-1.5 text-sm font-semibold tracking-[0.06em] text-[oklch(0.4_0.04_40)] uppercase transition-colors hover:text-[oklch(0.23_0.03_30)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  <span>{link.label}</span>
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-0 left-0 h-0.75 w-full origin-left scale-x-0 rounded-full transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100 group-focus-visible:scale-x-100 ${
                      desktopNavUnderlineClasses[
                        index % desktopNavUnderlineClasses.length
                      ]
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="hidden items-center justify-end gap-2 lg:flex">
            {/* Expandable search */}
            <div className="flex items-center">
              {isSearchOpen ? (
                <form
                  action="/products"
                  className="relative flex items-center"
                  onBlur={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                      setIsSearchOpen(false)
                    }
                  }}
                >
                  <Search className="pointer-events-none absolute left-3.5 size-4 text-[oklch(0.57_0.03_45)]" />
                  <Input
                    name="q"
                    aria-label="Search products"
                    placeholder={searchPlaceholder}
                    defaultValue={currentQuery}
                    autoFocus
                    className="h-10 w-56 rounded-full border-[oklch(0.86_0.03_40)] bg-white pl-10 text-sm text-[oklch(0.23_0.03_30)] placeholder:text-[oklch(0.57_0.03_45)]"
                  />
                </form>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  aria-label="Search products"
                  onClick={() => setIsSearchOpen(true)}
                  className="size-10 rounded-full border border-[oklch(0.86_0.03_40)] bg-white text-[oklch(0.57_0.03_45)] hover:bg-[oklch(0.97_0.02_40)] hover:text-[oklch(0.23_0.03_30)]"
                >
                  <Search className="size-4" />
                </Button>
              )}
            </div>

            <Button
              asChild
              variant="ghost"
              className="h-10 rounded-full border border-[oklch(0.86_0.03_40)] bg-white px-4 text-sm font-semibold text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.97_0.02_40)]"
            >
              <Link href="/cart">
                <ShoppingCart data-icon="inline-start" className="size-4" />
                {cartLabel}
                <span className="rounded-full bg-[oklch(0.68_0.18_350)] px-2 py-0.5 text-xs text-white">
                  {cartCount}
                </span>
              </Link>
            </Button>

            {isAuthLoading ? (
              <Button
                type="button"
                disabled
                variant="ghost"
                aria-label="Loading session"
                className="h-10 rounded-full px-4 text-sm font-semibold text-[oklch(0.45_0.03_40)]"
              >
                <LoadingIndicator label="Checking session..." />
              </Button>
            ) : customerName ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="h-10 rounded-full px-4 text-sm font-semibold text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.97_0.02_40)]"
                  >
                    Hi, {customerName}
                    <ChevronDown data-icon="inline-end" className="size-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="border border-[oklch(0.86_0.03_40)] bg-[#fffaf6] text-[oklch(0.23_0.03_30)]"
                >
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer font-semibold text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.96_0.02_40)] focus:bg-[oklch(0.96_0.02_40)] focus:text-[oklch(0.23_0.03_30)]"
                  >
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onSelect={() => void handleSignOut()}
                    className="cursor-pointer font-semibold text-[#8e0048] hover:bg-[#fff0f4] focus:bg-[#fff0f4] focus:text-[#8e0048]"
                  >
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-full px-4 text-sm font-semibold tracking-[0.06em] text-[oklch(0.23_0.03_30)] uppercase hover:bg-[oklch(0.97_0.02_40)]"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 lg:hidden">
            {isAuthLoading ? (
              <Button
                type="button"
                disabled
                variant="ghost"
                aria-label="Loading session"
                className="h-10 rounded-full border border-[oklch(0.86_0.03_40)] px-3 text-xs font-semibold tracking-[0.14em] text-[oklch(0.45_0.03_40)] uppercase"
              >
                <LoadingIndicator label="Loading" />
              </Button>
            ) : customerName ? (
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-full border border-[oklch(0.86_0.03_40)] px-3 text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.97_0.02_40)]"
                aria-label="Open basket"
              >
                <Link href="/cart">
                  <ShoppingCart />
                  <span className="rounded-full bg-[oklch(0.68_0.18_350)] px-2 py-0.5 text-center text-[10px] leading-none font-semibold text-white">
                    {cartCount}
                  </span>
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="ghost"
                className="h-10 rounded-full border border-[oklch(0.86_0.03_40)] px-4 text-xs font-semibold tracking-[0.14em] text-[oklch(0.23_0.03_30)] uppercase hover:bg-[oklch(0.97_0.02_40)]"
              >
                <Link href="/login">Login</Link>
              </Button>
            )}

            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="rounded-full border border-[oklch(0.86_0.03_40)] text-[oklch(0.23_0.03_30)] hover:bg-[oklch(0.97_0.02_40)]"
                  aria-label="Open navigation menu"
                >
                  <Menu />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="!inset-0 !right-0 !left-0 !h-dvh !w-screen !max-w-none border-0 bg-[#fffaf6] text-[oklch(0.23_0.03_30)] sm:!inset-y-0 sm:!right-0 sm:!left-auto sm:!h-full sm:!w-[25rem] sm:!max-w-sm sm:border-l sm:border-[oklch(0.86_0.03_40)]"
              >
                <div className="flex min-h-0 flex-1 flex-col overflow-y-auto px-5 pt-16 pb-5 sm:px-6 sm:pt-16 sm:pb-6">
                  <SheetTitle className="font-heading text-2xl font-semibold tracking-[-0.04em] text-black">
                    Browse the shop
                  </SheetTitle>
                  <SheetDescription className="sr-only">
                    Use this menu to search, browse categories, view your cart,
                    or manage your account.
                  </SheetDescription>
                  <form action="/products" className="relative">
                    <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[oklch(0.57_0.03_45)]" />
                    <Input
                      name="q"
                      aria-label="Search products"
                      placeholder={searchPlaceholder}
                      defaultValue={currentQuery}
                      className="h-11 rounded-full border-[oklch(0.86_0.03_40)] bg-white pl-10 text-[oklch(0.23_0.03_30)] placeholder:text-[oklch(0.57_0.03_45)]"
                    />
                  </form>

                  <nav className="mt-6 flex flex-col gap-1">
                    {links.map((link, index) => {
                      if (link.comingSoon) {
                        return (
                          <div
                            key={link.label}
                            className="flex items-center gap-3 px-1 py-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-black/40"
                          >
                            {link.label}
                            <span className="rounded-full bg-[oklch(0.92_0.04_170)] px-2 py-1 text-[0.6rem] font-bold tracking-[0.12em] text-[oklch(0.43_0.16_170)] uppercase">
                              Soon
                            </span>
                          </div>
                        )
                      }

                      if (link.items && link.items.length > 0) {
                        return (
                          <div key={link.label}>
                            <Link
                              href={link.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="flex items-center justify-between gap-4 px-1 py-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-black transition-colors hover:text-[oklch(0.43_0.16_170)]"
                            >
                              <span>{link.label}</span>
                              <ArrowRight
                                strokeWidth={2.4}
                                className={`size-5 shrink-0 ${mobileNavChevronClasses[index % mobileNavChevronClasses.length]}`}
                              />
                            </Link>
                            <div className="mb-1 ml-1 flex flex-col gap-0 border-l-2 border-[oklch(0.86_0.03_40)] pl-4">
                              {link.items.map((item) => (
                                <Link
                                  key={item.href}
                                  href={item.href}
                                  onClick={() => setIsMenuOpen(false)}
                                  className="py-2 text-base font-semibold tracking-[0.14em] text-[oklch(0.5_0.04_40)] uppercase transition-colors hover:text-[oklch(0.23_0.03_30)]"
                                >
                                  {item.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        )
                      }

                      return (
                        <Link
                          key={link.label}
                          href={link.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center justify-between gap-4 px-1 py-3 text-[1.6rem] font-semibold tracking-[-0.04em] text-black transition-colors hover:text-[oklch(0.43_0.16_170)]"
                        >
                          <span>{link.label}</span>
                          <ArrowRight
                            strokeWidth={2.4}
                            className={`size-5 shrink-0 ${mobileNavChevronClasses[index % mobileNavChevronClasses.length]}`}
                          />
                        </Link>
                      )
                    })}
                  </nav>

                  <div className="mt-auto flex flex-col gap-3 pt-6">
                    {isAuthLoading ? (
                      <div className="rounded-3xl border border-[oklch(0.86_0.03_40)] bg-white p-4 text-sm font-semibold text-[oklch(0.45_0.03_40)]">
                        <LoadingIndicator label="Checking session..." />
                      </div>
                    ) : customerName ? (
                      <div className="rounded-3xl border border-[oklch(0.86_0.03_40)] bg-white p-3">
                        <p className="px-2 pb-2 text-base font-semibold text-[oklch(0.23_0.03_30)]">
                          Hi, {customerName}
                        </p>
                        <Button
                          asChild
                          variant="ghost"
                          className="mb-2 h-11 w-full rounded-full bg-[#f4f1ff] text-base font-semibold text-[#29318e] hover:bg-[#ebe7ff]"
                        >
                          <Link
                            href="/profile"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            Profile
                          </Link>
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => void handleSignOut()}
                          className="h-11 w-full rounded-full bg-[#fff0f4] text-base font-semibold text-[#8e0048] hover:bg-[#ffe2eb]"
                        >
                          Sign out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        asChild
                        variant="ghost"
                        className="h-12 w-full rounded-full border border-[oklch(0.86_0.03_40)] bg-white text-base font-semibold tracking-[0.16em] text-[oklch(0.23_0.03_30)] uppercase hover:bg-[oklch(0.97_0.02_40)]"
                      >
                        <Link
                          href="/login"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Login
                        </Link>
                      </Button>
                    )}
                    {!isAuthLoading && customerName ? (
                      <Button
                        asChild
                        variant="ghost"
                        className="h-12 w-full rounded-full border-0 bg-[#d9dcff] text-base font-semibold text-[oklch(0.23_0.03_30)] hover:bg-[#cdd2ff]"
                      >
                        <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                          <ShoppingCart data-icon="inline-start" />
                          {cartLabel}
                          <span className="rounded-full bg-[oklch(0.68_0.18_350)] px-2 py-0.5 text-xs text-white">
                            {cartCount}
                          </span>
                        </Link>
                      </Button>
                    ) : null}
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
