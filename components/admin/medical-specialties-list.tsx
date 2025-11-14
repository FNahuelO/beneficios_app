'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { MedicalSpecialtyModal } from './medical-specialty-modal'
import { DeleteMedicalSpecialtyButton } from './delete-medical-specialty-button'
import { Edit, GripVertical } from 'lucide-react'
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
import { useToast } from '@/components/ui/use-toast'

interface MedicalSpecialty {
  id: string
  nombre: string
  imagenUrl: string | null
  orden: number
  createdAt: Date
  updatedAt: Date
}

interface MedicalSpecialtiesListProps {
  initialSpecialties: MedicalSpecialty[]
}

function SortableRow({
  specialty,
  onEdit,
  onDelete,
}: {
  specialty: MedicalSpecialty
  onEdit: () => void
  onDelete: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: specialty.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <TableRow ref={setNodeRef} style={style}>
      <TableCell>
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-muted rounded"
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </button>
      </TableCell>
      <TableCell className="font-medium">{specialty.nombre}</TableCell>
      <TableCell>
        {specialty.imagenUrl ? (
          <Badge variant="default">Con imagen</Badge>
        ) : (
          <Badge variant="secondary">Sin imagen</Badge>
        )}
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={onEdit} title="Editar especialidad">
            <Edit className="h-4 w-4" />
          </Button>
          <DeleteMedicalSpecialtyButton
            id={specialty.id}
            nombre={specialty.nombre}
            onDeleted={onDelete}
          />
        </div>
      </TableCell>
    </TableRow>
  )
}

export function MedicalSpecialtiesList({ initialSpecialties }: MedicalSpecialtiesListProps) {
  const [specialties, setSpecialties] = useState(initialSpecialties)
  const [editingSpecialty, setEditingSpecialty] = useState<MedicalSpecialty | null>(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    setSpecialties(initialSpecialties)
  }, [initialSpecialties])

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = specialties.findIndex((s) => s.id === active.id)
      const newIndex = specialties.findIndex((s) => s.id === over.id)

      const newOrder = arrayMove(specialties, oldIndex, newIndex)
      setSpecialties(newOrder)

      // Actualizar orden en el servidor
      try {
        const response = await fetch('/api/especialidades/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ids: newOrder.map((s) => s.id),
          }),
        })

        if (!response.ok) {
          throw new Error('Error al actualizar el orden')
        }

        router.refresh()
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Hubo un error al actualizar el orden',
          variant: 'destructive',
        })
        // Revertir cambios
        setSpecialties(specialties)
      }
    }
  }

  const handleEdit = (specialty: MedicalSpecialty) => {
    setEditingSpecialty(specialty)
    setShowEditModal(true)
  }

  const handleUpdated = (updatedSpecialty: any) => {
    setSpecialties((prev) => prev.map((s) => (s.id === updatedSpecialty.id ? updatedSpecialty : s)))
    setShowEditModal(false)
    setEditingSpecialty(null)
  }

  const handleDeleted = () => {
    router.refresh()
  }

  return (
    <>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead>Nombre</TableHead>
              <TableHead>Imagen</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {specialties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-muted-foreground py-8">
                  No hay especialidades registradas
                </TableCell>
              </TableRow>
            ) : (
              <SortableContext
                items={specialties.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                {specialties.map((specialty) => (
                  <SortableRow
                    key={specialty.id}
                    specialty={specialty}
                    onEdit={() => handleEdit(specialty)}
                    onDelete={handleDeleted}
                  />
                ))}
              </SortableContext>
            )}
          </TableBody>
        </Table>
      </DndContext>

      <MedicalSpecialtyModal
        specialty={editingSpecialty}
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open)
          if (!open) {
            setEditingSpecialty(null)
          }
        }}
        onUpdated={handleUpdated}
      />
    </>
  )
}
