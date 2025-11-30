import React from 'react';
import { Zap, Trophy } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="w-full bg-white border-b border-orange-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        {/* Left: Logo Area */}
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-200">
            <Zap className="w-7 h-7 text-white fill-current" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-gray-800 tracking-tight">今日新聞速報</h1>
                <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
                    Power Up
                </span>
            </div>
            <p className="text-sm text-orange-500 font-medium flex items-center gap-1">
                早安，充滿活力的一天！ 🌞
            </p>
          </div>
        </div>

        {/* Right: Status Indicators (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-2 bg-orange-50 px-4 py-2 rounded-full border border-orange-100">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                </span>
                <span className="text-xs font-bold text-gray-600">市場動態偵測中</span>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">今日目標</p>
                <p className="text-sm font-bold text-gray-700 flex items-center gap-1">
                    尋找下一個頂級客戶 <Trophy className="w-4 h-4 text-yellow-500 fill-current" />
                </p>
            </div>
        </div>
      </div>
    </header>
  );
};