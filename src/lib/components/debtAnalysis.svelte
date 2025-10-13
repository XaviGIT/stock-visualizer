<script lang="ts">
  export let totalDebt: number;
  export let totalAssets: number;
  export let debtToEquity: number;
  export let financialLeverageRatio: number;
  export let debtTrend: "increasing" | "stable" | "decreasing";
  export let isBusinessStable: boolean;
  export let canUnderstandDebt: boolean;

  const formatCurrency = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
  };

  const getDebtLevel = (debtToEquity: number, leverageRatio: number) => {
    if (debtToEquity > 1 || leverageRatio > 4) return "high";
    if (debtToEquity > 0.5 || leverageRatio > 2.5) return "moderate";
    return "low";
  };

  const getTrendIcon = (trend: string) => {
    if (trend === "increasing") return "📈";
    if (trend === "decreasing") return "📉";
    return "➡️";
  };

  const getTrendColor = (trend: string) => {
    if (trend === "increasing") return "#ef4444";
    if (trend === "decreasing") return "#10b981";
    return "#6b7280";
  };

  $: debtLevel = getDebtLevel(debtToEquity, financialLeverageRatio);
  $: isHighDebt = debtLevel === "high";
  $: debtRatio = totalAssets > 0 ? (totalDebt / totalAssets) * 100 : 0;
</script>

<div class="debt-analysis">
  <!-- Debt Overview -->
  <div class="debt-overview">
    <div class="debt-metrics">
      <div class="metric-card">
        <span class="metric-icon">💰</span>
        <div class="metric-content">
          <span class="metric-label">Total Debt</span>
          <span class="metric-value">{formatCurrency(totalDebt)}</span>
        </div>
      </div>

      <div class="metric-card">
        <span class="metric-icon">📊</span>
        <div class="metric-content">
          <span class="metric-label">Total Assets</span>
          <span class="metric-value">{formatCurrency(totalAssets)}</span>
        </div>
      </div>

      <div class="metric-card">
        <span class="metric-icon">📉</span>
        <div class="metric-content">
          <span class="metric-label">Debt Ratio</span>
          <span class="metric-value">{debtRatio.toFixed(1)}%</span>
        </div>
      </div>
    </div>

    <!-- Debt Level Indicator -->
    <div class="debt-level-indicator {debtLevel}">
      <div class="indicator-header">
        <strong>Debt Level: {debtLevel.toUpperCase()}</strong>
        <span class="trend-badge" style="color: {getTrendColor(debtTrend)}">
          {getTrendIcon(debtTrend)}
          {debtTrend}
        </span>
      </div>
      <div class="debt-bar">
        <div class="debt-fill" style="width: {Math.min(debtRatio, 100)}%"></div>
      </div>
    </div>
  </div>

  <!-- High Debt Analysis (only show if debt is high for non-banks) -->
  {#if isHighDebt}
    <div class="high-debt-section">
      <div class="section-header">
        <span class="warning-icon">⚠️</span>
        <strong>High Debt Detected - Additional Analysis Required</strong>
      </div>

      <div class="debt-checklist">
        <div class="checklist-item">
          <div class="check-result">
            <span
              class="result-icon"
              class:negative={debtTrend === "increasing"}
            >
              {debtTrend === "increasing" ? "❌" : "✅"}
            </span>
            <div class="result-content">
              <strong>Debt Trend vs Total Assets</strong>
              <span>
                Debt is <strong style="color: {getTrendColor(debtTrend)}"
                  >{debtTrend}</strong
                >
                relative to total assets
              </span>
            </div>
          </div>
        </div>

        <div class="checklist-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              bind:checked={isBusinessStable}
              class="custom-checkbox"
            />
            <div class="checkbox-content">
              <strong>Is the business stable?</strong>
              <span class="help-text">
                E.g., Consumer products, utilities, established brands
              </span>
            </div>
          </label>
        </div>

        <div class="checklist-item">
          <label class="checkbox-label">
            <input
              type="checkbox"
              bind:checked={canUnderstandDebt}
              class="custom-checkbox"
            />
            <div class="checkbox-content">
              <strong>Can you understand the debt structure?</strong>
              <span class="help-text">
                Are terms clear? Maturity dates reasonable? Covenants
                manageable?
              </span>
            </div>
          </label>
        </div>
      </div>

      <!-- Summary Assessment -->
      {#if isBusinessStable && canUnderstandDebt && debtTrend !== "increasing"}
        <div class="assessment positive">
          <span class="assessment-icon">✅</span>
          <div class="assessment-content">
            <strong>Debt may be manageable</strong>
            <p>
              While leverage is high, the business appears stable, debt is
              understandable, and not rapidly increasing.
            </p>
          </div>
        </div>
      {:else}
        <div class="assessment negative">
          <span class="assessment-icon">⚠️</span>
          <div class="assessment-content">
            <strong>Exercise caution</strong>
            <p>
              High debt combined with concerning factors. Investigate further
              before investing.
            </p>
          </div>
        </div>
      {/if}
    </div>
  {:else}
    <div class="low-debt-note">
      <span class="note-icon">✅</span>
      <p>
        Debt levels appear reasonable. Company maintains healthy leverage
        ratios.
      </p>
    </div>
  {/if}
</div>

<style>
  .debt-analysis {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .debt-overview {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .debt-metrics {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
  }

  .metric-card {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .metric-icon {
    font-size: 1.5rem;
  }

  .metric-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .metric-label {
    font-size: 0.8rem;
    color: var(--text-tertiary);
    font-weight: 500;
  }

  .metric-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .debt-level-indicator {
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid;
  }

  .debt-level-indicator.low {
    background: #d1fae5;
    border-color: #10b981;
  }

  .debt-level-indicator.moderate {
    background: #fef3c7;
    border-color: #f59e0b;
  }

  .debt-level-indicator.high {
    background: #fee2e2;
    border-color: #ef4444;
  }

  .indicator-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.75rem;
  }

  .indicator-header strong {
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .trend-badge {
    font-size: 0.85rem;
    font-weight: 600;
  }

  .debt-bar {
    height: 12px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
    overflow: hidden;
  }

  .debt-fill {
    height: 100%;
    background: linear-gradient(90deg, #10b981, #f59e0b, #ef4444);
    transition: width 0.3s ease;
  }

  .high-debt-section {
    background: var(--card-bg);
    padding: 1.25rem;
    border-radius: 8px;
    border: 2px solid #fbbf24;
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid var(--border-color);
  }

  .warning-icon {
    font-size: 1.5rem;
  }

  .section-header strong {
    color: var(--text-primary);
    font-size: 1rem;
  }

  .debt-checklist {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .checklist-item {
    padding: 1rem;
    background: var(--bg-secondary);
    border-radius: 8px;
  }

  .check-result {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .result-icon {
    font-size: 1.5rem;
  }

  .result-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .result-content strong {
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .result-content span {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  .checkbox-label {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    cursor: pointer;
  }

  .custom-checkbox {
    width: 20px;
    height: 20px;
    margin-top: 2px;
    cursor: pointer;
    flex-shrink: 0;
  }

  .checkbox-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .checkbox-content strong {
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .help-text {
    color: var(--text-tertiary);
    font-size: 0.8rem;
    line-height: 1.4;
  }

  .assessment {
    margin-top: 1rem;
    padding: 1rem;
    border-radius: 8px;
    display: flex;
    gap: 0.75rem;
    align-items: flex-start;
  }

  .assessment.positive {
    background: #d1fae5;
    border: 1px solid #10b981;
  }

  .assessment.negative {
    background: #fee2e2;
    border: 1px solid #ef4444;
  }

  .assessment-icon {
    font-size: 1.5rem;
  }

  .assessment-content strong {
    display: block;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
  }

  .assessment-content p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
  }

  .low-debt-note {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: #d1fae5;
    border: 1px solid #10b981;
    border-radius: 8px;
  }

  .note-icon {
    font-size: 1.5rem;
  }

  .low-debt-note p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .debt-metrics {
      grid-template-columns: 1fr;
    }

    .indicator-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }
  }
</style>
