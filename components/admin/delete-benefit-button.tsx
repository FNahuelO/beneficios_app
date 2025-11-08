'use client'

import { useState } from 'react'
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
import { useToast } from '@/components/ui/use-toast'
import { Trash2, Loader2 } from 'lucide-react'

interface DeleteBenefitButtonProps {
  slug: string
  titulo: string
  onDeleted?: () => void
}

export function DeleteBenefitButton({ slug, titulo, onDeleted }: DeleteBenefitButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  const handleDelete = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/beneficios/${slug}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar el beneficio')
      }

      toast({
        title: '¡Beneficio eliminado!',
        description: 'El beneficio se ha eliminado exitosamente.',
      })

      setOpen(false)

      // Llamar al callback para actualizar la lista
      if (onDeleted) {
        onDeleted()
      }

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Hubo un error al eliminar el beneficio',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        title="Eliminar beneficio"
        className="text-destructive hover:text-destructive"
      >
        <Trash2 className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar beneficio?</DialogTitle>
            <DialogDescription>
              Estás a punto de eliminar el beneficio <strong>&quot;{titulo}&quot;</strong>. Esta
              acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
