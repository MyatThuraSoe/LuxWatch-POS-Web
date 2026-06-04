import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/lib/api';
import type { User, LoginCredentials, AuthResponse } from '@/types/api';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => Promise<void>;
  fetchUser: () => Promise<void>;
  clearError: () => void;
  updateToken: (token: string, refreshToken?: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (credentials: LoginCredentials) => {
        set({ isLoading: true, error: null });
        try {
          const response = await api.post<AuthResponse>('/auth/login', credentials);
          const { access_token, refresh_token, user } = response.data;
          
          set({
            token: access_token,
            refreshToken: refresh_token,
            user,
            isAuthenticated: true,
            isLoading: false,
          });
          
          // Set default auth header
          api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        } catch (error: any) {
          set({ 
            isLoading: false, 
            error: error.response?.data?.message || 'Login failed. Please check your credentials.' 
          });
          throw error;
        }
      },

      logout: async () => {
        try {
          // Attempt to notify backend of logout
          if (get().token) {
            await api.post('/auth/logout').catch(() => {}); // Ignore errors on logout
          }
        } finally {
          set({
            user: null,
            token: null,
            refreshToken: null,
            isAuthenticated: false,
            error: null,
          });
          delete api.defaults.headers.common['Authorization'];
        }
      },

      fetchUser: async () => {
        if (!get().token) return;
        
        try {
          const response = await api.get<{ user: User }>('/auth/me');
          set({ user: response.data.user, isAuthenticated: true });
        } catch (error) {
          // If fetching user fails, assume session is invalid
          get().logout();
        }
      },

      clearError: () => set({ error: null }),

      updateToken: (token: string, refreshToken?: string) => {
        set({ 
          token, 
          ...(refreshToken && { refreshToken }),
        });
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      },
    }),
    {
      name: 'luxwatch-auth',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        token: state.token, 
        refreshToken: state.refreshToken,
        user: state.user, 
        isAuthenticated: state.isAuthenticated 
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
          // Optionally re-fetch user here to validate token
          state.fetchUser().catch(console.error);
        }
      },
    }
  )
);
