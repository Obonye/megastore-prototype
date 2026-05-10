import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import CartPage from "@/app/cart/page"
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

describe("Cart page", () => {
  it("shows an empty state when the cart has no items", () => {
    render(
      <StorefrontCartProvider>
        <CartPage />
      </StorefrontCartProvider>
    )

    expect(
      screen.getByRole("heading", { name: /your cart is empty/i })
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /shop products/i })).toHaveAttribute(
      "href",
      "/products"
    )
  })

  it("renders cart items with editable quantity, subtotal, and remove controls", async () => {
    const user = userEvent.setup()
    const firstProduct = storefrontProducts[0]
    const secondProduct = storefrontProducts[2]

    render(
      <StorefrontCartProvider>
        <StorefrontAddToCartTrigger product={firstProduct}>
          Add first item
        </StorefrontAddToCartTrigger>
        <StorefrontAddToCartTrigger product={secondProduct}>
          Add second item
        </StorefrontAddToCartTrigger>
        <CartPage />
      </StorefrontCartProvider>
    )

    await user.click(screen.getByRole("button", { name: /add first item/i }))
    await user.click(screen.getByRole("button", { name: /^add to cart$/i }))
    await user.click(screen.getByRole("button", { name: /add second item/i }))
    await user.click(screen.getByRole("button", { name: /^add to cart$/i }))

    expect(screen.getByText(firstProduct.name)).toBeInTheDocument()
    expect(screen.getByText(secondProduct.name)).toBeInTheDocument()
    expect(screen.getAllByText("P408.00").length).toBeGreaterThan(0)
    expect(
      screen.getAllByRole("heading", { name: /order summary/i }).length
    ).toBeGreaterThan(0)
    expect(screen.getAllByText("Proceed to checkout").length).toBeGreaterThan(0)

    fireEvent.change(screen.getByLabelText(`Quantity for ${firstProduct.name}`), {
      target: { value: "3" },
    })

    expect(screen.getAllByText("P567.00").length).toBeGreaterThan(0)
    expect(screen.getAllByText("P786.00").length).toBeGreaterThan(0)

    await user.click(screen.getAllByRole("button", { name: /remove/i })[1])

    expect(screen.queryByText(secondProduct.name)).not.toBeInTheDocument()
    expect(screen.getAllByText("P567.00").length).toBeGreaterThan(0)
  })
})
