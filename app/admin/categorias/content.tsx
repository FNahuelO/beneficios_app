'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { CategoriesDragList } from '@/components/admin/categories-drag-list'
import { CategoryModal } from '@/components/admin/category-modal'

interface Category {
  id: string
  nombre: string
  slug: string
  orden: number
  _count: {
    benefits: number
  }
}

interface CategoriasContentProps {
  initialCategories: Category[]
}

export function CategoriasContent({ initialCategories }: CategoriasContentProps) {
  const [showNewModal, setShowNewModal] = useState(false)
  const [categories, setCategories] = useState(initialCategories)

  const handleCreate = (newCategory: any) => {
    // Agregar la nueva categoría al estado local
    setCategories((prev) => [...prev, newCategory])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Categorías</h1>
          <p className="text-muted-foreground">Administrar categorías de beneficios</p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Categoría
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Categorías</CardTitle>
          <CardDescription>
            {categories.length === 0 ? (
              'No hay categorías registradas'
            ) : (
              <>
                Arrastra para reordenar • {categories.length}{' '}
                {categories.length === 1 ? 'categoría' : 'categorías'}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground mb-4">
                No hay categorías registradas aún
              </p>
              <Button onClick={() => setShowNewModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primera categoría
              </Button>
            </div>
          ) : (
            <CategoriesDragList initialCategories={categories} />
          )}
        </CardContent>
      </Card>

      <CategoryModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        totalCategories={categories.length}
        onCreated={handleCreate}
      />
    </div>
  )
}
