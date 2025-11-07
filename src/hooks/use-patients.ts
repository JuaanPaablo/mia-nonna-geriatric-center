'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import type { Patient, PatientInsert, PatientUpdate } from '@/types/database'
import type { SearchFiltersData } from '@/lib/validations'

interface UsePatientsReturn {
  patients: Patient[]
  loading: boolean
  error: string | null
  totalCount: number
  createPatient: (data: PatientInsert) => Promise<Patient>
  updatePatient: (id: string, data: PatientUpdate) => Promise<Patient>
  deletePatient: (id: string) => Promise<void>
  getPatient: (id: string) => Promise<Patient | null>
  refetch: () => Promise<void>
  clearError: () => void
}

export function usePatients(filters?: SearchFiltersData): UsePatientsReturn {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalCount, setTotalCount] = useState(0)

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('patients')
        .select('*', { count: 'exact' })

      // Apply filters
      if (filters?.query) {
        query = query.or(`full_name.ilike.%${filters.query}%,medical_conditions.cs.{${filters.query}}`)
      }

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }

      if (filters?.dateFrom) {
        query = query.gte('admission_date', filters.dateFrom)
      }

      if (filters?.dateTo) {
        query = query.lte('admission_date', filters.dateTo)
      }

      // Pagination
      const page = filters?.page || 1
      const limit = filters?.limit || 10
      const from = (page - 1) * limit
      const to = from + limit - 1

      query = query.range(from, to)

      // Sorting
      query = query.order('created_at', { ascending: false })

      const { data, error: fetchError, count } = await query

      if (fetchError) throw fetchError

      setPatients(data || [])
      setTotalCount(count || 0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener pacientes'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [filters])

  const createPatient = useCallback(async (data: PatientInsert): Promise<Patient> => {
    try {
      setError(null)

      const { data: newPatient, error: createError } = await supabase
        .from('patients')
        .insert(data)
        .select()
        .single()

      if (createError) throw createError

      // Update local state
      setPatients(prev => [newPatient, ...prev])
      setTotalCount(prev => prev + 1)

      return newPatient
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear paciente'
      setError(message)
      throw err
    }
  }, [])

  const updatePatient = useCallback(async (id: string, data: PatientUpdate): Promise<Patient> => {
    try {
      setError(null)

      const { data: updatedPatient, error: updateError } = await supabase
        .from('patients')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (updateError) throw updateError

      // Update local state
      setPatients(prev =>
        prev.map(patient =>
          patient.id === id ? updatedPatient : patient
        )
      )

      return updatedPatient
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al actualizar paciente'
      setError(message)
      throw err
    }
  }, [])

  const deletePatient = useCallback(async (id: string): Promise<void> => {
    try {
      setError(null)

      const { error: deleteError } = await supabase
        .from('patients')
        .delete()
        .eq('id', id)

      if (deleteError) throw deleteError

      // Update local state
      setPatients(prev => prev.filter(patient => patient.id !== id))
      setTotalCount(prev => prev - 1)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al eliminar paciente'
      setError(message)
      throw err
    }
  }, [])

  const getPatient = useCallback(async (id: string): Promise<Patient | null> => {
    try {
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      return data
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener paciente'
      setError(message)
      return null
    }
  }, [])

  const refetch = useCallback(() => fetchPatients(), [fetchPatients])

  useEffect(() => {
    fetchPatients()
  }, [fetchPatients])

  return {
    patients,
    loading,
    error,
    totalCount,
    createPatient,
    updatePatient,
    deletePatient,
    getPatient,
    refetch,
    clearError,
  }
}

// Hook for single patient
export function usePatient(id: string) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPatient = useCallback(async () => {
    if (!id) return

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase
        .from('patients')
        .select('*')
        .eq('id', id)
        .single()

      if (fetchError) throw fetchError

      setPatient(data)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener paciente'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchPatient()
  }, [fetchPatient])

  return {
    patient,
    loading,
    error,
    refetch: fetchPatient,
  }
}

// Hook for patient statistics
export function usePatientsStats() {
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    discharged: 0,
    averageAge: 0,
    newThisMonth: 0,
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      // Get all patients
      const { data: allPatients, error: patientsError } = await supabase
        .from('patients')
        .select('status, date_of_birth, created_at')

      if (patientsError) throw patientsError

      if (!allPatients) {
        setStats({
          total: 0,
          active: 0,
          inactive: 0,
          discharged: 0,
          averageAge: 0,
          newThisMonth: 0,
        })
        return
      }

      // Calculate statistics
      const total = allPatients.length
      const active = allPatients.filter(p => p.status === 'active').length
      const inactive = allPatients.filter(p => p.status === 'inactive').length
      const discharged = allPatients.filter(p => p.status === 'discharged').length

      // Calculate average age
      const today = new Date()
      const ages = allPatients.map(p => {
        const birthDate = new Date(p.date_of_birth)
        return today.getFullYear() - birthDate.getFullYear()
      })
      const averageAge = ages.length > 0 ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length) : 0

      // Calculate new patients this month
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1)
      const newThisMonth = allPatients.filter(p => 
        new Date(p.created_at) >= startOfMonth
      ).length

      setStats({
        total,
        active,
        inactive,
        discharged,
        averageAge,
        newThisMonth,
      })
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al obtener estadísticas'
      setError(message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats,
  }
}
