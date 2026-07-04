import { useQuery } from '@tanstack/react-query';

export function useOptimizedQuery(queryKey, queryFn, options = {}) {
  const defaultOptions = {
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false
  };

  return useQuery({
    queryKey,
    queryFn,
    ...defaultOptions,
    ...options
  });
}

export function useOptimizedInfiniteQuery(queryKey, queryFn, options = {}) {
  const { useInfiniteQuery } = require('@tanstack/react-query');
  
  const defaultOptions = {
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
    retry: 2
  };

  return useInfiniteQuery({
    queryKey,
    queryFn,
    ...defaultOptions,
    ...options
  });
}