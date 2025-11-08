import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { consultaCredencialSchema } from '@/lib/validations'

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

    return NextResponse.json({
      nombreCompleto: registrationRequest.nombreCompleto,
      tipoDocumento: registrationRequest.tipoDocumento,
      documento: registrationRequest.documento,
      estado: registrationRequest.estado,
      numeroSocio: registrationRequest.user?.credential?.numeroSocio || null,
      credentialId: registrationRequest.user?.credential?.id || null,
      fechaAlta: registrationRequest.createdAt,
      comentarioAdmin: registrationRequest.comentarioAdmin,
    })
  } catch (error: any) {
    console.error('Error consultando credencial:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al consultar credencial' }, { status: 500 })
  }
}
