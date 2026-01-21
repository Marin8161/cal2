
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { DailyLog, UserProfile } from '../types';

interface DashboardProps {
  logs: DailyLog[];
  profile: UserProfile;
  onEditProfile: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ logs, profile, onEditProfile }) => {
  // 计算基础代谢 (Mifflin-St Jeor 算式)
  const bmr = profile.gender === 'male' 
    ? (10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5)
    : (10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161);
  
  // 每日总消耗量 (TDEE)
  const tdee = bmr * profile.activityLevel;
  
  // 根据目标设定热量
  let calorieGoal = Math.round(tdee);
  let macroRatio = { p: 0.25, c: 0.5, f: 0.25 }; // 默认维持比例

  if (profile.goal === 'lose') {
    calorieGoal -= 500;
    macroRatio = { p: 0.35, c: 0.4, f: 0.25 }; // 高蛋白减脂
  } else if (profile.goal === 'gain') {
    calorieGoal += 300;
    macroRatio = { p: 0.25, c: 0.55, f: 0.20 }; // 充足碳水增肌
  }

  const consumed = logs.reduce((sum, log) => sum + log.totalCalories, 0);
  const remaining = Math.max(0, calorieGoal - consumed);
  
  const macroSummary = logs.reduce((acc, log) => {
    acc.protein += log.protein;
    acc.carbs += log.carbs;
    acc.fat += log.fat;
    return acc;
  }, { protein: 0, carbs: 0, fat: 0 });

  // 目标宏量营养素 (g)
  // 蛋白质 4kcal/g, 碳水 4kcal/g, 脂肪 9kcal/g
  const goals = {
    protein: Math.round((calorieGoal * macroRatio.p) / 4),
    carbs: Math.round((calorieGoal * macroRatio.c) / 4),
    fat: Math.round((calorieGoal * macroRatio.f) / 9),
  };

  const chartData = [
    { name: '已摄入', value: consumed },
    { name: '剩余', value: remaining },
  ];

  const COLORS = ['#10b981', '#f3f4f6'];

  return (
    <div className="p-6 space-y-6">
      {/* 状态卡片 */}
      <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
        <div className="flex justify-between items-start mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-black text-gray-800">今日进度</h2>
              <button onClick={onEditProfile} className="p-1 text-gray-300 hover:text-emerald-500 transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
              目标: {profile.goal === 'lose' ? '减脂' : profile.goal === 'gain' ? '增肌' : '维持'}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-black text-emerald-600">{consumed}</span>
            <span className="text-sm font-bold text-gray-300"> / {calorieGoal} 大卡</span>
          </div>
        </div>

        <div className="h-48 relative">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                startAngle={90}
                endAngle={450}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
             <span className="text-2xl font-black text-gray-800">{remaining}</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase">剩余</span>
          </div>
        </div>
      </section>

      {/* 宏量营养素 */}
      <section className="grid grid-cols-1 gap-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">营养比例建议</h3>
        
        <div className="space-y-4">
          <MacroBar label="蛋白质" current={macroSummary.protein} goal={goals.protein} color="bg-orange-400" bgColor="bg-orange-50" />
          <MacroBar label="碳水" current={macroSummary.carbs} goal={goals.carbs} color="bg-blue-400" bgColor="bg-blue-50" />
          <MacroBar label="脂肪" current={macroSummary.fat} goal={goals.fat} color="bg-purple-400" bgColor="bg-purple-50" />
        </div>
      </section>

      {/* AI 建议 */}
      <section className="bg-emerald-600 p-6 rounded-3xl text-white shadow-lg shadow-emerald-100">
        <div className="flex items-center gap-3 mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.989-2.386l-.548-.547z" />
          </svg>
          <h4 className="font-bold">智能建议</h4>
        </div>
        <p className="text-emerald-50 text-sm leading-relaxed">
          {profile.goal === 'lose' 
            ? `当前为减脂模式。建议将蛋白质摄入维持在每公斤体重 1.8g-2.2g，以防止肌肉流失。`
            : profile.goal === 'gain' 
            ? `增肌需要充足的能量。如果体重增长停滞，可以适当增加优质碳水（如燕麦、糙米）的比例。`
            : `维持期重点在于饮食的多样性。确保摄入足够的微量元素和健康的脂肪酸（如坚果、深海鱼）。`}
        </p>
      </section>
    </div>
  );
};

const MacroBar = ({ label, current, goal, color, bgColor }: { label: string, current: number, goal: number, color: string, bgColor: string }) => (
  <div className={`${bgColor} p-4 rounded-2xl border border-gray-100/50`}>
    <div className="flex justify-between items-center mb-2">
      <span className="font-bold text-gray-700">{label}</span>
      <span className="text-sm font-bold text-gray-500">{Math.round(current)}g / {goal}g</span>
    </div>
    <div className="w-full h-2 bg-white/60 rounded-full overflow-hidden">
      <div 
        className={`h-full ${color} transition-all duration-500 ease-out`} 
        style={{ width: `${Math.min(100, (current / goal) * 100)}%` }}
      />
    </div>
  </div>
);

export default Dashboard;
