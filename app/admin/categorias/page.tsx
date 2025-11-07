import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export default function CategoriasAdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Administrar categorías de beneficios</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorías</CardTitle>
          <CardDescription>Gestiona todas las categorías de beneficios</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">
            La gestión completa de categorías está disponible a través de las APIs. Puedes crear,
            editar y eliminar categorías usando las rutas /api/categorias.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
