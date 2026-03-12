import { useState, useCallback, useEffect } from 'react';
import { getMonthData } from '../data/marketingData';

const STORAGE_PREFIX = 'marketing-issues';

function getStorageKey(month: number) {
  return `${STORAGE_PREFIX}-${month}`;
}

function loadIssues(month: number): string[] | null {
  try {
    const raw = localStorage.getItem(getStorageKey(month));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function saveIssues(month: number, issues: string[]) {
  try {
    localStorage.setItem(getStorageKey(month), JSON.stringify(issues));
  } catch {
    // ignore
  }
}

export function useCustomIssues(month: number) {
  const [issues, setIssues] = useState<string[]>(() => {
    const stored = loadIssues(month);
    const defaults = getMonthData(month).issues;
    return stored ?? defaults;
  });

  useEffect(() => {
    const stored = loadIssues(month);
    const defaults = getMonthData(month).issues;
    setIssues(stored ?? defaults);
  }, [month]);

  const addIssue = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setIssues((prev) => {
        if (prev.includes(trimmed)) return prev;
        const next = [...prev, trimmed];
        saveIssues(month, next);
        return next;
      });
    },
    [month]
  );

  const removeIssue = useCallback(
    (index: number) => {
      setIssues((prev) => {
        const next = prev.filter((_, i) => i !== index);
        saveIssues(month, next);
        return next;
      });
    },
    [month]
  );

  const resetToDefault = useCallback(() => {
    const defaults = getMonthData(month).issues;
    setIssues(defaults);
    saveIssues(month, defaults);
  }, [month]);

  return { issues, addIssue, removeIssue, resetToDefault };
}
