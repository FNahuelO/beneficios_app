import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'
import esMessages from '@/messages/es.json'
import enMessages from '@/messages/en.json'
import ptMessages from '@/messages/pt.json'

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale
  }

  // Ensure locale is always a string
  const validLocale: string = locale || routing.defaultLocale

  // Get messages based on locale using static imports
  let messages
  switch (validLocale) {
    case 'es':
      messages = esMessages
      break
    case 'en':
      messages = enMessages
      break
    case 'pt':
      messages = ptMessages
      break
    default:
      messages = esMessages
  }

  return {
    locale: validLocale,
    messages,
  }
})
