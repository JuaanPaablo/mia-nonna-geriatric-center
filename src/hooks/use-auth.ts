'use client'

import React, { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { User } from '@supabase/supabase-js'
import { supabase, getUser, signOut, signInWithEmail, signUpWithEmail } from '@/lib/supabase'
import type { LoginFormData, RegisterFormData } from '@/lib/validations'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  signIn: (data: LoginFormData) => Promise<void>
  signUp: (data: RegisterFormData) => Promise<void>
  logout: () => Promise<void>
  clearError: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const signIn = useCallback(async (data: LoginFormData) => {
    try {
      setLoading(true)
      setError(null)
      
      const { user: authUser } = await signInWithEmail(data.email, data.password)
      
      if (authUser) {
        setUser(authUser)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al iniciar sesión'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const signUp = useCallback(async (data: RegisterFormData) => {
    try {
      setLoading(true)
      setError(null)
      
      const { user: authUser } = await signUpWithEmail(
        data.email,
        data.password,
        {
          full_name: data.fullName,
          role: data.role,
        }
      )
      
      if (authUser) {
        setUser(authUser)
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear la cuenta'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      await signOut()
      setUser(null)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al cerrar sesión'
      setError(message)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    let mounted = true

    async function getInitialSession() {
      try {
        const currentUser = await getUser()
        if (mounted) {
          setUser(currentUser)
        }
      } catch (error) {
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    getInitialSession()

    if (!supabase) {
      setLoading(false)
      return
    }

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (mounted) {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      subscription?.unsubscribe()
    }
  }, [])

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    logout,
    clearError,
  }

  return React.createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Hook for checking user permissions
export function usePermissions() {
  const { user } = useAuth()

  const hasPermission = useCallback((permission: string) => {
    if (!user) return false
    
    // Check user metadata for role
    const userRole = user.user_metadata?.role || 'staff'
    
    // Admin has all permissions
    if (userRole === 'admin') return true
    
    // Staff has limited permissions
    const staffPermissions = [
      'patients:read',
      'patients:update',
      'enrollments:read',
      'enrollments:create',
      'contacts:read',
      'contacts:update',
    ]
    
    return staffPermissions.includes(permission)
  }, [user])

  const isAdmin = useCallback(() => {
    return user?.user_metadata?.role === 'admin'
  }, [user])

  const isStaff = useCallback(() => {
    return user?.user_metadata?.role === 'staff'
  }, [user])

  return {
    hasPermission,
    isAdmin,
    isStaff,
  }
}

// Hook for requiring authentication
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login page
      window.location.href = '/login'
    }
  }, [user, loading])

  return { user, loading }
}
