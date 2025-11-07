import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

export default function BeneficiosAdminPage() {
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
          <CardDescription>Gestiona todos los beneficios disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            La gestión completa de beneficios está disponible a través de las APIs. Puedes crear,
            editar y eliminar beneficios usando las rutas /api/beneficios.
          </p>
          <div className="mt-4 text-center">
            <Button variant="outline" asChild>
              <Link href="/beneficios">Ver Beneficios Públicos</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
