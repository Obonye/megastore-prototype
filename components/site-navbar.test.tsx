import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { StorefrontCartProvider } from "@/components/storefront-cart-provider"
import { SiteNavbar } from "@/components/site-navbar"

describe("SiteNavbar", () => {
  it("renders the storefront brand, search, top-level nav links, and cart", () => {
    render(
      <StorefrontCartProvider>
        <SiteNavbar />
      </StorefrontCartProvider>
    )

    expect(screen.getByText("The Mega Store")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("Search products, tools, decorations...")
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Contact Us" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument()
  })

  it("renders the products nav item as a direct desktop link", () => {
    render(
      <StorefrontCartProvider>
        <SiteNavbar />
      </StorefrontCartProvider>
    )

    expect(screen.getByRole("link", { name: "Products" })).toHaveAttribute(
      "href",
      "/products"
    )
    expect(screen.getByRole("link", { name: /^cart/i })).toHaveAttribute(
      "href",
      "/cart"
    )
  })

  it("opens the mobile menu from the menu trigger", async () => {
    const user = userEvent.setup()

    render(
      <StorefrontCartProvider>
        <SiteNavbar />
      </StorefrontCartProvider>
    )

    await user.click(
      screen.getByRole("button", { name: /open navigation menu/i })
    )

    expect(screen.getByText("Browse the shop")).toBeInTheDocument()
    expect(
      screen.getByRole("link", { name: "Contact Us" })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: "Products" })).toBeInTheDocument()
  })
})
