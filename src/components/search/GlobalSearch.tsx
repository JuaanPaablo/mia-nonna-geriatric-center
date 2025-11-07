'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Users, FileText, MessageSquare, Settings, ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface SearchResult {
  id: string
  type: 'patient' | 'enrollment' | 'contact' | 'service'
  title: string
  subtitle: string
  description: string
  url: string
  icon: React.ReactNode
  relevance: number
}

export default function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  // Cerrar búsqueda al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    // Atajo de teclado Ctrl+K
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault()
        if (isOpen) {
          setIsOpen(false)
        } else {
          openSearch()
        }
      }
      
      // Cerrar con Escape
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen])

  // Cargar búsquedas recientes del localStorage
  useEffect(() => {
    const saved = localStorage.getItem('recentSearches')
    if (saved) {
      setRecentSearches(JSON.parse(saved))
    }
  }, [])

  // Guardar búsquedas recientes
  const saveSearch = (searchTerm: string) => {
    const updated = [searchTerm, ...recentSearches.filter(s => s !== searchTerm)].slice(0, 5)
    setRecentSearches(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  // Realizar búsqueda
  const performSearch = async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([])
      return
    }

    setLoading(true)
    try {
      const searchResults: SearchResult[] = []

      // Buscar en pacientes
      const patientsResult = await supabase?.from('patients')
        .select('id, full_name, age, room_number, status, cedula')
        .or(`full_name.ilike.%${searchTerm}%,cedula.ilike.%${searchTerm}%,room_number.ilike.%${searchTerm}%`)
        .limit(5)

      if (patientsResult?.data) {
        patientsResult.data.forEach(patient => {
          searchResults.push({
            id: patient.id,
            type: 'patient',
            title: patient.full_name,
            subtitle: `Habitación ${patient.room_number}`,
            description: `${patient.age} años • ${patient.status}`,
            url: `/admin/patients`,
            icon: <Users className="w-4 h-4" />,
            relevance: calculateRelevance(searchTerm, patient.full_name, patient.cedula || '')
          })
        })
      }

      // Buscar en matrículas
      const enrollmentsResult = await supabase?.from('enrollments')
        .select('id, status, monthly_fee, enrollment_date')
        .or(`status.ilike.%${searchTerm}%`)
        .limit(5)

      if (enrollmentsResult?.data) {
        enrollmentsResult.data.forEach(enrollment => {
          searchResults.push({
            id: enrollment.id,
            type: 'enrollment',
            title: `Matrícula ${enrollment.id.slice(0, 8)}`,
            subtitle: `Estado: ${enrollment.status}`,
            description: `$${enrollment.monthly_fee} • ${new Date(enrollment.enrollment_date).toLocaleDateString()}`,
            url: `/admin/enrollments`,
            icon: <FileText className="w-4 h-4" />,
            relevance: calculateRelevance(searchTerm, enrollment.status)
          })
        })
      }

      // Buscar en contactos
      const contactsResult = await supabase?.from('contact_forms')
        .select('id, family_name, phone, email, status')
        .or(`family_name.ilike.%${searchTerm}%,phone.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`)
        .limit(5)

      if (contactsResult?.data) {
        contactsResult.data.forEach(contact => {
          searchResults.push({
            id: contact.id,
            type: 'contact',
            title: contact.family_name,
            subtitle: contact.phone,
            description: `${contact.email} • ${contact.status}`,
            url: `/admin/contacts`,
            icon: <MessageSquare className="w-4 h-4" />,
            relevance: calculateRelevance(searchTerm, contact.family_name, contact.phone, contact.email)
          })
        })
      }

      // Buscar en servicios
      const servicesResult = await supabase?.from('services')
        .select('id, name, category, price')
        .or(`name.ilike.%${searchTerm}%,category.ilike.%${searchTerm}%`)
        .limit(5)

      if (servicesResult?.data) {
        servicesResult.data.forEach(service => {
          searchResults.push({
            id: service.id,
            type: 'service',
            title: service.name,
            subtitle: service.category,
            description: `$${service.price}`,
            url: `/admin/services`,
            icon: <Settings className="w-4 h-4" />,
            relevance: calculateRelevance(searchTerm, service.name, service.category)
          })
        })
      }

      // Ordenar por relevancia
      searchResults.sort((a, b) => b.relevance - a.relevance)
      setResults(searchResults.slice(0, 10))

    } catch (error) {
      console.error('Error performing search:', error)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  // Calcular relevancia de búsqueda
  const calculateRelevance = (searchTerm: string, ...fields: string[]): number => {
    const term = searchTerm.toLowerCase()
    let relevance = 0

    fields.forEach(field => {
      if (!field) return
      const fieldLower = field.toLowerCase()
      
      if (fieldLower === term) relevance += 100
      else if (fieldLower.startsWith(term)) relevance += 80
      else if (fieldLower.includes(term)) relevance += 60
      else if (fieldLower.includes(term.split(' ')[0])) relevance += 40
    })

    return relevance
  }

  // Manejar búsqueda
  const handleSearch = (searchTerm: string) => {
    if (searchTerm.trim()) {
      saveSearch(searchTerm)
      performSearch(searchTerm)
    }
  }

  // Manejar cambio de input
  const handleInputChange = (value: string) => {
    setQuery(value)
    if (value.trim()) {
      handleSearch(value)
    } else {
      setResults([])
    }
  }

  // Navegar a resultado
  const navigateToResult = (result: SearchResult) => {
    router.push(result.url)
    setIsOpen(false)
    setQuery('')
    setResults([])
  }

  // Abrir búsqueda
  const openSearch = () => {
    setIsOpen(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  return (
    <div className="relative" ref={searchRef}>
      {/* Botón de búsqueda */}
      <button
        onClick={openSearch}
        className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Search className="w-5 h-5 mr-2" />
        <span className="hidden md:inline">Buscar...</span>
        <span className="md:hidden">Buscar</span>
        <kbd className="hidden lg:inline ml-2 px-2 py-1 text-xs bg-gray-100 rounded">Ctrl+K</kbd>
      </button>

      {/* Modal de búsqueda */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 max-h-96 overflow-hidden">
            {/* Header */}
            <div className="flex items-center p-4 border-b border-gray-200">
              <Search className="w-5 h-5 text-gray-400 mr-3" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="Buscar pacientes, matrículas, contactos, servicios..."
                className="flex-1 text-lg outline-none placeholder-gray-400"
                autoFocus
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Contenido */}
            <div className="max-h-80 overflow-y-auto">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Buscando...</p>
                </div>
              ) : results.length > 0 ? (
                <div className="p-2">
                  {results.map((result, index) => (
                    <button
                      key={`${result.type}-${result.id}`}
                      onClick={() => navigateToResult(result)}
                      className="w-full flex items-center p-3 hover:bg-gray-50 rounded-lg transition-colors text-left"
                    >
                      <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-lg mr-3">
                        {result.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium text-gray-900 truncate">{result.title}</h4>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                        <p className="text-sm text-gray-600 truncate">{result.subtitle}</p>
                        <p className="text-xs text-gray-500 truncate">{result.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              ) : query.trim() ? (
                <div className="p-8 text-center">
                  <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No se encontraron resultados para "{query}"</p>
                  <p className="text-sm text-gray-400 mt-2">Intenta con otros términos</p>
                </div>
              ) : (
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Búsquedas Recientes</h3>
                  {recentSearches.length > 0 ? (
                    <div className="space-y-2">
                      {recentSearches.map((search, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setQuery(search)
                            handleSearch(search)
                          }}
                          className="w-full flex items-center p-2 hover:bg-gray-50 rounded-lg transition-colors text-left"
                        >
                          <Search className="w-4 h-4 text-gray-400 mr-3" />
                          <span className="text-gray-600">{search}</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">
                      No hay búsquedas recientes
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-3 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>Presiona Enter para buscar</span>
                <span>Esc para cerrar</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
