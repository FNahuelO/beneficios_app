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
    <div className="flex flex-col bg-[#EFF7FE]">
      {/* Hero Section - Inspirado en Boca Juniors */}
      <section className="flex flex-col justify-center items-center relative overflow-hidden bg-linear-to-br from-blue-900 via-blue-800 to-blue-700 text-white h-screen">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cGF0aCBkPSJNMzAgMzBsMzAgMzBIMGwzMC0zMHoiIGZpbGw9IiMwMDA')] opacity-10" />
        <div className="container relative py-20 md:py-32">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Tus Beneficios,
            </h1>
            <h2 className="mb-6 text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl text-yellow-500">
              Tu Estilo
            </h2>
            <p className="mb-8 text-lg text-blue-100 sm:text-xl">
              Descuentos exclusivos en salud, gastronomía, educación, deportes y mucho más.
              Registrate y empezá a disfrutar de todos los beneficios.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button size="lg" asChild className="bg-[#F3B229] text-white hover:bg-[#F3B229]/80">
                <Link href="/registro">Registrate</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="border-white text-white bg-[#00438A] hover:bg-white/10"
              >
                <Link href="/beneficios">Ver Beneficios</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative overflow-hidden py-8 not-sm:py-12 md:py-16 md:min-h-[70vh] flex flex-col items-center justify-center">
        {/* Imagen de fondo de la Bombonera */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/bombonera.png)' }}
        />

        {/* Overlay semi-transparente oscuro */}
        <div className="absolute inset-0 bg-blue-900/80" />

        {/* Franja superior amarilla y azul */}
        <div className="absolute top-0 left-0 right-0 h-1 not-sm:h-1.5 bg-[#F3B229]" />
        <div className="absolute top-1 not-sm:top-2 left-0 right-0 h-1 not-sm:h-1.5 bg-[#00438A]" />

        <div className="container relative px-4 not-sm:px-6">
          <div className="mb-6 not-sm:mb-8 md:mb-12 text-center">
            <h2 className="mb-3 not-sm:mb-4 text-2xl not-sm:text-3xl md:text-4xl font-bold tracking-tight text-white">
              ¿Por qué elegir Beneficios?
            </h2>
            <p className="mx-auto max-w-2xl text-sm not-sm:text-base text-[#FFC958] px-4">
              Todo lo que necesitás para aprovechar al máximo tus descuentos y ventajas exclusivas
            </p>
          </div>

          <div className="grid gap-4 not-sm:gap-6 grid-cols-1 lg:grid-cols-4 not-sm:flex not-sm:flex-col not-sm:justify-center not-sm:items-center">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="relative flex flex-col rounded-lg bg-blue-900/60 backdrop-blur-sm p-4 not-sm:p-6 pt-3 pb-10"
                >
                  <div className="mb-3 not-sm:mb-4 h-12 w-12 not-sm:h-16 not-sm:w-16 flex items-center justify-center rounded-lg bg-[#00438A] shadow self-end">
                    <Icon className="h-6 w-6 not-sm:h-8 not-sm:w-8 text-[#F3B229]" />
                  </div>
                  <h3 className="mb-3 not-sm:mb-4 text-lg not-sm:text-xl font-bold text-white text-start">
                    {feature.title}
                  </h3>

                  <p className="text-white/90 text-xs not-sm:text-sm leading-relaxed">
                    {feature.description}
                  </p>
                  <div className="absolute bottom-0 left-0 right-0 h-1.5 not-sm:h-2 bg-[#F3B229] rounded-b-3xl" />
                </div>
              )
            })}
          </div>
        </div>
        <div className="absolute bottom-1 not-sm:bottom-2 left-0 right-0 h-1 not-sm:h-1.5 bg-[#00438A]" />
        <div className="absolute bottom-0 left-0 right-0 h-1 not-sm:h-1.5 bg-[#F3B229]" />
      </section>
      {/* Beneficios Destacados */}
      <section className="py-16 ">
        <div className="container">
          <div className="mb-12 flex items-center justify-between">
            <div className="w-full">
              <h2 className="mb-2 text-3xl font-bold tracking-tight text-[#00438A]">
                Beneficios Destacados
              </h2>
              <div className="h-0.5 w-11/12 bg-[#A4A4A447] rounded-full" />
            </div>
            {/* <Button variant="outline" asChild className="hidden sm:flex">
              <Link href="/beneficios">
                Ver todos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button> */}
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

      {/* Banner UNITE */}
      <section
        className="relative overflow-hidden bg-linear-to-br from-[#22396B] via-[#003E80] to-[#22396B] py-12 md:py-16 w-11/12 mx-auto translate-y-1/2 z-10"
        style={{
          border: '1px solid',
          borderImage: 'linear-gradient(to right, #4A608F, #151C29, #4A608F) 1',
        }}
      >
        {/* Imagen de fondo en el lado derecho */}
        <div
          className="absolute right-0 top-0 bottom-0 w-1/2 bg-contain bg-right bg-no-repeat not-sm:bg-top not-sm:w-full not-sm:h-full"
          style={{ backgroundImage: 'url(/banner.png)' }}
        />

        {/* Overlay con degradado de opacidad desde la izquierda */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'linear-gradient(to right, #22396B 40%, #22396B 50%, rgba(34, 57, 107, 0.8) 60%, rgba(34, 57, 107, 0.5) 80%, rgba(34, 57, 107, 0.2) 90%, transparent 100%)',
          }}
        />

        <div className="container relative">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 not-sm:gap-4">
            <div className="flex-1 text-white z-10">
              <h2 className="mb-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight not-sm:text-2xl">
                UNITE
              </h2>
              <p className="text-lg md:text-xl text-white/90 not-sm:text-sm">
                Empezá a disfrutar de experiencias exclusivas pensadas para vos
              </p>
            </div>
            <div className="shrink-0 z-10">
              <Button
                size="lg"
                asChild
                className="bg-[#F3B229] text-white hover:bg-[#F3B229]/90 font-bold px-10 py-6 text-md rounded-2xl not-sm:py-4 not-sm:px-12"
              >
                <Link href="/registro">Registrarte</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-linear-to-br from-[#22396B] via-[#003E80] to-[#22396B] py-20 md:py-28 text-white h-[80vh] flex flex-col items-center justify-center">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F3B229]" />

        <div className="container">
          <div className="bg-linear-to-r h-0.5 from-[#22396B] via-white to-[#22396B]" />
          <div className="mx-auto max-w-3xl text-center py-24 not-sm:py-6">
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl not-sm:text-2xl not-sm:mx-4">
              Unite a miles de usuarios que ya disfrutan de sus beneficios
            </h2>
            <p className="mb-10 text-lg md:text-xl text-white/90 not-sm:text-sm">
              Consultá tu credencial y descubrí todos los descuentos disponibles
            </p>
            <Button
              size="lg"
              asChild
              className="bg-[#F3B229] text-white hover:bg-[#F3B229]/90 font-bold px-10 py-6 text-lg rounded-2xl not-sm:py-4 not-sm:px-12"
            >
              <Link href="/registro">Registrarte</Link>
            </Button>
          </div>
          <div className="bg-linear-to-r h-0.5 from-[#22396B] via-white to-[#22396B]" />
        </div>
      </section>
    </div>
  )
}
