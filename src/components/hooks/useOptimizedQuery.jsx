import { useQuery } from '@tanstack/react-query';
import { cacheUtils, performanceUtils } from '@/utils';

export function useOptimizedQuery(queryKey, queryFn, options = {}) {
  const defaultOptions = {
    staleTime: 5 * 60 * 1000, // 5 دقائق
    cacheTime: 10 * 60 * 1000, // 10 دقائق
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    refetchIntervalInBackground: false
  };

  const optimizedQueryFn = async () => {
    const cacheKey = JSON.stringify(queryKey);
    
    // محاولة الحصول من الذاكرة المؤقتة أولاً
    const cached = cacheUtils.get(cacheKey);
    if (cached) return cached;

    // جلب البيانات مع قياس الأداء
    const { result, duration } = await performanceUtils.measureAsync(
      queryFn,
      `Query: ${cacheKey}`
    );

    // تخزين في الذاكرة المؤقتة
    cacheUtils.set(cacheKey, result, options.cacheTime || 10 * 60 * 1000);
    
    return result;
  };

  return useQuery({
    queryKey,
    queryFn: optimizedQueryFn,
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