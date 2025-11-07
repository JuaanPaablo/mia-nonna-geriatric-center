'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { 
  Users, 
  Bed, 
  FileText, 
  MessageSquare, 
  TrendingUp, 
  Calendar,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import LineChart from '@/components/charts/LineChart'
import BarChart from '@/components/charts/BarChart'
import DoughnutChart from '@/components/charts/DoughnutChart'
import {
  generatePatientsEvolutionData,
  generateRevenueData,
  generateAgeDistributionData,
  generateOccupancyData,
  generateServicesData,
  generateEnrollmentStatusData,
  generateContactStatusData,
  ChartData
} from '@/lib/chartUtils'

interface DashboardStats {
  totalPatients: number
  activePatients: number
  totalEnrollments: number
  activeEnrollments: number
  pendingContacts: number
  totalServices: number
  monthlyRevenue: number
  averageAge: number
}

interface Patient {
  id: string
  full_name: string
  age: number
  room_number: string
  status: string
  created_at: string
}

interface ContactForm {
  id: string
  family_name: string
  phone: string
  email: string
  resident_name: string
  status: string
  created_at: string
}

interface Service {
  id: string
  name: string
  price: number
  is_active: boolean
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPatients: 0,
    activePatients: 0,
    totalEnrollments: 0,
    activeEnrollments: 0,
    pendingContacts: 0,
    totalServices: 0,
    monthlyRevenue: 0,
    averageAge: 0
  })
  const [recentPatients, setRecentPatients] = useState<Patient[]>([])
  const [recentContacts, setRecentContacts] = useState<ContactForm[]>([])
  const [topServices, setTopServices] = useState<Service[]>([])
  const [chartData, setChartData] = useState<ChartData>({
    patients: [],
    enrollments: [],
    contacts: [],
    services: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Cargar estadísticas
      const [patientsResult, enrollmentsResult, contactsResult, servicesResult] = await Promise.all([
        supabase?.from('patients').select('*'),
        supabase?.from('enrollments').select('*'),
        supabase?.from('contact_forms').select('*'),
        supabase?.from('services').select('*')
      ])

      if (patientsResult?.data) {
        const totalPatients = patientsResult.data.length
        const activePatients = patientsResult.data.filter(p => p.status === 'Activo').length
        const averageAge = patientsResult.data.length > 0 
          ? Math.round(patientsResult.data.reduce((sum, p) => sum + (p.age || 0), 0) / patientsResult.data.length)
          : 0
        setStats(prev => ({ ...prev, totalPatients, activePatients, averageAge }))
        setRecentPatients(patientsResult.data.slice(0, 5))
      }

      if (enrollmentsResult?.data) {
        const totalEnrollments = enrollmentsResult.data.length
        const activeEnrollments = enrollmentsResult.data.filter(e => e.status === 'Activa').length
        const monthlyRevenue = enrollmentsResult.data
          .filter(e => e.status === 'Activa')
          .reduce((sum, e) => sum + (e.monthly_fee || 0), 0)
        setStats(prev => ({ ...prev, totalEnrollments, activeEnrollments, monthlyRevenue }))
      }

      if (contactsResult?.data) {
        const pendingContacts = contactsResult.data.filter(c => c.status === 'Nuevo').length
        setStats(prev => ({ ...prev, pendingContacts }))
        setRecentContacts(contactsResult.data.slice(0, 5))
      }

      if (servicesResult?.data) {
        const totalServices = servicesResult.data.filter(s => s.is_active).length
        setStats(prev => ({ ...prev, totalServices }))
        setTopServices(servicesResult.data.filter(s => s.is_active).slice(0, 3))
      }

      // Preparar datos para gráficos
      setChartData({
        patients: patientsResult?.data || [],
        enrollments: enrollmentsResult?.data || [],
        contacts: contactsResult?.data || [],
        services: servicesResult?.data || []
      })

    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      setLoading(false)
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
              <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
              <p className="text-gray-600">Centro Geriátrico Mia Nonna</p>
            </div>
            <div className="flex space-x-3">
              <Link href="/admin/patients" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4 inline mr-2" />
                Nuevo Paciente
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Pacientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalPatients}</p>
                <p className="text-xs text-gray-500">Edad promedio: {stats.averageAge} años</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Bed className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pacientes Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activePatients}</p>
                <p className="text-xs text-gray-500">De {stats.totalPatients} total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Matrículas</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeEnrollments}</p>
                <p className="text-xs text-gray-500">De {stats.totalEnrollments} total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-emerald-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ingresos Mensuales</p>
                <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Por matrículas activas</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Contactos Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingContacts}</p>
                <p className="text-xs text-gray-500">Requieren atención</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Servicios Activos</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalServices}</p>
                <p className="text-xs text-gray-500">Disponibles</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-indigo-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Ocupación</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalPatients > 0 ? Math.round((stats.activePatients / stats.totalPatients) * 100) : 0}%
                </p>
                <p className="text-xs text-gray-500">Capacidad actual</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          <div className="flex items-center mb-6">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-2" />
            <h2 className="text-2xl font-bold text-gray-900">Análisis y Estadísticas</h2>
          </div>
          
          {/* First Row of Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Evolución de Pacientes */}
            <div className="bg-white rounded-lg shadow p-6">
              <LineChart 
                data={generatePatientsEvolutionData(chartData)}
                title="Evolución de Pacientes (Últimos 6 meses)"
                height={300}
              />
            </div>

            {/* Ingresos Mensuales */}
            <div className="bg-white rounded-lg shadow p-6">
              <BarChart 
                data={generateRevenueData(chartData)}
                title="Ingresos Mensuales (Últimos 6 meses)"
                height={300}
              />
            </div>
          </div>

          {/* Second Row of Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Distribución por Edad */}
            <div className="bg-white rounded-lg shadow p-6">
              <DoughnutChart 
                data={generateAgeDistributionData(chartData)}
                title="Distribución por Edad"
                height={250}
              />
            </div>

            {/* Estado de Matrículas */}
            <div className="bg-white rounded-lg shadow p-6">
              <DoughnutChart 
                data={generateEnrollmentStatusData(chartData)}
                title="Estado de Matrículas"
                height={250}
              />
            </div>

            {/* Estado de Contactos */}
            <div className="bg-white rounded-lg shadow p-6">
              <DoughnutChart 
                data={generateContactStatusData(chartData)}
                title="Estado de Contactos"
                height={250}
              />
            </div>
          </div>

          {/* Third Row of Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Ocupación por Mes */}
            <div className="bg-white rounded-lg shadow p-6">
              <LineChart 
                data={generateOccupancyData(chartData)}
                title="Ocupación por Mes (Últimos 6 meses)"
                height={300}
              />
            </div>

            {/* Servicios Más Populares */}
            <div className="bg-white rounded-lg shadow p-6">
              <BarChart 
                data={generateServicesData(chartData)}
                title="Servicios Más Populares"
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Recent Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Recent Patients */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Pacientes Recientes</h3>
                <Link href="/admin/patients" className="text-sm text-blue-600 hover:text-blue-800">Ver todos</Link>
              </div>
            </div>
            <div className="p-6">
              {recentPatients.length > 0 ? (
                <div className="space-y-4">
                  {recentPatients.map((patient) => (
                    <div key={patient.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{patient.full_name}</p>
                        <p className="text-sm text-gray-600">Habitación {patient.room_number} • {patient.age} años</p>
                      </div>
                      <div className="flex space-x-2">
                        <Link href={`/admin/patients`} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay pacientes registrados</p>
              )}
            </div>
          </div>

          {/* Recent Contacts */}
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Contactos Recientes</h3>
                <Link href="/admin/contacts" className="text-sm text-blue-600 hover:text-blue-800">Ver todos</Link>
              </div>
            </div>
            <div className="p-6">
              {recentContacts.length > 0 ? (
                <div className="space-y-4">
                  {recentContacts.map((contact) => (
                    <div key={contact.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{contact.family_name}</p>
                        <p className="text-sm text-gray-600">{contact.phone} • {contact.resident_name}</p>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        contact.status === 'Nuevo' ? 'bg-blue-100 text-blue-800' :
                        contact.status === 'Contactado' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {contact.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No hay contactos recientes</p>
              )}
            </div>
          </div>
        </div>

        {/* Top Services */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Servicios Principales</h3>
              <Link href="/admin/services" className="text-sm text-blue-600 hover:text-blue-800">Ver todos</Link>
            </div>
          </div>
          <div className="p-6">
            {topServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {topServices.map((service) => (
                  <div key={service.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{service.name}</h4>
                      <span className="text-sm font-medium text-green-600">${service.price}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <span className={`w-2 h-2 rounded-full mr-2 ${service.is_active ? 'bg-green-400' : 'bg-red-400'}`}></span>
                      {service.is_active ? 'Activo' : 'Inactivo'}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No hay servicios disponibles</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Link href="/admin/patients" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-colors group">
              <Plus className="w-6 h-6 text-gray-400 group-hover:text-blue-600 mr-2 transition-colors" />
              <span className="text-gray-600 group-hover:text-blue-800 transition-colors">Nuevo Paciente</span>
            </Link>
            <Link href="/admin/enrollments" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-400 hover:bg-green-50 transition-colors group">
              <FileText className="w-6 h-6 text-gray-400 group-hover:text-green-600 mr-2 transition-colors" />
              <span className="text-gray-600 group-hover:text-green-800 transition-colors">Nueva Matrícula</span>
            </Link>
            <Link href="/admin/contacts" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group">
              <MessageSquare className="w-6 h-6 text-gray-400 group-hover:text-purple-600 mr-2 transition-colors" />
              <span className="text-gray-600 group-hover:text-purple-800 transition-colors">Ver Contactos</span>
            </Link>
            <Link href="/admin/services" className="flex items-center justify-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-orange-400 hover:bg-orange-50 transition-colors group">
              <Calendar className="w-6 h-6 text-gray-400 group-hover:text-orange-600 mr-2 transition-colors" />
              <span className="text-gray-600 group-hover:text-orange-800 transition-colors">Gestionar Servicios</span>
            </Link>
          </div>
          
          {/* Additional Quick Actions */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Acciones Adicionales</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Link href="/admin/patients" className="flex items-center p-3 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                <Users className="w-4 h-4 mr-2" />
                Lista de Pacientes
              </Link>
              <Link href="/admin/enrollments" className="flex items-center p-3 text-sm text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                <FileText className="w-4 h-4 mr-2" />
                Ver Matrículas
              </Link>
              <Link href="/admin/contacts" className="flex items-center p-3 text-sm text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                <MessageSquare className="w-4 h-4 mr-2" />
                Contactos Pendientes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
