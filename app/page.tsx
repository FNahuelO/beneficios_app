import Link from 'next/link'
import Image from 'next/image'
import { NexoLogo } from '@/components/brand/nexo-logo'
import { prisma } from '@/lib/prisma'
import { BenefitCard } from '@/components/beneficios/benefit-card'
import {
  Stethoscope,
  Accessibility,
  Scale,
  Store,
  GraduationCap,
  Wrench,
  Plane,
  Pill,
  MapPin,
  ArrowRight,
} from 'lucide-react'

export const dynamic = 'force-dynamic'

const servicios = [
  {
    icon: Stethoscope,
    title: 'Telemedicina con 5 especialidades',
    description: 'Consultá con profesionales a distancia, cuando lo necesites.',
  },
  {
    icon: Accessibility,
    title: 'Telemedicina con inclusión',
    description: 'Atención pensada para todas las personas, sin barreras.',
  },
  {
    icon: Scale,
    title: 'Asesoría legal',
    description: 'Orientación legal clara para resolver lo que te preocupa.',
  },
  {
    icon: Store,
    title: '+1000 comercios adheridos',
    description: 'Descuentos en negocios de todo el país, cerca tuyo.',
  },
  {
    icon: GraduationCap,
    title: 'Cursos internacionales',
    description: 'Formate con descuentos en capacitaciones de nivel global.',
  },
  {
    icon: Wrench,
    title: 'Cursos de oficio',
    description: 'Aprendé un oficio con beneficios exclusivos para socios.',
  },
]

const destacados = [
  {
    icon: Pill,
    value: '50%',
    label: 'Descuento en farmacias',
    detail: 'Ahorrá en medicamentos y productos de salud.',
  },
  {
    icon: Plane,
    value: '30%',
    label: 'Turismo a Brasil y Chile',
    detail: 'Descuentos de hasta un 30% en experiencias de viaje.',
  },
  {
    icon: MapPin,
    value: 'AR',
    label: 'Para todo Argentina',
    detail: 'Cobertura nacional: tu nexo de beneficios donde estés.',
  },
]

export default async function HomePage() {
  let beneficiosDestacados: Awaited<ReturnType<typeof prisma.benefit.findMany>> = []

  try {
    beneficiosDestacados = await prisma.benefit.findMany({
      where: { destacado: true },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
      },
      take: 6,
      orderBy: { createdAt: 'desc' },
    })
  } catch {
    beneficiosDestacados = []
  }

  return (
    <div className="flex flex-col">
      {/* Hero — una sola composición */}
      <section className="relative min-h-[100svh] overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=2400&q=80"
            alt="Profesional de la salud en consulta de telemedicina"
            fill
            priority
            className="nexo-hero-image object-cover object-center"
            sizes="100vw"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(105deg, rgba(10,42,50,0.92) 0%, rgba(11,79,92,0.78) 42%, rgba(10,42,50,0.45) 70%, rgba(10,42,50,0.25) 100%)',
            }}
          />
          <div
            className="absolute inset-0 opacity-40"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.12) 1px, transparent 0)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="container relative flex min-h-[100svh] flex-col justify-center py-24 md:py-28">
          <div className="nexo-animate-in nexo-float max-w-xl">
            <NexoLogo
              variant="light"
              markClassName="h-16 w-16 md:h-20 md:w-20"
              wordmarkClassName="text-6xl md:text-7xl lg:text-8xl text-white"
            />
          </div>

          <h1 className="nexo-animate-in nexo-animate-in-delay-1 font-display mt-8 max-w-2xl text-2xl font-semibold leading-snug tracking-tight text-white/95 sm:text-3xl md:text-4xl">
            Salud y beneficios conectados, para todo el país
          </h1>

          <p className="nexo-animate-in nexo-animate-in-delay-2 mt-5 max-w-lg text-base text-white/80 sm:text-lg">
            Telemedicina, asesoría legal y descuentos en comercios, cursos, farmacias y turismo —
            un solo nexo para vos.
          </p>

          <div className="nexo-animate-in nexo-animate-in-delay-3 mt-9 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/registro"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--nexo-aqua)] px-7 py-3.5 text-sm font-semibold text-[var(--nexo-ink)] transition duration-300 hover:bg-white hover:shadow-lg hover:shadow-teal-500/30"
            >
              Sumate a nexo
            </Link>
            <Link
              href="/#servicios"
              className="nexo-btn-secondary"
            >
              Conocer servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="nexo-atmosphere relative scroll-mt-20 py-20 md:py-28">
        <div className="container">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--nexo-teal)]">
              Qué incluye
            </p>
            <h2 className="nexo-section-title">Todo lo que conecta nexo</h2>
            <p className="nexo-section-lead">
              Una membresía pensada para cuidarte, formarte y ahorrar — en toda Argentina.
            </p>
          </div>

          <ul className="mt-14 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {servicios.map((servicio) => {
              const Icon = servicio.icon
              return (
                <li key={servicio.title} className="group">
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--nexo-deep)] text-[var(--nexo-aqua)] transition duration-300 group-hover:scale-105 group-hover:bg-[var(--nexo-ink)]">
                    <Icon className="h-5 w-5" strokeWidth={2} />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-[var(--nexo-ink)]">
                    {servicio.title}
                  </h3>
                  <p className="mt-2 text-[var(--nexo-deep)]/70 leading-relaxed">
                    {servicio.description}
                  </p>
                </li>
              )
            })}
          </ul>
        </div>
      </section>

      {/* Destacados de ahorro */}
      <section className="relative overflow-hidden bg-[var(--nexo-ink)] py-20 text-white md:py-24">
        <div
          className="pointer-events-none absolute -right-20 top-0 h-80 w-80 rounded-full opacity-30 blur-3xl"
          style={{ background: 'radial-gradient(circle, #2ec4b6, transparent 70%)' }}
        />
        <div className="container relative">
          <div className="max-w-2xl">
            <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--nexo-aqua)]">
              Ahorros clave
            </p>
            <h2 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">
              Beneficios que se sienten de verdad
            </h2>
            <p className="mt-3 max-w-xl text-white/65">
              Farmacia, turismo y cobertura nacional: el valor de nexo, claro y concreto.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {destacados.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.label} className="border-t border-white/15 pt-6">
                  <Icon className="mb-4 h-6 w-6 text-[var(--nexo-aqua)]" />
                  <p className="font-display text-4xl font-bold tracking-tight text-[var(--nexo-aqua)] sm:text-5xl">
                    {item.value}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold">{item.label}</h3>
                  <p className="mt-2 text-sm text-white/60">{item.detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Telemedicina highlight con imagen */}
      <section className="relative min-h-[70vh] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=2000&q=80"
          alt="Atención médica cercana y accesible"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[var(--nexo-ink)]/75" />
        <div className="container relative flex min-h-[70vh] flex-col justify-end py-16 md:py-20">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--nexo-aqua)]">
            Telemedicina
          </p>
          <h2 className="font-display max-w-xl text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Cinco especialidades y atención con inclusión
          </h2>
          <p className="mt-4 max-w-md text-white/75">
            Hablá con profesionales certificados por teléfono o videollamada, las 24 horas.
          </p>
          <Link
            href="/telemedicina"
            className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-[var(--nexo-aqua)] px-6 py-3 text-sm font-semibold text-[var(--nexo-ink)] transition hover:bg-white"
          >
            Ir a telemedicina
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Beneficios destacados de DB */}
      {beneficiosDestacados.length > 0 && (
        <section className="nexo-atmosphere py-20 md:py-24">
          <div className="container">
            <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="nexo-section-title">Beneficios destacados</h2>
                <p className="nexo-section-lead">Ofertas activas para socios nexo.</p>
              </div>
              <Link
                href="/beneficios"
                className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--nexo-deep)] transition hover:text-[var(--nexo-ink)]"
              >
                Ver todos
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {beneficiosDestacados.map((beneficio) => (
                <BenefitCard key={beneficio.id} benefit={beneficio as any} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA final */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--nexo-deep)] via-[var(--nexo-teal)] to-[var(--nexo-aqua)] py-24 text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.25) 1px, transparent 0)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="container relative text-center">
          <NexoLogo
            variant="light"
            className="mx-auto justify-center"
            markClassName="h-10 w-10"
            wordmarkClassName="text-3xl text-white"
          />
          <h2 className="font-display mx-auto mt-6 max-w-2xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Empezá a disfrutar nexo hoy
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-white/85">
            Registrate, activá tu credencial digital y accedé a salud y beneficios en toda
            Argentina.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/registro"
              className="inline-flex items-center justify-center rounded-xl bg-[var(--nexo-ink)] px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              Registrarme
            </Link>
            <Link
              href="/credencial"
              className="inline-flex items-center justify-center rounded-xl border border-white/40 bg-white/10 px-8 py-3.5 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/20"
            >
              Consultar credencial
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
