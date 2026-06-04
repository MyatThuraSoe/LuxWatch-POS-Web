import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string | number
  change?: {
    value: number
    label: string
  }
  icon?: React.ReactNode
  className?: string
}

export function StatCard({
  title,
  value,
  change,
  icon,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-lg border bg-surface p-6 shadow-sm transition-smooth hover:shadow-md',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight">{value}</p>
          {change && (
            <p
              className={cn(
                'mt-2 flex items-center text-sm',
                change.value >= 0 ? 'text-success' : 'text-danger'
              )}
            >
              <span>{change.value >= 0 ? '↑' : '↓'} {Math.abs(change.value)}%</span>
              <span className="ml-1 text-muted-foreground">{change.label}</span>
            </p>
          )}
        </div>
        {icon && (
          <div className="rounded-full bg-primary/10 p-3 text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}
