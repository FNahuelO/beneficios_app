import { prisma } from '@/lib/prisma'
import { BenefitCard } from '@/components/beneficios/benefit-card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Search } from 'lucide-react'

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

  if (categoria) {
    where.category = { slug: categoria }
  }

  if (destacado !== undefined && destacado !== '') {
    where.destacado = destacado === 'true'
  }

  const [beneficios, total, categorias] = await Promise.all([
    prisma.benefit.findMany({
      where,
      include: { category: true },
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
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Todos los Beneficios</h1>
        <p className="text-muted-foreground">Explorá {total} beneficios disponibles para vos</p>
      </div>

      {/* Filtros */}
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Buscar beneficios..." defaultValue={search} className="pl-9" />
        </div>

        <Select defaultValue={categoria}>
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categorias.map((cat) => (
              <SelectItem key={cat.id} value={cat.slug}>
                {cat.nombre}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select defaultValue={destacado}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los beneficios" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Solo destacados</SelectItem>
            <SelectItem value="false">No destacados</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Filtros activos */}
      {(search || categoria || destacado) && (
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm text-muted-foreground">Filtros activos:</span>
          {search && <Badge variant="secondary">Búsqueda: {search}</Badge>}
          {categoria && (
            <Badge variant="secondary">
              Categoría: {categorias.find((c) => c.slug === categoria)?.nombre}
            </Badge>
          )}
          {destacado === 'true' && <Badge variant="secondary">Solo destacados</Badge>}
        </div>
      )}

      {/* Lista de beneficios */}
      {beneficios.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-muted-foreground">
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
                    p === page ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
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
  )
}
