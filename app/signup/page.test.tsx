import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import SignupPage from "@/app/signup/page"

const fetchMock = vi.fn()
const pushMock = vi.fn()
const refreshMock = vi.fn()

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
  useSearchParams: () => new URLSearchParams(),
}))

describe("Signup page", () => {
  beforeEach(() => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ user: { id: "user-id" } }), { status: 201 })
    )
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
    pushMock.mockReset()
    refreshMock.mockReset()
  })

  it("creates an account when registration fields are valid", async () => {
    const user = userEvent.setup()

    render(<SignupPage />)

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe")
    await user.type(screen.getByLabelText(/email address/i), "jane@example.com")
    await user.type(screen.getByLabelText(/phone number/i), "+267 71 234 567")
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.type(screen.getByLabelText(/confirm password/i), "password123")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(await screen.findByRole("status")).toHaveTextContent(
      "Account created. You're signed in."
    )
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/register",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({
          name: "Jane Doe",
          email: "jane@example.com",
          phone: "+267 71 234 567",
          password: "password123",
          confirmPassword: "password123",
        }),
      })
    )
    expect(pushMock).toHaveBeenCalledWith("/")
    expect(refreshMock).toHaveBeenCalled()
  })

  it("requires the password confirmation to match", async () => {
    const user = userEvent.setup()

    render(<SignupPage />)

    await user.type(screen.getByLabelText(/full name/i), "Jane Doe")
    await user.type(screen.getByLabelText(/email address/i), "jane@example.com")
    await user.type(screen.getByLabelText(/phone number/i), "+267 71 234 567")
    await user.type(screen.getByLabelText(/^password$/i), "password123")
    await user.type(screen.getByLabelText(/confirm password/i), "different123")
    await user.click(screen.getByRole("button", { name: /create account/i }))

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Passwords do not match."
    )
  })

  it("toggles password and confirmation visibility", async () => {
    const user = userEvent.setup()

    render(<SignupPage />)

    const passwordInput = screen.getByLabelText(/^password$/i)
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i)

    expect(passwordInput).toHaveAttribute("type", "password")
    expect(confirmPasswordInput).toHaveAttribute("type", "password")

    await user.click(screen.getByRole("button", { name: /^show password$/i }))
    await user.click(
      screen.getByRole("button", { name: /show password confirmation/i })
    )

    expect(passwordInput).toHaveAttribute("type", "text")
    expect(confirmPasswordInput).toHaveAttribute("type", "text")

    await user.click(screen.getByRole("button", { name: /^hide password$/i }))
    await user.click(
      screen.getByRole("button", { name: /hide password confirmation/i })
    )

    expect(passwordInput).toHaveAttribute("type", "password")
    expect(confirmPasswordInput).toHaveAttribute("type", "password")
  })
})
