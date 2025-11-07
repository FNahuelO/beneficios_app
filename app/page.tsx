import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { prisma } from '@/lib/prisma'
import { BenefitCard } from '@/components/beneficios/benefit-card'
import { ArrowRight, Star, CreditCard, Heart, Shield, Users } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  // Obtener beneficios destacados
  const beneficiosDestacados = await prisma.benefit.findMany({
    where: { destacado: true },
    include: { category: true },
    take: 6,
    orderBy: { createdAt: 'desc' },
  })

  const features = [
    {
      icon: Star,
      title: 'Descuentos Exclusivos',
      description: 'Accedé a ofertas especiales en cientos de comercios adheridos.',
    },
    {
      icon: CreditCard,
      title: 'Credencial Digital',
      description: 'Tu credencial siempre disponible en tu celular.',
    },
    {
      icon: Heart,
      title: 'Salud y Bienestar',
      description: 'Beneficios en medicina, odontología, gimnasios y más.',
    },
    {
      icon: Shield,
      title: 'Seguro y Confiable',
      description: 'Tu información protegida con los más altos estándares.',
    },
  ]

  return (
    <div className="flex flex-col">
      {/* Hero Section - Inspirado en Boca Juniors */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMzAgMzBsMzAgMzBIMGwzMC0zMHoiIGZpbGw9IiMwMDA')] opacity-10" />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Tus Beneficios,
              <span className="bg-gradient-to-r from-yellow-400 to-yellow-200 bg-clip-text text-transparent">
                {' '}
                Tu Estilo
              </span>
            </h1>
            <p className="mb-8 text-lg text-blue-100 sm:text-xl">
              Descuentos exclusivos en salud, gastronomía, educación, deportes y mucho más.
              Registrate y empezá a disfrutar de todos los beneficios.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="bg-yellow-500 text-blue-900 hover:bg-yellow-400">
                <Link href="/registro">
                  Registrate Gratis
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white hover:bg-white/10"
              >
                <Link href="/beneficios">Ver Beneficios</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-b bg-muted/50 py-16">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              ¿Por qué elegir Beneficios?
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Todo lo que necesitás para aprovechar al máximo tus descuentos y ventajas exclusivas
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <Card key={index} className="border-2">
                  <CardHeader>
                    <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Icon className="h-6 w-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base">{feature.description}</CardDescription>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>

      {/* Beneficios Destacados */}
      <section className="py-16">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div>
              <h2 className="mb-2 text-3xl font-bold tracking-tight">Beneficios Destacados</h2>
              <p className="text-muted-foreground">Los mejores descuentos y ofertas para vos</p>
            </div>
            <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/beneficios">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {beneficiosDestacados.map((beneficio) => (
              <BenefitCard key={beneficio.id} benefit={beneficio} />
            ))}
          </div>

          <div className="mt-8 text-center sm:hidden">
            <Button variant="outline" asChild>
              <Link href="/beneficios">
                Ver todos los beneficios
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-primary py-16 text-primary-foreground">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <Users className="mx-auto mb-6 h-16 w-16" />
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Unite a miles de usuarios que ya disfrutan de sus beneficios
            </h2>
            <p className="mb-8 text-lg opacity-90">
              Consultá tu credencial y descubrí todos los descuentos disponibles
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/credencial">Consultar mi Credencial</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
