import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { RegEstado } from '@prisma/client'

export async function GET() {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const [totalBeneficios, totalRegistros, pendientes, aprobados, rechazados, ultimosPendientes] =
      await Promise.all([
        prisma.benefit.count(),
        prisma.registrationRequest.count(),
        prisma.registrationRequest.count({
          where: { estado: RegEstado.PENDIENTE },
        }),
        prisma.registrationRequest.count({
          where: { estado: RegEstado.APROBADO },
        }),
        prisma.registrationRequest.count({
          where: { estado: RegEstado.RECHAZADO },
        }),
        prisma.registrationRequest.findMany({
          where: { estado: RegEstado.PENDIENTE },
          include: {
            user: {
              select: { email: true },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        }),
      ])

    return NextResponse.json({
      stats: {
        totalBeneficios,
        totalRegistros,
        pendientes,
        aprobados,
        rechazados,
      },
      ultimosPendientes,
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json({ error: 'Error al obtener estadísticas' }, { status: 500 })
  }
}
