import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

import { ThemeProvider } from "@/components/theme-provider"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { CartProvider } from "@/hooks/use-cart"
import { OrderProvider } from "@/hooks/use-orders"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Cloud Kitchen",
  description: "Order customized meals delivered to your doorstep",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem={false}
          disableTransitionOnChange
          storageKey="cloud-kitchen-theme"
        >
          <CartProvider>
            <OrderProvider>
              <div className="relative flex min-h-screen flex-col">
                <SiteHeader />
                <main className="flex-1">{children}</main>
                <SiteFooter />
              </div>
            </OrderProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
