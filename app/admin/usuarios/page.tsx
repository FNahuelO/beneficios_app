'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'
import { CheckCircle, XCircle, Download, Search } from 'lucide-react'

export default function UsuariosAdminPage() {
  const [registros, setRegistros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRegistro, setSelectedRegistro] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [comentarioRechazo, setComentarioRechazo] = useState('')
  const { toast } = useToast()

  const fetchRegistros = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtroEstado) params.append('estado', filtroEstado)
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/registro?${params}`)
      const data = await response.json()
      setRegistros(data.registros || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los registros',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRegistros()
  }, [filtroEstado])

  const handleAprobar = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/registro/${id}/aprobar`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Error al aprobar')

      toast({
        title: 'Solicitud aprobada',
        description: 'El usuario fue notificado por email',
      })

      fetchRegistros()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo aprobar la solicitud',
        variant: 'destructive',
      })
    }
  }

  const handleRechazar = async () => {
    if (!selectedRegistro || !comentarioRechazo) return

    try {
      const response = await fetch(`/api/admin/registro/${selectedRegistro.id}/rechazar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comentarioAdmin: comentarioRechazo }),
      })

      if (!response.ok) throw new Error('Error al rechazar')

      toast({
        title: 'Solicitud rechazada',
        description: 'El usuario fue notificado por email',
      })

      setShowRejectDialog(false)
      setComentarioRechazo('')
      setSelectedRegistro(null)
      fetchRegistros()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo rechazar la solicitud',
        variant: 'destructive',
      })
    }
  }

  const handleExport = async (format: 'csv' | 'xlsx') => {
    try {
      const params = new URLSearchParams()
      params.append('format', format)
      if (filtroEstado) params.append('estado', filtroEstado)
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/registro?${params}`)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `registros-${new Date().toISOString()}.${format}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Exportación exitosa',
        description: `Archivo ${format.toUpperCase()} descargado`,
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo exportar',
        variant: 'destructive',
      })
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return (
          <Badge variant="default" className="bg-green-600">
            Aprobado
          </Badge>
        )
      case 'PENDIENTE':
        return <Badge variant="secondary">Pendiente</Badge>
      case 'RECHAZADO':
        return <Badge variant="destructive">Rechazado</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Usuarios</h1>
          <p className="text-muted-foreground">Aprobar o rechazar solicitudes de registro</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => handleExport('csv')}>
            <Download className="mr-2 h-4 w-4" />
            CSV
          </Button>
          <Button variant="outline" onClick={() => handleExport('xlsx')}>
            <Download className="mr-2 h-4 w-4" />
            Excel
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>
            Filtrar registros por estado o buscar por nombre/documento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Buscar por nombre o documento..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchRegistros()}
              />
            </div>
            <Select value={filtroEstado} onValueChange={setFiltroEstado}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Todos los estados" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Todos</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="APROBADO">Aprobado</SelectItem>
                <SelectItem value="RECHAZADO">Rechazado</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={fetchRegistros}>
              <Search className="mr-2 h-4 w-4" />
              Buscar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6">
          {loading ? (
            <p className="text-center text-muted-foreground">Cargando...</p>
          ) : registros.length === 0 ? (
            <p className="text-center text-muted-foreground">No se encontraron registros</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Teléfono</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {registros.map((registro) => (
                  <TableRow key={registro.id}>
                    <TableCell className="font-medium">{registro.nombreCompleto}</TableCell>
                    <TableCell>
                      {registro.tipoDocumento}: {registro.documento}
                    </TableCell>
                    <TableCell>{registro.user.email}</TableCell>
                    <TableCell>{registro.telefono}</TableCell>
                    <TableCell>{formatDate(registro.createdAt)}</TableCell>
                    <TableCell>{getEstadoBadge(registro.estado)}</TableCell>
                    <TableCell>
                      {registro.estado === 'PENDIENTE' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="default"
                            onClick={() => handleAprobar(registro.id)}
                          >
                            <CheckCircle className="mr-1 h-3 w-3" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => {
                              setSelectedRegistro(registro)
                              setShowRejectDialog(true)
                            }}
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Ingresá el motivo del rechazo. El usuario recibirá esta información por email.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="comentario">Motivo del rechazo</Label>
              <Textarea
                id="comentario"
                placeholder="Ej: Documentación incompleta..."
                value={comentarioRechazo}
                onChange={(e) => setComentarioRechazo(e.target.value)}
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleRechazar} disabled={!comentarioRechazo}>
              Rechazar Solicitud
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
