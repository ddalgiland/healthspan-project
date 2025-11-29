import React, { useState } from 'react';
import { UserInfo, SystemType, AssessmentResult, SYSTEM_CONFIG, SystemScore } from '../types';
import { QUESTIONS, NEGATIVE_QUESTIONS } from '../constants';
import { ChevronRight, ChevronLeft, CheckCircle2 } from 'lucide-react';

interface AssessmentProps {
  onComplete: (result: AssessmentResult) => void;
}

const Assessment: React.FC<AssessmentProps> = ({ onComplete }) => {
  const [step, setStep] = useState<'intro' | 'questions'>('intro');
  const [userInfo, setUserInfo] = useState<UserInfo>({ name: '', age: '', gender: '' });
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentSystemIndex, setCurrentSystemIndex] = useState(0);

  const systems = Object.values(SystemType);
  const currentSystem = systems[currentSystemIndex];
  const currentQuestions = QUESTIONS.filter(q => q.system === currentSystem);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (userInfo.name && userInfo.age && userInfo.gender) {
      setStep('questions');
    }
  };

  const handleAnswer = (questionId: string, value: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const calculateResults = () => {
    const systemScores: SystemScore[] = [];
    let totalScore = 0;
    let totalMax = 0;

    systems.forEach(sys => {
      const sysConfig = SYSTEM_CONFIG[sys];
      const sysQuestions = QUESTIONS.filter(q => q.system === sys);
      
      let rawScore = 0;
      // Calculate raw score based on 1-5 answers
      sysQuestions.forEach(q => {
        const val = answers[q.id] || 3; // Default to neutral if missing
        // If negative question (e.g. "Do you have pain?"), 5 is bad, 1 is good.
        // We want Higher = Better.
        // So for negative question: Score = 6 - val (e.g. val 5 becomes 1).
        if (NEGATIVE_QUESTIONS.includes(q.id)) {
          rawScore += (6 - val); 
        } else {
          rawScore += val;
        }
      });

      // Normalize to the max score defined in config (e.g. /25 or /20)
      // Max possible raw points = count * 5.
      const maxRaw = sysQuestions.length * 5;
      const normalizedScore = Math.round((rawScore / maxRaw) * sysConfig.maxScore);

      systemScores.push({
        system: sys,
        score: normalizedScore,
        maxScore: sysConfig.maxScore,
        percentage: Math.round((normalizedScore / sysConfig.maxScore) * 100)
      });

      totalScore += normalizedScore;
      totalMax += sysConfig.maxScore;
    });

    const result: AssessmentResult = {
      userInfo,
      scores: answers,
      systemScores,
      totalScore,
      totalMax,
      overallPercentage: Math.round((totalScore / totalMax) * 100),
      timestamp: new Date().toISOString()
    };

    onComplete(result);
  };

  const nextSection = () => {
    // Check if all answered
    const allAnswered = currentQuestions.every(q => answers[q.id] !== undefined);
    if (!allAnswered) {
      alert("이 단계의 모든 문항에 답변해주세요.");
      return;
    }

    if (currentSystemIndex < systems.length - 1) {
      setCurrentSystemIndex(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      calculateResults();
    }
  };

  const prevSection = () => {
    if (currentSystemIndex > 0) {
      setCurrentSystemIndex(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  if (step === 'intro') {
    return (
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden animate-fade-in">
        <div className="bg-indigo-600 p-8 text-white text-center">
          <h1 className="text-3xl font-bold mb-2">4주 건강수명 프로젝트</h1>
          <p className="opacity-90">1주차: 종합 자가 건강진단</p>
        </div>
        <form onSubmit={handleStart} className="p-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">성명</label>
              <input 
                required
                type="text" 
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition select-text"
                value={userInfo.name}
                onChange={e => setUserInfo({...userInfo, name: e.target.value})}
                placeholder="이름을 입력하세요"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">나이</label>
                <input 
                  required
                  type="number" 
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none select-text"
                  value={userInfo.age}
                  onChange={e => setUserInfo({...userInfo, age: e.target.value})}
                  placeholder="세"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">성별</label>
                <select 
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none select-text"
                  value={userInfo.gender}
                  onChange={e => setUserInfo({...userInfo, gender: e.target.value})}
                >
                  <option value="">선택</option>
                  <option value="Male">남성</option>
                  <option value="Female">여성</option>
                  <option value="Other">기타</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-800">
            <p className="font-semibold mb-1">📋 안내사항:</p>
            <p>7가지 신체 시스템에 관한 32개의 질문이 주어집니다. 각 증상의 빈도나 강도에 따라 1(전혀 아님)에서 5(매우 자주/심함)까지 선택해주세요.</p>
          </div>

          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2">
            진단 시작하기 <ChevronRight size={20} />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-gray-500 mb-2">
          <span>진단 진행률 ({currentSystemIndex + 1}/{systems.length})</span>
          <span>{Math.round(((currentSystemIndex) / systems.length) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${((currentSystemIndex) / systems.length) * 100}%` }}></div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            {currentSystemIndex + 1}
          </div>
          <h2 className="text-2xl font-bold text-gray-800">{currentSystem} 시스템</h2>
        </div>

        <div className="space-y-8">
          {currentQuestions.map((q) => (
            <div key={q.id} className="space-y-3">
              <p className="text-lg font-medium text-gray-700">{q.text}</p>
              <div className="flex justify-between items-center gap-2">
                {[1, 2, 3, 4, 5].map((val) => {
                  const isSelected = answers[q.id] === val;
                  let label = '';
                  if (val === 1) label = '전혀 아님';
                  if (val === 5) label = '항상 그럼';

                  return (
                    <button
                      key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      className={`
                        relative flex-1 py-3 rounded-lg font-medium transition-all
                        ${isSelected 
                          ? 'bg-indigo-600 text-white shadow-md transform scale-105' 
                          : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}
                      `}
                    >
                      <span className="text-lg">{val}</span>
                      {label && <span className="absolute -bottom-7 left-0 right-0 text-xs text-gray-400 font-normal whitespace-nowrap">{label}</span>}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between mt-12 pt-6 border-t border-gray-100">
          <button 
            onClick={prevSection}
            disabled={currentSystemIndex === 0}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-colors ${currentSystemIndex === 0 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <ChevronLeft size={20} /> 이전
          </button>
          <button 
            onClick={nextSection}
            className="flex items-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold shadow-md transition-all hover:shadow-lg"
          >
            {currentSystemIndex === systems.length - 1 ? '진단 완료' : '다음 단계'}
            {currentSystemIndex === systems.length - 1 ? <CheckCircle2 size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Assessment;