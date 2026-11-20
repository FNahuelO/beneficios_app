import type { Metadata, Viewport } from 'next'
import { Outfit, Figtree } from 'next/font/google'
// @ts-ignore
import './globals.css'
import { SiteChrome } from '@/components/layout/site-chrome'
import { Toaster } from '@/components/ui/toaster'
import { JsonLd } from '@/components/seo/json-ld'
import { PwaProvider } from '@/components/pwa/pwa-provider'
import {
  buildMetadata,
  getSiteUrl,
  organizationJsonLd,
  siteConfig,
  websiteJsonLd,
} from '@/lib/seo'

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

const baseMetadata = buildMetadata()

export const metadata: Metadata = {
  ...baseMetadata,
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: `${siteConfig.name} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.name}`,
  },
  icons: {
    icon: [
      { url: '/icons/icon-16.png', sizes: '16x16', type: 'image/png' },
      { url: '/icons/icon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/icons/icon-192.png',
    apple: [{ url: '/icons/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  appleWebApp: {
    capable: true,
    title: siteConfig.name,
    statusBarStyle: 'black-translucent',
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: false,
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#EFF7FE' },
    { media: '(prefers-color-scheme: dark)', color: '#0A2A32' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es-AR" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${figtree.variable} ${figtree.className} antialiased`}
        suppressHydrationWarning
      >
        <JsonLd data={[organizationJsonLd(), websiteJsonLd()]} />
        <SiteChrome>{children}</SiteChrome>
        <PwaProvider />
        <Toaster />
      </body>
    </html>
  )
}
