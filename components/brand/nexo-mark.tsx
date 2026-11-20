import Image from 'next/image'
import { cn } from '@/lib/utils'

type NexoMarkProps = {
  className?: string
  /** Tamaño del isotipo en px (cuadrado aproximado). */
  size?: number
  priority?: boolean
}

const MARK_ASPECT = 474 / 424

/** Isotipo nexo — /public/nexo-mark.png */
export function NexoMark({ className, size = 40, priority = false }: NexoMarkProps) {
  const width = Math.round(size * MARK_ASPECT)

  return (
    <span
      className={cn('inline-flex shrink-0 items-center justify-center', className)}
      aria-label="nexo"
    >
      <Image
        src="/nexo-mark.png"
        alt="nexo"
        width={width}
        height={size}
        priority={priority}
        sizes={`${width}px`}
        className="h-auto w-auto object-contain"
        style={{ height: size, width: 'auto' }}
      />
    </span>
  )
}
