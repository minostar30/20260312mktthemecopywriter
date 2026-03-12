# 월간 마케팅 테마 카피라이터

연도와 월을 선택하면 해당 시즌의 주요 마케팅 이슈를 보여주고, **Google Gemini AI**가 그에 맞는 창의적인 마케팅 테마를 제안하는 웹 앱입니다.

## 기능

- **연도/월 선택**: 2024~2028년, 1~12월 선택
- **마케팅 이슈 편집**: 주요 마케팅 이슈 추가/삭제 가능 (연·월별 localStorage 저장)
- **AI 테마 제안**: "테마 만들기" 버튼 클릭 시 Gemini가 매번 새로운 카피 생성
- **제안 히스토리**: 최대 20개, 최신순 노출
- **키비주얼 생성**: 히스토리의 테마 클릭 시 Gemini 2.5 Flash Image로 이미지 예시 생성

## API 설정 (Vercel 환경 변수)

| 변수명 | 설명 |
|--------|------|
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/apikey)에서 발급 - 테마 카피 + 키비주얼 이미지 생성 |
| `VITE_SUPABASE_URL` | [Supabase](https://supabase.com) 프로젝트 URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase Anon(공개) 키 - 히스토리 저장용 |

Vercel 프로젝트 Settings → Environment Variables에 위 변수들을 추가해주세요.

### Supabase 테이블 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `supabase/migrations/001_theme_history.sql` 내용 실행
3. Project Settings → API에서 URL과 anon key 확인 후 Vercel 환경변수에 추가

> Supabase 미설정 시 히스토리는 localStorage에 저장됩니다 (기기별).

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
