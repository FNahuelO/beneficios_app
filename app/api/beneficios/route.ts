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
      where.categories = {
        some: {
          category: {
            slug: categoria,
          },
        },
      }
    }

    if (destacado !== null && destacado !== undefined && destacado !== '') {
      where.destacado = destacado === 'true'
    }

    const [beneficios, total] = await Promise.all([
      prisma.benefit.findMany({
        where,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
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

    let slug = slugify(validatedData.titulo)
    let baseSlug = slug

    // Verificar si ya existe un beneficio con ese slug y generar uno único si es necesario
    let counter = 1
    while (await prisma.benefit.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Extraer categoryIds y crear el beneficio con las categorías
    const { categoryIds, ...beneficioData } = validatedData
    const categoryIdsArray = categoryIds && categoryIds.length > 0 ? categoryIds : []

    const beneficio = await prisma.benefit.create({
      data: {
        ...beneficioData,
        slug,
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

    return NextResponse.json(beneficio, { status: 201 })
  } catch (error: any) {
    console.error('Error creating beneficio:', error)

    if (error.name === 'ZodError' || error.issues) {
      const zodError = error.issues ? error : error
      return NextResponse.json(
        {
          error: 'Datos inválidos',
          details: zodError.issues || zodError.errors || error.errors,
        },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Error al crear beneficio' }, { status: 500 })
  }
}
