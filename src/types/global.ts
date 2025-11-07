// Navigation and UI Types
export interface NavItem {
  title: string
  href: string
  disabled?: boolean
  external?: boolean
  icon?: string
  description?: string
}

export interface MainNavItem extends NavItem {}

export interface SidebarNavItem extends NavItem {
  items?: SidebarNavItem[]
}

// Form and API Types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
}

// Emergency Contact Type
export interface EmergencyContact {
  name: string
  relationship: string
  phone: string
  email?: string
  address?: string
  is_primary: boolean
}

// Medication Type
export interface Medication {
  name: string
  dosage: string
  frequency: string
  prescribing_doctor: string
  start_date: string
  end_date?: string
  instructions?: string
}

// Dashboard Statistics Types
export interface DashboardStats {
  totalPatients: number
  activePatients: number
  newEnrollments: number
  pendingContacts: number
  monthlyRevenue: number
  occupancyRate: number
}

// Chart Data Types
export interface ChartData {
  label: string
  value: number
  color?: string
}

// Healthcare-specific Types
export type CareType = 'full_time' | 'day_care' | 'respite'
export type PatientStatus = 'active' | 'inactive' | 'discharged'
export type ContactStatus = 'new' | 'contacted' | 'converted'
export type EnrollmentStatus = 'pending' | 'approved' | 'rejected'
export type UserRole = 'admin' | 'staff'
export type Gender = 'male' | 'female' | 'other'

// Service Category Types
export type ServiceCategory = 
  | 'medical'
  | 'therapy'
  | 'social'
  | 'recreational'
  | 'spiritual'
  | 'dietary'

// Form Field Types
export interface FormField {
  name: string
  label: string
  type: 'text' | 'email' | 'tel' | 'number' | 'date' | 'select' | 'textarea' | 'checkbox'
  placeholder?: string
  required?: boolean
  options?: { label: string; value: string }[]
  validation?: any
}

// File Upload Types
export interface FileUpload {
  file: File
  preview: string
  progress: number
  error?: string
}

// Search and Filter Types
export interface SearchFilters {
  query?: string
  status?: string
  category?: string
  dateFrom?: string
  dateTo?: string
  page?: number
  limit?: number
}

// Loading and Error States
export interface LoadingState {
  isLoading: boolean
  error?: string
  retryFn?: () => void
}

// Toast Notification Types
export interface ToastNotification {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  description?: string
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

// Theme Types
export interface ThemeColors {
  primary: string
  secondary: string
  accent: string
  background: string
  foreground: string
  muted: string
  border: string
}

// Modal and Dialog Types
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  size?: 'sm' | 'md' | 'lg' | 'xl'
  children: React.ReactNode
}

// Table Column Type
export interface TableColumn<T = any> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
  className?: string
}

// Analytics Types
export interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp?: Date
}

// Permission Types
export interface Permission {
  resource: string
  action: 'create' | 'read' | 'update' | 'delete'
  conditions?: Record<string, any>
}

// Feature Flag Types
export interface FeatureFlag {
  name: string
  enabled: boolean
  description?: string
  rolloutPercentage?: number
}
