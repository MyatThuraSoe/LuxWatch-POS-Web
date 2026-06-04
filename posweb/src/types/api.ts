export interface User {
  id: string
  name: string
  email: string
  role: 'ADMIN' | 'OWNER' | 'EMPLOYEE'
  status: 'active' | 'inactive'
  permissions?: string[]
  avatar?: string
  createdAt: string
  updatedAt: string
}

export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface AuthResponse {
  user: User
  access_token: string
  refresh_token: string
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
  }
}

export interface Category {
  id: string
  name: string
  description?: string
  parentId?: string
  children?: Category[]
  createdAt: string
  updatedAt: string
}

export interface Brand {
  id: string
  name: string
  logo?: string
  description?: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  sku: string
  price: number
  categoryId?: string
  brandId?: string
  description?: string
  images?: ProductImage[]
  variants?: ProductVariant[]
  stock?: number
  status: 'active' | 'inactive'
  createdAt: string
  updatedAt: string
}

export interface ProductImage {
  id: string
  url: string
  alt?: string
  isPrimary: boolean
}

export interface ProductVariant {
  id: string
  productId: string
  name: string
  sku: string
  price: number
  stock: number
}

export interface Customer {
  id: string
  name: string
  email?: string
  phone?: string
  address?: string
  purchases?: Purchase[]
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  discount?: number
}

export interface Sale {
  id: string
  invoiceNumber: string
  customerId?: string
  customer?: Customer
  items: SaleItem[]
  subtotal: number
  tax: number
  discount: number
  total: number
  paymentMethod: 'cash' | 'card' | 'mixed'
  status: 'completed' | 'refunded' | 'pending'
  cashierId: string
  cashier?: User
  createdAt: string
}

export interface SaleItem {
  id: string
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  discount: number
  total: number
}

export interface Supplier {
  id: string
  name: string
  contactName?: string
  email?: string
  phone?: string
  address?: string
  contacts?: SupplierContact[]
  createdAt: string
  updatedAt: string
}

export interface SupplierContact {
  id: string
  supplierId: string
  name: string
  phone?: string
  email?: string
  position?: string
}

export interface DashboardStats {
  totalSales: number
  todaySales: number
  totalOrders: number
  lowStockProducts: number
  topProducts: Product[]
  recentSales: Sale[]
}

export type UserRole = 'ADMIN' | 'OWNER' | 'EMPLOYEE'
