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
    } catch (err: any) {
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
    <div className="flex min-h-screen items-center justify-center bg-[#1e3a8a] py-12 px-4">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-2xl h-[65vh]">
        {/* Sección izquierda con imagen de fondo */}
        <div
          className="relative hidden w-[50%] bg-cover bg-center bg-no-repeat lg:block"
          style={{ backgroundImage: 'url(/login.png)' }}
        ></div>

        {/* Sección derecha con el formulario */}
        <div className="w-full bg-white p-8 lg:w-[50%] lg:p-12 flex flex-col gap-4 justify-center items-center">
          <div className="mx-auto max-w-md">
            <h1 className="mb-2 text-3xl font-bold text-black">Iniciar Sesión</h1>
            <p className="mb-8 text-sm text-gray-600">
              Ingresá tus credenciales para acceder al panel administrativo
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <div className="">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  className="w-full border-gray-300"
                  {...register('email')}
                />
                {errors.email && <p className="text-sm text-red-600">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  className="w-full border-gray-300"
                  {...register('password')}
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full rounded-md bg-[#1e3a8a] text-white hover:bg-[#1e40af]"
                disabled={loading}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
