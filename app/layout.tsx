import type { Metadata } from 'next'
import { Outfit, Figtree } from 'next/font/google'
// @ts-ignore
import './globals.css'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Toaster } from '@/components/ui/toaster'
import { headers } from 'next/headers'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const figtree = Figtree({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'nexo — Salud, telemedicina y beneficios en Argentina',
  description:
    'Telemedicina con especialidades e inclusión, asesoría legal, descuentos en comercios, cursos, farmacias y turismo. Para todo el país.',
  icons: {
    icon: '/nexo-isotipo.png',
  },
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
      <body
        className={`${outfit.variable} ${figtree.variable} ${figtree.className} antialiased`}
        suppressHydrationWarning
      >
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
