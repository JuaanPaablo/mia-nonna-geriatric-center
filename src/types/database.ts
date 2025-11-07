export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

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
        Relationships: []
      }
      patients: {
        Row: {
          id: string
          full_name: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          medical_conditions: string[]
          emergency_contact: Json
          admission_date: string
          status: 'active' | 'inactive' | 'discharged'
          room_number?: string
          care_plan?: string
          allergies?: string[]
          medications?: Json[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          full_name: string
          date_of_birth: string
          gender: 'male' | 'female' | 'other'
          medical_conditions?: string[]
          emergency_contact: Json
          admission_date: string
          status?: 'active' | 'inactive' | 'discharged'
          room_number?: string
          care_plan?: string
          allergies?: string[]
          medications?: Json[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          date_of_birth?: string
          gender?: 'male' | 'female' | 'other'
          medical_conditions?: string[]
          emergency_contact?: Json
          admission_date?: string
          status?: 'active' | 'inactive' | 'discharged'
          room_number?: string
          care_plan?: string
          allergies?: string[]
          medications?: Json[]
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      enrollments: {
        Row: {
          id: string
          patient_id: string
          enrollment_date: string
          care_type: 'full_time' | 'day_care' | 'respite'
          monthly_fee: number
          status: 'pending' | 'approved' | 'rejected'
          notes?: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          enrollment_date: string
          care_type: 'full_time' | 'day_care' | 'respite'
          monthly_fee: number
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          enrollment_date?: string
          care_type?: 'full_time' | 'day_care' | 'respite'
          monthly_fee?: number
          status?: 'pending' | 'approved' | 'rejected'
          notes?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patients"
            referencedColumns: ["id"]
          }
        ]
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
          status: 'new' | 'contacted' | 'converted'
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
          status?: 'new' | 'contacted' | 'converted'
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
          status?: 'new' | 'contacted' | 'converted'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          id: string
          name: string
          description: string
          icon: string
          featured: boolean
          price?: number
          duration?: string
          category: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          icon: string
          featured?: boolean
          price?: number
          duration?: string
          category: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          icon?: string
          featured?: boolean
          price?: number
          duration?: string
          category?: string
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof (Database["public"]["Tables"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"])[TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof (Database["public"]["Tables"])
  ? (Database["public"]["Tables"])[PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof (Database["public"]["Enums"])
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicEnumNameOrOptions["schema"]]["Enums"])
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicEnumNameOrOptions["schema"]]["Enums"])[EnumName]
  : PublicEnumNameOrOptions extends keyof (Database["public"]["Enums"])
  ? (Database["public"]["Enums"])[PublicEnumNameOrOptions]
  : never

// Helper types for better DX
export type User = Tables<'users'>
export type Patient = Tables<'patients'>
export type Enrollment = Tables<'enrollments'>
export type ContactForm = Tables<'contact_forms'>
export type Service = Tables<'services'>

export type UserInsert = TablesInsert<'users'>
export type PatientInsert = TablesInsert<'patients'>
export type EnrollmentInsert = TablesInsert<'enrollments'>
export type ContactFormInsert = TablesInsert<'contact_forms'>
export type ServiceInsert = TablesInsert<'services'>

export type UserUpdate = TablesUpdate<'users'>
export type PatientUpdate = TablesUpdate<'patients'>
export type EnrollmentUpdate = TablesUpdate<'enrollments'>
export type ContactFormUpdate = TablesUpdate<'contact_forms'>
export type ServiceUpdate = TablesUpdate<'services'>
