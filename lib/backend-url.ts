export function backendUrl(path: string): string {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL?.trim()
  if (!baseUrl) {
    throw new Error(
      'Falta NEXT_PUBLIC_BACKEND_API_URL. Configura la URL del backend en las variables de entorno.'
    )
  }

  const normalizedBase = baseUrl.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`
  return `${normalizedBase}/v1${normalizedPath}`
}
