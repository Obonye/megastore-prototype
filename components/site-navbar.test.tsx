import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { StorefrontCartProvider } from "@/components/storefront-cart-provider"
import { SiteNavbar } from "@/components/site-navbar"

const fetchMock = vi.fn()

describe("SiteNavbar", () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ user: null }), { status: 200 })
    )
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it("renders the storefront brand, search, top-level nav links, and cart", () => {
    render(
      <StorefrontCartProvider>
        <SiteNavbar />
      </StorefrontCartProvider>
    )

    expect(screen.getByText("The Mega Store")).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText("Search products...")
    ).toBeInTheDocument()
    expect(
      screen.getAllByRole("link", { name: "Shop All" }).length
    ).toBeGreaterThan(0)
    expect(screen.getByRole("button", { name: "Products" })).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /cart/i })).toBeInTheDocument()
  })

  it("renders the shop all nav item as a direct desktop link", () => {
    render(
      <StorefrontCartProvider>
        <SiteNavbar />
      </StorefrontCartProvider>
    )

    expect(
      screen.getAllByRole("link", { name: "Shop All" })[0]
    ).toHaveAttribute("href", "/products")
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
      screen.getAllByRole("link", { name: "Ingredients" }).length
    ).toBeGreaterThan(0)
    expect(
      screen.getAllByRole("link", { name: "Shop All" }).length
    ).toBeGreaterThan(0)
  })

  it("shows login instead of the compact mobile cart when signed out", () => {
    render(
      <StorefrontCartProvider>
        <SiteNavbar />
      </StorefrontCartProvider>
    )

    expect(
      screen.queryByRole("link", { name: /open basket/i })
    ).not.toBeInTheDocument()
    expect(
      screen.getAllByRole("link", { name: "Login" }).length
    ).toBeGreaterThan(1)
  })

  it("shows a signed-in greeting with a signout action", async () => {
    const user = userEvent.setup()
    fetchMock.mockImplementation((input: RequestInfo | URL) => {
      const url = String(input)

      if (url === "/api/auth/me") {
        return Promise.resolve(
          new Response(JSON.stringify({ user: { name: "Jane Doe" } }), {
            status: 200,
          })
        )
      }

      return Promise.resolve(
        new Response(JSON.stringify({ ok: true }), { status: 200 })
      )
    })

    render(
      <StorefrontCartProvider>
        <SiteNavbar />
      </StorefrontCartProvider>
    )

    const greeting = await screen.findByRole("button", {
      name: /hi, jane doe/i,
    })

    expect(
      screen.getByRole("link", { name: /open basket/i })
    ).toBeInTheDocument()

    await user.click(greeting)

    expect(screen.getByRole("menuitem", { name: /profile/i })).toHaveAttribute(
      "href",
      "/profile"
    )

    await user.click(screen.getByRole("menuitem", { name: /sign out/i }))

    expect(fetchMock).toHaveBeenCalledWith("/api/auth/signout", {
      method: "POST",
    })
    expect(
      screen.getAllByRole("link", { name: "Login" }).length
    ).toBeGreaterThan(1)
  })
})
