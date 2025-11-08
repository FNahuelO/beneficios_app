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

interface CategoryModalProps {
  category?: {
    id: string
    nombre: string
    orden: number
  } | null
  open: boolean
  onOpenChange: (open: boolean) => void
  totalCategories?: number
  onCreated?: (newCategory: any) => void
  onUpdated?: (updatedCategory: any) => void
}

export function CategoryModal({
  category,
  open,
  onOpenChange,
  totalCategories = 0,
  onCreated,
  onUpdated,
}: CategoryModalProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const isEditing = !!category

  const [formData, setFormData] = useState({
    nombre: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (open) {
      if (category) {
        setFormData({
          nombre: category.nombre,
        })
      } else {
        setFormData({
          nombre: '',
        })
      }
      setErrors({})
    }
  }, [category, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      if (isEditing) {
        // Actualizar categoría existente
        const response = await fetch(`/api/categorias/${category.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            orden: category.orden, // Mantener el orden actual
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
          throw new Error(data.error || 'Error al actualizar la categoría')
        }

        toast({
          title: '¡Categoría actualizada!',
          description: 'La categoría se ha actualizado exitosamente.',
        })

        // Llamar al callback con la categoría actualizada
        if (onUpdated) {
          onUpdated(data)
        }
      } else {
        // Crear nueva categoría
        const response = await fetch('/api/categorias', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nombre: formData.nombre,
            orden: totalCategories, // Nueva categoría al final
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
          throw new Error(data.error || 'Error al crear la categoría')
        }

        toast({
          title: '¡Categoría creada!',
          description: 'La categoría se ha creado exitosamente.',
        })

        // Llamar al callback con la nueva categoría
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
          error.message || `Hubo un error al ${isEditing ? 'actualizar' : 'crear'} la categoría`,
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
          <DialogTitle>{isEditing ? 'Editar' : 'Nueva'} Categoría</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica el nombre de la categoría'
              : 'Crea una nueva categoría de beneficios'}
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
                placeholder="Ej: Salud, Gastronomía, Educación"
                className={errors.nombre ? 'border-destructive' : ''}
                autoFocus
              />
              {errors.nombre && <p className="text-sm text-destructive">{errors.nombre}</p>}
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
