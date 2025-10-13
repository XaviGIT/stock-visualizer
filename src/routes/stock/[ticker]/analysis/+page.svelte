<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { stockApi } from "$lib/services/api";
  import type { CompanyAnalysis } from "$lib/types/analysis.type";
  import QuickAnalysis from "$lib/components/quickAnalysis.svelte";
  import ThemeToggle from "$lib/components/themeToggle.svelte";

  $: ticker = $page.params.ticker || "";

  let analysisData: CompanyAnalysis | null = null;
  let isLoading = true;
  let errorMessage = "";

  onMount(async () => {
    await fetchAnalysisData();
  });

  const fetchAnalysisData = async () => {
    isLoading = true;
    errorMessage = "";

    try {
      const rawData = await stockApi.getAnalysis(ticker);

      // Transform the API response to match the component's expected structure
      analysisData = transformAnalysisData(rawData);
    } catch (error) {
      errorMessage = "Failed to load analysis data. Please try again.";
      console.error("Error fetching analysis:", error);
    } finally {
      isLoading = false;
    }
  };

  const transformAnalysisData = (raw: any): CompanyAnalysis => {
    // Extract full cash flow history from API response
    const cashFlowAmounts = raw.cashFlow.cashFlowHistory?.map(
      (item: any) => item.amount,
    ) || [raw.cashFlow.latestOperatingCF || 0];

    return {
      companyInfo: raw.companyInfo,
      quickAnalysis: {
        // Company Classification
        capitalizationSize: raw.metadata.marketCapCategory || "mid",
        ipoDate: raw.metadata.ipoDate,
        isRecentIPO: raw.metadata.isRecentIPO,
        isSpinoff: raw.metadata.isSpinoff,

        // Profitability Checks
        hasEverMadeOperatingProfit: raw.profitability.everProfitable,
        consistentCashFlowGeneration: raw.cashFlow.consistentCashFlow,

        // Returns & Leverage
        averageROE: raw.returns.avgROE || 0,
        roeAbove10Percent: raw.returns.roeAbove10,
        financialLeverageRatio: raw.returns.financialLeverageRatio || 0,
        debtToEquity: raw.returns.debtToEquity || 0,
        leverageLevel: raw.returns.leverageLevel || "low",

        // Earnings
        earningsGrowthConsistency:
          raw.earnings.consistency === "growing"
            ? "consistent"
            : raw.earnings.consistency === "declining"
              ? "declining"
              : "erratic",
        earningsData: {
          epsHistory: raw.earnings.epsHistory || [],
          growthRate: raw.earnings.earningsGrowth,
          volatilityScore: raw.earnings.volatilityScore,
          consistency: raw.earnings.consistency,
        },

        // Balance Sheet
        totalDebt: raw.balanceSheet.totalDebt,
        totalAssets: raw.balanceSheet.totalAssets || 0,
        debtTrend: raw.balanceSheet.debtTrend,

        // Cash Flow
        operatingCashFlow: cashFlowAmounts,
        cashFlowTrend:
          raw.cashFlow.cfGrowthRate > 5
            ? "growing"
            : raw.cashFlow.cfGrowthRate < -5
              ? "declining"
              : "stable",

        // Shares Outstanding
        sharesOutstanding:
          raw.shares.sharesHistory?.map((s: any) => s.shares) || [],
        shareDilution:
          raw.shares.trend === "diluting"
            ? "significant-increase"
            : raw.shares.trend === "buying-back"
              ? "buyback"
              : "stable",
        dilutionPercentage: raw.shares.changePercent_1yr || 0,
      },
      // Map userInputs from backend properly
      userInputs: {
        selectedCategory: raw.userInputs?.peterLynchCategory || null,
        isBusinessStable: raw.userInputs?.isBusinessStable || false,
        canUnderstandDebt: raw.userInputs?.canUnderstandDebt || false,
      },
    };
  };
</script>

<ThemeToggle />

<div class="page-wrapper">
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Home</a>
      <span class="separator">›</span>
      <a href="/stock/{ticker}">{ticker}</a>
      <span class="separator">›</span>
      <span class="current">Analysis</span>
    </nav>

    <div class="page-header">
      <h1>Stock Analysis</h1>
      <p class="ticker-label">{ticker}</p>
    </div>

    {#if isLoading}
      <div class="loading-card">
        <div class="spinner"></div>
        <p>Loading analysis data...</p>
      </div>
    {:else if errorMessage}
      <div class="error-card">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        <p>{errorMessage}</p>
        <button on:click={fetchAnalysisData} class="retry-btn">
          Try Again
        </button>
      </div>
    {:else if analysisData}
      <QuickAnalysis data={analysisData} />

      <!-- Placeholder for future sections -->
      <div class="coming-soon-sections">
        <div class="section-placeholder">
          <h2>📈 Growth Analysis</h2>
          <p>Coming soon...</p>
        </div>
        <div class="section-placeholder">
          <h2>💰 Profitability Analysis</h2>
          <p>Coming soon...</p>
        </div>
        <div class="section-placeholder">
          <h2>🏦 Financial Health</h2>
          <p>Coming soon...</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
    background: var(--bg-primary);
    padding: 2rem 1rem;
  }

  .container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .breadcrumb {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 2rem;
    font-size: 0.9rem;
  }

  .breadcrumb a {
    color: var(--accent-primary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .breadcrumb a:hover {
    color: var(--accent-primary-hover);
  }

  .separator {
    color: var(--text-tertiary);
  }

  .current {
    color: var(--text-secondary);
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-header h1 {
    color: var(--text-primary);
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  .ticker-label {
    color: var(--accent-primary);
    font-size: 1.2rem;
    font-weight: 600;
  }

  .loading-card,
  .error-card {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
  }

  .spinner {
    width: 50px;
    height: 50px;
    margin: 0 auto 1.5rem;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-card svg {
    color: var(--accent-error);
    margin-bottom: 1rem;
  }

  .retry-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    margin-top: 1rem;
  }

  .retry-btn:hover {
    background: var(--accent-primary-hover);
  }

  .coming-soon-sections {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    margin-top: 3rem;
  }

  .section-placeholder {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: var(--border-radius);
    border: 2px dashed var(--card-border);
    text-align: center;
    opacity: 0.6;
  }

  .section-placeholder h2 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .section-placeholder p {
    color: var(--text-tertiary);
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }
  }
</style>
