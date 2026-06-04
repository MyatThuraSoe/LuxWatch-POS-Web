// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  errors?: Record<string, string[]>
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
    from: number
    to: number
  }
}

// User Types
export interface User {
  id: number
  name: string
  email: string
  role: 'ADMIN' | 'OWNER' | 'EMPLOYEE'
  status: 'active' | 'inactive'
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface UserProfile {
  id: number
  name: string
  email: string
  avatar_url?: string
  phone?: string
  address?: string
}

// Auth Types
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

export interface AuthResponse {
  user: User
  token: string
  expires_in: number
}

// Product Types
export interface Product {
  id: number
  name: string
  sku: string
  description?: string
  category_id?: number
  brand_id?: number
  price: number
  cost?: number
  stock_quantity: number
  low_stock_threshold?: number
  type: 'classic' | 'smart'
  status: 'active' | 'inactive' | 'discontinued'
  images?: ProductImage[]
  variants?: ProductVariant[]
  created_at: string
  updated_at: string
}

export interface ProductImage {
  id: number
  product_id: number
  url: string
  is_primary: boolean
  sort_order: number
}

export interface ProductVariant {
  id: number
  product_id: number
  name: string
  sku: string
  price?: number
  stock_quantity: number
}

export interface ProductSearchResult extends Product {
  category_name?: string
  brand_name?: string
}

// Category & Brand Types
export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  children?: Category[]
  product_count?: number
  created_at: string
  updated_at: string
}

export interface Brand {
  id: number
  name: string
  slug: string
  description?: string
  logo_url?: string
  product_count?: number
  created_at: string
  updated_at: string
}

// Inventory Types
export interface InventoryItem {
  product_id: number
  product_name: string
  sku: string
  quantity: number
  available: number
  reserved: number
  low_stock_threshold: number
  is_low_stock: boolean
}

export interface StockMovement {
  id: number
  product_id: number
  type: 'in' | 'out' | 'adjustment' | 'sale' | 'return'
  quantity: number
  reason?: string
  reference_type?: string
  reference_id?: number
  user_id: number
  user_name: string
  created_at: string
}

export interface SerialNumber {
  id: number
  product_id: number
  serial: string
  status: 'available' | 'sold' | 'returned' | 'warranty'
  sale_id?: number
  warranty_id?: number
  created_at: string
}

// Customer Types
export interface Customer {
  id: number
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  total_purchases: number
  total_spent: number
  created_at: string
  updated_at: string
}

// Sale Types
export interface Sale {
  id: number
  invoice_number: string
  customer_id?: number
  customer_name?: string
  user_id: number
  user_name: string
  subtotal: number
  discount: number
  tax: number
  total: number
  payment_method: 'cash' | 'card' | 'mixed'
  payment_status: 'paid' | 'partial' | 'pending'
  items: SaleItem[]
  notes?: string
  created_at: string
}

export interface SaleItem {
  id: number
  sale_id: number
  product_id: number
  product_name: string
  variant_id?: number
  variant_name?: string
  quantity: number
  unit_price: number
  discount: number
  tax: number
  total: number
  serial_numbers?: string[]
}

export interface CartItem {
  id?: string
  product_id: number
  product_name: string
  variant_id?: number
  variant_name?: string
  price: number
  quantity: number
  discount: number
  serial_numbers?: string[]
}

// Supplier Types
export interface Supplier {
  id: number
  name: string
  contact_person?: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  status: 'active' | 'inactive'
  contacts?: SupplierContact[]
  created_at: string
  updated_at: string
}

export interface SupplierContact {
  id: number
  supplier_id: number
  name: string
  phone?: string
  email?: string
  position?: string
}

// Purchase Order Types
export interface PurchaseOrder {
  id: number
  order_number: string
  supplier_id: number
  supplier_name: string
  status: 'draft' | 'pending' | 'approved' | 'received' | 'cancelled'
  total: number
  notes?: string
  approved_by?: number
  approved_at?: string
  received_at?: string
  items: PurchaseOrderItem[]
  created_at: string
  updated_at: string
}

export interface PurchaseOrderItem {
  id: number
  purchase_order_id: number
  product_id: number
  product_name: string
  quantity_ordered: number
  quantity_received: number
  unit_cost: number
  total: number
}

// Warranty Types
export interface Warranty {
  id: number
  serial_number: string
  product_id: number
  product_name: string
  customer_id?: number
  customer_name?: string
  sale_id?: number
  start_date: string
  end_date: string
  status: 'active' | 'expired' | 'claimed' | 'void'
  claim?: WarrantyClaim
  created_at: string
}

export interface WarrantyClaim {
  id: number
  warranty_id: number
  issue_description: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  resolution?: string
  claimed_at: string
  resolved_at?: string
}

// Repair Types
export interface RepairJob {
  id: number
  job_number: string
  customer_id: number
  customer_name: string
  product_id?: number
  product_name?: string
  serial_number?: string
  issue_description: string
  status: 'pending' | 'in_progress' | 'waiting_parts' | 'completed' | 'delivered' | 'cancelled'
  estimated_cost?: number
  actual_cost?: number
  notes?: string
  technician_id?: number
  technician_name?: string
  created_at: string
  updated_at: string
}

// Report Types
export interface DashboardKPIs {
  today_sales: number
  today_revenue: number
  today_orders: number
  month_sales: number
  month_revenue: number
  month_orders: number
  low_stock_products: number
  pending_repairs: number
  expiring_warranties: number
  top_products: ProductPerformance[]
  recent_sales: RecentSale[]
}

export interface ProductPerformance {
  product_id: number
  product_name: string
  quantity_sold: number
  revenue: number
}

export interface RecentSale {
  id: number
  invoice_number: string
  customer_name?: string
  total: number
  created_at: string
}

// Settings Types
export interface AppSettings {
  shop_name: string
  shop_address?: string
  shop_phone?: string
  shop_email?: string
  tax_rate: number
  currency: string
  receipt_footer?: string
  low_stock_threshold: number
}

// Common Types
export interface SelectOption {
  value: string | number
  label: string
}

export interface TablePagination {
  page: number
  perPage: number
  total: number
  totalPages: number
}

export interface SortConfig {
  field: string
  direction: 'asc' | 'desc'
}
