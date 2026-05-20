"use client"

import { useState } from "react"

import { ArrowDown01Icon } from "@hugeicons/core-free-icons"
import { HugeiconsIcon } from "@hugeicons/react"

type WhyShopItem = {
  title: string
  description: string
}

type WhyShopAccordionProps = {
  items: WhyShopItem[]
  indicatorClasses: string[]
}

export function WhyShopAccordion({
  items,
  indicatorClasses,
}: WhyShopAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className="rounded-[2rem] border border-[#e5ddd4] bg-[#f3f2ee]">
      {items.map((item, index) => {
        const isOpen = index === openIndex

        return (
          <div
            key={item.title}
            className={index === 0 ? "" : "border-t border-[#e5ddd4]"}
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left sm:px-7"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              <span className="font-heading text-[1.35rem] font-semibold tracking-[-0.04em] text-[#1a2330]">
                {item.title}
              </span>
              <span
                className={`flex size-11 shrink-0 items-center justify-center rounded-full text-[#1a2330] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                  isOpen ? "rotate-180" : ""
                } ${indicatorClasses[index % indicatorClasses.length]}`}
                aria-hidden="true"
              >
                <HugeiconsIcon icon={ArrowDown01Icon} className="size-5" />
              </span>
            </button>

            <div
              className={`grid overflow-hidden transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-6 pb-6 sm:px-7">
                  <p className="text-sm leading-7 text-[#5b6674]">
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
