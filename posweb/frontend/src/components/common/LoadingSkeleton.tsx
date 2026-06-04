import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'table' | 'avatar' | 'image'
  lines?: number
}

export function LoadingSkeleton({ 
  className, 
  variant = 'text', 
  lines = 1 
}: LoadingSkeletonProps) {
  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'h-4 w-full animate-pulse rounded bg-muted',
              i === lines - 1 && 'w-3/4'
            )}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-lg border bg-card p-6', className)}>
        <div className="flex items-center space-x-4">
          <div className="h-12 w-12 animate-pulse rounded-full bg-muted" />
          <div className="space-y-2 flex-1">
            <div className="h-4 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-3 w-1/2 animate-pulse rounded bg-muted" />
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-full animate-pulse rounded bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-3 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="h-10 w-full animate-pulse rounded bg-muted" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-12 w-full animate-pulse rounded bg-muted" />
        ))}
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div className={cn('h-10 w-10 animate-pulse rounded-full bg-muted', className)} />
    )
  }

  if (variant === 'image') {
    return (
      <div className={cn('aspect-video w-full animate-pulse rounded bg-muted', className)} />
    )
  }

  return null
}

export function CardSkeleton() {
  return <LoadingSkeleton variant="card" />
}

export function TableSkeleton() {
  return <LoadingSkeleton variant="table" />
}

export function TextSkeleton({ lines = 1 }: { lines?: number }) {
  return <LoadingSkeleton variant="text" lines={lines} />
}
