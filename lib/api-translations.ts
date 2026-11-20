import { getLocale } from 'next-intl/server'
import esMessages from '@/messages/es.json'
import enMessages from '@/messages/en.json'
import ptMessages from '@/messages/pt.json'

export async function getApiTranslation(key: string) {
  try {
    const locale = await getLocale()
    let messages: any

    switch (locale) {
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

    const keys = key.split('.')
    let value: any = messages
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }

    return typeof value === 'string' ? value : key
  } catch (error) {
    console.error('Error getting translation:', error)
    // Fallback to Spanish
    const keys = key.split('.')
    let value: any = esMessages
    for (const k of keys) {
      value = value?.[k]
      if (value === undefined) break
    }
    return typeof value === 'string' ? value : key
  }
}

export async function getApiTranslations() {
  try {
    const locale = await getLocale()

    switch (locale) {
      case 'es':
        return esMessages
      case 'en':
        return enMessages
      case 'pt':
        return ptMessages
      default:
        return esMessages
    }
  } catch (error) {
    console.error('Error getting translations:', error)
    return esMessages
  }
}
