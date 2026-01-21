
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout.tsx';
import Scanner from './components/Scanner.tsx';
import AnalysisResult from './components/AnalysisResult.tsx';
import Dashboard from './components/Dashboard.tsx';
import HistoryView from './components/HistoryView.tsx';
import ProfileSettings from './components/ProfileSettings.tsx';
import { analyzeFoodImage } from './services/geminiService.ts';
import { AppState, FoodItem, DailyLog, UserProfile } from './types.ts';

const DEFAULT_PROFILE: UserProfile = {
  height: 175,
  weight: 70,
  targetWeight: 68,
  gender: 'male',
  age: 25,
  activityLevel: 1.375,
  goal: 'maintain'
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('HOME');
  const [analysisResult, setAnalysisResult] = useState<FoodItem | null>(null);
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [logs, setLogs] = useState<DailyLog[]>([]);
  const [userProfile, setUserProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedLogs = localStorage.getItem('fitfeast_logs');
    const savedProfile = localStorage.getItem('fitfeast_profile');
    if (savedLogs) { try { setLogs(JSON.parse(savedLogs)); } catch (e) {} }
    if (savedProfile) { try { setUserProfile(JSON.parse(savedProfile)); } catch (e) {} }
  }, []);

  useEffect(() => { localStorage.setItem('fitfeast_logs', JSON.stringify(logs)); }, [logs]);
  useEffect(() => { localStorage.setItem('fitfeast_profile', JSON.stringify(userProfile)); }, [userProfile]);

  const handleCapture = async (base64: string) => {
    setCapturedImage(base64);
    setAppState('ANALYZING');
    setError(null);
    try {
      const result = await analyzeFoodImage(base64);
      if (result) {
        setAnalysisResult(result);
        setAppState('RESULT');
      } else {
        setError("未识别到有效食物，请重新对准餐盘。");
        setAppState('SCANNING');
      }
    } catch (err: any) {
      setError("网络波动，请稍后再试。");
      setAppState('SCANNING');
    }
  };

  const saveLog = (log: DailyLog) => {
    setLogs(prev => [log, ...prev]);
    setAppState('HOME');
    setAnalysisResult(null);
    setCapturedImage('');
  };

  const renderContent = () => {
    switch (appState) {
      case 'HOME': return <Dashboard logs={logs} profile={userProfile} onEditProfile={() => setAppState('PROFILE')} />;
      case 'PROFILE': return <ProfileSettings profile={userProfile} onSave={(p) => { setUserProfile(p); setAppState('HOME'); }} onBack={() => setAppState('HOME')} />;
      case 'SCANNING': return <Scanner onCapture={handleCapture} onCancel={() => setAppState('HOME')} />;
      case 'ANALYZING': return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center space-y-6">
          <div className="w-12 h-12 rounded-full border-4 border-gray-100 border-t-emerald-600 animate-spin" />
          <p className="text-sm font-bold text-gray-500">正在分析食物...</p>
        </div>
      );
      case 'RESULT': return analysisResult ? <AnalysisResult food={analysisResult} imageUrl={capturedImage} onSave={saveLog} onCancel={() => setAppState('SCANNING')} /> : null;
      case 'HISTORY': return <HistoryView logs={logs} onDelete={(id) => setLogs(prev => prev.filter(l => l.id !== id))} />;
      default: return <Dashboard logs={logs} profile={userProfile} onEditProfile={() => setAppState('PROFILE')} />;
    }
  };

  return (
    <Layout activeTab={appState === 'HISTORY' ? 'history' : (appState === 'SCANNING' ? 'scan' : 'home')} onTabChange={(tab) => setAppState(tab === 'scan' ? 'SCANNING' : (tab === 'history' ? 'HISTORY' : 'HOME'))}>
      {error && (
        <div className="absolute top-20 left-6 right-6 z-[100] p-4 bg-gray-900/90 backdrop-blur-md text-white rounded-2xl text-xs font-bold text-center animate-in slide-in-from-top-4 shadow-xl">
          {error}
        </div>
      )}
      {renderContent()}
    </Layout>
  );
};

export default App;
