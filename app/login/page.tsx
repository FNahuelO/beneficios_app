'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from '@/components/ui/use-toast'
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { NexoLogo } from '@/components/brand/nexo-logo'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
      })

      if (result?.error) {
        toast({
          title: 'Error',
          description: 'Email o contraseña incorrectos',
          variant: 'destructive',
        })
        return
      }

      toast({
        title: 'Inicio de sesión exitoso',
        description: 'Redirigiendo...',
      })

      router.push('/admin')
      router.refresh()
    } catch {
      toast({
        title: 'Error',
        description: 'Ocurrió un error al iniciar sesión',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[var(--nexo-ink)] px-4 py-12">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-white/75 transition hover:bg-white/10 hover:text-white sm:left-6 sm:top-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver al inicio
      </Link>

      <div className="flex h-auto w-full max-w-4xl overflow-hidden rounded-2xl bg-[var(--nexo-ink)] shadow-2xl md:h-[65vh]">
        <div className="relative hidden w-1/2 lg:block">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: 'url(/login.png)' }}
          />
          <div className="absolute inset-0 bg-[var(--nexo-ink)]/50" />
          <div className="absolute bottom-10 left-10">
            <NexoLogo height={64} onDark />
            <p className="mt-3 max-w-xs text-sm text-white/70">Panel de administración</p>
          </div>
        </div>

        <div className="flex w-full flex-col items-center justify-center gap-4 bg-white p-8 lg:w-1/2 lg:p-12">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="mb-6 inline-flex lg:hidden">
              <NexoLogo height={44} />
            </Link>
            <h1 className="font-display mb-2 text-3xl font-bold text-[var(--nexo-ink)]">
              Iniciar sesión
            </h1>
            <p className="mb-8 text-sm text-[var(--nexo-deep)]/70">
              Ingresá tus credenciales para acceder al panel administrativo
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-[var(--nexo-ink)]">
                  Email
                </Label>
                <Input id="email" type="email" className="w-full" {...register('email')} />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-[var(--nexo-ink)]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="w-full"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl bg-[var(--nexo-deep)] text-white hover:bg-[var(--nexo-ink)]"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
