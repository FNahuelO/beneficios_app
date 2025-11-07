import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { categoriaSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const body = await request.json()
    const validatedData = categoriaSchema.parse(body)

    const categoria = await prisma.category.findUnique({
      where: { id },
    })

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    const newSlug = slugify(validatedData.nombre)

    if (newSlug !== categoria.slug) {
      const existingCategory = await prisma.category.findUnique({
        where: { slug: newSlug },
      })

      if (existingCategory) {
        return NextResponse.json(
          { error: 'Ya existe una categoría con ese nombre' },
          { status: 400 }
        )
      }
    }

    const updated = await prisma.category.update({
      where: { id },
      data: {
        nombre: validatedData.nombre,
        slug: newSlug,
        orden: validatedData.orden,
      },
    })

    return NextResponse.json(updated)
  } catch (error: any) {
    console.error('Error updating categoria:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al actualizar categoría' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const categoria = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { benefits: true },
        },
      },
    })

    if (!categoria) {
      return NextResponse.json({ error: 'Categoría no encontrada' }, { status: 404 })
    }

    if (categoria._count.benefits > 0) {
      return NextResponse.json(
        { error: 'No se puede eliminar una categoría con beneficios asociados' },
        { status: 400 }
      )
    }

    await prisma.category.delete({
      where: { id },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting categoria:', error)
    return NextResponse.json({ error: 'Error al eliminar categoría' }, { status: 500 })
  }
}
