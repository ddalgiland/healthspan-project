import { Question, SystemType } from './types';

// Total questions needed to match max scores (assuming 5 points per question):
// Assimilation: 5 questions
// Defense: 5 questions
// Energy: 5 questions
// Detox: 4 questions
// Transport: 4 questions
// Communication: 5 questions
// Structural: 4 questions
// Total: 32 questions (scaled to fit the score model requested)

export const QUESTIONS: Question[] = [
  // 1. Assimilation (Digestion)
  { id: 'a1', system: SystemType.Assimilation, text: '식사 후 가스가 차거나 속이 더부룩한 느낌이 드나요?' },
  { id: 'a2', system: SystemType.Assimilation, text: '매일 규칙적으로 배변 활동(하루 1회 이상)을 하시나요?' },
  { id: 'a3', system: SystemType.Assimilation, text: '속쓰림이나 위산 역류 증상이 있나요?' },
  { id: 'a4', system: SystemType.Assimilation, text: '식사 후 과식한 느낌보다는 편안한 포만감을 느끼시나요?' },
  { id: 'a5', system: SystemType.Assimilation, text: '특정 음식에 대한 알레르기나 과민반응이 있나요?' },

  // 2. Defense & Repair (Immunity)
  { id: 'd1', system: SystemType.Defense, text: '감기나 독감에 자주 걸리시나요?' },
  { id: 'd2', system: SystemType.Defense, text: '상처가 났을 때 빨리 아무는 편인가요?' },
  { id: 'd3', system: SystemType.Defense, text: '만성적인 염증이나 관절 통증이 있나요?' },
  { id: 'd4', system: SystemType.Defense, text: '자가면역 질환이나 관련 가족력이 있나요?' },
  { id: 'd5', system: SystemType.Defense, text: '피부 상태가 대체로 깨끗하고 건강한가요?' },

  // 3. Energy
  { id: 'e1', system: SystemType.Energy, text: '아침에 일어날 때 개운함을 느끼시나요?' },
  { id: 'e2', system: SystemType.Energy, text: '오후가 되면 급격한 에너지 저하(피로)를 느끼시나요?' },
  { id: 'e3', system: SystemType.Energy, text: '운동을 할 때 쉽게 지치지 않고 수행할 수 있나요?' },
  { id: 'e4', system: SystemType.Energy, text: '하루를 버티기 위해 카페인이나 단 음식에 의존하시나요?' },
  { id: 'e5', system: SystemType.Energy, text: '전반적인 활력 수준이 높다고 생각하시나요?' },

  // 4. Detoxification
  { id: 'dx1', system: SystemType.Detox, text: '강한 냄새, 향수, 화학물질 냄새에 민감하신가요?' },
  { id: 'dx2', system: SystemType.Detox, text: '운동을 하면 땀이 잘 나나요?' },
  { id: 'dx3', system: SystemType.Detox, text: '술이나 가공식품을 자주 섭취하시나요?' },
  { id: 'dx4', system: SystemType.Detox, text: '아침에 혀에 백태가 끼거나 입냄새가 심한가요?' },

  // 5. Transport (Circulation)
  { id: 't1', system: SystemType.Transport, text: '손발이 자주 차가운 편인가요?' },
  { id: 't2', system: SystemType.Transport, text: '앉았다 일어날 때 어지러움(기립성 저혈압)을 느끼시나요?' },
  { id: 't3', system: SystemType.Transport, text: '혈압이 정상 범위를 유지하고 있나요?' },
  { id: 't4', system: SystemType.Transport, text: '멍이 잘 들거나 하지정맥류 증상이 있나요?' },

  // 6. Communication (Hormones/Nerves)
  { id: 'c1', system: SystemType.Communication, text: '잠들기 어렵거나 수면 유지가 힘든가요?' },
  { id: 'c2', system: SystemType.Communication, text: '감정 기복이 심하거나 쉽게 짜증이 나나요?' },
  { id: 'c3', system: SystemType.Communication, text: '스트레스 상황을 잘 견디고 관리하시나요?' },
  { id: 'c4', system: SystemType.Communication, text: '기억력과 집중력이 맑고 선명한가요?' },
  { id: 'c5', system: SystemType.Communication, text: '갑상선이나 혈당 조절에 문제가 있나요?' },

  // 7. Structural (Bones/Muscles)
  { id: 's1', system: SystemType.Structural, text: '의식하지 않아도 바른 자세를 유지하시나요?' },
  { id: 's2', system: SystemType.Structural, text: '만성적인 허리나 목 통증이 있나요?' },
  { id: 's3', system: SystemType.Structural, text: '근육의 유연성과 탄력이 좋은 편인가요?' },
  { id: 's4', system: SystemType.Structural, text: '골절 경험이 있거나 뼈가 약하다고 느끼시나요?' },
];

// Note: For scoring, we will assume a 1-5 scale.
// Some questions are "Positive" (Higher is better), some are "Negative" (Higher is worse).
// We will normalize everything so Higher Score = Better Health in the code logic.
export const NEGATIVE_QUESTIONS = [
  'a1', 'a3', 'a5',
  'd1', 'd3', 'd4',
  'e2', 'e4',
  'dx1', 'dx3', 'dx4',
  't1', 't2', 't4',
  'c1', 'c2', 'c5',
  's2', 's4'
];