import { GoogleGenAI } from "@google/genai";
import { AssessmentResult } from "../types";

const getSystemPrompt = (result: AssessmentResult) => {
  const scoresText = result.systemScores
    .map(s => `- ${s.system}: ${s.score}/${s.maxScore} (${s.percentage}%)`)
    .join('\n');

  return `
    당신은 "4주 건강수명 프로젝트"의 자가진단 결과를 분석하는 기능의학(Functional Medicine) 전문가입니다.
    
    사용자 프로필:
    이름: ${result.userInfo.name}
    나이: ${result.userInfo.age}
    성별: ${result.userInfo.gender}
    
    종합 점수: ${result.totalScore}/${result.totalMax} (${result.overallPercentage}%)
    
    시스템별 점수:
    ${scoresText}
    
    위 데이터를 바탕으로 사용자에게 제공할 맞춤형 건강 보고서를 한국어로 작성해주세요.
    반드시 아래 JSON 형식으로 출력해야 합니다:
    {
      "summary": "전반적인 건강 상태에 대한 2문장 요약 (격려하는 톤).",
      "strengths": ["강점 1", "강점 2"],
      "weaknesses": ["개선이 필요한 영역 1", "개선이 필요한 영역 2"],
      "recommendations": [
        "구체적인 실천 방안 1",
        "구체적인 실천 방안 2",
        "구체적인 실천 방안 3"
      ]
    }
    
    톤앤매너: 전문적이지만 이해하기 쉽고, 따뜻하며 격려하는 어조.
    가장 점수가 낮은 시스템(취약 영역)에 대한 조언을 우선적으로 포함하세요.
  `;
};

export const generateHealthReport = async (result: AssessmentResult): Promise<any> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided");
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: getSystemPrompt(result),
      config: {
        responseMimeType: 'application/json'
      }
    });

    const text = response.text;
    if (!text) return null;
    return JSON.parse(text);
  } catch (error) {
    console.error("Gemini API Error:", error);
    return null;
  }
};