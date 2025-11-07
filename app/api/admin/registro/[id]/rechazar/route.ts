import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail, emailSolicitudRechazada } from '@/lib/email'
import { rechazoSchema } from '@/lib/validations'
import { RegEstado } from '@prisma/client'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = rechazoSchema.parse(body)

    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    })

    if (!registrationRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    if (registrationRequest.estado === RegEstado.RECHAZADO) {
      return NextResponse.json({ error: 'La solicitud ya está rechazada' }, { status: 400 })
    }

    // Actualizar el estado de la solicitud
    await prisma.registrationRequest.update({
      where: { id: params.id },
      data: {
        estado: RegEstado.RECHAZADO,
        comentarioAdmin: validatedData.comentarioAdmin,
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
          estado: RegEstado.RECHAZADO,
        },
      })
    }

    // Enviar email de rechazo
    const emailTemplate = emailSolicitudRechazada(
      registrationRequest.nombreCompleto,
      validatedData.comentarioAdmin
    )

    await sendEmail({
      to: registrationRequest.user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    return NextResponse.json({
      success: true,
    })
  } catch (error: any) {
    console.error('Error rechazando solicitud:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al rechazar solicitud' }, { status: 500 })
  }
}
