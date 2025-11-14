import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { RegEstado } from '@prisma/client'

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { id } = await params

    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { id },
      include: {
        user: true,
      },
    })

    if (!registrationRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    // Toggle entre APROBADO e INHABILITADO
    const nuevoEstado =
      registrationRequest.estado === RegEstado.APROBADO
        ? RegEstado.INHABILITADO
        : RegEstado.APROBADO

    // Actualizar el estado de la solicitud
    await prisma.registrationRequest.update({
      where: { id },
      data: {
        estado: nuevoEstado,
      },
    })

    // Actualizar credencial si existe
    const existingCredential = await prisma.credential.findUnique({
      where: { userId: registrationRequest.userId },
    })

    if (existingCredential) {
      await prisma.credential.update({
        where: { userId: registrationRequest.userId },
        data: {
          estado: nuevoEstado,
        },
      })
    }

    // Si se está habilitando (cambiando a APROBADO), crear credencial si no existe
    if (nuevoEstado === RegEstado.APROBADO && !existingCredential) {
      await prisma.credential.upsert({
        where: { userId: registrationRequest.userId },
        update: {
          estado: RegEstado.APROBADO,
          qrPayload: registrationRequest.id,
        },
        create: {
          userId: registrationRequest.userId,
          estado: RegEstado.APROBADO,
          numeroSocio: `SOC-${Date.now()}`,
          qrPayload: registrationRequest.id,
        },
      })
    }

    return NextResponse.json({
      success: true,
      nuevoEstado,
      message: nuevoEstado === RegEstado.APROBADO ? 'Usuario habilitado' : 'Usuario inhabilitado',
    })
  } catch (error: any) {
    console.error('Error al cambiar estado:', error)
    return NextResponse.json({ error: 'Error al cambiar estado' }, { status: 500 })
  }
}
