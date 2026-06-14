import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import ProfilePage from "@/app/profile/page"

const fetchMock = vi.fn()

describe("Profile page", () => {
  beforeEach(() => {
    fetchMock.mockImplementation(
      (input: RequestInfo | URL, init?: RequestInit) => {
        const url = String(input)

        if (url === "/api/auth/me" && init?.method === "PATCH") {
          return Promise.resolve(
            new Response(
              JSON.stringify({
                user: {
                  id: "user-id",
                  name: "Jane Baker",
                  email: "jane.baker@example.com",
                  phone: "+26771234567",
                },
              }),
              { status: 200 }
            )
          )
        }

        if (url === "/api/auth/password" && init?.method === "PATCH") {
          return Promise.resolve(
            new Response(JSON.stringify({ ok: true }), { status: 200 })
          )
        }

        return Promise.resolve(
          new Response(
            JSON.stringify({
              user: {
                id: "user-id",
                name: "Jane Doe",
                email: "jane@example.com",
                phone: "+26771234567",
              },
            }),
            { status: 200 }
          )
        )
      }
    )
    vi.stubGlobal("fetch", fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    fetchMock.mockReset()
  })

  it("loads and updates customer personal information", async () => {
    const user = userEvent.setup()

    render(<ProfilePage />)

    const nameInput = await screen.findByLabelText(/full name/i)
    const emailInput = screen.getByLabelText(/email address/i)

    expect(nameInput).toHaveValue("Jane Doe")
    expect(emailInput).toHaveValue("jane@example.com")

    await user.clear(nameInput)
    await user.type(nameInput, "Jane Baker")
    await user.clear(emailInput)
    await user.type(emailInput, "jane.baker@example.com")
    await user.click(screen.getByRole("button", { name: /save changes/i }))

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/me",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          name: "Jane Baker",
          email: "jane.baker@example.com",
          phone: "+26771234567",
        }),
      })
    )
    expect(await screen.findByRole("status")).toHaveTextContent(
      "Profile updated."
    )
  })

  it("prompts anonymous shoppers to sign in", async () => {
    fetchMock.mockResolvedValueOnce(
      new Response(JSON.stringify({ user: null }), { status: 200 })
    )

    render(<ProfilePage />)

    expect(
      await screen.findByText(/sign in to view and update your profile/i)
    ).toBeInTheDocument()
    expect(screen.getByRole("link", { name: /sign in/i })).toHaveAttribute(
      "href",
      "/login"
    )
  })

  it("lets signed-in customers change their password", async () => {
    const user = userEvent.setup()

    render(<ProfilePage />)

    await user.type(
      await screen.findByLabelText(/current password/i, { selector: "input" }),
      "oldpass123"
    )
    await user.type(
      screen.getByLabelText(/^new password$/i, { selector: "input" }),
      "newpass123"
    )
    await user.type(
      screen.getByLabelText(/confirm new password/i, { selector: "input" }),
      "newpass123"
    )
    await user.click(screen.getByRole("button", { name: /update password/i }))

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/password",
      expect.objectContaining({
        method: "PATCH",
        body: JSON.stringify({
          currentPassword: "oldpass123",
          newPassword: "newpass123",
          confirmPassword: "newpass123",
        }),
      })
    )
    expect(await screen.findByText("Password updated.")).toBeInTheDocument()
  })

  it("requires the new password confirmation to match", async () => {
    const user = userEvent.setup()

    render(<ProfilePage />)

    await user.type(
      await screen.findByLabelText(/current password/i, { selector: "input" }),
      "oldpass123"
    )
    await user.type(
      screen.getByLabelText(/^new password$/i, { selector: "input" }),
      "newpass123"
    )
    await user.type(
      screen.getByLabelText(/confirm new password/i, { selector: "input" }),
      "different123"
    )
    await user.click(screen.getByRole("button", { name: /update password/i }))

    expect(screen.getByRole("alert")).toHaveTextContent(
      "New passwords do not match."
    )
    expect(fetchMock).not.toHaveBeenCalledWith(
      "/api/auth/password",
      expect.anything()
    )
  })
})
