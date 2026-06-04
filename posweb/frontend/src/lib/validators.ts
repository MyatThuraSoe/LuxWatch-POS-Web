import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits').optional()
export const requiredString = z.string().min(1, 'This field is required')
export const optionalString = z.string().optional()
export const positiveNumber = z.number().positive('Value must be positive')
export const nonNegativeNumber = z.number().nonnegative('Value cannot be negative')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createUserSchema = z.object({
  name: requiredString,
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['ADMIN', 'OWNER', 'EMPLOYEE']),
})

export const productSchema = z.object({
  name: requiredString,
  sku: requiredString,
  price: positiveNumber,
  categoryId: z.string().uuid(),
  brandId: z.string().uuid().optional(),
  description: optionalString,
})

export function formatZodError(error: z.ZodError): string {
  return error.errors.map(e => e.message).join(', ')
}

export type LoginFormData = z.infer<typeof loginSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type ProductFormData = z.infer<typeof productSchema>
