import React, { useEffect } from 'react';

export default function PerformanceOptimizer({ children }) {
  useEffect(() => {
    // مراقبة الأداء
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 3000) {
          console.warn('[PERF] Slow operation:', entry.name, `${entry.duration.toFixed(2)}ms`);
        }
      }
    });

    observer.observe({ entryTypes: ['measure', 'navigation'] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // تنظيف الذاكرة المؤقتة كل ساعة
    const cleanup = setInterval(() => {
      cacheUtils.clear();
      loggerUtils.info('Cache cleared');
    }, 60 * 60 * 1000);

    return () => clearInterval(cleanup);
  }, []);

  useEffect(() => {
    // قياس الأداء باستخدام Performance API
    if ('PerformanceObserver' in window) {
      const perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          loggerUtils.info(`Performance: ${entry.name}`, {
            duration: entry.duration,
            startTime: entry.startTime
          });
        }
      });

      perfObserver.observe({ entryTypes: ['navigation', 'resource', 'paint'] });
      return () => perfObserver.disconnect();
    }
  }, []);

  return <>{children}</>;
}