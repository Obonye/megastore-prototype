import Image from "next/image"
import Link from "next/link"

import {
  CakeSliceIcon,
  DropletIcon,
  PackageIcon,
  PaintBoardIcon,
  RibbonIcon,
  SparklesIcon,
  WhiskIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons"
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react"

import { StorefrontAddToCartTrigger } from "@/components/storefront-add-to-cart-trigger"
import { Button } from "@/components/ui/button"
import {
  type StorefrontCategoryChipIconKey,
  storefrontCategoryChips,
  trendingStorefrontItems,
} from "@/lib/mock-storefront"

const storefrontCategoryChipIcons: Record<
  StorefrontCategoryChipIconKey,
  IconSvgElement
> = {
  tools: Wrench01Icon,
  fondants: CakeSliceIcon,
  boards: PaintBoardIcon,
  decorations: RibbonIcon,
  packaging: PackageIcon,
  colour: DropletIcon,
  sprinkles: SparklesIcon,
  basics: WhiskIcon,
}

export default function Page() {
  return (
    <main>
      <section className="relative flex min-h-svh items-end overflow-hidden">
        <Image
          src="/baking shop hero.jpg"
          alt="Baking tools and decorated cakes arranged for a bakery supply storefront"
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,7,7,0.14)_0%,rgba(9,7,7,0.36)_38%,rgba(9,7,7,0.82)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(214,163,130,0.18),transparent_38%)]" />

        <div className="relative z-10 flex w-full flex-col gap-8 px-6 py-8 text-primary-foreground sm:px-10 sm:py-10 lg:px-14 lg:py-12">
          <div className="max-w-3xl">
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Baking supplies with a storefront presence worth lingering over.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/78 sm:text-lg">
              From fondants and cake boards to finishing tools and decorations,
              the first impression now belongs to the hero image instead of a
              placeholder panel.
            </p>
          </div>

        </div>
      </section>

      <section
        aria-labelledby="shop-categories-heading"
        className="bg-[linear-gradient(180deg,#f7f3ec_0%,#f3eee6_100%)] px-6 py-8 sm:px-10 lg:px-14 lg:py-10"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <h2
              id="shop-categories-heading"
              className="font-heading text-2xl font-semibold tracking-tight text-[#2f231b] sm:text-3xl"
            >
              Shop Categories
            </h2>
          </div>

          <div className="mt-5 overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {storefrontCategoryChips.map((chip) => {
                const chipIcon = storefrontCategoryChipIcons[chip.icon]

                return (
                  <a
                    key={chip.href}
                    href={chip.href}
                    className="inline-flex items-center gap-2 rounded-full border border-[rgba(120,87,62,0.16)] bg-[#fbf7f0] px-4 py-2 text-sm font-medium whitespace-nowrap text-[#4b3a2e] transition-colors hover:bg-[#f1e6d7] hover:text-[#2f231b]"
                  >
                    <HugeiconsIcon
                      icon={chipIcon}
                      size={16}
                      strokeWidth={1.7}
                      className="shrink-0 text-current"
                    />
                    <span>{chip.label}</span>
                  </a>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="trending-items-heading"
        className="bg-[linear-gradient(180deg,#f7f3ec_0%,#f2ede4_100%)] px-6 py-16 sm:px-10 lg:px-14 lg:py-20"
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
              className="rounded-full border-[#d7c8b8] bg-[#fbf7f0] px-4 text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
            >
              <Link href="/products">View all</Link>
            </Button>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {trendingStorefrontItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-[1rem] bg-[#2d2926] shadow-[0_20px_40px_rgba(63,41,24,0.18)]"
              >
                <div className="relative h-56 overflow-hidden rounded-[1rem] border-[8px] border-[#2d2926] border-b-0 bg-stone-100">
                  <Image
                    src={item.imageSrc}
                    alt={item.name}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="bg-[#2d2926] px-5 pb-5 pt-4 text-white">
                  <h3 className="font-heading text-[1.25rem] font-semibold leading-none tracking-tight text-white">
                    {item.name}
                  </h3>
                  <p className="mt-4 min-h-14 text-sm leading-6 text-white/82">
                    {item.description}
                  </p>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <p className="text-2xl font-bold tracking-tight text-white">
                      {item.price}
                    </p>
                    <StorefrontAddToCartTrigger
                      product={item}
                      className="rounded-full bg-[#b6492d] px-4 text-white hover:bg-[#c55335]"
                    >
                      Add to cart
                    </StorefrontAddToCartTrigger>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
