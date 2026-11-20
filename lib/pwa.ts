export type PwaOs = 'ios' | 'android' | 'desktop'
export type PwaBrowser = 'safari' | 'chrome' | 'firefox' | 'edge' | 'samsung' | 'other'

export type PwaPlatform = {
  os: PwaOs
  browser: PwaBrowser
  isStandalone: boolean
  canUseNativePrompt: boolean
}

export function detectPwaPlatform(userAgent = '', standalone = false): PwaPlatform {
  const ua = userAgent.toLowerCase()

  const isIos =
    /iphone|ipad|ipod/.test(ua) ||
    (ua.includes('macintosh') && typeof navigator !== 'undefined' && navigator.maxTouchPoints > 1)
  const isAndroid = ua.includes('android')

  let browser: PwaBrowser = 'other'
  if (ua.includes('edg/')) browser = 'edge'
  else if (ua.includes('samsungbrowser')) browser = 'samsung'
  else if (ua.includes('firefox') || ua.includes('fxios')) browser = 'firefox'
  else if (ua.includes('crios') || (ua.includes('chrome') && !ua.includes('edg/'))) browser = 'chrome'
  else if (ua.includes('safari') && !ua.includes('chrome') && !ua.includes('crios')) browser = 'safari'

  const os: PwaOs = isIos ? 'ios' : isAndroid ? 'android' : 'desktop'

  return {
    os,
    browser,
    isStandalone: standalone,
    canUseNativePrompt: !isIos && (browser === 'chrome' || browser === 'edge' || browser === 'samsung'),
  }
}

export function getInstallSteps(platform: PwaPlatform): { title: string; steps: string[] } {
  if (platform.os === 'ios') {
    return {
      title: 'Instalá nexo en tu iPhone o iPad',
      steps: [
        'Abrí nexo en Safari (no en Chrome ni Instagram).',
        'Tocá el botón Compartir (el cuadrado con la flecha hacia arriba).',
        'Desplazate y elegí “Agregar a pantalla de inicio”.',
        'Confirmá con “Agregar”. La app queda en tu pantalla como un ícono.',
      ],
    }
  }

  if (platform.os === 'android') {
    if (platform.browser === 'chrome' || platform.browser === 'edge' || platform.browser === 'samsung') {
      return {
        title: 'Instalá nexo en tu Android',
        steps: [
          'Tocá el menú ⋮ arriba a la derecha del navegador.',
          'Elegí “Instalar app” o “Agregar a la pantalla de inicio”.',
          'Confirmá la instalación.',
          'Vas a ver el ícono de nexo junto al resto de tus apps.',
        ],
      }
    }
    return {
      title: 'Instalá nexo en tu Android',
      steps: [
        'Abrí nexo en Chrome.',
        'Tocá el menú ⋮ y elegí “Instalar app” o “Agregar a la pantalla de inicio”.',
        'Confirmá la instalación para usar nexo como una app.',
      ],
    }
  }

  // desktop
  if (platform.browser === 'chrome' || platform.browser === 'edge') {
    return {
      title: 'Instalá nexo en tu computadora',
      steps: [
        'En la barra de direcciones, tocá el ícono de instalar (⊕ o monitor con flecha).',
        'También podés abrir el menú ⋮ → “Instalar nexo…” / “Aplicaciones” → “Instalar esta página como app”.',
        'Confirmá. Se abre en su propia ventana, como una app de escritorio.',
      ],
    }
  }

  if (platform.browser === 'safari') {
    return {
      title: 'Instalá nexo en tu Mac',
      steps: [
        'Abrí nexo en Safari.',
        'Menú Archivo → “Añadir al Dock” (o Compartir → “Añadir al Dock”).',
        'nexo queda disponible desde el Dock como una app.',
      ],
    }
  }

  return {
    title: 'Instalá nexo como app',
    steps: [
      'Usá Chrome o Edge para una instalación más simple.',
      'Buscá la opción “Instalar app” o “Agregar a la pantalla de inicio” en el menú del navegador.',
      'Confirmá para abrir nexo como una aplicación.',
    ],
  }
}

export const PWA_DISMISS_KEY = 'nexo-pwa-install-dismissed'
