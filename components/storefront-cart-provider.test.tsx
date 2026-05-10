import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { SiteNavbar } from "@/components/site-navbar"
import { StorefrontAddToCartTrigger } from "@/components/storefront-add-to-cart-trigger"
import { StorefrontCartProvider } from "@/components/storefront-cart-provider"
import { storefrontProducts } from "@/lib/mock-storefront"

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

describe("StorefrontCartProvider", () => {
  it("opens the add-to-cart sheet and updates total when quantity changes", async () => {
    const user = userEvent.setup()
    const product = storefrontProducts[0]

    render(
      <StorefrontCartProvider>
        <StorefrontAddToCartTrigger product={product}>
          Add to cart
        </StorefrontAddToCartTrigger>
      </StorefrontCartProvider>
    )

    await user.click(screen.getByRole("button", { name: /add to cart/i }))

    expect(
      screen.getByRole("heading", { name: product.name })
    ).toBeInTheDocument()
    expect(screen.getByAltText(product.name)).toBeInTheDocument()
    expect(screen.getByLabelText(/unit price/i)).toHaveValue("P189.00")
    expect(screen.getByLabelText(/total/i)).toHaveValue("P189.00")

    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: "3" },
    })

    expect(screen.getByLabelText(/total/i)).toHaveValue("P567.00")
  })

  it("caps quantity by remaining stock and updates the shared cart count", async () => {
    const user = userEvent.setup()
    const product = storefrontProducts[1]

    render(
      <StorefrontCartProvider>
        <SiteNavbar />
        <StorefrontAddToCartTrigger product={product}>
          Add to cart
        </StorefrontAddToCartTrigger>
      </StorefrontCartProvider>
    )

    await user.click(screen.getAllByRole("button", { name: /add to cart/i })[0])
    fireEvent.change(screen.getByLabelText(/quantity/i), {
      target: { value: "9" },
    })

    expect(screen.getByLabelText(/quantity/i)).toHaveValue(5)

    await user.click(screen.getByRole("button", { name: /^add to cart$/i }))

    expect(screen.getByRole("link", { name: /^cart/i })).toHaveTextContent("5")

    await user.click(screen.getAllByRole("button", { name: /add to cart/i })[0])

    expect(
      screen.getByText(/you already have the full available stock of this item/i)
    ).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /^add to cart$/i })).toBeDisabled()
  })
})
