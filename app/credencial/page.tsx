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
    <div className="min-h-screen bg-[#00438A] py-12 px-4 flex flex-col items-center justify-center">
      <div className="container max-w-4xl mx-auto">
        {/* Título principal */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tight text-white">
            Consultar credencial
          </h1>
          <p className="text-lg md:text-xl text-white/90">
            Consulta tu credencial y descubrí todos los descuentos disponibles
          </p>
        </div>

        {/* Card del formulario */}
        <Card className="mb-8 bg-[#8DB1FF26] border border-t-0 border-[#8DB1FF] shadow-xl relative ">
          <div className="absolute top-0 left-0 right-0 h-2 bg-[#F3B229] rounded-t-lg" />

          <CardHeader>
            <CardTitle className="text-white text-2xl">Datos de Consulta</CardTitle>
            <CardDescription className="text-white/80 text-base">
              Ingresá los datos que utilizaste al registrarte
            </CardDescription>
          </CardHeader>
          <CardContent className="px-0">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid gap-6 sm:grid-cols-2 px-6">
                <div className="space-y-2">
                  <Label htmlFor="documento" className="text-white text-base">
                    DNI/CUIT
                  </Label>
                  <Input
                    id="documento"
                    placeholder="12345678"
                    className="bg-white h-12"
                    {...register('documento')}
                  />
                  {errors.documento && (
                    <p className="text-sm text-red-300">{errors.documento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white text-base">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    className="bg-white h-12"
                    {...register('email')}
                  />
                  {errors.email && <p className="text-sm text-red-300">{errors.email.message}</p>}
                </div>
              </div>

              <div className="flex justify-center w-full border-t px-6 pt-6">
                <Button
                  type="submit"
                  className="w-full bg-[#F3B229] text-white hover:bg-[#F3B229]/90 font-bold py-6 text-lg rounded-2xl"
                  disabled={loading}
                >
                  {loading ? 'Consultando...' : 'Consultar Credencial'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Alert variant="destructive" className="mb-8 bg-red-500/20 border-red-500">
            <AlertCircle className="h-4 w-4 text-white" />
            <AlertDescription className="text-white">{error}</AlertDescription>
          </Alert>
        )}

        {credential && (
          <Card className="bg-[#1a4d7a] border-none shadow-xl">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-white">Tu Credencial</CardTitle>
                  <CardDescription className="text-white/80">
                    Información de tu registro
                  </CardDescription>
                </div>
                {getEstadoBadge(credential.estado)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-white/70">Nombre Completo</p>
                  <p className="text-lg font-semibold text-white">{credential.nombreCompleto}</p>
                </div>

                <div>
                  <p className="text-sm font-medium text-white/70">Documento</p>
                  <p className="text-lg font-semibold text-white">
                    {credential.tipoDocumento}: {credential.documento}
                  </p>
                </div>

                {credential.numeroSocio && (
                  <div>
                    <p className="text-sm font-medium text-white/70">Número de Socio</p>
                    <p className="text-lg font-semibold text-white">{credential.numeroSocio}</p>
                  </div>
                )}

                <div>
                  <p className="text-sm font-medium text-white/70">Fecha de Alta</p>
                  <p className="text-lg font-semibold text-white">
                    {formatDate(credential.fechaAlta)}
                  </p>
                </div>
              </div>

              {credential.estado === 'APROBADO' && credential.credentialId && (
                <div className="rounded-lg border border-white/20 bg-white/10 p-6">
                  <div className="mb-4 flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white">Credencial Digital</h3>
                      <p className="text-sm text-white/80">Tu credencial está lista para usar</p>
                    </div>
                    <Button
                      onClick={handleDownloadPDF}
                      className="bg-[#F3B229] text-white hover:bg-[#F3B229]/90 font-bold rounded-xl"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>
              )}

              {credential.estado === 'PENDIENTE' && (
                <Alert className="bg-yellow-500/20 border-yellow-500">
                  <Clock className="h-4 w-4 text-white" />
                  <AlertDescription className="text-white">
                    Tu solicitud está siendo revisada. Te notificaremos por email cuando sea
                    aprobada.
                  </AlertDescription>
                </Alert>
              )}

              {credential.estado === 'RECHAZADO' && credential.comentarioAdmin && (
                <Alert variant="destructive" className="bg-red-500/20 border-red-500">
                  <AlertCircle className="h-4 w-4 text-white" />
                  <AlertDescription className="text-white">
                    <strong>Motivo del rechazo:</strong> {credential.comentarioAdmin}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
