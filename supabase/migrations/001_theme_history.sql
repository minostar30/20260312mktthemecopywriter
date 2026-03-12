-- 테마 히스토리 테이블
CREATE TABLE IF NOT EXISTS theme_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL,
  year INTEGER NOT NULL,
  month INTEGER NOT NULL,
  theme TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 인덱스: client_id + month로 조회 최적화
CREATE INDEX IF NOT EXISTS idx_theme_history_client_month
  ON theme_history (client_id, month DESC);

-- RLS 활성화
ALTER TABLE theme_history ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거 (재실행 시)
DROP POLICY IF EXISTS "Allow anonymous insert" ON theme_history;
DROP POLICY IF EXISTS "Allow anonymous select" ON theme_history;
DROP POLICY IF EXISTS "Allow anonymous delete" ON theme_history;

-- 정책: anon 사용자의 INSERT 허용
CREATE POLICY "Allow anonymous insert"
  ON theme_history FOR INSERT
  TO anon
  WITH CHECK (true);

-- 정책: anon 사용자의 SELECT 허용 (client_id는 앱에서 필터링)
CREATE POLICY "Allow anonymous select"
  ON theme_history FOR SELECT
  TO anon
  USING (true);

-- 정책: anon 사용자의 DELETE 허용
CREATE POLICY "Allow anonymous delete"
  ON theme_history FOR DELETE
  TO anon
  USING (true);
