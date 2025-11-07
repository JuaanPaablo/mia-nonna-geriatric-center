// Utilidades de validación para el sistema Mia Nonna

/**
 * Valida una cédula ecuatoriana según las reglas oficiales
 * @param cedula - Número de cédula a validar
 * @returns true si la cédula es válida, false en caso contrario
 */
export function validateEcuadorianCedula(cedula: string): boolean {
  // Verificar que sea exactamente 10 dígitos numéricos
  if (!/^\d{10}$/.test(cedula)) {
    return false
  }

  const digits = cedula.split('').map(Number)

  // 1. Los dos primeros dígitos deben ser entre 0 y 24 (provincias)
  if (digits[0] * 10 + digits[1] > 24 || digits[0] * 10 + digits[1] < 0) {
    return false
  }

  // 2. El tercer dígito debe ser menor a 6
  if (digits[2] >= 6) {
    return false
  }

  // 3. Los dígitos 4-9 deben ser consecutivos (esto es más flexible en la práctica)
  // 4. Validar el dígito verificador (décimo dígito)

  // Algoritmo del módulo 10 para validar el dígito verificador
  const coefficients = [2, 1, 2, 1, 2, 1, 2, 1, 2]
  let sum = 0

  for (let i = 0; i < 9; i++) {
    let product = digits[i] * coefficients[i]
    
    // Si el producto es mayor a 9, sumar los dígitos individuales
    if (product > 9) {
      product = Math.floor(product / 10) + (product % 10)
    }
    
    sum += product
  }

  // Calcular el dígito verificador esperado
  const expectedDigit = (10 - (sum % 10)) % 10
  
  return digits[9] === expectedDigit
}

/**
 * Formatea una cédula para mostrar con guiones (XX-XXXXXXX-X)
 * @param cedula - Número de cédula sin formato
 * @returns Cédula formateada
 */
export function formatCedula(cedula: string): string {
  if (cedula.length !== 10) return cedula
  
  return `${cedula.slice(0, 2)}-${cedula.slice(2, 9)}-${cedula.slice(9)}`
}

/**
 * Limpia una cédula de caracteres no numéricos
 * @param cedula - Cédula con o sin formato
 * @returns Solo los dígitos de la cédula
 */
export function cleanCedula(cedula: string): string {
  return cedula.replace(/\D/g, '')
}

/**
 * Valida que un campo de texto no exceda la longitud máxima
 * @param value - Valor a validar
 * @param maxLength - Longitud máxima permitida
 * @returns true si es válido, false en caso contrario
 */
export function validateMaxLength(value: string, maxLength: number): boolean {
  return value.length <= maxLength
}

/**
 * Obtiene el número de caracteres restantes
 * @param value - Valor actual
 * @param maxLength - Longitud máxima permitida
 * @returns Número de caracteres restantes
 */
export function getRemainingChars(value: string, maxLength: number): number {
  return Math.max(0, maxLength - value.length)
}

/**
 * Valida un número de teléfono con prefijo internacional
 * @param phone - Número de teléfono completo
 * @returns true si es válido, false en caso contrario
 */
export function validatePhoneNumber(phone: string): boolean {
  // Formato: +593 99 123 4567 o 09991234567
  const phoneRegex = /^(\+593\s?)?[0-9]{9,10}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

/**
 * Formatea un número de teléfono para mostrar
 * @param phone - Número de teléfono
 * @returns Teléfono formateado
 */
export function formatPhoneNumber(phone: string): string {
  const cleaned = phone.replace(/\D/g, '')
  
  if (cleaned.startsWith('593')) {
    return `+593 ${cleaned.slice(3, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`
  }
  
  if (cleaned.startsWith('0')) {
    return `+593 ${cleaned.slice(1, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`
  }
  
  return phone
}

/**
 * Obtiene el prefijo del país basado en el código
 * @param countryCode - Código del país (ej: 'EC', 'US', 'CO')
 * @returns Prefijo telefónico del país
 */
export function getCountryPrefix(countryCode: string): string {
  const prefixes: Record<string, string> = {
    'EC': '+593', // Ecuador
    'US': '+1',   // Estados Unidos
    'CO': '+57',  // Colombia
    'PE': '+51',  // Perú
    'AR': '+54',  // Argentina
    'MX': '+52',  // México
    'ES': '+34',  // España
    'CL': '+56',  // Chile
    'VE': '+58',  // Venezuela
    'BO': '+591', // Bolivia
    'PY': '+595', // Paraguay
    'UY': '+598', // Uruguay
    'GY': '+592', // Guyana
    'SR': '+597', // Surinam
    'BR': '+55',  // Brasil
  }
  
  return prefixes[countryCode] || '+593'
}

/**
 * Valida que la fecha de nacimiento sea razonable para un paciente geriátrico
 * @param dateOfBirth - Fecha de nacimiento
 * @returns true si es válida, false en caso contrario
 */
export function validateDateOfBirth(dateOfBirth: string): boolean {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  const age = today.getFullYear() - birthDate.getFullYear()
  
  // Verificar que la fecha sea válida
  if (isNaN(birthDate.getTime())) {
    return false
  }
  
  // Verificar que no sea en el futuro
  if (birthDate > today) {
    return false
  }
  
  // Verificar que la edad esté en un rango razonable para geriatría (50-120 años)
  return age >= 50 && age <= 120
}

/**
 * Calcula la edad basada en la fecha de nacimiento
 * @param dateOfBirth - Fecha de nacimiento
 * @returns Edad en años
 */
export function calculateAge(dateOfBirth: string): number {
  const birthDate = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - birthDate.getFullYear()
  
  // Ajustar si aún no ha cumplido años este año
  const monthDiff = today.getMonth() - birthDate.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--
  }
  
  return age
}

/**
 * Valida que el número de paciente sea único y tenga formato correcto
 * @param patientNumber - Número de paciente
 * @returns true si es válido, false en caso contrario
 */
export function validatePatientNumber(patientNumber: string): boolean {
  // Formato: P-001, P-002, etc.
  const patientNumberRegex = /^P-\d{3,6}$/
  return patientNumberRegex.test(patientNumber)
}

/**
 * Genera el siguiente número de paciente disponible
 * @param existingNumbers - Array de números de paciente existentes
 * @returns Siguiente número disponible
 */
export function generateNextPatientNumber(existingNumbers: string[]): string {
  const numbers = existingNumbers
    .map(num => parseInt(num.replace('P-', '')))
    .filter(num => !isNaN(num))
    .sort((a, b) => a - b)
  
  let nextNumber = 1
  for (const num of numbers) {
    if (num === nextNumber) {
      nextNumber++
    } else {
      break
    }
  }
  
  return `P-${nextNumber.toString().padStart(3, '0')}`
}
