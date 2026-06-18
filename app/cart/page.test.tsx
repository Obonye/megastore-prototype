import { fireEvent, render, screen, waitFor, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

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
  const fetchMock = vi.fn()

  beforeEach(() => {
    const cartItems: unknown[] = []

    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)

      if (url === "/api/auth/me") {
        return Response.json({ user: { name: "Jane" } })
      }

      if (url === "/api/cart" && !init?.method) {
        return Response.json({ items: cartItems })
      }

      if (url === "/api/cart" && init?.method === "POST") {
        const body = JSON.parse(String(init.body)) as {
          productId: string
          quantity: number
          selectedVariants: Record<string, string>
        }
        const product = storefrontProducts.find((item) => item.id === body.productId)!
        const resolvedUnitPrice = product.unitPrice + (product.variants ?? []).reduce((total, group) => {
          const option = group.options.find((item) => item.value === body.selectedVariants[group.id])
          return total + (option?.priceModifier ?? 0)
        }, 0)
        const existingItem = cartItems.find(
          (item) => (item as { id: string }).id === product.id
        ) as { quantity: number; resolvedUnitPrice: number; selectedVariants: Record<string, string> } | undefined

        if (existingItem) {
          existingItem.quantity += body.quantity
          existingItem.resolvedUnitPrice = resolvedUnitPrice
          existingItem.selectedVariants = body.selectedVariants
        } else {
          cartItems.push({
            ...product,
            cartItemId: `${product.id}-cart`,
            quantity: body.quantity,
            resolvedUnitPrice,
            selectedVariants: body.selectedVariants,
          })
        }

        return Response.json({ items: cartItems }, { status: 201 })
      }

      if (url.startsWith("/api/cart/") && init?.method === "PATCH") {
        const body = JSON.parse(String(init.body)) as { quantity: number }
        const cartItemId = url.split("/").at(-1)
        const existingItem = cartItems.find(
          (item) => (item as { cartItemId: string }).cartItemId === cartItemId
        ) as { quantity: number } | undefined

        if (existingItem) {
          existingItem.quantity = body.quantity
        }

        return Response.json({ items: cartItems })
      }

      if (url.startsWith("/api/cart/") && init?.method === "DELETE") {
        const cartItemId = url.split("/").at(-1)
        const index = cartItems.findIndex(
          (item) => (item as { cartItemId: string }).cartItemId === cartItemId
        )

        if (index >= 0) {
          cartItems.splice(index, 1)
        }

        return Response.json({ items: cartItems })
      }

      return Response.json({ items: cartItems })
    })

    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it("shows an empty state when the cart has no items", async () => {
    render(
      <StorefrontCartProvider>
        <CartPage />
      </StorefrontCartProvider>
    )

    expect(
      await screen.findByRole("heading", { name: /your cart is empty/i })
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

    await user.click(screen.getAllByRole("button", { name: /add to cart/i })[0])
    await user.click(screen.getByRole("button", { name: /^add to cart$/i }))
    await user.click(screen.getAllByRole("button", { name: /add to cart/i })[1])
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
    expect(screen.getAllByText("P567.00").length).toBeGreaterThan(0)
    expect(screen.queryByText(/estimated tax/i)).not.toBeInTheDocument()

    const secondProductRow = screen.getByText(secondProduct.name).closest("article")
    expect(secondProductRow).not.toBeNull()

    await user.click(
      within(secondProductRow as HTMLElement).getByRole("button", { name: /remove/i })
    )

    await waitFor(() => {
      expect(screen.queryByText(secondProduct.name)).not.toBeInTheDocument()
    })
    expect(screen.getAllByText("P567.00").length).toBeGreaterThan(0)
  })

  it("keeps the latest quantity when update responses return out of order", async () => {
    const user = userEvent.setup()
    const product = storefrontProducts[0]
    const patchResolvers: Array<(value: Response) => void> = []

    fetchMock.mockImplementation(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input)

      if (url === "/api/auth/me") {
        return Response.json({ user: { name: "Jane" } })
      }

      if (url === "/api/cart" && !init?.method) {
        return Response.json({
          items: [
            {
              ...product,
              cartItemId: `${product.id}-cart`,
              quantity: 1,
              resolvedUnitPrice: product.unitPrice,
              selectedVariants: {},
            },
          ],
        })
      }

      if (url.startsWith("/api/cart/") && init?.method === "PATCH") {
        return new Promise<Response>((resolve) => patchResolvers.push(resolve))
      }

      return Response.json({ items: [] })
    })

    render(
      <StorefrontCartProvider>
        <CartPage />
      </StorefrontCartProvider>
    )

    const quantityInput = await screen.findByLabelText(`Quantity for ${product.name}`)

    fireEvent.change(quantityInput, { target: { value: "2" } })
    fireEvent.change(quantityInput, { target: { value: "3" } })

    expect(quantityInput).toHaveValue(3)

    patchResolvers[1]?.(
      Response.json({
        items: [
          {
            ...product,
            cartItemId: `${product.id}-cart`,
            quantity: 3,
            resolvedUnitPrice: product.unitPrice,
            selectedVariants: {},
          },
        ],
      })
    )
    patchResolvers[0]?.(
      Response.json({
        items: [
          {
            ...product,
            cartItemId: `${product.id}-cart`,
            quantity: 2,
            resolvedUnitPrice: product.unitPrice,
            selectedVariants: {},
          },
        ],
      })
    )

    await user.tab()

    expect(quantityInput).toHaveValue(3)
  })
})
