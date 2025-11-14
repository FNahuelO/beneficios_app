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
import { Checkbox } from '@/components/ui/checkbox'
import { useToast } from '@/components/ui/use-toast'
import { formatDate } from '@/lib/utils'
import { CheckCircle, XCircle, Download, Search, Eye, FileText, CreditCard } from 'lucide-react'

export default function UsuariosAdminPage() {
  const [registros, setRegistros] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filtroEstado, setFiltroEstado] = useState('')
  const [search, setSearch] = useState('')
  const [selectedRegistro, setSelectedRegistro] = useState<any>(null)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [comentarioRechazo, setComentarioRechazo] = useState('')
  const [showToggleDialog, setShowToggleDialog] = useState(false)
  const [registroToToggle, setRegistroToToggle] = useState<any>(null)
  const [showPagosDialog, setShowPagosDialog] = useState(false)
  const [selectedUser, setSelectedUser] = useState<any>(null)
  const [pagos, setPagos] = useState<any[]>([])
  const [loadingPagos, setLoadingPagos] = useState(false)
  const { toast } = useToast()

  const fetchRegistros = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filtroEstado) params.append('estado', filtroEstado !== 'all' ? filtroEstado : '')
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

  const handleToggleClick = (registro: any) => {
    setRegistroToToggle(registro)
    setShowToggleDialog(true)
  }

  const handleToggleHabilitado = async () => {
    if (!registroToToggle) return

    try {
      const response = await fetch(`/api/admin/registro/${registroToToggle.id}/toggle`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Error al cambiar estado')

      const data = await response.json()

      toast({
        title: data.message,
        description:
          data.nuevoEstado === 'APROBADO'
            ? 'El usuario ha sido habilitado'
            : 'El usuario ha sido inhabilitado',
      })

      setShowToggleDialog(false)
      setRegistroToToggle(null)
      fetchRegistros()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo cambiar el estado',
        variant: 'destructive',
      })
    }
  }

  const handleVerCredencial = (registro: any) => {
    const url = `/credencial?doc=${registro.documento}&email=${registro.user.email}`
    window.open(url, '_blank')
  }

  const handleDescargarPDF = async (registro: any) => {
    try {
      // Primero necesitamos obtener el ID de la credencial
      const consultaResponse = await fetch('/api/credencial/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documento: registro.documento,
          email: registro.user.email,
        }),
      })

      if (!consultaResponse.ok) {
        throw new Error('No se pudo encontrar la credencial')
      }

      const consultaData = await consultaResponse.json()
      if (!consultaData.credentialId) {
        toast({
          title: 'Error',
          description: 'No se encontró la credencial',
          variant: 'destructive',
        })
        return
      }

      // Descargar el PDF
      const pdfResponse = await fetch(`/api/credencial/${consultaData.credentialId}/pdf`)
      if (!pdfResponse.ok) throw new Error('Error al descargar PDF')

      const blob = await pdfResponse.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `credencial-${registro.documento}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'Descarga exitosa',
        description: 'PDF de credencial descargado',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo descargar el PDF',
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

  const handleVerPagos = async (registro: any) => {
    setSelectedUser(registro)
    setShowPagosDialog(true)
    setLoadingPagos(true)

    try {
      const response = await fetch(`/api/admin/pagos/${registro.userId}`)
      if (!response.ok) throw new Error('Error al cargar pagos')

      const data = await response.json()
      setPagos(data.pagos || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los pagos',
        variant: 'destructive',
      })
      setPagos([])
    } finally {
      setLoadingPagos(false)
    }
  }

  const getEstadoPagoBadge = (estado: string) => {
    switch (estado) {
      case 'COMPLETADO':
        return (
          <Badge variant="default" className="bg-green-600">
            Completado
          </Badge>
        )
      case 'PENDIENTE':
        return <Badge variant="secondary">Pendiente</Badge>
      case 'FALLIDO':
        return <Badge variant="destructive">Fallido</Badge>
      case 'REEMBOLSADO':
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Reembolsado
          </Badge>
        )
      default:
        return null
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
      case 'INHABILITADO':
        return (
          <Badge variant="outline" className="border-orange-500 text-orange-600">
            Inhabilitado
          </Badge>
        )
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
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                <SelectItem value="APROBADO">Aprobado</SelectItem>
                <SelectItem value="INHABILITADO">Inhabilitado</SelectItem>
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
                      {(registro.estado === 'APROBADO' || registro.estado === 'INHABILITADO') && (
                        <div className="flex items-center gap-2">
                          {registro.estado === 'APROBADO' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerCredencial(registro)}
                              >
                                <Eye className="mr-1 h-3 w-3" />
                                Ver Credencial
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDescargarPDF(registro)}
                              >
                                <FileText className="mr-1 h-3 w-3" />
                                PDF
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleVerPagos(registro)}
                              >
                                <CreditCard className="mr-1 h-3 w-3" />
                                Pagos
                              </Button>
                            </>
                          )}
                          <div className="flex items-center gap-2">
                            <Checkbox
                              checked={registro.estado === 'APROBADO'}
                              onCheckedChange={() => handleToggleClick(registro)}
                              className="data-[state=checked]:bg-green-600"
                            />
                            <Label
                              className="text-sm cursor-pointer"
                              onClick={() => handleToggleClick(registro)}
                            >
                              {registro.estado === 'APROBADO' ? 'Habilitado' : 'Inhabilitado'}
                            </Label>
                          </div>
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
            <DialogTitle>
              {selectedRegistro?.estado === 'APROBADO'
                ? 'Rechazar Usuario Aprobado'
                : 'Rechazar Solicitud'}
            </DialogTitle>
            <DialogDescription>
              {selectedRegistro?.estado === 'APROBADO'
                ? 'Ingresá el motivo del rechazo. El usuario será notificado por email y su credencial será desactivada.'
                : 'Ingresá el motivo del rechazo. El usuario recibirá esta información por email.'}
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

      <Dialog open={showToggleDialog} onOpenChange={setShowToggleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {registroToToggle?.estado === 'APROBADO'
                ? 'Inhabilitar Usuario'
                : 'Habilitar Usuario'}
            </DialogTitle>
            <DialogDescription>
              {registroToToggle?.estado === 'APROBADO'
                ? `¿Estás seguro de que deseas inhabilitar a ${registroToToggle?.nombreCompleto}? El usuario perderá acceso a su credencial.`
                : `¿Estás seguro de que deseas habilitar a ${registroToToggle?.nombreCompleto}? El usuario recuperará acceso a su credencial.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowToggleDialog(false)}>
              Cancelar
            </Button>
            <Button
              variant={registroToToggle?.estado === 'APROBADO' ? 'destructive' : 'default'}
              onClick={handleToggleHabilitado}
            >
              {registroToToggle?.estado === 'APROBADO' ? 'Inhabilitar' : 'Habilitar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showPagosDialog} onOpenChange={setShowPagosDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Historial de Pagos</DialogTitle>
            <DialogDescription>
              {selectedUser && (
                <>
                  Pagos de <strong>{selectedUser.nombreCompleto}</strong> ({selectedUser.user.email}
                  )
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {loadingPagos ? (
              <p className="text-center text-muted-foreground">Cargando pagos...</p>
            ) : pagos.length === 0 ? (
              <p className="text-center text-muted-foreground">No se encontraron pagos</p>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Monto</TableHead>
                      <TableHead>Método</TableHead>
                      <TableHead>Tarjeta</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Referencia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pagos.map((pago) => (
                      <TableRow key={pago.id}>
                        <TableCell>{formatDate(pago.createdAt)}</TableCell>
                        <TableCell className="font-medium">
                          ${pago.monto.toFixed(2)} {pago.moneda}
                        </TableCell>
                        <TableCell className="capitalize">{pago.metodoPago}</TableCell>
                        <TableCell>
                          {pago.numeroTarjeta ? `****${pago.numeroTarjeta}` : 'N/A'}
                        </TableCell>
                        <TableCell>{getEstadoPagoBadge(pago.estado)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {pago.referenciaExterna || 'N/A'}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    Total de pagos: {pagos.length}
                  </div>
                  <div className="text-lg font-semibold">
                    Total: $
                    {pagos
                      .filter((p) => p.estado === 'COMPLETADO')
                      .reduce((sum, p) => sum + p.monto, 0)
                      .toFixed(2)}{' '}
                    ARS
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPagosDialog(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
