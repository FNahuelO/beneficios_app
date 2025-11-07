import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Phone, Clock, MessageSquare, Stethoscope } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TelemedicinaPage() {
  const settings = await prisma.settings.findUnique({
    where: { id: 'singleton' },
  })

  const telefono = settings?.telefonoPrincipal || '+54 11 4444-5555'
  const mensaje =
    settings?.mensajeInformativo ||
    'Nuestro servicio de telemedicina está disponible las 24 horas, los 7 días de la semana. Comunicate para recibir atención médica a distancia.'

  // Detectar si es móvil para el botón tel:
  const telefonoLink = `tel:${telefono.replace(/\s/g, '')}`

  return (
    <div className="container max-w-4xl py-12">
      <div className="mb-8 text-center">
        <Stethoscope className="mx-auto mb-4 h-16 w-16 text-primary" />
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Telemedicina</h1>
        <p className="text-lg text-muted-foreground">
          Atención médica a distancia, cuando lo necesites
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-2">
          <CardHeader>
            <Clock className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Disponibilidad</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              24 horas, 7 días a la semana. Atención inmediata para tus consultas médicas.
            </p>
          </CardContent>
        </Card>

        <Card className="border-2">
          <CardHeader>
            <MessageSquare className="mb-2 h-8 w-8 text-primary" />
            <CardTitle>Atención Profesional</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Médicos certificados listos para atender tus consultas por teléfono o videollamada.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-2xl">Contacto de Telemedicina</CardTitle>
          <CardDescription>{mensaje}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="rounded-lg bg-primary/10 p-8 text-center">
            <Phone className="mx-auto mb-4 h-12 w-12 text-primary" />
            <p className="mb-2 text-sm font-medium text-muted-foreground">Número de contacto</p>
            <p className="mb-6 text-3xl font-bold">{telefono}</p>

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button size="lg" asChild>
                <a href={telefonoLink}>
                  <Phone className="mr-2 h-5 w-5" />
                  Llamar Ahora
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a
                  href={`https://wa.me/${telefono.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageSquare className="mr-2 h-5 w-5" />
                  WhatsApp
                </a>
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">¿Cómo funciona?</h3>
            <ol className="space-y-3 text-sm text-muted-foreground">
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  1
                </span>
                <span>Llamá al número de telemedicina o enviá un mensaje de WhatsApp</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  2
                </span>
                <span>Proporcioná tu número de credencial y describí tu consulta</span>
              </li>
              <li className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  3
                </span>
                <span>Un profesional te atenderá de inmediato o agendará una videollamada</span>
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
