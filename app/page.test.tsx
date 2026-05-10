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
  it("renders the trending items section with 8 add to cart actions", () => {
    render(<Page />)

    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })
    const trendingSectionQueries = within(trendingSection)

    expect(
      trendingSectionQueries.getByRole("heading", { name: "Trending Items" })
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(8)
  })

  it("renders the first trending item image contract", () => {
    render(<Page />)

    const trendingSection = screen.getByRole("region", {
      name: /trending items/i,
    })
    const trendingSectionQueries = within(trendingSection)

    expect(
      trendingSectionQueries.getByAltText("Angled Scraper Set")
    ).toBeInTheDocument()
    expect(
      trendingSectionQueries.getByText(
        "Sharp edges for smoother buttercream finishes."
      )
    ).toBeInTheDocument()
  })
})
