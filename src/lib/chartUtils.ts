// Utilidades para procesar datos y convertirlos en formatos para gráficos

export interface ChartData {
  patients: any[]
  enrollments: any[]
  contacts: any[]
  services: any[]
}

// Colores para los gráficos
export const chartColors = {
  primary: '#3B82F6',
  secondary: '#10B981',
  accent: '#F59E0B',
  danger: '#EF4444',
  warning: '#F97316',
  info: '#06B6D4',
  success: '#22C55E',
  purple: '#8B5CF6',
  pink: '#EC4899',
  indigo: '#6366F1'
}

// Generar datos para gráfico de evolución de pacientes
export function generatePatientsEvolutionData(data: ChartData) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const currentMonth = new Date().getMonth()
  
  // Obtener los últimos 6 meses
  const recentMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1)
  
  // Simular datos de crecimiento (en producción esto vendría de la base de datos)
  const basePatients = data.patients.length
  const growthData = recentMonths.map((_, index) => {
    const growth = Math.floor(basePatients * 0.1 * (index + 1))
    return Math.max(0, basePatients - growth)
  })

  return {
    labels: recentMonths,
    datasets: [
      {
        label: 'Total Pacientes',
        data: growthData,
        borderColor: chartColors.primary,
        backgroundColor: `${chartColors.primary}20`,
        tension: 0.4,
        fill: true
      }
    ]
  }
}

// Generar datos para gráfico de ingresos mensuales
export function generateRevenueData(data: ChartData) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const currentMonth = new Date().getMonth()
  
  // Obtener los últimos 6 meses
  const recentMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1)
  
  // Calcular ingresos por mes basado en matrículas activas
  const monthlyRevenue = recentMonths.map((_, index) => {
    const activeEnrollments = data.enrollments.filter(e => e.status === 'Activa')
    const baseRevenue = activeEnrollments.reduce((sum, e) => sum + (e.monthly_fee || 0), 0)
    // Simular variación mensual
    const variation = 0.9 + (Math.random() * 0.2)
    return Math.round(baseRevenue * variation)
  })

  return {
    labels: recentMonths,
    datasets: [
      {
        label: 'Ingresos Mensuales',
        data: monthlyRevenue,
        backgroundColor: chartColors.success,
        borderColor: chartColors.success,
        borderWidth: 2
      }
    ]
  }
}

// Generar datos para distribución por edad
export function generateAgeDistributionData(data: ChartData) {
  const ageRanges = [
    { label: '60-69', min: 60, max: 69, color: chartColors.primary },
    { label: '70-79', min: 70, max: 79, color: chartColors.secondary },
    { label: '80-89', min: 80, max: 89, color: chartColors.accent },
    { label: '90+', min: 90, max: 120, color: chartColors.warning }
  ]

  const ageData = ageRanges.map(range => {
    const count = data.patients.filter(p => {
      const age = p.age || 0
      return age >= range.min && age <= range.max
    }).length
    return count
  })

  return {
    labels: ageRanges.map(r => r.label),
    datasets: [
      {
        data: ageData,
        backgroundColor: ageRanges.map(r => r.color),
        borderColor: ageRanges.map(r => r.color),
        borderWidth: 2
      }
    ]
  }
}

// Generar datos para ocupación por mes
export function generateOccupancyData(data: ChartData) {
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  const currentMonth = new Date().getMonth()
  
  // Obtener los últimos 6 meses
  const recentMonths = months.slice(Math.max(0, currentMonth - 5), currentMonth + 1)
  
  // Simular datos de ocupación (en producción esto vendría de la base de datos)
  const maxCapacity = 50 // Capacidad máxima del centro
  const baseOccupancy = data.patients.length
  const occupancyData = recentMonths.map((_, index) => {
    const variation = 0.8 + (Math.random() * 0.4)
    return Math.min(maxCapacity, Math.round(baseOccupancy * variation))
  })

  return {
    labels: recentMonths,
    datasets: [
      {
        label: 'Ocupación',
        data: occupancyData,
        borderColor: chartColors.warning,
        backgroundColor: `${chartColors.warning}20`,
        tension: 0.4,
        fill: true
      },
      {
        label: 'Capacidad Máxima',
        data: recentMonths.map(() => maxCapacity),
        borderColor: chartColors.danger,
        backgroundColor: `${chartColors.danger}10`,
        borderDash: [5, 5],
        tension: 0,
        fill: false
      }
    ]
  }
}

// Generar datos para servicios más populares
export function generateServicesData(data: ChartData) {
  const activeServices = data.services.filter(s => s.is_active)
  
  // Simular popularidad basada en el precio (en producción esto vendría de uso real)
  const servicesWithPopularity = activeServices.map(service => ({
    ...service,
    popularity: Math.floor(Math.random() * 100) + 20 // 20-120 de popularidad
  }))

  // Ordenar por popularidad y tomar los top 5
  const topServices = servicesWithPopularity
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5)

  return {
    labels: topServices.map(s => s.name),
    datasets: [
      {
        label: 'Popularidad',
        data: topServices.map(s => s.popularity),
        backgroundColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.accent,
          chartColors.warning,
          chartColors.info
        ],
        borderColor: [
          chartColors.primary,
          chartColors.secondary,
          chartColors.accent,
          chartColors.warning,
          chartColors.info
        ],
        borderWidth: 2
      }
    ]
  }
}

// Generar datos para estado de matrículas
export function generateEnrollmentStatusData(data: ChartData) {
  const statusCounts = {
    'Activa': data.enrollments.filter(e => e.status === 'Activa').length,
    'Finalizada': data.enrollments.filter(e => e.status === 'Finalizada').length,
    'Cancelada': data.enrollments.filter(e => e.status === 'Cancelada').length
  }

  return {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          chartColors.success,
          chartColors.info,
          chartColors.danger
        ],
        borderColor: [
          chartColors.success,
          chartColors.info,
          chartColors.danger
        ],
        borderWidth: 2
      }
    ]
  }
}

// Generar datos para contactos por estado
export function generateContactStatusData(data: ChartData) {
  const statusCounts = {
    'Nuevo': data.contacts.filter(c => c.status === 'Nuevo').length,
    'Contactado': data.contacts.filter(c => c.status === 'Contactado').length,
    'Procesado': data.contacts.filter(c => c.status === 'Procesado').length
  }

  return {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        data: Object.values(statusCounts),
        backgroundColor: [
          chartColors.warning,
          chartColors.info,
          chartColors.success
        ],
        borderColor: [
          chartColors.warning,
          chartColors.info,
          chartColors.success
        ],
        borderWidth: 2
      }
    ]
  }
}
