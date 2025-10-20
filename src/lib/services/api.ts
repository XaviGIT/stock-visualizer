import type { CompanyAnalysis } from "$lib/types/analysis.type";
import type { FinancialStatementsResponse } from "$lib/types/financials.type";
import type { SearchResult } from "$lib/types/search.type";
import type {
  PeerComparisonResponse,
  SectorAnalysisResponse,
  SectorListResponse,
} from "$lib/types/sector.type";
import type { Stock } from "$lib/types/stock.type";
import type {
  CreateValuationPayload,
  SensitivityResponse,
  ValuationResponse,
  ValuationsListResponse,
} from "$lib/types/valuation.type";

const API_BASE_URL = "http://localhost:8888/api/v1";

interface CompanyDetailResponse {
  company: Stock;
  balanceSheets: any[];
  incomeStatements: any[];
  cashFlows: any[];
}

interface UpdateMetadataPayload {
  peterLynchCategory?:
    | "slow-grower"
    | "stalwart"
    | "fast-grower"
    | "cyclical"
    | "turnaround"
    | "asset-play";
  isBusinessStable?: boolean;
  canUnderstandDebt?: boolean;
}

export interface StoryContent {
  sections: {
    overview?: string;
    businessModel?: string;
    competitiveAdvantages?: string;
    risks?: string;
    investmentThesis?: string;
    recentDevelopments?: string;
    outlook?: string;
  };
}

export interface StoryResponse {
  ticker: string;
  companyName: string;
  story: {
    id?: string;
    content: StoryContent;
    lastEdited: string | null;
    createdAt?: string;
  };
}

export const stockApi = {
  async search(term: string): Promise<SearchResult[]> {
    if (!term.trim()) {
      return [];
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/companies?term=${encodeURIComponent(term)}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error searching stocks:", error);
      throw error;
    }
  },

  async getCompany(ticker: string): Promise<Stock> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/companies/${ticker.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: CompanyDetailResponse = await response.json();

      // Return just the company object for now
      // Later we can extend this to return financial statements too
      return data.company;
    } catch (error) {
      console.error("Error fetching stock:", error);
      throw error;
    }
  },

  async getAnalysis(ticker: string): Promise<CompanyAnalysis> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/analysis/${ticker.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching analysis:", error);
      throw error;
    }
  },

  async updateMetadata(ticker: string, payload: UpdateMetadataPayload) {
    const response = await fetch(
      `${API_BASE_URL}/analysis/${ticker.toUpperCase()}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update metadata: ${response.statusText}`);
    }

    return response.json();
  },

  async getCompanyFinancials(ticker: string): Promise<{
    ticker: string;
    companyName: string;
    shares: number;
    currentFCF: number | null;
    latestPeriod: string | null;
  }> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/companies/${ticker.toUpperCase()}/financials`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching company financials:", error);
      throw error;
    }
  },

  async getFinancialStatements(
    ticker: string
  ): Promise<FinancialStatementsResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/companies/${ticker.toUpperCase()}/financials/statements`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching financial statements:", error);
      throw error;
    }
  },

  async getSectorAnalysis(ticker: string): Promise<SectorAnalysisResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sectors/${ticker.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching sector analysis:", error);
      throw error;
    }
  },

  async getPeerComparison(
    ticker: string,
    limit: number = 20
  ): Promise<PeerComparisonResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/sectors/${ticker.toUpperCase()}/peers?limit=${limit}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching peer comparison:", error);
      throw error;
    }
  },

  async getAllSectors(): Promise<SectorListResponse> {
    try {
      const response = await fetch(`${API_BASE_URL}/sectors/list`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching sectors:", error);
      throw error;
    }
  },
};

export const valuationApi = {
  async getValuations(ticker: string): Promise<ValuationsListResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/valuations/${ticker.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching valuations:", error);
      throw error;
    }
  },

  async getLatestValuation(ticker: string): Promise<ValuationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/valuations/${ticker.toUpperCase()}/latest`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching latest valuation:", error);
      throw error;
    }
  },

  async getValuationById(
    ticker: string,
    id: string
  ): Promise<ValuationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/valuations/${ticker.toUpperCase()}/${id}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching valuation:", error);
      throw error;
    }
  },

  async createValuation(
    ticker: string,
    payload: CreateValuationPayload
  ): Promise<ValuationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/valuations/${ticker.toUpperCase()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating valuation:", error);
      throw error;
    }
  },

  async updateValuation(
    ticker: string,
    id: string,
    payload: Partial<CreateValuationPayload>
  ): Promise<ValuationResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/valuations/${ticker.toUpperCase()}/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating valuation:", error);
      throw error;
    }
  },

  async deleteValuation(ticker: string, id: string): Promise<void> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/valuations/${ticker.toUpperCase()}/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error deleting valuation:", error);
      throw error;
    }
  },

  async getSensitivityAnalysis(
    ticker: string,
    valuationId: string
  ): Promise<SensitivityResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/valuations/${ticker.toUpperCase()}/sensitivity`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ valuationId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching sensitivity analysis:", error);
      throw error;
    }
  },
};

export const storyApi = {
  async getStory(ticker: string): Promise<StoryResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stories/${ticker.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching story:", error);
      throw error;
    }
  },

  async saveStory(
    ticker: string,
    content: StoryContent
  ): Promise<StoryResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/stories/${ticker.toUpperCase()}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ content }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error saving story:", error);
      throw error;
    }
  },
};
