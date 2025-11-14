import { prisma } from '@/lib/prisma'
import { BeneficiosContent } from './content'

export default async function BeneficiosAdminPage() {
  const beneficios = await prisma.benefit.findMany({
    include: {
      categories: {
        include: {
          category: true,
        },
      },
    },
    orderBy: [{ destacado: 'desc' }, { createdAt: 'desc' }],
  })

  return <BeneficiosContent initialBeneficios={beneficios} />
}
