'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search } from 'lucide-react'

interface BeneficiosFiltersProps {
  categorias: Array<{ id: string; nombre: string; slug: string }>
  initialSearch?: string
  initialCategoria?: string
  initialDestacado?: string
}

export function BeneficiosFilters({
  categorias,
  initialSearch = '',
  initialCategoria = '',
  initialDestacado = '',
}: BeneficiosFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(initialSearch)
  const [categoria, setCategoria] = useState(initialCategoria)
  const [destacado, setDestacado] = useState(initialDestacado)
  const isInitialMount = useRef(true)
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sincronizar con los parámetros de la URL cuando cambien
  useEffect(() => {
    const urlSearch = searchParams.get('search') || ''
    const urlCategoria = searchParams.get('categoria') || ''
    const urlDestacado = searchParams.get('destacado') || ''

    setSearch(urlSearch)
    setCategoria(urlCategoria)
    setDestacado(urlDestacado)
    isInitialMount.current = false
  }, [searchParams])

  const updateFilters = (newSearch?: string, newCategoria?: string, newDestacado?: string) => {
    const params = new URLSearchParams()

    const finalSearch = newSearch !== undefined ? newSearch : search
    const finalCategoria = newCategoria !== undefined ? newCategoria : categoria
    const finalDestacado = newDestacado !== undefined ? newDestacado : destacado

    if (finalSearch) params.set('search', finalSearch)
    if (finalCategoria && finalCategoria !== 'all') params.set('categoria', finalCategoria)
    if (finalDestacado && finalDestacado !== 'all') params.set('destacado', finalDestacado)

    // Resetear a página 1 cuando cambian los filtros
    params.set('page', '1')

    router.push(`/beneficios?${params.toString()}`)
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)

    // Limpiar timeout anterior
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Si no es el montaje inicial, aplicar debounce
    if (!isInitialMount.current) {
      searchTimeoutRef.current = setTimeout(() => {
        const urlSearch = searchParams.get('search') || ''
        if (value !== urlSearch) {
          updateFilters(value, undefined, undefined)
        }
      }, 500)
    }
  }

  const handleCategoriaChange = (value: string) => {
    setCategoria(value)
    updateFilters(undefined, value, undefined)
  }

  const handleDestacadoChange = (value: string) => {
    setDestacado(value)
    updateFilters(undefined, undefined, value)
  }

  return (
    <div className="mb-8 grid gap-4 md:grid-cols-3">
      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar beneficios..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
        />
      </div>

      <Select value={categoria || 'all'} onValueChange={handleCategoriaChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todas las categorías" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas las categorías</SelectItem>
          {categorias.map((cat) => (
            <SelectItem key={cat.id} value={cat.slug}>
              {cat.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={destacado || 'all'} onValueChange={handleDestacadoChange}>
        <SelectTrigger>
          <SelectValue placeholder="Todos los beneficios" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="true">Solo destacados</SelectItem>
          <SelectItem value="false">No destacados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
