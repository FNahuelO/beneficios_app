# Aplicación de Beneficios

Plataforma web completa de gestión de beneficios con sistema de credenciales digitales, panel administrativo y telemedicina.

## 🚀 Características

### Funcionalidades Principales

- **Sistema de Registro de Usuarios**: Formulario completo con validaciones
- **Credencial Digital**: Consulta y descarga de credencial en PDF
- **Gestión de Beneficios**: CRUD completo con categorías y filtros
- **Panel Administrativo**: Dashboard con estadísticas y gestión completa
- **Aprobación de Solicitudes**: Workflow de aprobación/rechazo con notificaciones
- **Telemedicina**: Página de contacto con botones de llamada directa
- **Exportación de Datos**: Export a CSV y Excel
- **Notificaciones por Email**: Sistema de emails transaccionales
- **Autenticación y Roles**: NextAuth con roles ADMIN, COORDINATOR y USER
- **Dark Mode**: Soporte completo para modo oscuro
- **Responsive Design**: Diseño adaptable a todos los dispositivos

### Stack Tecnológico

- **Frontend**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **Base de Datos**: PostgreSQL + Prisma ORM
- **Autenticación**: NextAuth v5 (beta)
- **Validaciones**: Zod + React Hook Form
- **Emails**: Resend API
- **Exportación**: json2csv + xlsx
- **PDF**: jsPDF + QRCode
- **Iconos**: Lucide React

## 📦 Instalación

### Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
- npm o yarn

### Pasos de Instalación

1. **Clonar o ubicarse en el directorio del proyecto**

```bash
cd ~/Escritorio/beneficios-app
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Copiar el archivo `.env.example` a `.env` y configurar:

```bash
cp .env.example .env
```

Editar `.env` con tus credenciales:

```env
# Database
DATABASE_URL="postgresql://usuario:password@localhost:5432/beneficios_db?schema=public"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="tu-secreto-muy-seguro-cambiar-en-produccion"

# Email (Resend)
RESEND_API_KEY="re_xxxxxxxxxx"
EMAIL_FROM="noreply@tudominio.com"
```

4. **Crear la base de datos**

**Opción A: Usando Docker (Recomendado)**

```bash
# Levantar PostgreSQL con Docker
docker compose up -d

# Verificar que esté corriendo
docker compose ps
```

La configuración está en `docker-compose.yml` y crea automáticamente la base de datos.

**Opción B: PostgreSQL Local**

```bash
# Crear la base de datos PostgreSQL
createdb beneficios_db

# O usando psql:
psql -U postgres
CREATE DATABASE beneficios_db;
\q
```

5. **Ejecutar migraciones de Prisma**

```bash
npm run db:push
# o
npm run db:migrate
```

6. **Ejecutar seed (datos iniciales)**

```bash
npm run db:seed
```

Esto creará:

- Usuario admin: `admin@demo.com` / `admin123`
- Usuario coordinator: `coord@demo.com` / `coord123`
- 6 categorías de beneficios
- 12 beneficios de ejemplo
- Configuración de telemedicina

7. **Iniciar el servidor de desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🎯 Uso

### Usuarios Predeterminados

- **Admin**: admin@demo.com / admin123
- **Coordinator**: coord@demo.com / coord123

### Navegación Pública

- **Home** (`/`): Página principal con hero y beneficios destacados
- **Beneficios** (`/beneficios`): Catálogo completo con filtros
- **Detalle** (`/beneficios/[slug]`): Vista detallada de cada beneficio
- **Credencial** (`/credencial`): Consulta de credencial por DNI/email
- **Telemedicina** (`/telemedicina`): Información de contacto médico
- **Registro** (`/registro`): Formulario de alta de usuarios
- **Login** (`/login`): Acceso al panel administrativo

### Panel Administrativo (`/admin`)

Accesible solo para usuarios con rol ADMIN o COORDINATOR:

1. **Dashboard**: KPIs y últimas solicitudes pendientes
2. **Beneficios**: Gestión completa (crear, editar, eliminar)
3. **Categorías**: Administración de categorías
4. **Usuarios**: Aprobar/Rechazar solicitudes con comentarios
5. **Telemedicina**: Configurar teléfono y mensaje informativo
6. **Ajustes**: Exportación de datos y configuración general

### Workflow de Registro

1. Usuario completa formulario en `/registro`
2. Sistema crea cuenta con estado PENDIENTE
3. Email de confirmación "Recibimos tu solicitud"
4. Admin/Coordinator revisa en `/admin/usuarios`
5. **Aprobar**: Se crea credencial, email "Solicitud aprobada"
6. **Rechazar**: Se ingresa motivo, email con comentario
7. Usuario consulta estado en `/credencial`

## 📁 Estructura del Proyecto

```
beneficios-app/
├── app/                          # App Router de Next.js
│   ├── api/                      # API Routes
│   │   ├── auth/                 # NextAuth endpoints
│   │   ├── beneficios/           # CRUD beneficios
│   │   ├── categorias/           # CRUD categorías
│   │   ├── registro/             # Registro público
│   │   ├── admin/                # APIs administrativas
│   │   ├── credencial/           # Consulta y PDF
│   │   └── settings/             # Configuración
│   ├── admin/                    # Panel administrativo
│   ├── beneficios/               # Páginas públicas
│   ├── credencial/
│   ├── telemedicina/
│   ├── registro/
│   ├── login/
│   ├── layout.tsx               # Layout raíz
│   ├── page.tsx                 # Home
│   └── globals.css              # Estilos globales
├── components/
│   ├── ui/                      # Componentes de shadcn/ui
│   ├── layout/                  # Navbar, Footer
│   ├── admin/                   # Sidebar admin
│   └── beneficios/              # BenefitCard
├── lib/
│   ├── auth.ts                  # Configuración NextAuth
│   ├── prisma.ts                # Cliente Prisma
│   ├── utils.ts                 # Utilidades generales
│   ├── validations.ts           # Esquemas Zod
│   ├── email/                   # Templates de emails
│   ├── pdf.ts                   # Generación de PDFs
│   └── export.ts                # Exportación CSV/Excel
├── prisma/
│   ├── schema.prisma            # Esquema de base de datos
│   └── seed.ts                  # Datos iniciales
├── .env                         # Variables de entorno
├── .env.example                 # Ejemplo de configuración
├── middleware.ts                # Protección de rutas
├── package.json
└── README.md
```

## 🗄️ Modelos de Datos

### User

- Autenticación y roles (ADMIN, COORDINATOR, USER)
- Relación 1:1 con RegistrationRequest y Credential

### RegistrationRequest

- Datos completos del solicitante
- Estados: PENDIENTE, APROBADO, RECHAZADO
- Comentarios del administrador

### Credential

- Credencial digital del usuario
- Número de socio único
- Payload para QR

### Benefit

- Beneficios con título, descripción, imagen
- Campo destacado
- Relación con Category

### Category

- Categorías para organizar beneficios
- Orden personalizable

### Settings

- Configuración global (singleton)
- Teléfono y mensaje de telemedicina

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev                # Iniciar servidor de desarrollo

# Producción
npm run build             # Compilar para producción
npm start                 # Iniciar servidor de producción

# Base de Datos
npm run db:generate       # Generar cliente Prisma
npm run db:push          # Push schema a DB (desarrollo)
npm run db:migrate       # Crear migración
npm run db:seed          # Ejecutar seed
npm run db:studio        # Abrir Prisma Studio

# Calidad de Código
npm run lint             # Ejecutar ESLint
```

## 🚢 Despliegue en Producción

### 🚀 Deploy en Vercel (Recomendado)

Esta aplicación está optimizada para desplegar en Vercel. Para instrucciones detalladas paso a paso, consultá **[DEPLOY.md](./DEPLOY.md)**.

**Resumen rápido:**

1. **Base de Datos**: Configurar PostgreSQL en [Neon](https://neon.tech), [Vercel Postgres](https://vercel.com/storage/postgres), [Supabase](https://supabase.com) o [Railway](https://railway.app)
2. **Repositorio**: Subir código a GitHub
3. **Vercel**: Importar proyecto desde [vercel.com/new](https://vercel.com/new)
4. **Variables de Entorno**: Configurar en Vercel Settings:
   - `DATABASE_URL`: Connection string de PostgreSQL
   - `NEXTAUTH_URL`: URL de tu app (ej: `https://tu-app.vercel.app`)
   - `NEXTAUTH_SECRET`: Generar con `openssl rand -base64 32`
   - `RESEND_API_KEY`: API key de Resend
   - `EMAIL_FROM`: Email verificado
5. **Deploy**: Hacer click en "Deploy"
6. **Migraciones**: Ejecutar `npm run db:migrate:deploy`
7. **Seed**: Ejecutar `npm run db:seed`

Ver la guía completa en **[DEPLOY.md](./DEPLOY.md)** con screenshots y troubleshooting.

### Otras Plataformas

- **Railway**: Incluye PostgreSQL integrado
- **Render**: Full stack deploy
- **DigitalOcean App Platform**: Deploy con Docker

## 📧 Configuración de Emails

### Opción 1: Resend (Recomendado)

1. Crear cuenta en [resend.com](https://resend.com)
2. Verificar dominio
3. Obtener API key
4. Configurar en `.env`:

```env
RESEND_API_KEY="re_..."
EMAIL_FROM="noreply@tudominio.com"
```

### Opción 2: SMTP

Si preferís usar Gmail u otro proveedor SMTP:

```env
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-password-de-aplicacion"
EMAIL_FROM="tu-email@gmail.com"
```

## 🎨 Personalización

### Cambiar Colores (Tailwind)

Editar `app/globals.css` para personalizar el tema:

```css
:root {
  --primary: 221.2 83.2% 53.3%; /* Color principal */
  --secondary: 210 40% 96.1%; /* Color secundario */
  /* ... más variables */
}
```

### Logo y Branding

- Logo: Actualizar componente en `components/layout/navbar.tsx`
- Nombre: Editar `app/layout.tsx` metadata
- Favicon: Reemplazar archivos en `public/`

## 🔐 Seguridad

- ✅ Contraseñas hasheadas con bcrypt
- ✅ Sesiones JWT con NextAuth
- ✅ Validaciones con Zod
- ✅ Protección de rutas con middleware
- ✅ CORS configurado
- ✅ Variables de entorno para secretos

## 🐛 Troubleshooting

### Error de conexión a PostgreSQL

```bash
# Verificar que PostgreSQL está corriendo
sudo systemctl status postgresql

# Verificar conexión
psql -U usuario -d beneficios_db
```

### Error "Prisma Client not generated"

```bash
npm run db:generate
```

### Emails no se envían

En desarrollo, los emails se loguean en consola si no hay `RESEND_API_KEY` configurado.

## 📝 Licencia

Este proyecto está bajo licencia MIT.

## 👥 Soporte

Para consultas o problemas:

- Email: soporte@beneficios.com
- Issues: GitHub Issues

---

Desarrollado con ❤️ usando Next.js, Prisma y shadcn/ui
