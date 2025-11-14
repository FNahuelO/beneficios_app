'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { Loader2 } from 'lucide-react'

interface MedicalSpecialtyModalProps {
  specialty?: {
    id: string
    nombre: string
    imagenUrl: string | null
    orden: number
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  totalSpecialties?: number
  onCreated?: (newSpecialty: any) => void
  onUpdated?: (updatedSpecialty: any) => void
}

export function MedicalSpecialtyModal({
  specialty,
  open,
  onOpenChange,
  totalSpecialties = 0,
  onCreated,
  onUpdated,
}: MedicalSpecialtyModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const isEditing = !!specialty

  const [formData, setFormData] = useState({
    nombre: '',
    imagenUrl: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (specialty) {
        setFormData({
          nombre: specialty.nombre,
          imagenUrl: specialty.imagenUrl || '',
        })
      } else {
        setFormData({
          nombre: '',
          imagenUrl: '',
        })
      }
      setErrors({})
    }
  }, [specialty, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isEditing) {
        // Actualizar especialidad existente
        const response = await fetch(`/api/especialidades/${specialty.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            imagenUrl: formData.imagenUrl || undefined,
            orden: specialty.orden,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.details) {
            const newErrors: Record<string, string> = {}
            data.details.forEach((error: any) => {
              const field = error.path[0]
              newErrors[field] = error.message
            })
            setErrors(newErrors)
          }
          throw new Error(data.error || 'Error al actualizar la especialidad')
        }

        toast({
          title: '¡Especialidad actualizada!',
          description: 'La especialidad se ha actualizado exitosamente.',
        })

        if (onUpdated) {
          onUpdated(data)
        }
      } else {
        // Crear nueva especialidad
        const response = await fetch('/api/especialidades', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            imagenUrl: formData.imagenUrl || undefined,
            orden: totalSpecialties,
          }),
        })

        const data = await response.json()

        if (!response.ok) {
          if (data.details) {
            const newErrors: Record<string, string> = {}
            data.details.forEach((error: any) => {
              const field = error.path[0]
              newErrors[field] = error.message
            })
            setErrors(newErrors)
          }
          throw new Error(data.error || 'Error al crear la especialidad')
        }

        toast({
          title: '¡Especialidad creada!',
          description: 'La especialidad se ha creado exitosamente.',
        })

        if (onCreated) {
          onCreated(data)
        }
      }

      onOpenChange(false)
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description:
          error.message || `Hubo un error al ${isEditing ? 'actualizar' : 'crear'} la especialidad`,
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} Especialidad Médica</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los datos de la especialidad médica'
              : 'Crea una nueva especialidad médica para mostrar en telemedicina'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-destructive">*</span>
              </Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                placeholder="Ej: Cardiología, Pediatría, Dermatología"
                className={errors.nombre ? 'border-destructive' : ''}
                autoFocus
              />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imagenUrl">URL de Imagen</Label>
              <Input
                id="imagenUrl"
                type="url"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={errors.imagenUrl ? 'border-destructive' : ''}
              />
              {errors.imagenUrl && <p className="text-sm text-destructive">{errors.imagenUrl}</p>}
              <p className="text-xs text-muted-foreground">
                URL de la imagen que se mostrará para esta especialidad
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditing ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
