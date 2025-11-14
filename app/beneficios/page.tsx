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

  // Construir filtros
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

  const [beneficios, total, categorias] = await Promise.all([
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

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="min-h-screen bg-[#00438A] py-12 px-4 flex flex-col items-center justify-center">
      <div className="container py-8 ">
        <div className="mb-8">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-white">
            Todos los Beneficios
          </h1>
          <p className="text-white">Explorá {total} beneficios disponibles para vos</p>
        </div>

        {/* Filtros */}
        <BeneficiosFilters
          categorias={categorias}
          initialSearch={search}
          initialCategoria={categoria}
          initialDestacado={destacado}
        />

        {/* Filtros activos */}
        {(search || (categoria && categoria !== 'all') || (destacado && destacado !== 'all')) && (
          <div className="mb-6 flex flex-wrap gap-2">
            <span className="text-sm text-white">Filtros activos:</span>
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

        {/* Lista de beneficios */}
        {beneficios.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-lg text-white">
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <a
                    key={p}
                    href={`?page=${p}${search ? `&search=${search}` : ''}${categoria ? `&categoria=${categoria}` : ''}${destacado ? `&destacado=${destacado}` : ''}`}
                    className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                      p === page
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted hover:bg-muted/80'
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
    </div>
  )
}
