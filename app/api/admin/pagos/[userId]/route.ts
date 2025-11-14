import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { userId } = await params

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        registration: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    // Obtener todos los pagos del usuario
    const pagos = await prisma.payment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({
      success: true,
      pagos,
      usuario: {
        id: user.id,
        email: user.email,
        nombreCompleto: user.registration?.nombreCompleto || 'N/A',
        documento: user.registration?.documento || 'N/A',
      },
    })
  } catch (error) {
    console.error('Error obteniendo historial de pagos:', error)
    return NextResponse.json({ error: 'Error al obtener historial de pagos' }, { status: 500 })
  }
}
