'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { consultaCredencialSchema, type ConsultaCredencialFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { CreditCard, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'

interface CredentialData {
  nombreCompleto: string
  tipoDocumento: string
  documento: string
  estado: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO'
  numeroSocio: string | null
  credentialId: string | null
  fechaAlta: string
  comentarioAdmin: string | null
}

export default function CredencialPage() {
  const [loading, setLoading] = useState(false)
  const [credential, setCredential] = useState<CredentialData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ConsultaCredencialFormData>({
    resolver: zodResolver(consultaCredencialSchema),
  })

  const onSubmit = async (data: ConsultaCredencialFormData) => {
    setLoading(true)
    setError(null)
    setCredential(null)

    try {
      const response = await fetch('/api/credencial/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al consultar credencial')
      }

      const credentialData = await response.json()
      setCredential(credentialData)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadPDF = async () => {
    if (!credential?.credentialId) return

    try {
      const response = await fetch(`/api/credencial/${credential.credentialId}/pdf`)

      if (!response.ok) {
        throw new Error('Error al generar PDF')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `credencial-${credential.numeroSocio}.pdf`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

      toast({
        title: 'PDF descargado',
        description: 'Tu credencial se descargó exitosamente',
      })
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    }
  }

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case 'APROBADO':
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <CheckCircle className="h-3 w-3" />
            Aprobado
          </Badge>
        )
      case 'PENDIENTE':
        return (
          <Badge variant="secondary" className="gap-1">
            <Clock className="h-3 w-3" />
            Pendiente
          </Badge>
        )
      case 'RECHAZADO':
        return (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="h-3 w-3" />
            Rechazado
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <CreditCard className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Consultar Credencial</h1>
        <p className="text-muted-foreground">
          Ingresá tu documento y email para ver tu credencial digital
        </p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Datos de Consulta</CardTitle>
          <CardDescription>Ingresá los datos que utilizaste al registrarte</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="documento">DNI / CUIT</Label>
                <Input id="documento" placeholder="12345678" {...register('documento')} />
                {errors.documento && (
                  <p className="text-sm text-destructive">{errors.documento.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="tu@email.com" {...register('email')} />
                {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Consultando...' : 'Consultar Credencial'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {credential && (
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-2xl">Tu Credencial</CardTitle>
                <CardDescription>Información de tu registro</CardDescription>
              </div>
              {getEstadoBadge(credential.estado)}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                <p className="text-lg font-semibold">{credential.nombreCompleto}</p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">Documento</p>
                <p className="text-lg font-semibold">
                  {credential.tipoDocumento}: {credential.documento}
                </p>
              </div>

              {credential.numeroSocio && (
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Número de Socio</p>
                  <p className="text-lg font-semibold">{credential.numeroSocio}</p>
                </div>
              )}

              <div>
                <p className="text-sm font-medium text-muted-foreground">Fecha de Alta</p>
                <p className="text-lg font-semibold">{formatDate(credential.fechaAlta)}</p>
              </div>
            </div>

            {credential.estado === 'APROBADO' && credential.credentialId && (
              <div className="rounded-lg border bg-muted/50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Credencial Digital</h3>
                    <p className="text-sm text-muted-foreground">
                      Tu credencial está lista para usar
                    </p>
                  </div>
                  <Button onClick={handleDownloadPDF}>
                    <Download className="mr-2 h-4 w-4" />
                    Descargar PDF
                  </Button>
                </div>
              </div>
            )}

            {credential.estado === 'PENDIENTE' && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Tu solicitud está siendo revisada. Te notificaremos por email cuando sea aprobada.
                </AlertDescription>
              </Alert>
            )}

            {credential.estado === 'RECHAZADO' && credential.comentarioAdmin && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Motivo del rechazo:</strong> {credential.comentarioAdmin}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
