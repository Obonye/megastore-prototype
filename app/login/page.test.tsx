import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import LoginPage from "@/app/login/page"

const fetchMock = vi.fn()
const pushMock = vi.fn()
const refreshMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}))

describe("Login page", () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ user: { id: "user-id" } }), { status: 200 })
    )
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
    pushMock.mockReset()
    refreshMock.mockReset()
  })

  it("lets shoppers sign in with an email and password", async () => {
    const user = userEvent.setup()

    render(<LoginPage />)

    await user.type(
      screen.getByLabelText(/email or phone number/i),
      "jane@example.com"
    )
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Signed in successfully."
    )
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          identifier: "jane@example.com",
          password: "password123",
        }),
      })
    )
    expect(pushMock).toHaveBeenCalledWith("/")
    expect(refreshMock).toHaveBeenCalled()
  })

  it("lets shoppers sign in with a phone number and password", async () => {
    const user = userEvent.setup()

    render(<LoginPage />)

    await user.type(
      screen.getByLabelText(/email or phone number/i),
      "+267 71 234 567"
    )
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.click(screen.getByRole("button", { name: /sign in/i }))

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Signed in successfully."
    )
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/login",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          identifier: "+267 71 234 567",
          password: "password123",
        }),
      })
    )
  })

  it("toggles password visibility", async () => {
    const user = userEvent.setup()

    render(<LoginPage />)

    const passwordInput = screen.getByLabelText(/^password$/i)

    expect(passwordInput).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: /show password/i }))

    expect(passwordInput).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: /hide password/i }))

    expect(passwordInput).toHaveAttribute("type", "password")
  })
})
