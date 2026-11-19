import { cn } from '@/lib/utils'

type NexoLogoProps = {
  className?: string
  markClassName?: string
  wordmarkClassName?: string
  showWordmark?: boolean
  variant?: 'ink' | 'light'
}

export function NexoLogo({
  className,
  markClassName,
  wordmarkClassName,
  showWordmark = true,
  variant = 'ink',
}: NexoLogoProps) {
  const wordColor = variant === 'light' ? 'text-white' : 'text-[var(--nexo-ink)]'
  const gradId = `nexoGrad-${variant}`

  return (
    <span className={cn('inline-flex items-center gap-2.5', className)} aria-label="nexo">
      <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-9 w-9 shrink-0', markClassName)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`${gradId}-a`} x1="6" y1="40" x2="30" y2="10" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0B4F5C" />
            <stop offset="1" stopColor="#2EC4B6" />
          </linearGradient>
          <linearGradient id={`${gradId}-b`} x1="18" y1="42" x2="42" y2="8" gradientUnits="userSpaceOnUse">
            <stop stopColor="#14919B" />
            <stop offset="1" stopColor="#5EEAD4" />
          </linearGradient>
        </defs>
        {/* Interlocking ribbons — nuevo isotipo nexo */}
        <path
          d="M10 38c0-11.5 6.5-19.5 15.5-19.5 2.6 0 5 .7 7 2"
          stroke={`url(#${gradId}-a)`}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M38 10c0 11.5-6.5 19.5-15.5 19.5-2.6 0-5-.7-7-2"
          stroke={`url(#${gradId}-b)`}
          strokeWidth="8"
          strokeLinecap="round"
        />
        <circle cx="24" cy="24" r="3" fill="#2EC4B6" />
      </svg>
      {showWordmark && (
        <span
          className={cn(
            'font-display text-2xl font-bold tracking-tight lowercase leading-none',
            wordColor,
            wordmarkClassName
          )}
        >
          nexo
        </span>
      )}
    </span>
  )
}
