import { useState, useEffect } from 'react';
import { getMonthData, getRandomTheme, MONTH_NAMES } from './data/marketingData';
import { useThemeHistory } from './hooks/useThemeHistory';
import {
  generateThemeWithGemini,
  getStoredApiKey,
  setStoredApiKey,
} from './api/generateTheme';
import './App.css';

const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 5 }, (_, i) => CURRENT_YEAR - 2 + i);
const GEMINI_KEY_URL = 'https://aistudio.google.com/apikey';

function App() {
  const [year, setYear] = useState(CURRENT_YEAR);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [currentTheme, setCurrentTheme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyInput, setApiKeyInput] = useState('');

  const { addToHistory, historyBySelection, clearHistory } = useThemeHistory();
  const monthData = getMonthData(month);
  const selectionHistory = historyBySelection(year, month);
  const hasApiKey = !!getStoredApiKey();

  useEffect(() => {
    if (!hasApiKey) setShowApiKey(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps -- 초기 로드 시에만

  const handleSaveApiKey = () => {
    const key = apiKeyInput.trim();
    if (key) {
      setStoredApiKey(key);
      setApiKeyInput('');
      setShowApiKey(false);
      setError(null);
    }
  };

  const handleClearApiKey = () => {
    setStoredApiKey(null);
    setApiKeyInput('');
    setShowApiKey(true);
  };

  const handleCreateTheme = async () => {
    setIsLoading(true);
    setError(null);
    setCurrentTheme(null);

    try {
      const result = await generateThemeWithGemini(year, month);
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
          {monthData.issues.map((issue, i) => (
            <span key={i} className="issue-tag">
              {issue}
            </span>
          ))}
        </div>
      </section>

      {showApiKey && (
        <section className="apikey-section">
          <h2>Gemini API 키 설정</h2>
          <p className="apikey-desc">
            AI 테마 생성을 위해{' '}
            <a href={GEMINI_KEY_URL} target="_blank" rel="noopener noreferrer">
              Google AI Studio
            </a>
            에서 API 키를 발급받아 입력해주세요.
          </p>
          <div className="apikey-row">
            <input
              type="password"
              placeholder="API 키 입력"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSaveApiKey()}
              className="apikey-input"
            />
            <button
              type="button"
              className="apikey-save-btn"
              onClick={handleSaveApiKey}
              disabled={!apiKeyInput.trim()}
            >
              저장
            </button>
          </div>
          <div className="apikey-actions">
            {hasApiKey && (
              <button
                type="button"
                className="apikey-clear"
                onClick={handleClearApiKey}
              >
                저장된 키 삭제
              </button>
            )}
            <button
              type="button"
              className="apikey-toggle"
              onClick={() => setShowApiKey(false)}
            >
              닫기
            </button>
          </div>
        </section>
      )}

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
              {year}년 {MONTH_NAMES[month]} (최신순)
            </span>
          </div>
          <ul className="history-list">
            {selectionHistory.map((item) => (
              <li key={item.id} className="history-item">
                <span className="history-theme">{item.theme}</span>
                <span className="history-date">
                  {new Date(item.createdAt).toLocaleString('ko-KR')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      <footer className="footer">
        <button
          type="button"
          className="footer-link"
          onClick={() => setShowApiKey(true)}
        >
          {hasApiKey ? 'API 키 변경' : 'API 키 설정'}
        </button>
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
