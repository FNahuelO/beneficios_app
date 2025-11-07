'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { registroSchema, type RegistroFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/components/ui/use-toast'
import { UserPlus, CheckCircle, AlertCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegistroFormData>({
    resolver: zodResolver(registroSchema),
    defaultValues: {
      tipoDocumento: 'DNI',
    },
  })

  const tipoDocumento = watch('tipoDocumento')

  const onSubmit = async (data: RegistroFormData) => {
    setLoading(true)

    try {
      const response = await fetch('/api/registro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al procesar la solicitud')
      }

      setSuccess(true)
      toast({
        title: 'Registro exitoso',
        description: 'Tu solicitud fue enviada correctamente',
      })

      setTimeout(() => {
        router.push('/credencial')
      }, 3000)
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container max-w-2xl py-12">
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-white">
              <CheckCircle className="h-8 w-8" />
            </div>
            <CardTitle className="text-center text-2xl">¡Registro Exitoso!</CardTitle>
            <CardDescription className="text-center">
              Recibimos tu solicitud correctamente
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-center">
            <p className="text-muted-foreground">
              Te enviamos un email de confirmación. Un administrador revisará tu solicitud y te
              notificaremos cuando sea aprobada.
            </p>
            <Button onClick={() => router.push('/credencial')}>
              Consultar estado de mi solicitud
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container max-w-3xl py-12">
      <div className="mb-8 text-center">
        <UserPlus className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Registrate</h1>
        <p className="text-muted-foreground">
          Completá el formulario para acceder a todos los beneficios
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos Personales</CardTitle>
          <CardDescription>Todos los campos son obligatorios</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nombreCompleto">Nombre Completo</Label>
                <Input
                  id="nombreCompleto"
                  placeholder="Juan Pérez"
                  {...register('nombreCompleto')}
                />
                {errors.nombreCompleto && (
                  <p className="text-sm text-destructive">{errors.nombreCompleto.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="tipoDocumento">Tipo de Documento</Label>
                  <Select
                    value={tipoDocumento}
                    onValueChange={(value) => setValue('tipoDocumento', value as 'DNI' | 'CUIT')}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DNI">DNI</SelectItem>
                      <SelectItem value="CUIT">CUIT</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.tipoDocumento && (
                    <p className="text-sm text-destructive">{errors.tipoDocumento.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="documento">Número de Documento</Label>
                  <Input id="documento" placeholder="12345678" {...register('documento')} />
                  {errors.documento && (
                    <p className="text-sm text-destructive">{errors.documento.message}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input id="telefono" placeholder="+54 11 1234-5678" {...register('telefono')} />
                  {errors.telefono && (
                    <p className="text-sm text-destructive">{errors.telefono.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="tu@email.com"
                    {...register('email')}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Dirección */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Dirección</h3>

              <div className="space-y-2">
                <Label htmlFor="domicilio">Domicilio</Label>
                <Input
                  id="domicilio"
                  placeholder="Av. Siempre Viva 123"
                  {...register('domicilio')}
                />
                {errors.domicilio && (
                  <p className="text-sm text-destructive">{errors.domicilio.message}</p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input id="ciudad" placeholder="Buenos Aires" {...register('ciudad')} />
                  {errors.ciudad && (
                    <p className="text-sm text-destructive">{errors.ciudad.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input id="provincia" placeholder="Buenos Aires" {...register('provincia')} />
                  {errors.provincia && (
                    <p className="text-sm text-destructive">{errors.provincia.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="pais">País</Label>
                  <Input id="pais" placeholder="Argentina" {...register('pais')} />
                  {errors.pais && <p className="text-sm text-destructive">{errors.pais.message}</p>}
                </div>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Al registrarte, tu solicitud será revisada por un administrador. Recibirás un email
                cuando sea aprobada.
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" size="lg" disabled={loading}>
              {loading ? 'Procesando...' : 'Enviar Solicitud'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
