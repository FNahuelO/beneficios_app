import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { categories } = body

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Formato inválido' }, { status: 400 })
    }

    // Verificar que todas las categorías existen antes de actualizar
    const categoryIds = categories.map((cat: { id: string; orden: number }) => cat.id)
    const existingCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    })

    const existingIds = new Set(existingCategories.map((cat) => cat.id))
    const validCategories = categories.filter((cat: { id: string; orden: number }) =>
      existingIds.has(cat.id)
    )

    if (validCategories.length === 0) {
      return NextResponse.json(
        { error: 'No hay categorías válidas para actualizar' },
        { status: 400 }
      )
    }

    // Actualizar el orden solo de las categorías que existen
    await Promise.all(
      validCategories.map((cat: { id: string; orden: number }) =>
        prisma.category.update({
          where: { id: cat.id },
          data: { orden: cat.orden },
        })
      )
    )

    return NextResponse.json({ message: 'Orden actualizado exitosamente' })
  } catch (error: any) {
    console.error('Error updating category order:', error)
    return NextResponse.json({ error: 'Error al actualizar el orden' }, { status: 500 })
  }
}
