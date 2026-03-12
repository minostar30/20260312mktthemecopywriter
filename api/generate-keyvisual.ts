const NANOBANANA_BASE = 'https://nanobnana.com/api/v2';

interface GenerateResponse {
  code: number;
  message: string;
  data?: { task_id?: string };
}

interface StatusResponse {
  code: number;
  message: string;
  data?: {
    status: number;
    response: string | null;
    error_message: string | null;
  };
}

async function pollTaskStatus(
  taskId: string,
  apiKey: string,
  maxAttempts = 60
): Promise<string | null> {
  for (let i = 0; i < maxAttempts; i++) {
    await new Promise((r) => setTimeout(r, 2000));
    const res = await fetch(
      `${NANOBANANA_BASE}/status?task_id=${encodeURIComponent(taskId)}`,
      { headers: { Authorization: `Bearer ${apiKey}` } }
    );
    const data = (await res.json()) as StatusResponse;
    if (data.code !== 200 || !data.data) continue;
    const { status, response, error_message } = data.data;
    if (status === 1 && response) {
      const urls = JSON.parse(response) as string[];
      return urls[0] ?? null;
    }
    if (status === -1) {
      throw new Error(error_message ?? '이미지 생성에 실패했습니다.');
    }
  }
  throw new Error('이미지 생성 시간이 초과되었습니다.');
}

export async function POST(request: Request) {
  try {
    const apiKey = process.env.NANOBANANA_API_KEY;
    if (!apiKey) {
      return Response.json(
        {
          error: 'NANOBANANA_API_KEY가 설정되지 않았습니다. Vercel 환경 변수에 API 키를 추가해주세요.',
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

    const generateRes = await fetch(`${NANOBANANA_BASE}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        prompt,
        aspect_ratio: '16:9',
        size: '2K',
        format: 'png',
      }),
    });

    const genData = (await generateRes.json()) as GenerateResponse;
    if (genData.code !== 200 || !genData.data?.task_id) {
      return Response.json(
        {
          error:
            genData.message ?? '이미지 생성 요청에 실패했습니다.',
        },
        { status: 500 }
      );
    }

    const imageUrl = await pollTaskStatus(genData.data.task_id, apiKey);
    return Response.json({ imageUrl });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : '알 수 없는 오류';
    return Response.json(
      { error: `키비주얼 생성 실패: ${message}` },
      { status: 500 }
    );
  }
}
