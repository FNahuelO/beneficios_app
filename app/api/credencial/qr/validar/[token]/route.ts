import { NextRequest, NextResponse } from 'next/server'
import { validateQRToken } from '@/lib/qr-token'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json({ error: 'Token no proporcionado' }, { status: 400 })
    }

    // Validar token
    const validation = validateQRToken(token)

    if (!validation) {
      return NextResponse.json(
        {
          error: 'Token inválido',
          valid: false,
          expired: false,
        },
        { status: 400 }
      )
    }

    if (validation.expired) {
      return NextResponse.json(
        {
          error: 'Token expirado. El QR tiene una validez de 5 minutos.',
          valid: false,
          expired: true,
        },
        { status: 410 } // 410 Gone
      )
    }

    // Verificar que la credencial existe y está aprobada
    const credential = await prisma.credential.findUnique({
      where: { id: validation.credentialId },
      include: {
        user: {
          include: {
            registration: true,
          },
        },
      },
    })

    if (!credential) {
      return NextResponse.json(
        {
          error: 'Credencial no encontrada',
          valid: false,
          expired: false,
        },
        { status: 404 }
      )
    }

    if (credential.estado !== 'APROBADO') {
      return NextResponse.json(
        {
          error: 'Credencial no aprobada',
          valid: false,
          expired: false,
        },
        { status: 403 }
      )
    }

    // Token válido y credencial aprobada
    return NextResponse.json({
      valid: true,
      expired: false,
      credential: {
        id: credential.id,
        numeroSocio: credential.numeroSocio,
        nombreCompleto: credential.user.registration?.nombreCompleto,
        documento: credential.user.registration?.documento,
        estado: credential.estado,
      },
    })
  } catch (error) {
    console.error('Error validando token QR:', error)
    return NextResponse.json(
      {
        error: 'Error al validar token',
        valid: false,
        expired: false,
      },
      { status: 500 }
    )
  }
}
