'use client'

import { useState } from 'react'
import { Filter, X, ChevronDown, ChevronUp } from 'lucide-react'

interface FilterOption {
  label: string
  value: string
  count?: number
}

interface AdvancedFiltersProps {
  filters: {
    status?: FilterOption[]
    category?: FilterOption[]
    dateRange?: {
      start: string
      end: string
    }
  }
  onFiltersChange: (filters: any) => void
  onClearFilters: () => void
}

export default function AdvancedFilters({ filters, onFiltersChange, onClearFilters }: AdvancedFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [localFilters, setLocalFilters] = useState({
    status: '',
    category: '',
    dateRange: {
      start: '',
      end: ''
    }
  })

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleDateChange = (key: 'start' | 'end', value: string) => {
    const newDateRange = { ...localFilters.dateRange, [key]: value }
    const newFilters = { ...localFilters, dateRange: newDateRange }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const clearAllFilters = () => {
    setLocalFilters({
      status: '',
      category: '',
      dateRange: { start: '', end: '' }
    })
    onClearFilters()
  }

  const hasActiveFilters = localFilters.status || localFilters.category || localFilters.dateRange.start || localFilters.dateRange.end

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center space-x-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="font-medium text-gray-700">Filtros Avanzados</span>
          {hasActiveFilters && (
            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
              {[
                localFilters.status,
                localFilters.category,
                localFilters.dateRange.start,
                localFilters.dateRange.end
              ].filter(Boolean).length} activos
            </span>
          )}
        </div>
        {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
      </button>

      {/* Contenido de filtros */}
      {isOpen && (
        <div className="border-t border-gray-200 p-4 space-y-4">
          {/* Filtros de estado */}
          {filters.status && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Estado
              </label>
              <select
                value={localFilters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todos los estados</option>
                {filters.status.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.count ? `(${option.count})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtros de categoría */}
          {filters.category && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Categoría
              </label>
              <select
                value={localFilters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Todas las categorías</option>
                {filters.category.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label} {option.count ? `(${option.count})` : ''}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Filtros de fecha */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rango de Fechas
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Desde</label>
                <input
                  type="date"
                  value={localFilters.dateRange.start}
                  onChange={(e) => handleDateChange('start', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Hasta</label>
                <input
                  type="date"
                  value={localFilters.dateRange.end}
                  onChange={(e) => handleDateChange('end', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
              </div>
            </div>
          </div>

          {/* Acciones */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={clearAllFilters}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Limpiar filtros
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              Aplicar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
