import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowLeft, Star } from 'lucide-react'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

interface BenefitDetailPageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function BenefitDetailPage({ params }: BenefitDetailPageProps) {
  const { slug } = await params

  const beneficio = await prisma.benefit.findUnique({
    where: { slug },
    include: { category: true },
  })

  if (!beneficio) {
    notFound()
  }

  return (
    <div className="container py-8">
      <Button variant="ghost" asChild className="mb-6">
        <Link href="/beneficios">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Volver a Beneficios
        </Link>
      </Button>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Imagen */}
        <div className="relative overflow-hidden rounded-lg">
          {beneficio.imagenUrl ? (
            <img
              src={beneficio.imagenUrl}
              alt={beneficio.titulo}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-96 items-center justify-center bg-muted">
              <p className="text-muted-foreground">Sin imagen</p>
            </div>
          )}
        </div>

        {/* Información */}
        <div className="space-y-6">
          <div>
            {beneficio.destacado && (
              <Badge variant="default" className="mb-2 gap-1">
                <Star className="h-3 w-3 fill-current" />
                Destacado
              </Badge>
            )}
            {beneficio.category && (
              <Badge variant="outline" className="mb-4">
                {beneficio.category.nombre}
              </Badge>
            )}
            <h1 className="text-4xl font-bold tracking-tight">{beneficio.titulo}</h1>
          </div>

          <div>
            <h2 className="mb-2 text-xl font-semibold">Descripción</h2>
            <p className="text-muted-foreground">{beneficio.descripcion}</p>
          </div>

          {beneficio.howToUse && (
            <Card>
              <CardContent className="pt-6">
                <h3 className="mb-3 text-lg font-semibold">¿Cómo usarlo?</h3>
                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: beneficio.howToUse }}
                />
              </CardContent>
            </Card>
          )}

          <div className="rounded-lg bg-primary/10 p-6">
            <h3 className="mb-2 text-lg font-semibold">¿Querés aprovechar este beneficio?</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Consultá tu credencial digital para acceder a este y muchos más beneficios
            </p>
            <Button asChild>
              <Link href="/credencial">Ver mi Credencial</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
