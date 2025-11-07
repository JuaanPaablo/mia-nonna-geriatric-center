'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Eye, EyeOff, Lock, Mail, AlertCircle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Verificar si ya hay una sesión activa
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase?.auth.getSession() || {}
      if (session) {
        router.push('/admin')
      }
    } catch (error) {
      console.error('Error checking session:', error)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await supabase?.auth.signInWithPassword({
        email,
        password
      }) || {}

      if (error) {
        throw error
      }

      if (data?.user) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...')
        setTimeout(() => {
          router.push('/admin')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Login error:', error)
      
      if (error.message.includes('Invalid login credentials')) {
        setError('Credenciales inválidas. Verifica tu email y contraseña.')
      } else if (error.message.includes('Email not confirmed')) {
        setError('Por favor confirma tu email antes de iniciar sesión.')
      } else {
        setError('Error al iniciar sesión. Intenta nuevamente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async () => {
    setEmail('admin@mianonna.com')
    setPassword('admin123')
    
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const { data, error } = await supabase?.auth.signInWithPassword({
        email: 'admin@mianonna.com',
        password: 'admin123'
      }) || {}

      if (error) {
        throw error
      }

      if (data?.user) {
        setSuccess('¡Inicio de sesión exitoso! Redirigiendo...')
        setTimeout(() => {
          router.push('/admin')
        }, 1500)
      }
    } catch (error: any) {
      console.error('Demo login error:', error)
      setError('Error al iniciar sesión con credenciales de demo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo y Título */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-4">
            <span className="text-2xl font-bold text-white">MN</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Mia Nonna</h1>
          <p className="text-gray-600 mt-2">Centro Geriátrico</p>
        </div>

        {/* Formulario de Login */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Iniciar Sesión</h2>
            <p className="text-gray-600 mt-2">Accede al panel de administración</p>
          </div>

          {/* Mensajes de Error/Success */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700 text-sm">{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
              <span className="text-green-700 text-sm">{success}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="admin@mianonna.com"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Botón de Login */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          {/* Botón Demo */}
          <div className="mt-6">
            <button
              onClick={handleDemoLogin}
              disabled={loading}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {loading ? 'Iniciando...' : 'Acceso Demo'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-2">
              Credenciales: admin@mianonna.com / admin123
            </p>
          </div>

          {/* Enlaces adicionales */}
          <div className="mt-6 text-center">
            <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 transition-colors">
              ← Volver al sitio principal
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            © 2024 Mia Nonna. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </div>
  )
}
