import "server-only"

import { eq } from "drizzle-orm"

import { cartItems } from "@/db/schema"
import { getDb } from "@/lib/db"
import { storefrontProducts } from "@/lib/mock-storefront"

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
  variants?: (typeof storefrontProducts)[number]["variants"]
}

export type PersistedStorefrontCart = {
  items: PersistedStorefrontCartItem[]
}

export function findStorefrontProduct(productId: string) {
  return storefrontProducts.find((product) => product.id === productId) ?? null
}

export async function getCustomerCart(userId: string): Promise<PersistedStorefrontCart> {
  const db = getDb()
  const rows = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, userId))
    .orderBy(cartItems.createdAt)

  return {
    items: rows.flatMap((row) => {
      const product = findStorefrontProduct(row.productId)

      if (!product) return []

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
    }),
  }
}
