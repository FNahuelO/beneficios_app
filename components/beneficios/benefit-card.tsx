import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star } from 'lucide-react'
import type { Benefit, Category } from '@prisma/client'

interface BenefitCardProps {
  benefit: Benefit & {
    category: Category | null
  }
}

export function BenefitCard({ benefit }: BenefitCardProps) {
  return (
    <Link href={`/beneficios/${benefit.slug}`}>
      <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
        {benefit.imagenUrl && (
          <div className="relative h-48 w-full overflow-hidden bg-muted">
            <img
              src={benefit.imagenUrl}
              alt={benefit.titulo}
              className="h-full w-full object-cover transition-transform group-hover:scale-105"
            />
            {/* {benefit.destacado && (
              <div className="absolute right-2 top-2">
                <Badge variant="default" className="gap-1 bg-[#00438A] text-white">
                  <Star className="h-3 w-3 fill-current" />
                  Destacado
                </Badge>
              </div>
            )} */}
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="line-clamp-2 text-lg">{benefit.titulo}</CardTitle>
          </div>
          {benefit.category && (
            <Badge variant="outline" className="w-fit bg-[#00438A] text-white">
              {benefit.category.nombre}
            </Badge>
          )}
        </CardHeader>
        <CardContent>
          <CardDescription className="line-clamp-3">{benefit.descripcion}</CardDescription>
        </CardContent>
      </Card>
    </Link>
  )
}
