import type { Metadata } from 'next'
import localFont from 'next/font/local'
// @ts-ignore
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { headers } from 'next/headers'

const inter = localFont({
  src: [
    {
      path: './fonts/Inter-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/Inter-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/Inter-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
  ],
  variable: '--font-inter',
  display: 'swap',
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
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || ''
  const isAdminRoute = pathname.startsWith('/admin')

  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`} suppressHydrationWarning>
        <div className="flex min-h-screen flex-col">
          {!isAdminRoute && <Navbar />}
          <main className="flex-1">{children}</main>
          {!isAdminRoute && <Footer />}
        </div>
        <Toaster />
      </body>
    </html>
  )
}
