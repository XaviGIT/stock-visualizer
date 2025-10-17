export interface Valuation {
  id: string;
  companyId: string;
  scenarioName: string;

  // Inputs
  discountRate: string; // Stored as string from decimal
  perpetualGrowthRate: string;
  sharesOutstanding: number;

  // 10-year FCF projections
  fcfYear1: number | null;
  fcfYear2: number | null;
  fcfYear3: number | null;
  fcfYear4: number | null;
  fcfYear5: number | null;
  fcfYear6: number | null;
  fcfYear7: number | null;
  fcfYear8: number | null;
  fcfYear9: number | null;
  fcfYear10: number | null;

  // Calculated results
  totalDiscountedFcf: number | null;
  perpetuityValue: number | null;
  discountedPerpetuityValue: number | null;
  totalEquityValue: number | null;
  intrinsicValuePerShare: string | null;

  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ValuationResponse {
  ticker: string;
  companyName: string;
  valuation: Valuation;
  calculation?: {
    discountedFcfs: number[];
    marginOfSafety: string | null;
  };
}

export interface ValuationsListResponse {
  ticker: string;
  companyName: string;
  valuations: Valuation[];
}

export interface SensitivityTable {
  [discountRate: string]: {
    [growthRate: string]: number;
  };
}

export interface SensitivityResponse {
  ticker: string;
  companyName: string;
  baseValuation: string;
  currentPrice: string | null;
  sensitivityTable: SensitivityTable;
}

export interface CreateValuationPayload {
  scenarioName?: string;
  discountRate: number;
  perpetualGrowthRate: number;
  sharesOutstanding: number;
  fcfYear1: number;
  fcfYear2: number;
  fcfYear3: number;
  fcfYear4: number;
  fcfYear5: number;
  fcfYear6: number;
  fcfYear7: number;
  fcfYear8: number;
  fcfYear9: number;
  fcfYear10: number;
  notes?: string;
}

export interface CompanyFinancials {
  shares: number;
  currentFCF: number | null;
}
