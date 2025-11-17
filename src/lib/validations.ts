import { z } from 'zod'

// Auth schemas
export const loginSchema = z.object({
  email: z
    .string()
    .email('Introduce un email válido')
    .min(1, 'El email es obligatorio'),
  password: z
    .string()
    .min(6, 'La contraseña debe tener al menos 6 caracteres')
    .min(1, 'La contraseña es obligatoria'),
})

export const registerSchema = z.object({
  email: z
    .string()
    .email('Introduce un email válido')
    .min(1, 'El email es obligatorio'),
  password: z
    .string()
    .min(8, 'La contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string(),
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  role: z.enum(['admin', 'staff']).default('staff'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Contact form schema
export const contactFormSchema = z.object({
  familyName: z
    .string()
    .min(2, 'El nombre del familiar debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  phone: z
    .string()
    .regex(/^[0-9]{10}$/, 'El teléfono debe tener exactamente 10 números')
    .transform(val => val.replace(/\D/g, '')), // Solo números
  email: z
    .string()
    .email('Introduce un email válido')
    .min(1, 'El email es obligatorio'),
  residentName: z
    .string()
    .min(2, 'El nombre del residente debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  residentAge: z
    .number({ required_error: 'La edad es obligatoria' })
    .int('La edad debe ser un número entero')
    .min(0, 'La edad no puede ser negativa')
    .max(150, 'Introduce una edad válida'),
  careType: z
    .string()
    .min(1, 'Selecciona un tipo de cuidado'),
  message: z
    .string()
    .min(10, 'El mensaje debe tener al menos 10 caracteres')
    .max(1000, 'El mensaje no puede exceder 1000 caracteres'),
})

// Emergency contact schema
export const emergencyContactSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  relationship: z
    .string()
    .min(1, 'Especifica la relación con el residente'),
  phone: z
    .string()
    .regex(/^(\+593|593)?[0-9]{9}$/, 'Introduce un número de teléfono válido (formato: +593 9XX XXX XXX)'),
  email: z
    .string()
    .email('Introduce un email válido')
    .optional()
    .or(z.literal('')),
  address: z
    .string()
    .max(200, 'La dirección no puede exceder 200 caracteres')
    .optional(),
  isPrimary: z.boolean().default(false),
})

// Medication schema
export const medicationSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre del medicamento debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  dosage: z
    .string()
    .min(1, 'Especifica la dosis'),
  frequency: z
    .string()
    .min(1, 'Especifica la frecuencia'),
  prescribingDoctor: z
    .string()
    .min(2, 'El nombre del doctor debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  startDate: z
    .string()
    .datetime('Introduce una fecha válida'),
  endDate: z
    .string()
    .datetime('Introduce una fecha válida')
    .optional()
    .or(z.literal('')),
  instructions: z
    .string()
    .max(500, 'Las instrucciones no pueden exceder 500 caracteres')
    .optional(),
})

// Patient schema
export const patientSchema = z.object({
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  dateOfBirth: z
    .string()
    .min(1, 'La fecha de nacimiento es obligatoria')
    .refine(date => {
      const birthDate = new Date(date)
      const today = new Date()
      const age = today.getFullYear() - birthDate.getFullYear()
      return age >= 0 && age <= 150
    }, 'Introduce una fecha de nacimiento válida'),
  gender: z.enum(['male', 'female', 'other'], {
    required_error: 'Selecciona el género',
  }),
  medicalConditions: z
    .array(z.string())
    .default([])
    .refine(conditions => conditions.every(c => c.length > 0), 'Las condiciones médicas no pueden estar vacías'),
  emergencyContact: emergencyContactSchema,
  admissionDate: z
    .string()
    .min(1, 'La fecha de ingreso es obligatoria'),
  status: z.enum(['active', 'inactive', 'discharged']).default('active'),
  roomNumber: z
    .string()
    .max(10, 'El número de habitación no puede exceder 10 caracteres')
    .optional()
    .or(z.literal('')),
  carePlan: z
    .string()
    .max(1000, 'El plan de cuidado no puede exceder 1000 caracteres')
    .optional(),
  allergies: z
    .array(z.string())
    .default([])
    .refine(allergies => allergies.every(a => a.length > 0), 'Las alergias no pueden estar vacías'),
  medications: z
    .array(medicationSchema)
    .default([]),
})

// Enrollment schema
export const enrollmentSchema = z.object({
  patientId: z
    .string()
    .uuid('Selecciona un paciente válido'),
  enrollmentDate: z
    .string()
    .min(1, 'La fecha de matrícula es obligatoria'),
  careType: z.enum(['full_time', 'day_care', 'respite'], {
    required_error: 'Selecciona el tipo de cuidado',
  }),
  monthlyFee: z
    .number({ required_error: 'La tarifa mensual es obligatoria' })
    .min(0, 'La tarifa no puede ser negativa')
    .max(10000, 'Introduce una tarifa válida'),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
  notes: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional(),
})

// Service schema
export const serviceSchema = z.object({
  name: z
    .string()
    .min(2, 'El nombre del servicio debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  description: z
    .string()
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .max(500, 'La descripción no puede exceder 500 caracteres'),
  icon: z
    .string()
    .min(1, 'Selecciona un icono'),
  featured: z.boolean().default(false),
  price: z
    .number()
    .min(0, 'El precio no puede ser negativo')
    .optional(),
  duration: z
    .string()
    .max(50, 'La duración no puede exceder 50 caracteres')
    .optional(),
  category: z
    .string()
    .min(1, 'Selecciona una categoría'),
})

// User update schema
export const userUpdateSchema = z.object({
  fullName: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z
    .string()
    .email('Introduce un email válido'),
  role: z.enum(['admin', 'staff']),
})

// Password change schema
export const passwordChangeSchema = z.object({
  currentPassword: z
    .string()
    .min(1, 'Introduce tu contraseña actual'),
  newPassword: z
    .string()
    .min(8, 'La nueva contraseña debe tener al menos 8 caracteres')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'La contraseña debe contener al menos una mayúscula, una minúscula y un número'),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
})

// Search filters schema
export const searchFiltersSchema = z.object({
  query: z.string().optional(),
  status: z.string().optional(),
  category: z.string().optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
})

// Export types
export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>
export type ContactFormData = z.infer<typeof contactFormSchema>
export type PatientFormData = z.infer<typeof patientSchema>
export type EnrollmentFormData = z.infer<typeof enrollmentSchema>
export type ServiceFormData = z.infer<typeof serviceSchema>
export type UserUpdateFormData = z.infer<typeof userUpdateSchema>
export type PasswordChangeFormData = z.infer<typeof passwordChangeSchema>
export type SearchFiltersData = z.infer<typeof searchFiltersSchema>
export type EmergencyContactData = z.infer<typeof emergencyContactSchema>
export type MedicationData = z.infer<typeof medicationSchema>
