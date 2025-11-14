import { z } from 'zod'

// Esquema de registro
export const registroSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
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
  imagenUrl: z.string().url('URL inválida').optional().or(z.literal('')).nullable(),
  icono: z.string().optional().nullable(),
  destacado: z.boolean().default(false),
  categoryIds: z.array(z.string()).default([]),
  howToUse: z.string().optional().nullable(),
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

// Esquema de especialidad médica
export const medicalSpecialtySchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  imagenUrl: z.string().url('URL inválida').optional().or(z.literal('')),
  orden: z.number().int().min(0).default(0),
})

export type MedicalSpecialtyFormData = z.infer<typeof medicalSpecialtySchema>

// Esquema de pago
export const pagoSchema = z.preprocess(
  (data: any) => {
    if (typeof data === 'object' && data !== null) {
      return {
        ...data,
        monto: data.monto ?? 0,
      }
    }
    return data
  },
  z.object({
    numeroTarjeta: z
      .string()
      .min(1, 'El número de tarjeta es requerido')
      .refine(
        (val) => {
          const cleaned = val.replace(/\s/g, '')
          return cleaned.length >= 16 && cleaned.length <= 19 && /^\d+$/.test(cleaned)
        },
        { message: 'El número de tarjeta debe tener entre 16 y 19 dígitos' }
      ),
    nombreTitular: z.string().min(3, 'El nombre del titular debe tener al menos 3 caracteres'),
    fechaVencimiento: z
      .string()
      .min(1, 'La fecha de vencimiento es requerida')
      .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Formato inválido (MM/AA)'),
    cvv: z
      .string()
      .min(3, 'CVV inválido')
      .max(4, 'CVV inválido')
      .regex(/^\d+$/, 'CVV debe contener solo números'),
    registrationId: z.string().min(1, 'ID de registro requerido'),
    monto: z.number().nonnegative('El monto debe ser mayor o igual a 0'),
  })
)

export type PagoFormData = z.infer<typeof pagoSchema>
