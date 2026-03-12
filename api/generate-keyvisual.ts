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
  } catch (err: unknown) {
    let message = '알 수 없는 오류';
    if (err && typeof err === 'object' && 'message' in err) {
      const msg = String((err as { message?: unknown }).message ?? '');
      if (
        msg.includes('429') ||
        msg.includes('quota') ||
        msg.includes('RESOURCE_EXHAUSTED')
      ) {
        message =
          'API 사용량 제한에 도달했습니다. 이미지 생성은 무료 티어 제한이 엄격합니다. 잠시 후 다시 시도하시거나, Google AI Studio에서 유료 플랜을 고려해주세요.';
      } else if (msg.length > 0 && msg.length < 200) {
        message = msg;
      }
    }
    return Response.json(
      { error: `키비주얼 생성 실패: ${message}` },
      { status: 500 }
    );
  }
}
