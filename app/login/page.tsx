"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff, ShoppingBag } from "lucide-react"

import { LoadingIndicator } from "@/components/loading-indicator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = getSafeNextPath(searchParams.get("next"))
  const [identifier, setIdentifier] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setMessage("")
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, password }),
      })
      const data = (await response.json()) as { error?: string }

      if (!response.ok) {
        setError(data.error ?? "Unable to sign in.")
        return
      }

      window.dispatchEvent(new Event("storefront-auth-changed"))
      setMessage("Signed in successfully.")
      router.push(nextPath)
      router.refresh()
    } catch {
      setError("Unable to sign in. Please try again.")
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
              Welcome back
            </h1>
            <p className="mt-1 text-sm text-[#66717f]">
              {nextPath === "/"
                ? "Sign in with your email or phone number."
                : "Sign in first, then we’ll send you back to where you were shopping."}
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#e5ddd4] bg-white p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase">
                Email or phone number
              </span>
              <Input
                name="identifier"
                type="text"
                inputMode="email"
                autoComplete="username"
                placeholder="you@example.com or +267 7X XXX XXXX"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
              />
            </label>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="text-xs font-semibold tracking-[0.18em] text-[#5b6674] uppercase"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-xs font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="mt-1 h-12 w-full rounded-full bg-[#ffd3e3] text-sm font-semibold tracking-[0.12em] text-[#1a2330] uppercase hover:bg-[#ffc5d8]"
            >
              {isSubmitting ? <LoadingIndicator label="Signing in..." /> : "Sign in"}
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
        </div>

        <p className="mt-6 text-center text-sm text-[#66717f]">
          Don&apos;t have an account?{" "}
          <Link
            href={nextPath === "/" ? "/signup" : `/signup?next=${encodeURIComponent(nextPath)}`}
            className="font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
          >
            Sign up
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
