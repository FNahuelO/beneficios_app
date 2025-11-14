import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { medicalSpecialtySchema } from '@/lib/validations'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const especialidad = await prisma.medicalSpecialty.findUnique({
      where: { id },
    })

    if (!especialidad) {
      return NextResponse.json({ error: 'Especialidad no encontrada' }, { status: 404 })
    }

    return NextResponse.json(especialidad)
  } catch (error) {
    console.error('Error fetching especialidad:', error)
    return NextResponse.json({ error: 'Error al obtener especialidad' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const validatedData = medicalSpecialtySchema.parse(body)

    const especialidad = await prisma.medicalSpecialty.update({
      where: { id },
      data: {
        nombre: validatedData.nombre,
        imagenUrl: validatedData.imagenUrl || null,
        orden: validatedData.orden,
      },
    })

    return NextResponse.json(especialidad)
  } catch (error: any) {
    console.error('Error updating especialidad:', error)

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Especialidad no encontrada' }, { status: 404 })
    }

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al actualizar especialidad' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    await prisma.medicalSpecialty.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Especialidad eliminada' })
  } catch (error: any) {
    console.error('Error deleting especialidad:', error)

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Especialidad no encontrada' }, { status: 404 })
    }

    return NextResponse.json({ error: 'Error al eliminar especialidad' }, { status: 500 })
  }
}
