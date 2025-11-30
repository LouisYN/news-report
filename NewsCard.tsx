import React from 'react';
import { NewsItem } from '../types';
import { ExternalLink, Leaf, Sparkles } from 'lucide-react';

interface NewsCardProps {
  item: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = ({ item }) => {
  return (
    <div className="bg-white rounded-[2rem] p-6 shadow-xl border border-orange-50 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group flex flex-col h-full">
      
      {/* Top Row: Source & Tags */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider">
            {item.source}
          </span>
          {item.score >= 8 && (
            <span className="bg-red-100 text-red-500 px-2 py-1 rounded-lg text-xs font-bold">
              HOT
            </span>
          )}
          {item.isESG && (
            <span className="bg-green-100 text-green-600 px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
              <Leaf className="w-3 h-3" /> ESG
            </span>
          )}
        </div>
        
        {/* Practicality Score Badge */}
        <div className="flex flex-col items-center">
            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl shadow-lg flex flex-col items-center justify-center text-white transform group-hover:scale-110 transition-transform">
                <span className="text-2xl font-black leading-none">{item.score}</span>
                <span className="text-[10px] font-medium opacity-90">實用指數</span>
            </div>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-xl font-bold text-gray-800 mb-4 leading-tight min-h-[3.5rem] line-clamp-2">
        {item.title}
      </h3>

      {/* Summary */}
      <p className="text-gray-500 text-sm mb-6 leading-relaxed line-clamp-3">
        {item.summary}
      </p>

      {/* Analysis Section */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 flex-grow">
        <div className="flex items-center gap-2 mb-2 text-orange-600 font-bold text-sm">
            <Sparkles className="w-4 h-4" />
            業務攻略策略
        </div>
        <p className="text-slate-700 text-sm font-medium leading-relaxed">
            {item.analysis}
        </p>
      </div>

      {/* Footer Link - Full Width Button */}
      {item.url && (
        <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-auto w-full bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 group-hover:shadow-md border border-orange-100 hover:border-orange-500"
        >
            <span>閱讀完整報導</span>
            <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
};