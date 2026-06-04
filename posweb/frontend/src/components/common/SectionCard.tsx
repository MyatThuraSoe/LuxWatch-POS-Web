import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface SectionCardProps {
  title?: string
  description?: string
  children: ReactNode
  className?: string
  headerAction?: ReactNode
}

export function SectionCard({ 
  title, 
  description, 
  children, 
  className, 
  headerAction 
}: SectionCardProps) {
  return (
    <div className={cn('rounded-lg border bg-card text-card-foreground shadow-sm', className)}>
      {(title || description || headerAction) && (
        <div className="flex items-center justify-between border-b px-6 py-4">
          <div>
            {title && <h3 className="text-lg font-semibold">{title}</h3>}
            {description && (
              <p className="text-sm text-muted-foreground mt-1">{description}</p>
            )}
          </div>
          {headerAction && <div className="flex-shrink-0">{headerAction}</div>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  )
}
