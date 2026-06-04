import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@types/api'

interface AuthState {
  // Auth state
  user: User | null
  token: string | null
  isAuthenticated: boolean
  
  // Actions
  setUser: (user: User | null) => void
  setToken: (token: string | null) => void
  login: (user: User, token: string) => void
  logout: () => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      login: (user, token) => {
        set({ user, token, isAuthenticated: true })
        localStorage.setItem('auth_token', token)
      },
      
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('auth_token')
      },
      
      clearAuth: () => {
        set({ user: null, token: null, isAuthenticated: false })
        localStorage.removeItem('auth_token')
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Helper to get token from store or localStorage
export const getAuthToken = (): string | null => {
  const state = useAuthStore.getState()
  return state.token || localStorage.getItem('auth_token')
}

// Check if user has required role
export const hasRole = (requiredRoles: string[]): boolean => {
  const state = useAuthStore.getState()
  if (!state.user) return false
  return requiredRoles.includes(state.user.role)
}

// Check if user has permission
export const hasPermission = (permission: string): boolean => {
  const state = useAuthStore.getState()
  if (!state.user) return false
  // Admin has all permissions
  if (state.user.role === 'ADMIN') return true
  // Add more specific permission logic here
  return false
}
