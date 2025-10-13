export type CompanyCategory = 
  | 'slow-grower'
  | 'stalwart' 
  | 'fast-grower'
  | 'cyclical'
  | 'turnaround'
  | 'asset-play';

export type CapitalizationSize = 'micro' | 'small' | 'mid' | 'large' | 'mega';

export interface CompanyInfo {
  category: string;
  exchange: string;
  marketCap: number;
  name: string;
  price: number;
  sector: string;
  shares: number;
  ticker: string;
}

export interface EarningsData {
  epsHistory: Array<{ year: number; eps: number }>;
  growthRate: number | null;
  volatilityScore: number | null;
  consistency: 'stable' | 'growing' | 'erratic' | 'declining' | 'insufficient-data';
}

export interface QuickAnalysisMetrics {
  // Company Classification
  capitalizationSize: CapitalizationSize;
  ipoDate: string | null;
  isRecentIPO: boolean;
  isSpinoff: boolean;
  
  // Profitability Checks
  hasEverMadeOperatingProfit: boolean;
  consistentCashFlowGeneration: boolean;
  
  // Returns & Leverage
  averageROE: number;
  roeAbove10Percent: boolean;
  financialLeverageRatio: number;
  debtToEquity: number;
  leverageLevel: 'low' | 'moderate' | 'high' | 'extreme';
  
  // Earnings
  earningsGrowthConsistency: 'consistent' | 'erratic' | 'declining';
  earningsData?: EarningsData;
  
  // Balance Sheet
  totalDebt: number;
  totalAssets: number;
  debtTrend: 'increasing' | 'stable' | 'decreasing';
  
  // Cash Flow
  operatingCashFlow: number[];
  cashFlowTrend: 'growing' | 'stable' | 'declining';
  
  // Shares Outstanding
  sharesOutstanding: number[];
  shareDilution: 'significant-increase' | 'stable' | 'buyback';
  dilutionPercentage: number;
}

export interface CompanyAnalysis {
  companyInfo: CompanyInfo,
  quickAnalysis: QuickAnalysisMetrics;
  userInputs?: {
    selectedCategory?: CompanyCategory;
    isBusinessStable?: boolean;
    canUnderstandDebt?: boolean;
  };
}