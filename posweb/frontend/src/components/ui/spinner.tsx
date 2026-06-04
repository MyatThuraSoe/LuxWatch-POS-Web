import * as React from "react"
import { cn } from "@/lib/utils"

const Spinner = React.forwardRef<HTMLDivElement, { size?: 'sm' | 'md' | 'lg'; className?: string }>(
  ({ size = 'md', className }, ref) => {
    const sizeClasses = {
      sm: 'h-4 w-4',
      md: 'h-8 w-8',
      lg: 'h-12 w-12',
    }

    return (
      <div
        ref={ref}
        className={cn(
          'animate-spin rounded-full border-2 border-current border-t-transparent text-primary',
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
)
Spinner.displayName = 'Spinner'

const Loader = React.forwardRef<HTMLDivElement, { text?: string; className?: string }>(
  ({ text = 'Loading...', className }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex flex-col items-center justify-center gap-3', className)}
      >
        <Spinner size="lg" />
        {text && <p className="text-sm text-muted-foreground">{text}</p>}
      </div>
    )
  }
)
Loader.displayName = 'Loader'

export { Spinner, Loader }
