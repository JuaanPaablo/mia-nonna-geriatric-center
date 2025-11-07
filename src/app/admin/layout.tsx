'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, Users, FileText, MessageSquare, Settings, LogOut } from 'lucide-react'
import AuthGuard from '@/components/auth/AuthGuard'
import GlobalSearch from '@/components/search/GlobalSearch'
import DataCleaner from '@/components/admin/DataCleaner'
import { supabase } from '@/lib/supabase'

export default function AdminLayout({
  children
}: {
  children: React.ReactNode
}) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await supabase?.auth.signOut()
      router.push('/login')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  const handleDataCleared = () => {
    // Recargar la página para actualizar todos los datos
    window.location.reload()
  }

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gray-50">
        {/* Sidebar */}
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg">
          <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-blue-600">Mia Nonna</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              <Link href="/admin" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Home className="w-5 h-5 mr-3" />
                Dashboard
              </Link>
              <Link href="/admin/patients" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Users className="w-5 h-5 mr-3" />
                Pacientes
              </Link>
              <Link href="/admin/enrollments" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <FileText className="w-5 h-5 mr-3" />
                Matrículas
              </Link>
              <Link href="/admin/contacts" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <MessageSquare className="w-5 h-5 mr-3" />
                Contactos
              </Link>
              <Link href="/admin/services" className="flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <Settings className="w-5 h-5 mr-3" />
                Servicios
              </Link>
            </nav>

            {/* User Info & Logout */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center px-4 py-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-sm font-medium text-blue-600">A</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Administrador</p>
                  <p className="text-xs text-gray-500">admin@mianonna.com</p>
                </div>
              </div>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Salir
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="ml-64">
          {/* Header con búsqueda global */}
          <div className="bg-white shadow-sm border-b sticky top-0 z-40">
            <div className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold text-gray-900">Panel de Administración</h2>
              </div>
              <div className="flex items-center space-x-4">
                <GlobalSearch />
                <div className="w-px h-6 bg-gray-300"></div>
                <DataCleaner onDataCleared={handleDataCleared} />
                <div className="w-px h-6 bg-gray-300"></div>
                <Link 
                  href="/admin/patients" 
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                >
                  Nuevo Paciente
                </Link>
              </div>
            </div>
          </div>

          {/* Contenido de la página */}
          {children}
        </div>
      </div>
    </AuthGuard>
  )
}
