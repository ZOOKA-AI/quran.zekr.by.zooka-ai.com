import React, { useEffect } from 'react';

export default function PerformanceOptimizer({ children }) {
  useEffect(() => {
    // مراقبة الأداء
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 3000) {
            console.warn('[PERF] Slow operation:', entry.name, `${entry.duration.toFixed(2)}ms`);
          }
        }
      });

      try {
        observer.observe({ entryTypes: ['measure', 'navigation'] });
        return () => observer.disconnect();
      } catch (e) {
        console.warn('PerformanceObserver not fully supported');
      }
    }
  }, []);

  useEffect(() => {
    // تنظيف الذاكرة كل ساعة
    const cleanup = setInterval(() => {
      if ('localStorage' in window) {
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('cache_')) {
            localStorage.removeItem(key);
          }
        });
        console.log('[CACHE] Cleared old cache entries');
      }
    }, 60 * 60 * 1000);

    return () => clearInterval(cleanup);
  }, []);

  return <>{children}</>;
}