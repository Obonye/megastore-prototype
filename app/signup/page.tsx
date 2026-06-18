"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"

import { LoadingIndicator } from "@/components/loading-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get("next"))
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    if (password !== confirmPassword) {
      setMessage("")
      setError("Passwords do not match.")
      return
    }

    setError("")
    setMessage("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          phone: formData.get("phone"),
          password,
          confirmPassword,
        }),
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? "Unable to create account.")
        return
      }

      window.dispatchEvent(new Event("storefront-auth-changed"))
      setMessage("Account created. You're signed in.")
      router.push(nextPath)
      router.refresh()
    } catch {
      setError("Unable to create account. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="flex min-h-[calc(100dvh-6rem)] items-center justify-center bg-[#fffaf6] px-4 py-16">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#ffd3e3]">
            <ShoppingBag className="size-6 text-[#8e0048]" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-semibold tracking-[-0.04em] text-[#1a2330]">
              Create your account
            </h1>
            <p className="mt-1 text-sm text-[#66717f]">
              Join The Mega Store and start shopping.
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#e5ddd4] bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase">
                Full name
              </span>
              <Input
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Jane Doe"
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
                placeholder="you@example.com"
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
                placeholder="+267 7X XXX XXXX"
                required
                className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase">
                Password
              </span>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "signup-password-error" : undefined}
                  className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 pr-12 text-[#1a2330] placeholder:text-[#a89f97]"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
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
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase">
                Confirm password
              </span>
              <div className="relative">
                <Input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                  aria-invalid={Boolean(error)}
                  aria-describedby={error ? "signup-password-error" : undefined}
                  className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 pr-12 text-[#1a2330] placeholder:text-[#a89f97]"
                />
                <button
                  type="button"
                  aria-label={
                    showConfirmPassword
                      ? "Hide password confirmation"
                      : "Show password confirmation"
                  }
                  onClick={() => setShowConfirmPassword((current) => !current)}
                  className="absolute top-1/2 right-4 -translate-y-1/2 rounded-full p-1 text-[#66717f] transition-colors hover:text-[#1a2330] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" aria-hidden="true" />
                  ) : (
                    <Eye className="size-4" aria-hidden="true" />
                  )}
                </button>
              </div>
            </label>

            {error ? (
              <p
                id="signup-password-error"
                className="rounded-2xl bg-[#fff0f4] px-4 py-3 text-sm font-medium text-[#8e0048]"
                role="alert"
              >
                {error}
              </p>
            ) : null}

            <p className="text-xs leading-5 text-[#8e9aab]">
              By creating an account you agree to our{" "}
              <Link
                href="/terms"
                className="font-semibold text-[#8e0048] hover:text-[#6f0038]"
              >
                Terms of use
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-semibold text-[#8e0048] hover:text-[#6f0038]"
              >
                Privacy policy
              </Link>
              .
            </p>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-full bg-[#ffd3e3] text-sm font-semibold tracking-[0.12em] text-[#1a2330] uppercase hover:bg-[#ffc5d8]"
            >
              {isSubmitting ? (
                <LoadingIndicator label="Creating account..." />
              ) : (
                "Create account"
              )}
            </Button>

            {message ? (
              <p
                className="rounded-2xl bg-[#e8fbf7] px-4 py-3 text-sm font-medium text-[#146b5d]"
                role="status"
              >
                {message}
              </p>
            ) : null}
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-[#66717f]">
          Already have an account?{" "}
          <Link
            href={nextPath === "/" ? "/login" : `/login?next=${encodeURIComponent(nextPath)}`}
            className="font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) return "/"
  return next
}
