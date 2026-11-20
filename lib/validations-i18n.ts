import { z } from 'zod'

type Translations = {
  validation: {
    required: string
    email: string
    minLength: (min: number) => string
    maxLength: (max: number) => string
    invalidDocument: string
    invalidPhone: string
    invalidAddress: string
    invalidCity: string
    invalidProvince: string
    invalidCountry: string
    invalidCardNumber: string
    invalidExpiryDate: string
    invalidCvv: string
    passwordMinLength: string
    nameMinLength: string
    surnameMinLength: string
    titleMinLength: string
    descriptionMinLength: string
    categoryNameMinLength: string
    selectDocumentType: string
    cardNumberRequired: string
    cardHolderMinLength: string
    expiryDateRequired: string
    registrationIdRequired: string
    invalidUrl: string
    commentMinLength: string
    messageMinLength: string
  }
}

export function createRegistroSchema(t: Translations['validation']) {
  return z.object({
    nombre: z.string().min(2, t.nameMinLength),
    apellido: z.string().min(2, t.surnameMinLength),
    tipoDocumento: z.enum(['DNI', 'CUIT'], {
      message: t.selectDocumentType,
    }),
    documento: z.string().min(7, t.invalidDocument).max(11, t.invalidDocument),
    telefono: z.string().min(8, t.invalidPhone),
    email: z.string().email(t.email),
    domicilio: z.string().min(5, t.invalidAddress),
    ciudad: z.string().min(2, t.invalidCity),
    provincia: z.string().min(2, t.invalidProvince),
    pais: z.string().min(2, t.invalidCountry),
  })
}

export function createLoginSchema(t: Translations['validation']) {
  return z.object({
    email: z.string().email(t.email),
    password: z.string().min(6, t.passwordMinLength),
  })
}

export function createBeneficioSchema(t: Translations['validation']) {
  return z.object({
    titulo: z.string().min(3, t.titleMinLength),
    descripcion: z.string().min(10, t.descriptionMinLength),
    imagenUrl: z.string().url(t.invalidUrl).optional().or(z.literal('')).nullable(),
    icono: z.string().optional().nullable(),
    destacado: z.boolean().default(false),
    categoryIds: z.array(z.string()).default([]),
    howToUse: z.string().optional().nullable(),
  })
}

export function createCategoriaSchema(t: Translations['validation']) {
  return z.object({
    nombre: z.string().min(2, t.categoryNameMinLength),
    orden: z.number().int().min(0).default(0),
  })
}

export function createConsultaCredencialSchema(t: Translations['validation']) {
  return z.object({
    documento: z.string().min(7, t.invalidDocument),
    email: z.string().email(t.email),
  })
}

export function createTelemedicinaSettingsSchema(t: Translations['validation']) {
  return z.object({
    telefonoPrincipal: z.string().min(8, t.invalidPhone),
    mensajeInformativo: z.string().min(10, t.messageMinLength),
  })
}

export function createRechazoSchema(t: Translations['validation']) {
  return z.object({
    comentarioAdmin: z.string().min(10, t.commentMinLength),
  })
}

export function createMedicalSpecialtySchema(t: Translations['validation']) {
  return z.object({
    nombre: z.string().min(2, t.categoryNameMinLength),
    imagenUrl: z.string().url(t.invalidUrl).optional().or(z.literal('')),
    orden: z.number().int().min(0).default(0),
  })
}

export function createPagoSchema(t: Translations['validation']) {
  return z.preprocess(
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
        .min(1, t.cardNumberRequired)
        .refine(
          (val) => {
            const cleaned = val.replace(/\s/g, '')
            return cleaned.length >= 16 && cleaned.length <= 19 && /^\d+$/.test(cleaned)
          },
          { message: t.invalidCardNumber }
        ),
      nombreTitular: z.string().min(3, t.cardHolderMinLength),
      fechaVencimiento: z
        .string()
        .min(1, t.expiryDateRequired)
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, t.invalidExpiryDate),
      cvv: z.string().min(3, t.invalidCvv).max(4, t.invalidCvv).regex(/^\d+$/, t.invalidCvv),
      registrationId: z.string().min(1, t.registrationIdRequired),
      monto: z.number().nonnegative(t.required),
    })
  )
}
