import { prisma } from '@/lib/prisma'
import { EspecialidadesContent } from '@/app/admin/especialidades/content'

export default async function EspecialidadesAdminPage() {
  const especialidades = await prisma.medicalSpecialty.findMany({
    orderBy: { orden: 'asc' },
  })

  return <EspecialidadesContent initialSpecialties={especialidades} />
}
