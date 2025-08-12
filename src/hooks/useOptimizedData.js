import { useState, useEffect, useCallback } from 'react';
import { cache } from '../utils/cache';

export const useOptimizedData = (key, fetchFunction, options = {}) => {
  const {
    maxAge = 5 * 60 * 1000, // 5 хвилин
    dependencies = [],
    skip = false
  } = options;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (skip) return;

    // Перевіряємо кеш
    const cachedData = cache.get(key);
    if (cachedData) {
      setData(cachedData);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction();
      
      // Зберігаємо в кеш
      cache.set(key, result, maxAge);
      
      setData(result);
    } catch (err) {
      setError(err);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  }, [key, fetchFunction, maxAge, skip, ...dependencies]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    cache.delete(key);
    fetchData();
  }, [key, fetchData]);

  return {
    data,
    loading,
    error,
    refetch
  };
};

export default useOptimizedData;
