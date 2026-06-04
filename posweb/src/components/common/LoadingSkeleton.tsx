import { cn } from '@/lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'table' | 'avatar' | 'image'
  lines?: number
}

export function LoadingSkeleton({
  className,
  variant = 'text',
  lines = 1,
}: LoadingSkeletonProps) {
  if (variant === 'text') {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className="h-4 w-full animate-pulse rounded bg-muted"
            style={{ width: i === lines - 1 ? '60%' : '100%' }}
          />
        ))}
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={cn('rounded-lg border bg-surface p-4', className)}>
        <div className="mb-4 h-6 w-1/3 animate-pulse rounded bg-muted" />
        <div className="space-y-2">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </div>
      </div>
    )
  }

  if (variant === 'table') {
    return (
      <div className={cn('w-full space-y-2', className)}>
        <div className="flex gap-4 border-b pb-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-4 w-24 animate-pulse rounded bg-muted" />
          ))}
        </div>
        {Array.from({ length: 5 }).map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-4 py-2">
            {Array.from({ length: 4 }).map((_, colIndex) => (
              <div
                key={colIndex}
                className="h-4 flex-1 animate-pulse rounded bg-muted"
              />
            ))}
          </div>
        ))}
      </div>
    )
  }

  if (variant === 'avatar') {
    return (
      <div
        className={cn(
          'h-10 w-10 animate-pulse rounded-full bg-muted',
          className
        )}
      />
    )
  }

  if (variant === 'image') {
    return (
      <div
        className={cn('aspect-video w-full animate-pulse rounded bg-muted', className)}
      />
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

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return <LoadingSkeleton variant="text" lines={lines} />
}
