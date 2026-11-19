import Image from 'next/image'
import { cn } from '@/lib/utils'

type NexoLogoProps = {
  className?: string
  /** Altura visual del logo en px. */
  height?: number
  priority?: boolean
}

/** Logo oficial exacto de nexo (archivo /public/nexo-logo.png). */
export function NexoLogo({ className, height = 44, priority = false }: NexoLogoProps) {
  // Asset original 1010×504
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
