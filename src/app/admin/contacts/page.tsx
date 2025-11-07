'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Plus, Edit, Trash2, Search, Filter, FileText, Mail, Phone, User, Calendar, CheckCircle, Clock, XCircle, Eye } from 'lucide-react'

interface Contact {
  id: string
  family_name: string
  phone: string
  email: string
  resident_name: string
  resident_age: number
  care_type: string
  message: string
  status: string
  whatsapp_sent: boolean
  notes: string
  created_at: string
  updated_at: string
}

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [viewingContact, setViewingContact] = useState<Contact | null>(null)
  const [formData, setFormData] = useState({
    family_name: '',
    phone: '',
    email: '',
    resident_name: '',
    resident_age: 0,
    care_type: '',
    message: '',
    status: 'Nuevo',
    whatsapp_sent: false,
    notes: ''
  })
  const [submitting, setSubmitting] = useState(false)

  const contactStatuses = [
    'Nuevo',
    'En Revisión',
    'Contactado',
    'Atendido',
    'Cerrado'
  ]

  const careTypes = [
    'Cuidado Básico',
    'Cuidado Intermedio',
    'Cuidado Avanzado',
    'Cuidado Especializado',
    'Rehabilitación',
    'Otro'
  ]

  useEffect(() => {
    loadContacts()
  }, [])

  const loadContacts = async () => {
    try {
      setLoading(true)
      const result = await supabase?.from('contact_forms')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (result?.error) throw result.error
      setContacts(result?.data || [])
    } catch (error) {
      console.error('Error loading contacts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteContact = async (contactId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este contacto?')) return
    
    try {
      const result = await supabase?.from('contact_forms').delete().eq('id', contactId)
      if (result?.error) throw result.error
      
      loadContacts()
    } catch (error) {
      console.error('Error deleting contact:', error)
      alert('Error al eliminar el contacto')
    }
  }

  const handleEditContact = (contact: Contact) => {
    setEditingContact(contact)
    setFormData({
      family_name: contact.family_name,
      phone: contact.phone,
      email: contact.email,
      resident_name: contact.resident_name,
      resident_age: contact.resident_age,
      care_type: contact.care_type,
      message: contact.message,
      status: contact.status,
      whatsapp_sent: contact.whatsapp_sent,
      notes: contact.notes
    })
  }

  const handleViewContact = (contact: Contact) => {
    setViewingContact(contact)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.family_name || !formData.email || !formData.message) {
      alert('Por favor completa todos los campos obligatorios')
      return
    }
    
    setSubmitting(true)

    try {
      if (editingContact) {
        const result = await supabase?.from('contact_forms')
          .update({
            ...formData,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingContact.id)
        
        if (result?.error) throw result.error
        alert('Contacto actualizado exitosamente')
      } else {
        const result = await supabase?.from('contact_forms')
          .insert([formData])
        
        if (result?.error) throw result.error
        alert('Contacto creado exitosamente')
      }

      resetForm()
      loadContacts()
    } catch (error) {
      alert('Error al guardar el contacto')
    } finally {
      setSubmitting(false)
    }
  }

  const resetForm = () => {
    setFormData({
      family_name: '',
      phone: '',
      email: '',
      resident_name: '',
      resident_age: 0,
      care_type: '',
      message: '',
      status: 'Nuevo',
      whatsapp_sent: false,
      notes: ''
    })
    setShowAddModal(false)
    setEditingContact(null)
  }

  const filteredContacts = contacts.filter(contact =>
    (contact.family_name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (contact.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (contact.phone || '').includes(searchTerm) ||
    (contact.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Nuevo': return 'bg-blue-100 text-blue-800'
      case 'En Revisión': return 'bg-yellow-100 text-yellow-800'
      case 'Contactado': return 'bg-purple-100 text-purple-800'
      case 'Atendido': return 'bg-green-100 text-green-800'
      case 'Cerrado': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Nuevo': return <Mail className="w-4 h-4" />
      case 'En Revisión': return <Clock className="w-4 h-4" />
      case 'Contactado': return <Phone className="w-4 h-4" />
      case 'Atendido': return <CheckCircle className="w-4 h-4" />
      case 'Cerrado': return <XCircle className="w-4 h-4" />
      default: return <Mail className="w-4 h-4" />
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
              <h1 className="text-3xl font-bold text-gray-900">Gestión de Contactos</h1>
              <p className="text-gray-600">Administra los formularios de contacto del centro</p>
            </div>
            <button 
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Nuevo Contacto
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
                  placeholder="Buscar por nombre, email, teléfono o estado..."
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

        {/* Contacts Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              Contactos ({filteredContacts.length})
            </h3>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Familia
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Residente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contacto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Cuidado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    WhatsApp
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContacts.map((contact) => (
                  <tr key={contact.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.family_name}</div>
                        <div className="text-sm text-gray-500">{contact.phone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{contact.resident_name || 'No especificado'}</div>
                        <div className="text-sm text-gray-500">{contact.resident_age ? `${contact.resident_age} años` : 'Edad no especificada'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm text-gray-900">{contact.email || 'No especificado'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {contact.care_type || 'No especificado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(contact.status || '')}`}>
                        {getStatusIcon(contact.status || '')}
                        <span className="ml-1">{contact.status || 'Nuevo'}</span>
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${contact.whatsapp_sent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {contact.whatsapp_sent ? 'Enviado' : 'Pendiente'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(contact.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => handleViewContact(contact)}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Ver detalles"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleEditContact(contact)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Editar"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteContact(contact.id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Eliminar"
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

          {filteredContacts.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <FileText className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay contactos</h3>
              <p className="text-gray-500">
                {searchTerm ? 'No se encontraron contactos con esa búsqueda.' : 'Comienza agregando tu primer contacto.'}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingContact) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">
                {editingContact ? 'Editar Contacto' : 'Nuevo Contacto'}
              </h3>
              <p className="text-gray-600 text-sm">
                {editingContact ? 'Modifica la información del contacto.' : 'Completa la información del nuevo contacto.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre de la Familia *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.family_name}
                    onChange={(e) => setFormData({...formData, family_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Residente
                  </label>
                  <input
                    type="text"
                    value={formData.resident_name}
                    onChange={(e) => setFormData({...formData, resident_name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Edad del Residente
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={formData.resident_age}
                    onChange={(e) => setFormData({...formData, resident_age: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Cuidado
                  </label>
                  <select
                    value={formData.care_type}
                    onChange={(e) => setFormData({...formData, care_type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Seleccionar tipo de cuidado</option>
                    {careTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {contactStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp Enviado
                  </label>
                  <select
                    value={formData.whatsapp_sent.toString()}
                    onChange={(e) => setFormData({...formData, whatsapp_sent: e.target.value === 'true'})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="false">No</option>
                    <option value="true">Sí</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mensaje
                </label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

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
                  {submitting ? 'Guardando...' : (editingContact ? 'Guardar Cambios' : 'Crear Contacto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Contact Modal */}
      {viewingContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Detalles del Contacto</h3>
                <button 
                  onClick={() => setViewingContact(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Familia</label>
                  <p className="text-gray-900">{viewingContact.family_name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
                  <p className="text-gray-900">{viewingContact.phone}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <p className="text-gray-900">{viewingContact.email || 'No especificado'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nombre del Residente</label>
                  <p className="text-gray-900">{viewingContact.resident_name || 'No especificado'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Edad del Residente</label>
                  <p className="text-gray-900">{viewingContact.resident_age ? `${viewingContact.resident_age} años` : 'No especificada'}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Cuidado</label>
                  <p className="text-gray-900">{viewingContact.care_type || 'No especificado'}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(viewingContact.status || '')}`}>
                    {getStatusIcon(viewingContact.status || '')}
                    <span className="ml-1">{viewingContact.status || 'Nuevo'}</span>
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Enviado</label>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${viewingContact.whatsapp_sent ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {viewingContact.whatsapp_sent ? 'Sí' : 'No'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mensaje</label>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingContact.message || 'No especificado'}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notas Adicionales</label>
                <p className="text-gray-900 whitespace-pre-wrap">{viewingContact.notes || 'No especificado'}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fecha de Creación</label>
                  <p className="text-gray-900">{new Date(viewingContact.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Última Actualización</label>
                  <p className="text-gray-900">{new Date(viewingContact.updated_at).toLocaleString()}</p>
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button 
                  onClick={() => handleEditContact(viewingContact)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Edit className="w-4 h-4 inline mr-2" />
                  Editar
                </button>
                <button 
                  onClick={() => setViewingContact(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
