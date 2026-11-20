import Image from 'next/image'
import { cn } from '@/lib/utils'

type NexoLogoProps = {
  className?: string
  /** Altura del isotipo en px. */
  height?: number
  priority?: boolean
  /**
   * - `mark`: solo isotipo
   * - `wordmark`: isotipo + "nexo"
   * - `full`: isotipo + "nexo" + "Salud y Beneficios"
   * - `lockup`: PNG completo oficial (icono + textos en un archivo)
   */
  variant?: 'mark' | 'wordmark' | 'full' | 'lockup'
  /** Texto claro (hero/footer oscuros). */
  light?: boolean
}

/** Marca nexo: isotipo oficial + wordmark. */
export function NexoLogo({
  className,
  height = 40,
  priority = false,
  variant = 'full',
  light = false,
}: NexoLogoProps) {
  if (variant === 'lockup') {
    const width = Math.round(height * (1010 / 504))
    return (
      <span
        className={cn('inline-flex max-w-full items-center', className)}
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

  const markW = Math.round(height * (474 / 424))
  const showWord = variant === 'wordmark' || variant === 'full'
  const showTagline = variant === 'full'
  const textColor = light ? 'text-white' : 'text-[#0B2B6B]'
  const taglineColor = light ? 'text-white/75' : 'text-[#3A5A9A]'

  return (
    <span
      className={cn('inline-flex max-w-full items-center gap-2.5', className)}
      aria-label="nexo Salud y Beneficios"
    >
      <Image
        src="/nexo-isotipo.png"
        alt=""
        width={markW}
        height={height}
        priority={priority}
        sizes={`${markW}px`}
        className="shrink-0 object-contain"
        style={{ height, width: 'auto' }}
        aria-hidden
      />
      {showWord && (
        <span className="flex min-w-0 flex-col leading-none">
          <span
            className={cn(
              'font-display font-bold tracking-tight lowercase',
              textColor
            )}
            style={{ fontSize: Math.round(height * (showTagline ? 0.55 : 0.62)) }}
          >
            nexo
          </span>
          {showTagline && (
            <span
              className={cn('mt-1 font-medium tracking-wide', taglineColor)}
              style={{ fontSize: Math.max(10, Math.round(height * 0.22)) }}
            >
              Salud y Beneficios
            </span>
          )}
        </span>
      )}
    </span>
  )
}
