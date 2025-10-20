# Architecture Guide

This document outlines the technical architecture, design patterns, and structure of the Stock Visualizer frontend application.

## 🏗 Project Structure

```
stock-visualizer/
├── src/
│   ├── lib/                          # Shared library code
│   │   ├── components/              # Reusable UI components
│   │   │   ├── balanceSheetTable.svelte
│   │   │   ├── cashFlowChart.svelte
│   │   │   ├── dfcCalculator.svelte
│   │   │   ├── financialStatementTabs.svelte
│   │   │   ├── quickAnalysis.svelte
│   │   │   ├── searchInput.svelte
│   │   │   ├── searchResults.svelte
│   │   │   ├── themeToggle.svelte
│   │   │   └── valuationList.svelte
│   │   ├── constants/               # Application constants
│   │   │   └── financials.ts
│   │   ├── services/                # API integration layer
│   │   │   └── api.ts
│   │   ├── stores/                  # Svelte stores for state management
│   │   │   └── theme.ts
│   │   ├── types/                   # TypeScript type definitions
│   │   │   ├── analysis.type.ts
│   │   │   ├── financials.type.ts
│   │   │   ├── search.type.ts
│   │   │   ├── sector.type.ts
│   │   │   ├── stock.type.ts
│   │   │   └── valuation.type.ts
│   │   └── utils/                   # Utility functions
│   │       └── formatters.ts
│   ├── routes/                      # File-based routing
│   │   ├── +layout.svelte          # Root layout
│   │   ├── +page.svelte            # Home page (search)
│   │   └── stock/
│   │       └── [ticker]/           # Dynamic stock pages
│   │           ├── +page.svelte    # Company overview
│   │           ├── analysis/       # Financial analysis
│   │           │   └── +page.svelte
│   │           ├── financials/     # Financial statements
│   │           │   └── +page.svelte
│   │           ├── valuation/      # DCF calculator
│   │           │   └── +page.svelte
│   │           ├── story/          # Investment thesis
│   │           │   └── +page.svelte
│   │           └── sector/         # Industry analysis (disabled)
│   │               └── +page.svelte
│   ├── app.html                    # HTML template
│   ├── app.css                     # Global styles
│   └── app-earthy.css              # Theme-specific styles
├── static/                         # Static assets
├── package.json                    # Dependencies and scripts
├── svelte.config.js               # SvelteKit configuration
├── tsconfig.json                  # TypeScript configuration
└── vite.config.ts                 # Vite configuration
```

## 🛠 Tech Stack

### Core Framework
- **SvelteKit 2.43+**: Full-stack framework with file-based routing
- **Svelte 5.39+**: Reactive component framework
- **TypeScript 5.9+**: Type-safe JavaScript
- **Vite 7.1+**: Fast build tool and dev server

### Key Dependencies
- **@sveltejs/kit**: Core SvelteKit framework
- **@sveltejs/vite-plugin-svelte**: Vite integration
- **svelte-check**: TypeScript checking for Svelte

## 🎯 Design Patterns

### 1. Service Layer Pattern
All API communication is centralized in `src/lib/services/api.ts`:

```typescript
export const stockApi = {
  async search(term: string): Promise<SearchResult[]> { ... },
  async getCompany(ticker: string): Promise<Stock> { ... },
  async getAnalysis(ticker: string): Promise<CompanyAnalysis> { ... }
};
```

**Benefits:**
- Centralized API logic
- Consistent error handling
- Easy to mock for testing
- Type-safe API contracts

### 2. Component Composition
Complex features are built by composing smaller, focused components:

```svelte
<!-- Financial statements page -->
<FinancialStatementTabs bind:activeTab />
{#if activeTab === "income-statement"}
  <IncomeStatementTable data={data.incomeStatements} />
{:else if activeTab === "balance-sheet"}
  <BalanceSheetTable data={data.balanceSheets} />
{/if}
```

**Benefits:**
- Reusable components
- Clear separation of concerns
- Easy to test individual pieces
- Maintainable codebase

### 3. Type-Safe API Contracts
All API responses are typed with TypeScript interfaces:

```typescript
export interface Stock {
  id: string;
  ticker: string;
  name: string;
  price?: string | null;
  // ... other properties
}

export interface Valuation {
  id: string;
  scenarioName: string;
  discountRate: string;
  // ... other properties
}
```

**Benefits:**
- Compile-time error checking
- IntelliSense support
- Self-documenting code
- Prevents runtime errors

### 4. Theme System
CSS custom properties enable dynamic theming:

```css
:root[data-theme='light'] {
  --bg-primary: #F5F3EF;
  --text-primary: #344E41;
  --accent-primary: #588157;
}

:root[data-theme='dark'] {
  --bg-primary: #11001c;
  --text-primary: #e8d4f0;
  --accent-primary: #a855f7;
}
```

**Benefits:**
- Consistent color scheme
- Easy theme switching
- Maintainable styling
- No JavaScript required for theming

## 🔄 State Management

### Svelte Stores
The application uses Svelte's built-in reactive stores for state management:

```typescript
// Theme store
export const theme = createThemeStore();

// Usage in components
import { theme } from '$lib/stores/theme';
$: currentTheme = $theme;
```

### State Flow
1. **User Interaction** → Component event handlers
2. **API Calls** → Service layer functions
3. **Data Updates** → Reactive variables
4. **UI Updates** → Svelte's reactivity system

## 🎨 Styling Architecture

### CSS Custom Properties
The application uses CSS custom properties for theming and consistent styling:

```css
.card {
  background: var(--card-bg);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}
```

### Component Scoping
Each component has its own `<style>` block for scoped styles:

```svelte
<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header {
    color: var(--text-primary);
  }
</style>
```

### Responsive Design
The application uses CSS Grid and Flexbox for responsive layouts:

```css
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}
```

## 🔌 API Integration

### Service Layer
All API communication is handled through service functions:

```typescript
// GET request
async getCompany(ticker: string): Promise<Stock> {
  const response = await fetch(`${API_BASE_URL}/companies/${ticker}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}

// POST request
async createValuation(ticker: string, payload: CreateValuationPayload) {
  const response = await fetch(`${API_BASE_URL}/valuations/${ticker}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return await response.json();
}
```

### Error Handling
Consistent error handling across all API calls:

```typescript
try {
  const data = await stockApi.getCompany(ticker);
  company = data;
} catch (error) {
  errorMessage = "Failed to load company data. Please try again.";
  console.error("Error fetching company:", error);
}
```

## 🧩 Component Architecture

### Component Types

#### 1. Page Components
Located in `src/routes/`, these are top-level components that represent entire pages:

```svelte
<!-- src/routes/stock/[ticker]/+page.svelte -->
<script>
  import { page } from "$app/stores";
  import { stockApi } from "$lib/services/api";
  
  $: ticker = $page.params.ticker || "";
  let company = null;
  
  onMount(async () => {
    company = await stockApi.getCompany(ticker);
  });
</script>
```

#### 2. Layout Components
Reusable layout components like `+layout.svelte`:

```svelte
<!-- src/routes/+layout.svelte -->
<script>
  import "../app-earthy.css";
  import { theme } from "$lib/stores/theme";
</script>

<slot />
```

#### 3. Feature Components
Complex functionality broken into focused components:

```svelte
<!-- src/lib/components/dfcCalculator.svelte -->
<script>
  export let ticker: string;
  export let sharesOutstanding: number;
  export let currentFCF: number | null;
  export let onSubmit: (payload: CreateValuationPayload) => void;
  export let onCancel: () => void;
</script>
```

#### 4. UI Components
Small, reusable UI elements:

```svelte
<!-- src/lib/components/themeToggle.svelte -->
<script>
  import { theme } from "$lib/stores/theme";
</script>

<button on:click={theme.toggle}>
  {$theme === 'light' ? '🌙' : '☀️'}
</button>
```

## 🔄 Data Flow

### 1. User Search Flow
```
User Input → SearchInput Component → stockApi.search() → SearchResults Component
```

### 2. Company Analysis Flow
```
Ticker Selection → Company Page → stockApi.getCompany() → Company Overview
                → Analysis Page → stockApi.getAnalysis() → QuickAnalysis Component
```

### 3. Valuation Flow
```
Valuation Page → DCFCalculator Component → valuationApi.createValuation() → ValuationList Component
```

## 🚀 Performance Considerations

### Code Splitting
SvelteKit automatically code-splits based on routes, loading only the necessary JavaScript for each page.

### Lazy Loading
Components are loaded on-demand when navigating to different pages.

### Bundle Optimization
Vite handles tree-shaking and minification for production builds.

## 🔧 Development Workflow

### File Naming Conventions
- Components: `camelCase.svelte`
- Types: `camelCase.type.ts`
- Services: `camelCase.ts`
- Utilities: `camelCase.ts`

### Import Patterns
```typescript
// Relative imports for same-level files
import Component from './Component.svelte';

// Absolute imports for lib files
import { stockApi } from '$lib/services/api';
import type { Stock } from '$lib/types/stock.type';
```

### Component Structure
```svelte
<script lang="ts">
  // 1. Imports
  // 2. Props
  // 3. Reactive variables
  // 4. Functions
  // 5. Lifecycle hooks
</script>

<!-- HTML template -->

<style>
  /* Scoped styles */
</style>
```

This architecture provides a solid foundation for building and maintaining a complex financial application while keeping the codebase organized, type-safe, and performant.
