import { z } from 'zod'

// Common validators
export const emailSchema = z.string().email('Invalid email address')
export const phoneSchema = z.string().min(10, 'Phone number must be at least 10 digits')
export const requiredSchema = z.string().min(1, 'This field is required')
export const positiveNumberSchema = z.number().positive('Value must be positive')

// User schemas
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
})

export const userCreateSchema = z.object({
  name: requiredSchema,
  email: emailSchema,
  role: z.enum(['ADMIN', 'OWNER', 'EMPLOYEE']),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const userUpdateSchema = z.object({
  name: requiredSchema.optional(),
  email: emailSchema.optional(),
  role: z.enum(['ADMIN', 'OWNER', 'EMPLOYEE']).optional(),
  status: z.enum(['active', 'inactive']).optional(),
})

// Product schemas
export const productCreateSchema = z.object({
  name: requiredSchema,
  sku: requiredSchema,
  description: z.string().optional(),
  category_id: z.number().optional(),
  brand_id: z.number().optional(),
  price: positiveNumberSchema,
  cost: z.number().optional(),
  stock_quantity: z.number().min(0).optional(),
  low_stock_threshold: z.number().min(0).optional(),
  type: z.enum(['classic', 'smart']),
  status: z.enum(['active', 'inactive', 'discontinued']).optional(),
})

export const productUpdateSchema = productCreateSchema.partial()

// Customer schemas
export const customerCreateSchema = z.object({
  name: requiredSchema,
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export const customerUpdateSchema = customerCreateSchema.partial()

// Sale schemas
export const cartItemSchema = z.object({
  product_id: z.number(),
  variant_id: z.number().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1'),
  discount: z.number().min(0).optional(),
  serial_numbers: z.array(z.string()).optional(),
})

export const checkoutSchema = z.object({
  items: z.array(cartItemSchema),
  customer_id: z.number().optional(),
  payment_method: z.enum(['cash', 'card', 'mixed']),
  discount: z.number().min(0).optional(),
  notes: z.string().optional(),
})

// Supplier schemas
export const supplierCreateSchema = z.object({
  name: requiredSchema,
  contact_person: z.string().optional(),
  email: emailSchema.optional(),
  phone: phoneSchema.optional(),
  address: z.string().optional(),
  notes: z.string().optional(),
})

export const supplierUpdateSchema = supplierCreateSchema.partial()

// Helper function to format Zod errors
export function formatZodError(error: z.ZodError): Record<string, string[]> {
  const errors: Record<string, string[]> = {}
  
  error.errors.forEach((err) => {
    const path = err.path.join('.') || 'root'
    if (!errors[path]) {
      errors[path] = []
    }
    errors[path].push(err.message)
  })
  
  return errors
}

// Helper function to validate schema
export function validateSchema<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: Record<string, string[]> } {
  const result = schema.safeParse(data)
  
  if (result.success) {
    return { success: true, data: result.data }
  }
  
  return { success: false, errors: formatZodError(result.error) }
}
