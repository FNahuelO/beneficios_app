import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/seo'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.legalName,
    short_name: siteConfig.name,
    description: siteConfig.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#0A2A32',
    theme_color: '#0B4F5C',
    lang: 'es-AR',
    icons: [
      {
        src: '/nexo-mark.png',
        sizes: '474x424',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/nexo-mark.png',
        sizes: '474x424',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}
