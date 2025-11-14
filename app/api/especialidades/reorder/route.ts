import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { z } from 'zod'

const reorderSchema = z.object({
  ids: z.array(z.string()),
})

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { ids } = reorderSchema.parse(body)

    // Actualizar el orden de todas las especialidades
    await Promise.all(
      ids.map((id, index) =>
        prisma.medicalSpecialty.update({
          where: { id },
          data: { orden: index },
        })
      )
    )

    return NextResponse.json({ message: 'Orden actualizado' })
  } catch (error: any) {
    console.error('Error reordering especialidades:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al reordenar especialidades' }, { status: 500 })
  }
}
