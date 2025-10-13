<script lang="ts">
  import type {
    CompanyAnalysis,
    CompanyCategory,
  } from "$lib/types/analysis.type";
  import CompanyCategorySelect from "./companyCategorySelect.svelte";
  import CapitalizationIndicator from "./capitalizationIndicator.svelte";
  import ROEGauge from "./roeGauge.svelte";
  import DebtAnalysis from "./debtAnalysis.svelte";
  import CashFlowChart from "./cashFlowChart.svelte";
  import ShareDilutionIndicator from "./shareDilutionIndicator.svelte";
  import EarningsGrowthWidget from "./earningsGrowthWidget.svelte";

  export let data: CompanyAnalysis;

  let selectedCategory: CompanyCategory | null =
    data.userInputs?.selectedCategory || null;
  let isBusinessStable = data.userInputs?.isBusinessStable || false;
  let canUnderstandDebt = data.userInputs?.canUnderstandDebt || false;

  $: metrics = { ...data.quickAnalysis, ...data.companyInfo };

  const handleCategoryChange = (category: CompanyCategory) => {
    selectedCategory = category;
    // TODO: Save to backend
  };
</script>

<div class="quick-analysis-section">
  <div class="section-header">
    <div class="header-content">
      <h2>⚡ 10-Minute Test</h2>
      <p class="section-description">
        Quick and dirty analysis - Peter Lynch style
      </p>
    </div>
  </div>

  <div class="analysis-grid">
    <!-- Company Classification -->
    <div class="analysis-card full-width">
      <h3>📊 Company Classification</h3>
      <div class="card-content">
        <CompanyCategorySelect
          selected={selectedCategory}
          onChange={handleCategoryChange}
        />
      </div>
    </div>

    <!-- Capitalization & Special Situations -->
    <div class="analysis-card">
      <h3>💼 Capitalization & Flags</h3>
      <div class="card-content">
        <CapitalizationIndicator
          size={metrics.capitalizationSize}
          marketCap={metrics.marketCap}
          isRecentIPO={metrics.isRecentIPO}
          isSpinoff={metrics.isSpinoff}
          ipoDate={metrics.ipoDate}
        />
      </div>
    </div>

    <!-- Profitability Quick Checks -->
    <div class="analysis-card">
      <h3>✅ Profitability Checks</h3>
      <div class="card-content">
        <div class="check-item">
          <div
            class="check-icon {metrics.hasEverMadeOperatingProfit
              ? 'success'
              : 'warning'}"
          >
            {metrics.hasEverMadeOperatingProfit ? "✓" : "✗"}
          </div>
          <div class="check-label">
            <strong>Operating Profit</strong>
            <span>{metrics.hasEverMadeOperatingProfit ? "Yes" : "Never"}</span>
          </div>
        </div>

        <div class="check-item">
          <div
            class="check-icon {metrics.consistentCashFlowGeneration
              ? 'success'
              : 'warning'}"
          >
            {metrics.consistentCashFlowGeneration ? "✓" : "✗"}
          </div>
          <div class="check-label">
            <strong>Consistent Cash Flows</strong>
            <span>{metrics.consistentCashFlowGeneration ? "Yes" : "No"}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- ROE & Leverage -->
    <div class="analysis-card">
      <h3>📈 Return on Equity & Leverage</h3>
      <div class="card-content">
        <ROEGauge
          roe={metrics.averageROE}
          leverageRatio={metrics.financialLeverageRatio}
          debtToEquity={metrics.debtToEquity}
          leverageLevel={metrics.leverageLevel}
        />
      </div>
    </div>

    <!-- Earnings Consistency -->
    <div class="analysis-card full-width">
      <h3>💹 Earnings Growth</h3>
      <div class="card-content">
        <EarningsGrowthWidget
          consistency={metrics.earningsGrowthConsistency}
          earningsData={metrics.earningsData}
        />
      </div>
    </div>

    <!-- Debt Analysis -->
    <div class="analysis-card full-width">
      <h3>🏦 Balance Sheet - Debt Analysis</h3>
      <div class="card-content">
        <DebtAnalysis
          totalDebt={metrics.totalDebt}
          totalAssets={metrics.totalAssets}
          debtToEquity={metrics.debtToEquity}
          financialLeverageRatio={metrics.financialLeverageRatio}
          debtTrend={metrics.debtTrend}
          bind:isBusinessStable
          bind:canUnderstandDebt
        />
      </div>
    </div>

    <!-- Cash Flow Analysis -->
    <div class="analysis-card">
      <h3>💰 Cash Flow Analysis</h3>
      <div class="card-content">
        <CashFlowChart
          cashFlows={metrics.operatingCashFlow}
          trend={metrics.cashFlowTrend}
        />
      </div>
    </div>

    <!-- Share Dilution -->
    <div class="analysis-card">
      <h3>📊 Shares Outstanding</h3>
      <div class="card-content">
        <ShareDilutionIndicator
          sharesHistory={metrics.sharesOutstanding}
          dilutionType={metrics.shareDilution}
          dilutionPercentage={metrics.dilutionPercentage}
        />
      </div>
    </div>
  </div>
</div>

<style>
  .quick-analysis-section {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
    margin-bottom: 2rem;
  }

  .section-header {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 2px solid var(--border-color);
  }

  .header-content h2 {
    color: var(--text-primary);
    font-size: 1.8rem;
    margin-bottom: 0.5rem;
  }

  .section-description {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  .analysis-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 1.5rem;
  }

  .analysis-card {
    background: var(--bg-secondary);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    border: 1px solid var(--border-color);
    transition: all 0.2s ease;
  }

  .analysis-card:hover {
    box-shadow: var(--shadow-sm);
    border-color: var(--card-hover-border);
  }

  .analysis-card.full-width {
    grid-column: 1 / -1;
  }

  .analysis-card h3 {
    color: var(--text-primary);
    font-size: 1.1rem;
    margin-bottom: 1rem;
    padding-bottom: 0.75rem;
    border-bottom: 1px solid var(--border-color);
  }

  .card-content {
    color: var(--text-secondary);
  }

  /* Profitability Checks */
  .check-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    background: var(--card-bg);
    border-radius: 8px;
    margin-bottom: 0.75rem;
  }

  .check-item:last-child {
    margin-bottom: 0;
  }

  .check-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 1.2rem;
    flex-shrink: 0;
  }

  .check-icon.success {
    background: var(--accent-success);
    color: white;
  }

  .check-icon.warning {
    background: var(--accent-error);
    color: white;
  }

  .check-label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .check-label strong {
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .check-label span {
    color: var(--text-tertiary);
    font-size: 0.85rem;
  }

  /* Earnings Consistency Badge */
  .consistency-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-radius: 12px;
    font-size: 1.1rem;
    font-weight: 600;
  }

  .consistency-badge.consistent {
    background: var(--accent-success);
    color: white;
  }

  .consistency-badge.erratic {
    background: #f59e0b;
    color: white;
  }

  .consistency-badge.declining {
    background: var(--accent-error);
    color: white;
  }

  .badge-icon {
    font-size: 1.5rem;
  }

  @media (max-width: 768px) {
    .analysis-grid {
      grid-template-columns: 1fr;
    }

    .quick-analysis-section {
      padding: 1.5rem;
    }
  }
</style>
