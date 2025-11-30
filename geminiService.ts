import { GoogleGenAI } from "@google/genai";
import { NewsCategory, AnalysisResult, NewsItem } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to parse the custom text format into objects
const parseNewsResponse = (text: string): NewsItem[] => {
  const items: NewsItem[] = [];
  // Split by the delimiter
  const rawItems = text.split('|||ITEM|||').filter(i => i.trim().length > 0);

  rawItems.forEach((raw, index) => {
    try {
      // Helper regex to extract fields safely
      const getField = (tag: string) => {
        const regex = new RegExp(`${tag}\\s*:\\s*([\\s\\S]*?)(?=\\n[A-Z]+:|$)`, 'i');
        const match = raw.match(regex);
        return match ? match[1].trim() : '';
      };

      const title = getField('TITLE').replace(/\*\*/g, ''); // Remove markdown bold if present
      const source = getField('SOURCE') || '網路新聞';
      const scoreStr = getField('SCORE');
      const esgStr = getField('ESG');
      const summary = getField('SUMMARY');
      const analysis = getField('ANALYSIS');
      let url = getField('URL');

      // Smart URL Fallback:
      // If the model returns 'null', empty string, or a very short invalid string,
      // generate a Google Search URL so the user can still find the source with one click.
      if (!url || url.toLowerCase() === 'null' || url.length < 5) {
        url = `https://www.google.com/search?q=${encodeURIComponent(title + ' ' + source)}`;
      }

      if (title) {
        items.push({
          id: `news-${index}-${Date.now()}`,
          title,
          source,
          score: parseInt(scoreStr) || 5,
          isESG: esgStr.toLowerCase().includes('yes') || esgStr.includes('是') || esgStr.toLowerCase().includes('true'),
          summary,
          analysis,
          url: url // URL is now guaranteed to be a string
        });
      }
    } catch (e) {
      console.error("Failed to parse item:", raw, e);
    }
  });

  return items;
};

export const fetchNewsAnalysis = async (category: NewsCategory): Promise<AnalysisResult> => {
  // Using flash model for speed and cost efficiency
  const model = "gemini-2.5-flash";
  
  const today = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' });
  
  const prompt = `
  Role: Professional Office Furniture Sales Consultant.
  Current Time: ${today} (Taipei Time).
  Task: Search for [Taiwan Domestic] news within the last 48 hours related to "${category}".
  
  Goal: Identify news that indicates a need for office furniture (e.g., expansion, relocation, new offices, huge profits, new projects).
  
  Format Requirements:
  You MUST return the response in a strictly structured format so I can parse it programmatically. 
  Separate each news item with the delimiter "|||ITEM|||".
  
  For each news item, provide the following fields:
  TITLE: [News Headline]
  SOURCE: [Source Name, e.g., Yahoo, UDN, MoneyDJ]
  SCORE: [Practicality Index 1-10, just the number]
  ESG: [Yes/No - Is this related to ESG, Green Procurement, or RSG?]
  SUMMARY: [Brief summary of the event]
  ANALYSIS: [Sales Analysis: Why is this a furniture sales opportunity? Be specific about products like ergonomic chairs, partitions, conference tables.]
  URL: [The URL of the source. If you found it via search, copy it here. If NOT found, strictly write 'null']

  Search Constraints:
  1. Focus on Taiwan market.
  2. Look for keywords: "RSG", "Green Procurement" (綠色採購), "Expansion" (擴編), "New Office" (新辦公室).
  3. Find at least 4-6 distinct opportunities.
  
  Example Output Format:
  |||ITEM|||
  TITLE: 台積電擴大高雄投資
  SOURCE: 經濟日報
  SCORE: 10
  ESG: Yes
  SUMMARY: 台積電宣布高雄廠增設第三座2奈米廠...
  ANALYSIS: 新廠房意味著大量辦公空間需求，建議鎖定其行政大樓規劃，推銷高階人體工學椅與綠色環保家具。
  URL: https://money.udn.com/...
  |||ITEM|||
  ...
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // We rely on the text format parsing rather than JSON schema because googleSearch tool output is better handled in text
      },
    });

    const text = response.text || "";
    const items = parseNewsResponse(text);
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Fallback: If parsing fails (AI didn't follow format), put raw text in a dummy item
    if (items.length === 0 && text.length > 0) {
        items.push({
            id: 'fallback',
            title: '今日市場快訊摘要',
            source: '綜合分析',
            score: 5,
            isESG: false,
            summary: text,
            analysis: '請參考上方摘要內容進行業務判斷。',
            url: `https://www.google.com/search?q=${encodeURIComponent(category + ' 新聞')}`
        });
    }

    return {
      items,
      groundingChunks
    };

  } catch (error) {
    console.error("Error fetching news analysis:", error);
    throw error;
  }
};