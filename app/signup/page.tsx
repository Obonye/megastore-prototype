"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ShoppingBag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Step = "credentials" | "otp"

export default function SignupPage() {
  const [step, setStep] = useState<Step>("credentials")
  const [phone, setPhone] = useState("")
  const [otp, setOtp] = useState(["", "", "", "", "", ""])
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  function handleCredentialsSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStep("otp")
  }

  function handleOtpChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return
    const next = [...otp]
    next[index] = value.slice(-1)
    setOtp(next)
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus()
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Account creation logic goes here
  }

  return (
    <main className="flex min-h-[calc(100dvh-6rem)] items-center justify-center bg-[#fffaf6] px-4 py-16">
      <div className="w-full max-w-md">

        {/* Brand mark */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-[#ffd3e3]">
            <ShoppingBag className="size-6 text-[#8e0048]" />
          </div>
          <div>
            <p className="font-heading text-2xl font-semibold tracking-[-0.04em] text-[#1a2330]">
              Create your account
            </p>
            <p className="mt-1 text-sm text-[#66717f]">
              Join The Mega Store and start shopping
            </p>
          </div>
        </div>

        <div className="rounded-[2rem] border border-[#e5ddd4] bg-white p-8 shadow-sm">
          {step === "credentials" ? (
            <form onSubmit={handleCredentialsSubmit} className="flex flex-col gap-5">
              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b6674]">
                  Full name
                </span>
                <Input
                  type="text"
                  placeholder="Jane Doe"
                  required
                  className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b6674]">
                  Email address
                </span>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b6674]">
                  Phone number
                </span>
                <Input
                  type="tel"
                  placeholder="+267 7X XXX XXXX"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b6674]">
                  Password
                </span>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                />
              </label>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#5b6674]">
                  Confirm password
                </span>
                <Input
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  className="h-12 rounded-full border-[#e5ddd4] bg-[#faf8f5] px-5 text-[#1a2330] placeholder:text-[#a89f97]"
                />
              </label>

              <p className="text-xs leading-5 text-[#8e9aab]">
                By creating an account you agree to our{" "}
                <Link href="/terms" className="font-semibold text-[#8e0048] hover:text-[#6f0038]">
                  Terms of use
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="font-semibold text-[#8e0048] hover:text-[#6f0038]">
                  Privacy policy
                </Link>
                .
              </p>

              <Button
                type="submit"
                className="h-12 w-full rounded-full bg-[#ffd3e3] text-sm font-semibold tracking-[0.12em] text-[#1a2330] uppercase hover:bg-[#ffc5d8]"
              >
                Create account
              </Button>
            </form>
          ) : (
            <form onSubmit={handleOtpSubmit} className="flex flex-col gap-6">
              <div className="text-center">
                <p className="font-heading text-lg font-semibold text-[#1a2330]">
                  Verify your phone
                </p>
                <p className="mt-1.5 text-sm text-[#66717f]">
                  We sent a 6-digit code to{" "}
                  <span className="font-semibold text-[#1a2330]">{phone || "your phone"}</span>
                </p>
              </div>

              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    aria-label={`OTP digit ${i + 1}`}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="size-12 rounded-2xl border border-[#e5ddd4] bg-[#faf8f5] text-center text-lg font-semibold text-[#1a2330] outline-none transition-colors focus:border-[#ff6b9a] focus:ring-2 focus:ring-[#ffd3e3]"
                  />
                ))}
              </div>

              <Button
                type="submit"
                disabled={otp.some((d) => !d)}
                className="h-12 w-full rounded-full bg-[#ffd3e3] text-sm font-semibold tracking-[0.12em] text-[#1a2330] uppercase hover:bg-[#ffc5d8] disabled:opacity-50"
              >
                Verify &amp; Create account
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setStep("credentials")}
                  className="text-sm text-[#66717f] underline-offset-2 hover:underline"
                >
                  Go back
                </button>
                <span className="mx-2 text-[#d4ccc6]">·</span>
                <button
                  type="button"
                  className="text-sm font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
                >
                  Resend code
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="mt-6 text-center text-sm text-[#66717f]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-semibold text-[#8e0048] transition-colors hover:text-[#6f0038]"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
