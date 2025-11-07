import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Download, Database, Settings } from 'lucide-react'

export default function AjustesAdminPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Ajustes Generales</h1>
        <p className="text-muted-foreground">Configuración y herramientas administrativas</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <Database className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Exportar Datos</CardTitle>
            <CardDescription>Descargar información completa del sistema</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="outline" className="w-full" asChild>
              <a href="/api/admin/registro?format=csv">
                <Download className="mr-2 h-4 w-4" />
                Exportar Usuarios (CSV)
              </a>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <a href="/api/admin/registro?format=xlsx">
                <Download className="mr-2 h-4 w-4" />
                Exportar Usuarios (Excel)
              </a>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <Settings className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Información del Sistema</CardTitle>
            <CardDescription>Versión y estado de la aplicación</CardDescription>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Versión:</dt>
                <dd className="font-medium">1.0.0</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Base de datos:</dt>
                <dd className="font-medium">PostgreSQL</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Estado:</dt>
                <dd className="font-medium text-green-600">Operativo</dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
