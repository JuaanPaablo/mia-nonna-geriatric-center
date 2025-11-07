import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Date utilities
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  
  return dateObj.toLocaleDateString('es-ES', { ...defaultOptions, ...options })
}

export function formatTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleTimeString('es-ES', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatDateTime(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return `${formatDate(dateObj)} a las ${formatTime(dateObj)}`
}

export function getAge(birthDate: Date | string): number {
  const birth = typeof birthDate === 'string' ? new Date(birthDate) : birthDate
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  
  return age
}

export function isValidDate(date: any): boolean {
  return date instanceof Date && !isNaN(date.getTime())
}

// String utilities
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export function generateId(prefix?: string): string {
  const id = Math.random().toString(36).substr(2, 9)
  return prefix ? `${prefix}-${id}` : id
}

// Number utilities
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount)
}

export function formatNumber(num: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('es-ES', options).format(num)
}

export function parsePhoneNumber(phone: string): string {
  // Remove all non-numeric characters
  const cleanPhone = phone.replace(/\D/g, '')
  
  // Format Spanish phone numbers
  if (cleanPhone.length === 9) {
    return cleanPhone.replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')
  }
  
  // International format
  if (cleanPhone.length > 9) {
    return `+${cleanPhone.slice(0, -9)} ${cleanPhone.slice(-9).replace(/(\d{3})(\d{3})(\d{3})/, '$1 $2 $3')}`
  }
  
  return phone
}

// Validation utilities
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^(\+34|0034|34)?[6-9]\d{8}$/
  const cleanPhone = phone.replace(/\s/g, '')
  return phoneRegex.test(cleanPhone)
}

export function isValidDNI(dni: string): boolean {
  const dniRegex = /^\d{8}[A-Z]$/
  if (!dniRegex.test(dni)) return false
  
  const letters = 'TRWAGMYFPDXBNJZSQVHLCKE'
  const numbers = dni.slice(0, 8)
  const letter = dni.charAt(8)
  
  return letters.charAt(parseInt(numbers) % 23) === letter
}

// Array utilities
export function groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const group = String(item[key])
    groups[group] = groups[group] || []
    groups[group].push(item)
    return groups
  }, {} as Record<string, T[]>)
}

export function sortBy<T>(array: T[], key: keyof T, direction: 'asc' | 'desc' = 'asc'): T[] {
  return array.sort((a, b) => {
    const aVal = a[key]
    const bVal = b[key]
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
}

export function filterByQuery<T>(array: T[], query: string, fields: (keyof T)[]): T[] {
  if (!query.trim()) return array
  
  const lowercaseQuery = query.toLowerCase()
  
  return array.filter(item =>
    fields.some(field => {
      const value = item[field]
      if (typeof value === 'string') {
        return value.toLowerCase().includes(lowercaseQuery)
      }
      return false
    })
  )
}

// Local storage utilities
export function getFromStorage<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue
  
  try {
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue
  } catch {
    return defaultValue
  }
}

export function setToStorage<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    console.error('Error saving to localStorage')
  }
}

export function removeFromStorage(key: string): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(key)
}

// Error handling utilities
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  if (typeof error === 'string') return error
  return 'Ha ocurrido un error inesperado'
}

export function handleAsyncError<T>(
  promise: Promise<T>,
  fallbackValue?: T
): Promise<[T | undefined, Error | undefined]> {
  return promise
    .then<[T, undefined]>((data: T) => [data, undefined])
    .catch<[T | undefined, Error]>((error: Error) => [fallbackValue, error])
}

// WhatsApp integration
export function generateWhatsAppUrl(phone: string, message?: string): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const encodedMessage = message ? encodeURIComponent(message) : ''
  
  return `https://wa.me/${cleanPhone}${encodedMessage ? `?text=${encodedMessage}` : ''}`
}

// File utilities
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function getFileExtension(filename: string): string {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2)
}

// Debug utilities
export function debugLog(message: string, data?: any): void {
  if (process.env.NODE_ENV === 'development') {
    console.log(`[DEBUG] ${message}`, data || '')
  }
}

export function createDelay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
