import { useState, useEffect } from "react";

// Tipe Generic T untuk menentukan tipe data yang disimpan
type SetValue<T> = (value: T | ((val: T) => T)) => void;

/**
 * Hook kustom untuk menyinkronkan state dengan localStorage.
 * @param {string} key Kunci yang digunakan di localStorage.
 * @param {T} initialValue Nilai awal jika tidak ada data di localStorage.
 * @returns {[T, SetValue<T>]} Array berisi state saat ini dan fungsi setter.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem(key, JSON.stringify(value));
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error);
      }
    }
  }, [key, value]);

  return [value, setValue];
}
