import Link from 'next/link'
import { Instagram, Mail, Phone } from 'lucide-react'
import { NexoLogo } from '@/components/brand/nexo-logo'

export function Footer() {
  return (
    <footer className="border-t border-[var(--nexo-deep)]/10 bg-[var(--nexo-ink)] text-white">
      <div className="container py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          <div className="space-y-4 md:col-span-1">
            <NexoLogo height={56} className="rounded-lg shadow-sm" />
            <p className="max-w-xs text-sm leading-relaxed text-white/65">
              Salud, telemedicina y beneficios para todo el país. Un solo nexo con tu bienestar.
            </p>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold tracking-wide text-white">Explorar</h3>
            <ul className="space-y-2.5 text-sm text-white/65">
              <li>
                <Link href="/#servicios" className="transition hover:text-[var(--nexo-aqua)]">
                  Servicios
                </Link>
              </li>
              <li>
                <Link href="/beneficios" className="transition hover:text-[var(--nexo-aqua)]">
                  Beneficios
                </Link>
              </li>
              <li>
                <Link href="/telemedicina" className="transition hover:text-[var(--nexo-aqua)]">
                  Telemedicina
                </Link>
              </li>
              <li>
                <Link href="/credencial" className="transition hover:text-[var(--nexo-aqua)]">
                  Mi Credencial
                </Link>
              </li>
              <li>
                <Link href="/registro" className="transition hover:text-[var(--nexo-aqua)]">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold tracking-wide text-white">Contacto</h3>
            <ul className="space-y-3 text-sm text-white/65">
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-[var(--nexo-aqua)]" />
                <span>hola@nexo.ar</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--nexo-aqua)]" />
                <span>+54 11 4379-5506</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-display text-sm font-semibold tracking-wide text-white">Seguinos</h3>
            <a
              href="#"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-[var(--nexo-teal)]"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-center text-sm text-white/45 sm:flex-row sm:text-left">
          <p>© {new Date().getFullYear()} nexo. Todos los derechos reservados.</p>
          <Link href="/login" className="text-xs text-white/35 transition hover:text-white/70">
            Acceso personal
          </Link>
        </div>
      </div>
    </footer>
  )
}
