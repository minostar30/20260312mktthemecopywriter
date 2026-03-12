import { useState } from 'react';
import { getMonthData, getRandomTheme, MONTH_NAMES } from './data/marketingData';
import { useThemeHistory } from './hooks/useThemeHistory';
import { useCustomIssues } from './hooks/useCustomIssues';
import { generateThemeWithGemini } from './api/generateTheme';
import { generateKeyvisual } from './api/generateKeyvisual';
import './App.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);

function App() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newIssueInput, setNewIssueInput] = useState('');
  const [keyvisualTheme, setKeyvisualTheme] = useState<string | null>(null);
  const [keyvisualUrl, setKeyvisualUrl] = useState<string | null>(null);
  const [keyvisualLoading, setKeyvisualLoading] = useState(false);
  const [keyvisualError, setKeyvisualError] = useState<string | null>(null);

  const { addToHistory, historyBySelection, clearHistory } = useThemeHistory();
  const monthData = getMonthData(month);
  const { issues, addIssue, removeIssue, resetToDefault } = useCustomIssues(
    year,
    month
  );
  const selectionHistory = historyBySelection(year, month);

  const handleCreateTheme = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentTheme(null);

    try {
      const result = await generateThemeWithGemini(year, month, issues);
      if (result.error) {
        setError(result.error);
        const fallbackTheme = getRandomTheme(month);
        setCurrentTheme(fallbackTheme);
        addToHistory(year, month, fallbackTheme);
      } else if (result.theme) {
        setCurrentTheme(result.theme);
        addToHistory(year, month, result.theme);
      }
    } catch {
      setError('API 연결에 실패했습니다. 기본 테마를 제안합니다.');
      const fallbackTheme = getRandomTheme(month);
      setCurrentTheme(fallbackTheme);
      addToHistory(year, month, fallbackTheme);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddIssue = () => {
    addIssue(newIssueInput);
    setNewIssueInput('');
  };

  const handleHistoryThemeClick = async (theme: string) => {
    setKeyvisualTheme(theme);
    setKeyvisualUrl(null);
    setKeyvisualError(null);
    setKeyvisualLoading(true);

    try {
      const result = await generateKeyvisual(theme);
      if (result.error) {
        setKeyvisualError(result.error);
      } else if (result.imageUrl) {
        setKeyvisualUrl(result.imageUrl);
      }
    } catch {
      setKeyvisualError('키비주얼 생성에 실패했습니다.');
    } finally {
      setKeyvisualLoading(false);
    }
  };

  const closeKeyvisualModal = () => {
    setKeyvisualTheme(null);
    setKeyvisualUrl(null);
    setKeyvisualError(null);
  };

  return (
    <div className="app">
      <header className="header">
        <h1>월간 마케팅 테마 카피라이터</h1>
        <p>연도와 월을 선택하고 시즌에 맞는 마케팅 테마를 받아보세요</p>
      </header>

      <section className="selectors">
        <div className="selector-group">
          <label htmlFor="year">연도</label>
          <select
            id="year"
            value={year}
            onChange={(e) => {
              setYear(Number(e.target.value));
              setCurrentTheme(null);
            }}
          >
            {YEARS.map((y) => (
              <option key={y} value={y}>
                {y}년
              </option>
            ))}
          </select>
        </div>
        <div className="selector-group">
          <label htmlFor="month">월</label>
          <select
            id="month"
            value={month}
            onChange={(e) => {
              setMonth(Number(e.target.value));
              setCurrentTheme(null);
            }}
          >
            {Object.entries(MONTH_NAMES).map(([m, name]) => (
              <option key={m} value={m}>
                {name}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="issues-section">
        <h2>{year}년 {MONTH_NAMES[month]} 주요 마케팅 이슈</h2>
        <div className="issues-grid">
          {issues.map((issue, i) => (
            <span key={`${issue}-${i}`} className="issue-tag">
              {issue}
              <button
                type="button"
                className="issue-remove"
                onClick={() => removeIssue(i)}
                title="삭제"
                aria-label={`${issue} 삭제`}
              >
                ×
              </button>
            </span>
          ))}
        </div>
        <div className="issues-add">
          <input
            type="text"
            placeholder="이슈 추가"
            value={newIssueInput}
            onChange={(e) => setNewIssueInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddIssue()}
            className="issues-input"
          />
          <button
            type="button"
            className="issues-add-btn"
            onClick={handleAddIssue}
            disabled={!newIssueInput.trim()}
          >
            추가
          </button>
          <button
            type="button"
            className="issues-reset-btn"
            onClick={resetToDefault}
            title="기본값으로 초기화"
          >
            초기화
          </button>
        </div>
      </section>

      <section className="theme-section">
        <button
          type="button"
          className="create-btn"
          onClick={handleCreateTheme}
          disabled={isLoading}
        >
          {isLoading ? 'AI가 테마를 만들고 있어요...' : '테마 만들기'}
        </button>
        {error && (
          <div className="theme-error" role="alert">
            {error}
          </div>
        )}
        {currentTheme && (
          <div className="current-theme">
            <span className="theme-label">제안 테마</span>
            <p className="theme-text">{currentTheme}</p>
          </div>
        )}
      </section>

      {selectionHistory.length > 0 && (
        <section className="history-section">
          <div className="history-header">
            <h2>제안 히스토리</h2>
            <span className="history-subtitle">
              {year}년 {MONTH_NAMES[month]} (최신순, 최대 20개)
            </span>
          </div>
          <ul className="history-list">
            {selectionHistory.map((item) => (
              <li key={item.id} className="history-item">
                <button
                  type="button"
                  className="history-theme-btn"
                  onClick={() => handleHistoryThemeClick(item.theme)}
                  title="클릭 시 키비주얼 생성"
                >
                  {item.theme}
                </button>
                <span className="history-date">
                  {new Date(item.createdAt).toLocaleString('ko-KR')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {keyvisualTheme && (
        <div
          className="keyvisual-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="keyvisual-title"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeKeyvisualModal();
          }}
        >
          <div className="keyvisual-modal">
            <div className="keyvisual-header">
              <h2 id="keyvisual-title">키비주얼 예시</h2>
              <button
                type="button"
                className="keyvisual-close"
                onClick={closeKeyvisualModal}
                aria-label="닫기"
              >
                ×
              </button>
            </div>
            <p className="keyvisual-theme">{keyvisualTheme}</p>
            {keyvisualLoading && (
              <div className="keyvisual-loading">
                AI가 키비주얼을 생성하고 있습니다 (20~40초 소요)
              </div>
            )}
            {keyvisualError && (
              <div className="keyvisual-error">{keyvisualError}</div>
            )}
            {keyvisualUrl && (
              <img
                src={keyvisualUrl}
                alt={`${keyvisualTheme} 키비주얼`}
                className="keyvisual-image"
              />
            )}
          </div>
        </div>
      )}

      <footer className="footer">
        <button
          type="button"
          className="clear-btn"
          onClick={clearHistory}
          title="모든 히스토리 삭제"
        >
          히스토리 초기화
        </button>
      </footer>
    </div>
  );
}

export default App;
