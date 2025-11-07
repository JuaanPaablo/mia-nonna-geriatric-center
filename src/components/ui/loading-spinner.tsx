import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6", 
  lg: "w-8 h-8"
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-current border-t-transparent",
        sizeClasses[size],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingDotsProps {
  className?: string
}

export function LoadingDots({ className }: LoadingDotsProps) {
  return (
    <div className={cn("flex space-x-1", className)}>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-2 h-2 bg-current rounded-full animate-bounce"></div>
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-4 bg-muted rounded animate-pulse"
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  )
}

interface LoadingCardSkeletonProps {
  className?: string
}

export function LoadingCardSkeleton({ className }: LoadingCardSkeletonProps) {
  return (
    <div className={cn("border rounded-lg p-6 space-y-4", className)}>
      <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
      <div className="space-y-2">
        <div className="h-4 bg-muted rounded animate-pulse"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-5/6"></div>
        <div className="h-4 bg-muted rounded animate-pulse w-4/6"></div>
      </div>
      <div className="flex space-x-2">
        <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
        <div className="h-8 w-16 bg-muted rounded animate-pulse"></div>
      </div>
    </div>
  )
}

interface LoadingTableSkeletonProps {
  rows?: number
  columns?: number
  className?: string
}

export function LoadingTableSkeleton({ 
  rows = 5, 
  columns = 4, 
  className 
}: LoadingTableSkeletonProps) {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex space-x-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="h-5 bg-muted rounded animate-pulse flex-1"></div>
        ))}
      </div>
      
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex space-x-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div 
              key={colIndex} 
              className="h-4 bg-muted rounded animate-pulse flex-1"
              style={{
                animationDelay: `${(rowIndex * columns + colIndex) * 0.1}s`
              }}
            ></div>
          ))}
        </div>
      ))}
    </div>
  )
}
