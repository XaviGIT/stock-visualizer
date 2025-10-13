import type { CompanyAnalysis } from "$lib/types/analysis.type";
import type { SearchResult } from "$lib/types/search.type";
import type { Stock } from "$lib/types/stock.type";

const API_BASE_URL = 'http://localhost:8888/api/v1';

interface CompanyDetailResponse {
  company: Stock;
  balanceSheets: any[];
  incomeStatements: any[];
  cashFlows: any[];
}

interface UpdateMetadataPayload {
  peterLynchCategory?: 'slow-grower' | 'stalwart' | 'fast-grower' | 'cyclical' | 'turnaround' | 'asset-play';
  isBusinessStable?: boolean;
  canUnderstandDebt?: boolean;
}

export const stockApi = {
    async search(term: string): Promise<SearchResult[]> {
        if (!term.trim()) {
            return [];
        }

        try {
            const response = await fetch(`${API_BASE_URL}/companies?term=${encodeURIComponent(term)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error searching stocks:', error);
            throw error;
        }
    },

    async getCompany(ticker: string): Promise<Stock> {
        try {
            const response = await fetch(`${API_BASE_URL}/companies/${ticker.toUpperCase()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: CompanyDetailResponse = await response.json();
            
            // Return just the company object for now
            // Later we can extend this to return financial statements too
            return data.company;
        } catch (error) {
            console.error('Error fetching stock:', error);
            throw error;
        }
    },

    async getAnalysis(ticker: string): Promise<CompanyAnalysis> {
        try {
            const response = await fetch(`${API_BASE_URL}/analysis/${ticker.toUpperCase()}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching analysis:', error);
            throw error;
        }
    },

    async updateMetadata(ticker: string, payload: UpdateMetadataPayload) {
        const response = await fetch(`${API_BASE_URL}/analysis/${ticker.toUpperCase()}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        });
        
        if (!response.ok) {
         throw new Error(`Failed to update metadata: ${response.statusText}`);
        }
        
        return response.json();
    }
}