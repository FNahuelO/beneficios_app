import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { categoriaSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET() {
  try {
    const categorias = await prisma.category.findMany({
      orderBy: { orden: 'asc' },
      include: {
        _count: {
          select: { benefits: true },
        },
      },
    })

    return NextResponse.json(categorias)
  } catch (error) {
    console.error('Error fetching categorias:', error)
    return NextResponse.json({ error: 'Error al obtener categorías' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = categoriaSchema.parse(body)

    const slug = slugify(validatedData.nombre)

    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    })

    if (existingCategory) {
      return NextResponse.json({ error: 'Ya existe una categoría con ese nombre' }, { status: 400 })
    }

    const categoria = await prisma.category.create({
      data: {
        nombre: validatedData.nombre,
        slug,
        orden: validatedData.orden,
      },
    })

    return NextResponse.json(categoria, { status: 201 })
  } catch (error: any) {
    console.error('Error creating categoria:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al crear categoría' }, { status: 500 })
  }
}
