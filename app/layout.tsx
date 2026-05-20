import { Suspense } from "react"
import { Geist, Geist_Mono, Public_Sans } from "next/font/google"
import type { Viewport } from "next"

import "./globals.css"
import { SiteFooter } from "@/components/site-footer"
import { SiteNavbar } from "@/components/site-navbar"
import { StorefrontCartProvider } from "@/components/storefront-cart-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

const geistHeading = Geist({ subsets: ["latin"], variable: "--font-heading" })

const publicSans = Public_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export const viewport: Viewport = {
  themeColor: "#fffaf6",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "bg-[#fffaf6] font-sans antialiased",
        fontMono.variable,
        publicSans.variable,
        geistHeading.variable
      )}
    >
      <body className="min-h-dvh bg-[#fffaf6]">
        <ThemeProvider>
          <StorefrontCartProvider>
            <div className="min-h-dvh bg-background">
              <Suspense fallback={null}>
                <SiteNavbar />
              </Suspense>
              {children}
              <SiteFooter />
            </div>
          </StorefrontCartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
