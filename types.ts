export interface Question {
  id: string;
  text: string;
  system: SystemType;
}

export enum SystemType {
  Assimilation = '동화(소화)',
  Defense = '방어&회복',
  Energy = '에너지',
  Detox = '해독',
  Transport = '운반(순환)',
  Communication = '소통(호르몬)',
  Structural = '구조(근골격)'
}

export interface UserInfo {
  name: string;
  age: string;
  gender: string;
}

export interface SystemScore {
  system: SystemType;
  score: number;
  maxScore: number;
  percentage: number;
}

export interface AssessmentResult {
  userInfo: UserInfo;
  scores: Record<string, number>; // Question ID -> Answer Value (1-5)
  systemScores: SystemScore[];
  totalScore: number;
  totalMax: number;
  overallPercentage: number;
  timestamp: string;
}

export const SYSTEM_CONFIG: Record<SystemType, { maxScore: number; questionCount: number }> = {
  [SystemType.Assimilation]: { maxScore: 25, questionCount: 5 },
  [SystemType.Defense]: { maxScore: 25, questionCount: 5 },
  [SystemType.Energy]: { maxScore: 25, questionCount: 5 },
  [SystemType.Detox]: { maxScore: 20, questionCount: 4 },
  [SystemType.Transport]: { maxScore: 20, questionCount: 4 },
  [SystemType.Communication]: { maxScore: 25, questionCount: 5 },
  [SystemType.Structural]: { maxScore: 20, questionCount: 4 },
};