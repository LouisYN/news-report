import React, { useState } from 'react';
import { Header } from './components/Header';
import { NewsCard } from './components/NewsCard';
import { LoadingState } from './components/LoadingState';
import { fetchNewsAnalysis } from './services/geminiService';
import { NewsCategory, AnalysisResult } from './types';
import { Search, Rocket, BarChart2 } from 'lucide-react';

const App: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>(NewsCategory.Trends);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categories = [
    { id: NewsCategory.Expansion, label: '1. 集團合併、擴編、辦公室購置' },
    { id: NewsCategory.Finance, label: '2. 金融財經、股市相關新聞' },
    { id: NewsCategory.Domestic, label: '3. 國內時事' },
    { id: NewsCategory.Trends, label: '4. 趨勢產業發展、ESG 綠色辦公' },
  ];

  const handleFetchNews = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await fetchNewsAnalysis(selectedCategory);
      setResult(data);
    } catch (err) {
      setError("連線發生問題，請稍後再試。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-gray-800 font-sans">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pb-24">
        
        {/* HERO SECTION */}
        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-orange-50 mb-12 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl opacity-50 -mr-16 -mt-16 pointer-events-none"></div>
            
            <div className="relative z-10 max-w-4xl mx-auto text-center md:text-left">
                <h2 className="text-3xl md:text-4xl font-black text-gray-800 mb-4 tracking-tight">
                    準備好迎接<span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500">爆發性成長</span>了嗎？
                </h2>
                <p className="text-gray-500 font-medium mb-10 text-lg">
                    讓 AI 幫你過濾雜訊，直接鎖定 24 小時內含金量最高的商機。
                </p>

                {/* SEARCH CONTROLS */}
                <div className="flex flex-col md:flex-row gap-4 items-stretch">
                    <div className="flex-grow relative group">
                        <label className="absolute -top-3 left-4 bg-white px-2 text-xs font-bold text-gray-400 z-10">
                            選擇你的狩獵戰場
                        </label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value as NewsCategory)}
                            className="w-full h-16 pl-6 pr-10 bg-slate-50 border-2 border-slate-100 hover:border-orange-200 text-gray-700 font-bold rounded-2xl outline-none focus:ring-4 focus:ring-orange-100 transition-all appearance-none cursor-pointer text-lg"
                        >
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.label}
                                </option>
                            ))}
                        </select>
                        <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                            ▼
                        </div>
                    </div>

                    <button
                        onClick={handleFetchNews}
                        disabled={loading}
                        className="md:w-64 h-16 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transform transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-lg"
                    >
                        {loading ? (
                            <>
                                <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                                挖掘中...
                            </>
                        ) : (
                            <>
                                開始挖掘商機 <Rocket className="w-5 h-5 fill-current" />
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* RESULTS AREA */}
        <div id="results">
            {error && (
                <div className="text-center p-4 bg-red-50 text-red-600 rounded-xl mb-8 font-medium">
                    ⚠️ {error}
                </div>
            )}

            {loading ? (
                <LoadingState />
            ) : result ? (
                <div className="animate-fade-in-up">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="bg-orange-500 p-2 rounded-lg text-white">
                                <BarChart2 className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800">商機分析報告</h3>
                        </div>
                        <div className="text-gray-500 font-medium">
                            找到 <span className="text-orange-500 text-2xl font-black">{result.items.length}</span> 個機會
                        </div>
                    </div>

                    {/* NEWS GRID */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {result.items.map((item) => (
                            <NewsCard key={item.id} item={item} />
                        ))}
                    </div>

                    {/* GROUNDING FOOTER */}
                    {result.groundingChunks && result.groundingChunks.length > 0 && (
                        <div className="mt-12 text-center">
                            <p className="text-xs text-gray-400 uppercase tracking-widest mb-4">資料來源參考</p>
                            <div className="flex flex-wrap justify-center gap-2">
                                {result.groundingChunks.map((chunk, idx) => (
                                    chunk.web?.uri && (
                                        <a 
                                            key={idx} 
                                            href={chunk.web.uri} 
                                            target="_blank" 
                                            rel="noreferrer"
                                            className="text-xs text-gray-400 hover:text-orange-500 underline decoration-gray-300 underline-offset-2 transition-colors"
                                        >
                                            {chunk.web.title || "來源連結"}
                                        </a>
                                    )
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 opacity-40 select-none">
                    <div className="inline-block p-6 rounded-full bg-gray-100 mb-4">
                        <Search className="w-12 h-12 text-gray-400" />
                    </div>
                    <p className="text-xl text-gray-400 font-bold">等待您的指令</p>
                    <p className="text-sm text-gray-400 mt-2">點擊上方按鈕開始搜尋今日商機</p>
                </div>
            )}
        </div>

      </main>
    </div>
  );
};

export default App;