// Environment configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'LuxWatch'
export const APP_VERSION = import.meta.env.VITE_APP_VERSION || '1.0.0'

// Feature flags
export const FEATURES = {
  DARK_MODE: import.meta.env.VITE_FEATURE_DARK_MODE !== 'false',
  BARCODE_SCANNER: import.meta.env.VITE_FEATURE_BARCODE_SCANNER !== 'false',
  RECEIPT_PRINTING: import.meta.env.VITE_FEATURE_RECEIPT_PRINTING !== 'false',
}

// App constants
export const DEFAULT_PAGE_SIZE = 10
export const MAX_PAGE_SIZE = 100
export const DATE_FORMAT = 'MMM dd, yyyy'
export const DATETIME_FORMAT = 'MMM dd, yyyy HH:mm'
export const CURRENCY = import.meta.env.VITE_DEFAULT_CURRENCY || 'USD'

// Role permissions
export const ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  EMPLOYEE: 'EMPLOYEE',
} as const

export const ROLE_LABELS = {
  ADMIN: 'Administrator',
  OWNER: 'Owner',
  EMPLOYEE: 'Employee',
} as const
