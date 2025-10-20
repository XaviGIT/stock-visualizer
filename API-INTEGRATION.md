# API Integration Guide

This document covers how the Stock Visualizer frontend integrates with the backend API, including available endpoints, request/response patterns, and integration best practices.

## 🔌 API Configuration

### Base URL Configuration
The API base URL is configured in `src/lib/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:8888/api/v1";
```

**Environment Setup:**
- **Development**: `http://localhost:8888/api/v1`
- **Production**: Update to your production API URL
- **Staging**: Update to your staging API URL

### API Client Structure
The frontend uses a service layer pattern with separate API clients:

```typescript
// Main API clients
export const stockApi = { ... };      // Company and financial data
export const valuationApi = { ... };  // DCF valuations
export const storyApi = { ... };      // Investment stories
```

## 📡 Available Endpoints

### Company Data

#### Search Companies
```typescript
// GET /companies?term={searchTerm}
stockApi.search(term: string): Promise<SearchResult[]>
```

**Request:**
```typescript
const results = await stockApi.search("apple");
```

**Response:**
```typescript
interface SearchResult {
  ticker: string;
  name: string;
  exchange: string;
}
```

#### Get Company Details
```typescript
// GET /companies/{ticker}
stockApi.getCompany(ticker: string): Promise<Stock>
```

**Request:**
```typescript
const company = await stockApi.getCompany("AAPL");
```

**Response:**
```typescript
interface Stock {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  sector?: string | null;
  category?: string | null;
  price?: string | null;
  shares?: number | null;
  website?: string | null;
  description?: string | null;
  nextEarnings?: string | null;
  lastFullFetch?: string | null;
  createdAt: string;
  updatedAt: string;
}
```

#### Get Company Financials
```typescript
// GET /companies/{ticker}/financials
stockApi.getCompanyFinancials(ticker: string): Promise<CompanyFinancials>
```

**Response:**
```typescript
interface CompanyFinancials {
  ticker: string;
  companyName: string;
  shares: number;
  currentFCF: number | null;
  latestPeriod: string | null;
}
```

#### Get Financial Statements
```typescript
// GET /companies/{ticker}/financials/statements
stockApi.getFinancialStatements(ticker: string): Promise<FinancialStatementsResponse>
```

**Response:**
```typescript
interface FinancialStatementsResponse {
  ticker: string;
  companyName: string;
  sector: string;
  balanceSheets: BalanceSheet[];
  incomeStatements: IncomeStatement[];
  cashFlows: CashFlow[];
  metadata: {
    balanceSheetsCount: number;
    incomeStatementsCount: number;
    cashFlowsCount: number;
    oldestPeriod: string;
    latestPeriod: string;
  };
}
```

#### Get Company Analysis
```typescript
// GET /analysis/{ticker}
stockApi.getAnalysis(ticker: string): Promise<CompanyAnalysis>
```

**Response:**
```typescript
interface CompanyAnalysis {
  companyInfo: Stock;
  quickAnalysis: {
    capitalizationSize: string;
    ipoDate: string | null;
    isRecentIPO: boolean;
    isSpinoff: boolean;
    hasEverMadeOperatingProfit: boolean;
    consistentCashFlowGeneration: boolean;
    averageROE: number;
    roeAbove10Percent: boolean;
    financialLeverageRatio: number;
    debtToEquity: number;
    leverageLevel: string;
    earningsGrowthConsistency: string;
    earningsData: {
      epsHistory: number[];
      growthRate: number;
      volatilityScore: number;
      consistency: string;
    };
    totalDebt: number;
    totalAssets: number;
    debtTrend: string;
    operatingCashFlow: number[];
    cashFlowTrend: string;
    sharesOutstanding: number[];
    shareDilution: string;
    dilutionPercentage: number;
  };
  userInputs: {
    selectedCategory: string | null;
    isBusinessStable: boolean;
    canUnderstandDebt: boolean;
  };
}
```

### Valuation Data

#### Get All Valuations
```typescript
// GET /valuations/{ticker}
valuationApi.getValuations(ticker: string): Promise<ValuationsListResponse>
```

**Response:**
```typescript
interface ValuationsListResponse {
  ticker: string;
  companyName: string;
  valuations: Valuation[];
}
```

#### Create Valuation
```typescript
// POST /valuations/{ticker}
valuationApi.createValuation(ticker: string, payload: CreateValuationPayload): Promise<ValuationResponse>
```

**Request:**
```typescript
interface CreateValuationPayload {
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
```

#### Update Valuation
```typescript
// PUT /valuations/{ticker}/{id}
valuationApi.updateValuation(ticker: string, id: string, payload: Partial<CreateValuationPayload>): Promise<ValuationResponse>
```

#### Delete Valuation
```typescript
// DELETE /valuations/{ticker}/{id}
valuationApi.deleteValuation(ticker: string, id: string): Promise<void>
```

#### Get Sensitivity Analysis
```typescript
// POST /valuations/{ticker}/sensitivity
valuationApi.getSensitivityAnalysis(ticker: string, valuationId: string): Promise<SensitivityResponse>
```

**Response:**
```typescript
interface SensitivityResponse {
  ticker: string;
  companyName: string;
  baseValuation: string;
  currentPrice: string | null;
  sensitivityTable: SensitivityTable;
}

interface SensitivityTable {
  [discountRate: string]: {
    [growthRate: string]: number;
  };
}
```

### Story Data

#### Get Investment Story
```typescript
// GET /stories/{ticker}
storyApi.getStory(ticker: string): Promise<StoryResponse>
```

**Response:**
```typescript
interface StoryResponse {
  ticker: string;
  companyName: string;
  story: {
    id?: string;
    content: StoryContent;
    lastEdited: string | null;
    createdAt?: string;
  };
}

interface StoryContent {
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
```

#### Save Investment Story
```typescript
// PUT /stories/{ticker}
storyApi.saveStory(ticker: string, content: StoryContent): Promise<StoryResponse>
```

## 🔄 Request/Response Patterns

### Standard Request Pattern
All API calls follow a consistent pattern:

```typescript
async function apiCall(params: any): Promise<ResponseType> {
  try {
    const response = await fetch(`${API_BASE_URL}/endpoint`, {
      method: 'GET', // or POST, PUT, DELETE
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params), // for POST/PUT requests
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in API call:", error);
    throw error;
  }
}
```

### Error Handling
Consistent error handling across all API calls:

```typescript
try {
  const data = await stockApi.getCompany(ticker);
  // Handle success
} catch (error) {
  if (error.message.includes("404")) {
    // Handle not found
  } else if (error.message.includes("500")) {
    // Handle server error
  } else {
    // Handle other errors
  }
  console.error("API Error:", error);
}
```

### Loading States
Components handle loading states consistently:

```svelte
<script lang="ts">
  let isLoading = true;
  let errorMessage = "";
  let data = null;

  async function fetchData() {
    isLoading = true;
    errorMessage = "";
    
    try {
      data = await stockApi.getCompany(ticker);
    } catch (error) {
      errorMessage = "Failed to load data. Please try again.";
    } finally {
      isLoading = false;
    }
  }
</script>

{#if isLoading}
  <div class="loading">Loading...</div>
{:else if errorMessage}
  <div class="error">{errorMessage}</div>
{:else if data}
  <!-- Display data -->
{/if}
```

## 🛠 Adding New API Endpoints

### 1. Define TypeScript Types
```typescript
// src/lib/types/newFeature.type.ts
export interface NewFeatureData {
  id: string;
  name: string;
  value: number;
  createdAt: string;
}

export interface NewFeatureResponse {
  ticker: string;
  companyName: string;
  data: NewFeatureData[];
}
```

### 2. Add Service Function
```typescript
// src/lib/services/api.ts
export const newFeatureApi = {
  async getData(ticker: string): Promise<NewFeatureResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/new-feature/${ticker.toUpperCase()}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error fetching new feature data:", error);
      throw error;
    }
  },

  async createData(ticker: string, payload: CreateNewFeaturePayload): Promise<NewFeatureResponse> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/new-feature/${ticker.toUpperCase()}`,
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
      console.error("Error creating new feature data:", error);
      throw error;
    }
  }
};
```

### 3. Use in Components
```svelte
<script lang="ts">
  import { newFeatureApi } from "$lib/services/api";
  import type { NewFeatureData } from "$lib/types/newFeature.type";

  let data: NewFeatureData[] = [];
  let isLoading = true;

  async function loadData() {
    try {
      const response = await newFeatureApi.getData(ticker);
      data = response.data;
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      isLoading = false;
    }
  }
</script>
```

## 🔧 API Configuration

### Environment Variables
For different environments, you can use environment variables:

```typescript
// src/lib/services/api.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8888/api/v1";
```

**Environment file (.env):**
```
VITE_API_BASE_URL=http://localhost:8888/api/v1
```

### CORS Configuration
Ensure your backend API has proper CORS configuration for the frontend domain:

```javascript
// Backend CORS configuration
app.use(cors({
  origin: ['http://localhost:5173', 'https://your-frontend-domain.com'],
  credentials: true
}));
```

### Authentication (Future)
When authentication is added, update the API client:

```typescript
// src/lib/services/api.ts
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const stockApi = {
  async getCompany(ticker: string): Promise<Stock> {
    const response = await fetch(
      `${API_BASE_URL}/companies/${ticker}`,
      {
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
      }
    );
    // ... rest of implementation
  }
};
```

## 📊 Data Flow Examples

### Company Search Flow
```
User types in search → SearchInput component → stockApi.search() → API call → SearchResults component → User clicks result → Navigate to company page
```

### Valuation Creation Flow
```
User clicks "New Valuation" → DCFCalculator component → User fills form → valuationApi.createValuation() → API call → Refresh valuation list → Show new valuation
```

### Story Editing Flow
```
User navigates to story page → storyApi.getStory() → Load existing content → User edits → storyApi.saveStory() → API call → Show success message
```

## 🚨 Error Handling Best Practices

### API Error Types
Handle different types of API errors appropriately:

```typescript
try {
  const data = await stockApi.getCompany(ticker);
} catch (error) {
  if (error.message.includes("404")) {
    // Company not found
    errorMessage = "Company not found. Please check the ticker symbol.";
  } else if (error.message.includes("500")) {
    // Server error
    errorMessage = "Server error. Please try again later.";
  } else if (error.message.includes("NetworkError")) {
    // Network error
    errorMessage = "Network error. Please check your connection.";
  } else {
    // Generic error
    errorMessage = "An unexpected error occurred. Please try again.";
  }
}
```

### Retry Logic
Implement retry logic for transient errors:

```typescript
async function apiCallWithRetry<T>(
  apiCall: () => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      
      // Wait before retry (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
  throw new Error("Max retries exceeded");
}
```

## 📈 Performance Considerations

### Caching
Implement client-side caching for frequently accessed data:

```typescript
// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedData<T>(
  key: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }

  const data = await apiCall();
  cache.set(key, { data, timestamp: Date.now() });
  return data;
}
```

### Request Debouncing
Debounce search requests to avoid excessive API calls:

```typescript
import { debounce } from 'lodash-es';

const debouncedSearch = debounce(async (term: string) => {
  if (term.length >= 2) {
    const results = await stockApi.search(term);
    searchResults = results;
  }
}, 300);
```

This API integration guide provides a comprehensive overview of how the frontend communicates with the backend. For specific endpoint details, refer to the backend API documentation.
