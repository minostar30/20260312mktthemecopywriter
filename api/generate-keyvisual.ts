import { GoogleGenAI } from '@google/genai';

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: 'GEMINI_API_KEY가 설정되지 않았습니다. Vercel 환경 변수에 API 키를 추가해주세요.',
        },
        { status: 500 }
      );
    }

    const body = (await request.json()) as { theme?: string };
    const theme = body.theme?.trim();
    if (!theme) {
      return Response.json(
        { error: 'theme 파라미터가 필요합니다.' },
        { status: 400 }
      );
    }

    const prompt = `Marketing key visual for pizza brand advertisement.
Theme/copy: "${theme}"
Style: Professional, appetizing, high-quality food photography, warm lighting, clean composition, Korean pizza brand aesthetic.
No text overlay - image only.`;

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
      config: {
        responseModalities: ['IMAGE'],
        imageConfig: { aspectRatio: '16:9' },
      },
    });

    const res = response as {
      candidates?: Array<{
        content?: { parts?: Array<{ inlineData?: { data?: string; mimeType?: string } }> };
      }>;
    };
    let imageDataUrl: string | null = null;
    for (const c of res.candidates ?? []) {
      for (const part of c.content?.parts ?? []) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType ?? 'image/png';
          imageDataUrl = `data:${mime};base64,${part.inlineData.data}`;
          break;
        }
      }
      if (imageDataUrl) break;
    }

    if (!imageDataUrl) {
      return Response.json(
        { error: '이미지 생성에 실패했습니다.' },
        { status: 500 }
      );
    }

    return Response.json({ imageUrl: imageDataUrl });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '알 수 없는 오류';
    return Response.json(
      { error: `키비주얼 생성 실패: ${message}` },
      { status: 500 }
    );
  }
}
