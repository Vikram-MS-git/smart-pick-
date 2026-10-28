import { createContext, useContext, useEffect, useState } from "react";

// Lightweight client-only state for the "Add to Compare" flow.
// Persists to sessionStorage only so a demo can refresh a page without
// losing selections. No backend involved — this will be swapped for a
// server-synced cart-like store when the real API layer is added.

const CompareContext = createContext(null);
const STORAGE_KEY = "smartpick.compareList";
const MAX_COMPARE = 3;

export function CompareProvider({ children }) {
  const [compareIds, setCompareIds] = useState(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(compareIds));
    } catch {
      /* ignore storage errors */
    }
  }, [compareIds]);

  const isComparing = (id) => compareIds.includes(id);

  const toggleCompare = (id) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((p) => p !== id);
      if (prev.length >= MAX_COMPARE) return prev;
      return [...prev, id];
    });
  };

  const clearCompare = () => setCompareIds([]);

  return (
    <CompareContext.Provider value={{ compareIds, isComparing, toggleCompare, clearCompare, MAX_COMPARE }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within CompareProvider");
  return ctx;
}
