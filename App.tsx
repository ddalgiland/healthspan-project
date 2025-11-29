import React, { useState, useEffect } from 'react';
import Assessment from './components/Assessment';
import Results from './components/Results';
import Dashboard from './components/Dashboard';
import { AssessmentResult } from './types';
import { HeartPulse, LayoutDashboard, Stethoscope } from 'lucide-react';

const App: React.FC = () => {
  const [view, setView] = useState<'assessment' | 'results' | 'dashboard'>('assessment');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [isSharedView, setIsSharedView] = useState(false);

  // Check for shared URL parameters on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shareData = params.get('share');

    if (shareData) {
      try {
        // Decode: Base64 -> URI Component -> JSON
        const jsonString = decodeURIComponent(atob(shareData));
        const parsedData = JSON.parse(jsonString);

        // Reconstruct a result object with anonymous user data
        const sharedResult: AssessmentResult = {
          userInfo: { name: '익명 사용자', age: '-', gender: '-' },
          systemScores: parsedData.s,
          totalScore: parsedData.t,
          totalMax: parsedData.tm,
          overallPercentage: parsedData.op,
          timestamp: parsedData.d,
          scores: {} // Individual answers are not shared to keep URL short and private
        };

        setResult(sharedResult);
        setIsSharedView(true);
        setView('results');
      } catch (error) {
        console.error("Failed to parse shared link", error);
        // Optionally show an error or just stay on assessment view
      }
    }
  }, []);

  const handleComplete = (data: AssessmentResult) => {
    setResult(data);
    setIsSharedView(false);
    setView('results');
  };

  const handleReset = () => {
    setResult(null);
    setIsSharedView(false);
    setView('assessment');
    // Clear URL params without reloading
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div 
      className="min-h-screen flex flex-col font-sans text-gray-900 select-none"
      onContextMenu={(e) => e.preventDefault()}
    >
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 print:hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={handleReset}>
              <div className="bg-indigo-600 p-2 rounded-lg mr-3">
                <HeartPulse className="text-white" size={24} />
              </div>
              <span className="font-bold text-xl tracking-tight text-gray-800">Healthspan<span className="text-indigo-600">Project</span></span>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleReset}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'assessment' || view === 'results' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <Stethoscope size={18} /> 자가진단
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <LayoutDashboard size={18} /> 관리자
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 p-4 sm:p-8">
        {view === 'assessment' && (
          <Assessment onComplete={handleComplete} />
        )}
        
        {view === 'results' && result && (
          <Results result={result} onReset={handleReset} isSharedView={isSharedView} />
        )}

        {view === 'dashboard' && (
          <Dashboard />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 print:hidden">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} 4주 건강수명 프로젝트. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;