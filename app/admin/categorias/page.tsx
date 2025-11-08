import { prisma } from '@/lib/prisma'
import { CategoriasContent } from '@/app/admin/categorias/content'

export default async function CategoriasAdminPage() {
  const categorias = await prisma.category.findMany({
    orderBy: { orden: 'asc' },
    include: {
      _count: {
        select: { benefits: true },
      },
    },
  })

  return <CategoriasContent initialCategories={categorias} />
}
