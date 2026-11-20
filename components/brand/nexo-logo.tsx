import Image from 'next/image'
import { cn } from '@/lib/utils'

type NexoLogoProps = {
  className?: string
  /** Altura visual del logo en px. */
  height?: number
  priority?: boolean
  /**
   * Fondo claro detrás del logo. Útil sobre fondos oscuros:
   * el wordmark es azul oscuro y necesita contraste.
   */
  onDark?: boolean
}

const LOGO_ASPECT = 1024 / 305

/** Logo completo nexo (isotipo + wordmark) — /public/nexo-logo.png */
export function NexoLogo({
  className,
  height = 44,
  priority = false,
  onDark = false,
}: NexoLogoProps) {
  const width = Math.round(height * LOGO_ASPECT)

  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center',
        onDark && 'rounded-xl bg-white px-2.5 py-1.5 shadow-sm',
        className
      )}
      aria-label="nexo Salud y Beneficios"
    >
      <Image
        src="/nexo-logo.png"
        alt="nexo Salud y Beneficios"
        width={width}
        height={height}
        priority={priority}
        sizes={`${width}px`}
        className="h-auto max-h-full w-auto max-w-full object-contain"
        style={{ height, width: 'auto', maxWidth: '100%' }}
      />
    </span>
  )
}
