export interface SectorAnalysisResponse {
  ticker: string;
  companyName: string;
  industry: {
    id: string;
    name: string;
    description: string | null;
  };
  sector: {
    id: string;
    name: string;
  } | null;
  industryOverview: {
    // Changed from sectorOverview
    totalCompanies: number;
    avgMarketCap: number;
    medianMarketCap: number;
    totalMarketCap: number;
    avgRevenue: number | null;
    avgProfitMargin: number | null;
    avgRevenueGrowth: number | null;
  };
  companyPosition: {
    marketCapRank: CompanyRanking;
    revenueRank: CompanyRanking;
    profitMarginRank: CompanyRanking;
  };
  peerComparison: PeerCompany[];
}

export interface CompanyRanking {
  metric: string;
  rank: number;
  total: number;
  percentile: number;
  value: number | null;
}

export interface PeerCompany {
  id: string;
  ticker: string;
  name: string;
  marketCap: number | null;
  revenue: number | null;
  profitMargin: number | null;
  revenueGrowth: number | null;
  price: string | null;
}

export interface PeerComparisonResponse {
  ticker: string;
  companyName: string;
  industryName: string | null;
  peers: PeerCompany[];
}

export interface IndustryListItem {
  id: string;
  name: string;
  description: string | null;
  companyCount: number;
  totalMarketCap: number;
}

export interface IndustryListResponse {
  industries: IndustryListItem[];
  total: number;
}
