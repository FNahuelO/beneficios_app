'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  registroSchema,
  type RegistroFormData,
  pagoSchema,
  type PagoFormData,
} from '@/lib/validations'
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
import { useToast } from '@/components/ui/use-toast'
import { CheckCircle, Info, CreditCard, Lock } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function RegistroPage() {
  const [loading, setLoading] = useState(false)
  const [showPago, setShowPago] = useState(false)
  const [registrationId, setRegistrationId] = useState<string | null>(null)
  const [pagoLoading, setPagoLoading] = useState(false)
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

  const {
    register: registerPago,
    handleSubmit: handleSubmitPago,
    setValue: setValuePago,
    watch: watchPago,
    formState: { errors: errorsPago },
  } = useForm<PagoFormData>({
    resolver: zodResolver(pagoSchema),
    defaultValues: {
      monto: 0,
    },
  })

  const tipoDocumento = watch('tipoDocumento')
  const numeroTarjeta = watchPago('numeroTarjeta')
  const fechaVencimiento = watchPago('fechaVencimiento')

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

      const responseData = await response.json()
      setRegistrationId(responseData.registrationId)
      setShowPago(true)
      setValuePago('registrationId', responseData.registrationId)

      toast({
        title: 'Registro exitoso',
        description: 'Ahora completa el pago para finalizar tu registro',
      })
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

  const onSubmitPago = async (data: PagoFormData) => {
    setPagoLoading(true)

    try {
      const response = await fetch('/api/registro/pago', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error al procesar el pago')
      }

      toast({
        title: 'Pago exitoso',
        description: 'Tu registro ha sido completado exitosamente',
      })

      setTimeout(() => {
        router.push('/credencial')
      }, 2000)
    } catch (err: any) {
      toast({
        title: 'Error en el pago',
        description: err.message,
        variant: 'destructive',
      })
    } finally {
      setPagoLoading(false)
    }
  }

  // Formatear número de tarjeta
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '')
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned
    return formatted.slice(0, 19) // Máximo 16 dígitos + 3 espacios
  }

  // Formatear fecha de vencimiento
  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '')
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4)
    }
    return cleaned
  }

  if (showPago && registrationId) {
    return (
      <div className="min-h-screen bg-white py-12">
        <div className="container max-w-2xl px-4">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-green-600">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h1 className="mb-2 text-4xl font-bold tracking-tight text-[#00438A]">
              Registro Exitoso
            </h1>
            <p className="text-lg text-[#00438A]">Completa el pago para finalizar tu registro</p>
          </div>

          {/* Formulario de Pago */}
          <Card className="shadow-lg">
            <div className="h-7 rounded-t-lg bg-[#103F79]"></div>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-[#00438A]" />
                <CardTitle className="text-xl text-[#00438A]">Datos de Pago</CardTitle>
              </div>
              <CardDescription>
                <div className="flex items-center gap-2 mt-2">
                  <Lock className="h-4 w-4" />
                  <span>Formulario de prueba - No se procesarán pagos reales</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPago(onSubmitPago)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="numeroTarjeta" className="text-[#00438A]">
                    Número de Tarjeta
                  </Label>
                  <Input
                    id="numeroTarjeta"
                    placeholder="1234 5678 9012 3456"
                    className="border-gray-300"
                    maxLength={19}
                    {...registerPago('numeroTarjeta', {
                      onChange: (e) => {
                        const formatted = formatCardNumber(e.target.value)
                        setValuePago('numeroTarjeta', formatted)
                      },
                    })}
                  />
                  {errorsPago.numeroTarjeta && (
                    <p className="text-sm text-destructive">{errorsPago.numeroTarjeta.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nombreTitular" className="text-[#00438A]">
                    Nombre del Titular
                  </Label>
                  <Input
                    id="nombreTitular"
                    placeholder="JUAN PEREZ"
                    className="border-gray-300 uppercase"
                    {...registerPago('nombreTitular', {
                      onChange: (e) => {
                        setValuePago('nombreTitular', e.target.value.toUpperCase())
                      },
                    })}
                  />
                  {errorsPago.nombreTitular && (
                    <p className="text-sm text-destructive">{errorsPago.nombreTitular.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fechaVencimiento" className="text-[#00438A]">
                      Fecha de Vencimiento
                    </Label>
                    <Input
                      id="fechaVencimiento"
                      placeholder="MM/AA"
                      className="border-gray-300"
                      maxLength={5}
                      {...registerPago('fechaVencimiento', {
                        onChange: (e) => {
                          const formatted = formatExpiryDate(e.target.value)
                          setValuePago('fechaVencimiento', formatted)
                        },
                      })}
                    />
                    {errorsPago.fechaVencimiento && (
                      <p className="text-sm text-destructive">
                        {errorsPago.fechaVencimiento.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cvv" className="text-[#00438A]">
                      CVV
                    </Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      type="password"
                      className="border-gray-300"
                      maxLength={4}
                      {...registerPago('cvv')}
                    />
                    {errorsPago.cvv && (
                      <p className="text-sm text-destructive">{errorsPago.cvv.message}</p>
                    )}
                  </div>
                </div>

                {/* Información */}
                <div className="flex items-start gap-2 rounded-lg bg-blue-50 p-4">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                  <p className="text-sm text-blue-800">
                    Este es un formulario de prueba. No se realizará ningún cargo real. Una vez
                    completado, tu registro será aprobado automáticamente.
                  </p>
                </div>

                {/* Botón */}
                <Button
                  type="submit"
                  className="w-full bg-[#F3B229] text-white hover:bg-[#F3B229]/80"
                  size="lg"
                  disabled={pagoLoading}
                >
                  {pagoLoading ? 'Procesando pago...' : 'Completar Pago'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white py-12">
      <div className="container max-w-4xl px-4">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="mb-2 text-4xl font-bold tracking-tight text-[#00438A]">Registrate</h1>
          <p className="text-lg text-[#00438A]">
            Completa el formulario para acceder a todos los beneficios
          </p>
        </div>

        {/* Form Container */}
        <div className="rounded-lg bg-white shadow-lg">
          {/* Barra azul superior */}
          <div className="h-7 rounded-t-lg bg-[#103F79]"></div>

          <div className="p-8">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Datos Personales */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#00438A]">Datos Personales</h2>
                  <p className="text-sm text-gray-500">Todos los campos son obligatorios</p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Columna izquierda */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre" className="text-[#00438A]">
                        Nombre
                      </Label>
                      <Input
                        id="nombre"
                        placeholder="Juan"
                        className="border-gray-300"
                        {...register('nombre')}
                      />
                      {errors.nombre && (
                        <p className="text-sm text-destructive">{errors.nombre.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tipoDocumento" className="text-[#00438A]">
                        Tipo de Documento
                      </Label>
                      <Select
                        value={tipoDocumento}
                        onValueChange={(value) =>
                          setValue('tipoDocumento', value as 'DNI' | 'CUIT')
                        }
                      >
                        <SelectTrigger className="border-gray-300">
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
                      <Label htmlFor="telefono" className="text-[#00438A]">
                        Teléfono
                      </Label>
                      <Input
                        id="telefono"
                        placeholder="+5234567485"
                        className="border-gray-300"
                        {...register('telefono')}
                      />
                      {errors.telefono && (
                        <p className="text-sm text-destructive">{errors.telefono.message}</p>
                      )}
                    </div>
                  </div>

                  {/* Columna derecha */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="apellido" className="text-[#00438A]">
                        Apellido
                      </Label>
                      <Input
                        id="apellido"
                        placeholder="Perez"
                        className="border-gray-300"
                        {...register('apellido')}
                      />
                      {errors.apellido && (
                        <p className="text-sm text-destructive">{errors.apellido.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="documento" className="text-[#00438A]">
                        Número de Documento
                      </Label>
                      <Input
                        id="documento"
                        placeholder="12345676"
                        className="border-gray-300"
                        {...register('documento')}
                      />
                      {errors.documento && (
                        <p className="text-sm text-destructive">{errors.documento.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-[#00438A]">
                        Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="tu@email.com"
                        className="border-gray-300"
                        {...register('email')}
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#00438A]">Dirección</h2>

                <div className="space-y-2">
                  <Label htmlFor="domicilio" className="text-[#00438A]">
                    Domicilio
                  </Label>
                  <Input
                    id="domicilio"
                    placeholder="Av. exxxxx123"
                    className="border-gray-300"
                    {...register('domicilio')}
                  />
                  {errors.domicilio && (
                    <p className="text-sm text-destructive">{errors.domicilio.message}</p>
                  )}
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="ciudad" className="text-[#00438A]">
                      Ciudad
                    </Label>
                    <Input
                      id="ciudad"
                      placeholder="Buenos Aires"
                      className="border-gray-300"
                      {...register('ciudad')}
                    />
                    {errors.ciudad && (
                      <p className="text-sm text-destructive">{errors.ciudad.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="provincia" className="text-[#00438A]">
                      Provincia
                    </Label>
                    <Input
                      id="provincia"
                      placeholder="Buenos Aires"
                      className="border-gray-300"
                      {...register('provincia')}
                    />
                    {errors.provincia && (
                      <p className="text-sm text-destructive">{errors.provincia.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pais" className="text-[#00438A]">
                      País
                    </Label>
                    <Input
                      id="pais"
                      placeholder="Argentina"
                      className="border-gray-300"
                      {...register('pais')}
                    />
                    {errors.pais && (
                      <p className="text-sm text-destructive">{errors.pais.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Información */}
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-blue-600 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">
                  Al registrarte, tu solicitud será revisada por un administrador. Recibirás un
                  email cuando sea aprobada.
                </p>
              </div>

              {/* Botón */}
              <Button
                type="submit"
                className="w-full bg-[#F3B229] text-white hover:bg-[#F3B229]/80"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Procesando...' : 'Enviar solicitud'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
