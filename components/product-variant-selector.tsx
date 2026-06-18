"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart } from "lucide-react"

import { LoadingIndicator } from "@/components/loading-indicator"
import { useStorefrontCart } from "@/components/storefront-cart-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import type { StorefrontProduct } from "@/lib/mock-storefront"

type Props = {
  product: StorefrontProduct
}

export function ProductVariantSelector({ product }: Props) {
  const router = useRouter()
  const { addCartItem } = useStorefrontCart()
  const variants = product.variants ?? []

  const initialSelected = Object.fromEntries(
    variants.map((v) => [v.id, v.defaultValue])
  )
  const [selected, setSelected] = useState<Record<string, string>>(initialSelected)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [message, setMessage] = useState("")

  // Derive active image and price from selections
  let activeImage = product.imageSrc
  let priceModifier = 0

  for (const group of variants) {
    const opt = group.options.find((o) => o.value === selected[group.id])
    if (opt) {
      if (opt.imageSrc) activeImage = opt.imageSrc
      if (opt.priceModifier) priceModifier += opt.priceModifier
    }
  }

  const displayPrice = `P${product.unitPrice + priceModifier}`
  const lineTotal = product.unitPrice + priceModifier

  function handleQuantityChange(value: number) {
    if (Number.isNaN(value) || value < 1) {
      setQuantity(1)
      return
    }

    setQuantity(Math.min(value, product.stock))
  }

  async function handleAddToCart() {
    setMessage("")
    setIsAdding(true)

    try {
      const added = await addCartItem(product, quantity, selected)

      if (added) {
        setMessage("Added to cart.")
        router.push("/cart")
        router.refresh()
      } else {
        setMessage("Unable to add this item to your cart. Please try again.")
      }
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-start">
      {/* Image */}
      <div className="overflow-hidden rounded-[2.4rem] border border-[#e5ddd4] bg-[#f3f2ee]">
        <div className="relative aspect-[4/4.2] overflow-hidden bg-[#f7f0ea]">
          <Image
            key={activeImage}
            src={activeImage}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 56vw"
          />
        </div>
      </div>

      {/* Info panel */}
      <div className="rounded-[2.4rem] border border-[#e5ddd4] bg-[#f3f2ee] p-6 sm:p-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-[#f7edf3] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8e0048]">
            {product.category}
          </span>
          <span className="rounded-full bg-[#ebecef] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6d5544]">
            {product.badge}
          </span>
        </div>

        <h1 className="mt-5 font-heading text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#1a2330]">
          {product.name}
        </h1>

        <p className="mt-5 max-w-[58ch] text-base leading-8 text-[#5b6674]">
          {product.description}
        </p>

        {/* Variant groups */}
        {variants.length > 0 && (
          <div className="mt-7 flex flex-col gap-5">
            {variants.map((group) => {
              const selectedValue = selected[group.id]
              const selectedLabel = group.options.find((o) => o.value === selectedValue)?.label

              return (
                <div key={group.id}>
                  <p className="mb-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
                    {group.label}
                    {selectedLabel && (
                      <span className="ml-2 font-normal normal-case tracking-normal text-[#1a2330]">
                        — {selectedLabel}
                      </span>
                    )}
                  </p>

                  {group.type === "colour" ? (
                    <div className="flex flex-wrap gap-2.5">
                      {group.options.map((opt) => {
                        const isSelected = selected[group.id] === opt.value
                        const fill = opt.color ?? "#cccccc"
                        return isSelected ? (
                          <button
                            key={opt.value}
                            type="button"
                            title={opt.label}
                            aria-label={opt.label}
                            aria-pressed="true"
                            onClick={() => setSelected((prev) => ({ ...prev, [group.id]: opt.value }))}
                            className="size-8 scale-110 overflow-hidden rounded-full border-2 border-[#1a2330] shadow-md transition-all duration-150"
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
                            onClick={() => setSelected((prev) => ({ ...prev, [group.id]: opt.value }))}
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
                        const isSelected = selected[group.id] === opt.value
                        return isSelected ? (
                          <button
                            key={opt.value}
                            type="button"
                            aria-pressed="true"
                            onClick={() => setSelected((prev) => ({ ...prev, [group.id]: opt.value }))}
                            className="rounded-full border border-[#1a2330] bg-[#1a2330] px-4 py-1.5 text-sm font-semibold text-white transition-all duration-150"
                          >
                            {opt.label}
                          </button>
                        ) : (
                          <button
                            key={opt.value}
                            type="button"
                            aria-pressed="false"
                            onClick={() => setSelected((prev) => ({ ...prev, [group.id]: opt.value }))}
                            className="rounded-full border border-[#d7c8b8] bg-[#fffaf6] px-4 py-1.5 text-sm font-semibold text-[#4b3a2e] transition-all duration-150 hover:border-[#1a2330] hover:text-[#1a2330]"
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

        {/* Finish / Stock chips */}
        <div className="mt-7 flex flex-wrap gap-4">
          <div className="rounded-[1.5rem] bg-[#fffaf6] px-4 py-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
              Finish
            </p>
            <p className="mt-1 text-sm font-medium text-[#1a2330]">{product.finish}</p>
          </div>
          <div className="rounded-[1.5rem] bg-[#fffaf6] px-4 py-3">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
              Stock
            </p>
            <p className="mt-1 text-sm font-medium text-[#1a2330]">
              {product.stock <= 5 ? `Only ${product.stock} left` : `${product.stock} in stock`}
            </p>
          </div>
        </div>

        {/* Price + actions */}
        <div className="mt-8 flex flex-col gap-5 border-t border-[#e5ddd4] pt-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_9rem] sm:items-end">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
              Price
            </p>
            <p className="mt-2 font-heading text-4xl font-semibold tracking-[-0.05em] text-[#1a2330]">
              {displayPrice}
            </p>
            <label className="flex flex-col gap-2 sm:row-span-2">
              <span className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
                Quantity
              </span>
              <Input
                aria-label={`Quantity for ${product.name}`}
                type="number"
                min={1}
                max={product.stock}
                value={quantity}
                onChange={(event) => handleQuantityChange(Number(event.target.value))}
                className="h-12 rounded-2xl border-[#d7c8b8] bg-[#fffaf6] text-[#1a2330]"
              />
            </label>
            <p className="text-sm text-[#6d5544] sm:col-span-2">
              Total: <span className="font-semibold text-[#1a2330]">P{(lineTotal * quantity).toFixed(2)}</span>
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:items-end">
            <Button
              type="button"
              aria-label={`Add ${product.name} to cart`}
              disabled={isAdding}
              onClick={() => void handleAddToCart()}
              className="h-12 rounded-full bg-[#ffd3e3] px-5 text-[#1a2330] hover:bg-[#ffc5d8]"
            >
              {isAdding ? (
                <LoadingIndicator label="Adding..." />
              ) : (
                <>
                  <ShoppingCart className="size-5" />
                  Add to cart
                </>
              )}
            </Button>
            {message ? (
              <p
                className={`text-sm font-medium ${message.startsWith("Unable") ? "text-[#8e0048]" : "text-[#146b5d]"}`}
                role="status"
              >
                {message}
              </p>
            ) : null}
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#d7c8b8] bg-[#fbf7f0] px-5 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
            >
              <Link href="/products">Back to catalogue</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
