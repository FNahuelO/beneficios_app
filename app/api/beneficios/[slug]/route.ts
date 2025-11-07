import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { beneficioSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const beneficio = await prisma.benefit.findUnique({
      where: { slug: params.slug },
      include: {
        category: true,
      },
    })

    if (!beneficio) {
      return NextResponse.json({ error: 'Beneficio no encontrado' }, { status: 404 })
    }

    return NextResponse.json(beneficio)
  } catch (error) {
    console.error('Error fetching beneficio:', error)
    return NextResponse.json({ error: 'Error al obtener beneficio' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = beneficioSchema.parse(body)

    const beneficio = await prisma.benefit.findUnique({
      where: { slug: params.slug },
    })

    if (!beneficio) {
      return NextResponse.json({ error: 'Beneficio no encontrado' }, { status: 404 })
    }

    const newSlug = slugify(validatedData.titulo)

    // Si el título cambió, verificar que el nuevo slug no exista
    if (newSlug !== params.slug) {
      const existingBenefit = await prisma.benefit.findUnique({
        where: { slug: newSlug },
      })

      if (existingBenefit) {
        return NextResponse.json(
          { error: 'Ya existe un beneficio con ese título' },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.benefit.update({
      where: { slug: params.slug },
      data: {
        ...validatedData,
        slug: newSlug,
        imagenUrl: validatedData.imagenUrl || null,
        icono: validatedData.icono || null,
        categoryId: validatedData.categoryId || null,
        howToUse: validatedData.howToUse || null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating beneficio:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al actualizar beneficio' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const beneficio = await prisma.benefit.findUnique({
      where: { slug: params.slug },
    })

    if (!beneficio) {
      return NextResponse.json({ error: 'Beneficio no encontrado' }, { status: 404 })
    }

    await prisma.benefit.delete({
      where: { slug: params.slug },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting beneficio:', error)
    return NextResponse.json({ error: 'Error al eliminar beneficio' }, { status: 500 })
  }
}
