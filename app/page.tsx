import Image from "next/image"

import { Button } from "@/components/ui/button"
import { trendingStorefrontItems } from "@/lib/mock-storefront"

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
            <p className="text-sm uppercase tracking-[0.28em] text-primary-foreground/72">
              Client Prototype
            </p>
            <h1 className="mt-4 max-w-2xl font-heading text-4xl font-semibold tracking-tight text-primary-foreground sm:text-5xl lg:text-6xl">
              Baking supplies with a storefront presence worth lingering over.
            </h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-primary-foreground/78 sm:text-lg">
              From fondants and cake boards to finishing tools and decorations,
              the first impression now belongs to the hero image instead of a
              placeholder panel.
            </p>
          </div>

          <div className="grid gap-3 sm:max-w-3xl sm:grid-cols-3">
            <div className="rounded-[1.5rem] border border-white/10 bg-black/24 px-4 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-primary-foreground/62">
                Tools
              </p>
              <p className="mt-2 text-sm text-primary-foreground/88">
                Precision scrapers, piping kits, and bake-day staples.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/24 px-4 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-primary-foreground/62">
                Fondants
              </p>
              <p className="mt-2 text-sm text-primary-foreground/88">
                Smooth finishes, color depth, and decorative freedom.
              </p>
            </div>
            <div className="rounded-[1.5rem] border border-white/10 bg-black/24 px-4 py-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.22em] text-primary-foreground/62">
                Presentation
              </p>
              <p className="mt-2 text-sm text-primary-foreground/88">
                Boards, toppers, ribbons, and display-ready details.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        aria-labelledby="trending-items-heading"
        className="bg-[linear-gradient(180deg,#f7f3ec_0%,#f2ede4_100%)] px-6 py-16 sm:px-10 lg:px-14 lg:py-20"
      >
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-primary/72">
              Merchandising Edit
            </p>
            <h2
              id="trending-items-heading"
              className="mt-4 font-heading text-3xl font-semibold tracking-tight text-foreground sm:text-4xl"
            >
              Trending Items
            </h2>
            <p className="mt-4 text-base leading-7 text-muted-foreground sm:text-lg">
              Eight quick-moving bakery picks arranged as image-led product
              cards for customers who want to browse visually and add to cart
              fast.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {trendingStorefrontItems.map((item) => (
              <article
                key={item.id}
                className="group relative flex min-h-[22rem] overflow-hidden rounded-[2rem] bg-stone-300 shadow-[0_20px_45px_rgba(63,41,24,0.14)] transition-transform duration-200 hover:-translate-y-1"
              >
                <Image
                  src={item.imageSrc}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,18,15,0.08)_0%,rgba(21,18,15,0.22)_38%,rgba(21,18,15,0.88)_100%)]" />

                <div className="relative z-10 mt-auto flex w-full flex-col px-5 pb-5 pt-16 text-white">
                  <h3 className="font-heading text-[1.7rem] font-semibold tracking-tight text-white">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.24em] text-white/72">
                    {item.category}
                  </p>
                  <p className="mt-3 min-h-12 text-sm leading-6 text-white/82">
                    {item.description}
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <p className="text-2xl font-bold tracking-tight text-white">
                      {item.price}
                    </p>
                    <Button className="bg-white/92 px-4 text-stone-950 hover:bg-white">
                      Add to cart
                    </Button>
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
