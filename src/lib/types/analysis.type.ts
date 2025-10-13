export type CompanyCategory = 
  | 'slow-grower'
  | 'stalwart' 
  | 'fast-grower'
  | 'cyclical'
  | 'turnaround'
  | 'asset-play';

export type CapitalizationSize = 'micro' | 'small' | 'mid' | 'large' | 'mega';

export interface QuickAnalysisMetrics {
  // Company Classification
  marketCap: number;
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
  ticker: string;
  companyName: string;
  quickAnalysis: QuickAnalysisMetrics;
  userInputs?: {
    selectedCategory?: CompanyCategory;
    isBusinessStable?: boolean;
    canUnderstandDebt?: boolean;
  };
}