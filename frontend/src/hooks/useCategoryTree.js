import { useEffect, useState } from 'react';
import { fetchCategoryTree } from '@/api/listings';

export function useCategoryTree() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isActive = true;

    setLoading(true);
    setError(null);

    fetchCategoryTree()
      .then((data) => {
        if (!isActive) return;
        setCategories(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (!isActive) return;
        setError(err);
        setCategories([]);
      })
      .finally(() => {
        if (!isActive) return;
        setLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return { categories, loading, error };
}
