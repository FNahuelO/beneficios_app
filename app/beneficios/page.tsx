import { prisma } from '@/lib/prisma'
import { BenefitCard } from '@/components/beneficios/benefit-card'
import { BeneficiosFilters } from '@/components/beneficios/beneficios-filters'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

interface BeneficiosPageProps {
  searchParams: Promise<{
    search?: string
    categoria?: string
    destacado?: string
    page?: string
  }>
}

export default async function BeneficiosPage({ searchParams }: BeneficiosPageProps) {
  const search = (await searchParams).search || ''
  const categoria = (await searchParams).categoria || ''
  const destacado = (await searchParams).destacado || ''
  const page = parseInt((await searchParams).page || '1')
  const limit = 12

  const where: any = {}

  if (search) {
    where.OR = [
      { titulo: { contains: search, mode: 'insensitive' } },
      { descripcion: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (categoria && categoria !== 'all') {
    where.categories = {
      some: {
        category: {
          slug: categoria,
        },
      },
    }
  }

  if (destacado !== undefined && destacado !== '' && destacado !== 'all') {
    where.destacado = destacado === 'true'
  }

  let beneficios: any[] = []
  let total = 0
  let categorias: any[] = []

  try {
    ;[beneficios, total, categorias] = await Promise.all([
      prisma.benefit.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: [{ destacado: 'desc' }, { createdAt: 'desc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.benefit.count({ where }),
      prisma.category.findMany({
        orderBy: { orden: 'asc' },
      }),
    ])
  } catch {
    // DB no disponible
  }

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden bg-[var(--nexo-ink)] text-white">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              'radial-gradient(ellipse 50% 60% at 90% 30%, rgba(46,196,182,0.3), transparent 55%)',
          }}
        />
        <div className="container relative py-14 md:py-16">
          <p className="mb-2 text-sm font-semibold uppercase tracking-[0.18em] text-[var(--nexo-aqua)]">
            Red de beneficios
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight sm:text-5xl">
            Beneficios nexo
          </h1>
          <p className="mt-3 max-w-xl text-white/70">
            Descuentos en más de mil comercios, cursos, farmacias y turismo — explorá{' '}
            {total > 0 ? `${total} beneficios` : 'todas las ofertas'} disponibles.
          </p>
        </div>
      </section>

      <section className="nexo-atmosphere py-12">
        <div className="container">
          <BeneficiosFilters
            categorias={categorias}
            initialSearch={search}
            initialCategoria={categoria}
            initialDestacado={destacado}
          />

          {(search || (categoria && categoria !== 'all') || (destacado && destacado !== 'all')) && (
            <div className="mb-6 flex flex-wrap gap-2">
              <span className="text-sm text-[var(--nexo-deep)]/70">Filtros activos:</span>
              {search && <Badge variant="secondary">Búsqueda: {search}</Badge>}
              {categoria && categoria !== 'all' && (
                <Badge variant="secondary">
                  Categoría: {categorias.find((c) => c.slug === categoria)?.nombre}
                </Badge>
              )}
              {destacado === 'true' && <Badge variant="secondary">Solo destacados</Badge>}
              {destacado === 'false' && <Badge variant="secondary">No destacados</Badge>}
            </div>
          )}

          {beneficios.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg text-[var(--nexo-deep)]/70">
                No se encontraron beneficios con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {beneficios.map((beneficio) => (
                  <BenefitCard key={beneficio.id} benefit={beneficio} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-10 flex justify-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <a
                      key={p}
                      href={`?page=${p}${search ? `&search=${search}` : ''}${categoria ? `&categoria=${categoria}` : ''}${destacado ? `&destacado=${destacado}` : ''}`}
                      className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                        p === page
                          ? 'bg-[var(--nexo-deep)] text-white'
                          : 'bg-white/80 text-[var(--nexo-ink)] hover:bg-[var(--nexo-mint)]'
                      }`}
                    >
                      {p}
                    </a>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  )
}
