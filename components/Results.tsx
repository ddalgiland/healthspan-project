import React, { useEffect, useState } from 'react';
import { AssessmentResult, SystemScore } from '../types';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { generateHealthReport } from '../services/geminiService';
import { Download, Loader2, RefreshCw, Share2, Copy, Check, MessageCircle, Link as LinkIcon, Lock } from 'lucide-react';

interface ResultsProps {
  result: AssessmentResult;
  onReset: () => void;
  isSharedView?: boolean;
}

const Results: React.FC<ResultsProps> = ({ result, onReset, isSharedView = false }) => {
  const [aiReport, setAiReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      const report = await generateHealthReport(result);
      setAiReport(report);
      setLoading(false);
    };
    fetchReport();
  }, [result]);

  const getGrade = (percentage: number) => {
    if (percentage >= 90) return { label: '최적 (Optimal)', color: 'text-green-600' };
    if (percentage >= 75) return { label: '양호 (Good)', color: 'text-blue-600' };
    if (percentage >= 60) return { label: '보통 (Moderate)', color: 'text-yellow-600' };
    return { label: '관리 필요 (Needs Attention)', color: 'text-red-600' };
  };

  const grade = getGrade(result.overallPercentage);

  const handlePrint = () => {
    window.print();
  };

  // Copy Summary Text (for Messaging apps)
  const handleCopyResultText = () => {
    const summary = `
🌟 [4주 건강수명 프로젝트] 진단 결과 🌟

👤 이름: ${isSharedView ? '익명 사용자' : result.userInfo.name}
📊 종합 점수: ${result.totalScore}/${result.totalMax} (${result.overallPercentage}%)
🏆 건강 등급: ${grade.label}

[시스템별 점수]
${result.systemScores.map(s => `• ${s.system}: ${s.score}/${s.maxScore} (${s.percentage}%)`).join('\n')}

💡 AI 건강 조언
${aiReport ? `"${aiReport.summary}"` : "분석 중..."}

📅 진단일: ${result.timestamp ? new Date(result.timestamp).toLocaleDateString() : new Date().toLocaleDateString()}
    `.trim();

    navigator.clipboard.writeText(summary).then(() => {
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
      alert("결과 요약 텍스트가 복사되었습니다.");
    });
  };

  // Generate and Copy Link (Privacy Safe)
  const handleCopyLink = () => {
    // 1. Extract only the necessary data (scores), excluding PII (Name, Age, Gender)
    const shareData = {
      s: result.systemScores,
      t: result.totalScore,
      tm: result.totalMax,
      op: result.overallPercentage,
      d: result.timestamp || new Date().toISOString()
    };

    // 2. Serialize: JSON -> URI Encode (for Korean chars) -> Base64
    try {
      const jsonString = JSON.stringify(shareData);
      const encodedData = btoa(encodeURIComponent(jsonString));
      const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encodedData}`;

      navigator.clipboard.writeText(shareUrl).then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
        alert("공유 링크가 복사되었습니다! 이 링크는 개인정보(이름, 나이 등)를 포함하지 않습니다.");
      });
    } catch (e) {
      console.error("Link generation failed", e);
      alert("링크 생성 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in pb-20">
      
      {/* Shared View Alert */}
      {isSharedView && (
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm flex items-start gap-3">
          <Lock className="text-blue-500 mt-0.5" size={20} />
          <div>
            <h4 className="font-bold text-blue-900">공유된 결과 화면입니다</h4>
            <p className="text-sm text-blue-700">
              이 화면은 개인정보가 제외된 읽기 전용 결과 페이지입니다. <br/>
              본인의 건강 상태를 진단하고 싶다면 하단의 '처음으로' 버튼을 눌러주세요.
            </p>
          </div>
        </div>
      )}

      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-center border-t-4 border-indigo-500 print:shadow-none print:border-none">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">건강 진단 결과 보고서</h2>
        <p className="text-gray-500 mb-6">
          수신자: <span className="font-semibold text-indigo-600">{isSharedView ? '익명 사용자' : `${result.userInfo.name} 님`}</span>
        </p>
        
        <div className="flex justify-center items-center gap-6 mb-6">
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide">종합 점수</p>
            <p className="text-5xl font-extrabold text-gray-900">{result.totalScore}<span className="text-2xl text-gray-400">/{result.totalMax}</span></p>
          </div>
          <div className="h-12 w-px bg-gray-200"></div>
          <div className="text-center">
            <p className="text-sm text-gray-500 uppercase tracking-wide">건강 등급</p>
            <p className={`text-2xl font-bold ${grade.color}`}>{grade.label}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-3 no-print">
          {/* Share Link Button */}
          <button 
            onClick={handleCopyLink} 
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors shadow-sm"
          >
            {copiedLink ? <Check size={18} /> : <LinkIcon size={18} />} 
            공유 링크 복사
          </button>

          {/* Copy Text Button */}
          <button 
            onClick={handleCopyResultText} 
            className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors shadow-sm"
          >
            {copiedText ? <Check size={18} /> : <Copy size={18} />} 
            텍스트 복사
          </button>

          <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors">
            <Download size={18} /> PDF 저장
          </button>
          <button onClick={onReset} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors">
            <RefreshCw size={18} /> {isSharedView ? '나도 진단하기' : '처음으로'}
          </button>
        </div>
      </div>

      {/* Visualizations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 print:block print:space-y-6">
        
        {/* Radar Chart */}
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">7대 시스템 밸런스</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={result.systemScores}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="system" tick={{ fill: '#4b5563', fontSize: 10 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                <Radar name="User" dataKey="percentage" stroke="#4f46e5" fill="#6366f1" fillOpacity={0.5} />
                <Tooltip />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Detailed Scores List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">상세 점수 분석</h3>
          <div className="space-y-4">
            {result.systemScores.map((s, idx) => (
              <div key={idx}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="font-medium text-gray-700">{s.system}</span>
                  <span className="text-gray-500">{s.score}/{s.maxScore}점 ({s.percentage}%)</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className={`h-2.5 rounded-full ${s.percentage > 70 ? 'bg-green-500' : s.percentage > 40 ? 'bg-yellow-400' : 'bg-red-500'}`} 
                    style={{ width: `${s.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI Analysis Section */}
      <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl p-8 shadow-sm">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <Share2 size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">AI 건강 정밀 분석</h3>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 className="animate-spin mb-3" size={32} />
            <p>7대 대사 시스템을 분석 중입니다...</p>
          </div>
        ) : aiReport ? (
          <div className="space-y-6">
            <div className="prose text-gray-700">
              <p className="text-lg italic leading-relaxed">"{aiReport.summary}"</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white/60 p-5 rounded-lg border border-indigo-100">
                <h4 className="font-semibold text-indigo-900 mb-3 flex items-center gap-2">✅ 주요 강점</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {aiReport.strengths?.map((str: string, i: number) => (
                    <li key={i}>{str}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-white/60 p-5 rounded-lg border border-red-100">
                <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">⚠️ 집중 관리 영역</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {aiReport.weaknesses?.map((wk: string, i: number) => (
                    <li key={i}>{wk}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-indigo-100 shadow-sm">
              <h4 className="font-bold text-gray-800 mb-4">🚀 맞춤형 개선 솔루션</h4>
              <div className="space-y-3">
                {aiReport.recommendations?.map((rec: string, i: number) => (
                  <div key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-gray-700">{rec}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <p>AI 분석을 불러올 수 없습니다. API 키를 확인해주세요.</p>
          </div>
        )}
      </div>

      <div className="text-center text-sm text-gray-400 pt-8 print:hidden">
        <p>© 4주 건강수명 프로젝트. 본 결과는 의료 진단이 아니며, 전문의 상담을 대체할 수 없습니다.</p>
      </div>
    </div>
  );
};

export default Results;