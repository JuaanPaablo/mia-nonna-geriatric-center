'use client'

import { useState } from 'react'
import { Trash2, AlertTriangle, CheckCircle, Database, Users, FileText, MessageSquare, Settings } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface DataCleanerProps {
  onDataCleared?: () => void
}

export default function DataCleaner({ onDataCleared }: DataCleanerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'confirm' | 'cleaning' | 'success'>('confirm')
  const [selectedTables, setSelectedTables] = useState({
    patients: true,
    enrollments: true,
    contacts: true,
    services: true
  })

  // Contar registros en cada tabla
  const [counts, setCounts] = useState({
    patients: 0,
    enrollments: 0,
    contacts: 0,
    services: 0
  })

  // Cargar conteos al abrir
  const loadCounts = async () => {
    try {
      const [patientsResult, enrollmentsResult, contactsResult, servicesResult] = await Promise.all([
        supabase?.from('patients').select('*', { count: 'exact', head: true }),
        supabase?.from('enrollments').select('*', { count: 'exact', head: true }),
        supabase?.from('contact_forms').select('*', { count: 'exact', head: true }),
        supabase?.from('services').select('*', { count: 'exact', head: true })
      ])

      setCounts({
        patients: patientsResult?.count || 0,
        enrollments: enrollmentsResult?.count || 0,
        contacts: contactsResult?.count || 0,
        services: servicesResult?.count || 0
      })
    } catch (error) {
      console.error('Error loading counts:', error)
    }
  }

  // Abrir modal y cargar conteos
  const openCleaner = () => {
    setIsOpen(true)
    setStep('confirm')
    loadCounts()
  }

  // Limpiar datos seleccionados
  const cleanData = async () => {
    setStep('cleaning')
    setLoading(true)

    try {
      const tablesToClean = Object.entries(selectedTables)
        .filter(([_, selected]) => selected)
        .map(([table]) => table)

      // Limpiar cada tabla seleccionada
      for (const table of tablesToClean) {
        switch (table) {
          case 'patients':
            await supabase?.from('patients').delete().neq('id', '00000000-0000-0000-0000-000000000000')
            break
          case 'enrollments':
            await supabase?.from('enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000')
            break
          case 'contacts':
            await supabase?.from('contact_forms').delete().neq('id', '00000000-0000-0000-0000-000000000000')
            break
          case 'services':
            await supabase?.from('services').delete().neq('id', '00000000-0000-0000-0000-000000000000')
            break
        }
      }

      setStep('success')
      onDataCleared?.()

      // Cerrar automáticamente después de 3 segundos
      setTimeout(() => {
        setIsOpen(false)
        setStep('confirm')
      }, 3000)

    } catch (error) {
      console.error('Error cleaning data:', error)
      alert('Error al limpiar los datos. Revisa la consola para más detalles.')
      setStep('confirm')
    } finally {
      setLoading(false)
    }
  }

  // Cambiar selección de tabla
  const toggleTable = (table: string) => {
    setSelectedTables(prev => ({
      ...prev,
      [table]: !prev[table as keyof typeof prev]
    }))
  }

  // Obtener total de registros a eliminar
  const totalToDelete = Object.entries(selectedTables).reduce((total, [table, selected]) => {
    return selected ? total + counts[table as keyof typeof counts] : total
  }, 0)

  // Obtener icono para cada tabla
  const getTableIcon = (table: string) => {
    switch (table) {
      case 'patients': return <Users className="w-4 h-4" />
      case 'enrollments': return <FileText className="w-4 h-4" />
      case 'contacts': return <MessageSquare className="w-4 h-4" />
      case 'services': return <Settings className="w-4 h-4" />
      default: return <Database className="w-4 h-4" />
    }
  }

  // Obtener nombre en español para cada tabla
  const getTableName = (table: string) => {
    switch (table) {
      case 'patients': return 'Pacientes'
      case 'enrollments': return 'Matrículas'
      case 'contacts': return 'Contactos'
      case 'services': return 'Servicios'
      default: return table
    }
  }

  return (
    <>
      {/* Botón para abrir limpiador */}
      <button
        onClick={openCleaner}
        className="flex items-center px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
        title="Limpiar todos los datos"
      >
        <Trash2 className="w-5 h-5 mr-2" />
        <span className="hidden md:inline">Limpiar Datos</span>
        <span className="md:hidden">Limpiar</span>
      </button>

      {/* Modal de limpieza */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Limpiar Base de Datos</h2>
                  <p className="text-sm text-gray-600">Eliminar todos los datos de prueba</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <span className="sr-only">Cerrar</span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Contenido */}
            <div className="p-6">
              {step === 'confirm' && (
                <div className="space-y-6">
                  {/* Advertencia */}
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <AlertTriangle className="w-5 h-5 text-red-600" />
                      <div>
                        <h3 className="font-medium text-red-800">¡ADVERTENCIA!</h3>
                        <p className="text-sm text-red-700 mt-1">
                          Esta acción eliminará PERMANENTEMENTE todos los datos seleccionados.
                          Esta operación NO se puede deshacer.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Selección de tablas */}
                  <div>
                    <h3 className="font-medium text-gray-900 mb-3">Seleccionar tablas a limpiar:</h3>
                    <div className="space-y-3">
                      {Object.entries(selectedTables).map(([table, selected]) => (
                        <label key={table} className="flex items-center space-x-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={selected}
                            onChange={() => toggleTable(table)}
                            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
                          />
                          <div className="flex items-center space-x-2">
                            {getTableIcon(table)}
                            <span className="text-gray-700">{getTableName(table)}</span>
                            <span className="text-sm text-gray-500">({counts[table as keyof typeof counts]} registros)</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Resumen */}
                  {totalToDelete > 0 && (
                    <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Total a eliminar:</strong> {totalToDelete} registros
                      </p>
                    </div>
                  )}

                  {/* Botones */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => setIsOpen(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={cleanData}
                      disabled={totalToDelete === 0}
                      className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Limpiar Datos
                    </button>
                  </div>
                </div>
              )}

              {step === 'cleaning' && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Limpiando datos...</h3>
                  <p className="text-gray-600">Por favor, no cierres esta ventana.</p>
                </div>
              )}

              {step === 'success' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">¡Datos limpiados exitosamente!</h3>
                  <p className="text-gray-600">
                    Se eliminaron {totalToDelete} registros de la base de datos.
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    Esta ventana se cerrará automáticamente en unos segundos.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
