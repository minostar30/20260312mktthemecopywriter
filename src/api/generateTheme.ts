import { getMonthData } from '../data/marketingData';

export interface GenerateThemeResponse {
  theme?: string;
  error?: string;
}

export async function generateThemeWithGemini(
  year: number,
  month: number
): Promise<GenerateThemeResponse> {
  const monthData = getMonthData(month);

  const res = await fetch('/api/generate-theme', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      year,
      month,
      season: monthData.season,
      issues: monthData.issues,
    }),
  });

  const data = (await res.json()) as GenerateThemeResponse;

  if (!res.ok) {
    return { error: data.error ?? '테마 생성에 실패했습니다.' };
  }

  return data;
}
