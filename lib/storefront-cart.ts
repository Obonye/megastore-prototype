import "server-only"

import { eq } from "drizzle-orm"

import { cartItems } from "@/db/schema"
import { getDb } from "@/lib/db"
import { getProductById } from "@/lib/storefront-products"
import type { VariantGroup } from "@/lib/mock-storefront"

export type PersistedStorefrontCartItem = {
  id: string
  cartItemId: string
  category: string
  description: string
  imageSrc: string
  name: string
  price: string
  quantity: number
  resolvedUnitPrice: number
  selectedVariants: Record<string, string>
  stock: number
  unitPrice: number
  variants?: VariantGroup[]
}

export type PersistedStorefrontCart = {
  items: PersistedStorefrontCartItem[]
}

export async function getCustomerCart(userId: string): Promise<PersistedStorefrontCart> {
  const db = getDb()
  const rows = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))
    .orderBy(cartItems.createdAt)

  const itemsWithProducts = await Promise.all(
    rows.map(async (row) => {
      const product = await getProductById(row.productId)

      if (!product) return null

      return {
        id: product.id,
        cartItemId: row.id,
        category: product.category,
        description: product.description,
        imageSrc: product.imageSrc,
        name: product.name,
        price: product.price,
        quantity: row.quantity,
        resolvedUnitPrice: row.resolvedUnitPrice,
        selectedVariants: row.selectedVariants,
        stock: product.stock,
        unitPrice: product.unitPrice,
        variants: product.variants,
      }
    })
  )

  return {
    items: itemsWithProducts.filter((item) => item !== null),
  }
}
