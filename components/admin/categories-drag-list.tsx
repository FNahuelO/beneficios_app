'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { GripVertical, Edit, Loader2 } from 'lucide-react'
import { DeleteCategoryButton } from './delete-category-button'
import { CategoryModal } from './category-modal'

interface Category {
  id: string
  nombre: string
  slug: string
  orden: number
  _count: {
    benefits: number
  }
}

interface CategoriesDragListProps {
  initialCategories: Category[]
  onNewCategory?: () => void
}

function SortableCategory({
  category,
  onEdit,
  onDelete,
}: {
  category: Category
  onEdit: (category: Category) => void
  onDelete: (id: string) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: category.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-lg border bg-card p-4 hover:bg-accent/50"
    >
      <button
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex-1">
        <div className="font-medium">{category.nombre}</div>
        <div className="text-sm text-muted-foreground">{category.slug}</div>
      </div>

      <Badge variant="secondary">
        {category._count?.benefits || 0}{' '}
        {category._count?.benefits === 1 ? 'beneficio' : 'beneficios'}
      </Badge>

      <div className="flex gap-2">
        <Button variant="ghost" size="icon" onClick={() => onEdit(category)} title="Editar">
          <Edit className="h-4 w-4" />
        </Button>
        <DeleteCategoryButton
          id={category.id}
          nombre={category.nombre}
          benefitsCount={category._count?.benefits || 0}
          onDeleted={() => onDelete(category.id)}
        />
      </div>
    </div>
  )
}

export function CategoriesDragList({ initialCategories, onNewCategory }: CategoriesDragListProps) {
  const [categories, setCategories] = useState(initialCategories)
  const [saving, setSaving] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  // Sincronizar el estado local cuando cambian las categorías iniciales
  useEffect(() => {
    setCategories(initialCategories)
  }, [initialCategories])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDelete = (id: string) => {
    // Actualizar el estado local eliminando la categoría
    setCategories((prev) => prev.filter((cat) => cat.id !== id))
  }

  const handleCreate = (newCategory: any) => {
    // Agregar la nueva categoría al estado local
    setCategories((prev) => [...prev, newCategory])
  }

  const handleUpdate = (updatedCategory: any) => {
    // Actualizar la categoría en el estado local
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updatedCategory.id ? { ...cat, ...updatedCategory } : cat))
    )
  }

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = categories.findIndex((cat) => cat.id === active.id)
      const newIndex = categories.findIndex((cat) => cat.id === over.id)

      const newCategories = arrayMove(categories, oldIndex, newIndex)

      // Actualizar el orden local inmediatamente
      const updatedCategories = newCategories.map((cat, index) => ({
        ...cat,
        orden: index,
      }))

      setCategories(updatedCategories)

      // Guardar en el servidor
      setSaving(true)
      try {
        const response = await fetch('/api/categorias/reorder', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            categories: updatedCategories.map((cat) => ({ id: cat.id, orden: cat.orden })),
          }),
        })

        if (!response.ok) {
          const data = await response.json()
          throw new Error(data.error || 'Error al guardar el orden')
        }

        toast({
          title: 'Orden actualizado',
          description: 'El orden de las categorías se ha guardado exitosamente.',
        })

        router.refresh()
      } catch (error: any) {
        console.error('Error al reordenar:', error)
        toast({
          title: 'Error',
          description: error.message || 'No se pudo guardar el orden de las categorías',
          variant: 'destructive',
        })
        // Revertir el cambio al último estado válido
        router.refresh()
      } finally {
        setSaving(false)
      }
    }
  }

  return (
    <>
      <div className="space-y-3">
        {saving && (
          <div className="flex items-center gap-2 rounded-lg border border-primary bg-primary/10 p-3 text-sm">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span>Guardando orden...</span>
          </div>
        )}

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories} strategy={verticalListSortingStrategy}>
            {categories.map((category) => (
              <SortableCategory
                key={category.id}
                category={category}
                onEdit={setEditingCategory}
                onDelete={handleDelete}
              />
            ))}
          </SortableContext>
        </DndContext>

        {categories.length === 0 && (
          <div className="flex items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <div>
              <p className="text-muted-foreground">No hay categorías registradas aún</p>
            </div>
          </div>
        )}
      </div>

      <CategoryModal
        category={editingCategory}
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        totalCategories={categories.length}
        onCreated={handleCreate}
        onUpdated={handleUpdate}
      />
    </>
  )
}
