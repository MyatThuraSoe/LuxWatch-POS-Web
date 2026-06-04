import { cn } from '@/lib/utils'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const spinnerSizes: Record<string, string> = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent text-primary',
        spinnerSizes[size],
        className
      )}
    />
  )
}

export function Loader({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Spinner size="lg" />
      <span className="ml-2 text-sm text-muted-foreground">Loading...</span>
    </div>
  )
}
