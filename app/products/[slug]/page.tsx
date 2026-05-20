import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import {
  ArrowUpRight01Icon,
  ShoppingCartAdd01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import { StorefrontAddToCartTrigger } from "@/components/storefront-add-to-cart-trigger"
import { Button } from "@/components/ui/button"
import { storefrontProducts } from "@/lib/mock-storefront"

const relatedAccentClasses = [
  "bg-[#ff6b9a]",
  "bg-[#32c7b0]",
  "bg-[#ff9f43]",
  "bg-[#7c8cff]",
]

const relatedHoverClasses = [
  "hover:bg-[#fff1f6]",
  "hover:bg-[#eefbf8]",
  "hover:bg-[#fff6ea]",
  "hover:bg-[#f2f3ff]",
]

type ProductDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export function generateStaticParams() {
  return storefrontProducts.map((product) => ({
    slug: product.slug,
  }))
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { slug } = await params
  const product = storefrontProducts.find((item) => item.slug === slug)

  if (!product) {
    notFound()
  }

  const relatedProducts = storefrontProducts
    .filter(
      (item) => item.category === product.category && item.slug !== product.slug
    )
    .slice(0, 4)

  return (
    <main className="bg-[#fffaf6] text-[#1f2833]">
      <section className="px-4 py-12 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto max-w-[96rem]">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[#6d5544]">
            <Link
              href="/products"
              className="transition-colors hover:text-[#1a2330]"
            >
              Products
            </Link>
            <span>/</span>
            <Link
              href={`/products?category=${encodeURIComponent(product.category)}`}
              className="transition-colors hover:text-[#1a2330]"
            >
              {product.category}
            </Link>
            <span>/</span>
            <span className="text-[#1a2330]">{product.name}</span>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(22rem,0.95fr)] lg:items-start">
            <div className="overflow-hidden rounded-[2.4rem] border border-[#e5ddd4] bg-[#f3f2ee]">
              <div className="relative aspect-[4/4.2] overflow-hidden bg-[#f7f0ea]">
                <Image
                  src={product.imageSrc}
                  alt={product.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 56vw"
                />
              </div>
            </div>

            <div className="rounded-[2.4rem] border border-[#e5ddd4] bg-[#f3f2ee] p-6 sm:p-8">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-[#f7edf3] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#8e0048]">
                  {product.category}
                </span>
                <span className="rounded-full bg-[#ebecef] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6d5544]">
                  {product.badge}
                </span>
              </div>

              <h1 className="mt-5 font-heading text-[clamp(2.4rem,5vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-[#1a2330]">
                {product.name}
              </h1>

              <p className="mt-5 max-w-[58ch] text-base leading-8 text-[#5b6674]">
                {product.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="rounded-[1.5rem] bg-[#fffaf6] px-4 py-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
                    Finish
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#1a2330]">
                    {product.finish}
                  </p>
                </div>
                <div className="rounded-[1.5rem] bg-[#fffaf6] px-4 py-3">
                  <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
                    Stock
                  </p>
                  <p className="mt-1 text-sm font-medium text-[#1a2330]">
                    {product.stock <= 5
                      ? `Only ${product.stock} left`
                      : `${product.stock} in stock`}
                  </p>
                </div>
              </div>

              <div className="mt-10 flex flex-col gap-5 border-t border-[#e5ddd4] pt-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8b6b56]">
                    Price
                  </p>
                  <p className="mt-2 font-heading text-4xl font-semibold tracking-[-0.05em] text-[#1a2330]">
                    {product.price}
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:items-end">
                  <StorefrontAddToCartTrigger
                    ariaLabel={`Add ${product.name} to cart`}
                    product={product}
                    className="h-12 rounded-full bg-[#d9dcff] px-5 text-[#1a2330] hover:bg-[#cdd2ff]"
                  >
                    <HugeiconsIcon
                      icon={ShoppingCartAdd01Icon}
                      className="size-5"
                    />
                    Add to cart
                  </StorefrontAddToCartTrigger>
                  <Button
                    asChild
                    variant="outline"
                    className="rounded-full border-[#d7c8b8] bg-[#fbf7f0] px-5 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
                  >
                    <Link href="/products">Back to catalogue</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {relatedProducts.length > 0 ? (
        <section className="px-4 pb-20 sm:px-6 lg:px-10 lg:pb-24">
          <div className="mx-auto max-w-[96rem]">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8e0048]">
                  More in {product.category}
                </p>
                <h2 className="mt-4 font-heading text-3xl font-semibold tracking-[-0.05em] text-[#1a2330] sm:text-4xl">
                  Keep building your order.
                </h2>
              </div>
              <Button
                asChild
                variant="outline"
                className="rounded-full border-[#d7c8b8] bg-[#fbf7f0] px-4 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
              >
                <Link
                  href={`/products?category=${encodeURIComponent(product.category)}`}
                >
                  View category
                </Link>
              </Button>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {relatedProducts.map((item, index) => (
                <article
                  key={item.id}
                  className={`group relative overflow-hidden rounded-[1.75rem] border border-[#ece3da] bg-[#f3f2ee] transition-colors duration-300 ${relatedHoverClasses[index % relatedHoverClasses.length]}`}
                >
                  <div className="relative h-52 overflow-hidden bg-[#f7f0ea]">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 50vw, 25vw"
                    />
                  </div>

                  <div className="relative z-20 bg-transparent px-5 pb-4 pt-4 text-[#1a2330]">
                    <h3 className="font-heading text-[1.25rem] font-semibold leading-none tracking-tight text-[#1a2330]">
                      {item.name}
                    </h3>
                    <p className="mt-3 min-h-12 text-sm leading-6 text-[#5b6674]">
                      {item.description}
                    </p>
                    <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a6f7c]">
                      {item.finish} ·{" "}
                      <span className="text-[#8e0048]">
                        {item.stock <= 5
                          ? `Only ${item.stock} left`
                          : `${item.stock} in stock`}
                      </span>
                    </p>
                    <Link
                      href={`/products/${item.slug}`}
                      className="relative z-20 mt-3 inline-flex items-center gap-1 text-sm font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
                    >
                      View details
                      <HugeiconsIcon
                        icon={ArrowUpRight01Icon}
                        className="size-4"
                      />
                    </Link>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-2xl font-bold tracking-tight text-[#1a2330]">
                        {item.price}
                      </p>
                      <StorefrontAddToCartTrigger
                        ariaLabel={`Add ${item.name} to cart`}
                        product={item}
                        className={`relative z-20 size-11 shrink-0 rounded-full p-0 text-[#1a2330] transition-[transform,filter] duration-300 ease-out hover:-translate-y-0.5 hover:brightness-95 ${relatedAccentClasses[index % relatedAccentClasses.length]}`}
                      >
                        <HugeiconsIcon
                          icon={ShoppingCartAdd01Icon}
                          className="size-5"
                        />
                      </StorefrontAddToCartTrigger>
                    </div>
                  </div>

                  <Link
                    href={`/products/${item.slug}`}
                    aria-label={`View ${item.name}`}
                    className="absolute inset-0 z-10 cursor-pointer"
                  />
                </article>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </main>
  )
}
