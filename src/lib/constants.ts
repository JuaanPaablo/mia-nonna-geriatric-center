// Application Information
export const APP_INFO = {
  name: 'Mia Nonna',
  description: 'Centro Geriátrico - Sistema de gestión profesional',
  version: '1.0.0',
  author: 'Mia Nonna Team',
  website: 'https://mianonna.com',
  contact: {
    phone: '+593 99 831 3608',
    email: 'info@mianonna.com',
    whatsapp: '+593 99 831 3608',
    address: 'Pilanquí, Ibarra, Imbabura',
  },
  socialMedia: {
    facebook: 'https://facebook.com/mianonna',
    instagram: 'https://instagram.com/mianonna',
    linkedin: 'https://linkedin.com/company/mianonna',
    youtube: 'https://youtube.com/@mianonna',
  },
  hours: {
    weekdays: '24 horas',
    weekends: '24 horas',
    holidays: '24 horas',
    visiting: 'Lunes a Domingo: 10:00 - 20:00',
  }
} as const

// Navigation Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/admin',
  PATIENTS: '/admin/patients',
  ENROLLMENTS: '/admin/enrollments',
  CONTACTS: '/admin/contacts',
  PROFILE: '/admin/profile',
  SETTINGS: '/admin/settings',
} as const

// API Routes
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
  },
  PATIENTS: {
    LIST: '/api/patients',
    CREATE: '/api/patients',
    UPDATE: (id: string) => `/api/patients/${id}`,
    DELETE: (id: string) => `/api/patients/${id}`,
    DETAIL: (id: string) => `/api/patients/${id}`,
  },
  ENROLLMENTS: {
    LIST: '/api/enrollments',
    CREATE: '/api/enrollments',
    UPDATE: (id: string) => `/api/enrollments/${id}`,
    DELETE: (id: string) => `/api/enrollments/${id}`,
  },
  CONTACTS: {
    LIST: '/api/contacts',
    CREATE: '/api/contacts',
    UPDATE: (id: string) => `/api/contacts/${id}`,
    DELETE: (id: string) => `/api/contacts/${id}`,
  },
} as const

// User Roles and Permissions
export const USER_ROLES = {
  ADMIN: 'admin',
  STAFF: 'staff',
} as const

export const PERMISSIONS = {
  PATIENTS: {
    CREATE: 'patients:create',
    READ: 'patients:read',
    UPDATE: 'patients:update',
    DELETE: 'patients:delete',
  },
  ENROLLMENTS: {
    CREATE: 'enrollments:create',
    READ: 'enrollments:read',
    UPDATE: 'enrollments:update',
    DELETE: 'enrollments:delete',
  },
  CONTACTS: {
    READ: 'contacts:read',
    UPDATE: 'contacts:update',
    DELETE: 'contacts:delete',
  },
  USERS: {
    CREATE: 'users:create',
    READ: 'users:read',
    UPDATE: 'users:update',
    DELETE: 'users:delete',
  },
} as const

// Status Options
export const PATIENT_STATUSES = [
  { value: 'active', label: 'Activo', color: 'bg-green-100 text-green-800' },
  { value: 'inactive', label: 'Inactivo', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'discharged', label: 'Alta', color: 'bg-gray-100 text-gray-800' },
] as const

export const ENROLLMENT_STATUSES = [
  { value: 'pending', label: 'Pendiente', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'approved', label: 'Aprobado', color: 'bg-green-100 text-green-800' },
  { value: 'rejected', label: 'Rechazado', color: 'bg-red-100 text-red-800' },
] as const

export const CONTACT_STATUSES = [
  { value: 'new', label: 'Nuevo', color: 'bg-blue-100 text-blue-800' },
  { value: 'contacted', label: 'Contactado', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'converted', label: 'Convertido', color: 'bg-green-100 text-green-800' },
] as const

// Care Types
export const CARE_TYPES = [
  { value: 'full_time', label: 'Tiempo Completo', description: 'Cuidado continuo' },
  { value: 'day_care', label: 'Centro de Día', description: 'Cuidado durante el día, regreso a casa por la noche' },
  { value: 'respite', label: 'Respiro Familiar', description: 'Cuidado temporal para descanso de familiares' },
] as const

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Masculino' },
  { value: 'female', label: 'Femenino' },
  { value: 'other', label: 'Otro' },
] as const

// Service Categories
export const SERVICE_CATEGORIES = [
  { value: 'medical', label: 'Médico', icon: 'Stethoscope' },
  { value: 'therapy', label: 'Terapia', icon: 'Activity' },
  { value: 'social', label: 'Social', icon: 'Users' },
  { value: 'recreational', label: 'Recreativo', icon: 'Music' },
  { value: 'spiritual', label: 'Espiritual', icon: 'Heart' },
  { value: 'dietary', label: 'Dietético', icon: 'Apple' },
] as const

// Healthcare Services
export const HEALTHCARE_SERVICES = [
  {
    name: 'Atención Médica',
    description: 'Supervisión médica constante con personal especializado en geriatría',
    icon: 'Stethoscope',
    category: 'medical',
    featured: true,
  },
  {
    name: 'Fisioterapia',
    description: 'Programas de rehabilitación física adaptados a cada residente',
    icon: 'Activity',
    category: 'therapy',
    featured: true,
  },
  {
    name: 'Terapia Ocupacional',
    description: 'Actividades para mantener la autonomía y habilidades cognitivas',
    icon: 'Brain',
    category: 'therapy',
    featured: true,
  },
  {
    name: 'Nutrición Especializada',
    description: 'Dietas personalizadas supervisadas por nutricionistas',
    icon: 'Apple',
    category: 'dietary',
    featured: true,
  },
  {
    name: 'Actividades Sociales',
    description: 'Programas de socialización y entretenimiento adaptados',
    icon: 'Users',
    category: 'social',
    featured: false,
  },
  {
    name: 'Apoyo Psicológico',
    description: 'Acompañamiento emocional para residentes y familias',
    icon: 'Heart',
    category: 'therapy',
    featured: false,
  },
] as const

// Why Choose Us Features
export const WHY_CHOOSE_US = [
  {
    title: 'Cuidado continuo',
    description: 'Personal médico y de enfermería disponible',
    icon: 'Clock',
    color: 'primary',
  },
  {
    title: 'Instalaciones Modernas',
    description: 'Equipamiento de última generación en un ambiente cálido y familiar',
    icon: 'Building',
    color: 'secondary',
  },
  {
    title: 'Personal Especializado',
    description: 'Equipo multidisciplinar con experiencia en cuidado geriátrico',
    icon: 'Users',
    color: 'accent',
  },
  {
    title: 'Atención Personalizada',
    description: 'Planes de cuidado individualizados para cada residente',
    icon: 'Heart',
    color: 'primary',
  },
] as const

// Testimonials
export const TESTIMONIALS = [
  {
    name: 'María González',
    relation: 'Hija de residente',
    content: 'El cuidado que recibe mi madre en Mia Nonna es excepcional. El personal es muy atento y profesional.',
    rating: 5,
    image: '/testimonials/maria.jpg',
  },
  {
    name: 'Carlos Ruiz',
    relation: 'Hijo de residente',
    content: 'Estamos muy tranquilos sabiendo que papá está en buenas manos. Las instalaciones son excelentes.',
    rating: 5,
    image: '/testimonials/carlos.jpg',
  },
  {
    name: 'Ana Martínez',
    relation: 'Familiar',
    content: 'La atención personalizada y el ambiente familiar hacen que mi abuela se sienta como en casa.',
    rating: 5,
    image: '/testimonials/ana.jpg',
  },
] as const

// Facility Images
export const FACILITY_IMAGES = [
  {
    src: '/facilities/common-area.jpg',
    alt: 'Área común con espacios de descanso',
    title: 'Áreas Comunes',
    description: 'Espacios amplios y luminosos para la socialización',
  },
  {
    src: '/facilities/dining-room.jpg',
    alt: 'Comedor principal',
    title: 'Comedor',
    description: 'Ambiente acogedor para las comidas principales',
  },
  {
    src: '/facilities/therapy-room.jpg',
    alt: 'Sala de fisioterapia',
    title: 'Sala de Fisioterapia',
    description: 'Equipamiento especializado para rehabilitación',
  },
  {
    src: '/facilities/garden.jpg',
    alt: 'Jardín exterior',
    title: 'Jardín',
    description: 'Espacio verde para actividades al aire libre',
  },
] as const

// Staff Members
export const STAFF_MEMBERS = [
  {
    name: 'Dr. Elena Rodríguez',
    position: 'Directora Médica',
    specialty: 'Geriatría',
    experience: '15 años',
    image: '/staff/dr-elena.jpg',
    description: 'Especialista en medicina geriátrica con amplia experiencia en cuidados de larga duración.',
  },
  {
    name: 'Carmen López',
    position: 'Supervisora de Enfermería',
    specialty: 'Enfermería Geriátrica',
    experience: '12 años',
    image: '/staff/carmen.jpg',
    description: 'Supervisora de equipo de enfermería especializada en cuidado de personas mayores.',
  },
  {
    name: 'Miguel Santos',
    position: 'Fisioterapeuta',
    specialty: 'Rehabilitación Geriátrica',
    experience: '8 años',
    image: '/staff/miguel.jpg',
    description: 'Especialista en fisioterapia y rehabilitación para personas de la tercera edad.',
  },
] as const

// Table Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
  MAX_PAGE_SIZE: 100,
} as const

// Form Validation
export const VALIDATION = {
  MIN_PASSWORD_LENGTH: 8,
  MAX_TEXT_LENGTH: 100,
  MAX_TEXTAREA_LENGTH: 1000,
  MIN_AGE: 0,
  MAX_AGE: 150,
  PHONE_REGEX: /^(\+593|593)?[0-9]{9}$/,
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  DNI_REGEX: /^\d{8}[A-Z]$/,
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  DOCUMENT_TYPES: ['application/pdf', 'application/msword'],
} as const

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'mia_nonna_auth_token',
  USER_PREFERENCES: 'mia_nonna_user_preferences',
  THEME: 'mia_nonna_theme',
  LANGUAGE: 'mia_nonna_language',
} as const

// Toast Messages
export const TOAST_MESSAGES = {
  SUCCESS: {
    PATIENT_CREATED: 'Paciente creado correctamente',
    PATIENT_UPDATED: 'Paciente actualizado correctamente',
    PATIENT_DELETED: 'Paciente eliminado correctamente',
    ENROLLMENT_CREATED: 'Matrícula creada correctamente',
    ENROLLMENT_UPDATED: 'Matrícula actualizada correctamente',
    CONTACT_UPDATED: 'Contacto actualizado correctamente',
    LOGIN_SUCCESS: 'Bienvenido de vuelta',
    LOGOUT_SUCCESS: 'Sesión cerrada correctamente',
  },
  ERROR: {
    GENERIC: 'Ha ocurrido un error inesperado',
    NETWORK: 'Error de conexión',
    UNAUTHORIZED: 'No tienes permisos para realizar esta acción',
    VALIDATION: 'Por favor, revisa los datos introducidos',
    PATIENT_NOT_FOUND: 'Paciente no encontrado',
    LOGIN_FAILED: 'Credenciales incorrectas',
  },
} as const

// Animation Durations
export const ANIMATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  EXTRA_SLOW: 1000,
} as const
