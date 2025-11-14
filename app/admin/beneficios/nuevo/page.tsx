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
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { Separator } from '@/components/ui/separator'

interface Category {
  id: string
  nombre: string
  slug: string
}

export default function NuevoBeneficioPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)

  interface BeneficioFormData {
    id: string
    titulo: string
    descripcion: string
    imagenUrl: string
    icono: string
    destacado: boolean
    categoryIds: string[]
    howToUse: string
  }

  const [beneficios, setBeneficios] = useState<BeneficioFormData[]>([
    {
      id: '1',
      titulo: '',
      descripcion: '',
      imagenUrl: '',
      icono: '',
      destacado: false,
      categoryIds: [],
      howToUse: '',
    },
  ])

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({})

  useEffect(() => {
    fetchCategories()
  }, [])

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

  const addBeneficio = () => {
    const newId = Date.now().toString()
    setBeneficios([
      ...beneficios,
      {
        id: newId,
        titulo: '',
        descripcion: '',
        imagenUrl: '',
        icono: '',
        destacado: false,
        categoryIds: [],
        howToUse: '',
      },
    ])
  }

  const removeBeneficio = (id: string) => {
    if (beneficios.length > 1) {
      setBeneficios(beneficios.filter((b) => b.id !== id))
      // Limpiar errores del beneficio eliminado
      const newErrors = { ...errors }
      delete newErrors[id]
      setErrors(newErrors)
    }
  }

  const updateBeneficio = (id: string, field: keyof BeneficioFormData, value: any) => {
    setBeneficios(beneficios.map((b) => (b.id === id ? { ...b, [field]: value } : b)))
    // Limpiar error del campo actualizado
    if (errors[id]?.[field]) {
      const newErrors = { ...errors }
      delete newErrors[id]?.[field]
      if (Object.keys(newErrors[id] || {}).length === 0) {
        delete newErrors[id]
      }
      setErrors(newErrors)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validar que al menos un beneficio tenga título y descripción
      const beneficiosValidos = beneficios.filter((b) => b.titulo.trim() && b.descripcion.trim())

      if (beneficiosValidos.length === 0) {
        throw new Error('Debes completar al menos un beneficio')
      }

      // Crear todos los beneficios
      const promises = beneficiosValidos.map(async (beneficio) => {
        const dataToSend = {
          titulo: beneficio.titulo,
          descripcion: beneficio.descripcion,
          imagenUrl: beneficio.imagenUrl || undefined,
          icono: beneficio.icono || undefined,
          categoryIds: beneficio.categoryIds.filter((id) => id && id !== 'sin-categoria'),
          howToUse: beneficio.howToUse || undefined,
          destacado: beneficio.destacado,
        }

        const response = await fetch('/api/beneficios', {
          method: 'POST',
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
            return { id: beneficio.id, error: newErrors, success: false }
          }
          return {
            id: beneficio.id,
            error: data.error || 'Error al crear el beneficio',
            success: false,
          }
        }

        return { id: beneficio.id, success: true }
      })

      const results = await Promise.all(promises)
      const errores = results.filter((r) => !r.success)
      const exitosos = results.filter((r) => r.success)

      if (errores.length > 0) {
        // Mostrar errores específicos
        const newErrors: Record<string, Record<string, string>> = {}
        errores.forEach((err: any) => {
          if (err.error && typeof err.error === 'object') {
            newErrors[err.id] = err.error
          }
        })
        setErrors(newErrors)

        if (exitosos.length > 0) {
          toast({
            title: 'Parcialmente completado',
            description: `Se crearon ${exitosos.length} de ${beneficiosValidos.length} beneficios. Revisa los errores.`,
            variant: 'destructive',
          })
        } else {
          throw new Error('No se pudo crear ningún beneficio')
        }
      } else {
        toast({
          title: '¡Beneficios creados!',
          description: `Se crearon exitosamente ${exitosos.length} beneficio(s).`,
        })

        router.push('/admin/beneficios')
        router.refresh()
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Hubo un error al crear los beneficios',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
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
          <h1 className="text-3xl font-bold tracking-tight">Nuevo Beneficio</h1>
          <p className="text-muted-foreground">
            Crear uno o más beneficios{' '}
            {beneficios.length > 1 && `(${beneficios.length} beneficios)`}
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Información de los Beneficios</CardTitle>
              <CardDescription>
                Completa los datos de los beneficios. Podés agregar múltiples beneficios.
              </CardDescription>
            </div>
            <Button type="button" variant="outline" onClick={addBeneficio}>
              <Plus className="mr-2 h-4 w-4" />
              Agregar Beneficio
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {beneficios.map((beneficio, index) => (
              <div key={beneficio.id} className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">
                    Beneficio {index + 1} {beneficios.length > 1 && `de ${beneficios.length}`}
                  </h3>
                  {beneficios.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeBeneficio(beneficio.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                {/* Título */}
                <div className="space-y-2">
                  <Label htmlFor={`titulo-${beneficio.id}`}>
                    Título <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`titulo-${beneficio.id}`}
                    value={beneficio.titulo}
                    onChange={(e) => updateBeneficio(beneficio.id, 'titulo', e.target.value)}
                    placeholder="Ej: 20% de descuento en consultas médicas"
                    className={errors[beneficio.id]?.titulo ? 'border-destructive' : ''}
                  />
                  {errors[beneficio.id]?.titulo && (
                    <p className="text-sm text-destructive">{errors[beneficio.id].titulo}</p>
                  )}
                </div>

                {/* Descripción */}
                <div className="space-y-2">
                  <Label htmlFor={`descripcion-${beneficio.id}`}>
                    Descripción <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id={`descripcion-${beneficio.id}`}
                    value={beneficio.descripcion}
                    onChange={(e) => updateBeneficio(beneficio.id, 'descripcion', e.target.value)}
                    placeholder="Describe el beneficio en detalle..."
                    rows={4}
                    className={errors[beneficio.id]?.descripcion ? 'border-destructive' : ''}
                  />
                  {errors[beneficio.id]?.descripcion && (
                    <p className="text-sm text-destructive">{errors[beneficio.id].descripcion}</p>
                  )}
                </div>

                {/* Cómo usar */}
                <div className="space-y-2">
                  <Label htmlFor={`howToUse-${beneficio.id}`}>Cómo usar el beneficio</Label>
                  <Textarea
                    id={`howToUse-${beneficio.id}`}
                    value={beneficio.howToUse}
                    onChange={(e) => updateBeneficio(beneficio.id, 'howToUse', e.target.value)}
                    placeholder="Instrucciones para usar el beneficio..."
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Opcional: Explica paso a paso cómo acceder al beneficio
                  </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Categorías */}
                  <div className="space-y-2">
                    <Label htmlFor={`categoryIds-${beneficio.id}`}>Categorías</Label>
                    {loadingCategories ? (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Cargando categorías...
                      </div>
                    ) : (
                      <div className="space-y-2 rounded-md border p-3 max-h-48 overflow-y-auto">
                        {categories.length === 0 ? (
                          <p className="text-sm text-muted-foreground">
                            No hay categorías disponibles
                          </p>
                        ) : (
                          categories.map((category) => (
                            <div key={category.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={`category-${beneficio.id}-${category.id}`}
                                checked={beneficio.categoryIds.includes(category.id)}
                                onCheckedChange={(checked) => {
                                  const currentIds = beneficio.categoryIds || []
                                  if (checked) {
                                    updateBeneficio(beneficio.id, 'categoryIds', [
                                      ...currentIds,
                                      category.id,
                                    ])
                                  } else {
                                    updateBeneficio(
                                      beneficio.id,
                                      'categoryIds',
                                      currentIds.filter((id) => id !== category.id)
                                    )
                                  }
                                }}
                              />
                              <Label
                                htmlFor={`category-${beneficio.id}-${category.id}`}
                                className="text-sm font-normal cursor-pointer"
                              >
                                {category.nombre}
                              </Label>
                            </div>
                          ))
                        )}
                        {beneficio.categoryIds.length > 0 && (
                          <div className="pt-2 border-t">
                            <p className="text-xs text-muted-foreground">
                              {beneficio.categoryIds.length} categoría(s) seleccionada(s)
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Icono */}
                  <div className="space-y-2">
                    <Label htmlFor={`icono-${beneficio.id}`}>Icono (emoji)</Label>
                    <Input
                      id={`icono-${beneficio.id}`}
                      value={beneficio.icono}
                      onChange={(e) => updateBeneficio(beneficio.id, 'icono', e.target.value)}
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
                  <Label htmlFor={`imagenUrl-${beneficio.id}`}>URL de la imagen</Label>
                  <Input
                    id={`imagenUrl-${beneficio.id}`}
                    type="url"
                    value={beneficio.imagenUrl}
                    onChange={(e) => updateBeneficio(beneficio.id, 'imagenUrl', e.target.value)}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className={errors[beneficio.id]?.imagenUrl ? 'border-destructive' : ''}
                  />
                  {errors[beneficio.id]?.imagenUrl && (
                    <p className="text-sm text-destructive">{errors[beneficio.id].imagenUrl}</p>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Opcional: URL de una imagen representativa del beneficio
                  </p>
                </div>

                {/* Destacado */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`destacado-${beneficio.id}`}
                    checked={beneficio.destacado}
                    onCheckedChange={(checked) =>
                      updateBeneficio(beneficio.id, 'destacado', checked as boolean)
                    }
                  />
                  <Label
                    htmlFor={`destacado-${beneficio.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    Marcar como destacado
                  </Label>
                </div>

                {index < beneficios.length - 1 && <Separator className="my-6" />}
              </div>
            ))}

            {/* Botones */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button type="button" variant="outline" onClick={addBeneficio}>
                <Plus className="mr-2 h-4 w-4" />
                Agregar Otro Beneficio
              </Button>
              <div className="flex gap-4">
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Crear {beneficios.length > 1 ? `${beneficios.length} Beneficios` : 'Beneficio'}
                </Button>
                <Button type="button" variant="outline" asChild>
                  <Link href="/admin/beneficios">Cancelar</Link>
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
