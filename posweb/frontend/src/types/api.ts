export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'OWNER' | 'EMPLOYEE'
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
}

export interface AuthResponse {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
  user: User
}

export interface ApiResponse<T = unknown> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T = unknown> {
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
  links: {
    first: string
    last: string
    prev: string | null
    next: string | null
  }
}

export interface PaginationParams {
  page?: number
  per_page?: number
  sort?: string
  order?: 'asc' | 'desc'
  search?: string
  filters?: Record<string, unknown>
}

export interface Product {
  id: string
  name: string
  sku: string
  description: string | null
  price: number
  cost: number | null
  category_id: string
  brand_id: string | null
  stock_quantity: number
  min_stock_level: number
  status: 'active' | 'inactive'
  images: ProductImage[]
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: string
  product_id: string
  url: string
  is_primary: boolean
  created_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  parent_id: string | null
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  slug: string
  description: string | null
  logo_url: string | null
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email: string | null
  phone: string | null
  address: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Sale {
  id: string
  invoice_number: string
  customer_id: string | null
  user_id: string
  subtotal: number
  discount: number
  tax: number
  total: number
  payment_method: string
  payment_status: string
  status: string
  notes: string | null
  created_at: string
  updated_at: string
  items: SaleItem[]
  customer: Customer | null
  user: User
}

export interface SaleItem {
  id: string
  sale_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
  discount: number
  tax: number
  total: number
  product: Product
}

export interface DashboardStats {
  today_sales: number
  today_orders: number
  total_revenue: number
  total_orders: number
  low_stock_products: number
  pending_repairs: number
}
