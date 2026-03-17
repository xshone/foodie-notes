import type { Metadata, Viewport } from "next"
import { Geist } from "next/font/google"
import { ThemeProvider } from "next-themes"
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Foodie Notes",
  description: "My personal recipe collection",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh" className={geistSans.variable} suppressHydrationWarning>
      <body className="antialiased min-h-screen bg-background text-foreground font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
