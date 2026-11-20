'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { PwaInstallBanner } from '@/components/pwa/pwa-install-banner'
import {
  detectPwaPlatform,
  PWA_DISMISS_KEY,
  type PwaPlatform,
} from '@/lib/pwa'

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isStandaloneDisplay() {
  if (typeof window === 'undefined') return false
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.matchMedia('(display-mode: fullscreen)').matches ||
    // iOS Safari
    ('standalone' in window.navigator &&
      Boolean((window.navigator as Navigator & { standalone?: boolean }).standalone))
  )
}

function shouldHideOnPath(pathname: string | null) {
  if (!pathname) return false
  return pathname.startsWith('/admin') || pathname === '/login' || pathname.endsWith('/login')
}

export function PwaProvider() {
  const pathname = usePathname()
  const [platform, setPlatform] = useState<PwaPlatform | null>(null)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return
    navigator.serviceWorker.register('/sw.js').catch(() => {
      // Silencioso en local HTTP / entornos sin SW
    })
  }, [])

  useEffect(() => {
    const standalone = isStandaloneDisplay()
    const detected = detectPwaPlatform(navigator.userAgent, standalone)
    setPlatform(detected)

    if (standalone || shouldHideOnPath(pathname)) {
      setVisible(false)
      return
    }

    try {
      if (localStorage.getItem(PWA_DISMISS_KEY) === '1') {
        setVisible(false)
        return
      }
    } catch {
      // localStorage puede fallar en modo privado
    }

    // Pequeño delay para no tapar el primer paint
    const timer = window.setTimeout(() => setVisible(true), 1800)
    return () => window.clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
      setVisible(true)
    }

    const onInstalled = () => {
      setDeferredPrompt(null)
      setVisible(false)
    }

    const onShowInstall = () => {
      if (isStandaloneDisplay() || shouldHideOnPath(pathname)) return
      try {
        localStorage.removeItem(PWA_DISMISS_KEY)
      } catch {
        // ignore
      }
      setVisible(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    window.addEventListener('nexo:show-pwa-install', onShowInstall)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
      window.removeEventListener('nexo:show-pwa-install', onShowInstall)
    }
  }, [pathname])

  const dismiss = () => {
    setVisible(false)
    try {
      localStorage.setItem(PWA_DISMISS_KEY, '1')
    } catch {
      // ignore
    }
  }

  const installNative = async () => {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    const choice = await deferredPrompt.userChoice
    setDeferredPrompt(null)
    if (choice.outcome === 'accepted') {
      setVisible(false)
    }
  }

  if (!visible || !platform || platform.isStandalone || shouldHideOnPath(pathname)) {
    return null
  }

  return (
    <PwaInstallBanner
      platform={platform}
      canInstallNative={Boolean(deferredPrompt)}
      onInstall={installNative}
      onDismiss={dismiss}
    />
  )
}
