'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X, User } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/beneficios', label: 'Beneficios' },
    { href: '/credencial', label: 'Mi Credencial' },
    { href: '/telemedicina', label: 'Telemedicina' },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-8 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <span className="text-xl font-bold">B</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Beneficios</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden flex-1 items-center justify-between md:flex">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition-colors hover:text-foreground/80',
                  pathname === link.href ? 'text-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link href="/registro">Registrarse</Link>
            </Button>
            <Button asChild>
              <Link href="/login">
                <User className="mr-2 h-4 w-4" />
                Ingresar
              </Link>
            </Button>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button className="ml-auto md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="border-t md:hidden">
          <nav className="container grid gap-2 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground rounded-md',
                  pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-foreground/60'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-4 space-y-2 px-4">
              <Button variant="outline" className="w-full" asChild>
                <Link href="/registro">Registrarse</Link>
              </Button>
              <Button className="w-full" asChild>
                <Link href="/login">Ingresar</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </nav>
  )
}
