export const APP_NAME = 'LuxWatch POS'
export const APP_VERSION = '1.0.0'

export const USER_ROLES = {
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
  EMPLOYEE: 'EMPLOYEE',
} as const

export const SALE_STATUS = {
  COMPLETED: 'completed',
  REFUNDED: 'refunded',
  PENDING: 'pending',
} as const

export const PAYMENT_METHODS = {
  CASH: 'cash',
  CARD: 'card',
  MIXED: 'mixed',
} as const

export const DATE_FORMATS = {
  SHORT: 'MM/dd/yyyy',
  LONG: 'MMMM dd, yyyy',
  DATETIME: 'MMMM dd, yyyy HH:mm',
} as const

export const TABLE_PAGE_SIZES = [10, 25, 50, 100]
export const DEFAULT_PAGE_SIZE = 10

export const MAX_UPLOAD_SIZE = 5 * 1024 * 1024 // 5MB
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const KEYBOARD_SHORTCUTS = {
  NEW_SALE: 'Ctrl+N',
  SEARCH: 'Ctrl+K',
  HOLD_CART: 'Ctrl+H',
  CHECKOUT: 'Ctrl+Enter',
  CLEAR_CART: 'Ctrl+D',
} as const
