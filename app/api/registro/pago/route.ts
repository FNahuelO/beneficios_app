import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { pagoSchema } from '@/lib/validations'
import { sendEmail, emailSolicitudAprobada } from '@/lib/email'
import { RegEstado, PaymentStatus } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = pagoSchema.parse(body)

    // Buscar la solicitud de registro
    const registrationRequest = await prisma.registrationRequest.findUnique({
      where: { id: validatedData.registrationId },
      include: {
        user: true,
      },
    })

    if (!registrationRequest) {
      return NextResponse.json({ error: 'Solicitud de registro no encontrada' }, { status: 404 })
    }

    if (registrationRequest.estado === RegEstado.APROBADO) {
      return NextResponse.json({ error: 'El registro ya está aprobado' }, { status: 400 })
    }

    // Simular procesamiento del pago (en producción aquí se llamaría al servicio externo)
    // Por ahora, simulamos un delay y validación básica
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Validación básica de tarjeta de prueba
    const cardNumber = validatedData.numeroTarjeta.replace(/\s/g, '')
    if (cardNumber.length < 16) {
      return NextResponse.json({ error: 'Número de tarjeta inválido' }, { status: 400 })
    }

    // Simular respuesta exitosa del servicio de pago
    const cardLast4 = cardNumber.slice(-4)
    const monto = validatedData.monto || 0 // En producción, esto vendría del servicio de pago

    console.log('💳 Pago simulado procesado:', {
      registrationId: validatedData.registrationId,
      cardLast4,
      monto,
    })

    // Crear registro del pago
    const payment = await prisma.payment.create({
      data: {
        userId: registrationRequest.userId,
        registrationId: validatedData.registrationId,
        monto: monto,
        moneda: 'ARS',
        metodoPago: 'tarjeta',
        numeroTarjeta: cardLast4, // Solo guardamos los últimos 4 dígitos
        nombreTitular: validatedData.nombreTitular,
        estado: PaymentStatus.COMPLETADO,
        referenciaExterna: `SIM-${Date.now()}`, // En producción, sería el ID del servicio externo
        metadata: JSON.stringify({
          fechaVencimiento: validatedData.fechaVencimiento,
          // No guardamos el CVV por seguridad
        }),
      },
    })

    // Actualizar el estado de la solicitud a APROBADO
    await prisma.registrationRequest.update({
      where: { id: validatedData.registrationId },
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
    const credencialUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/credencial?doc=${registrationRequest.documento}&email=${registrationRequest.user.email}`

    const emailTemplate = emailSolicitudAprobada(registrationRequest.nombreCompleto, credencialUrl)

    await sendEmail({
      to: registrationRequest.user.email,
      subject: emailTemplate.subject,
      html: emailTemplate.html,
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Pago procesado exitosamente. Tu registro ha sido aprobado.',
        credential,
        paymentId: payment.id,
      },
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error procesando pago:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Datos de pago inválidos', details: error.errors },
        { status: 400 }
      )
    }

    return NextResponse.json({ error: 'Error al procesar el pago' }, { status: 500 })
  }
}
