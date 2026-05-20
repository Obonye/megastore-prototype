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
      screen.getByRole("heading", { name: "The Art of Baking." })
    ).toBeInTheDocument()
    const categoriesSection = screen.getByRole("region", {
      name: /shop categories/i,
    })
    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })

    expect(
      within(categoriesSection).getByRole("heading", {
        name: "Explore every station in the bakery.",
      })
    ).toBeInTheDocument()
    const categoryLinks = within(categoriesSection).getAllByRole("link")

    expect(categoryLinks).toHaveLength(8)
    expect(
      within(categoriesSection).getByRole("link", { name: /tools/i })
    ).toHaveAttribute("href", "/products?category=Tools")
    expect(
      within(trendingSection).getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getByRole("link", { name: /view all/i })
    ).toHaveAttribute("href", "/products")
    expect(
      within(trendingSection).getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
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
      trendingSectionQueries.getByAltText("Angled Scraper Set")
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getByText("Angled Scraper Set")
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getByText(
        "Sharp edges for smoother buttercream finishes."
      )
    ).toBeInTheDocument()
    expect(trendingSectionQueries.getByText("P189")).toBeInTheDocument()
  })
})
