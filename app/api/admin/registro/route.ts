import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { exportToCSV, exportToExcel } from '@/lib/export'

export async function GET(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const estado = searchParams.get('estado')
    const search = searchParams.get('search') || ''
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const format = searchParams.get('format') // csv o xlsx
    const skip = (page - 1) * limit

    const where: any = {}

    if (estado) {
      where.estado = estado
    }

    if (search) {
      where.OR = [
        { nombreCompleto: { contains: search, mode: 'insensitive' } },
        { documento: { contains: search, mode: 'insensitive' } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    if (from || to) {
      where.createdAt = {}
      if (from) where.createdAt.gte = new Date(from)
      if (to) where.createdAt.lte = new Date(to)
    }

    // Si se solicita exportación
    if (format === 'csv' || format === 'xlsx') {
      const registros = await prisma.registrationRequest.findMany({
        where,
        include: {
          user: {
            select: { email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      const data = registros.map((r) => ({
        'Nombre Completo': r.nombreCompleto,
        'Tipo Documento': r.tipoDocumento,
        Documento: r.documento,
        Email: r.user.email,
        Teléfono: r.telefono,
        Domicilio: r.domicilio,
        Ciudad: r.ciudad,
        Provincia: r.provincia,
        País: r.pais,
        Estado: r.estado,
        'Fecha Solicitud': r.createdAt.toISOString(),
        'Comentario Admin': r.comentarioAdmin || '',
      }))

      if (format === 'csv') {
        const csv = exportToCSV(data, Object.keys(data[0] || {}))
        return new NextResponse(csv, {
          headers: {
            'Content-Type': 'text/csv',
            'Content-Disposition': `attachment; filename="registros-${new Date().toISOString()}.csv"`,
          },
        })
      } else {
        const xlsx = exportToExcel(data, 'Registros')
        return new NextResponse(xlsx, {
          headers: {
            'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Disposition': `attachment; filename="registros-${new Date().toISOString()}.xlsx"`,
          },
        })
      }
    }

    // Respuesta normal con paginación
    const [registros, total] = await Promise.all([
      prisma.registrationRequest.findMany({
        where,
        include: {
          user: {
            select: { email: true, id: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
      }),
      prisma.registrationRequest.count({ where }),
    ])

    return NextResponse.json({
      registros,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Error fetching registros:', error)
    return NextResponse.json({ error: 'Error al obtener registros' }, { status: 500 })
  }
}
