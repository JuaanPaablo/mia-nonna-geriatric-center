'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Search, Filter, Eye, Users, AlertCircle, CheckCircle } from 'lucide-react'
import { 
  validateEcuadorianCedula, 
  validateMaxLength, 
  getRemainingChars, 
  getCountryPrefix,
  calculateAge,
  validateDateOfBirth,
  generateNextPatientNumber
} from '@/lib/validationUtils'

interface Patient {
  id: string
  patient_number: string
  cedula: string
  full_name: string
  date_of_birth: string
  age: number
  gender: string
  emergency_contact_name: string
  emergency_contact_phone: string
  medical_conditions: string
  medications: string
  allergies: string
  dietary_restrictions: string
  mobility_level: string
  status: string
  additional_notes: string
  created_at: string
}

interface FormErrors {
  cedula?: string
  full_name?: string
  date_of_birth?: string
  emergency_contact_name?: string
  emergency_contact_phone?: string
  medical_conditions?: string
  medications?: string
  allergies?: string
  dietary_restrictions?: string
  additional_notes?: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null)
  const [formData, setFormData] = useState({
    patient_number: '',
    cedula: '',
    full_name: '',
    date_of_birth: '',
    gender: 'Masculino',
    emergency_contact_name: '',
    emergency_contact_phone: '',
    medical_conditions: '',
    medications: '',
    allergies: '',
    dietary_restrictions: '',
    mobility_level: 'Independiente',
    status: 'Activo',
    additional_notes: ''
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('EC')

  useEffect(() => {
    loadPatients()
  }, [])

  const loadPatients = async () => {
    try {
      setLoading(true)
      const result = await supabase?.from('patients').select('*').order('created_at', { ascending: false })
      
      if (result?.error) throw result.error
      setPatients(result?.data || [])
    } catch (error) {
      console.error('Error loading patients:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePatient = async (patientId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este paciente?')) return
    
    try {
      const result = await supabase?.from('patients').delete().eq('id', patientId)
      if (result?.error) throw result.error
      
      // Recargar la lista
      loadPatients()
    } catch (error) {
      console.error('Error deleting patient:', error)
      alert('Error al eliminar el paciente')
    }
  }

  const handleEditPatient = (patient: Patient) => {
    setEditingPatient(patient)
    setFormData({
      patient_number: patient.patient_number || '',
      cedula: patient.cedula || '',
      full_name: patient.full_name || '',
      date_of_birth: patient.date_of_birth || '',
      gender: patient.gender || 'Masculino',
      emergency_contact_name: patient.emergency_contact_name || '',
      emergency_contact_phone: patient.emergency_contact_phone || '',
      medical_conditions: patient.medical_conditions || '',
      medications: patient.medications || '',
      allergies: patient.allergies || '',
      dietary_restrictions: patient.dietary_restrictions || '',
      mobility_level: patient.mobility_level || 'Independiente',
      status: patient.status || 'Activo',
      additional_notes: patient.additional_notes || ''
    })
    setFormErrors({})
  }

  const validateForm = (): boolean => {
    const errors: FormErrors = {}

    // Validar cédula
    if (!formData.cedula) {
      errors.cedula = 'La cédula es obligatoria'
    } else if (!validateEcuadorianCedula(formData.cedula)) {
      errors.cedula = 'La cédula no es válida según las reglas ecuatorianas'
    }

    // Validar nombre completo
    if (!formData.full_name) {
      errors.full_name = 'El nombre completo es obligatorio'
    } else if (!validateMaxLength(formData.full_name, 100)) {
      errors.full_name = 'El nombre no puede exceder 100 caracteres'
    }

    // Validar fecha de nacimiento
    if (!formData.date_of_birth) {
      errors.date_of_birth = 'La fecha de nacimiento es obligatoria'
    } else if (!validateDateOfBirth(formData.date_of_birth)) {
      errors.date_of_birth = 'La fecha de nacimiento no es válida o la edad no está en el rango permitido (50-120 años)'
    }

    // Validar nombre del contacto de emergencia
    if (formData.emergency_contact_name && !validateMaxLength(formData.emergency_contact_name, 100)) {
      errors.emergency_contact_name = 'El nombre del contacto no puede exceder 100 caracteres'
    }

    // Validar teléfono de emergencia
    if (formData.emergency_contact_phone && !validateMaxLength(formData.emergency_contact_phone, 20)) {
      errors.emergency_contact_phone = 'El teléfono no puede exceder 20 caracteres'
    }

    // Validar campos de texto largo
    if (formData.medical_conditions && !validateMaxLength(formData.medical_conditions, 300)) {
      errors.medical_conditions = 'Las condiciones médicas no pueden exceder 300 caracteres'
    }

    if (formData.medications && !validateMaxLength(formData.medications, 300)) {
      errors.medications = 'Los medicamentos no pueden exceder 300 caracteres'
    }

    if (formData.allergies && !validateMaxLength(formData.allergies, 300)) {
      errors.allergies = 'Las alergias no pueden exceder 300 caracteres'
    }

    if (formData.dietary_restrictions && !validateMaxLength(formData.dietary_restrictions, 300)) {
      errors.dietary_restrictions = 'Las restricciones dietéticas no pueden exceder 300 caracteres'
    }

    if (formData.additional_notes && !validateMaxLength(formData.additional_notes, 300)) {
      errors.additional_notes = 'Las notas adicionales no pueden exceder 300 caracteres'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setSubmitting(true)

    try {
      // Calcular edad automáticamente
      const age = calculateAge(formData.date_of_birth)
      
      const patientData = {
        ...formData,
        age,
        // Generar número de paciente si es nuevo
        patient_number: editingPatient ? formData.patient_number : generateNextPatientNumber(patients.map(p => p.patient_number))
      }

      if (editingPatient) {
        // Actualizar paciente existente
        const result = await supabase?.from('patients')
          .update(patientData)
          .eq('id', editingPatient.id)
        
        if (result?.error) throw result.error
        alert('Paciente actualizado exitosamente')
      } else {
        // Crear nuevo paciente
        const result = await supabase?.from('patients')
          .insert([patientData])
        
        if (result?.error) throw result.error
        alert('Paciente creado exitosamente')
      }

      // Limpiar formulario y cerrar modal
      resetForm()
      
      // Recargar la lista
      loadPatients()
    } catch (error) {
      console.error('Error saving patient:', error)
      alert('Error al guardar el paciente')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      patient_number: '',
      cedula: '',
      full_name: '',
      date_of_birth: '',
      gender: 'Masculino',
      emergency_contact_name: '',
      emergency_contact_phone: '',
      medical_conditions: '',
      medications: '',
      allergies: '',
      dietary_restrictions: '',
      mobility_level: 'Independiente',
      status: 'Activo',
      additional_notes: ''
    })
    setFormErrors({})
    setShowAddModal(false)
    setEditingPatient(null)
  }

  const handleCedulaChange = (value: string) => {
    // Solo permitir números
    const numericValue = value.replace(/\D/g, '')
    // Limitar a 10 dígitos
    const limitedValue = numericValue.slice(0, 10)
    
    setFormData({ ...formData, cedula: limitedValue })
    
    // Limpiar error de cédula si se corrige
    if (formErrors.cedula) {
      setFormErrors({ ...formErrors, cedula: undefined })
    }
  }

  const handlePhoneChange = (value: string) => {
    // Limpiar el valor y aplicar el prefijo del país
    const cleanValue = value.replace(/\D/g, '')
    const countryPrefix = getCountryPrefix(selectedCountry)
    
    let formattedPhone = countryPrefix
    if (cleanValue) {
      formattedPhone += ' ' + cleanValue
    }
    
    setFormData({ ...formData, emergency_contact_phone: formattedPhone })
  }

  const filteredPatients = patients.filter(patient =>
    (patient.cedula && patient.cedula.includes(searchTerm)) ||
    (patient.full_name && patient.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (patient.patient_number && patient.patient_number.includes(searchTerm)) ||
    (patient.emergency_contact_name && patient.emergency_contact_name.toLowerCase().includes(searchTerm.toLowerCase()))
  )

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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Pacientes</h1>
              <p className="text-gray-600">Administra todos los pacientes del centro</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Nuevo Paciente
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
                  placeholder="Buscar por cédula, nombre, número de paciente o contacto de emergencia..."
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

        {/* Patients Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Pacientes ({filteredPatients.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Número
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cédula
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto de Emergencia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredPatients.map((patient) => (
                  <tr key={patient.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 font-mono">
                        {patient.patient_number || 'Sin número'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 font-mono">
                        {patient.cedula || 'Sin cédula'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{patient.full_name}</div>
                        <div className="text-sm text-gray-500">
                          {patient.age} años • {patient.gender}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{patient.emergency_contact_name}</div>
                        <div className="text-sm text-gray-500">{patient.emergency_contact_phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        patient.status === 'Activo' ? 'bg-green-100 text-green-800' :
                        patient.status === 'Inactivo' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {patient.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleEditPatient(patient)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeletePatient(patient.id)}
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

          {filteredPatients.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Users className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay pacientes</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron pacientes con esa búsqueda.' : 'Comienza agregando tu primer paciente.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingPatient) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingPatient ? 'Editar Paciente' : 'Nuevo Paciente'}
              </h3>
              <p className="text-gray-600 text-sm">
                {editingPatient ? 'Modifica la información del paciente.' : 'Completa la información del nuevo paciente.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Número de Paciente y Cédula */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Paciente
                  </label>
                  <input
                    type="text"
                    value={formData.patient_number}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                    placeholder="Se generará automáticamente"
                  />
                  <p className="text-xs text-gray-500 mt-1">Se asigna automáticamente</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cédula Ecuatoriana *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={10}
                    placeholder="1234567890"
                    value={formData.cedula}
                    onChange={(e) => handleCedulaChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.cedula ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.cedula ? (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.cedula}
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 mt-1">10 dígitos numéricos</p>
                  )}
                </div>
              </div>

              {/* Información Personal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre Completo *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.full_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <span className={`text-xs ${
                        getRemainingChars(formData.full_name, 100) < 20 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {getRemainingChars(formData.full_name, 100)}
                      </span>
                    </div>
                  </div>
                  {formErrors.full_name && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.full_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de Nacimiento *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date_of_birth}
                    onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.date_of_birth ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {formErrors.date_of_birth && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.date_of_birth}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Género *
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({...formData, gender: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Masculino">Masculino</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad Calculada
                  </label>
                  <input
                    type="text"
                    value={formData.date_of_birth ? calculateAge(formData.date_of_birth) + ' años' : ''}
                    disabled
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                  />
                </div>
              </div>

              {/* Contacto de Emergencia */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    País
                  </label>
                  <select
                    value={selectedCountry}
                    onChange={(e) => setSelectedCountry(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="EC">🇪🇨 Ecuador (Predeterminado)</option>
                    <option value="CO">🇨🇴 Colombia</option>
                    <option value="PE">🇵🇪 Perú</option>
                    <option value="AR">🇦🇷 Argentina</option>
                    <option value="MX">🇲🇽 México</option>
                    <option value="ES">🇪🇸 España</option>
                    <option value="US">🇺🇸 Estados Unidos</option>
                    <option value="CL">🇨🇱 Chile</option>
                    <option value="VE">🇻🇪 Venezuela</option>
                    <option value="BO">🇧🇴 Bolivia</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Contacto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={100}
                      value={formData.emergency_contact_name}
                      onChange={(e) => setFormData({...formData, emergency_contact_name: e.target.value})}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.emergency_contact_name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Nombre completo"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <span className="text-xs text-gray-400">
                        {getRemainingChars(formData.emergency_contact_name, 100)}
                      </span>
                    </div>
                  </div>
                  {formErrors.emergency_contact_name && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.emergency_contact_name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono de Emergencia
                  </label>
                  <input
                    type="tel"
                    maxLength={20}
                    value={formData.emergency_contact_phone}
                    onChange={(e) => handlePhoneChange(e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.emergency_contact_phone ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Número de teléfono"
                  />
                  {formErrors.emergency_contact_phone && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.emergency_contact_phone}
                    </p>
                  )}
                </div>
              </div>

              {/* Información Médica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Condiciones Médicas
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.medical_conditions}
                      onChange={(e) => setFormData({...formData, medical_conditions: e.target.value})}
                      rows={3}
                      maxLength={300}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.medical_conditions ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Condiciones médicas del paciente"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className={`text-xs ${
                        getRemainingChars(formData.medical_conditions, 300) < 50 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {getRemainingChars(formData.medical_conditions, 300)}
                      </span>
                    </div>
                  </div>
                  {formErrors.medical_conditions && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.medical_conditions}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Medicamentos
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.medications}
                      onChange={(e) => setFormData({...formData, medications: e.target.value})}
                      rows={3}
                      maxLength={300}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.medications ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Medicamentos que toma el paciente"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className={`text-xs ${
                        getRemainingChars(formData.medications, 300) < 50 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {getRemainingChars(formData.medications, 300)}
                      </span>
                    </div>
                  </div>
                  {formErrors.medications && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.medications}
                    </p>
                  )}
                </div>
              </div>

              {/* Alergias y Restricciones */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Alergias
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.allergies}
                      onChange={(e) => setFormData({...formData, allergies: e.target.value})}
                      rows={2}
                      maxLength={300}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.allergies ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Alergias conocidas"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className={`text-xs ${
                        getRemainingChars(formData.allergies, 300) < 50 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {getRemainingChars(formData.allergies, 300)}
                      </span>
                    </div>
                  </div>
                  {formErrors.allergies && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.allergies}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Restricciones Dietéticas
                  </label>
                  <div className="relative">
                    <textarea
                      value={formData.dietary_restrictions}
                      onChange={(e) => setFormData({...formData, dietary_restrictions: e.target.value})}
                      rows={2}
                      maxLength={300}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        formErrors.dietary_restrictions ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="Restricciones alimentarias"
                    />
                    <div className="absolute bottom-2 right-2">
                      <span className={`text-xs ${
                        getRemainingChars(formData.dietary_restrictions, 300) < 50 ? 'text-red-500' : 'text-gray-400'
                      }`}>
                        {getRemainingChars(formData.dietary_restrictions, 300)}
                      </span>
                    </div>
                  </div>
                  {formErrors.dietary_restrictions && (
                    <p className="text-xs text-red-600 mt-1 flex items-center">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      {formErrors.dietary_restrictions}
                    </p>
                  )}
                </div>
              </div>

              {/* Estado y Nivel de Movilidad */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nivel de Movilidad
                  </label>
                  <select
                    value={formData.mobility_level}
                    onChange={(e) => setFormData({...formData, mobility_level: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Independiente">Independiente</option>
                    <option value="Asistido">Asistido</option>
                    <option value="Silla de ruedas">Silla de ruedas</option>
                    <option value="Encamado">Encamado</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                    <option value="Alta médica">Alta médica</option>
                  </select>
                </div>
              </div>

              {/* Notas Adicionales */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <div className="relative">
                  <textarea
                    value={formData.additional_notes}
                    onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
                    rows={3}
                    maxLength={300}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      formErrors.additional_notes ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Información adicional relevante"
                  />
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-xs ${
                      getRemainingChars(formData.additional_notes, 300) < 50 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {getRemainingChars(formData.additional_notes, 300)}
                    </span>
                  </div>
                </div>
                {formErrors.additional_notes && (
                  <p className="text-xs text-red-600 mt-1 flex items-center">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    {formErrors.additional_notes}
                  </p>
                )}
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
                  {submitting ? 'Guardando...' : (editingPatient ? 'Guardar Cambios' : 'Crear Paciente')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
