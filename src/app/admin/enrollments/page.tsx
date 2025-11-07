'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Search, Filter, FileText, Calendar, User, DollarSign, CheckCircle, Clock, XCircle } from 'lucide-react'

interface Enrollment {
  id: string
  patient_id: string
  patient_name: string
  enrollment_date: string
  discharge_date: string
  room_type: string
  care_level: string
  monthly_fee: number
  payment_status: string
  status: string
  notes: string
  created_at: string
}

interface Patient {
  id: string
  full_name: string
  cedula: string
}

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([])
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEnrollment, setEditingEnrollment] = useState<Enrollment | null>(null)
  const [formData, setFormData] = useState({
    patient_id: '',
    enrollment_date: new Date().toISOString().split('T')[0], // Fecha actual como valor por defecto
    discharge_date: '',
    room_type: 'Individual',
    care_level: 'Básico',
    monthly_fee: 500, // Valor por defecto más realista
    payment_status: 'Pendiente',
    status: 'Activa',
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const roomTypes = [
    'Individual',
    'Compartida',
    'Suite',
    'Especial'
  ]

  const careLevels = [
    'Básico',
    'Intermedio',
    'Avanzado',
    'Especializado'
  ]

  const paymentStatuses = [
    'Pendiente',
    'Parcial',
    'Completo',
    'Atrasado'
  ]

  const enrollmentStatuses = [
    'Activa',
    'Finalizada', 
    'Cancelada'
  ]

  useEffect(() => {
    loadEnrollments()
    loadPatients()
  }, [])

  const loadEnrollments = async () => {
    try {
      setLoading(true)
      const result = await supabase?.from('enrollments')
        .select(`
          *,
          patients!inner(full_name, cedula)
        `)
        .order('created_at', { ascending: false })
      
      if (result?.error) throw result.error
      
      // Transformar los datos para incluir el nombre del paciente
      const transformedData = result?.data?.map(item => ({
        ...item,
        patient_name: item.patients?.full_name || 'Paciente no encontrado'
      })) || []
      
      setEnrollments(transformedData)
    } catch (error) {
      console.error('Error loading enrollments:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadPatients = async () => {
    try {
      const result = await supabase?.from('patients')
        .select('id, full_name, cedula')
        .order('full_name')
      
      if (result?.error) throw result.error
      setPatients(result?.data || [])
    } catch (error) {
      console.error('Error loading patients:', error)
    }
  }

  const handleDeleteEnrollment = async (enrollmentId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta matrícula?')) return
    
    try {
      const result = await supabase?.from('enrollments').delete().eq('id', enrollmentId)
      if (result?.error) throw result.error
      
      loadEnrollments()
    } catch (error) {
      console.error('Error deleting enrollment:', error)
      alert('Error al eliminar la matrícula')
    }
  }

  const handleEditEnrollment = (enrollment: Enrollment) => {
    setEditingEnrollment(enrollment)
    setFormData({
      patient_id: enrollment.patient_id,
      enrollment_date: enrollment.enrollment_date,
      discharge_date: enrollment.discharge_date || '',
      room_type: enrollment.room_type || 'Individual',
      care_level: enrollment.care_level || 'Básico',
      monthly_fee: enrollment.monthly_fee,
      payment_status: enrollment.payment_status || 'Pendiente',
      status: enrollment.status || 'Activa',  // Cambiado de 'Activo' a 'En Proceso'
      notes: enrollment.notes || ''
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validación adicional antes de enviar
    if (!formData.patient_id) {
      alert('Por favor selecciona un paciente')
      return
    }
    
    if (!formData.enrollment_date) {
      alert('Por favor selecciona una fecha de ingreso')
      return
    }
    
    if (formData.monthly_fee <= 0) {
      alert('La cuota mensual debe ser mayor a 0')
      return
    }
    
    setSubmitting(true)

    try {
      // Limpiar campos vacíos antes de enviar
      const cleanData = {
        ...formData,
        discharge_date: formData.discharge_date || null, // Convertir cadena vacía a null
        notes: formData.notes || null // Convertir cadena vacía a null
      }

      if (editingEnrollment) {
        const result = await supabase?.from('enrollments')
          .update(cleanData)
          .eq('id', editingEnrollment.id)
        
        if (result?.error) throw result.error
        alert('Matrícula actualizada exitosamente')
      } else {
        const result = await supabase?.from('enrollments')
          .insert([cleanData])
        
        if (result?.error) throw result.error
        alert('Matrícula creada exitosamente')
      }

      resetForm()
      loadEnrollments()
    } catch (error) {
      // Manejar diferentes tipos de error
      let errorMessage = 'Error desconocido'
      if (error && typeof error === 'object') {
        if ('message' in error && error.message) {
          errorMessage = String(error.message)
        } else if ('code' in error && error.code) {
          errorMessage = `Error ${String(error.code)}`
        } else if ('details' in error && error.details) {
          errorMessage = String(error.details)
        } else {
          errorMessage = JSON.stringify(error)
        }
      } else if (error && typeof error === 'string') {
        errorMessage = error
      }
      
      alert(`Error al guardar la matrícula: ${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      patient_id: '',
      enrollment_date: new Date().toISOString().split('T')[0], // Fecha actual como valor por defecto
      discharge_date: '',
      room_type: 'Individual',
      care_level: 'Básico',
      monthly_fee: 500, // Valor por defecto más realista
      payment_status: 'Pendiente',
      status: 'Activa',
      notes: ''
    })
    setShowAddModal(false)
    setEditingEnrollment(null)
  }

  const filteredEnrollments = enrollments.filter(enrollment =>
    enrollment.patient_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.room_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.care_level?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enrollment.status?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Activa': return 'bg-green-100 text-green-800'
      case 'Finalizada': return 'bg-blue-100 text-blue-800'
      case 'Cancelada': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Completo': return 'bg-green-100 text-green-800'
      case 'Parcial': return 'bg-yellow-100 text-yellow-800'
      case 'Pendiente': return 'bg-blue-100 text-blue-800'
      case 'Atrasado': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Matrículas</h1>
              <p className="text-gray-600">Administra las inscripciones de pacientes en el centro</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Nueva Matrícula
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Buscar por paciente, tipo de habitación, nivel de cuidado o estado..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4 inline mr-2" />
                Filtros
              </button>
            </div>
          </div>
        </div>

        {/* Enrollments Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Matrículas ({filteredEnrollments.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Habitación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fechas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nivel de Cuidado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pago
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEnrollments.map((enrollment) => (
                  <tr key={enrollment.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{enrollment.patient_name}</div>
                        <div className="text-sm text-gray-500">ID: {enrollment.patient_id.slice(0, 8)}...</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{enrollment.room_type || 'No especificado'}</div>
                        <div className="text-sm text-gray-500">${enrollment.monthly_fee}/mes</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div>Ingreso: {new Date(enrollment.enrollment_date).toLocaleDateString()}</div>
                        {enrollment.discharge_date && (
                          <div>Egreso: {new Date(enrollment.discharge_date).toLocaleDateString()}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {enrollment.care_level || 'No especificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(enrollment.status || '')}`}>
                        {enrollment.status || 'No especificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(enrollment.payment_status || '')}`}>
                        {enrollment.payment_status || 'No especificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditEnrollment(enrollment)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteEnrollment(enrollment.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredEnrollments.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay matrículas</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron matrículas con esa búsqueda.' : 'Comienza agregando tu primera matrícula.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingEnrollment) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingEnrollment ? 'Editar Matrícula' : 'Nueva Matrícula'}
              </h3>
              <p className="text-gray-600 text-sm">
                {editingEnrollment ? 'Modifica la información de la matrícula.' : 'Completa la información de la nueva matrícula.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Selección de Paciente y Tipo de Habitación */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paciente *
                  </label>
                  <select
                    required
                    value={formData.patient_id}
                    onChange={(e) => setFormData({...formData, patient_id: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar paciente</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.full_name} - {patient.cedula}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Habitación *
                  </label>
                  <select
                    required
                    value={formData.room_type}
                    onChange={(e) => setFormData({...formData, room_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {roomTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Ingreso *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.enrollment_date}
                    onChange={(e) => setFormData({...formData, enrollment_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Egreso (Opcional)
                  </label>
                  <input
                    type="date"
                    value={formData.discharge_date}
                    onChange={(e) => setFormData({...formData, discharge_date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Nivel de Cuidado y Cuota */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Cuidado *
                  </label>
                  <select
                    required
                    value={formData.care_level}
                    onChange={(e) => setFormData({...formData, care_level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {careLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cuota Mensual *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      required
                      min="0"
                      step="0.01"
                      value={formData.monthly_fee}
                      onChange={(e) => setFormData({...formData, monthly_fee: parseFloat(e.target.value) || 0})}
                      className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>

              {/* Estados */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado de la Matrícula
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {enrollmentStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado del Pago
                  </label>
                  <select
                    value={formData.payment_status}
                    onChange={(e) => setFormData({...formData, payment_status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {paymentStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Botones de Acción */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Guardando...' : (editingEnrollment ? 'Guardar Cambios' : 'Crear Matrícula')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
