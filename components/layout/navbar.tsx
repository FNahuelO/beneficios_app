'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { NexoLogo } from '@/components/brand/nexo-logo'

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/#servicios', label: 'Servicios' },
    { href: '/beneficios', label: 'Beneficios' },
    { href: '/telemedicina', label: 'Telemedicina' },
    { href: '/credencial', label: 'Mi Credencial' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-[var(--nexo-deep)]/10 bg-[var(--nexo-mist)]/90 backdrop-blur-md">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/" className="flex items-center" aria-label="nexo inicio">
            <NexoLogo height={40} priority />
          </Link>
        </div>

        <div className="hidden flex-1 items-center justify-between md:flex">
          <nav className="flex items-center gap-7 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-[var(--nexo-deep)]',
                  pathname === link.href ||
                    (link.href !== '/' && pathname.startsWith(link.href.split('#')[0]) && link.href !== '/#servicios')
                    ? 'text-[var(--nexo-ink)]'
                    : 'text-[var(--nexo-ink)]/55'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Button
            asChild
            className="rounded-xl border-none bg-[var(--nexo-deep)] text-white hover:bg-[var(--nexo-ink)]"
          >
            <Link href="/registro">Sumate a nexo</Link>
          </Button>
        </div>

        <button
          className="ml-auto text-[var(--nexo-ink)] md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-[var(--nexo-deep)]/10 md:hidden">
          <nav className="container grid gap-1 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="rounded-lg px-4 py-2.5 text-sm font-medium text-[var(--nexo-ink)]/80 transition-colors hover:bg-[var(--nexo-mint)]"
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 px-4">
              <Button
                asChild
                className="w-full rounded-xl bg-[var(--nexo-deep)] text-white hover:bg-[var(--nexo-ink)]"
              >
                <Link href="/registro">Sumate a nexo</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </nav>
  )
}
