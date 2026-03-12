# 월간 마케팅 테마 카피라이터

연도와 월을 선택하면 해당 시즌의 주요 마케팅 이슈를 보여주고, **Google Gemini AI**가 그에 맞는 창의적인 마케팅 테마를 제안하는 웹 앱입니다.

## 기능

- **연도/월 선택**: 2024~2028년, 1~12월 선택
- **시즌별 마케팅 이슈**: 선택한 달의 주요 마케팅 포인트 표시
- **AI 테마 제안**: "테마 만들기" 버튼 클릭 시 Gemini가 매번 새로운 카피 생성
- **히스토리 저장**: 제안된 테마를 선택 월별로 저장 (로컬스토리지)
- **폴백 지원**: API 미설정 시 기본 테마 랜덤 제안

## Gemini API 설정

1. [Google AI Studio](https://aistudio.google.com/apikey)에서 API 키 발급
2. **Vercel 배포 시**: 프로젝트 Settings → Environment Variables → `GEMINI_API_KEY` 추가
3. **로컬 개발 시**: 프로젝트 루트에 `.env.local` 생성 후 `GEMINI_API_KEY=발급받은키` 추가

## 실행 방법

```bash
npm install
```

**로컬 개발 (Gemini API 포함 전체 기능):**
```bash
npx vercel dev
```

**로컬 개발 (프론트엔드만, API 미동작 시 기본 테마 사용):**
```bash
npm run dev
```

## 빌드 및 배포

```bash
npm run build
```

Vercel에 배포하려면:
1. GitHub 저장소를 Vercel에 연결
2. Environment Variables에 `GEMINI_API_KEY` 추가
3. 자동 배포

## 예시 테마 (2026년)

| 월 | 테마 |
|---|---|
| 1월 | 올해 첫 피자는 도미노피자 |
| 3월 | 새학기, 새출발 도미노피자 |
| 4월 | 도미노 꽃이 피었습니다 |
