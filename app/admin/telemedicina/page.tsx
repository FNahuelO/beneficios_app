'use client'

import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { telemedicinaSettingsSchema, type TelemedicinaSettingsFormData } from '@/lib/validations'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/components/ui/use-toast'

export default function TelemedicinaAdminPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<TelemedicinaSettingsFormData>({
    resolver: zodResolver(telemedicinaSettingsSchema),
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings/telemedicina')
      const data = await response.json()
      setValue('telefonoPrincipal', data.telefonoPrincipal || '')
      setValue('mensajeInformativo', data.mensajeInformativo || '')
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const onSubmit = async (data: TelemedicinaSettingsFormData) => {
    setLoading(true)

    try {
      const response = await fetch('/api/settings/telemedicina', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) throw new Error('Error al guardar')

      toast({
        title: 'Configuración guardada',
        description: 'Los cambios se aplicaron correctamente',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo guardar la configuración',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Configuración de Telemedicina</h1>
        <p className="text-muted-foreground">Actualizar información de contacto de telemedicina</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de Contacto</CardTitle>
          <CardDescription>
            Esta información será visible en la página de telemedicina
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="telefonoPrincipal">Teléfono Principal</Label>
              <Input
                id="telefonoPrincipal"
                placeholder="+54 11 4444-5555"
                {...register('telefonoPrincipal')}
              />
              {errors.telefonoPrincipal && (
                <p className="text-sm text-destructive">{errors.telefonoPrincipal.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="mensajeInformativo">Mensaje Informativo</Label>
              <Textarea
                id="mensajeInformativo"
                placeholder="Información sobre el servicio de telemedicina..."
                rows={6}
                {...register('mensajeInformativo')}
              />
              {errors.mensajeInformativo && (
                <p className="text-sm text-destructive">{errors.mensajeInformativo.message}</p>
              )}
            </div>

            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
