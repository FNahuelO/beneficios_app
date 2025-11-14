import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { beneficioSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params

    const beneficio = await prisma.benefit.findUnique({
      where: { slug },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
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

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { slug } = await params

    const body = await request.json()

    // Validar los datos
    const validationResult = beneficioSchema.safeParse(body)

    if (!validationResult.success) {
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: validationResult.error.issues,
        },
        { status: 400 }
      )
    }

    const validatedData = validationResult.data

    const beneficio = await prisma.benefit.findUnique({
      where: { slug },
    })

    if (!beneficio) {
      return NextResponse.json({ error: 'Beneficio no encontrado' }, { status: 404 })
    }

    const newSlug = slugify(validatedData.titulo)

    // Si el título cambió, verificar que el nuevo slug no exista
    if (newSlug !== slug) {
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

    // Extraer categoryIds y actualizar el beneficio con las categorías
    const { categoryIds, ...beneficioData } = validatedData
    const categoryIdsArray = categoryIds && categoryIds.length > 0 ? categoryIds : []

    // Eliminar todas las categorías existentes y crear las nuevas
    await prisma.benefitCategory
      .deleteMany({
        where: { benefitId: beneficio.id },
      })
      .catch(() => {
        // Si falla, continuar (puede que no existan categorías)
      })

    const updated = await prisma.benefit.update({
      where: { slug },
      data: {
        ...beneficioData,
        slug: newSlug,
        imagenUrl: validatedData.imagenUrl || null,
        icono: validatedData.icono || null,
        howToUse: validatedData.howToUse || null,
        categories: {
          create: categoryIdsArray
            .filter((id) => id && id !== 'sin-categoria')
            .map((categoryId) => ({
              categoryId,
            })),
        },
      },
      include: {
        categories: {
          include: {
            category: true,
          },
        },
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { slug } = await params

    const beneficio = await prisma.benefit.findUnique({
      where: { slug },
    })

    if (!beneficio) {
      return NextResponse.json({ error: 'Beneficio no encontrado' }, { status: 404 })
    }

    await prisma.benefit.delete({
      where: { slug },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting beneficio:', error)
    return NextResponse.json({ error: 'Error al eliminar beneficio' }, { status: 500 })
  }
}
