import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { registroSchema } from '@/lib/validations'
import bcrypt from 'bcryptjs'
import { RegEstado } from '@prisma/client'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const validatedData = registroSchema.parse(body)

    // Verificar si ya existe un usuario con ese email
    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    })

    if (existingUser) {
      return NextResponse.json({ error: 'Ya existe un usuario con ese email' }, { status: 400 })
    }

    // Verificar si ya existe una solicitud con ese documento
    const existingRequest = await prisma.registrationRequest.findFirst({
      where: { documento: validatedData.documento },
    })

    if (existingRequest) {
      return NextResponse.json(
        { error: 'Ya existe una solicitud con ese documento' },
        { status: 400 }
      )
    }

    // Crear usuario con contraseña temporal (el documento)
    const passwordHash = await bcrypt.hash(validatedData.documento, 10)

    const user = await prisma.user.create({
      data: {
        email: validatedData.email,
        passwordHash,
        role: 'USER',
      },
    })

    // Crear solicitud de registro
    const nombreCompleto = `${validatedData.nombre} ${validatedData.apellido}`.trim()
    const registrationRequest = await prisma.registrationRequest.create({
      data: {
        userId: user.id,
        nombreCompleto: nombreCompleto,
        tipoDocumento: validatedData.tipoDocumento,
        documento: validatedData.documento,
        telefono: validatedData.telefono,
        domicilio: validatedData.domicilio,
        ciudad: validatedData.ciudad,
        provincia: validatedData.provincia,
        pais: validatedData.pais,
        estado: RegEstado.PENDIENTE,
      },
    })

    // No enviamos email aquí, se enviará después del pago cuando se apruebe automáticamente

    return NextResponse.json(
      {
        success: true,
        message: 'Registro completado. Por favor, completa el pago para finalizar.',
        registrationId: registrationRequest.id,
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating registration:', error)

    if (error.name === 'ZodError') {
      return NextResponse.json({ error: 'Datos inválidos', details: error.errors }, { status: 400 })
    }

    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 })
  }
}
