import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token')
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => Promise.reject(error)
)

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default apiClient

export const apiEndpoints = {
  auth: {
    login: '/auth/login',
    logout: '/auth/logout',
    me: '/auth/me',
    refresh: '/auth/refresh',
  },
  users: {
    list: '/users',
    create: '/users',
    get: (id: string) => `/users/${id}`,
    update: (id: string) => `/users/${id}`,
    delete: (id: string) => `/users/${id}`,
    toggleStatus: (id: string) => `/users/${id}/status`,
    permissions: (id: string) => `/users/${id}/permissions`,
  },
  categories: {
    list: '/categories',
    tree: '/categories/tree',
    create: '/categories',
    get: (id: string) => `/categories/${id}`,
    update: (id: string) => `/categories/${id}`,
    delete: (id: string) => `/categories/${id}`,
  },
  brands: {
    list: '/brands',
    create: '/brands',
    get: (id: string) => `/brands/${id}`,
    update: (id: string) => `/brands/${id}`,
    delete: (id: string) => `/brands/${id}`,
  },
  products: {
    list: '/products',
    search: '/products/search',
    create: '/products',
    get: (id: string) => `/products/${id}`,
    update: (id: string) => `/products/${id}`,
    delete: (id: string) => `/products/${id}`,
    uploadImage: (id: string) => `/products/${id}/images`,
    deleteImage: (imageId: string) => `/products/images/${imageId}`,
    variants: (id: string) => `/products/${id}/variants`,
  },
  inventory: {
    list: '/inventory',
    productStock: (productId: string) => `/inventory/${productId}`,
    adjust: '/inventory/adjust',
    movements: '/inventory/movements',
    serials: '/inventory/serials',
    serialLookup: (serial: string) => `/inventory/serials/${serial}`,
    alerts: '/inventory/alerts',
  },
  suppliers: {
    list: '/suppliers',
    create: '/suppliers',
    get: (id: string) => `/suppliers/${id}`,
    update: (id: string) => `/suppliers/${id}`,
    delete: (id: string) => `/suppliers/${id}`,
    contacts: (id: string) => `/suppliers/${id}/contacts`,
    purchases: (id: string) => `/suppliers/${id}/purchases`,
  },
  purchaseOrders: {
    list: '/purchase-orders',
    create: '/purchase-orders',
    get: (id: string) => `/purchase-orders/${id}`,
    update: (id: string) => `/purchase-orders/${id}`,
    cancel: (id: string) => `/purchase-orders/${id}`,
    approve: (id: string) => `/purchase-orders/${id}/approve`,
    receive: (id: string) => `/purchase-orders/${id}/receive`,
    items: (id: string) => `/purchase-orders/${id}/items`,
  },
  pos: {
    cart: '/pos/cart',
    addCartItem: '/pos/cart/items',
    updateCartItem: (id: string) => `/pos/cart/items/${id}`,
    removeCartItem: (id: string) => `/pos/cart/items/${id}`,
    clearCart: '/pos/cart/clear',
    checkout: '/pos/checkout',
  },
  sales: {
    list: '/sales',
    today: '/sales/today',
    get: (id: string) => `/sales/${id}`,
    receipt: (id: string) => `/sales/${id}/receipt`,
    refund: (id: string) => `/sales/${id}/refund`,
  },
  customers: {
    list: '/customers',
    search: '/customers/search',
    create: '/customers',
    get: (id: string) => `/customers/${id}`,
    update: (id: string) => `/customers/${id}`,
    delete: (id: string) => `/customers/${id}`,
    purchases: (id: string) => `/customers/${id}/purchases`,
  },
  warranties: {
    list: '/warranties',
    lookup: (serial: string) => `/warranties/${serial}`,
    claim: '/warranties/claim',
    update: (id: string) => `/warranties/${id}`,
    void: (id: string) => `/warranties/${id}/void`,
    expiring: '/warranties/expiring',
  },
  repairs: {
    list: '/repairs',
    create: '/repairs',
    get: (id: string) => `/repairs/${id}`,
    update: (id: string) => `/repairs/${id}`,
    status: (id: string) => `/repairs/${id}/status`,
    complete: (id: string) => `/repairs/${id}/complete`,
  },
  reports: {
    dashboard: '/reports/dashboard',
    sales: '/reports/sales',
    dailySales: '/reports/sales/daily',
    monthlySales: '/reports/sales/monthly',
    products: '/reports/products',
    inventory: '/reports/inventory',
    financial: '/reports/financial',
    employees: '/reports/employees',
    export: '/reports/export',
  },
  receipts: {
    templates: '/receipts/templates',
    logs: '/receipts/logs',
  },
  settings: {
    all: '/settings',
    group: (group: string) => `/settings/${group}`,
  },
  profile: {
    get: '/profile',
    update: '/profile',
    password: '/profile/password',
  },
}
