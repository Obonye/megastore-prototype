"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

import { ArrowLeft01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

import type { StorefrontHeroSlide } from "@/lib/mock-storefront"

type ProductsHeroCarouselProps = {
  slides: StorefrontHeroSlide[]
}

const heroPrimaryButtonClasses = [
  "bg-[#ff6b9a] hover:bg-[#f85a8d]",
  "bg-[#32c7b0] hover:bg-[#28b6a0]",
  "bg-[#ff9f43] hover:bg-[#f28f2f]",
]

export function ProductsHeroCarousel({ slides }: ProductsHeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((previousIndex) => (previousIndex + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(interval)
  }, [slides.length])

  return (
    <section className="relative overflow-hidden bg-[#fffaf6]">
      <div className="group relative">
        <div
          className="flex transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide, slideIndex) => (
            <article
              key={slide.id}
              className="relative min-h-[39rem] w-full shrink-0 md:min-h-[46rem]"
            >
              <Image
                src={slide.imageSrc}
                alt={slide.imageAlt}
                fill
                priority
                className="object-cover"
                sizes="100vw"
              />
              <div className={`absolute inset-0 ${slide.overlayClassName}`} />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.46),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(255,214,231,0.3),transparent_30%),radial-gradient(circle_at_20%_30%,rgba(205,231,234,0.24),transparent_30%)]" />

              <div className="relative mx-auto flex min-h-[39rem] max-w-[96rem] items-center justify-center px-6 py-12 sm:px-10 md:min-h-[46rem] lg:px-16">
                <div className="max-w-[62rem] px-1 py-2 text-center text-[#1a2330] sm:px-0">
                  <h1
                    className={`max-w-[12ch] font-heading text-[clamp(4.2rem,10vw,8rem)] font-semibold leading-[0.88] tracking-[-0.04em] [text-shadow:0_2px_18px_rgba(18,16,13,0.18)] ${
                      slide.titleColorClassName ?? "text-[#ff6b9a]"
                    }`}
                  >
                    {slide.title}
                  </h1>
                  <p className="mx-auto mt-6 max-w-[44rem] text-base font-semibold leading-8 text-[#fff4df] md:text-lg">
                    {slide.description}
                  </p>

                  <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Link
                      href={slide.primaryCtaHref}
                      className={`inline-flex items-center justify-center rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#1a2330] transition-[transform,filter] duration-300 hover:-translate-y-0.5 hover:brightness-95 ${
                        slide.primaryButtonClassName ??
                        heroPrimaryButtonClasses[
                          slideIndex % heroPrimaryButtonClasses.length
                        ]
                      }`}
                    >
                      {slide.primaryCtaLabel}
                    </Link>
                    <Link
                      href={slide.secondaryCtaHref}
                      className="inline-flex items-center justify-center rounded-full border border-[#d9cec1] bg-white/72 px-7 py-3.5 text-sm font-semibold uppercase tracking-[0.16em] text-[#4b3a2e] transition-colors duration-300 hover:bg-white"
                    >
                      {slide.secondaryCtaLabel}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto flex max-w-[96rem] items-end justify-between px-6 pb-6 sm:px-10 lg:px-16">
          <div className="pointer-events-auto flex gap-2">
            {slides.map((slide, index) => {
              const isActive = index === currentIndex

              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    isActive
                      ? "w-10 bg-[#ff6b9a]"
                      : "w-3 bg-white/55 hover:bg-[#ffd3e3]"
                  }`}
                  aria-label={`View ${slide.eyebrow} slide`}
                  aria-pressed={isActive}
                />
              )
            })}
          </div>

          <div className="pointer-events-auto hidden gap-3 md:flex">
            <button
              type="button"
              onClick={() =>
                setCurrentIndex((currentIndex - 1 + slides.length) % slides.length)
              }
              className="flex size-12 items-center justify-center rounded-full bg-[#ffd3e3] text-[#1a2330] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-95"
              aria-label="Previous slide"
            >
              <HugeiconsIcon icon={ArrowLeft01Icon} className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentIndex((currentIndex + 1) % slides.length)}
              className="flex size-12 items-center justify-center rounded-full bg-[#cceee7] text-[#1a2330] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-95"
              aria-label="Next slide"
            >
              <HugeiconsIcon icon={ArrowRight01Icon} className="size-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
