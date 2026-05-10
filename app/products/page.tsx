import Image from "next/image"
import Link from "next/link"

import { StorefrontAddToCartTrigger } from "@/components/storefront-add-to-cart-trigger"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  storefrontCategoryChips,
  storefrontProducts,
  type StorefrontProduct,
} from "@/lib/mock-storefront"

const PRODUCTS_PER_PAGE = 6

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
    sorted.sort((left, right) => parsePrice(left.price) - parsePrice(right.price))
    return sorted
  }

  if (sort === "price-desc") {
    sorted.sort((left, right) => parsePrice(right.price) - parsePrice(left.price))
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
  const isEmptyCategorySelection =
    filteredProducts.length === 0 && Boolean(category) && !query

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#f7f3ec_0%,#efe6da_100%)] px-6 pb-16 pt-28 sm:px-10 lg:px-14 lg:pb-20 lg:pt-32">
      <section className="mx-auto max-w-7xl">
        <div className="max-w-3xl">
          <p className="text-sm uppercase tracking-[0.28em] text-[#8b6b56]">
            Browse the catalogue
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-[#2f231b] sm:text-5xl">
            Products
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6d5544] sm:text-lg">
            Search the current storefront assortment, refine by category, and
            page through the mock catalogue like a live client handoff.
          </p>
        </div>

        <div className="mt-8  sm:p-6">
          <form
            action="/products"
            className="flex flex-col gap-4 xl:flex-row xl:items-end"
          >
            <label className="flex-1">
              <span className="mb-2 block text-sm font-medium text-[#4b3a2e]">
                Search products
              </span>
              <Input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search tools, decorations, boards..."
                className="h-12 rounded-full border-[#ddcfbe] bg-white px-4 text-[#2f231b] placeholder:text-[#947c6b]"
              />
            </label>

            <label className="w-full xl:max-w-[14rem]">
              <span className="mb-2 block text-sm font-medium text-[#4b3a2e]">
                Category
              </span>
              <select
                name="category"
                defaultValue={category}
                className="h-12 w-full rounded-full border border-[#ddcfbe] bg-white px-4 text-sm text-[#2f231b] outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="">All categories</option>
                {categoryOptions.map((option) => (
                  <option key={option.href} value={option.label}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="w-full xl:max-w-[12rem]">
              <span className="mb-2 block text-sm font-medium text-[#4b3a2e]">
                Sort by
              </span>
              <select
                name="sort"
                defaultValue={sort}
                className="h-12 w-full rounded-full border border-[#ddcfbe] bg-white px-4 text-sm text-[#2f231b] outline-none transition focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <option value="featured">Featured</option>
                <option value="price-asc">Price: Low to high</option>
                <option value="price-desc">Price: High to low</option>
                <option value="name">Name</option>
              </select>
            </label>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#b6492d] px-5 text-white hover:bg-[#c55335] sm:w-auto"
              >
                Apply filters
              </Button>
              <Button
                asChild
                type="button"
                variant="outline"
                className="h-12 w-full rounded-full border-[#ddcfbe] bg-transparent px-5 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b] sm:w-auto"
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
              <span className="font-semibold text-[#2f231b]">{currentPage}</span>{" "}
              of{" "}
              <span className="font-semibold text-[#2f231b]">{totalPages}</span>
            </p>
          </div>
        </div>

        {paginatedProducts.length > 0 ? (
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {paginatedProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[1rem] bg-[#2d2926] shadow-[0_20px_40px_rgba(63,41,24,0.18)]"
              >
                <div className="relative h-56 overflow-hidden rounded-[1rem] border-[8px] border-[#2d2926] border-b-0 bg-stone-100">
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="bg-[#2d2926] px-5 pb-5 pt-4 text-white">
                  <p className="text-xs uppercase tracking-[0.22em] text-white/60">
                    {product.category}
                  </p>
                  <h2 className="mt-2 font-heading text-[1.25rem] font-semibold leading-none tracking-tight text-white">
                    {product.name}
                  </h2>
                  <p className="mt-4 min-h-14 text-sm leading-6 text-white/82">
                    {product.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <p className="text-2xl font-bold tracking-tight text-white">
                      {product.price}
                    </p>
                    <StorefrontAddToCartTrigger
                      product={product}
                      className="rounded-full bg-[#b6492d] px-4 text-white hover:bg-[#c55335]"
                    >
                      Add to cart
                    </StorefrontAddToCartTrigger>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-10 rounded-[2rem] border border-dashed border-[#ddcfbe] bg-[#fbf7f0] px-6 py-12 text-center">
            <h2 className="font-heading text-2xl font-semibold text-[#2f231b]">
              {isEmptyCategorySelection
                ? "Oops no items in this category yet"
                : "No products match that search"}
            </h2>
            <p className="mt-3 text-[#6d5544]">
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
                    ? "rounded-full bg-[#2f231b] px-4 text-white hover:bg-[#2f231b]"
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
      </section>
    </main>
  )
}
