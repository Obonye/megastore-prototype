import { NextResponse } from "next/server"
import { sql } from "drizzle-orm"

import { cartItems } from "@/db/schema"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/db"
import type { VariantGroup } from "@/lib/mock-storefront"
import { findStorefrontProduct, getCustomerCart } from "@/lib/storefront-cart"

type CartPostBody = {
  productId?: string
  quantity?: number
  selectedVariants?: Record<string, string>
}

function clampQuantity(value: number, max: number) {
  if (Number.isNaN(value) || value < 1) return 1
  return Math.min(value, Math.max(max, 1))
}

function getVariantPriceModifier(
  variants: VariantGroup[] | undefined,
  selected: Record<string, string>
) {
  if (!variants) return 0
  return variants.reduce((total, group) => {
    const option = group.options.find((item) => item.value === selected[group.id])
    return total + (option?.priceModifier ?? 0)
  }, 0)
}

export async function GET() {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 })
    }

    return NextResponse.json(await getCustomerCart(user.id))
  } catch {
    return NextResponse.json(
      { error: "Unable to load your cart." },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "You must be signed in." }, { status: 401 })
    }

    const body = (await request.json()) as CartPostBody
    const productId = body.productId ?? ""
    const product = findStorefrontProduct(productId)

    if (!product) {
      return NextResponse.json({ error: "Product not found." }, { status: 404 })
    }

    const db = getDb()
    const quantity = clampQuantity(body.quantity ?? 1, product.stock)
    const selectedVariants = body.selectedVariants ?? {}
    const resolvedUnitPrice = product.unitPrice + getVariantPriceModifier(product.variants, selectedVariants)

    await db.insert(cartItems).values({
      userId: user.id,
      productId,
      quantity,
      resolvedUnitPrice,
      selectedVariants,
    })
    .onConflictDoUpdate({
      target: [cartItems.userId, cartItems.productId],
      set: {
        quantity: sql`least(${cartItems.quantity} + ${quantity}, ${product.stock})`,
        resolvedUnitPrice,
        selectedVariants,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json(await getCustomerCart(user.id), { status: 201 })
  } catch {
    return NextResponse.json(
      { error: "Unable to save this item to your cart." },
      { status: 500 }
    )
  }
}
