'use client'

import Image from 'next/image'
import { Download, Share, X, MoreVertical, MonitorSmartphone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInstallSteps, type PwaPlatform } from '@/lib/pwa'

type PwaInstallBannerProps = {
  platform: PwaPlatform
  canInstallNative: boolean
  onInstall: () => void
  onDismiss: () => void
}

export function PwaInstallBanner({
  platform,
  canInstallNative,
  onInstall,
  onDismiss,
}: PwaInstallBannerProps) {
  const guide = getInstallSteps(platform)
  const showNativeButton = canInstallNative && platform.canUseNativePrompt

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] p-3 sm:p-4"
      role="dialog"
      aria-labelledby="pwa-install-title"
      aria-describedby="pwa-install-steps"
    >
      <div className="mx-auto flex w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-white/10 bg-[var(--nexo-ink)] text-white shadow-2xl shadow-black/40 sm:max-w-xl">
        <div className="flex items-start gap-3 px-4 pb-2 pt-4 sm:px-5 sm:pt-5">
          <div className="relative mt-0.5 h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-[var(--nexo-deep)] ring-1 ring-white/10">
            <Image
              src="/icons/icon-192.png"
              alt=""
              width={48}
              height={48}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--nexo-aqua)]">
              Instalar app
            </p>
            <h2 id="pwa-install-title" className="font-display mt-1 text-lg font-semibold leading-snug">
              {guide.title}
            </h2>
            <p className="mt-1 text-sm text-white/65">
              Accedé más rápido a telemedicina, credencial y beneficios, incluso sin abrir el
              navegador.
            </p>
          </div>

          <button
            type="button"
            onClick={onDismiss}
            className="rounded-lg p-1.5 text-white/50 transition hover:bg-white/10 hover:text-white"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <ol
          id="pwa-install-steps"
          className="space-y-2.5 border-t border-white/10 px-4 py-4 text-sm text-white/85 sm:px-5"
        >
          {guide.steps.map((step, index) => (
            <li key={step} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--nexo-teal)]/25 text-xs font-bold text-[var(--nexo-aqua)]">
                {index + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>

        <div className="flex flex-col gap-2 border-t border-white/10 bg-black/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <OsHint platform={platform} />
          <div className="flex gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              onClick={onDismiss}
              className="rounded-xl text-white/70 hover:bg-white/10 hover:text-white"
            >
              Ahora no
            </Button>
            {showNativeButton ? (
              <Button
                type="button"
                onClick={onInstall}
                className="rounded-xl bg-[var(--nexo-aqua)] font-semibold text-[var(--nexo-ink)] hover:bg-white"
              >
                <Download className="mr-2 h-4 w-4" />
                Instalar
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}

function OsHint({ platform }: { platform: PwaPlatform }) {
  if (platform.os === 'ios') {
    return (
      <p className="flex items-center gap-1.5 text-xs text-white/45">
        <Share className="h-3.5 w-3.5" />
        Detectamos iOS · usá Safari
      </p>
    )
  }
  if (platform.os === 'android') {
    return (
      <p className="flex items-center gap-1.5 text-xs text-white/45">
        <MoreVertical className="h-3.5 w-3.5" />
        Detectamos Android
      </p>
    )
  }
  return (
    <p className="flex items-center gap-1.5 text-xs text-white/45">
      <MonitorSmartphone className="h-3.5 w-3.5" />
      Detectamos escritorio
    </p>
  )
}
