
import React from 'react';
import { DailyLog } from '../types';

interface HistoryViewProps {
  logs: DailyLog[];
  onDelete: (id: string) => void;
}

const HistoryView: React.FC<HistoryViewProps> = ({ logs, onDelete }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-12 text-center opacity-60">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mb-4">
          <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-bold text-gray-800">暂无饮食记录</h3>
        <p className="text-sm text-gray-500 mt-1">开始拍摄您的餐食，历史记录将显示在这里。</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">饮食记录</h2>
      
      <div className="space-y-4">
        {logs.sort((a, b) => b.timestamp - a.timestamp).map((log) => (
          <div key={log.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex gap-4 group relative">
            <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
              {log.imageUrl ? (
                <img src={`data:image/jpeg;base64,${log.imageUrl}`} className="w-full h-full object-cover" alt={log.foodName} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                   <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 flex flex-col justify-center">
              <div className="flex justify-between items-start">
                <h4 className="font-bold text-gray-800">{log.foodName}</h4>
                <span className="text-emerald-600 font-bold">{log.totalCalories} 大卡</span>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {log.weight}g
              </p>
              
              <div className="flex gap-3 mt-2">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-400"></div>
                  <span className="text-[10px] font-bold text-gray-500">蛋: {log.protein}g</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                  <span className="text-[10px] font-bold text-gray-500">碳: {log.carbs}g</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-purple-400"></div>
                  <span className="text-[10px] font-bold text-gray-500">脂: {log.fat}g</span>
                </div>
              </div>
            </div>

            <button 
              onClick={() => onDelete(log.id)}
              className="absolute -top-2 -right-2 bg-red-100 p-1.5 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryView;
