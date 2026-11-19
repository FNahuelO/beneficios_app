import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Clock3, Headset, Phone, Accessibility, Stethoscope } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function TelemedicinaPage() {
  let settings = null
  let especialidades: { nombre: string; imagenUrl: string | null }[] = []

  try {
    settings = await prisma.settings.findUnique({
      where: { id: 'singleton' },
    })
    especialidades = await prisma.medicalSpecialty.findMany({
      orderBy: { orden: 'asc' },
    })
  } catch {
    // DB puede no estar disponible en build local
  }

  const telefono = settings?.telefonoPrincipal || '+54 11 4379-5506'
  const mensaje =
    settings?.mensajeInformativo ||
    'Nuestro servicio de telemedicina está disponible las 24 horas, los 7 días de la semana. Comunicate para recibir atención médica a distancia.'

  const telefonoLink = `tel:${telefono.replace(/\s/g, '')}`

  const especialidadesMapeadas = especialidades.map((esp) => ({
    nombre: esp.nombre,
    imagen:
      esp.imagenUrl ||
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
  }))

  const fallbackEspecialidades = [
    {
      nombre: 'Clínica médica',
      imagen: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Pediatría',
      imagen: 'https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Nutrición',
      imagen: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Salud mental',
      imagen: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Dermatología',
      imagen: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    },
  ]

  const lista =
    especialidadesMapeadas.length > 0 ? especialidadesMapeadas : fallbackEspecialidades

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[var(--nexo-ink)] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(46,196,182,0.35), transparent 60%)',
          }}
        />
        <div className="container relative py-16 md:py-20">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--nexo-aqua)]">
            nexo salud
          </p>
          <h1 className="font-display max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Telemedicina
          </h1>
          <p className="mt-4 max-w-xl text-lg text-white/70">
            Atención médica a distancia con 5 especialidades e inclusión — para todo Argentina.
          </p>
        </div>
      </section>

      <section className="nexo-atmosphere py-14 md:py-20">
        <div className="container max-w-5xl">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="relative border-t-4 border-[var(--nexo-aqua)] bg-white/70 p-8 backdrop-blur-sm md:p-10">
              <Clock3 className="absolute right-8 top-8 h-8 w-8 text-[var(--nexo-teal)]" />
              <h3 className="font-display text-xl font-semibold text-[var(--nexo-ink)]">
                Disponibilidad
              </h3>
              <p className="mt-3 text-[var(--nexo-deep)]/75">24 horas, 7 días a la semana.</p>
              <p className="mt-1 text-[var(--nexo-deep)]/75">
                Atención inmediata para tus consultas médicas.
              </p>
            </div>

            <div className="relative border-t-4 border-[var(--nexo-teal)] bg-white/70 p-8 backdrop-blur-sm md:p-10">
              <Headset className="absolute right-8 top-8 h-8 w-8 text-[var(--nexo-teal)]" />
              <h3 className="font-display text-xl font-semibold text-[var(--nexo-ink)]">
                Atención profesional
              </h3>
              <p className="mt-3 text-[var(--nexo-deep)]/75">
                Médicos certificados para atenderte por teléfono o videollamada.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="flex gap-4 border-t border-[var(--nexo-deep)]/10 bg-white/50 p-6">
              <Stethoscope className="h-6 w-6 shrink-0 text-[var(--nexo-teal)]" />
              <div>
                <h3 className="font-semibold text-[var(--nexo-ink)]">5 especialidades</h3>
                <p className="mt-1 text-sm text-[var(--nexo-deep)]/70">
                  Accedé a distintas especialidades médicas desde tu casa.
                </p>
              </div>
            </div>
            <div className="flex gap-4 border-t border-[var(--nexo-deep)]/10 bg-white/50 p-6">
              <Accessibility className="h-6 w-6 shrink-0 text-[var(--nexo-teal)]" />
              <div>
                <h3 className="font-semibold text-[var(--nexo-ink)]">Con inclusión</h3>
                <p className="mt-1 text-sm text-[var(--nexo-deep)]/70">
                  Atención pensada para todas las personas, sin barreras.
                </p>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="mt-10 bg-[var(--nexo-ink)] px-6 py-10 text-center text-white md:px-16">
            <h2 className="font-display text-2xl font-semibold">Contacto de telemedicina</h2>
            <p className="mx-auto mt-3 max-w-2xl text-white/70">{mensaje}</p>

            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-[var(--nexo-aqua)]/40 bg-white/5 p-8">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--nexo-aqua)]/20">
                <Phone className="h-7 w-7 text-[var(--nexo-aqua)]" />
              </div>
              <p className="mb-1 text-sm text-white/50">Número de contacto</p>
              <p className="mb-6 font-display text-3xl font-bold">{telefono}</p>

              <div className="flex flex-col justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  className="rounded-xl bg-[var(--nexo-aqua)] font-semibold text-[var(--nexo-ink)] hover:bg-white"
                  asChild
                >
                  <a href={telefonoLink}>Llamar</a>
                </Button>
                <Button
                  size="lg"
                  className="rounded-xl border border-white/30 bg-transparent font-semibold text-white hover:bg-white/10"
                  asChild
                >
                  <a
                    href={`https://wa.me/${telefono.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>

          {/* Cómo funciona */}
          <div className="mt-10 border-t border-[var(--nexo-deep)]/15 pt-10">
            <h2 className="font-display text-2xl font-semibold text-[var(--nexo-ink)]">
              ¿Cómo funciona?
            </h2>
            <ol className="mt-6 space-y-5">
              {[
                'Llamá al número de telemedicina o enviá un mensaje de WhatsApp.',
                'Proporcioná tu número de credencial y describí tu consulta.',
                'Un profesional te atenderá de inmediato o agendará una videollamada.',
              ].map((paso, i) => (
                <li key={i} className="flex gap-4 text-[var(--nexo-deep)]/80">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--nexo-deep)] text-sm font-semibold text-white">
                    {i + 1}
                  </span>
                  <span className="pt-1">{paso}</span>
                </li>
              ))}
            </ol>
          </div>

          {/* Especialidades */}
          <div className="mt-14">
            <h2 className="font-display mb-6 text-2xl font-semibold text-[var(--nexo-ink)]">
              Especialidades
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
              {lista.map((especialidad) => (
                <div key={especialidad.nombre} className="overflow-hidden bg-white">
                  <div className="relative aspect-video">
                    <div className="absolute left-0 top-0 z-10 h-1 w-full bg-[var(--nexo-aqua)]" />
                    <Image
                      src={especialidad.imagen}
                      alt={especialidad.nombre}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="p-3 text-sm font-medium text-[var(--nexo-ink)]">
                    {especialidad.nombre}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/registro"
              className="nexo-btn-primary inline-flex"
            >
              Sumate a nexo
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
