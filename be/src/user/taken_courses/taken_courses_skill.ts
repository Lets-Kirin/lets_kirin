export const COURSE_SKILL_MAPPING = {
  // 기존 핵심 과목
  운영체제: {
    skills: [{ type: 'cs', points: 2 }],
  },
  데이터베이스: {
    skills: [
      { type: 'server', points: 2 },
      { type: 'cs', points: 1 },
    ],
  },

  // AI/ML 관련
  'K-MOOC:모두를위한머신러닝': {
    skills: [
      { type: 'ai', points: 1 },
      { type: 'cs', points: 0.5 },
    ],
  },
  'K-MOOC:생성형인공지능입문': {
    skills: [
      { type: 'ai', points: 1 },
      { type: 'cs', points: 0.5 },
    ],
  },

  // 컴퓨터 과학 기초
  컴퓨터구조: {
    skills: [{ type: 'cs', points: 2 }],
  },
  이산수학및프로그래밍: {
    skills: [
      { type: 'cs', points: 1 },
      { type: 'language', points: 1 },
    ],
  },

  // 알고리즘/자료구조
  자료구조및실습: {
    skills: [
      { type: 'ds', points: 2 },
      { type: 'algorithm', points: 1 },
    ],
  },
  알고리즘및실습: {
    skills: [
      { type: 'algorithm', points: 2 },
      { type: 'ds', points: 1 },
    ],
  },

  // 프로그래밍 언어
  C프로그래밍및실습: {
    skills: [
      { type: 'language', points: 2 },
      { type: 'cs', points: 1 },
    ],
  },
  고급C프로그래밍및실습: {
    skills: [
      { type: 'language', points: 2 },
      { type: 'cs', points: 1 },
    ],
  },
  '문제해결및실습:C++': {
    skills: [
      { type: 'language', points: 2 },
      { type: 'algorithm', points: 1 },
    ],
  },

  // 수학/통계 관련 (CS 스킬에도 부분 점수 부여)
  선형대수및프로그래밍: {
    skills: [
      { type: 'cs', points: 1 },
      { type: 'language', points: 1 },
    ],
  },
  확률통계및프로그래밍: {
    skills: [
      { type: 'cs', points: 1 },
      { type: 'language', points: 1 },
    ],
  },

  // 보안
  'K-MOOC:정보보호와보안의기초': {
    skills: [{ type: 'cs', points: 1 }],
  },

  // 프로젝트/설계
  'SW설계기초(산학프로젝트입문)': {
    skills: [
      { type: 'cs', points: 1 },
      { type: 'language', points: 1 },
    ],
  },
};
