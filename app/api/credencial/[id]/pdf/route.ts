import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { generateCredentialPDF } from '@/lib/pdf'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params

    const credential = await prisma.credential.findUnique({
      where: { id },
      include: {
        user: {
          include: {
            registration: true,
          },
        },
      },
    })

    if (!credential || !credential.user.registration) {
      return NextResponse.json({ error: 'Credencial no encontrada' }, { status: 404 })
    }

    if (credential.estado !== 'APROBADO') {
      return NextResponse.json({ error: 'La credencial no está aprobada' }, { status: 403 })
    }

    const pdfBuffer = await generateCredentialPDF({
      id: credential.id,
      nombreCompleto: credential.user.registration.nombreCompleto,
      documento: credential.user.registration.documento,
      numeroSocio: credential.numeroSocio,
      estado: credential.estado,
    })

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="credencial-${credential.numeroSocio}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF:', error)
    return NextResponse.json({ error: 'Error al generar PDF' }, { status: 500 })
  }
}
