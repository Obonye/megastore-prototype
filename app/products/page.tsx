import Image from "next/image"
import Link from "next/link"

import { ShoppingCartAdd01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { StorefrontAddToCartTrigger } from "@/components/storefront-add-to-cart-trigger"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  storefrontCategoryChips,
  storefrontProducts,
  type StorefrontProduct,
} from "@/lib/mock-storefront"

const PRODUCTS_PER_PAGE = 6

const productCardAccentClasses = [
  "bg-[#ff6b9a]",
  "bg-[#32c7b0]",
  "bg-[#ff9f43]",
  "bg-[#7c8cff]",
]

const productCardHoverClasses = [
  "hover:bg-[#fff1f6]",
  "hover:bg-[#eefbf8]",
  "hover:bg-[#fff6ea]",
  "hover:bg-[#f2f3ff]",
]

type ProductSearchParams = {
  category?: string | string[]
  page?: string | string[]
  q?: string | string[]
  sort?: string | string[]
}

type ProductsPageProps = {
  searchParams?: Promise<ProductSearchParams>
}

function getSingleParam(value?: string | string[]) {
  if (Array.isArray(value)) {
    return value[0] ?? ""
  }

  return value ?? ""
}

function parsePage(value: string) {
  const parsed = Number.parseInt(value, 10)

  if (Number.isNaN(parsed) || parsed < 1) {
    return 1
  }

  return parsed
}

function parsePrice(value: string) {
  return Number.parseFloat(value.replace(/[^\d.]/g, "")) || 0
}

function sortProducts(products: StorefrontProduct[], sort: string) {
  const sorted = [...products]

  if (sort === "price-asc") {
    sorted.sort(
      (left, right) => parsePrice(left.price) - parsePrice(right.price)
    )
    return sorted
  }

  if (sort === "price-desc") {
    sorted.sort(
      (left, right) => parsePrice(right.price) - parsePrice(left.price)
    )
    return sorted
  }

  if (sort === "name") {
    sorted.sort((left, right) => left.name.localeCompare(right.name))
    return sorted
  }

  return sorted
}

function buildProductsHref(
  params: {
    category?: string
    page?: number
    q?: string
    sort?: string
  } = {}
) {
  const searchParams = new URLSearchParams()

  if (params.q) {
    searchParams.set("q", params.q)
  }

  if (params.category) {
    searchParams.set("category", params.category)
  }

  if (params.sort && params.sort !== "featured") {
    searchParams.set("sort", params.sort)
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page))
  }

  const query = searchParams.toString()

  if (!query) {
    return "/products"
  }

  return `/products?${query}`
}

function renderStars(count: number) {
  return Array.from({ length: 5 }, (_, index) => (
    <span
      key={`star-${index}`}
      aria-hidden="true"
      className={index < count ? "text-[#b5005d]" : "text-[#d2b8c7]"}
    >
      ★
    </span>
  ))
}

const productSlugById = new Map(
  storefrontProducts.map((product) => [product.id, product.slug])
)

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}
  const query = getSingleParam(resolvedSearchParams.q).trim()
  const category = getSingleParam(resolvedSearchParams.category).trim()
  const sort = getSingleParam(resolvedSearchParams.sort).trim() || "featured"

  const filteredProducts = storefrontProducts.filter((product) => {
    const matchesQuery =
      !query ||
      [
        product.name,
        product.description,
        product.category,
        product.badge,
        product.finish,
        ...product.searchTerms,
      ]
        .join(" ")
        .toLowerCase()
        .includes(query.toLowerCase())

    const matchesCategory = !category || product.category === category

    return matchesQuery && matchesCategory
  })

  const sortedProducts = sortProducts(filteredProducts, sort)
  const totalPages = Math.max(
    1,
    Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE)
  )
  const currentPage = Math.min(
    parsePage(getSingleParam(resolvedSearchParams.page)),
    totalPages
  )
  const startIndex = (currentPage - 1) * PRODUCTS_PER_PAGE
  const paginatedProducts = sortedProducts.slice(
    startIndex,
    startIndex + PRODUCTS_PER_PAGE
  )
  const categoryOptions = storefrontCategoryChips.filter((chip) =>
    storefrontProducts.some((product) => product.category === chip.label)
  )
  const categoryCounts = new Map(
    storefrontProducts
      .map((product) => product.category)
      .map((label) => [
        label,
        storefrontProducts.filter((product) => product.category === label)
          .length,
      ])
  )
  const isEmptyCategorySelection =
    filteredProducts.length === 0 && Boolean(category) && !query

  return (
    <main className="bg-[#fffaf6] text-[#1f2833]">
      <section id="featured-catalogue" className="bg-[#fffaf6] py-24">
        <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10">
          <div className="p-0">
              <form
                action="/products"
                className="flex flex-col gap-4 xl:flex-row xl:items-end"
              >
                <label className="grid gap-2 xl:min-w-0 xl:flex-[1.35]">
                  <span className="text-xs font-semibold tracking-[0.22em] text-[#6a5b55] uppercase">
                    Search products
                  </span>
                  <Input
                    type="search"
                    name="q"
                    defaultValue={query}
                    placeholder="Search tools, decorations, boards..."
                    className="h-11 rounded-full border-[#e1d4ca] bg-white px-4 text-[#2f231b] placeholder:text-[#947c6b]"
                  />
                </label>

                <label className="grid gap-2 xl:w-[15rem] xl:shrink-0">
                  <span className="text-xs font-semibold tracking-[0.22em] text-[#6a5b55] uppercase">
                    Category
                  </span>
                  <select
                    name="category"
                    defaultValue={category}
                    className="h-11 rounded-full border border-[#e1d4ca] bg-white px-4 text-sm text-[#2f231b] transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="">All categories</option>
                    {categoryOptions.map((option) => (
                      <option key={option.href} value={option.label}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="grid gap-2 xl:w-[13rem] xl:shrink-0">
                  <span className="text-xs font-semibold tracking-[0.22em] text-[#6a5b55] uppercase">
                    Sort by
                  </span>
                  <select
                    name="sort"
                    defaultValue={sort}
                    className="h-11 rounded-full border border-[#e1d4ca] bg-white px-4 text-sm text-[#2f231b] transition outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                  >
                    <option value="featured">Featured</option>
                    <option value="price-asc">Price: Low to high</option>
                    <option value="price-desc">Price: High to low</option>
                    <option value="name">Name</option>
                  </select>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row xl:shrink-0">
                  <Button className="h-11 rounded-full bg-[#d9dcff] px-5 text-[#1a2330] hover:bg-[#cdd2ff]">
                    Apply filters
                  </Button>
                  <Button
                    asChild
                    type="button"
                    variant="outline"
                    className="h-11 rounded-full border-[#e1d4ca] bg-transparent px-5 text-[#4b3a2e] hover:bg-[#f7ece1] hover:text-[#2f231b]"
                  >
                    <Link href="/products">Reset</Link>
                  </Button>
                </div>
              </form>

              <div className="mt-5 flex flex-col gap-2 text-sm text-[#6d5544] sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Showing{" "}
                  <span className="font-semibold text-[#2f231b]">
                    {paginatedProducts.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#2f231b]">
                    {filteredProducts.length}
                  </span>{" "}
                  products
                </p>
                <p>
                  Page{" "}
                  <span className="font-semibold text-[#2f231b]">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-[#2f231b]">
                    {totalPages}
                  </span>
                </p>
              </div>
          </div>

          {paginatedProducts.length > 0 ? (
            <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {paginatedProducts.map((product, index) => (
                <article
                  key={product.id}
                  className={`group relative overflow-hidden rounded-[1.75rem] border border-[#ece3da] bg-[#f3f2ee] transition-colors duration-300 ${productCardHoverClasses[index % productCardHoverClasses.length]}`}
                >
                  <div className="relative h-52 overflow-hidden bg-[#f7f0ea]">
                    <Image
                      src={product.imageSrc}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, (max-width: 1536px) 33vw, 25vw"
                    />
                  </div>

                  <div className="relative z-20 bg-transparent px-5 pb-4 pt-4 text-[#1a2330]">
                    <h3 className="font-heading text-[1.25rem] font-semibold leading-none tracking-tight text-[#1a2330]">
                      {product.name}
                    </h3>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-[#5b6674]">
                      {product.description}
                    </p>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a6f7c]">
                      {product.finish} ·{" "}
                      <span className="text-[#8e0048]">
                        {product.stock <= 5
                          ? `Only ${product.stock} left`
                          : `${product.stock} in stock`}
                      </span>
                    </p>
                    <Link
                      href={`/products/${product.slug}`}
                      className="relative z-20 mt-3 inline-flex text-sm font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
                    >
                      View details
                    </Link>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-2xl font-bold tracking-tight text-[#1a2330]">
                        {product.price}
                      </p>
                      <StorefrontAddToCartTrigger
                        ariaLabel={`Add ${product.name} to cart`}
                        product={product}
                        className={`relative z-20 size-11 shrink-0 rounded-full p-0 text-[#1a2330] transition-[transform,filter] duration-300 ease-out hover:-translate-y-0.5 hover:brightness-95 ${productCardAccentClasses[index % productCardAccentClasses.length]}`}
                      >
                        <HugeiconsIcon
                          icon={ShoppingCartAdd01Icon}
                          className="size-5"
                        />
                      </StorefrontAddToCartTrigger>
                    </div>
                  </div>
                  <Link
                    href={`/products/${product.slug}`}
                    aria-label={`View ${product.name}`}
                    className="absolute inset-0 z-10 cursor-pointer"
                  />
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-[2rem] border border-dashed border-[#ddcfbe] bg-[#fffaf6] px-6 py-14 text-center">
              <h3 className="font-heading text-3xl font-semibold tracking-[-0.04em] text-[#2f231b]">
                {isEmptyCategorySelection
                  ? "Oops no items in this category yet"
                  : "No products match that search"}
              </h3>
              <p className="mx-auto mt-4 max-w-2xl text-[#6d5544]">
                {isEmptyCategorySelection
                  ? "Try another category or clear the filter to explore more of the mock catalogue."
                  : "Adjust the search term or clear the category filter to explore more of the mock catalogue."}
              </p>
            </div>
          )}

          <nav
            aria-label="Products pagination"
            className="mt-10 flex flex-wrap items-center justify-center gap-3"
          >
            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#d7c8b8] bg-[#fbf7f0] px-4 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
            >
              <Link
                href={buildProductsHref({
                  q: query,
                  category,
                  sort,
                  page: Math.max(1, currentPage - 1),
                })}
                aria-disabled={currentPage === 1}
                tabIndex={currentPage === 1 ? -1 : undefined}
              >
                Previous
              </Link>
            </Button>

            {Array.from({ length: totalPages }, (_, index) => {
              const pageNumber = index + 1
              const isCurrentPage = pageNumber === currentPage

              return (
                <Button
                  key={pageNumber}
                  asChild
                  variant={isCurrentPage ? "default" : "outline"}
                  className={
                    isCurrentPage
                      ? "rounded-full bg-[#d9dcff] px-4 text-[#1a2330] hover:bg-[#d9dcff]"
                      : "rounded-full border-[#d7c8b8] bg-[#fbf7f0] px-4 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
                  }
                >
                  <Link
                    href={buildProductsHref({
                      q: query,
                      category,
                      sort,
                      page: pageNumber,
                    })}
                    aria-current={isCurrentPage ? "page" : undefined}
                  >
                    {pageNumber}
                  </Link>
                </Button>
              )
            })}

            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#d7c8b8] bg-[#fbf7f0] px-4 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
            >
              <Link
                href={buildProductsHref({
                  q: query,
                  category,
                  sort,
                  page: Math.min(totalPages, currentPage + 1),
                })}
                aria-disabled={currentPage === totalPages}
                tabIndex={currentPage === totalPages ? -1 : undefined}
              >
                Next
              </Link>
            </Button>
          </nav>
        </div>
      </section>

    </main>
  )
}
