import * as React from 'react'
import { cn } from '@lib/utils'

interface FormFieldProps {
  label?: string
  error?: string
  description?: string
  children: React.ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  description,
  children,
  className,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
        </label>
      )}
      {children}
      {description && !error && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
      {error && (
        <p className="text-xs font-medium text-danger-600">{error}</p>
      )}
    </div>
  )
}

interface FormLabelProps {
  children: React.ReactNode
  required?: boolean
  className?: string
}

export function FormLabel({ children, required, className }: FormLabelProps) {
  return (
    <label className={cn('text-sm font-medium leading-none', className)}>
      {children}
      {required && <span className="ml-1 text-danger-600">*</span>}
    </label>
  )
}

interface FormErrorProps {
  error?: string
  className?: string
}

export function FormError({ error, className }: FormErrorProps) {
  if (!error) return null

  return (
    <p className={cn('text-xs font-medium text-danger-600', className)}>
      {error}
    </p>
  )
}
