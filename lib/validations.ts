import { z } from 'zod'

// Esquema de registro
export const registroSchema = z.object({
  nombreCompleto: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  tipoDocumento: z.enum(['DNI', 'CUIT'], {
    message: 'Debe seleccionar un tipo de documento',
  }),
  documento: z.string().min(7, 'Documento inválido').max(11, 'Documento inválido'),
  telefono: z.string().min(8, 'Teléfono inválido'),
  email: z.string().email('Email inválido'),
  domicilio: z.string().min(5, 'Domicilio inválido'),
  ciudad: z.string().min(2, 'Ciudad inválida'),
  provincia: z.string().min(2, 'Provincia inválida'),
  pais: z.string().min(2, 'País inválido'),
})

export type RegistroFormData = z.infer<typeof registroSchema>

// Esquema de login
export const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
})

export type LoginFormData = z.infer<typeof loginSchema>

// Esquema de beneficio
export const beneficioSchema = z.object({
  titulo: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  imagenUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  icono: z.string().optional(),
  destacado: z.boolean().default(false),
  categoryId: z.string().optional().nullable(),
  howToUse: z.string().optional(),
})

export type BeneficioFormData = z.infer<typeof beneficioSchema>

// Esquema de categoría
export const categoriaSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  orden: z.number().int().min(0).default(0),
})

export type CategoriaFormData = z.infer<typeof categoriaSchema>

// Esquema de consulta de credencial
export const consultaCredencialSchema = z.object({
  documento: z.string().min(7, 'Documento inválido'),
  email: z.string().email('Email inválido'),
})

export type ConsultaCredencialFormData = z.infer<typeof consultaCredencialSchema>

// Esquema de settings de telemedicina
export const telemedicinaSettingsSchema = z.object({
  telefonoPrincipal: z.string().min(8, 'Teléfono inválido'),
  mensajeInformativo: z.string().min(10, 'El mensaje debe tener al menos 10 caracteres'),
})

export type TelemedicinaSettingsFormData = z.infer<typeof telemedicinaSettingsSchema>

// Esquema de rechazo de solicitud
export const rechazoSchema = z.object({
  comentarioAdmin: z.string().min(10, 'El comentario debe tener al menos 10 caracteres'),
})

export type RechazoFormData = z.infer<typeof rechazoSchema>
