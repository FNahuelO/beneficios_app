import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'
import { telemedicinaSettingsSchema } from '@/lib/validations'

export async function GET() {
  try {
    const settings = await prisma.settings.findUnique({
      where: { id: 'singleton' },
    })

    if (!settings) {
      return NextResponse.json({
        telefonoPrincipal: '',
        mensajeInformativo: '',
      })
    }

    return NextResponse.json({
      telefonoPrincipal: settings.telefonoPrincipal || '',
      mensajeInformativo: settings.mensajeInformativo || '',
    })
  } catch (error) {
    console.error('Error fetching telemedicina settings:', error)
    return NextResponse.json({ error: 'Error al obtener configuración' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = telemedicinaSettingsSchema.parse(body)

    const settings = await prisma.settings.upsert({
      where: { id: 'singleton' },
      update: {
        telefonoPrincipal: validatedData.telefonoPrincipal,
        mensajeInformativo: validatedData.mensajeInformativo,
      },
      create: {
        id: 'singleton',
        telefonoPrincipal: validatedData.telefonoPrincipal,
        mensajeInformativo: validatedData.mensajeInformativo,
      },
    })

    return NextResponse.json(settings)
  } catch (error: any) {
    console.error('Error updating telemedicina settings:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al actualizar configuración' }, { status: 500 })
  }
}
