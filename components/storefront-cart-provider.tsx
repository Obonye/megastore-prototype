"use client"

import Image from "next/image"
import * as React from "react"

import { LoadingIndicator } from "@/components/loading-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import type { VariantGroup } from "@/lib/mock-storefront"

type StorefrontPurchasableProduct = {
  category: string
  description: string
  id: string
  imageSrc: string
  name: string
  price: string
  stock: number
  unitPrice: number
  variants?: VariantGroup[]
}

type StorefrontCartItem = StorefrontPurchasableProduct & {
  cartItemId?: string
  quantity: number
  selectedVariants?: Record<string, string>
  resolvedUnitPrice: number
}

type StorefrontCartApiResponse = {
  items: StorefrontCartItem[]
}

type StorefrontCartContextValue = {
  addCartItem: (
    product: StorefrontPurchasableProduct,
    quantity: number,
    selectedVariants?: Record<string, string>
  ) => Promise<boolean>
  cartCount: number
  cartItems: StorefrontCartItem[]
  cartSubtotal: number
  closeProductSheet: () => void
  isCartLoading: boolean
  openProductSheet: (
    product: StorefrontPurchasableProduct,
    selectedVariants?: Record<string, string>
  ) => void
  pendingCartItemIds: string[]
  removeCartItem: (productId: string) => void
  updateCartItemQuantity: (productId: string, quantity: number) => void
}

const StorefrontCartContext = React.createContext<
  StorefrontCartContextValue | undefined
>(undefined)

function formatStorefrontPrice(value: number) {
  return `P${value.toFixed(2)}`
}

function clampQuantity(value: number, max: number) {
  if (Number.isNaN(value) || value < 1) return 1
  return Math.min(value, max)
}

function getCartItemLimit(item: StorefrontCartItem) {
  return Math.max(item.stock, 1)
}

function getVariantPriceModifier(
  variants: VariantGroup[] | undefined,
  selected: Record<string, string>
) {
  if (!variants) return 0
  return variants.reduce((total, group) => {
    const opt = group.options.find((o) => o.value === selected[group.id])
    return total + (opt?.priceModifier ?? 0)
  }, 0)
}

function defaultVariantSelections(variants?: VariantGroup[]): Record<string, string> {
  if (!variants) return {}
  return Object.fromEntries(variants.map((v) => [v.id, v.defaultValue]))
}

function redirectToLogin() {
  const next = `${window.location.pathname}${window.location.search}`
  window.location.assign(`/login?next=${encodeURIComponent(next)}`)
}

export function StorefrontCartProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const [activeProduct, setActiveProduct] =
    React.useState<StorefrontPurchasableProduct | null>(null)
  const [cartItems, setCartItems] = React.useState<StorefrontCartItem[]>([])
  const [isSheetOpen, setIsSheetOpen] = React.useState(false)
  const [isAddingFromSheet, setIsAddingFromSheet] = React.useState(false)
  const [isCartLoading, setIsCartLoading] = React.useState(true)
  const [pendingCartItemIds, setPendingCartItemIds] = React.useState<Set<string>>(
    () => new Set()
  )
  const [quantity, setQuantity] = React.useState(1)
  const [sheetVariants, setSheetVariants] = React.useState<Record<string, string>>({})
  const [areSheetVariantsLocked, setAreSheetVariantsLocked] = React.useState(false)
  const cartItemUpdateVersions = React.useRef(new Map<string, number>())

  const applyCartResponse = React.useCallback(async (response: Response, redirectOnUnauthorized = true) => {
    if (response.status === 401) {
      if (redirectOnUnauthorized) {
        redirectToLogin()
      } else {
        setCartItems([])
      }
      return false
    }

    if (!response.ok) return false

    const data = (await response.json()) as Partial<StorefrontCartApiResponse>
    setCartItems(Array.isArray(data.items) ? [...data.items] : [])
    return true
  }, [])

  const refreshCart = React.useCallback(async () => {
    setIsCartLoading(true)
    try {
      await applyCartResponse(await fetch("/api/cart"), false)
    } catch {
      setCartItems([])
    } finally {
      setIsCartLoading(false)
    }
  }, [applyCartResponse])

  const setCartItemPending = React.useCallback((cartItemId: string, pending: boolean) => {
    setPendingCartItemIds((currentIds) => {
      const nextIds = new Set(currentIds)

      if (pending) {
        nextIds.add(cartItemId)
      } else {
        nextIds.delete(cartItemId)
      }

      return nextIds
    })
  }, [])

  const ensureSignedIn = React.useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        redirectToLogin()
        return false
      }

      const data = (await response.json()) as { user: unknown | null }
      if (!data.user) {
        redirectToLogin()
        return false
      }

      return true
    } catch {
      redirectToLogin()
      return false
    }
  }, [])

  React.useEffect(() => {
    function handleAuthChanged() {
      void refreshCart()
    }

    const hydrateCartId = window.setTimeout(() => void refreshCart(), 0)
    window.addEventListener("storefront-auth-changed", handleAuthChanged)

    return () => {
      window.clearTimeout(hydrateCartId)
      window.removeEventListener("storefront-auth-changed", handleAuthChanged)
    }
  }, [refreshCart])

  const cartCount = React.useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity, 0),
    [cartItems]
  )
  const cartSubtotal = React.useMemo(
    () => cartItems.reduce((total, item) => total + item.quantity * item.resolvedUnitPrice, 0),
    [cartItems]
  )

  const activeCartItem = React.useMemo(() => {
    if (!activeProduct) return null
    return cartItems.find((item) => item.id === activeProduct.id) ?? null
  }, [activeProduct, cartItems])

  const remainingStock = activeProduct
    ? Math.max(activeProduct.stock - (activeCartItem?.quantity ?? 0), 0)
    : 0

  const variantPriceModifier = React.useMemo(
    () => getVariantPriceModifier(activeProduct?.variants, sheetVariants),
    [activeProduct?.variants, sheetVariants]
  )

  const resolvedUnitPrice = activeProduct
    ? activeProduct.unitPrice + variantPriceModifier
    : 0
  const totalPrice = resolvedUnitPrice * quantity

  const addCartItem = React.useCallback(
    async (
      product: StorefrontPurchasableProduct,
      quantity: number,
      selectedVariants: Record<string, string> = defaultVariantSelections(product.variants)
    ) => {
      if (!(await ensureSignedIn())) return false

      try {
        const response = await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product.id,
            quantity: clampQuantity(quantity, product.stock),
            selectedVariants,
          }),
        })

        return applyCartResponse(response)
      } catch {
        return false
      }
    },
    [applyCartResponse, ensureSignedIn]
  )

  const closeProductSheet = React.useCallback(() => {
    setIsSheetOpen(false)
  }, [])

  const openProductSheet = React.useCallback(
    async (
      product: StorefrontPurchasableProduct,
      selectedVariants?: Record<string, string>
    ) => {
      if (!(await ensureSignedIn())) return

      setActiveProduct(product)
      setSheetVariants(selectedVariants ?? defaultVariantSelections(product.variants))
      setAreSheetVariantsLocked(Boolean(selectedVariants))
      setQuantity(1)
      setIsSheetOpen(true)
    },
    [ensureSignedIn]
  )

  const handleSheetOpenChange = React.useCallback((open: boolean) => {
    setIsSheetOpen(open)
    if (!open) {
      setActiveProduct(null)
      setSheetVariants({})
      setAreSheetVariantsLocked(false)
      setQuantity(1)
    }
  }, [])

  const handleQuantityChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (!remainingStock) {
        setQuantity(1)
        return
      }
      setQuantity(clampQuantity(Number(event.target.value), remainingStock))
    },
    [remainingStock]
  )

  const handleAddToCart = React.useCallback(async () => {
    if (!activeProduct || remainingStock === 0) return

    const nextQuantity = clampQuantity(quantity, remainingStock)

    setIsAddingFromSheet(true)

    try {
      if (await addCartItem(activeProduct, nextQuantity, sheetVariants)) {
        handleSheetOpenChange(false)
      }
    } finally {
      setIsAddingFromSheet(false)
    }
  }, [
    addCartItem,
    activeProduct,
    handleSheetOpenChange,
    quantity,
    remainingStock,
    sheetVariants,
  ])

  const updateCartItemQuantity = React.useCallback(
    (cartItemId: string, quantity: number) => {
      const item = cartItems.find((currentItem) => currentItem.cartItemId === cartItemId)
      const nextQuantity = item ? clampQuantity(quantity, getCartItemLimit(item)) : quantity
      const updateVersion = (cartItemUpdateVersions.current.get(cartItemId) ?? 0) + 1

      cartItemUpdateVersions.current.set(cartItemId, updateVersion)
      setCartItemPending(cartItemId, true)

      setCartItems((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.cartItemId === cartItemId
            ? { ...currentItem, quantity: nextQuantity }
            : currentItem
        )
      )

      void fetch(`/api/cart/${cartItemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: nextQuantity }),
      })
        .then((response) => {
          if (!response.ok && cartItemUpdateVersions.current.get(cartItemId) === updateVersion) {
            void refreshCart()
          }
        })
        .catch(() => {
          if (cartItemUpdateVersions.current.get(cartItemId) === updateVersion) {
            void refreshCart()
          }
        })
        .finally(() => {
          if (cartItemUpdateVersions.current.get(cartItemId) === updateVersion) {
            setCartItemPending(cartItemId, false)
          }
        })
    },
    [cartItems, refreshCart, setCartItemPending]
  )

  const removeCartItem = React.useCallback((cartItemId: string) => {
    setCartItemPending(cartItemId, true)
    void fetch(`/api/cart/${cartItemId}`, { method: "DELETE" })
      .then(applyCartResponse)
      .catch(() => refreshCart())
      .finally(() => setCartItemPending(cartItemId, false))
  }, [applyCartResponse, refreshCart, setCartItemPending])

  const pendingCartItemIdList = React.useMemo(
    () => Array.from(pendingCartItemIds),
    [pendingCartItemIds]
  )

  const contextValue = React.useMemo<StorefrontCartContextValue>(
    () => ({
      addCartItem,
      cartCount,
      cartSubtotal,
      cartItems,
      closeProductSheet,
      isCartLoading,
      openProductSheet,
      pendingCartItemIds: pendingCartItemIdList,
      removeCartItem,
      updateCartItemQuantity,
    }),
    [
      addCartItem,
      cartCount,
      cartItems,
      cartSubtotal,
      closeProductSheet,
      isCartLoading,
      openProductSheet,
      pendingCartItemIdList,
      removeCartItem,
      updateCartItemQuantity,
    ]
  )

  const activeVariants = areSheetVariantsLocked ? [] : (activeProduct?.variants ?? [])
  const lockedVariantLabels = areSheetVariantsLocked
    ? (activeProduct?.variants ?? []).flatMap((group) => {
        const selectedValue = sheetVariants[group.id]
        const selectedOption = group.options.find((option) => option.value === selectedValue)

        return selectedOption ? [`${group.label}: ${selectedOption.label}`] : []
      })
    : []

  return (
    <StorefrontCartContext.Provider value={contextValue}>
      {children}

      <Sheet open={isSheetOpen} onOpenChange={handleSheetOpenChange}>
        <SheetContent
          side="right"
          className="w-full border-[#ddcfbe] bg-[#fbf7f0] text-[#2f231b] sm:max-w-[28rem]"
        >
          {activeProduct ? (
            <>
              <div className="relative h-56 overflow-hidden border-b border-[#eadbca] bg-stone-100">
                <Image
                  src={activeProduct.imageSrc}
                  alt={activeProduct.name}
                  fill
                  className="object-cover"
                />
              </div>

              <SheetHeader className="gap-3 border-b border-[#eadbca] px-6 py-5">
                <SheetTitle className="text-2xl font-semibold text-[#2f231b]">
                  {activeProduct.name}
                </SheetTitle>
                <SheetDescription className="text-sm leading-6 text-[#6d5544]">
                  {activeProduct.description}
                </SheetDescription>
                <div className="flex flex-wrap gap-3 text-sm text-[#6d5544]">
                  <span>In stock: {activeProduct.stock}</span>
                  {activeCartItem ? (
                    <span>Already in cart: {activeCartItem.quantity}</span>
                  ) : null}
                </div>
              </SheetHeader>

              <div className="flex flex-1 flex-col gap-5 overflow-y-auto px-6 py-6">

                {/* Variant selectors */}
                {lockedVariantLabels.length > 0 ? (
                  <div className="rounded-2xl border border-[#eadbca] bg-white p-4 text-sm text-[#6d5544]">
                    <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
                      Selected options
                    </p>
                    <p className="font-medium text-[#2f231b]">
                      {lockedVariantLabels.join(" · ")}
                    </p>
                  </div>
                ) : null}

                {activeVariants.length > 0 && (
                  <div className="flex flex-col gap-5 rounded-2xl border border-[#eadbca] bg-white p-4">
                    {activeVariants.map((group) => {
                      const selectedValue = sheetVariants[group.id]
                      const selectedLabel = group.options.find((o) => o.value === selectedValue)?.label

                      return (
                        <div key={group.id}>
                          <p className="mb-2.5 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
                            {group.label}
                            {selectedLabel && (
                              <span className="ml-2 font-normal normal-case tracking-normal text-[#2f231b]">
                                — {selectedLabel}
                              </span>
                            )}
                          </p>

                          {group.type === "colour" ? (
                            <div className="flex flex-wrap gap-2">
                              {group.options.map((opt) => {
                                const isSelected = selectedValue === opt.value
                                const fill = opt.color ?? "#cccccc"
                                return isSelected ? (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    title={opt.label}
                                    aria-label={opt.label}
                                    aria-pressed="true"
                                    onClick={() => setSheetVariants((prev) => ({ ...prev, [group.id]: opt.value }))}
                                    className="size-8 scale-110 overflow-hidden rounded-full border-2 border-[#2f231b] shadow-md transition-all duration-150"
                                  >
                                    <svg viewBox="0 0 1 1" className="size-full" aria-hidden="true"><rect width="1" height="1" fill={fill} /></svg>
                                  </button>
                                ) : (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    title={opt.label}
                                    aria-label={opt.label}
                                    aria-pressed="false"
                                    onClick={() => setSheetVariants((prev) => ({ ...prev, [group.id]: opt.value }))}
                                    className="size-8 overflow-hidden rounded-full border-2 border-transparent transition-all duration-150 hover:scale-105 hover:border-[#aaa]"
                                  >
                                    <svg viewBox="0 0 1 1" className="size-full" aria-hidden="true"><rect width="1" height="1" fill={fill} /></svg>
                                  </button>
                                )
                              })}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-2">
                              {group.options.map((opt) => {
                                const isSelected = selectedValue === opt.value
                                return isSelected ? (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    aria-pressed="true"
                                    onClick={() => setSheetVariants((prev) => ({ ...prev, [group.id]: opt.value }))}
                                    className="rounded-full border border-[#2f231b] bg-[#2f231b] px-3 py-1 text-sm font-semibold text-white transition-all duration-150"
                                  >
                                    {opt.label}
                                  </button>
                                ) : (
                                  <button
                                    key={opt.value}
                                    type="button"
                                    aria-pressed="false"
                                    onClick={() => setSheetVariants((prev) => ({ ...prev, [group.id]: opt.value }))}
                                    className="rounded-full border border-[#d7c8b8] bg-[#fbf7f0] px-3 py-1 text-sm font-semibold text-[#4b3a2e] transition-all duration-150 hover:border-[#2f231b] hover:text-[#2f231b]"
                                  >
                                    {opt.label}
                                  </button>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Quantity / price */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-[#4b3a2e]">Quantity</span>
                    <Input
                      aria-label="Quantity"
                      type="number"
                      min={1}
                      max={Math.max(remainingStock, 1)}
                      value={quantity}
                      onChange={handleQuantityChange}
                      disabled={remainingStock === 0}
                      className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]"
                    />
                  </label>

                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-[#4b3a2e]">Unit price</span>
                    <Input
                      aria-label="Unit price"
                      readOnly
                      value={formatStorefrontPrice(resolvedUnitPrice)}
                      className="h-12 rounded-2xl border-[#ddcfbe] bg-[#f4ede3] text-[#2f231b]"
                    />
                  </label>

                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-[#4b3a2e]">Total</span>
                    <Input
                      aria-label="Total"
                      readOnly
                      value={formatStorefrontPrice(totalPrice)}
                      className="h-12 rounded-2xl border-[#ddcfbe] bg-[#f4ede3] text-[#2f231b]"
                    />
                  </label>
                </div>

                {remainingStock === 0 ? (
                  <p className="rounded-2xl border border-[#ddcfbe] bg-[#f4ede3] px-4 py-3 text-sm text-[#6d5544]">
                    You already have the full available stock of this item in your cart.
                  </p>
                ) : (
                  <p className="text-sm text-[#6d5544]">
                    You can add up to {remainingStock} more{" "}
                    {remainingStock === 1 ? "unit" : "units"} from this sheet.
                  </p>
                )}
              </div>

              <SheetFooter className="mt-auto flex-row justify-end gap-3 border-t border-[#eadbca] px-6 py-5">
                <SheetClose asChild>
                  <Button
                    type="button"
                    variant="outline"
                    className="rounded-full border-[#ddcfbe] bg-transparent px-5 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
                  >
                    Cancel
                  </Button>
                </SheetClose>
                <Button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={remainingStock === 0 || isAddingFromSheet}
                  className="rounded-full bg-[#ffd3e3] px-5 text-[#1a2330] hover:bg-[#ffc5d8]"
                >
                  {isAddingFromSheet ? (
                    <LoadingIndicator label="Adding..." />
                  ) : (
                    "Add to cart"
                  )}
                </Button>
              </SheetFooter>
            </>
          ) : null}
        </SheetContent>
      </Sheet>
    </StorefrontCartContext.Provider>
  )
}

export function useStorefrontCart() {
  const context = React.useContext(StorefrontCartContext)

  if (!context) {
    throw new Error("useStorefrontCart must be used within StorefrontCartProvider")
  }

  return context
}

export { formatStorefrontPrice }
export type { StorefrontCartItem, StorefrontPurchasableProduct }
