import { PrismaClient, Role, RegEstado } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed...')

  // Crear usuarios admin y coordinator
  const adminPassword = await bcrypt.hash('admin123', 10)
  const coordPassword = await bcrypt.hash('coord123', 10)

  const admin = await prisma.user.upsert({
    where: { email: 'admin@demo.com' },
    update: {},
    create: {
      email: 'admin@demo.com',
      passwordHash: adminPassword,
      role: Role.ADMIN,
    },
  })

  const coordinator = await prisma.user.upsert({
    where: { email: 'coord@demo.com' },
    update: {},
    create: {
      email: 'coord@demo.com',
      passwordHash: coordPassword,
      role: Role.COORDINATOR,
    },
  })

  console.log('✅ Usuarios creados:', admin.email, coordinator.email)

  // Crear categorías
  const categorias = [
    { nombre: 'Salud', slug: 'salud', orden: 1 },
    { nombre: 'Gastronomía', slug: 'gastronomia', orden: 2 },
    { nombre: 'Educación', slug: 'educacion', orden: 3 },
    { nombre: 'Deportes', slug: 'deportes', orden: 4 },
    { nombre: 'Viajes', slug: 'viajes', orden: 5 },
    { nombre: 'Otros', slug: 'otros', orden: 6 },
  ]

  const categoriasCreadas = []
  for (const cat of categorias) {
    const categoria = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
    categoriasCreadas.push(categoria)
  }

  console.log('✅ Categorías creadas:', categoriasCreadas.length)

  // Crear beneficios de ejemplo
  const beneficios = [
    {
      titulo: 'Consulta médica con 30% de descuento',
      slug: 'consulta-medica-30-descuento',
      descripcion:
        'Obtén un 30% de descuento en consultas médicas con nuestros profesionales asociados. Atención de calidad para vos y tu familia.',
      imagenUrl:
        'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&h=600&fit=crop',
      icono: 'Stethoscope',
      destacado: true,
      categoryId: categoriasCreadas[0].id,
      howToUse:
        '<p>Presentá tu credencial digital al momento de solicitar el turno. El descuento se aplicará directamente en la factura.</p>',
    },
    {
      titulo: '2x1 en pizzas todos los martes',
      slug: '2x1-pizzas-martes',
      descripcion:
        'Disfrutá de dos pizzas por el precio de una todos los martes. Válido en locales seleccionados de la cadena.',
      imagenUrl:
        'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&h=600&fit=crop',
      icono: 'Pizza',
      destacado: true,
      categoryId: categoriasCreadas[1].id,
      howToUse:
        '<p>Mostrá tu credencial al momento de hacer el pedido. No acumulable con otras promociones.</p>',
    },
    {
      titulo: '20% off en cursos de inglés',
      slug: '20-off-cursos-ingles',
      descripcion:
        'Aprende inglés con descuento en institutos asociados. Todos los niveles disponibles.',
      imagenUrl: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=800&h=600&fit=crop',
      icono: 'GraduationCap',
      destacado: false,
      categoryId: categoriasCreadas[2].id,
      howToUse:
        '<p>Presentá tu credencial al momento de la inscripción para obtener el descuento.</p>',
    },
    {
      titulo: 'Gimnasio: 3 meses por el precio de 2',
      slug: 'gimnasio-3x2',
      descripcion:
        'Acceso completo al gimnasio con promoción especial para socios. Incluye musculación y clases grupales.',
      imagenUrl:
        'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&h=600&fit=crop',
      icono: 'Dumbbell',
      destacado: true,
      categoryId: categoriasCreadas[3].id,
      howToUse: '<p>Acercate con tu credencial digital al gimnasio para activar la promoción.</p>',
    },
    {
      titulo: '15% de descuento en paquetes turísticos',
      slug: '15-descuento-paquetes-turisticos',
      descripcion: 'Viajá por Argentina con descuentos exclusivos. Consulta destinos disponibles.',
      imagenUrl:
        'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop',
      icono: 'Plane',
      destacado: false,
      categoryId: categoriasCreadas[4].id,
      howToUse:
        '<p>Contactá a la agencia mencionando tu número de socio para recibir el descuento.</p>',
    },
    {
      titulo: 'Odontología: limpieza dental gratuita',
      slug: 'odontologia-limpieza-gratuita',
      descripcion:
        'Primera limpieza dental sin cargo. Consultas posteriores con descuento del 25%.',
      imagenUrl:
        'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&h=600&fit=crop',
      icono: 'Smile',
      destacado: true,
      categoryId: categoriasCreadas[0].id,
      howToUse: '<p>Solicitá tu turno presentando tu credencial digital.</p>',
    },
    {
      titulo: 'Descuento en cafeterías',
      slug: 'descuento-cafeterias',
      descripcion: '10% de descuento en consumo de cafeterías adheridas. Todos los días.',
      imagenUrl:
        'https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&h=600&fit=crop',
      icono: 'Coffee',
      destacado: false,
      categoryId: categoriasCreadas[1].id,
      howToUse: '<p>Mostrá tu credencial antes de pagar.</p>',
    },
    {
      titulo: 'Clases de yoga con descuento',
      slug: 'clases-yoga-descuento',
      descripcion:
        'Clases de yoga con 25% de descuento. Todos los niveles. Espacios al aire libre disponibles.',
      imagenUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      icono: 'Heart',
      destacado: false,
      categoryId: categoriasCreadas[3].id,
      howToUse: '<p>Registrate mostrando tu credencial en la primera clase.</p>',
    },
    {
      titulo: 'Taller de fotografía gratuito',
      slug: 'taller-fotografia-gratuito',
      descripcion: 'Taller introductorio de fotografía sin cargo. Cupos limitados por mes.',
      imagenUrl:
        'https://images.unsplash.com/photo-1452587925148-ce544e77e70d?w=800&h=600&fit=crop',
      icono: 'Camera',
      destacado: true,
      categoryId: categoriasCreadas[2].id,
      howToUse: '<p>Inscribite online con tu número de socio.</p>',
    },
    {
      titulo: 'Spa: día de relax con 40% off',
      slug: 'spa-dia-relax-40-off',
      descripcion: 'Día completo de spa con descuento. Incluye masajes, sauna y piscina.',
      imagenUrl:
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&h=600&fit=crop',
      icono: 'Sparkles',
      destacado: false,
      categoryId: categoriasCreadas[0].id,
      howToUse: '<p>Reservá con anticipación presentando tu credencial.</p>',
    },
    {
      titulo: 'Librería: 3 libros por 2',
      slug: 'libreria-3x2',
      descripcion: 'Comprá 3 libros y pagá solo 2. Válido en toda la librería.',
      imagenUrl:
        'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&h=600&fit=crop',
      icono: 'Book',
      destacado: false,
      categoryId: categoriasCreadas[2].id,
      howToUse: '<p>Aplicable en caja al momento de compra con tu credencial.</p>',
    },
    {
      titulo: 'Asesoramiento legal gratuito',
      slug: 'asesoramiento-legal-gratuito',
      descripcion:
        'Primera consulta legal sin cargo. Especialistas en diferentes áreas del derecho.',
      imagenUrl:
        'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800&h=600&fit=crop',
      icono: 'Scale',
      destacado: true,
      categoryId: categoriasCreadas[5].id,
      howToUse: '<p>Solicitá tu turno online o por teléfono con tu número de socio.</p>',
    },
  ]

  for (const beneficio of beneficios) {
    await prisma.benefit.upsert({
      where: { slug: beneficio.slug },
      update: {},
      create: beneficio,
    })
  }

  console.log('✅ Beneficios creados:', beneficios.length)

  // Crear configuración inicial de Settings
  await prisma.settings.upsert({
    where: { id: 'singleton' },
    update: {},
    create: {
      id: 'singleton',
      telefonoPrincipal: '+54 11 4444-5555',
      mensajeInformativo:
        'Nuestro servicio de telemedicina está disponible las 24 horas, los 7 días de la semana. Comunicate para recibir atención médica a distancia.',
      nombreOrganizacion: 'Mi Organización',
    },
  })

  console.log('✅ Settings creados')

  console.log('🎉 Seed completado exitosamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
