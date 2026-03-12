import { useState, useCallback, useEffect } from 'react';
import { getMonthData } from '../data/marketingData';

const STORAGE_PREFIX = 'marketing-issues';

function getStorageKey(year: number, month: number) {
  return `${STORAGE_PREFIX}-${year}-${month}`;
}

function loadIssues(year: number, month: number): string[] | null {
  try {
    const raw = localStorage.getItem(getStorageKey(year, month));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveIssues(year: number, month: number, issues: string[]) {
  try {
    localStorage.setItem(getStorageKey(year, month), JSON.stringify(issues));
  } catch {
    // ignore
  }
}

export function useCustomIssues(year: number, month: number) {
  const [issues, setIssues] = useState<string[]>(() => {
    const stored = loadIssues(year, month);
    const defaults = getMonthData(month).issues;
    return stored ?? defaults;
  });

  useEffect(() => {
    const stored = loadIssues(year, month);
    const defaults = getMonthData(month).issues;
    setIssues(stored ?? defaults);
  }, [year, month]);

  const addIssue = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setIssues((prev) => {
        if (prev.includes(trimmed)) return prev;
        const next = [...prev, trimmed];
        saveIssues(year, month, next);
        return next;
      });
    },
    [year, month]
  );

  const removeIssue = useCallback(
    (index: number) => {
      setIssues((prev) => {
        const next = prev.filter((_, i) => i !== index);
        saveIssues(year, month, next);
        return next;
      });
    },
    [year, month]
  );

  const resetToDefault = useCallback(() => {
    const defaults = getMonthData(month).issues;
    setIssues(defaults);
    saveIssues(year, month, defaults);
  }, [year, month]);

  return { issues, addIssue, removeIssue, resetToDefault };
}
