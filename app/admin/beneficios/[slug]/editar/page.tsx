'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { ArrowLeft, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface Category {
  id: string
  nombre: string
  slug: string
}

interface Benefit {
  id: string
  titulo: string
  slug: string
  descripcion: string
  imagenUrl: string | null
  icono: string | null
  destacado: boolean
  categoryId: string | null
  howToUse: string | null
}

export default function EditarBeneficioPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    imagenUrl: '',
    icono: '',
    destacado: false,
    categoryId: '',
    howToUse: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    fetchBenefit()
    fetchCategories()
  }, [])

  const fetchBenefit = async () => {
    try {
      const response = await fetch(`/api/beneficios/${(await params).slug}`)
      if (response.ok) {
        const data: Benefit = await response.json()
        setFormData({
          titulo: data.titulo,
          descripcion: data.descripcion,
          imagenUrl: data.imagenUrl || '',
          icono: data.icono || '',
          destacado: data.destacado,
          categoryId: data.categoryId || '',
          howToUse: data.howToUse || '',
        })
      } else {
        toast({
          title: 'Error',
          description: 'No se pudo cargar el beneficio',
          variant: 'destructive',
        })
        router.push('/admin/beneficios')
      }
    } catch (error) {
      console.error('Error al cargar beneficio:', error)
      toast({
        title: 'Error',
        description: 'Hubo un error al cargar el beneficio',
        variant: 'destructive',
      })
    } finally {
      setLoadingData(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categorias')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error al cargar categorías:', error)
    } finally {
      setLoadingCategories(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      const dataToSend = {
        ...formData,
        imagenUrl: formData.imagenUrl || undefined,
        icono: formData.icono || undefined,
        categoryId:
          formData.categoryId && formData.categoryId !== 'sin-categoria'
            ? formData.categoryId
            : null,
        howToUse: formData.howToUse || undefined,
      }

      const response = await fetch(`/api/beneficios/${(await params).slug}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      })

      const data = await response.json()

      if (!response.ok) {
        if (data.details) {
          // Errores de validación de Zod
          const newErrors: Record<string, string> = {}
          data.details.forEach((error: any) => {
            const field = error.path[0]
            newErrors[field] = error.message
          })
          setErrors(newErrors)
        }
        throw new Error(data.error || 'Error al actualizar el beneficio')
      }

      toast({
        title: '¡Beneficio actualizado!',
        description: 'El beneficio se ha actualizado exitosamente.',
      })

      router.push('/admin/beneficios')
      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Hubo un error al actualizar el beneficio',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  if (loadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/beneficios">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Editar Beneficio</h1>
          <p className="text-muted-foreground">Modificar información del beneficio</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información del Beneficio</CardTitle>
          <CardDescription>Actualiza los datos del beneficio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Título */}
            <div className="space-y-2">
              <Label htmlFor="titulo">
                Título <span className="text-destructive">*</span>
              </Label>
              <Input
                id="titulo"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                placeholder="Ej: 20% de descuento en consultas médicas"
                className={errors.titulo ? 'border-destructive' : ''}
              />
              {errors.titulo && <p className="text-sm text-destructive">{errors.titulo}</p>}
            </div>

            {/* Descripción */}
            <div className="space-y-2">
              <Label htmlFor="descripcion">
                Descripción <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Describe el beneficio en detalle..."
                rows={4}
                className={errors.descripcion ? 'border-destructive' : ''}
              />
              {errors.descripcion && (
                <p className="text-sm text-destructive">{errors.descripcion}</p>
              )}
            </div>

            {/* Cómo usar */}
            <div className="space-y-2">
              <Label htmlFor="howToUse">Cómo usar el beneficio</Label>
              <Textarea
                id="howToUse"
                value={formData.howToUse}
                onChange={(e) => setFormData({ ...formData, howToUse: e.target.value })}
                placeholder="Instrucciones para usar el beneficio..."
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                Opcional: Explica paso a paso cómo acceder al beneficio
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Categoría */}
              <div className="space-y-2">
                <Label htmlFor="categoryId">Categoría</Label>
                {loadingCategories ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Cargando categorías...
                  </div>
                ) : (
                  <Select
                    value={formData.categoryId}
                    onValueChange={(value) => setFormData({ ...formData, categoryId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona una categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sin-categoria">Sin categoría</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>

              {/* Icono */}
              <div className="space-y-2">
                <Label htmlFor="icono">Icono (emoji)</Label>
                <Input
                  id="icono"
                  value={formData.icono}
                  onChange={(e) => setFormData({ ...formData, icono: e.target.value })}
                  placeholder="Ej: 🏥 💊 🩺"
                  maxLength={10}
                />
                <p className="text-sm text-muted-foreground">
                  Opcional: Un emoji o ícono que represente el beneficio
                </p>
              </div>
            </div>

            {/* URL de Imagen */}
            <div className="space-y-2">
              <Label htmlFor="imagenUrl">URL de la imagen</Label>
              <Input
                id="imagenUrl"
                type="url"
                value={formData.imagenUrl}
                onChange={(e) => setFormData({ ...formData, imagenUrl: e.target.value })}
                placeholder="https://ejemplo.com/imagen.jpg"
                className={errors.imagenUrl ? 'border-destructive' : ''}
              />
              {errors.imagenUrl && <p className="text-sm text-destructive">{errors.imagenUrl}</p>}
              <p className="text-sm text-muted-foreground">
                Opcional: URL de una imagen representativa del beneficio
              </p>
            </div>

            {/* Destacado */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="destacado"
                checked={formData.destacado}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, destacado: checked as boolean })
                }
              />
              <Label
                htmlFor="destacado"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Marcar como destacado
              </Label>
            </div>

            {/* Botones */}
            <div className="flex gap-4">
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/beneficios">Cancelar</Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
