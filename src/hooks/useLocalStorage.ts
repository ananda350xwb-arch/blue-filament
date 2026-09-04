import { useState, useEffect, useCallback, useRef } from 'react';

// Custom event name for same-tab cross-component synchronization
const STORAGE_EVENT_NAME = 'blue_filament_local_storage_sync';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const isInternalUpdate = useRef(false);

  // Sync state to localStorage whenever storedValue changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
      // Dispatch custom event for same-window component updates
      if (isInternalUpdate.current) {
        window.dispatchEvent(new CustomEvent(STORAGE_EVENT_NAME, { detail: { key, value: storedValue } }));
        isInternalUpdate.current = false;
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Listen to storage events from other tabs / windows
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

    // Listen to custom event for same-tab updates
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
    isInternalUpdate.current = true;
    setStoredValue(prev => {
      const valueToStore = value instanceof Function ? value(prev) : value;
      return valueToStore;
    });
  }, []);

  return [storedValue, setValue];
}
