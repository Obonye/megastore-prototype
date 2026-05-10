import { render, screen, within } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import ProductsPage from "@/app/products/page"
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

describe("Products page", () => {
  it("renders the search controls and first page of catalogue items", async () => {
    render(
      <StorefrontCartProvider>
        {await ProductsPage({ searchParams: Promise.resolve({}) })}
      </StorefrontCartProvider>
    )

    expect(
      screen.getByRole("heading", { name: "Products" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("searchbox", { name: /search products/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: /category/i })).toHaveValue("")
    expect(screen.getByRole("combobox", { name: /sort by/i })).toHaveValue(
      "featured"
    )
    expect(
      screen.getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(6)
    expect(screen.getByRole("link", { name: "1" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(screen.getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/products?page=2"
    )
  })

  it("filters catalogue items by search query and category", async () => {
    render(
      <StorefrontCartProvider>
        {await ProductsPage({
          searchParams: Promise.resolve({
            category: "Sprinkles",
            q: "confetti",
          }),
        })}
      </StorefrontCartProvider>
    )

    expect(screen.getByDisplayValue("confetti")).toBeInTheDocument()
    expect(screen.getByRole("combobox", { name: /category/i })).toHaveValue(
      "Sprinkles"
    )
    expect(screen.getByAltText("Golden Confetti Mix")).toBeInTheDocument()
    expect(
      screen.getAllByRole("button", { name: /add to cart/i })
    ).toHaveLength(1)
    expect(screen.queryByText("Ombre Sprinkle Tin")).not.toBeInTheDocument()
    expect(
      screen.queryByText("Precision Offset Spatula")
    ).not.toBeInTheDocument()
  })

  it("renders the second page while preserving pagination links", async () => {
    render(
      <StorefrontCartProvider>
        {await ProductsPage({
          searchParams: Promise.resolve({
            page: "2",
          }),
        })}
      </StorefrontCartProvider>
    )

    expect(screen.getByAltText("Golden Confetti Mix")).toBeInTheDocument()
    expect(
      screen.queryByText("Precision Offset Spatula")
    ).not.toBeInTheDocument()

    const pagination = screen.getByRole("navigation", {
      name: /products pagination/i,
    })

    expect(within(pagination).getByRole("link", { name: "1" })).toHaveAttribute(
      "href",
      "/products"
    )
    expect(within(pagination).getByRole("link", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    )
    expect(within(pagination).getByRole("link", { name: "2" })).toHaveAttribute(
      "href",
      "/products?page=2"
    )
  })

  it("shows a category-specific empty state when a category has no items", async () => {
    render(
      <StorefrontCartProvider>
        {await ProductsPage({
          searchParams: Promise.resolve({
            category: "Presentation",
          }),
        })}
      </StorefrontCartProvider>
    )

    expect(
      screen.getByRole("heading", {
        name: /oops no items in this category yet/i,
      })
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        "Try another category or clear the filter to explore more of the mock catalogue."
      )
    ).toBeInTheDocument()
    expect(
      screen.queryByText("No products match that search")
    ).not.toBeInTheDocument()
  })
})
