import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import type { Benefit, Category, BenefitCategory } from '@prisma/client'

interface BenefitCardProps {
  benefit: Benefit & {
    categories: (BenefitCategory & {
      category: Category
    })[]
  }
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <Link
      href={`/beneficios/${benefit.slug}`}
      className="group block overflow-hidden bg-white/80 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-lg hover:shadow-[var(--nexo-teal)]/10"
    >
      {benefit.imagenUrl && (
        <div className="relative h-48 w-full overflow-hidden bg-[var(--nexo-mint)]">
          <img
            src={benefit.imagenUrl}
            alt={benefit.titulo}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute left-0 top-0 h-1 w-full bg-[var(--nexo-aqua)]" />
        </div>
      )}
      <div className="p-5">
        <h3 className="font-display line-clamp-2 text-lg font-semibold text-[var(--nexo-ink)]">
          {benefit.titulo}
        </h3>
        {benefit.categories && benefit.categories.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-2">
            {benefit.categories.map((bc) => (
              <Badge
                key={bc.id}
                variant="outline"
                className="w-fit border-[var(--nexo-teal)]/30 bg-[var(--nexo-mint)] text-[var(--nexo-deep)]"
              >
                {bc.category.nombre}
              </Badge>
            ))}
          </div>
        )}
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-[var(--nexo-deep)]/70">
          {benefit.descripcion}
        </p>
      </div>
    </Link>
  )
}
