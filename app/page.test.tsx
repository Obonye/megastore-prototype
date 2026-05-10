import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import Page from "@/app/page"

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
  it("renders the categories strip and trending items section", () => {
    render(<Page />)

    const categoriesSection = screen.getByRole("region", {
      name: /shop categories/i,
    })
    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })

    expect(
      within(categoriesSection).getByRole("heading", {
        name: "Shop Categories",
      })
    ).toBeInTheDocument()
    expect(within(categoriesSection).getAllByRole("link")).toHaveLength(8)
    expect(
      within(categoriesSection).getByRole("link", { name: "Tools" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      within(trendingSection).getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
  })

  it("renders a split-card product preview for the first trending item", () => {
    render(<Page />)

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
