import { defineConfig } from 'prisma/config'
import { config } from 'dotenv'

// Cargar variables de entorno del archivo .env
config()

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  engine: 'classic',
  datasource: {
    url: process.env.DATABASE_URL as string,
  },
})
