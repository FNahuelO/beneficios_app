import crypto from 'crypto'

const SECRET = process.env.NEXTAUTH_SECRET || 'default-secret-change-in-production'
const QR_TOKEN_EXPIRATION_MS = 5 * 60 * 1000 // 5 minutos en milisegundos

interface QRTokenPayload {
  credentialId: string
  timestamp: number
}

/**
 * Genera un token QR temporal con expiración de 5 minutos
 */
export function generateQRToken(credentialId: string): string {
  const timestamp = Date.now()
  const payload: QRTokenPayload = {
    credentialId,
    timestamp,
  }

  // Codificar payload en base64
  const payloadBase64 = Buffer.from(JSON.stringify(payload)).toString('base64url')

  // Crear firma HMAC
  const hmac = crypto.createHmac('sha256', SECRET)
  hmac.update(payloadBase64)
  const signature = hmac.digest('base64url')

  // Combinar payload y firma
  return `${payloadBase64}.${signature}`
}

/**
 * Valida y decodifica un token QR temporal
 * Retorna null si el token es inválido o expirado
 */
export function validateQRToken(
  token: string
): { credentialId: string; isValid: boolean; expired: boolean } | null {
  try {
    const [payloadBase64, signature] = token.split('.')

    if (!payloadBase64 || !signature) {
      return null
    }

    // Verificar firma
    const hmac = crypto.createHmac('sha256', SECRET)
    hmac.update(payloadBase64)
    const expectedSignature = hmac.digest('base64url')

    if (signature !== expectedSignature) {
      return null // Firma inválida
    }

    // Decodificar payload
    const payloadJson = Buffer.from(payloadBase64, 'base64url').toString('utf-8')
    const payload: QRTokenPayload = JSON.parse(payloadJson)

    // Verificar expiración (5 minutos)
    const now = Date.now()
    const elapsed = now - payload.timestamp
    const expired = elapsed > QR_TOKEN_EXPIRATION_MS

    return {
      credentialId: payload.credentialId,
      isValid: !expired,
      expired,
    }
  } catch (error) {
    console.error('Error validando token QR:', error)
    return null
  }
}

/**
 * Genera la URL completa para validar el token QR
 */
export function generateQRTokenURL(token: string, baseUrl?: string): string {
  const base = baseUrl || process.env.NEXTAUTH_URL || 'http://localhost:3000'
  return `${base}/api/credencial/qr/validar/${token}`
}
