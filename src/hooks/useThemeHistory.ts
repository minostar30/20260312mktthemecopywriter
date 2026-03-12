import { useState, useCallback, useEffect } from 'react';

export interface ThemeHistoryItem {
  id: string;
  year: number;
  month: number;
  theme: string;
  createdAt: string;
}

const STORAGE_KEY = 'marketing-theme-history';

function loadHistory(): ThemeHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveHistory(items: ThemeHistoryItem[]) {
  try {
    const toSave = items.slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

export function useThemeHistory() {
  const [history, setHistory] = useState<ThemeHistoryItem[]>(() => loadHistory());

  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const addToHistory = useCallback((year: number, month: number, theme: string) => {
    const item: ThemeHistoryItem = {
      id: crypto.randomUUID(),
      year,
      month,
      theme,
      createdAt: new Date().toISOString(),
    };
    setHistory((prev) => [item, ...prev]);
    return item;
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const historyBySelection = useCallback(
    (year: number, month: number) =>
      history
        .filter((h) => h.year === year && h.month === month)
        .slice(0, 20),
    [history]
  );

  return { history, addToHistory, clearHistory, historyBySelection };
}
