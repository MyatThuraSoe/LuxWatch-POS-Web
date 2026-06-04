import { z } from 'zod'

export const emailSchema = z.string().email('Invalid email address')
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits').max(15, 'Phone number too long')
export const requiredString = z.string().min(1, 'This field is required')

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const createUserSchema = z.object({
  name: requiredString,
  email: emailSchema,
  role: z.enum(['ADMIN', 'OWNER', 'EMPLOYEE']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const productSchema = z.object({
  name: requiredString,
  sku: requiredString,
  price: z.number().positive('Price must be positive'),
  categoryId: z.string().optional(),
  brandId: z.string().optional(),
  description: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type CreateUserData = z.infer<typeof createUserSchema>
export type ProductData = z.infer<typeof productSchema>

export function formatZodError(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {}
  error.errors.forEach((err) => {
    if (err.path.length > 0) {
      errors[err.path.join('.')] = err.message
    }
  })
  return errors
}
