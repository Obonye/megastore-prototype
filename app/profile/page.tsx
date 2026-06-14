"use client"

import { useEffect, useId, useState, type FormEvent } from "react"
import Link from "next/link"
import { Eye, EyeOff, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type ProfileUser = {
  id: string
  name: string
  email: string
  phone: string
}

type ProfileResponse = {
  user: ProfileUser | null
  error?: string
}

type PasswordResponse = {
  ok?: boolean
  error?: string
}

function PasswordInput({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
}) {
  const inputId = useId()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase"
      >
        {label}
      </label>
      <div className="relative">
        <Input
          id={inputId}
          name={name}
          type={showPassword ? "text" : "password"}
          autoComplete={
            name === "currentPassword" ? "current-password" : "new-password"
          }
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          minLength={8}
          className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 pr-12 text-[#1a2330] placeholder:text-[#a89f97]"
        />
        <button
          type="button"
          aria-label={showPassword ? `Hide ${label}` : `Show ${label}`}
          onClick={() => setShowPassword((current) => !current)}
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-[#66717f] transition-colors hover:text-[#1a2330] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {showPassword ? (
            <EyeOff className="size-4" aria-hidden="true" />
          ) : (
            <Eye className="size-4" aria-hidden="true" />
          )}
        </button>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  const [confirmPassword, setConfirmPassword] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isPasswordSubmitting, setIsPasswordSubmitting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [name, setName] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [phone, setPhone] = useState("")
  const [user, setUser] = useState<ProfileUser | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch("/api/auth/me")
        const data = (await response.json()) as ProfileResponse

        if (!response.ok || !data.user) {
          setUser(null)
          return
        }

        setUser(data.user)
        setName(data.user.name)
        setEmail(data.user.email)
        setPhone(data.user.phone)
      } catch {
        setError("Unable to load your profile.")
      } finally {
        setIsLoading(false)
      }
    }

    void loadProfile()
  }, [])

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone }),
      })
      const data = (await response.json()) as ProfileResponse

      if (!response.ok || !data.user) {
        setError(data.error ?? "Unable to update your profile.")
        return
      }

      setUser(data.user)
      setName(data.user.name)
      setEmail(data.user.email)
      setPhone(data.user.phone)
      window.dispatchEvent(new Event("storefront-auth-changed"))
      setMessage("Profile updated.")
    } catch {
      setError("Unable to update your profile. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePasswordSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setPasswordError("")
    setPasswordMessage("")

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.")
      return
    }

    setIsPasswordSubmitting(true)

    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
      })
      const data = (await response.json()) as PasswordResponse

      if (!response.ok) {
        setPasswordError(data.error ?? "Unable to update your password.")
        return
      }

      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setPasswordMessage("Password updated.")
    } catch {
      setPasswordError("Unable to update your password. Please try again.")
    } finally {
      setIsPasswordSubmitting(false)
    }
  }

  return (
    <main className="min-h-[calc(100dvh-6rem)] bg-[#fffaf6] px-4 py-16 sm:px-6 lg:px-16">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex flex-col gap-3 text-center sm:items-center">
          <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#d9dcff]">
            <User className="size-6 text-[#29318e]" />
          </div>
          <div>
            <h1 className="font-heading text-3xl font-semibold tracking-[-0.04em] text-[#1a2330]">
              Your profile
            </h1>
            <p className="mt-2 text-sm text-[#66717f]">
              Keep your contact details up to date for orders and deliveries.
            </p>
          </div>
        </div>

        {isLoading ? (
          <section className="rounded-[2rem] border border-[#e5ddd4] bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm text-[#66717f]" role="status">
              Loading your profile...
            </p>
          </section>
        ) : user ? (
          <div className="flex flex-col gap-6">
            <section className="rounded-[2rem] border border-[#e5ddd4] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="font-heading text-xl font-semibold tracking-[-0.04em] text-[#1a2330]">
                  Personal information
                </h2>
                <p className="mt-1 text-sm text-[#66717f]">
                  Update the details we use for your account and orders.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase">
                    Full name
                  </span>
                  <Input
                    name="name"
                    type="text"
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase">
                    Email address
                  </span>
                  <Input
                    name="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                  />
                </label>

                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase">
                    Phone number
                  </span>
                  <Input
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                  />
                </label>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="h-12 w-full rounded-full bg-[#ffd3e3] text-sm font-semibold tracking-[0.12em] text-[#1a2330] uppercase hover:bg-[#ffc5d8]"
                >
                  {isSubmitting ? "Saving..." : "Save changes"}
                </Button>

                {error ? (
                  <p
                    className="rounded-2xl bg-[#fff0f4] px-4 py-3 text-sm font-medium text-[#8e0048]"
                    role="alert"
                  >
                    {error}
                  </p>
                ) : null}

                {message ? (
                  <p
                    className="rounded-2xl bg-[#e8fbf7] px-4 py-3 text-sm font-medium text-[#146b5d]"
                    role="status"
                  >
                    {message}
                  </p>
                ) : null}
              </form>
            </section>

            <section className="rounded-[2rem] border border-[#e5ddd4] bg-white p-6 shadow-sm sm:p-8">
              <div className="mb-6">
                <h2 className="font-heading text-xl font-semibold tracking-[-0.04em] text-[#1a2330]">
                  Change password
                </h2>
                <p className="mt-1 text-sm text-[#66717f]">
                  Enter your current password before choosing a new one.
                </p>
              </div>

              <form
                onSubmit={handlePasswordSubmit}
                className="flex flex-col gap-5"
              >
                <PasswordInput
                  label="Current password"
                  name="currentPassword"
                  value={currentPassword}
                  onChange={setCurrentPassword}
                />
                <PasswordInput
                  label="New password"
                  name="newPassword"
                  value={newPassword}
                  onChange={setNewPassword}
                />
                <PasswordInput
                  label="Confirm new password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={setConfirmPassword}
                />

                <Button
                  type="submit"
                  disabled={isPasswordSubmitting}
                  className="h-12 w-full rounded-full bg-[#d9dcff] text-sm font-semibold tracking-[0.12em] text-[#1a2330] uppercase hover:bg-[#cdd2ff]"
                >
                  {isPasswordSubmitting ? "Updating..." : "Update password"}
                </Button>

                {passwordError ? (
                  <p
                    className="rounded-2xl bg-[#fff0f4] px-4 py-3 text-sm font-medium text-[#8e0048]"
                    role="alert"
                  >
                    {passwordError}
                  </p>
                ) : null}

                {passwordMessage ? (
                  <p
                    className="rounded-2xl bg-[#e8fbf7] px-4 py-3 text-sm font-medium text-[#146b5d]"
                    role="status"
                  >
                    {passwordMessage}
                  </p>
                ) : null}
              </form>
            </section>
          </div>
        ) : (
          <section className="rounded-[2rem] border border-[#e5ddd4] bg-white p-6 shadow-sm sm:p-8">
            <div className="text-center">
              <p className="text-sm text-[#66717f]">
                Sign in to view and update your profile.
              </p>
              <Button
                asChild
                className="mt-5 h-12 rounded-full bg-[#ffd3e3] px-8 text-sm font-semibold tracking-[0.12em] text-[#1a2330] uppercase hover:bg-[#ffc5d8]"
              >
                <Link href="/login">Sign in</Link>
              </Button>
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
