import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Activity, TrendingUp, AlertTriangle, Info } from 'lucide-react';
import { SystemType } from '../types';

const MOCK_DATA = {
  totalParticipants: 124,
  completionRate: 88,
  averageScore: 112,
  systemAverages: [
    { name: SystemType.Assimilation, score: 18, max: 25 },
    { name: SystemType.Defense, score: 16, max: 25 },
    { name: SystemType.Energy, score: 15, max: 25 },
    { name: SystemType.Detox, score: 14, max: 20 },
    { name: SystemType.Transport, score: 16, max: 20 },
    { name: SystemType.Communication, score: 19, max: 25 },
    { name: SystemType.Structural, score: 14, max: 20 },
  ],
  riskGroups: [
    { name: '건강(양호)', value: 45, color: '#22c55e' },
    { name: '보통(주의)', value: 55, color: '#eab308' },
    { name: '위험군', value: 24, color: '#ef4444' },
  ]
};

const Dashboard: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">관리자 대시보드</h2>
          <p className="text-gray-500">4주 건강수명 프로젝트 실시간 모니터링</p>
        </div>
        <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
          <Activity size={16} /> 실시간 데이터 연동 중
        </div>
      </div>

      {/* Demo Notice */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-blue-500 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-bold text-blue-800">데모 모드 안내</h4>
          <p className="text-sm text-blue-700">
            현재 대시보드는 <strong>예시 데이터(Mock Data)</strong>를 표시하고 있습니다. 
            실제 운영 시에는 사용자 데이터를 수집할 수 있는 백엔드(데이터베이스) 연동이 필요합니다. 
            참가자들의 결과를 수동으로 취합하려면 참가자에게 '결과 텍스트 복사' 기능을 사용하여 카카오톡 등으로 결과를 보내달라고 요청하세요.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">총 참여자</span>
            <Users className="text-indigo-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{MOCK_DATA.totalParticipants}명</p>
          <span className="text-xs text-green-600 font-medium">+12명 (이번 주)</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">평균 점수</span>
            <TrendingUp className="text-blue-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{MOCK_DATA.averageScore}<span className="text-lg text-gray-400">/160</span></p>
          <span className="text-xs text-gray-400">목표: 130점</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">완료율</span>
            <Activity className="text-green-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{MOCK_DATA.completionRate}%</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-500 text-sm font-medium">집중 관리 대상</span>
            <AlertTriangle className="text-red-500" size={20} />
          </div>
          <p className="text-3xl font-bold text-gray-800">{MOCK_DATA.riskGroups[2].value}명</p>
          <span className="text-xs text-red-500 font-medium">상담 필요</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* System Averages Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">시스템별 평균 점수</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA.systemAverages}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{fontSize: 11}} interval={0} angle={0} height={30} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#4f46e5" radius={[4, 4, 0, 0]} name="평균 점수" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">건강 등급 분포</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_DATA.riskGroups}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  nameKey="name"
                >
                  {MOCK_DATA.riskGroups.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-4 text-sm">
              {MOCK_DATA.riskGroups.map((g) => (
                <div key={g.name} className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: g.color}}></div>
                  <span>{g.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;