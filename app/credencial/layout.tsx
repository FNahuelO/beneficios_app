import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Mi Credencial',
  path: '/credencial',
  description:
    'Consultá tu credencial digital nexo, estado de socio y acceso a beneficios con código QR.',
  keywords: ['credencial digital', 'credencial nexo', 'número de socio', 'QR beneficios'],
})

export default function CredencialLayout({ children }: { children: React.ReactNode }) {
  return children
}
