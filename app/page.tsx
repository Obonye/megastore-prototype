import Image from "next/image"
import Link from "next/link"

import { ArrowUpRight, ShoppingCart } from "lucide-react"

import { ProductsHeroCarousel } from "@/components/products-hero-carousel"
import { StorefrontAddToCartTrigger } from "@/components/storefront-add-to-cart-trigger"
import { WhyShopAccordion } from "@/components/why-shop-accordion"
import { Button } from "@/components/ui/button"
import {
  storefrontCategoryChips,
  storefrontHeroSlides,
  storefrontProducts,
  trendingStorefrontItems,
} from "@/lib/mock-storefront"

const categoryShadowClasses = [
  "bg-[#ff6b9a]",
  "bg-[#32c7b0]",
  "bg-[#ff9f43]",
  "bg-[#7c8cff]",
]

const trendingHoverClasses = [
  "hover:bg-[#fff1f6]",
  "hover:bg-[#eefbf8]",
  "hover:bg-[#fff6ea]",
  "hover:bg-[#f2f3ff]",
]

const shopByNeedCards = [
  {
    title: "Start Baking",
    description: "Core tools, measuring sets, tins, and pantry staples for first bakes.",
    href: "/products?category=Baking+Basics",
    accentClassName: "bg-[#ff6b9a]",
  },
  {
    title: "Decorate Cakes",
    description: "Fondants, colour, nozzles, and finishing details for polished results.",
    href: "/products?category=Decorations",
    accentClassName: "bg-[#32c7b0]",
  },
  {
    title: "Package Orders",
    description: "Boards, ribbon, boxes, and wrap-up essentials for clean handoff.",
    href: "/products?category=Packaging",
    accentClassName: "bg-[#ff9f43]",
  },
  {
    title: "Restock the Studio",
    description: "Fast-moving everyday essentials for busy decorators and bakers.",
    href: "/products",
    accentClassName: "bg-[#7c8cff]",
  },
]

const whyShopWithUsItems = [
  {
    title: "Reliable stock for busy bake days",
    description:
      "Fast-moving essentials, decorating staples, and packaging basics are selected to help you restock with fewer gaps when orders pile up.",
  },
  {
    title: "Practical quality, not novelty",
    description:
      "We focus on tools, ingredients, and finishing items that bakers actually reuse, so your results stay consistent from one celebration to the next.",
  },
  {
    title: "Faster paths to what you need",
    description:
      "Collections are organised around real baking tasks, which makes it easier to jump straight into prep, decorating, packaging, or studio restocks.",
  },
  {
    title: "Built for home bakers and small brands",
    description:
      "Whether you are planning a single birthday cake or fulfilling customer pickups, the store is shaped around dependable everyday workflows.",
  },
]

const whyShopIndicatorClasses = [
  "bg-[#ffd3e3]",
  "bg-[#cceee7]",
  "bg-[#ffe0b8]",
  "bg-[#d9dcff]",
]

const shopByNeedNumberClasses = [
  "text-[#ff6b9a]",
  "text-[#32c7b0]",
  "text-[#ff9f43]",
  "text-[#7c8cff]",
]

const bestSellerBadges = new Set([
  "Bestseller",
  "Decorator favorite",
  "Bakery staple",
  "Everyday essential",
])

const productFinishById = new Map(
  storefrontProducts.map((product) => [product.id, product.finish])
)

const productSlugById = new Map(
  storefrontProducts.map((product) => [product.id, product.slug])
)

const bestSellerProducts = storefrontProducts
  .filter((product) => bestSellerBadges.has(product.badge))
  .slice(0, 4)

function formatItemNumber(index: number) {
  return String(index + 1).padStart(2, "0")
}

function getCategoryCornerClasses(index: number) {
  const mobileCorners = [
    index === 0 ? "max-sm:rounded-t-[2rem]" : "",
    index === storefrontCategoryChips.length - 1
      ? "max-sm:rounded-b-[2rem]"
      : "",
  ]

  const smallCorners = [
    index === 0 ? "sm:max-lg:rounded-tl-[2rem]" : "",
    index === 1 ? "sm:max-lg:rounded-tr-[2rem]" : "",
    index === storefrontCategoryChips.length - 2
      ? "sm:max-lg:rounded-bl-[2rem]"
      : "",
    index === storefrontCategoryChips.length - 1
      ? "sm:max-lg:rounded-br-[2rem]"
      : "",
  ]

  const largeCorners = [
    index === 0 ? "lg:rounded-tl-[2rem]" : "",
    index === 3 ? "lg:rounded-tr-[2rem]" : "",
    index === 4 ? "lg:rounded-bl-[2rem]" : "",
    index === 7 ? "lg:rounded-br-[2rem]" : "",
  ]

  return [...mobileCorners, ...smallCorners, ...largeCorners]
    .filter(Boolean)
    .join(" ")
}

function getCategoryLiftClasses(index: number) {
  const isLeftColumnSmall = index % 2 === 0
  const isRightColumnSmall = index % 2 === 1
  const isTopRowSmall = index < 2
  const isBottomRowSmall = index >= storefrontCategoryChips.length - 2

  const isLeftColumnLarge = index === 0 || index === 4
  const isRightColumnLarge = index === 3 || index === 7
  const isTopRowLarge = index < 4
  const isBottomRowLarge = index >= 4

  return [
    isLeftColumnSmall ? "sm:max-lg:hover:-translate-x-2 sm:max-lg:focus-visible:-translate-x-2" : "",
    isRightColumnSmall ? "sm:max-lg:hover:translate-x-2 sm:max-lg:focus-visible:translate-x-2" : "",
    isTopRowSmall ? "sm:max-lg:hover:-translate-y-2 sm:max-lg:focus-visible:-translate-y-2" : "",
    isBottomRowSmall ? "sm:max-lg:hover:translate-y-2 sm:max-lg:focus-visible:translate-y-2" : "",
    isLeftColumnLarge ? "lg:hover:-translate-x-2 lg:focus-visible:-translate-x-2" : "",
    isRightColumnLarge ? "lg:hover:translate-x-2 lg:focus-visible:translate-x-2" : "",
    isTopRowLarge ? "lg:hover:-translate-y-2 lg:focus-visible:-translate-y-2" : "",
    isBottomRowLarge ? "lg:hover:translate-y-2 lg:focus-visible:translate-y-2" : "",
  ]
    .filter(Boolean)
    .join(" ")
}

export default function Page() {
  return (
    <main>
      <ProductsHeroCarousel slides={storefrontHeroSlides} />

      <section
        aria-labelledby="trending-items-heading"
        className="bg-[linear-gradient(180deg,#f7edf3_0%,#efdde8_100%)] px-6 py-16 sm:px-10 lg:px-14 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-2xl">
              <h2
                id="trending-items-heading"
                className="mt-4 font-heading text-3xl font-semibold tracking-tight text-[#2f231b] sm:text-4xl"
              >
                Trending Items
              </h2>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#d1d4cf] bg-[#f8f9f6] px-4 text-[#4b3a2e] hover:bg-[#eef1eb] hover:text-[#2f231b]"
            >
              <Link href="/products">View all</Link>
            </Button>
          </div>

          <div className="mt-10 sm:hidden">
            <div className="-mx-6 overflow-x-auto px-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <div className="flex gap-4 pb-1">
                {trendingStorefrontItems.map((item, index) => (
                  <article
                    key={item.id}
                    className={`group relative w-[18.25rem] shrink-0 overflow-hidden rounded-[1.4rem] bg-[#f3f2ee] transition-colors duration-300 ${trendingHoverClasses[index % trendingHoverClasses.length]}`}
                  >
                    <div className="relative h-44 overflow-hidden bg-stone-100">
                      <Image
                        src={item.imageSrc}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[#8e0048] backdrop-blur-sm">
                        {formatItemNumber(index)}
                      </div>
                    </div>

                    <div className="relative z-20 bg-transparent px-5 pb-4 pt-4 text-[#1a2330]">
                      <h3 className="font-heading text-[1.2rem] font-semibold leading-none tracking-tight text-[#1a2330]">
                        {item.name}
                      </h3>
                      <p className="mt-3 min-h-12 text-sm leading-6 text-[#5b6674]">
                        {item.description}
                      </p>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#7a6f7c]">
                        {productFinishById.get(item.id) ?? "Store favorite"} ·{" "}
                        <span className="text-[#8e0048]">
                          {item.stock <= 5
                            ? `Only ${item.stock} left`
                            : `${item.stock} in stock`}
                        </span>
                      </p>
                      <Link
                        href={`/products/${productSlugById.get(item.id) ?? item.id}`}
                        className="relative z-20 mt-3 inline-flex text-sm font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
                      >
                        View details
                      </Link>
                      <div className="mt-4 flex items-center justify-between gap-3">
                        <p className="text-2xl font-bold tracking-tight text-[#1a2330]">
                          {item.price}
                        </p>
                        <StorefrontAddToCartTrigger
                          ariaLabel={`Add ${item.name} to cart`}
                          product={item}
                          className="relative z-20 h-9 shrink-0 rounded-full bg-[#ffd3e3] px-3 text-xs font-semibold text-[#1a2330] transition-[transform,filter] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#ffc5d8]"
                        >
                          <ShoppingCart className="size-4" />
                          Add to cart
                        </StorefrontAddToCartTrigger>
                      </div>
                    </div>
                    <Link
                      href={`/products/${productSlugById.get(item.id) ?? item.id}`}
                      aria-label={`View ${item.name}`}
                      className="absolute inset-0 z-10 cursor-pointer rounded-[1.4rem]"
                    />
                  </article>
                ))}
              </div>
            </div>
            <div className="mt-4 flex items-center justify-between text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[#8e0048]">
              <span>Swipe through picks</span>
              <span>
                {formatItemNumber(trendingStorefrontItems.length - 1)} items
              </span>
            </div>
          </div>

          <div className="mt-10 hidden overflow-hidden rounded-[2rem] border border-[#dfd0d8] bg-[#dfd0d8] sm:block">
            <div className="grid gap-px sm:grid-cols-2 xl:grid-cols-4">
              {trendingStorefrontItems.map((item, index) => (
                <article
                  key={item.id}
                  className={`group relative overflow-hidden bg-[#f3f2ee] transition-colors duration-300 ${trendingHoverClasses[index % trendingHoverClasses.length]}`}
                >
                  <div className="relative h-48 overflow-hidden bg-stone-100">
                    <Image
                      src={item.imageSrc}
                      alt={item.name}
                      fill
                      className="object-cover"
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
                      {productFinishById.get(item.id) ?? "Store favorite"} ·{" "}
                      <span className="text-[#8e0048]">
                        {item.stock <= 5
                          ? `Only ${item.stock} left`
                          : `${item.stock} in stock`}
                      </span>
                    </p>
                    <Link
                      href={`/products/${productSlugById.get(item.id) ?? item.id}`}
                      className="relative z-20 mt-3 inline-flex text-sm font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
                    >
                      View details
                    </Link>
                    <div className="mt-4 flex items-center justify-between gap-3">
                      <p className="text-2xl font-bold tracking-tight text-[#1a2330]">
                        {item.price}
                      </p>
                      <StorefrontAddToCartTrigger
                        ariaLabel={`Add ${item.name} to cart`}
                        product={item}
                        className="relative z-20 h-9 shrink-0 rounded-full bg-[#ffd3e3] px-3 text-xs font-semibold text-[#1a2330] transition-[transform,filter] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#ffc5d8]"
                      >
                        <ShoppingCart className="size-4" />
                        Add to cart
                      </StorefrontAddToCartTrigger>
                    </div>
                  </div>
                  <Link
                    href={`/products/${productSlugById.get(item.id) ?? item.id}`}
                    aria-label={`View ${item.name}`}
                    className="absolute inset-0 z-10 cursor-pointer"
                  />
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="shop-categories-heading"
        aria-label="Shop categories"
        className="relative overflow-hidden bg-[#fffaf6] py-24"
      >
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-70 [background-image:radial-gradient(circle_at_10px_10px,rgba(255,107,154,0.55)_0,rgba(255,107,154,0.55)_2px,transparent_2.4px),radial-gradient(circle_at_32px_20px,rgba(50,199,176,0.5)_0,rgba(50,199,176,0.5)_2px,transparent_2.4px),radial-gradient(circle_at_22px_34px,rgba(255,159,67,0.45)_0,rgba(255,159,67,0.45)_2px,transparent_2.4px),radial-gradient(circle_at_44px_42px,rgba(124,140,255,0.42)_0,rgba(124,140,255,0.42)_2px,transparent_2.4px)] [background-size:56px_56px]"
        />
        <div className="relative mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-base font-semibold uppercase tracking-[0.28em] text-[#8e0048]">
              Shop by category
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[#5b6674]">
              Browse tools, fondants, boards, packaging, and finishing details
              through a more visual front door.
            </p>
          </div>

          <div className="mt-14 flex flex-col gap-3 sm:hidden">
            {storefrontCategoryChips.map((chip, index) => (
              <div key={chip.href} className="group relative isolate min-h-32">
                <span
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-[1.6rem] opacity-0 transition-opacity delay-100 duration-300 ease-out group-active:opacity-100 ${
                    categoryShadowClasses[index % categoryShadowClasses.length]
                  }`}
                />
                <Link
                  href={chip.href}
                  className="relative z-10 flex min-h-32 items-end rounded-[1.6rem] bg-[#f3f2ee] px-5 py-4 text-left text-[#1a2330] transition-[transform,background-color] duration-300 ease-out active:translate-x-0.5 active:translate-y-0.5 active:bg-white"
                >
                  <div className="relative z-10 flex w-full items-end justify-between gap-4">
                    <h3 className="font-heading text-[clamp(2.4rem,10vw,3.4rem)] font-semibold leading-[0.9] tracking-[-0.06em]">
                      {chip.label}
                    </h3>
                    <span
                      aria-hidden="true"
                      className={`pointer-events-none flex size-11 shrink-0 items-center justify-center rounded-full text-[#1a2330] ${
                        categoryShadowClasses[index % categoryShadowClasses.length]
                      }`}
                    >
                      <ArrowUpRight className="size-5" />
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-14 hidden sm:block">
            <div className="relative rounded-[2rem]">
              <div className="pointer-events-none absolute inset-0 rounded-[2rem] border border-[#d3d5d0] bg-[#dddeda] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]" />
              <div className="relative grid gap-px rounded-[2rem] bg-[#dddeda] p-px sm:grid-cols-2 lg:grid-cols-4">
                {storefrontCategoryChips.map((chip, index) => {
                  const cornerClasses = getCategoryCornerClasses(index)
                  const liftClasses = getCategoryLiftClasses(index)

                  return (
                    <div
                      key={chip.href}
                      className={`relative min-h-56 bg-[#f3f2ee] ${cornerClasses}`}
                    >
                      <div className="group absolute inset-0 isolate overflow-visible">
                        <span
                          aria-hidden="true"
                          className={`absolute inset-[1px] opacity-0 transition-opacity delay-100 duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none group-hover:opacity-100 group-focus-within:opacity-100 group-active:opacity-100 group-active:delay-0 ${cornerClasses} ${
                            categoryShadowClasses[index % categoryShadowClasses.length]
                          }`}
                        />
                        <Link
                          href={chip.href}
                          className={`relative z-10 flex min-h-56 flex-col justify-end bg-[#f3f2ee] px-7 py-7 text-left text-[#1a2330] shadow-[0_0_0_rgba(0,0,0,0)] transition-[transform,background-color,box-shadow,border-radius] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none hover:rounded-[1.6rem] hover:bg-white hover:shadow-[0_18px_38px_rgba(38,43,51,0.10)] focus-visible:rounded-[1.6rem] focus-visible:bg-white focus-visible:shadow-[0_18px_38px_rgba(38,43,51,0.10)] focus-visible:outline-none active:translate-x-0.5 active:translate-y-0.5 active:rounded-[1.6rem] ${cornerClasses} ${liftClasses}`}
                        >
                          <span
                            aria-hidden="true"
                            className={`pointer-events-none absolute right-5 top-5 flex size-11 translate-x-0 translate-y-0 items-center justify-center rounded-full text-[#1a2330] opacity-100 transition-[transform,opacity] delay-100 duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] motion-reduce:transition-none lg:translate-x-1 lg:-translate-y-1 lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-x-0 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100 lg:group-active:translate-x-0 lg:group-active:translate-y-0 lg:group-active:opacity-100 lg:group-active:delay-0 ${
                              categoryShadowClasses[index % categoryShadowClasses.length]
                            }`}
                          >
                            <ArrowUpRight className="size-5" />
                          </span>
                          <div className="relative z-10">
                            <h3 className="font-heading text-2xl font-semibold tracking-[-0.04em]">
                              {chip.label}
                            </h3>
                            <p className="mt-2 text-sm uppercase tracking-[0.18em] text-[#6c7684]">
                              View Collection
                            </p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[#fffaf6] py-10 sm:py-12">
        <div className="mx-auto max-w-[96rem] px-4 sm:px-6 lg:px-10">
          <div className="overflow-hidden rounded-[2.4rem] bg-[#32c7b0]">
            <div className="grid items-stretch gap-0 md:grid-cols-2">
              <div className="flex flex-col justify-center px-8 py-12 sm:px-12 lg:px-16">
                <p className="w-fit rounded-full bg-white/18 px-4 py-2 text-sm font-semibold uppercase tracking-[0.24em] text-[#fff4df]">
                  Limited time offer
                </p>
                <h2 className="mt-6 max-w-[10ch] font-heading text-[clamp(2.7rem,5vw,4.8rem)] font-semibold tracking-[-0.06em] text-[#fff4df]">
                  The ultimate baker&apos;s bundle.
                </h2>
                <p className="mt-5 max-w-xl text-base leading-8 text-[#fff4df]">
                  A starting kit with pro-grade tools and dependable essentials
                  for decorators who want one fast, high-value checkout.
                </p>
                <div className="mt-10 flex flex-wrap items-center gap-6">
                  <Button
                    asChild
                    className="h-12 rounded-full bg-white px-7 text-sm font-semibold uppercase tracking-[0.16em] text-[#16645a] hover:bg-[#f3fffd]"
                  >
                    <Link href="/products?sort=price-desc">Shop now</Link>
                  </Button>
                  <div className="flex flex-col">
                    <span className="text-sm uppercase tracking-[0.18em] text-[#fff4df]/70 line-through">
                      P4,500
                    </span>
                    <span className="font-heading text-3xl font-semibold tracking-[-0.04em] text-[#fff4df]">
                      P3,299
                    </span>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[22rem]">
                <Image
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1189&auto=format&fit=crop"
                  alt="A premium baking bundle styled beside a finished cake."
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(50,199,176,0.04),rgba(50,199,176,0.34))]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="shop-by-need-heading"
        className="bg-[#fffaf6] px-4 py-20 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-[96rem]">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8e0048]">
              Shop by need
            </p>
            <h2
              id="shop-by-need-heading"
              className="mt-4 font-heading text-3xl font-semibold tracking-[-0.05em] text-[#1a2330] sm:text-4xl"
            >
              Choose the kind of baking day you&apos;re planning.
            </h2>
            <p className="mt-4 text-base leading-8 text-[#5b6674]">
              Jump straight into starter kits, decorating essentials, packaging,
              or quick studio restocks without browsing every aisle first.
            </p>
          </div>

          <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {shopByNeedCards.map((card, index) => (
              <div key={card.title} className="relative pt-3">
                <div
                  aria-hidden="true"
                  className={`absolute inset-x-0 bottom-0 top-3 rounded-[1.75rem] ${card.accentClassName}`}
                />
                <Link
                  href={card.href}
                  className="group relative block h-full overflow-hidden rounded-[1.75rem] border border-[#ece3da] bg-[#f3f2ee] px-6 py-7 text-[#1a2330] transition-transform duration-300 ease-out hover:-translate-x-1 hover:-translate-y-1"
                >
                  <div>
                    <p
                      className={`text-sm font-semibold uppercase tracking-[0.22em] ${
                        shopByNeedNumberClasses[index % shopByNeedNumberClasses.length]
                      }`}
                    >
                      {formatItemNumber(index)}
                    </p>
                    <div className="flex items-start justify-between gap-4">
                      <h3 className="mt-3 font-heading text-[1.65rem] font-semibold tracking-[-0.05em]">
                        {card.title}
                      </h3>
                    </div>
                    <p className="mt-4 text-sm leading-7 text-[#5b6674]">
                      {card.description}
                    </p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        aria-labelledby="why-shop-with-us-heading"
        className="bg-[#fcfcfa] px-4 py-20 sm:px-6 lg:px-10"
      >
        <div className="mx-auto grid max-w-[96rem] gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8e0048]">
              Why shop with us
            </p>
            <h2
              id="why-shop-with-us-heading"
              className="mt-4 font-heading text-3xl font-semibold tracking-[-0.05em] text-[#1a2330] sm:text-4xl"
            >
              A baking supply store built for real prep, not endless browsing.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-8 text-[#5b6674]">
              From quick studio restocks to event-week pickup prep, these are the
              things that make the shop more useful when you already know the
              kind of baking day ahead of you.
            </p>
          </div>

          <WhyShopAccordion
            items={whyShopWithUsItems}
            indicatorClasses={whyShopIndicatorClasses}
          />
        </div>
      </section>

      <section
        aria-labelledby="best-sellers-heading"
        className="bg-[#fffaf6] px-4 py-20 sm:px-6 lg:px-10"
      >
        <div className="mx-auto max-w-[96rem]">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#8e0048]">
                Best sellers
              </p>
              <h2
                id="best-sellers-heading"
                className="mt-4 font-heading text-3xl font-semibold tracking-[-0.05em] text-[#1a2330] sm:text-4xl"
              >
                The products bakers come back for first.
              </h2>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#5b6674]">
                Trusted tools, essentials, and finishing items that help home
                bakers and small baking brands get consistent results faster.
              </p>
            </div>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-[#d1d4cf] bg-[#f8f9f6] px-4 text-[#4b3a2e] hover:bg-[#eef1eb] hover:text-[#2f231b]"
            >
              <Link href="/products">Shop all best sellers</Link>
            </Button>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {bestSellerProducts.map((product, index) => (
              <article
                key={product.id}
                className={`group relative overflow-hidden rounded-[1.75rem] border border-[#ece3da] bg-[#f3f2ee] transition-colors duration-300 ${trendingHoverClasses[index % trendingHoverClasses.length]}`}
              >
                <div className="relative h-56 overflow-hidden bg-[#f7f0ea]">
                  <Image
                    src={product.imageSrc}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 1280px) 50vw, 25vw"
                  />
                </div>

                <div className="relative z-20 bg-transparent px-5 pb-5 pt-4 text-[#1a2330]">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[#8e0048]">
                        {product.category}
                      </p>
                      <h3 className="mt-2 font-heading text-[1.4rem] font-semibold leading-none tracking-[-0.04em] text-[#1a2330]">
                        {product.name}
                      </h3>
                    </div>
                    <span className="rounded-full bg-[#f3ebe5] px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[#6d5544]">
                      {product.badge}
                    </span>
                  </div>

                  <p className="mt-4 min-h-14 text-sm leading-7 text-[#66717f]">
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
                      className="relative z-20 h-9 shrink-0 rounded-full bg-[#ffd3e3] px-3 text-xs font-semibold text-[#1a2330] transition-[transform,filter] duration-300 ease-out hover:-translate-y-0.5 hover:bg-[#ffc5d8]"
                    >
                      <ShoppingCart className="size-4" />
                      Add to cart
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
        </div>
      </section>

    </main>
  )
}
