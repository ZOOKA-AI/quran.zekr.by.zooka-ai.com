export const cacheUtils = {
  set(key, value, ttl = 3600000) {
    try {
      const item = {
        value,
        timestamp: Date.now(),
        ttl
      };
      localStorage.setItem(`cache_${key}`, JSON.stringify(item));
    } catch (e) {
      console.warn(`Cache set failed for key: ${key}`, e);
    }
  },

  get(key) {
    try {
      const item = localStorage.getItem(`cache_${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);
      const isExpired = Date.now() - parsed.timestamp > parsed.ttl;
      
      if (isExpired) {
        this.remove(key);
        return null;
      }

      return parsed.value;
    } catch (e) {
      console.warn(`Cache get failed for key: ${key}`, e);
      return null;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(`cache_${key}`);
    } catch (e) {
      console.warn(`Cache remove failed for key: ${key}`, e);
    }
  },

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith('cache_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (e) {
      console.warn('Cache clear failed', e);
    }
  }
};