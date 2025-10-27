import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const FiltersContext = createContext({
  filters: {},
  setFilters: () => {},
  resetFilters: () => {},
});

function sanitizeFilters(next) {
  if (!next || typeof next !== 'object') return {};
  const cleaned = {};
  Object.entries(next).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    if (typeof value === 'string') {
      const trimmed = value.trim();
      if (trimmed === '') return;
      cleaned[key] = trimmed;
      return;
    }
    cleaned[key] = value;
  });
  return cleaned;
}

export function FiltersProvider({ children }) {
  const [filters, setFiltersState] = useState({});

  const setFilters = useCallback((updater) => {
    setFiltersState((prev) => {
      const resolved = typeof updater === 'function' ? updater(prev) : updater;
      return sanitizeFilters(resolved);
    });
  }, []);

  const resetFilters = useCallback(() => setFiltersState({}), []);

  const value = useMemo(
    () => ({ filters, setFilters, resetFilters }),
    [filters, setFilters, resetFilters],
  );

  return <FiltersContext.Provider value={value}>{children}</FiltersContext.Provider>;
}

export function useFilters() {
  return useContext(FiltersContext);
}
