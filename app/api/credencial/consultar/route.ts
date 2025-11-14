import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { consultaCredencialSchema } from '@/lib/validations'
import { generateQRToken, generateQRTokenURL } from '@/lib/qr-token'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = consultaCredencialSchema.parse(body)

    // Buscar solicitud de registro por documento y email
    const registrationRequest = await prisma.registrationRequest.findFirst({
      where: {
        documento: validatedData.documento,
        user: {
          email: validatedData.email,
        },
      },
      include: {
        user: {
          include: {
            credential: true,
          },
        },
      },
    })

    if (!registrationRequest) {
      return NextResponse.json(
        { error: 'No se encontró ninguna credencial con esos datos' },
        { status: 404 }
      )
    }

    const credentialId = registrationRequest.user?.credential?.id

    // Generar token QR temporal si la credencial existe y está aprobada
    let qrToken = null
    let qrTokenURL = null
    if (credentialId && registrationRequest.estado === 'APROBADO') {
      qrToken = generateQRToken(credentialId)
      const baseUrl =
        process.env.NEXTAUTH_URL || request.headers.get('origin') || 'http://localhost:3000'
      qrTokenURL = generateQRTokenURL(qrToken, baseUrl)
    }

    return NextResponse.json({
      nombreCompleto: registrationRequest.nombreCompleto,
      tipoDocumento: registrationRequest.tipoDocumento,
      documento: registrationRequest.documento,
      estado: registrationRequest.estado,
      numeroSocio: registrationRequest.user?.credential?.numeroSocio || null,
      credentialId: credentialId || null,
      fechaAlta: registrationRequest.createdAt,
      comentarioAdmin: registrationRequest.comentarioAdmin,
      qrToken,
      qrTokenURL,
    })
  } catch (error: any) {
    console.error('Error consultando credencial:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al consultar credencial' }, { status: 500 })
  }
}
