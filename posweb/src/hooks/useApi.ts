import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import apiClient from '@/config/api'

export function useApi<T>(
  key: string[],
  endpoint: string,
  options?: Omit<UseQueryOptions<T, Error>, 'queryKey' | 'queryFn'>
) {
  return useQuery<T, Error>({
    queryKey: key,
    queryFn: async () => {
      const response = await apiClient.get(endpoint)
      return response.data
    },
    ...options,
  })
}
