export const performanceUtils = {
  mark(name) {
    if (typeof performance !== 'undefined' && performance.mark) {
      performance.mark(name);
    }
  },

  measure(name, startMark, endMark) {
    if (typeof performance !== 'undefined' && performance.measure) {
      try {
        performance.measure(name, startMark, endMark);
      } catch (e) {
        console.warn(`Performance measurement failed: ${name}`, e);
      }
    }
  },

  async measureAsync(callback, label) {
    const startMark = `${label}-start`;
    const endMark = `${label}-end`;
    this.mark(startMark);
    const result = await callback();
    this.mark(endMark);
    this.measure(label, startMark, endMark);
    return { result, duration: performance.getEntriesByName(label)[0]?.duration || 0 };
  },

  getMetrics(name) {
    if (typeof performance !== 'undefined' && performance.getEntriesByName) {
      return performance.getEntriesByName(name);
    }
    return [];
  },

  logMetrics() {
    if (typeof performance !== 'undefined') {
      const entries = performance.getEntries();
      console.log('Performance Metrics:', entries);
    }
  }
};