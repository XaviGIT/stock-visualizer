# Development Guide

This guide covers the development workflow, best practices, and common tasks for the Stock Visualizer frontend.

## 🚀 Getting Started

### Prerequisites
- **Node.js**: Version 18 or higher
- **Package Manager**: npm, yarn, or pnpm
- **Code Editor**: VS Code (recommended) with Svelte extension
- **Git**: For version control

### Initial Setup
1. Clone the repository and install dependencies:
```bash
git clone <repository-url>
cd stock-visualizer
npm install
```

2. Configure the API endpoint:
```typescript
// src/lib/services/api.ts
const API_BASE_URL = "http://localhost:8888/api/v1"; // Update as needed
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser to `http://localhost:5173`

## 📁 Project Structure Walkthrough

### Core Directories

#### `src/lib/`
Contains shared library code used across the application:

- **`components/`**: Reusable UI components
- **`services/`**: API integration layer
- **`stores/`**: Svelte stores for state management
- **`types/`**: TypeScript type definitions
- **`utils/`**: Utility functions and helpers

#### `src/routes/`
SvelteKit's file-based routing system:

- **`+page.svelte`**: Page components
- **`+layout.svelte`**: Layout components
- **`[ticker]/`**: Dynamic routes with parameters

### File Naming Conventions
- **Components**: `camelCase.svelte`
- **Types**: `camelCase.type.ts`
- **Services**: `camelCase.ts`
- **Utilities**: `camelCase.ts`

## 🛠 Development Workflow

### Daily Development
1. **Pull latest changes**: `git pull origin main`
2. **Start dev server**: `npm run dev`
3. **Make changes**: Edit files in your preferred editor
4. **Test changes**: Use browser dev tools and hot reload
5. **Check types**: `npm run check`
6. **Commit changes**: `git add . && git commit -m "description"`

### Feature Development
1. **Create feature branch**: `git checkout -b feature/feature-name`
2. **Implement feature**: Follow component patterns and type safety
3. **Test thoroughly**: Test all user flows and edge cases
4. **Update types**: Add/update TypeScript types as needed
5. **Update documentation**: Update relevant docs if needed
6. **Create pull request**: Submit PR for code review

## 🧩 Adding New Features

### Adding a New Page

1. **Create route file**:
```svelte
<!-- src/routes/stock/[ticker]/new-feature/+page.svelte -->
<script lang="ts">
  import { page } from "$app/stores";
  import ThemeToggle from "$lib/components/themeToggle.svelte";
  
  $: ticker = $page.params.ticker || "";
</script>

<ThemeToggle />

<div class="page-wrapper">
  <div class="container">
    <h1>New Feature for {ticker}</h1>
    <!-- Your content here -->
  </div>
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
    background: var(--bg-primary);
    padding: 2rem 1rem;
  }
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
```

2. **Add navigation link** in the main stock page:
```svelte
<a href="/stock/{ticker}/new-feature" class="action-card">
  <div class="action-icon">🔧</div>
  <div class="action-content">
    <h3>New Feature</h3>
    <p>Description of the new feature</p>
  </div>
  <span class="action-arrow">→</span>
</a>
```

### Adding a New Component

1. **Create component file**:
```svelte
<!-- src/lib/components/newComponent.svelte -->
<script lang="ts">
  export let data: SomeType;
  export let onAction: (value: string) => void;
  
  let localState = "";
  
  function handleClick() {
    onAction(localState);
  }
</script>

<div class="component-wrapper">
  <h2>New Component</h2>
  <input bind:value={localState} />
  <button on:click={handleClick}>Action</button>
</div>

<style>
  .component-wrapper {
    background: var(--card-bg);
    padding: 1rem;
    border-radius: var(--border-radius);
  }
</style>
```

2. **Export from index** (if needed):
```typescript
// src/lib/index.ts
export { default as NewComponent } from './components/newComponent.svelte';
```

### Adding New API Endpoints

1. **Add service function**:
```typescript
// src/lib/services/api.ts
export const stockApi = {
  // ... existing functions
  
  async getNewData(ticker: string): Promise<NewDataType> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/new-endpoint/${ticker.toUpperCase()}`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error("Error fetching new data:", error);
      throw error;
    }
  }
};
```

2. **Add TypeScript types**:
```typescript
// src/lib/types/newData.type.ts
export interface NewDataType {
  id: string;
  name: string;
  value: number;
  // ... other properties
}
```

3. **Use in components**:
```svelte
<script lang="ts">
  import { stockApi } from "$lib/services/api";
  import type { NewDataType } from "$lib/types/newData.type";
  
  let newData: NewDataType | null = null;
  
  async function loadNewData() {
    try {
      newData = await stockApi.getNewData(ticker);
    } catch (error) {
      console.error("Failed to load new data:", error);
    }
  }
</script>
```

## 🎨 Styling Guidelines

### CSS Custom Properties
Always use CSS custom properties for theming:

```css
.component {
  background: var(--card-bg);
  color: var(--text-primary);
  border: 1px solid var(--card-border);
  border-radius: var(--border-radius);
  box-shadow: var(--shadow-md);
}
```

### Component Styling
Use scoped styles in component `<style>` blocks:

```svelte
<style>
  .container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .header {
    color: var(--text-primary);
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .button {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    cursor: pointer;
    transition: all 0.2s ease;
  }
  
  .button:hover {
    background: var(--accent-primary-hover);
    transform: translateY(-2px);
  }
</style>
```

### Responsive Design
Use CSS Grid and Flexbox for responsive layouts:

```css
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
}

.flex {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }
  
  .flex {
    flex-direction: column;
  }
}
```

## 📝 TypeScript Best Practices

### Type Definitions
Always define types for props and data:

```typescript
// Define interfaces for complex data
export interface CompanyData {
  id: string;
  ticker: string;
  name: string;
  price?: string | null;
}

// Use union types for limited options
export type Theme = 'light' | 'dark';

// Use generic types for reusable components
export interface ApiResponse<T> {
  data: T;
  message: string;
}
```

### Component Props
Define props with proper types:

```svelte
<script lang="ts">
  // Required props
  export let ticker: string;
  export let data: CompanyData;
  
  // Optional props with defaults
  export let isLoading: boolean = false;
  export let onAction: (value: string) => void = () => {};
  
  // Reactive props
  $: displayName = data.name || ticker;
</script>
```

### API Types
Match API response types exactly:

```typescript
// Backend response structure
interface BackendResponse {
  company: {
    id: string;
    ticker: string;
    name: string;
  };
  financials: FinancialData[];
}

// Frontend type
export interface CompanyResponse {
  company: Stock;
  financials: FinancialData[];
}
```

## 🔧 Common Tasks

### Adding a New Analysis Metric

1. **Update analysis type**:
```typescript
// src/lib/types/analysis.type.ts
export interface CompanyAnalysis {
  // ... existing properties
  newMetric: {
    value: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    percentile: number;
  };
}
```

2. **Add to analysis component**:
```svelte
<!-- src/lib/components/quickAnalysis.svelte -->
<div class="metric-card">
  <h3>New Metric</h3>
  <div class="metric-value">{data.newMetric.value}%</div>
  <div class="metric-trend">{data.newMetric.trend}</div>
</div>
```

3. **Update API integration** if needed:
```typescript
// src/lib/services/api.ts
// Ensure API returns the new metric data
```

### Creating a New Page Section

1. **Add section to page**:
```svelte
<!-- src/routes/stock/[ticker]/+page.svelte -->
<section class="new-section">
  <h2>New Section</h2>
  <NewSectionComponent {data} />
</section>
```

2. **Create section component**:
```svelte
<!-- src/lib/components/newSectionComponent.svelte -->
<script lang="ts">
  export let data: SectionData;
</script>

<div class="section-content">
  <!-- Section content -->
</div>
```

### Working with Financial Data

1. **Format numbers consistently**:
```typescript
// src/lib/utils/formatters.ts
export function formatCurrency(value: number | null): string {
  if (value === null) return "N/A";
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
  return `$${value.toFixed(2)}`;
}
```

2. **Handle null/undefined values**:
```svelte
{#if data.value !== null && data.value !== undefined}
  <div class="value">{formatCurrency(data.value)}</div>
{:else}
  <div class="value">N/A</div>
{/if}
```

## 🐛 Debugging

### Common Issues

#### TypeScript Errors
- **Missing types**: Add proper type definitions
- **API type mismatches**: Ensure frontend types match backend
- **Component prop types**: Define all props with proper types

#### Runtime Errors
- **API errors**: Check network tab and console for API errors
- **Component errors**: Check browser console for Svelte errors
- **State issues**: Use Svelte devtools to inspect component state

#### Styling Issues
- **Theme not applying**: Check CSS custom property values
- **Responsive issues**: Test on different screen sizes
- **Component styling**: Ensure styles are scoped properly

### Debugging Tools
- **Browser DevTools**: Network, Console, Elements tabs
- **Svelte DevTools**: Browser extension for Svelte debugging
- **VS Code Extensions**: Svelte for VS Code, TypeScript support

## 🧪 Testing

### Manual Testing Checklist
- [ ] Test all user flows end-to-end
- [ ] Test on different screen sizes (mobile, tablet, desktop)
- [ ] Test with different data scenarios (missing data, errors)
- [ ] Test theme switching
- [ ] Test API error handling

### Component Testing
```typescript
// Example component test structure
import { render } from '@testing-library/svelte';
import Component from './Component.svelte';

test('renders component correctly', () => {
  const { getByText } = render(Component, {
    props: { data: mockData }
  });
  
  expect(getByText('Expected Text')).toBeInTheDocument();
});
```

## 📚 Resources

### Documentation
- [SvelteKit Documentation](https://kit.svelte.dev/)
- [Svelte Documentation](https://svelte.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

### Tools
- [VS Code Svelte Extension](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode)
- [Svelte DevTools](https://github.com/sveltejs/svelte-devtools)
- [Vite Documentation](https://vitejs.dev/)

### Best Practices
- Keep components small and focused
- Use TypeScript for type safety
- Follow consistent naming conventions
- Write clean, readable code
- Test thoroughly before committing

This development guide should help you contribute effectively to the Stock Visualizer project. For questions or clarifications, refer to the codebase or create an issue.
