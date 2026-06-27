import { NextResponse } from "next/server"
import { and, eq } from "drizzle-orm"

import { cartItems } from "@/db/schema"
import { getCurrentUser } from "@/lib/auth"
import { getDb } from "@/lib/db"
import { getCustomerCart } from "@/lib/storefront-cart"
import { getProductById } from "@/lib/storefront-products"

type CartItemBody = {
  quantity?: number
}

function clampQuantity(value: number, max: number) {
  if (Number.isNaN(value) || value < 1) return 1
  return Math.min(value, Math.max(max, 1))
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 })
  }

  const { itemId } = await params
  const body = (await request.json()) as CartItemBody
  const db = getDb()
  const existingItem = await db.query.cartItems.findFirst({
    where: and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)),
  })

  if (!existingItem) {
    return NextResponse.json({ error: "Cart item not found." }, { status: 404 })
  }

  const product = await getProductById(existingItem.productId)

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 })
  }

  await db
    .update(cartItems)
    .set({
      quantity: clampQuantity(body.quantity ?? existingItem.quantity, product.stock),
      updatedAt: new Date(),
    })
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)))

  return NextResponse.json(await getCustomerCart(user.id))
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ itemId: string }> }
) {
  const user = await getCurrentUser()

  if (!user) {
    return NextResponse.json({ error: "You must be signed in." }, { status: 401 })
  }

  const { itemId } = await params
  const db = getDb()

  await db
    .delete(cartItems)
    .where(and(eq(cartItems.id, itemId), eq(cartItems.userId, user.id)))

  return NextResponse.json(await getCustomerCart(user.id))
}
