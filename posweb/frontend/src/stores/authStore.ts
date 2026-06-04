import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { User, AuthResponse } from '@/types'
import { STORAGE_KEYS } from '@/config/constants'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (credentials: { email: string; password: string }) => Promise<void>
  logout: () => void
  setUser: (user: User | null) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true,
      login: async (credentials) => {
        set({ isLoading: true })
        try {
          // This will be implemented with actual API call in Phase 2
          console.log('Login attempt:', credentials.email)
          set({ isLoading: false, isAuthenticated: true })
        } catch (error) {
          set({ isLoading: false })
          throw error
        }
      },
      logout: () => {
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN)
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN)
        set({ user: null, isAuthenticated: false })
      },
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      reset: () => set({ user: null, isAuthenticated: false, isLoading: true }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
)
