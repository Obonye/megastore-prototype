import { Geist, Geist_Mono, Public_Sans } from "next/font/google"

import "./globals.css"
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
        "font-sans antialiased",
        fontMono.variable,
        publicSans.variable,
        geistHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <StorefrontCartProvider>
            <div className="min-h-svh bg-background">
              <SiteNavbar />
              {children}
            </div>
          </StorefrontCartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
