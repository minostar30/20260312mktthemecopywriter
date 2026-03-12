-- Supabase SQL Editor에서 실행: RLS 정책 수정
-- 테이블이 비어있거나 INSERT가 안 될 때 이 스크립트를 실행하세요.
-- 경로: Supabase 대시보드 → SQL Editor → New query → 붙여넣기 → Run

-- RLS 활성화 (이미 되어있으면 무시)
ALTER TABLE theme_history ENABLE ROW LEVEL SECURITY;

-- 기존 정책 제거
DROP POLICY IF EXISTS "Allow anonymous insert" ON theme_history;
DROP POLICY IF EXISTS "Allow anonymous select" ON theme_history;
DROP POLICY IF EXISTS "Allow anonymous delete" ON theme_history;

-- anon 역할에 대한 정책 추가 (필수!)
CREATE POLICY "Allow anonymous insert"
  ON theme_history FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Allow anonymous select"
  ON theme_history FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Allow anonymous delete"
  ON theme_history FOR DELETE
  TO anon
  USING (true);
