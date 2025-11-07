import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface PageHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  showBackButton?: boolean
  onBack?: () => void
  backLabel?: string
}

export function PageHeader({
  title,
  description,
  children,
  className,
  showBackButton = false,
  onBack,
  backLabel = "Volver"
}: PageHeaderProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {showBackButton && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          {backLabel}
        </Button>
      )}
      
      <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

interface SectionHeaderProps {
  title: string
  description?: string
  children?: React.ReactNode
  className?: string
  icon?: React.ReactNode
}

export function SectionHeader({
  title,
  description,
  children,
  className,
  icon
}: SectionHeaderProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="text-xl font-semibold tracking-tight">
              {title}
            </h2>
          </div>
          {description && (
            <p className="text-sm text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {children && (
          <div className="flex items-center space-x-2">
            {children}
          </div>
        )}
      </div>
    </div>
  )
}

interface StatsHeaderProps {
  title: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  change?: {
    value: number
    type: 'increase' | 'decrease'
    period: string
  }
  className?: string
}

export function StatsHeader({
  title,
  value,
  description,
  icon,
  change,
  className
}: StatsHeaderProps) {
  return (
    <div className={cn("rounded-lg border bg-card p-6", className)}>
      <div className="flex items-center justify-between space-y-0 pb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <div className="space-y-1">
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground">
            {description}
          </p>
        )}
        {change && (
          <div className="flex items-center space-x-1 text-xs">
            <span
              className={cn(
                "font-medium",
                change.type === 'increase' 
                  ? "text-green-600" 
                  : "text-red-600"
              )}
            >
              {change.type === 'increase' ? '+' : '-'}{Math.abs(change.value)}%
            </span>
            <span className="text-muted-foreground">
              desde {change.period}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

interface BreadcrumbItem {
  label: string
  href?: string
  current?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  return (
    <nav className={cn("flex", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-3">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-1 text-muted-foreground md:mx-3">/</span>
            )}
            {item.href && !item.current ? (
              <a
                href={item.href}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                {item.label}
              </a>
            ) : (
              <span
                className={cn(
                  "text-sm font-medium",
                  item.current 
                    ? "text-foreground" 
                    : "text-muted-foreground"
                )}
                aria-current={item.current ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
