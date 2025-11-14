'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { MedicalSpecialtiesList } from '@/components/admin/medical-specialties-list'
import { MedicalSpecialtyModal } from '@/components/admin/medical-specialty-modal'

interface MedicalSpecialty {
  id: string
  nombre: string
  imagenUrl: string | null
  orden: number
  createdAt: Date
  updatedAt: Date
}

interface EspecialidadesContentProps {
  initialSpecialties: MedicalSpecialty[]
}

export function EspecialidadesContent({ initialSpecialties }: EspecialidadesContentProps) {
  const [showNewModal, setShowNewModal] = useState(false)
  const [specialties, setSpecialties] = useState(initialSpecialties)

  const handleCreate = (newSpecialty: any) => {
    setSpecialties((prev) => [...prev, newSpecialty])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestión de Especialidades Médicas</h1>
          <p className="text-muted-foreground">
            Administrar especialidades médicas para mostrar en telemedicina
          </p>
        </div>
        <Button onClick={() => setShowNewModal(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nueva Especialidad
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Especialidades</CardTitle>
          <CardDescription>
            {specialties.length === 0 ? (
              'No hay especialidades registradas'
            ) : (
              <>
                Arrastra para reordenar • {specialties.length}{' '}
                {specialties.length === 1 ? 'especialidad' : 'especialidades'}
              </>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {specialties.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-center text-muted-foreground mb-4">
                No hay especialidades registradas aún
              </p>
              <Button onClick={() => setShowNewModal(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Crear primera especialidad
              </Button>
            </div>
          ) : (
            <MedicalSpecialtiesList initialSpecialties={specialties} />
          )}
        </CardContent>
      </Card>

      <MedicalSpecialtyModal
        open={showNewModal}
        onOpenChange={setShowNewModal}
        totalSpecialties={specialties.length}
        onCreated={handleCreate}
      />
    </div>
  )
}
