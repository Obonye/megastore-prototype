import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import Page from "@/app/page"
import { StorefrontCartProvider } from "@/components/storefront-cart-provider"

vi.mock("next/image", () => ({
  default: ({
    alt,
    fill,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    priority?: boolean
  }) => {
    void fill
    void priority

    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={alt ?? ""} />
  },
}))

describe("Home page", () => {
  it("renders the carousel hero, category grid, and trending items section", () => {
    render(
      <StorefrontCartProvider>
        <Page />
      </StorefrontCartProvider>
    )

    expect(
      screen.getByRole("heading", { name: "Shop Baking Essentials." })
    ).toBeInTheDocument()
    const categoriesSection = screen.getByRole("region", {
      name: /shop categories/i,
    })
    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })

    expect(within(categoriesSection).getByText("Shop by category")).toBeInTheDocument()
    const categoryLinks = within(categoriesSection).getAllByRole("link")

    expect(categoryLinks).toHaveLength(16)
    expect(
      within(categoriesSection).getAllByRole("link", { name: /tools/i })[0]
    ).toHaveAttribute("href", "/products?category=Tools")
    expect(
      within(trendingSection).getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getByRole("link", { name: /view all/i })
    ).toHaveAttribute("href", "/products")
    expect(
      within(trendingSection).getAllByRole("button", { name: /add .* to cart/i })
    ).toHaveLength(16)
  })

  it("renders a split-card product preview for the first trending item", () => {
    render(
      <StorefrontCartProvider>
        <Page />
      </StorefrontCartProvider>
    )

    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })
    const trendingSectionQueries = within(trendingSection)

    expect(
      trendingSectionQueries.getAllByAltText("Angled Scraper Set")[0]
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getAllByText("Angled Scraper Set")[0]
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getAllByText(
        "Sharp edges for smoother buttercream finishes."
      )[0]
    ).toBeInTheDocument()
    expect(trendingSectionQueries.getAllByText("P189")[0]).toBeInTheDocument()
  })
})
