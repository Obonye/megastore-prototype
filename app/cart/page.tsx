"use client"

import Image from "next/image"
import Link from "next/link"
import * as React from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  formatStorefrontPrice,
  useStorefrontCart,
} from "@/components/storefront-cart-provider"

export default function CartPage() {
  const {
    cartCount,
    cartItems,
    cartSubtotal,
    removeCartItem,
    updateCartItemQuantity,
  } = useStorefrontCart()

  const estimatedTax = cartSubtotal * 0.08
  const orderTotal = cartSubtotal + estimatedTax

  const summaryContent = (
    <>
      <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#2f231b]">
        Order summary
      </h2>
      <div className="mt-6 space-y-4 text-sm text-[#6d5544]">
        <div className="flex items-center justify-between gap-3">
          <span>Items</span>
          <span className="font-medium text-[#2f231b]">{cartCount}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Subtotal</span>
          <span className="font-medium text-[#2f231b]">
            {formatStorefrontPrice(cartSubtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Estimated tax</span>
          <span className="font-medium text-[#2f231b]">
            {formatStorefrontPrice(estimatedTax)}
          </span>
        </div>
      </div>

      <div className="mt-6 border-t border-[#eadbca] pt-6">
        <div className="flex items-center justify-between gap-3">
          <span className="text-base font-medium text-[#4b3a2e]">Total</span>
          <span className="font-heading text-2xl font-semibold text-[#2f231b]">
            {formatStorefrontPrice(orderTotal)}
          </span>
        </div>
      </div>

      <Button className="mt-6 h-12 w-full rounded-full bg-[#b6492d] text-white hover:bg-[#c55335]">
        Proceed to checkout
      </Button>
      <Button
        asChild
        variant="outline"
        className="mt-3 h-12 w-full rounded-full border-[#ddcfbe] bg-transparent text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
      >
        <Link href="/products">Continue shopping</Link>
      </Button>
    </>
  )

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#f7f3ec_0%,#efe6da_100%)] px-6 pb-32 pt-28 sm:px-10 lg:px-14 lg:pb-20 lg:pt-32">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8b6b56]">
            Review your basket
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-[#2f231b] sm:text-5xl">
            Cart
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6d5544] sm:text-lg">
            Check quantities, remove items, and confirm the current mock order
            before checkout.
          </p>
        </div>

        {cartItems.length > 0 ? (
          <div className="mt-10 grid gap-8 xl:grid-cols-[minmax(0,1.6fr)_minmax(20rem,0.85fr)]">
            <div className="space-y-4">
              {cartItems.map((item) => {
                const lineSubtotal = item.quantity * item.unitPrice

                return (
                  <article
                    key={item.id}
                    className="grid gap-5 rounded-[1.75rem] border border-[rgba(120,87,62,0.14)] bg-[#fbf7f0] p-5 shadow-[0_18px_45px_rgba(63,41,24,0.08)] md:grid-cols-[10rem_minmax(0,1fr)]"
                  >
                    <div className="relative h-44 overflow-hidden rounded-[1.25rem] bg-stone-100">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>

                    <div className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="max-w-xl">
                          <p className="text-xs uppercase tracking-[0.22em] text-[#8b6b56]">
                            {item.category}
                          </p>
                          <h2 className="mt-2 font-heading text-2xl font-semibold tracking-tight text-[#2f231b]">
                            {item.name}
                          </h2>
                          <p className="mt-3 text-sm leading-6 text-[#6d5544]">
                            {item.description}
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => removeCartItem(item.id)}
                          className="rounded-full border-[#ddcfbe] bg-transparent px-4 text-[#7a4e3b] hover:bg-[#f3e6d8] hover:text-[#5a3629]"
                        >
                          Remove
                        </Button>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <label className="flex flex-col gap-2">
                          <span className="text-sm font-medium text-[#4b3a2e]">
                            Quantity
                          </span>
                          <Input
                            aria-label={`Quantity for ${item.name}`}
                            type="number"
                            min={1}
                            max={item.stock}
                            value={item.quantity}
                            onChange={(event) =>
                              updateCartItemQuantity(
                                item.id,
                                Number(event.target.value)
                              )
                            }
                            className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]"
                          />
                        </label>

                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-medium text-[#4b3a2e]">
                            Unit price
                          </span>
                          <div className="flex h-12 items-center rounded-2xl border border-[#ddcfbe] bg-[#f4ede3] px-4 text-sm text-[#2f231b]">
                            {formatStorefrontPrice(item.unitPrice)}
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-medium text-[#4b3a2e]">
                            Subtotal
                          </span>
                          <div className="flex h-12 items-center rounded-2xl border border-[#ddcfbe] bg-[#f4ede3] px-4 text-sm font-semibold text-[#2f231b]">
                            {formatStorefrontPrice(lineSubtotal)}
                          </div>
                        </div>
                      </div>

                      <p className="text-sm text-[#6d5544]">
                        {item.stock} units available in stock.
                      </p>
                    </div>
                  </article>
                )
              })}

              <aside className="rounded-[1.75rem] border border-[rgba(120,87,62,0.14)] bg-[#fbf7f0] p-6 shadow-[0_18px_45px_rgba(63,41,24,0.08)] xl:hidden">
                {summaryContent}
              </aside>
            </div>

            <aside className="hidden h-fit rounded-[1.75rem] border border-[rgba(120,87,62,0.14)] bg-[#fbf7f0] p-6 shadow-[0_18px_45px_rgba(63,41,24,0.08)] xl:sticky xl:top-32 xl:block">
              {summaryContent}
            </aside>
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#ddcfbe] bg-[#fbf7f0] px-6 py-14 text-center shadow-[0_18px_45px_rgba(63,41,24,0.05)]">
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#2f231b]">
              Your cart is empty
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#6d5544]">
              Add a few bakery essentials from the catalogue and come back here
              to review quantities before checkout.
            </p>
            <Button
              asChild
              className="mt-8 rounded-full bg-[#b6492d] px-6 text-white hover:bg-[#c55335]"
            >
              <Link href="/products">Shop products</Link>
            </Button>
          </div>
        )}

        {cartItems.length > 0 ? (
          <div className="fixed inset-x-0 bottom-0 z-30 border-t border-[#ddcfbe] bg-[#fbf7f0]/96 px-4 py-4 shadow-[0_-18px_45px_rgba(63,41,24,0.12)] backdrop-blur-sm xl:hidden">
            <div className="mx-auto flex max-w-7xl items-center gap-4">
              <div className="min-w-0 flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[#8b6b56]">
                  Order total
                </p>
                <p className="font-heading text-2xl font-semibold tracking-tight text-[#2f231b]">
                  {formatStorefrontPrice(orderTotal)}
                </p>
              </div>
              <Button className="h-12 shrink-0 rounded-full bg-[#b6492d] px-5 text-white hover:bg-[#c55335]">
                Proceed to checkout
              </Button>
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
