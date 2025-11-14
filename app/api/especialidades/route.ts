import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { medicalSpecialtySchema } from '@/lib/validations'

export async function GET() {
  try {
    const especialidades = await prisma.medicalSpecialty.findMany({
      orderBy: { orden: 'asc' },
    })

    return NextResponse.json(especialidades)
  } catch (error) {
    console.error('Error fetching especialidades:', error)
    return NextResponse.json({ error: 'Error al obtener especialidades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = medicalSpecialtySchema.parse(body)

    const especialidad = await prisma.medicalSpecialty.create({
      data: {
        nombre: validatedData.nombre,
        imagenUrl: validatedData.imagenUrl || null,
        orden: validatedData.orden,
      },
    })

    return NextResponse.json(especialidad, { status: 201 })
  } catch (error: any) {
    console.error('Error creating especialidad:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al crear especialidad' }, { status: 500 })
  }
}
