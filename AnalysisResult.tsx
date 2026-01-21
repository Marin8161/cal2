
import React, { useState, useMemo } from 'react';
import { FoodItem, DailyLog } from '../types.ts';

interface AnalysisResultProps {
  food: FoodItem;
  imageUrl: string;
  onSave: (log: DailyLog) => void;
  onCancel: () => void;
}

const AnalysisResult: React.FC<AnalysisResultProps> = ({ food, imageUrl, onSave, onCancel }) => {
  const [weight, setWeight] = useState(food.estimatedWeight);

  const stats = useMemo(() => {
    const ratio = weight / 100;
    return {
      calories: Math.round(food.caloriesPer100g * ratio),
      protein: Math.round(food.protein * ratio * 10) / 10,
      carbs: Math.round(food.carbs * ratio * 10) / 10,
      fat: Math.round(food.fat * ratio * 10) / 10,
    };
  }, [weight, food]);

  const handleSave = () => {
    onSave({
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      foodName: food.name,
      totalCalories: stats.calories,
      protein: stats.protein,
      carbs: stats.carbs,
      fat: stats.fat,
      weight: weight,
      imageUrl: imageUrl
    });
  };

  return (
    <div className="flex flex-col bg-[#F7F8FA] min-h-full animate-in fade-in duration-500 overflow-x-hidden">
      {/* 顶部聚焦背景 */}
      <div className="relative w-full h-[28vh] flex items-center justify-center overflow-hidden bg-white">
        <div className="absolute inset-0">
          <img src={`data:image/jpeg;base64,${imageUrl}`} className="w-full h-full object-cover blur-2xl opacity-10" alt="bg" />
        </div>
        <div className="relative z-10">
          <div className="w-40 h-40 rounded-full overflow-hidden border-[4px] border-white shadow-xl">
            <img src={`data:image/jpeg;base64,${imageUrl}`} className="w-full h-full object-cover scale-[1.5]" alt="Food" />
          </div>
        </div>
        <button onClick={onCancel} className="absolute top-4 left-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-sm text-gray-400">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
        </button>
      </div>

      <div className="flex-1 px-6 -mt-6 relative z-20 bg-[#F7F8FA] rounded-t-[32px] pt-8 pb-32">
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{food.name}</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">AI Analysis Result</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-black text-gray-900 leading-none">{stats.calories}</div>
            <div className="text-[10px] font-bold text-gray-400 mt-1 uppercase">kcal</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">分量调节</h2>
            <div className="text-sm font-black text-gray-800">{weight}<span className="text-xs ml-0.5 text-gray-400">g</span></div>
          </div>
          <div className="py-4">
            <input type="range" min="10" max="1000" step="5" value={weight} onChange={(e) => setWeight(parseInt(e.target.value))} className="w-full h-1.5 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">蛋白质</span>
            <span className="text-base font-black text-orange-600">{stats.protein}g</span>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">脂肪</span>
            <span className="text-base font-black text-emerald-600">{stats.fat}g</span>
          </div>
          <div className="col-span-2 bg-white rounded-xl p-4 shadow-sm flex flex-col items-center">
            <span className="text-[10px] font-bold text-gray-400 uppercase mb-1">碳水化合物</span>
            <span className="text-base font-black text-blue-600">{stats.carbs}g</span>
          </div>
        </div>
      </div>

      {/* 底部按钮优化：宽度适中，胶囊形状 */}
      <div className="fixed bottom-0 left-0 right-0 p-6 flex justify-center bg-gradient-to-t from-[#F7F8FA] via-[#F7F8FA] to-transparent z-30">
        <button 
          onClick={handleSave}
          className="w-full max-w-[280px] py-3.5 bg-black text-white rounded-full font-bold text-sm shadow-xl active:scale-95 transition-transform flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
          记录到今日
        </button>
      </div>

      <style>{`
        input[type=range]::-webkit-slider-thumb {
          -webkit-appearance: none; height: 20px; width: 20px; border-radius: 50%; background: #000; border: 3px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
};

export default AnalysisResult;
