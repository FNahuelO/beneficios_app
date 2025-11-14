import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Iniciando migración de categorías...')

  // Obtener todos los beneficios con categoryId
  const benefits = await prisma.benefit.findMany({
    where: {
      categoryId: {
        not: null,
      },
    },
  })

  console.log(`📦 Encontrados ${benefits.length} beneficios con categoría`)

  // Migrar cada beneficio
  for (const benefit of benefits) {
    if (benefit.categoryId) {
      try {
        // Verificar si la relación ya existe
        const existing = await prisma.benefitCategory.findFirst({
          where: {
            benefitId: benefit.id,
            categoryId: benefit.categoryId,
          },
        })

        if (!existing) {
          await prisma.benefitCategory.create({
            data: {
              benefitId: benefit.id,
              categoryId: benefit.categoryId,
            },
          })
          console.log(`✅ Migrado: ${benefit.titulo}`)
        }
      } catch (error) {
        console.error(`❌ Error migrando ${benefit.titulo}:`, error)
      }
    }
  }

  console.log('✅ Migración completada')
}

main()
  .catch((e) => {
    console.error('❌ Error en migración:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
