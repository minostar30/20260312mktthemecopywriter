import { GoogleGenAI } from '@google/genai';

interface RequestBody {
  year: number;
  month: number;
  season: string;
  issues: string[];
  apiKey?: string;
}

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { year, month, season, issues, apiKey: clientApiKey } = body;

    const apiKey = clientApiKey?.trim() || process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: 'API 키가 필요합니다. 아래 입력란에 Gemini API 키를 입력하거나, Vercel 환경 변수에 GEMINI_API_KEY를 추가해주세요.',
        },
        { status: 500 }
      );
    }

    if (!year || !month) {
      return Response.json(
        { error: 'year와 month가 필요합니다.' },
        { status: 400 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const monthNames: Record<number, string> = {
      1: '1월', 2: '2월', 3: '3월', 4: '4월', 5: '5월', 6: '6월',
      7: '7월', 8: '8월', 9: '9월', 10: '10월', 11: '11월', 12: '12월',
    };
    const monthName = monthNames[month] ?? `${month}월`;

    const prompt = `당신은 피자 프랜차이즈(예: 도미노피자)의 월간 마케팅 카피라이터입니다.

${year}년 ${monthName}의 시즌/맥락: ${season}
주요 마케팅 이슈: ${issues.join(', ')}

위 정보를 바탕으로, 해당 월에 맞는 창의적이고 독창적인 마케팅 테마 카피를 1개만 작성해주세요.

요구사항:
- 카피는 짧고 임팩트 있게 (15자 이내 권장, 최대 25자)
- 브랜드명을 자연스럽게 포함할 수 있음 (예: 도미노피자)
- 해당 월/시즌의 특성을 살린 워드플레이나 감성 표현
- 이전과 겹치지 않는 완전히 새로운 아이디어
- 다른 카피와 비슷하지 않게 매번 다른 스타일로 제안

카피만 출력하고, 설명이나 따옴표 없이 한 줄로 답해주세요.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents: prompt,
    });

    const text = response.text?.trim();
    if (!text) {
      return Response.json(
        { error: 'Gemini가 응답을 생성하지 못했습니다.' },
        { status: 500 }
      );
    }

    return Response.json({ theme: text });
  } catch (err) {
    const message = err instanceof Error ? err.message : '알 수 없는 오류';
    return Response.json(
      { error: `테마 생성 실패: ${message}` },
      { status: 500 }
    );
  }
}
