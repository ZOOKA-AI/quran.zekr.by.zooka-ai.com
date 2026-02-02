import React, { useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';
import { performanceUtils, cacheUtils, loggerUtils } from '@/utils';

export default function PerformanceOptimizer({ children }) {
  useEffect(() => {
    // مراقبة الأداء
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 3000) {
          loggerUtils.warn('Slow operation detected', {
            name: entry.name,
            duration: entry.duration
          });
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
    // تقرير الأداء
    const reportWebVitals = async () => {
      if ('web-vital' in window) {
        const { getCLS, getFID, getFCP, getLCP, getTTFB } = await import('web-vitals');
        getCLS(metric => loggerUtils.info('CLS', metric));
        getFID(metric => loggerUtils.info('FID', metric));
        getFCP(metric => loggerUtils.info('FCP', metric));
        getLCP(metric => loggerUtils.info('LCP', metric));
        getTTFB(metric => loggerUtils.info('TTFB', metric));
      }
    };

    reportWebVitals();
  }, []);

  return <>{children}</>;
}