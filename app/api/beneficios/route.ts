import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { beneficioSchema } from '@/lib/validations'
import { slugify } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const search = searchParams.get('search') || ''
    const categoria = searchParams.get('categoria') || ''
    const destacado = searchParams.get('destacado')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const where: any = {}

    if (search) {
      where.OR = [
        { titulo: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (categoria) {
      where.category = { slug: categoria }
    }

    if (destacado !== null && destacado !== undefined && destacado !== '') {
      where.destacado = destacado === 'true'
    }

    const [beneficios, total] = await Promise.all([
      prisma.benefit.findMany({
        where,
        include: {
          category: true,
        },
        orderBy: [{ destacado: 'desc' }, { createdAt: 'desc' }],
        skip,
        take: limit,
      }),
      prisma.benefit.count({ where }),
    ])

    return NextResponse.json({
      beneficios,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching beneficios:', error)
    return NextResponse.json({ error: 'Error al obtener beneficios' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = beneficioSchema.parse(body)

    const slug = slugify(validatedData.titulo)

    // Verificar si ya existe un beneficio con ese slug
    const existingBenefit = await prisma.benefit.findUnique({
      where: { slug },
    })

    if (existingBenefit) {
      return NextResponse.json({ error: 'Ya existe un beneficio con ese título' }, { status: 400 })
    }

    const beneficio = await prisma.benefit.create({
      data: {
        ...validatedData,
        slug,
        imagenUrl: validatedData.imagenUrl || null,
        icono: validatedData.icono || null,
        categoryId: validatedData.categoryId || null,
        howToUse: validatedData.howToUse || null,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(beneficio, { status: 201 })
  } catch (error: any) {
    console.error('Error creating beneficio:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al crear beneficio' }, { status: 500 })
  }
}
