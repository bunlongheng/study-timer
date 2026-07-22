import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

/** Persists a piece of state to localStorage and hydrates from it on mount. */
export function useLocalStorage<T>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const stored = window.localStorage.getItem(key);
      return stored !== null ? (JSON.parse(stored) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Ignore write failures (private browsing, storage quota, etc).
    }
  }, [key, value]);

  return [value, setValue];
}
