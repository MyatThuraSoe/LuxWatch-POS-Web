import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@config/api'
import type { ApiResponse } from '@types/api'

// Generic API hook for fetching data
export function useApi<T>(
  queryKey: string[],
  url: string,
  options?: { enabled?: boolean; staleTime?: number }
) {
  return useQuery<T, Error>({
    queryKey,
    queryFn: async () => {
      const response = await api.get<ApiResponse<T>>(url)
      if (!response.data.success) {
        throw new Error(response.data.message || 'Request failed')
      }
      return response.data.data as T
    },
    enabled: options?.enabled,
    staleTime: options?.staleTime || 5 * 60 * 1000,
  })
}

// Generic mutation hook
export function useApiMutation<T, V = unknown>(
  mutationKey: string[],
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  options?: {
    onSuccess?: (data: T) => void
    onError?: (error: Error) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation<T, Error, V>({
    mutationKey,
    mutationFn: async (variables: V) => {
      const response = await api[method]<ApiResponse<T>>(url, variables)
      if (!response.data.success) {
        throw new Error(response.data.message || 'Request failed')
      }
      return response.data.data as T
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries()
      options?.onSuccess?.(data)
    },
    onError: options?.onError,
  })
}

// Hook for paginated data
export function usePaginatedApi<T>(
  queryKeyPrefix: string,
  url: string,
  params: { page: number; perPage: number; [key: string]: unknown }
) {
  return useQuery<ApiResponse<T[]> & { meta: { current_page: number; last_page: number; per_page: number; total: number } }>({
    queryKey: [...queryKeyPrefix.split('/'), params],
    queryFn: async () => {
      const response = await api.get<ApiResponse<T[]>>(url, { params })
      return response.data
    },
    staleTime: 2 * 60 * 1000,
  })
}
