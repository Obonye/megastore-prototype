"use client"

import * as React from "react"

import { LoadingIndicator } from "@/components/loading-indicator"
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
  selectedVariants?: Record<string, string>
}

export function StorefrontAddToCartTrigger({
  ariaLabel,
  children,
  className,
  product,
  selectedVariants,
}: StorefrontAddToCartTriggerProps) {
  const { openProductSheet } = useStorefrontCart()
  const [isOpening, setIsOpening] = React.useState(false)

  async function handleOpenProductSheet() {
    setIsOpening(true)

    try {
      await openProductSheet(product, selectedVariants)
    } finally {
      setIsOpening(false)
    }
  }

  return (
    <Button
      type="button"
      onClick={() => void handleOpenProductSheet()}
      aria-label={ariaLabel ?? "Add to cart"}
      disabled={isOpening}
      className={className}
    >
      {isOpening ? <LoadingIndicator label="Opening..." /> : (children ?? "Add to cart")}
    </Button>
  )
}
