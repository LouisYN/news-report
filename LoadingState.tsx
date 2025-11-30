import React from 'react';
import { Sun } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-pulse">
      <div className="relative">
        <div className="absolute inset-0 bg-yellow-200 rounded-full blur-xl opacity-50 animate-ping"></div>
        <Sun className="w-20 h-20 text-orange-500 animate-spin-slow relative z-10" />
      </div>
      <h3 className="mt-6 text-2xl font-bold text-gray-700">
        正在為您捕捉商機...
      </h3>
      <p className="mt-2 text-gray-500">
        搜尋過去 48 小時熱門新聞，分析隱藏價值中 🚀
      </p>
    </div>
  );
};
