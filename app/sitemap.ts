import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'
import { absoluteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl('/'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: absoluteUrl('/beneficios'),
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/telemedicina'),
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: absoluteUrl('/credencial'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: absoluteUrl('/registro'),
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
  ]

  let benefitRoutes: MetadataRoute.Sitemap = []

  try {
    const benefits = await prisma.benefit.findMany({
      select: { slug: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    })

    benefitRoutes = benefits.map((benefit) => ({
      url: absoluteUrl(`/beneficios/${benefit.slug}`),
      lastModified: benefit.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))
  } catch {
    benefitRoutes = []
  }

  return [...staticRoutes, ...benefitRoutes]
}
