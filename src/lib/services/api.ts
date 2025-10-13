import type { SearchResult } from "$lib/types/search.type";
import type { Stock } from "$lib/types/stock.type";

const API_BASE_URL = 'http://localhost:8888/api/v1';

interface CompanyDetailResponse {
  company: Stock;
  balanceSheets: any[];
  incomeStatements: any[];
  cashFlows: any[];
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

    async getByTicker(ticker: string): Promise<Stock> {
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
    }
}