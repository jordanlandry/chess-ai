import { useEffect, useState } from "react";

export default function useLocalStorage<T>(key: string, initialValue: any) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      const result = item ? JSON.parse(item) : initialValue;
      return result;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      const serializedValue = JSON.stringify(value);
      window.localStorage.setItem(key, serializedValue);
    } catch {
      console.error(`Failed to set item ${key} in localStorage`);
    }
  }, [key, value]);

  return [value as T, setValue] as const;
}
