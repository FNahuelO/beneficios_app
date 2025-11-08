'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Plus, Edit, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { DeleteBenefitButton } from '@/components/admin/delete-benefit-button'

interface Benefit {
  id: string
  titulo: string
  slug: string
  descripcion: string
  icono: string | null
  destacado: boolean
  category: {
    nombre: string
  } | null
}

interface BeneficiosContentProps {
  initialBeneficios: Benefit[]
}

export function BeneficiosContent({ initialBeneficios }: BeneficiosContentProps) {
  const [beneficios, setBeneficios] = useState(initialBeneficios)

  const handleDelete = (slug: string) => {
    // Actualizar el estado local eliminando el beneficio
    setBeneficios((prev) => prev.filter((ben) => ben.slug !== slug))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Beneficios</h1>
          <p className="text-muted-foreground">Administrar beneficios y ofertas</p>
        </div>
        <Button asChild>
          <Link href="/admin/beneficios/nuevo">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Beneficio
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Beneficios</CardTitle>
          <CardDescription>
            {beneficios.length} {beneficios.length === 1 ? 'beneficio' : 'beneficios'}{' '}
            {beneficios.length === 1 ? 'registrado' : 'registrados'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {beneficios.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground mb-4">
                No hay beneficios registrados aún
              </p>
              <Button asChild>
                <Link href="/admin/beneficios/nuevo">
                  <Plus className="mr-2 h-4 w-4" />
                  Crear primer beneficio
                </Link>
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {beneficios.map((beneficio) => (
                    <TableRow key={beneficio.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {beneficio.icono && <span className="text-xl">{beneficio.icono}</span>}
                          <div>
                            <div className="font-medium">{beneficio.titulo}</div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {beneficio.descripcion}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {beneficio.category ? (
                          <Badge variant="secondary">{beneficio.category.nombre}</Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">Sin categoría</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {beneficio.destacado ? (
                          <Badge variant="default">Destacado</Badge>
                        ) : (
                          <Badge variant="outline">Normal</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/beneficios/${beneficio.slug}`}
                              target="_blank"
                              title="Ver beneficio"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </Link>
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <Link
                              href={`/admin/beneficios/${beneficio.slug}/editar`}
                              title="Editar beneficio"
                            >
                              <Edit className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteBenefitButton
                            slug={beneficio.slug}
                            titulo={beneficio.titulo}
                            onDeleted={() => handleDelete(beneficio.slug)}
                          />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
