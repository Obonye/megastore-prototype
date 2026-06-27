import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const authSessions = pgTable("auth_sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const cartItems = pgTable(
  "cart_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: text("product_id").notNull(),
    quantity: integer("quantity").notNull(),
    selectedVariants: jsonb("selected_variants")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
    resolvedUnitPrice: integer("resolved_unit_price").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    uniqueIndex("cart_items_user_product_unique").on(
      table.userId,
      table.productId
    ),
  ]
)

export type CheckoutShippingInfo = {
  name: string
  phone: string
  addressLine1: string
  addressLine2?: string
  city: string
}

export type CheckoutLineItem = {
  cartItemId: string
  productId: string
  name: string
  quantity: number
  resolvedUnitPrice: number
  selectedVariants: Record<string, string>
}

export const checkoutTransactions = pgTable("checkout_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  orderReference: text("order_reference").notNull().unique(),
  lemonSqueezyCheckoutId: text("lemonsqueezy_checkout_id"),
  lemonSqueezyOrderId: text("lemonsqueezy_order_id"),
  status: text("status").notNull().default("pending"),
  collectionMethod: text("collection_method").notNull(),
  currency: text("currency").notNull().default("BWP"),
  amountSubtotal: integer("amount_subtotal").notNull(),
  deliveryFee: integer("delivery_fee").notNull().default(0),
  amountTotal: integer("amount_total").notNull(),
  items: jsonb("items").$type<CheckoutLineItem[]>().notNull(),
  shippingInfo: jsonb("shipping_info").$type<CheckoutShippingInfo>(),
  savePaymentMethod: boolean("save_payment_method").notNull().default(false),
  saveShippingInfo: boolean("save_shipping_info").notNull().default(false),
  checkoutUrl: text("checkout_url"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const savedShippingAddresses = pgTable("saved_shipping_addresses", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  label: text("label").notNull().default("Default"),
  shippingInfo: jsonb("shipping_info").$type<CheckoutShippingInfo>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const savedPaymentMethods = pgTable("saved_payment_methods", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  provider: text("provider").notNull().default("lemonsqueezy"),
  providerCustomerId: text("provider_customer_id"),
  providerPaymentMethodId: text("provider_payment_method_id"),
  status: text("status").notNull().default("requested"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

// --- Product catalogue ---

export type VariantOption = {
  value: string
  label: string
  color?: string
  imageSrc?: string
  priceModifier?: number
}

export type VariantGroup = {
  id: string
  label: string
  type: "colour" | "size" | "quantity"
  options: VariantOption[]
  defaultValue: string
}

export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  categoryId: uuid("category_id").references(() => categories.id, {
    onDelete: "set null",
  }),
  unitPrice: integer("unit_price").notNull(),
  stock: integer("stock").notNull().default(0),
  badge: text("badge"),
  finish: text("finish"),
  imageSrc: text("image_src").notNull(),
  searchTerms: text("search_terms").array().notNull().default([]),
  variants: jsonb("variants").$type<VariantGroup[]>().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
})
