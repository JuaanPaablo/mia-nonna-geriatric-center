import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { 
  PatientStatus, 
  EnrollmentStatus, 
  ContactStatus,
  CareType,
  Gender
} from "@/types/global"

interface StatusBadgeProps {
  status: PatientStatus | EnrollmentStatus | ContactStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'approved':
      case 'converted':
        return 'success' as const
      case 'inactive':
      case 'pending':
      case 'contacted':
        return 'warning' as const
      case 'discharged':
      case 'rejected':
        return 'error' as const
      case 'new':
        return 'pending' as const
      default:
        return 'secondary' as const
    }
  }

  const getLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Activo',
      inactive: 'Inactivo',
      discharged: 'Alta',
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      new: 'Nuevo',
      contacted: 'Contactado',
      converted: 'Convertido',
    }
    return labels[status] || status
  }

  return (
    <Badge 
      variant={getVariant(status)} 
      className={cn("capitalize", className)}
    >
      {getLabel(status)}
    </Badge>
  )
}

interface CareTypeBadgeProps {
  careType: CareType
  className?: string
}

export function CareTypeBadge({ careType, className }: CareTypeBadgeProps) {
  const getLabel = (type: CareType) => {
    const labels: Record<CareType, string> = {
      full_time: 'Tiempo Completo',
      day_care: 'Centro de Día',
      respite: 'Respiro Familiar',
    }
    return labels[type]
  }

  const getVariant = (type: CareType) => {
    switch (type) {
      case 'full_time':
        return 'default' as const
      case 'day_care':
        return 'secondary' as const
      case 'respite':
        return 'outline' as const
      default:
        return 'secondary' as const
    }
  }

  return (
    <Badge 
      variant={getVariant(careType)} 
      className={className}
    >
      {getLabel(careType)}
    </Badge>
  )
}

interface GenderBadgeProps {
  gender: Gender
  className?: string
}

export function GenderBadge({ gender, className }: GenderBadgeProps) {
  const getLabel = (gender: Gender) => {
    const labels: Record<Gender, string> = {
      male: 'Masculino',
      female: 'Femenino',
      other: 'Otro',
    }
    return labels[gender]
  }

  return (
    <Badge 
      variant="outline" 
      className={className}
    >
      {getLabel(gender)}
    </Badge>
  )
}

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'urgent'
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  const getVariant = (priority: string) => {
    switch (priority) {
      case 'low':
        return 'secondary' as const
      case 'medium':
        return 'warning' as const
      case 'high':
        return 'error' as const
      case 'urgent':
        return 'destructive' as const
      default:
        return 'secondary' as const
    }
  }

  const getLabel = (priority: string) => {
    const labels: Record<string, string> = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      urgent: 'Urgente',
    }
    return labels[priority] || priority
  }

  return (
    <Badge 
      variant={getVariant(priority)} 
      className={cn("capitalize", className)}
    >
      {getLabel(priority)}
    </Badge>
  )
}

interface AgeBadgeProps {
  age: number
  className?: string
}

export function AgeBadge({ age, className }: AgeBadgeProps) {
  const getAgeGroup = (age: number) => {
    if (age < 65) return { label: 'Adulto', variant: 'secondary' as const }
    if (age < 75) return { label: 'Mayor', variant: 'default' as const }
    if (age < 85) return { label: 'Anciano', variant: 'warning' as const }
    return { label: 'Muy Anciano', variant: 'error' as const }
  }

  const { label, variant } = getAgeGroup(age)

  return (
    <Badge variant={variant} className={className}>
      {age} años - {label}
    </Badge>
  )
}
