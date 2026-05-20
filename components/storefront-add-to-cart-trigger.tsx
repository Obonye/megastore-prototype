"use client"

import * as React from "react"

import { Button } from "@/components/ui/button"

import {
  type StorefrontPurchasableProduct,
  useStorefrontCart,
} from "@/components/storefront-cart-provider"

type StorefrontAddToCartTriggerProps = {
  ariaLabel?: string
  children?: React.ReactNode
  className?: string
  product: StorefrontPurchasableProduct
}

export function StorefrontAddToCartTrigger({
  ariaLabel,
  children,
  className,
  product,
}: StorefrontAddToCartTriggerProps) {
  const { openProductSheet } = useStorefrontCart()

  return (
    <Button
      type="button"
      onClick={() => openProductSheet(product)}
      aria-label={ariaLabel ?? "Add to cart"}
      className={className}
    >
      {children ?? "Add to cart"}
    </Button>
  )
}
