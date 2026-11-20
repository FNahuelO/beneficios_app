import type { Metadata } from 'next'

const fallbackUrl = 'https://nexo.ar'

export const siteConfig = {
  name: 'nexo',
  legalName: 'nexo Salud y Beneficios',
  tagline: 'Salud, telemedicina y beneficios en Argentina',
  description:
    'Telemedicina con especialidades e inclusión, asesoría legal, descuentos en comercios, cursos, farmacias y turismo. Un solo nexo para tu bienestar en todo el país.',
  locale: 'es_AR',
  language: 'es',
  email: 'hola@nexo.ar',
  phone: '+54 11 4379-5506',
  twitterHandle: '',
  keywords: [
    'nexo',
    'telemedicina Argentina',
    'beneficios salud',
    'credencial digital',
    'descuentos farmacias',
    'asesoría legal',
    'cursos con descuento',
    'turismo beneficios',
    'salud a distancia',
    'nexo salud y beneficios',
  ],
} as const

export function getSiteUrl(): string {
  const fromEnv =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : null) ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null)

  return (fromEnv || fallbackUrl).replace(/\/$/, '')
}

export function absoluteUrl(path = '/'): string {
  const base = getSiteUrl()
  if (!path || path === '/') return base
  return `${base}${path.startsWith('/') ? path : `/${path}`}`
}

type BuildMetadataInput = {
  title?: string
  description?: string
  path?: string
  image?: string
  noIndex?: boolean
  keywords?: string[]
}

export function buildMetadata({
  title,
  description = siteConfig.description,
  path = '/',
  image = '/nexo-logo.png',
  noIndex = false,
  keywords,
}: BuildMetadataInput = {}): Metadata {
  const url = absoluteUrl(path)
  const defaultTitle = `${siteConfig.name} — ${siteConfig.tagline}`
  const fullTitle = title ? `${title} | ${siteConfig.name}` : defaultTitle
  const ogImage = image.startsWith('http') ? image : absoluteUrl(image)

  return {
    // Sin title: usa el default del layout. Con title: aplica el template "%s | nexo"
    ...(title ? { title } : {}),
    description,
    keywords: keywords ?? [...siteConfig.keywords],
    authors: [{ name: siteConfig.legalName }],
    creator: siteConfig.legalName,
    publisher: siteConfig.legalName,
    applicationName: siteConfig.name,
    category: 'health',
    alternates: {
      canonical: url,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: { index: false, follow: false },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-image-preview': 'large',
            'max-snippet': -1,
            'max-video-preview': -1,
          },
        },
    openGraph: {
      type: 'website',
      locale: siteConfig.locale,
      url,
      siteName: siteConfig.legalName,
      title: fullTitle,
      description,
      images: [
        {
          url: ogImage,
          width: 1024,
          height: 305,
          alt: `${siteConfig.legalName} — logo`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [ogImage],
      ...(siteConfig.twitterHandle ? { creator: siteConfig.twitterHandle } : {}),
    },
  }
}

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: getSiteUrl(),
    logo: absoluteUrl('/nexo-mark.png'),
    image: absoluteUrl('/nexo-logo.png'),
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    areaServed: {
      '@type': 'Country',
      name: 'Argentina',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: siteConfig.phone,
        contactType: 'customer service',
        availableLanguage: ['Spanish'],
        areaServed: 'AR',
      },
    ],
  }
}

export function websiteJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.legalName,
    alternateName: siteConfig.name,
    url: getSiteUrl(),
    description: siteConfig.description,
    inLanguage: siteConfig.language,
    publisher: {
      '@type': 'Organization',
      name: siteConfig.legalName,
      logo: absoluteUrl('/nexo-mark.png'),
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${absoluteUrl('/beneficios')}?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  }
}

export function medicalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'MedicalBusiness',
    name: siteConfig.legalName,
    url: absoluteUrl('/telemedicina'),
    description:
      'Servicio de telemedicina con especialidades e inclusión, disponible las 24 horas en toda Argentina.',
    telephone: siteConfig.phone,
    email: siteConfig.email,
    areaServed: 'AR',
    availableService: {
      '@type': 'MedicalProcedure',
      name: 'Telemedicina',
      description: 'Consultas médicas a distancia con profesionales de la salud.',
    },
  }
}

export function offerCatalogJsonLd(
  benefits: { titulo: string; slug: string; descripcion: string | null }[]
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'OfferCatalog',
    name: 'Beneficios nexo',
    itemListElement: benefits.map((b, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Offer',
        name: b.titulo,
        description: b.descripcion || undefined,
        url: absoluteUrl(`/beneficios/${b.slug}`),
      },
    })),
  }
}
