import { useState, useEffect, useCallback } from 'react';

// Custom event name for same-tab cross-component synchronization
const STORAGE_EVENT_NAME = 'blue_filament_local_storage_sync';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item);
      }
      // If item doesn't exist, initialize it in localStorage
      window.localStorage.setItem(key, JSON.stringify(initialValue));
      return initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Listen to storage events from other tabs/windows and same-tab custom events
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch {
          // ignore parsing errors
        }
      }
    };

    const handleCustomSync = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: T }>;
      if (customEvent.detail && customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(STORAGE_EVENT_NAME, handleCustomSync);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(STORAGE_EVENT_NAME, handleCustomSync);
    };
  }, [key]);

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        try {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
          // Dispatch custom event for same-window component updates
          window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME, { detail: { key, value: valueToStore } }));
        } catch (err) {
          console.warn(`Error saving to localStorage key "${key}":`, err);
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting state for key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

