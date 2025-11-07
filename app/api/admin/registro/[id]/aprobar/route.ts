import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { sendEmail, emailSolicitudAprobada } from '@/lib/email'
import { RegEstado } from '@prisma/client'

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { id: params.id },
      include: {
        user: true,
      },
    })

    if (!registrationRequest) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
    }

    if (registrationRequest.estado === RegEstado.APROBADO) {
      return NextResponse.json({ error: 'La solicitud ya está aprobada' }, { status: 400 })
    }

    // Actualizar el estado de la solicitud
    await prisma.registrationRequest.update({
      where: { id: params.id },
      data: {
        estado: RegEstado.APROBADO,
      },
    })

    // Crear o actualizar credencial
    const credential = await prisma.credential.upsert({
      where: { userId: registrationRequest.userId },
      update: {
        estado: RegEstado.APROBADO,
        qrPayload: registrationRequest.id,
      },
      create: {
        userId: registrationRequest.userId,
        estado: RegEstado.APROBADO,
        numeroSocio: `SOC-${Date.now()}`, // Generar número de socio único
        qrPayload: registrationRequest.id,
      },
    })

    // Enviar email de aprobación
    const credencialUrl = `${process.env.NEXTAUTH_URL}/credencial?doc=${registrationRequest.documento}&email=${registrationRequest.user.email}`

    const emailTemplate = emailSolicitudAprobada(registrationRequest.nombreCompleto, credencialUrl)

    await sendEmail({
      to: registrationRequest.user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    return NextResponse.json({
      success: true,
      credential,
    })
  } catch (error) {
    console.error('Error aprobando solicitud:', error)
    return NextResponse.json({ error: 'Error al aprobar solicitud' }, { status: 500 })
  }
}
