import { getMonthData } from '../data/marketingData';

export interface GenerateThemeResponse {
  theme?: string;
  error?: string;
}

const API_KEY_STORAGE = 'gemini-api-key';

export function getStoredApiKey(): string | null {
  try {
    return localStorage.getItem(API_KEY_STORAGE);
  } catch {
    return null;
  }
}

export function setStoredApiKey(key: string | null): void {
  try {
    if (key) {
      localStorage.setItem(API_KEY_STORAGE, key);
    } else {
      localStorage.removeItem(API_KEY_STORAGE);
    }
  } catch {
    // ignore
  }
}

export async function generateThemeWithGemini(
  year: number,
  month: number,
  apiKey?: string | null
): Promise<GenerateThemeResponse> {
  const monthData = getMonthData(month);
  const key = apiKey ?? getStoredApiKey();

  const res = await fetch('/api/generate-theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      year,
      month,
      season: monthData.season,
      issues: monthData.issues,
      ...(key && { apiKey: key }),
    }),
  });

  const data = (await res.json()) as GenerateThemeResponse;

  if (!res.ok) {
    return { error: data.error ?? '테마 생성에 실패했습니다.' };
  }

  return data;
}
