import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Phone } from 'lucide-react'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function TelemedicinaPage() {
  const settings = await prisma.settings.findUnique({
    where: { id: 'singleton' },
  })

  const telefono = settings?.telefonoPrincipal || '+54 11 4379-5506'
  const mensaje =
    settings?.mensajeInformativo ||
    'Nuestro servicio de telemedicina está disponible las 24 horas, los 7 días de la semana. Comunicate para recibir atención médica a distancia.'

  const telefonoLink = `tel:${telefono.replace(/\s/g, '')}`

  const especialidades = [
    {
      nombre: 'Cardiología',
      imagen: 'https://images.unsplash.com/photo-1628348068343-c6a848d2b6dd?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Clínica médica general',
      imagen: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Pediatría',
      imagen: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Psicología',
      imagen: 'https://images.unsplash.com/photo-1573497491208-6b1acb260507?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Dermatología',
      imagen: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop',
    },
    {
      nombre: 'Ginecología',
      imagen: 'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=400&h=400&fit=crop',
    },
  ]

  return (
    <div className="min-h-screen bg-linear-to-br from-[#00438A] to-[#0050A4] text-white">
      <div className="container max-w-6xl py-12 px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-3 text-4xl font-bold tracking-tight">Telemedicina</h1>
          <p className="text-lg text-gray-200">Atención médica a distancia, cuando lo necesites</p>
        </div>

        {/* Características principales */}
        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <div className="rounded-lg border-2 border-[#4A608F] bg-[#00438A] p-12">
            <h3 className="mb-3 text-xl font-semibold">Disponibilidad</h3>
            <p className="text-gray-200 mb-2">24 horas, 7 días a la semana.</p>
            <p className="text-gray-200">Atención inmediata para tus consultas médicas.</p>
          </div>

          <div className="rounded-lg border-2 border-[#4A608F] bg-[#00438A] p-12">
            <h3 className="mb-3 text-xl font-semibold">Atención Profesional</h3>
            <p className="text-gray-200">
              Médicos certificados para atender tus consultas por teléfono o videollamada.
            </p>
          </div>
        </div>

        {/* Contacto */}
        <div className="rounded-lg bg-[#103F79] p-8 mb-8 border border-[#4A608F] px-36 py-8 text-center xs:p-6">
          <h2 className="mb-3 text-2xl font-semibold">Contacto de Telemedicina</h2>
          <p className="mb-6 text-gray-200">{mensaje}</p>

          <div className="rounded-lg bg-[#8DB1FF26] p-8 border border-[#8DB1FF]">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-500/20">
                <Phone className="h-8 w-8 text-blue-300" />
              </div>
              <p className="mb-2 text-sm text-gray-300">Número de contacto</p>
              <p className="mb-6 text-3xl font-bold">{telefono}</p>

              <div className="flex flex-col gap-3 sm:flex-row xs:justify-center xs:flex-row xs:w-full">
                <Button
                  size="lg"
                  className="bg-[#F3B229] text-white hover:bg-[#F3B229]/90 font-semibold rounded-2xl w-1/4 xs:w-1/2"
                  asChild
                >
                  <a href={telefonoLink}>Llamar</a>
                </Button>
                <Button
                  size="lg"
                  className="bg-[#00438A] text-white hover:bg-[#00438A]/90 font-semibold rounded-2xl w-1/4 xs:w-1/2"
                  asChild
                >
                  <a
                    href={`https://wa.me/${telefono.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    WhatsApp
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Cómo funciona */}
        <div className="rounded-lg bg-[#00438A] p-8 mb-12 border border-[#4A608F]">
          <h2 className="mb-6 text-2xl font-semibold">¿Cómo funciona?</h2>
          <ol className="space-y-4">
            <li className="flex gap-4 text-gray-200">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00000017] text-sm font-semibold">
                1
              </span>
              <span>Llamá al número de telemedicina o enviá un mensaje de WhatsApp.</span>
            </li>
            <li className="flex gap-4 text-gray-200">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00000017] text-sm font-semibold">
                2
              </span>
              <span>Proporcioná tu número de credencial y describí tu consulta.</span>
            </li>
            <li className="flex gap-4 text-gray-200">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#00000017] text-sm font-semibold">
                3
              </span>
              <span>Un profesional te atenderá de inmediato o agendará una videollamada.</span>
            </li>
          </ol>
        </div>

        {/* Especialidades médicas */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {especialidades.map((especialidad) => (
            <div key={especialidad.nombre} className="text-center bg-white">
              <div className="relative aspect-video overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#024D9DB8] z-10" />
                <Image
                  src={especialidad?.imagen || ''}
                  alt={especialidad?.nombre || ''}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm font-medium text-[#64749A] p-3">{especialidad.nombre}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
