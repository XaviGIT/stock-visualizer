# Stock Visualizer Frontend

A comprehensive stock market analysis application built with SvelteKit, providing investors with tools to research, analyze, and value stocks through multiple lenses.

## 🚀 Features

### Core Functionality
- **Company Search & Discovery**: Search for stocks by ticker or company name with instant results
- **Company Overview**: Detailed company profiles with key metrics, market cap, and business description
- **Financial Analysis**: Comprehensive analysis of profitability, growth, and financial health
- **Financial Statements**: Interactive tables for Income Statements, Balance Sheets, and Cash Flow Statements
- **DCF Valuation**: Discounted Cash Flow calculator with multiple scenario support
- **Investment Story**: Structured editor for documenting investment thesis and analysis
- **Theme Support**: Beautiful light and dark themes with smooth transitions

### Analysis Capabilities
- **Profitability Metrics**: ROE, ROA, ROIC, and margin analysis
- **Growth Analysis**: Revenue and earnings growth trends
- **Financial Health**: Debt analysis, cash flow consistency, and leverage metrics
- **Valuation Tools**: DCF models with sensitivity analysis
- **Peer Comparison**: Industry positioning and competitive analysis (coming soon)

## 🛠 Tech Stack

- **Framework**: [SvelteKit 2.43+](https://kit.svelte.dev/)
- **Language**: [TypeScript 5.9+](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 7.1+](https://vitejs.dev/)
- **Styling**: CSS with custom properties for theming
- **State Management**: Svelte stores
- **API Integration**: RESTful API with type-safe contracts

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Setup
1. Clone the repository:
```bash
git clone <repository-url>
cd stock-visualizer
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
   - Update `API_BASE_URL` in `src/lib/services/api.ts`
   - Default: `http://localhost:8888/api/v1`

4. Start the development server:
```bash
npm run dev
```

5. Open your browser to `http://localhost:5173`

## 🏗 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run check` - Run TypeScript checks

### Project Structure
```
src/
├── lib/
│   ├── components/     # Reusable UI components
│   ├── services/       # API integration layer
│   ├── stores/         # Svelte stores for state
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── routes/             # File-based routing
│   ├── +page.svelte   # Home page
│   └── stock/
│       └── [ticker]/   # Dynamic stock pages
│           ├── +page.svelte      # Company overview
│           ├── analysis/         # Financial analysis
│           ├── financials/       # Financial statements
│           ├── valuation/        # DCF calculator
│           └── story/           # Investment thesis
└── app.html           # HTML template
```

### Environment Configuration
The application requires a backend API. Update the API base URL in `src/lib/services/api.ts`:

```typescript
const API_BASE_URL = "http://localhost:8888/api/v1";
```

## 🎨 Theming

The application supports both light and dark themes with an earthy color palette:

- **Light Theme**: Warm beiges and sage greens
- **Dark Theme**: Deep purples and magentas

Themes are managed through CSS custom properties and can be toggled via the theme toggle component.

## 📊 Data Flow

1. **Search**: User searches for a company by ticker or name
2. **Company Data**: Backend fetches and caches company information
3. **Analysis**: Financial data is processed and analyzed
4. **Display**: Results are presented through interactive components
5. **Persistence**: User stories and valuations are saved to the backend

## 🔧 API Integration

The frontend communicates with a RESTful backend API. See [API-INTEGRATION.md](./API-INTEGRATION.md) for detailed documentation of available endpoints and integration patterns.

## 🚧 Known Issues

- Valuation calculations need verification
- Sector analysis is temporarily disabled pending redesign
- Some financial metrics may need refinement

## 📈 Roadmap

See [ROADMAP.md](./ROADMAP.md) for detailed information about completed features, known issues, and planned enhancements.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📚 Documentation

- [Architecture Guide](./ARCHITECTURE.md) - Technical architecture and patterns
- [Development Guide](./DEVELOPMENT.md) - Development workflow and best practices
- [API Integration](./API-INTEGRATION.md) - Backend integration details
- [Roadmap](./ROADMAP.md) - Feature roadmap and known issues