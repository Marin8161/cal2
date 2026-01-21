
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: 'home' | 'scan' | 'history';
  onTabChange: (tab: 'home' | 'scan' | 'history') => void;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange, title }) => {
  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 shadow-xl overflow-hidden relative">
      {/* 顶部标题栏 */}
      <header className="px-6 py-4 bg-white border-b border-gray-100 flex items-center justify-between z-10">
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          {title || <span className="text-emerald-600">悦食 AI</span>}
        </h1>
        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
          <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
      </header>

      {/* 主体内容 */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* 底部导航栏 */}
      <nav className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-20">
        <button 
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'home' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span className="text-xs font-medium">首页</span>
        </button>

        <button 
          onClick={() => onTabChange('scan')}
          className="bg-emerald-600 -mt-10 w-14 h-14 rounded-full flex items-center justify-center shadow-lg shadow-emerald-200 border-4 border-white transform transition active:scale-95"
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>

        <button 
          onClick={() => onTabChange('history')}
          className={`flex flex-col items-center gap-1 ${activeTab === 'history' ? 'text-emerald-600' : 'text-gray-400'}`}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span className="text-xs font-medium">记录</span>
        </button>
      </nav>
    </div>
  );
};

export default Layout;
