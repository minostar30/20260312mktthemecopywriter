import { useState, useCallback, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export interface ThemeHistoryItem {
  id: string;
  year: number;
  month: number;
  theme: string;
  createdAt: string;
}

const STORAGE_KEY = 'marketing-theme-history';
const CLIENT_ID_KEY = 'marketing-theme-client-id';

function getOrCreateClientId(): string {
  try {
    let id = localStorage.getItem(CLIENT_ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(CLIENT_ID_KEY, id);
    }
    return id;
  } catch {
    return crypto.randomUUID();
  }
}

function loadFromLocalStorage(): ThemeHistoryItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToLocalStorage(items: ThemeHistoryItem[]) {
  try {
    const toSave = items.slice(0, 100);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // ignore
  }
}

export function useThemeHistory() {
  const [history, setHistory] = useState<ThemeHistoryItem[]>(() =>
    isSupabaseConfigured() ? [] : loadFromLocalStorage()
  );
  const [isLoading, setIsLoading] = useState(isSupabaseConfigured());
  const clientId = getOrCreateClientId();

  const fetchHistory = useCallback(async () => {
    if (!supabase) return;
    try {
      const { data, error } = await supabase
        .from('theme_history')
        .select('id, year, month, theme, created_at')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHistory(
        (data ?? []).map((row) => ({
          id: row.id,
          year: row.year,
          month: row.month,
          theme: row.theme,
          createdAt: row.created_at,
        }))
      );
    } catch {
      setHistory([]);
    } finally {
      setIsLoading(false);
    }
  }, [clientId]);

  useEffect(() => {
    if (isSupabaseConfigured()) {
      fetchHistory();
    } else {
      setIsLoading(false);
    }
  }, [fetchHistory]);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      saveToLocalStorage(history);
    }
  }, [history]);

  const addToHistory = useCallback(
    async (year: number, month: number, theme: string) => {
      const item: ThemeHistoryItem = {
        id: crypto.randomUUID(),
        year,
        month,
        theme,
        createdAt: new Date().toISOString(),
      };

      if (supabase) {
        try {
          const { error } = await supabase.from('theme_history').insert({
            id: item.id,
            client_id: clientId,
            year: item.year,
            month: item.month,
            theme: item.theme,
          });
          if (error) {
            console.error('[Supabase] 히스토리 저장 실패:', error.message, error.details);
            throw error;
          }
        } catch (err) {
          console.error('[Supabase] insert error:', err);
          setHistory((prev) => [item, ...prev]);
          return item;
        }
        setHistory((prev) => [item, ...prev]);
      } else {
        setHistory((prev) => [item, ...prev]);
      }
      return item;
    },
    [clientId]
  );

  const removeFromHistory = useCallback(
    async (id: string) => {
      if (supabase) {
        try {
          await supabase
            .from('theme_history')
            .delete()
            .eq('id', id)
            .eq('client_id', clientId);
        } catch {
          // optimistic update 실패 시 로컬에서만 제거
        }
      }
      setHistory((prev) => prev.filter((item) => item.id !== id));
    },
    [clientId]
  );

  const historyBySelection = useCallback(
    (month: number) =>
      history.filter((h) => h.month === month).slice(0, 20),
    [history]
  );

  return {
    history,
    isLoading,
    addToHistory,
    removeFromHistory,
    historyBySelection,
  };
}
