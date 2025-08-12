class Cache {
  constructor() {
    this.cache = new Map();
    this.maxAge = 5 * 60 * 1000; // 5 хвилин за замовчуванням
  }

  set(key, value, maxAge = this.maxAge) {
    const item = {
      value,
      timestamp: Date.now(),
      maxAge
    };
    this.cache.set(key, item);
  }

  get(key) {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }

    const now = Date.now();
    const age = now - item.timestamp;

    if (age > item.maxAge) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  has(key) {
    return this.get(key) !== null;
  }

  delete(key) {
    return this.cache.delete(key);
  }

  clear() {
    this.cache.clear();
  }

  size() {
    return this.cache.size;
  }

  // Очищення застарілих записів
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      const age = now - item.timestamp;
      if (age > item.maxAge) {
        this.cache.delete(key);
      }
    }
  }
}

// Глобальний екземпляр кешу
export const cache = new Cache();

// Автоматичне очищення кешу кожні 10 хвилин
setInterval(() => {
  cache.cleanup();
}, 10 * 60 * 1000);

export default Cache;
