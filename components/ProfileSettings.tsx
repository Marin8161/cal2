
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileSettingsProps {
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({ profile, onSave, onBack }) => {
  const [formData, setFormData] = useState<UserProfile>(profile);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="p-6 space-y-6 animate-in fade-in slide-in-from-right-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-gray-800">个人资料</h2>
        <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">性别</label>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'male' })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${formData.gender === 'male' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}
              >
                男
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, gender: 'female' })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition ${formData.gender === 'female' ? 'bg-white text-emerald-600 shadow-sm' : 'text-gray-500'}`}
              >
                女
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">年龄</label>
            <input
              type="number"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) })}
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">身高 (cm)</label>
            <input
              type="number"
              value={formData.height}
              onChange={(e) => setFormData({ ...formData, height: parseInt(e.target.value) })}
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase">当前体重 (kg)</label>
            <input
              type="number"
              step="0.1"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) })}
              className="w-full bg-gray-100 border-none rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">目标体重 (kg)</label>
          <input
            type="number"
            step="0.1"
            value={formData.targetWeight}
            onChange={(e) => setFormData({ ...formData, targetWeight: parseFloat(e.target.value) })}
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">健身目标</label>
          <select
            value={formData.goal}
            onChange={(e) => setFormData({ ...formData, goal: e.target.value as any })}
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
          >
            <option value="lose">减脂（创造热量缺口）</option>
            <option value="maintain">维持体重</option>
            <option value="gain">增肌（创造热量盈余）</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-gray-400 uppercase">日常活动强度</label>
          <select
            value={formData.activityLevel}
            onChange={(e) => setFormData({ ...formData, activityLevel: parseFloat(e.target.value) as any })}
            className="w-full bg-gray-100 border-none rounded-xl py-2.5 px-4 text-sm font-bold focus:ring-2 focus:ring-emerald-500"
          >
            <option value={1.2}>久坐（极少运动）</option>
            <option value={1.375}>轻度（每周运动 1-3 次）</option>
            <option value={1.55}>中度（每周运动 3-5 次）</option>
            <option value={1.725}>高度（每周运动 6-7 次）</option>
          </select>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition"
          >
            保存并更新目标
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfileSettings;
