export enum NewsCategory {
  Expansion = "集團合併、擴編、辦公室購置、土地買賣",
  Finance = "金融財經、股市相關",
  Domestic = "國內時事",
  Trends = "趨勢產業發展"
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  score: number; // 1-10
  isESG: boolean;
  summary: string;
  analysis: string;
  url?: string;
}

export interface AnalysisResult {
  items: NewsItem[];
  groundingChunks: GroundingChunk[];
  rawText?: string; // Fallback
}

export interface FilterOption {
  id: NewsCategory;
  label: string;
  icon: string; // URL or name
}