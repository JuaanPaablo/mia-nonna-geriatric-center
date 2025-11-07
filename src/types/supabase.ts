export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'staff'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'admin' | 'staff'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'staff'
          created_at?: string
          updated_at?: string
        }
      }
      patients: {
        Row: {
          id: string
          full_name: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          emergency_contact: {
            name: string
            relationship: string
            phone: string
            email?: string
          }
          medical_conditions: string[]
          medications: string[]
          admission_date: string
          status: 'active' | 'discharged' | 'pending'
          room_number?: string
          care_level: 'basic' | 'intermediate' | 'advanced'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          emergency_contact: {
            name: string
            relationship: string
            phone: string
            email?: string
          }
          medical_conditions?: string[]
          medications?: string[]
          admission_date?: string
          status?: 'active' | 'discharged' | 'pending'
          room_number?: string
          care_level?: 'basic' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          emergency_contact?: {
            name: string
            relationship: string
            phone: string
            email?: string
          }
          medical_conditions?: string[]
          medications?: string[]
          admission_date?: string
          status?: 'active' | 'discharged' | 'pending'
          room_number?: string
          care_level?: 'basic' | 'intermediate' | 'advanced'
          created_at?: string
          updated_at?: string
        }
      }
      contact_forms: {
        Row: {
          id: string
          family_name: string
          phone: string
          email: string
          resident_name: string
          resident_age: number
          care_type: string
          message: string
          status: 'new' | 'contacted' | 'converted' | 'closed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          family_name: string
          phone: string
          email: string
          resident_name: string
          resident_age: number
          care_type: string
          message: string
          status?: 'new' | 'contacted' | 'converted' | 'closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          family_name?: string
          phone?: string
          email?: string
          resident_name?: string
          resident_age?: number
          care_type?: string
          message?: string
          status?: 'new' | 'contacted' | 'converted' | 'closed'
          created_at?: string
          updated_at?: string
        }
      }
      enrollments: {
        Row: {
          id: string
          patient_id: string
          enrollment_date: string
          enrollment_type: 'full_time' | 'day_care' | 'respite'
          start_date: string
          end_date?: string
          status: 'pending' | 'active' | 'completed' | 'cancelled'
          payment_status: 'pending' | 'paid' | 'overdue'
          monthly_fee: number
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          enrollment_date?: string
          enrollment_type: 'full_time' | 'day_care' | 'respite'
          start_date: string
          end_date?: string
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'overdue'
          monthly_fee: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          enrollment_date?: string
          enrollment_type?: 'full_time' | 'day_care' | 'respite'
          start_date?: string
          end_date?: string
          status?: 'pending' | 'active' | 'completed' | 'cancelled'
          payment_status?: 'pending' | 'paid' | 'overdue'
          monthly_fee?: number
          notes?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
