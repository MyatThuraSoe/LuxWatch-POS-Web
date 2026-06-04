import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useAuthStore } from '@/stores/authStore';
import type { LoginCredentials, AuthResponse, User } from '@/types/api';

export const queryKeys = {
  auth: {
    all: ['auth'] as const,
    me: ['auth', 'me'] as const,
  },
};

// Hook to fetch current user
export const useCurrentUser = () => {
  return useQuery({
    queryKey: queryKeys.auth.me,
    queryFn: async () => {
      const response = await api.get<{ user: User }>('/auth/me');
      return response.data.user;
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook for login mutation
export const useLogin = () => {
  const { login } = useAuthStore();
  
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
  });
};

// Hook for logout mutation
export const useLogout = () => {
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => logout(),
    onSuccess: () => {
      logout();
      queryClient.clear();
    },
  });
};

// Hook for refreshing token
export const useRefreshToken = () => {
  const { updateToken, refreshToken: storedRefreshToken } = useAuthStore();
  
  return useMutation({
    mutationFn: async () => {
      if (!storedRefreshToken) throw new Error('No refresh token');
      const response = await api.post<{ access_token: string; refresh_token: string }>(
        '/auth/refresh'
      );
      return response.data;
    },
    onSuccess: (data) => {
      updateToken(data.access_token, data.refresh_token);
    },
  });
};
