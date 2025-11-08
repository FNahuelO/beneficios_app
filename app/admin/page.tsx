import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Gift, Users, Clock, CheckCircle, XCircle } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { prisma } from '@/lib/prisma'
import { RegEstado } from '@prisma/client'
import { auth } from '@/lib/auth'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

async function getStats() {
  const session = await auth()

  if (!session?.user || !['ADMIN', 'COORDINATOR'].includes(session.user.role)) {
    redirect('/login')
  }

  const [totalBeneficios, totalRegistros, pendientes, aprobados, rechazados, ultimosPendientes] =
    await Promise.all([
      prisma.benefit.count(),
      prisma.registrationRequest.count(),
      prisma.registrationRequest.count({
        where: { estado: RegEstado.PENDIENTE },
      }),
      prisma.registrationRequest.count({
        where: { estado: RegEstado.APROBADO },
      }),
      prisma.registrationRequest.count({
        where: { estado: RegEstado.RECHAZADO },
      }),
      prisma.registrationRequest.findMany({
        where: { estado: RegEstado.PENDIENTE },
        include: {
          user: {
            select: { email: true },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      }),
    ])

  return {
    stats: {
      totalBeneficios,
      totalRegistros,
      pendientes,
      aprobados,
      rechazados,
    },
    ultimosPendientes,
  }
}

export default async function AdminDashboard() {
  const { stats, ultimosPendientes } = await getStats()

  const kpis = [
    {
      title: 'Total Beneficios',
      value: stats.totalBeneficios,
      icon: Gift,
      color: 'text-blue-600',
    },
    {
      title: 'Total Registros',
      value: stats.totalRegistros,
      icon: Users,
      color: 'text-purple-600',
    },
    {
      title: 'Pendientes',
      value: stats.pendientes,
      icon: Clock,
      color: 'text-yellow-600',
    },
    {
      title: 'Aprobados',
      value: stats.aprobados,
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Rechazados',
      value: stats.rechazados,
      icon: XCircle,
      color: 'text-red-600',
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Bienvenido al panel administrativo</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => {
          const Icon = kpi.icon
          return (
            <Card key={kpi.title}>
              <CardHeader className="pb-2">
                <CardDescription>{kpi.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{kpi.value}</div>
                  <Icon className={`h-8 w-8 ${kpi.color}`} />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Últimos pendientes */}
      <Card>
        <CardHeader>
          <CardTitle>Últimos Registros Pendientes</CardTitle>
          <CardDescription>Solicitudes esperando aprobación</CardDescription>
        </CardHeader>
        <CardContent>
          {ultimosPendientes.length === 0 ? (
            <p className="text-center text-muted-foreground">No hay solicitudes pendientes</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ultimosPendientes.map((registro: any) => (
                  <TableRow key={registro.id}>
                    <TableCell className="font-medium">{registro.nombreCompleto}</TableCell>
                    <TableCell>
                      {registro.tipoDocumento}: {registro.documento}
                    </TableCell>
                    <TableCell>{registro.user.email}</TableCell>
                    <TableCell>{formatDate(registro.createdAt)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        Pendiente
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
