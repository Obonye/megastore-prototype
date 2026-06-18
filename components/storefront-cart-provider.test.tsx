import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { SiteNavbar } from "@/components/site-navbar"
import { ProductVariantSelector } from "@/components/product-variant-selector"
import { StorefrontAddToCartTrigger } from "@/components/storefront-add-to-cart-trigger"
import { StorefrontCartProvider } from "@/components/storefront-cart-provider"
import { storefrontProducts } from "@/lib/mock-storefront"

const pushMock = vi.fn()
const refreshMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
  useSearchParams: () => new URLSearchParams(),
}))

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

      return Response.json({ items: cartItems })
    })

    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
    pushMock.mockReset()
    refreshMock.mockReset()
  })

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

  it("adds product page variant and quantity selections without opening the cart sheet", async () => {
    const user = userEvent.setup()
    const product = storefrontProducts[2]

    render(
      <StorefrontCartProvider>
        <ProductVariantSelector product={product} />
      </StorefrontCartProvider>
    )

    await user.click(screen.getByRole("button", { name: /48-piece/i }))
    fireEvent.change(screen.getByLabelText(`Quantity for ${product.name}`), {
      target: { value: "3" },
    })
    await user.click(screen.getByRole("button", { name: /add .* to cart/i }))

    const postCall = fetchMock.mock.calls.find(
      ([url, init]) => url === "/api/cart" && (init as RequestInit | undefined)?.method === "POST"
    )
    const body = JSON.parse(String((postCall?.[1] as RequestInit).body))

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()
    expect(screen.getByRole("status")).toHaveTextContent("Added to cart.")
    expect(pushMock).toHaveBeenCalledWith("/cart")
    expect(refreshMock).toHaveBeenCalled()
    expect(body).toEqual({
      productId: product.id,
      quantity: 3,
      selectedVariants: { quantity: "48" },
    })
  })
})
