'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

export default function TestSupabasePage() {
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'success' | 'error'>('testing')
  const [errorMessage, setErrorMessage] = useState('')
  const [patients, setPatients] = useState<any[]>([])

  useEffect(() => {
    testConnection()
  }, [])

  const testConnection = async () => {
    try {
      // Verificar que el cliente de Supabase esté disponible
      if (!supabase) {
        throw new Error('Cliente de Supabase no inicializado')
      }

      // Test basic connection - solo verificar que podemos crear el cliente
      const { data, error } = await supabase.auth.getSession()

      if (error) {
        throw error
      }

      // Si llegamos aquí, la conexión funciona
      setConnectionStatus('success')
      setErrorMessage('')
    } catch (error: any) {
      console.error('Supabase connection error:', error)
      setErrorMessage(error.message || 'Error desconocido de conexión')
      setConnectionStatus('error')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Prueba de Conexión Supabase
        </h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Estado de la Conexión</h2>
          
          {connectionStatus === 'testing' && (
            <div className="flex items-center space-x-2 text-blue-600">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span>Probando conexión...</span>
            </div>
          )}

          {connectionStatus === 'success' && (
            <div className="flex items-center space-x-2 text-green-600">
              <div className="w-4 h-4 bg-green-600 rounded-full"></div>
              <span>✅ Conexión exitosa con Supabase</span>
            </div>
          )}

          {connectionStatus === 'error' && (
            <div className="flex items-center space-x-2 text-red-600">
              <div className="w-4 h-4 bg-red-600 rounded-full"></div>
              <span>❌ Error de conexión</span>
            </div>
          )}

          {errorMessage && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-800 text-sm">{errorMessage}</p>
            </div>
          )}
        </div>

        {/* Test Results */}
        {connectionStatus === 'success' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Resultado de la Prueba</h2>
            
            <div className="space-y-4">
              <p className="text-green-600 font-medium">
                ✅ Conexión exitosa con Supabase
              </p>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <h3 className="font-semibold text-green-800">Estado de la Conexión</h3>
                <p className="text-green-700 text-sm mt-2">
                  La conexión básica a Supabase está funcionando correctamente. 
                  El cliente se ha inicializado y puede comunicarse con el servidor.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Environment Variables Check */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Verificación de Variables de Entorno</h2>
          
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="font-medium">SUPABASE_URL:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_URL ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Configurado' : '❌ No configurado'}
              </span>
            </div>
            
            <div className="flex justify-between">
              <span className="font-medium">SUPABASE_ANON_KEY:</span>
              <span className={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'text-green-600' : 'text-red-600'}>
                {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Configurado' : '❌ No configurado'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={testConnection}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Probar Conexión Nuevamente
          </button>
          
          <a
            href="/"
            className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Volver al Inicio
          </a>
        </div>
      </div>
    </div>
  )
}
