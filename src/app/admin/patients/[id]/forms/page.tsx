'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { ArrowLeft, CheckCircle, Clock, FileText, AlertCircle, Upload, Download, X, Eye } from 'lucide-react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

interface Patient {
  id: string
  patient_number: string
  full_name: string
  cedula: string
}

interface PatientForm {
  id: string
  patient_id: string
  form_type: string
  status: 'pendiente' | 'completado' | 'revisado'
  form_data: Record<string, any>
  file_url: string | null
  file_name: string | null
  file_size: number | null
  file_type: string | null
  completed_at: string | null
  created_at: string
  updated_at: string
}

// Definición de los 15 formularios requeridos
const REQUIRED_FORMS = [
  { type: 'admission', name: 'Formulario de Admisión', description: 'Datos básicos de ingreso del paciente' },
  { type: 'medical_evaluation', name: 'Evaluación Médica Inicial', description: 'Evaluación médica completa del paciente' },
  { type: 'nursing_evaluation', name: 'Evaluación de Enfermería', description: 'Evaluación de cuidados de enfermería' },
  { type: 'psychological_evaluation', name: 'Evaluación Psicológica', description: 'Evaluación del estado psicológico' },
  { type: 'nutritional_evaluation', name: 'Evaluación Nutricional', description: 'Evaluación del estado nutricional' },
  { type: 'social_evaluation', name: 'Evaluación Social', description: 'Evaluación del entorno social' },
  { type: 'functional_evaluation', name: 'Evaluación Funcional', description: 'Evaluación de capacidades funcionales' },
  { type: 'informed_consent', name: 'Consentimiento Informado', description: 'Consentimiento para tratamientos' },
  { type: 'treatment_authorization', name: 'Autorización de Tratamiento', description: 'Autorización de procedimientos médicos' },
  { type: 'medication_history', name: 'Historial de Medicamentos', description: 'Historial completo de medicamentos' },
  { type: 'allergy_evaluation', name: 'Evaluación de Alergias', description: 'Evaluación de alergias conocidas' },
  { type: 'care_plan', name: 'Plan de Cuidados', description: 'Plan de cuidados personalizado' },
  { type: 'risk_assessment', name: 'Evaluación de Riesgos', description: 'Evaluación de riesgos y prevención' },
  { type: 'image_consent', name: 'Consentimiento de Imágenes', description: 'Consentimiento para uso de imágenes' },
  { type: 'discharge_evaluation', name: 'Evaluación de Alta', description: 'Evaluación previa al alta' },
]

const STORAGE_BUCKET = 'patient-forms'
const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg']

export default function PatientFormsPage() {
  const params = useParams()
  const router = useRouter()
  const patientId = params.id as string
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [patient, setPatient] = useState<Patient | null>(null)
  const [forms, setForms] = useState<PatientForm[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedForm, setSelectedForm] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  useEffect(() => {
    if (patientId) {
      loadPatient()
      loadForms()
    }
  }, [patientId])

  const loadPatient = async () => {
    try {
      const result = await supabase
        ?.from('patients')
        .select('id, patient_number, full_name, cedula')
        .eq('id', patientId)
        .single()

      if (result?.error) throw result.error
      if (result?.data) {
        setPatient(result.data)
      }
    } catch (error) {
      console.error('Error loading patient:', error)
      alert('Error al cargar la información del paciente')
    }
  }

  const loadForms = async () => {
    try {
      setLoading(true)
      const result = await supabase
        ?.from('patient_forms')
        .select('*')
        .eq('patient_id', patientId)
        .order('created_at', { ascending: true })

      if (result?.error) throw result.error
      setForms(result?.data || [])
    } catch (error) {
      console.error('Error loading forms:', error)
      alert('Error al cargar los formularios')
    } finally {
      setLoading(false)
    }
  }

  const getFormStatus = (formType: string) => {
    const form = forms.find(f => f.form_type === formType)
    return form?.status || 'pendiente'
  }

  const getForm = (formType: string) => {
    return forms.find(f => f.form_type === formType)
  }

  const handleOpenForm = (formType: string) => {
    setSelectedForm(formType)
    setSelectedFile(null)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      alert('Tipo de archivo no permitido. Solo se permiten PDF, JPEG y PNG.')
      return
    }

    // Validar tamaño
    if (file.size > MAX_FILE_SIZE) {
      alert(`El archivo es demasiado grande. Tamaño máximo: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
      return
    }

    setSelectedFile(file)
  }

  const handleUpload = async () => {
    if (!selectedForm || !selectedFile || !supabase) return

    setUploading(true)
    setUploadProgress(0)

    try {
      const form = getForm(selectedForm)
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${patientId}/${selectedForm}/${Date.now()}.${fileExt}`
      
      // Si ya existe un archivo, eliminarlo primero
      if (form?.file_url) {
        // file_url ahora contiene la ruta completa del archivo
        await supabase.storage.from(STORAGE_BUCKET).remove([form.file_url])
      }

      // Subir el nuevo archivo
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(fileName, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (uploadError) throw uploadError

      // Guardar solo la ruta del archivo (no la URL completa)
      // La URL firmada se generará cuando se necesite visualizar
      const fileUrl = fileName

      // Guardar la información en la base de datos
      const formDataToSave = {
        patient_id: patientId,
        form_type: selectedForm,
        status: 'completado' as const,
        file_url: fileUrl,
        file_name: selectedFile.name,
        file_size: selectedFile.size,
        file_type: selectedFile.type,
        completed_at: new Date().toISOString(),
      }

      if (form) {
        // Actualizar formulario existente
        const { error: updateError } = await supabase
          .from('patient_forms')
          .update(formDataToSave)
          .eq('id', form.id)

        if (updateError) throw updateError
      } else {
        // Crear nuevo formulario
        const { error: insertError } = await supabase
          .from('patient_forms')
          .insert([formDataToSave])

        if (insertError) throw insertError
      }

      alert('Documento subido exitosamente')
      setSelectedForm(null)
      setSelectedFile(null)
      loadForms()
    } catch (error: any) {
      console.error('Error uploading file:', error)
      alert(`Error al subir el documento: ${error.message}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDeleteFile = async (formType: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este documento?') || !supabase) return

    try {
      const form = getForm(formType)
      if (!form?.file_url) return

      // Eliminar archivo de Storage
      // file_url contiene la ruta completa del archivo
      const { error: deleteError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .remove([form.file_url])

      if (deleteError) throw deleteError

      // Actualizar el formulario
      const { error: updateError } = await supabase
        .from('patient_forms')
        .update({
          file_url: null,
          file_name: null,
          file_size: null,
          file_type: null,
          status: 'pendiente',
          completed_at: null,
        })
        .eq('id', form.id)

      if (updateError) throw updateError

      alert('Documento eliminado exitosamente')
      loadForms()
    } catch (error: any) {
      console.error('Error deleting file:', error)
      alert(`Error al eliminar el documento: ${error.message}`)
    }
  }

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completado':
        return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'revisado':
        return <CheckCircle className="w-5 h-5 text-blue-600" />
      default:
        return <Clock className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completado':
        return 'bg-green-100 text-green-800'
      case 'revisado':
        return 'bg-blue-100 text-blue-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const completedForms = forms.filter(f => f.status === 'completado' || f.status === 'revisado').length
  const totalForms = REQUIRED_FORMS.length
  const progressPercentage = (completedForms / totalForms) * 100

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Paciente no encontrado</h2>
          <button
            onClick={() => router.push('/admin/patients')}
            className="text-blue-600 hover:text-blue-800"
          >
            Volver a la lista de pacientes
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/admin/patients')}
                className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Formularios del Paciente</h1>
                <p className="text-gray-600">
                  {patient.full_name} - {patient.patient_number} - Cédula: {patient.cedula}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progreso de Formularios</h2>
            <span className="text-sm text-gray-600">
              {completedForms} de {totalForms} completados
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-600 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {progressPercentage.toFixed(0)}% completado
          </p>
        </div>

        {/* Forms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {REQUIRED_FORMS.map((form) => {
            const status = getFormStatus(form.type)
            const formData = getForm(form.type)
            const hasFile = !!formData?.file_url

            return (
              <div
                key={form.type}
                className="bg-white rounded-lg shadow p-6 border-2 border-transparent hover:border-gray-300 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-6 h-6 text-blue-600" />
                    <div>
                      <h3 className="font-semibold text-gray-900">{form.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{form.description}</p>
                    </div>
                  </div>
                  {getStatusIcon(status)}
                </div>

                {hasFile && (
                  <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-green-900 truncate">
                          {formData?.file_name}
                        </p>
                        <p className="text-xs text-green-600">
                          {formatFileSize(formData?.file_size)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusBadge(status)}`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  <div className="flex space-x-2">
                    {hasFile && (
                      <>
                        <button
                          onClick={async () => {
                            if (!formData?.file_url || !supabase) return
                            try {
                              const { data, error } = await supabase.storage
                                .from(STORAGE_BUCKET)
                                .createSignedUrl(formData.file_url, 3600) // URL válida por 1 hora
                              
                              if (error) throw error
                              if (data?.signedUrl) {
                                window.open(data.signedUrl, '_blank')
                              }
                            } catch (error: any) {
                              console.error('Error generating signed URL:', error)
                              alert('Error al abrir el documento: ' + error.message)
                            }
                          }}
                          className="text-blue-600 hover:text-blue-800 p-1"
                          title="Ver documento"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={async () => {
                            if (!formData?.file_url || !supabase) return
                            try {
                              const { data, error } = await supabase.storage
                                .from(STORAGE_BUCKET)
                                .createSignedUrl(formData.file_url, 3600) // URL válida por 1 hora
                              
                              if (error) throw error
                              if (data?.signedUrl) {
                                const link = document.createElement('a')
                                link.href = data.signedUrl
                                link.download = formData?.file_name || 'documento'
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                              }
                            } catch (error: any) {
                              console.error('Error generating signed URL:', error)
                              alert('Error al descargar el documento: ' + error.message)
                            }
                          }}
                          className="text-green-600 hover:text-green-800 p-1"
                          title="Descargar"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => handleOpenForm(form.type)}
                      className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                    >
                      {hasFile ? 'Reemplazar' : 'Subir'}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Upload Modal */}
        <Modal
          open={!!selectedForm}
          onClose={() => {
            setSelectedForm(null)
            setSelectedFile(null)
          }}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: '80%', md: 600 },
              maxWidth: 600,
              maxHeight: '90vh',
              bgcolor: 'background.paper',
              border: '2px solid #000',
              boxShadow: 24,
              p: 4,
              overflowY: 'auto',
            }}
          >
            <Typography id="modal-modal-title" variant="h6" component="h2" className="mb-2">
              {REQUIRED_FORMS.find(f => f.type === selectedForm)?.name}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 1, mb: 3 }} className="text-gray-600 text-sm">
              {REQUIRED_FORMS.find(f => f.type === selectedForm)?.description}
            </Typography>

            {selectedForm && getForm(selectedForm)?.file_url && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-900">
                      Documento actual: {getForm(selectedForm)?.file_name || ''}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {formatFileSize(getForm(selectedForm)?.file_size || null)}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteFile(selectedForm)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subir Documento Escaneado
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-blue-400 transition-colors">
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                      >
                        <span>Seleccionar archivo</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          ref={fileInputRef}
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={handleFileSelect}
                        />
                      </label>
                      <p className="pl-1">o arrastra y suelta</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, PNG, JPG hasta 50MB
                    </p>
                  </div>
                </div>
              </div>

              {selectedFile && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {selectedFile.name}
                      </p>
                      <p className="text-xs text-green-600 mt-1">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {uploading && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => {
                    setSelectedForm(null)
                    setSelectedFile(null)
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || uploading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>{uploading ? 'Subiendo...' : 'Subir Documento'}</span>
                </button>
              </div>
            </div>
          </Box>
        </Modal>
      </div>
    </div>
  )
}
