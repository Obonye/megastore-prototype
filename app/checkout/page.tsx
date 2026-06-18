import Link from "next/link"
import { redirect } from "next/navigation"
import { CreditCard, MapPin, PackageCheck, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getCurrentUser } from "@/lib/auth"
import { getCustomerCart } from "@/lib/storefront-cart"

const DELIVERY_FEE = 50

function formatStorefrontPrice(value: number) {
  return `P${value.toFixed(2)}`
}

export default async function CheckoutPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect("/login?next=%2Fcheckout")
  }

  const cart = await getCustomerCart(user.id)
  const subtotal = cart.items.reduce(
    (total, item) => total + item.quantity * item.resolvedUnitPrice,
    0
  )
  const total = subtotal + DELIVERY_FEE

  return (
    <main className="min-h-svh bg-[linear-gradient(180deg,#fffaf6_0%,#efe6da_100%)] px-6 py-28 sm:px-10 lg:px-14 lg:py-32">
      <section className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <div>
          <p className="text-sm uppercase tracking-[0.28em] text-[#8b6b56]">
            Demo checkout
          </p>
          <h1 className="mt-4 font-heading text-4xl font-semibold tracking-tight text-[#2f231b] sm:text-5xl">
            Complete your order
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#6d5544] sm:text-lg">
            This checkout is wired to your saved cart for demonstration purposes. No payment will be processed.
          </p>

          {cart.items.length === 0 ? (
            <div className="mt-10 rounded-[2rem] border border-dashed border-[#ddcfbe] bg-[#fbf7f0] px-6 py-14 text-center shadow-[0_18px_45px_rgba(63,41,24,0.05)]">
              <h2 className="font-heading text-3xl font-semibold tracking-tight text-[#2f231b]">
                Your cart is empty
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-[#6d5544]">
                Add items to your cart before starting checkout.
              </p>
              <Button
                asChild
                className="mt-8 rounded-full bg-[#ffd3e3] px-6 text-[#1a2330] hover:bg-[#ffc5d8]"
              >
                <Link href="/products">Shop products</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-5">
              <section className="rounded-[1.75rem] border border-[rgba(120,87,62,0.14)] bg-[#fbf7f0] p-6 shadow-[0_18px_45px_rgba(63,41,24,0.08)]">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="size-5 text-[#146b5d]" />
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#2f231b]">
                    Customer details
                  </h2>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-[#4b3a2e]">Name</span>
                    <Input readOnly value={user.name} className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]" />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium text-[#4b3a2e]">Email</span>
                    <Input readOnly value={user.email} className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]" />
                  </label>
                  <label className="flex flex-col gap-2 sm:col-span-2">
                    <span className="text-sm font-medium text-[#4b3a2e]">Phone</span>
                    <Input readOnly value={user.phone} className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]" />
                  </label>
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-[rgba(120,87,62,0.14)] bg-[#fbf7f0] p-6 shadow-[0_18px_45px_rgba(63,41,24,0.08)]">
                <div className="flex items-center gap-3">
                  <MapPin className="size-5 text-[#8e0048]" />
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#2f231b]">
                    Delivery details
                  </h2>
                </div>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  <Input placeholder="Street address" className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]" />
                  <Input placeholder="Suburb" className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]" />
                  <Input placeholder="City" defaultValue="Gaborone" className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]" />
                  <Input placeholder="Delivery notes" className="h-12 rounded-2xl border-[#ddcfbe] bg-white text-[#2f231b]" />
                </div>
              </section>

              <section className="rounded-[1.75rem] border border-[rgba(120,87,62,0.14)] bg-[#fbf7f0] p-6 shadow-[0_18px_45px_rgba(63,41,24,0.08)]">
                <div className="flex items-center gap-3">
                  <CreditCard className="size-5 text-[#29318e]" />
                  <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#2f231b]">
                    Payment
                  </h2>
                </div>
                <div className="mt-5 rounded-2xl border border-[#ddcfbe] bg-white p-4 text-sm leading-6 text-[#6d5544]">
                  Demo mode: payment details are intentionally not collected. Use the confirmation button to show the intended final step.
                </div>
                <Button className="mt-5 h-12 rounded-full bg-[#ffd3e3] px-6 text-[#1a2330] hover:bg-[#ffc5d8]">
                  Place demo order
                </Button>
              </section>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[1.75rem] border border-[rgba(120,87,62,0.14)] bg-[#fbf7f0] p-6 shadow-[0_18px_45px_rgba(63,41,24,0.08)] lg:sticky lg:top-32">
          <div className="flex items-center gap-3">
            <PackageCheck className="size-5 text-[#146b5d]" />
            <h2 className="font-heading text-2xl font-semibold tracking-tight text-[#2f231b]">
              Order summary
            </h2>
          </div>

          <div className="mt-6 space-y-4">
            {cart.items.map((item) => (
              <div key={item.cartItemId} className="flex items-start justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold text-[#2f231b]">{item.name}</p>
                  <p className="mt-1 text-[#8b6b56]">Qty {item.quantity}</p>
                </div>
                <p className="font-medium text-[#2f231b]">
                  {formatStorefrontPrice(item.quantity * item.resolvedUnitPrice)}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 border-t border-[#eadbca] pt-6 text-sm text-[#6d5544]">
            <div className="flex justify-between gap-3">
              <span>Subtotal</span>
              <span className="font-medium text-[#2f231b]">{formatStorefrontPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between gap-3">
              <span>Delivery</span>
              <span className="font-medium text-[#2f231b]">{formatStorefrontPrice(DELIVERY_FEE)}</span>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between gap-3 border-t border-[#eadbca] pt-6">
            <span className="text-base font-medium text-[#4b3a2e]">Total</span>
            <span className="font-heading text-2xl font-semibold text-[#2f231b]">
              {formatStorefrontPrice(total)}
            </span>
          </div>

          <Button
            asChild
            variant="outline"
            className="mt-6 h-12 w-full rounded-full border-[#ddcfbe] bg-transparent text-[#4b3a2e] hover:bg-[#f1e6d7] hover:text-[#2f231b]"
          >
            <Link href="/cart">Back to cart</Link>
          </Button>
        </aside>
      </section>
    </main>
  )
}
