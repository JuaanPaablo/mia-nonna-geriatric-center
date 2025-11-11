'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [loading, setLoading] = useState(true)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
    
    // Escuchar cambios en la autenticación
    if (!supabase) {
      console.warn('Supabase client not initialized')
      setLoading(false)
      router.push('/login')
      return
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session) {
          setAuthenticated(true)
          setLoading(false)
        } else if (event === 'SIGNED_OUT') {
          setAuthenticated(false)
          setLoading(false)
          router.push('/login')
        }
      }
    )

    return () => {
      subscription?.unsubscribe()
    }
  }, [router])

  const checkAuth = async () => {
    try {
      if (!supabase) {
        console.warn('Supabase client not initialized')
        router.push('/login')
        setLoading(false)
        return
      }

      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Auth check error:', error)
        router.push('/login')
        return
      }
      
      if (data?.session) {
        setAuthenticated(true)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  if (!authenticated) {
    return null
  }

  return <>{children}</>
}
