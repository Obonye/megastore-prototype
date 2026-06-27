import "server-only"

import { and, asc, count, desc, eq, ilike, or, sql } from "drizzle-orm"

import { db } from "@/db"
import { categories, products } from "@/db/schema"
import type { StorefrontProduct } from "@/lib/mock-storefront"

const PRODUCTS_PER_PAGE = 6

const BEST_SELLER_BADGES = new Set([
  "Bestseller",
  "Decorator favorite",
  "Bakery staple",
  "Everyday essential",
])

function formatPrice(unitPrice: number) {
  return `P${unitPrice}`
}

function rowToStorefrontProduct(row: {
  id: string
  slug: string
  name: string
  description: string
  categoryName: string | null
  categorySlug: string | null
  unitPrice: number
  stock: number
  badge: string | null
  finish: string | null
  imageSrc: string
  searchTerms: string[]
  variants: StorefrontProduct["variants"]
}): StorefrontProduct {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    category: row.categoryName ?? "Uncategorised",
    categorySlug: row.categorySlug ?? "uncategorised",
    description: row.description,
    price: formatPrice(row.unitPrice),
    unitPrice: row.unitPrice,
    stock: row.stock,
    badge: row.badge ?? "",
    finish: row.finish ?? "",
    imageSrc: row.imageSrc,
    searchTerms: row.searchTerms,
    variants: row.variants,
  }
}

const selectedColumns = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  description: products.description,
  categoryName: categories.name,
  categorySlug: categories.slug,
  unitPrice: products.unitPrice,
  stock: products.stock,
  badge: products.badge,
  finish: products.finish,
  imageSrc: products.imageSrc,
  searchTerms: products.searchTerms,
  variants: products.variants,
} as const

function buildWhereClause(query: string, category: string) {
  const conditions = [eq(products.isActive, true)]

  if (category) {
    conditions.push(eq(categories.name, category))
  }

  if (query) {
    conditions.push(
      or(
        ilike(products.name, `%${query}%`),
        ilike(products.description, `%${query}%`),
        ilike(products.badge, `%${query}%`),
        ilike(products.finish, `%${query}%`),
        sql`array_to_string(${products.searchTerms}, ' ') ilike ${"%" + query + "%"}`
      )!
    )
  }

  return and(...conditions)
}

function buildOrderBy(sort: string) {
  if (sort === "price-asc") return asc(products.unitPrice)
  if (sort === "price-desc") return desc(products.unitPrice)
  if (sort === "name") return asc(products.name)
  return desc(products.createdAt)
}

export type GetProductsResult = {
  products: StorefrontProduct[]
  total: number
  totalPages: number
  currentPage: number
}

export async function getProducts({
  query = "",
  category = "",
  sort = "featured",
  page = 1,
}: {
  query?: string
  category?: string
  sort?: string
  page?: number
} = {}): Promise<GetProductsResult> {
  const where = buildWhereClause(query, category)
  const orderBy = buildOrderBy(sort)

  const [rows, [{ total }]] = await Promise.all([
    db
      .select(selectedColumns)
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where)
      .orderBy(orderBy)
      .limit(PRODUCTS_PER_PAGE)
      .offset((page - 1) * PRODUCTS_PER_PAGE),
    db
      .select({ total: count() })
      .from(products)
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(where),
  ])

  const totalPages = Math.max(1, Math.ceil(total / PRODUCTS_PER_PAGE))
  const currentPage = Math.min(page, totalPages)

  return {
    products: rows.map(rowToStorefrontProduct),
    total,
    totalPages,
    currentPage,
  }
}

export async function getProductBySlug(
  slug: string
): Promise<StorefrontProduct | null> {
  const rows = await db
    .select(selectedColumns)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.slug, slug), eq(products.isActive, true)))
    .limit(1)

  if (!rows[0]) return null

  return rowToStorefrontProduct(rows[0])
}

export async function getProductById(
  id: string
): Promise<StorefrontProduct | null> {
  const rows = await db
    .select(selectedColumns)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.id, id), eq(products.isActive, true)))
    .limit(1)

  if (!rows[0]) return null

  return rowToStorefrontProduct(rows[0])
}

export async function getRelatedProducts(
  categoryName: string,
  excludeSlug: string,
  limit = 4
): Promise<StorefrontProduct[]> {
  const rows = await db
    .select(selectedColumns)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        eq(categories.name, categoryName),
        sql`${products.slug} != ${excludeSlug}`
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(limit)

  return rows.map(rowToStorefrontProduct)
}

export async function getTrendingProducts(limit = 8): Promise<StorefrontProduct[]> {
  const rows = await db
    .select(selectedColumns)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.isActive, true))
    .orderBy(desc(products.createdAt))
    .limit(limit)

  return rows.map(rowToStorefrontProduct)
}

export async function getBestSellerProducts(limit = 4): Promise<StorefrontProduct[]> {
  const badges = Array.from(BEST_SELLER_BADGES)

  const rows = await db
    .select(selectedColumns)
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(
        eq(products.isActive, true),
        or(...badges.map((badge) => ilike(products.badge, badge)))
      )
    )
    .orderBy(desc(products.createdAt))
    .limit(limit)

  return rows.map(rowToStorefrontProduct)
}

export async function getCategories(): Promise<{ name: string; slug: string }[]> {
  const rows = await db
    .select({ name: categories.name, slug: categories.slug })
    .from(categories)
    .orderBy(asc(categories.name))

  return rows
}

export { PRODUCTS_PER_PAGE }
