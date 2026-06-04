import { cn } from '@lib/utils'

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'card' | 'table' | 'chart' | 'avatar' | 'button'
  width?: string | number
  height?: string | number
  lines?: number
}

export function LoadingSkeleton({
  className,
  variant = 'text',
  width,
  height,
  lines = 3,
}: LoadingSkeletonProps) {
  const baseClasses = 'animate-pulse bg-gray-200 rounded'

  const variantClasses = {
    text: 'h-4 w-full',
    card: 'h-32 w-full rounded-lg',
    table: 'h-10 w-full',
    chart: 'h-48 w-full rounded-lg',
    avatar: 'h-10 w-10 rounded-full',
    button: 'h-10 w-24',
  }

  const style = {
    width: width ? (typeof width === 'string' ? width : `${width}px`) : undefined,
    height: height ? (typeof height === 'string' ? height : `${height}px`) : undefined,
  }

  if (variant === 'text' && lines > 1) {
    return (
      <div className={cn('space-y-2', className)}>
        {Array.from({ length: lines }).map((_, i) => (
          <div
            key={i}
            className={cn(baseClasses, variantClasses[variant], i === lines - 1 ? 'w-3/4' : 'w-full')}
            style={style}
          />
        ))}
      </div>
    )
  }

  return (
    <div
      className={cn(baseClasses, variantClasses[variant], className)}
      style={style}
    />
  )
}

export function DataTableSkeleton({ rows = 5, columns = 4 }) {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-white">
      <div className="border-b border-gray-200 px-4 py-3">
        <LoadingSkeleton variant="text" width="150px" />
      </div>
      <div className="divide-y divide-gray-100">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="grid grid-cols-4 gap-4 px-4 py-3">
            {Array.from({ length: columns }).map((_, j) => (
              <LoadingSkeleton key={j} variant="text" />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export function CardSkeleton({ showHeader = true, showFooter = false }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {showHeader && (
        <div className="mb-4 flex items-center justify-between">
          <LoadingSkeleton variant="text" width="120px" />
          <LoadingSkeleton variant="avatar" />
        </div>
      )}
      <LoadingSkeleton variant="text" lines={3} className="mb-4" />
      {showFooter && (
        <div className="flex justify-end gap-2 border-t border-gray-100 pt-4">
          <LoadingSkeleton variant="button" />
          <LoadingSkeleton variant="button" />
        </div>
      )}
    </div>
  )
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <LoadingSkeleton variant="text" width="200px" height="32px" />
        <LoadingSkeleton variant="button" width="120px" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
      <DataTableSkeleton />
    </div>
  )
}
