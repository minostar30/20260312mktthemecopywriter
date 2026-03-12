export interface MonthData {
  month: number;
  season: string;
  issues: string[];
  themes: string[];
}

export const MONTH_NAMES: Record<number, string> = {
  1: '1월', 2: '2월', 3: '3월', 4: '4월', 5: '5월', 6: '6월',
  7: '7월', 8: '8월', 9: '9월', 10: '10월', 11: '11월', 12: '12월',
};

export const MONTHLY_DATA: Record<number, MonthData> = {
  1: {
    month: 1,
    season: '신년/겨울',
    issues: ['신년 각오', '겨울 휴가', '연말연시 분위기', '새해 첫 소비'],
    themes: [
      '올해 첫 피자는 도미노피자',
      '새해 첫 한 끼, 특별한 선택',
      '2026 첫 맛, 여기서 시작',
      '새해엔 역시 첫 피자',
    ],
  },
  2: {
    month: 2,
    season: '설날/밸런타인',
    issues: ['설날 명절', '밸런타인데이', '겨울 마지막', '가족 모임'],
    themes: [
      '설 연휴, 함께하는 특별한 시간',
      '2월 14일, 사랑을 나눠요',
      '설날 피자로 모이는 웃음',
      '달콤한 2월, 특별한 선물',
    ],
  },
  3: {
    month: 3,
    season: '새학기/개강',
    issues: ['새학기 개강', '졸업/입학', '봄의 시작', '새로운 도전'],
    themes: [
      '새학기, 새출발 도미노피자',
      '개강 피자로 힘내세요',
      '새 학기 첫 모임은 여기서',
      '봄과 함께 새 출발',
    ],
  },
  4: {
    month: 4,
    season: '봄/꽃놀이',
    issues: ['벚꽃 시즌', '봄 소풍', '환절기 건강', '4월의 로맨스'],
    themes: [
      '도미노 꽃이 피었습니다',
      '봄날, 꽃보다 피자',
      '벚꽃 아래 특별한 한 끼',
      '4월의 달콤함이 피었어요',
    ],
  },
  5: {
    month: 5,
    season: '가정의달/어린이날',
    issues: ['가정의 달', '어린이날', '어버이날', '가족 소통'],
    themes: [
      '가족이 모이는 5월, 도미노가 함께',
      '어린이날 특별 피자',
      '엄마 아빠와 함께하는 특별한 날',
      '5월, 가족의 맛',
    ],
  },
  6: {
    month: 6,
    season: '여름 준비/시험기간',
    issues: ['수능 D-100', '여름 시즌 준비', '장마철', '휴가 계획'],
    themes: [
      '시험 기간, 맛있는 보람',
      '6월의 여름 준비',
      '빗속에도 따뜻한 한 끼',
      '여름 전 벼르는 특별함',
    ],
  },
  7: {
    month: 7,
    season: '여름/휴가',
    issues: ['여름 휴가', '장마', '휴가 패키지', '시원한 여름'],
    themes: [
      '휴가 중에도 맛있는 피자',
      '시원한 여름, 뜨거운 맛',
      '7월 휴가 특급 한 끼',
      '여름밤 특별한 모임',
    ],
  },
  8: {
    month: 8,
    season: '한여름/광복절',
    issues: ['한여름 휴가', '광복절', '맞춤 휴가', '여름 이벤트'],
    themes: [
      '한여름 밤의 특별한 만남',
      '8월, 자유로움의 맛',
      '휴가 피크, 맛도 피크',
      '여름 끝자락 특별함',
    ],
  },
  9: {
    month: 9,
    season: '추석/가을',
    issues: ['추석 명절', '가을 입學', '풍성한 가을', '가족 모임'],
    themes: [
      '추석, 함께하는 둥글둥글한 시간',
      '가을의 첫 맛',
      '풍성한 명절, 풍성한 맛',
      '9월 가족의 웃음',
    ],
  },
  10: {
    month: 10,
    season: '가을/할로윈',
    issues: ['할로윈', '단풍 시즌', '가을 소풍', '건강의 달'],
    themes: [
      '할로윈 특별 에디션',
      '가을 단풍만큼 특별한 맛',
      '10월의 감성 한 끼',
      '가을밤 특별한 선물',
    ],
  },
  11: {
    month: 11,
    season: '빼빼로데이/가을 마무리',
    issues: ['빼빼로데이', '11.11 쇼핑', '가을 마무리', '연말 준비'],
    themes: [
      '11월 11일, 1+1의 맛',
      '가을 마지막 특별함',
      '빼빼로데이 특별 세트',
      '11월, 따뜻한 한 끼',
    ],
  },
  12: {
    month: 12,
    season: '연말/크리스마스',
    issues: ['크리스마스', '연말 파티', '송년 모임', '겨울 분위기'],
    themes: [
      '크리스마스 특별 메뉴',
      '연말, 특별한 만남',
      '12월의 마지막 특급',
      '겨울밤 따뜻한 선물',
    ],
  },
};

export function getMonthData(month: number): MonthData {
  return MONTHLY_DATA[month] ?? MONTHLY_DATA[1];
}

export function getRandomTheme(month: number): string {
  const data = getMonthData(month);
  const idx = Math.floor(Math.random() * data.themes.length);
  return data.themes[idx];
}
