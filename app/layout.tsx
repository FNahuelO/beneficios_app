import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { auth } from '@/lib/auth'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Beneficios - Tu plataforma de descuentos y ventajas',
  description: 'Accedé a descuentos exclusivos en salud, gastronomía, educación, deportes y más.',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const session = await auth()
  const isLoggedIn = !!session?.user

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <div className="flex min-h-screen flex-col">
          {!isLoggedIn && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isLoggedIn && <Footer />}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
