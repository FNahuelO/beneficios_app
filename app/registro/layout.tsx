import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export const metadata: Metadata = buildMetadata({
  title: 'Registro',
  path: '/registro',
  description:
    'Registrate en nexo y accedé a telemedicina, asesoría legal y beneficios en toda Argentina.',
  keywords: ['registro nexo', 'asociarse nexo', 'credencial digital', 'sumate a nexo'],
})

export default function RegistroLayout({ children }: { children: React.ReactNode }) {
  return children
}
