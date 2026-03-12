export interface GenerateKeyvisualResponse {
  imageUrl?: string;
  error?: string;
}

export async function generateKeyvisual(
  theme: string
): Promise<GenerateKeyvisualResponse> {
  const res = await fetch('/api/generate-keyvisual', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ theme }),
  });

  const data = (await res.json()) as GenerateKeyvisualResponse;

  if (!res.ok) {
    return { error: data.error ?? '키비주얼 생성에 실패했습니다.' };
  }

  return data;
}
