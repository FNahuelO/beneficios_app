import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t bg-muted/50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Columna 1 - Logo y descripción */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-xl font-bold">B</span>
              </div>
              <span className="font-bold">Beneficios</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Tu plataforma de beneficios y descuentos exclusivos.
            </p>
          </div>

          {/* Columna 2 - Enlaces rápidos */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Enlaces Rápidos</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/beneficios" className="text-muted-foreground hover:text-foreground">
                  Beneficios
                </Link>
              </li>
              <li>
                <Link href="/credencial" className="text-muted-foreground hover:text-foreground">
                  Mi Credencial
                </Link>
              </li>
              <li>
                <Link href="/telemedicina" className="text-muted-foreground hover:text-foreground">
                  Telemedicina
                </Link>
              </li>
              <li>
                <Link href="/registro" className="text-muted-foreground hover:text-foreground">
                  Registrarse
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Contacto</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@beneficios.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>+54 11 4444-5555</span>
              </li>
            </ul>
          </div>

          {/* Columna 4 - Redes sociales */}
          <div>
            <h3 className="mb-4 text-sm font-semibold">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-foreground"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Beneficios. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
