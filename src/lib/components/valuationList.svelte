<script lang="ts">
  import type { Valuation } from "$lib/types/valuation.type";
  import { valuationApi } from "$lib/services/api";
  import type { SensitivityTable } from "$lib/types/valuation.type";

  export let currentPrice: number | null = null;
  export let valuations: Valuation[];
  export let selectedValuation: Valuation | null;
  export let ticker: string;
  export let onSelect: (valuation: Valuation) => void;
  export let onDelete: (id: string) => void;

  let showSensitivity = false;
  let sensitivityData: SensitivityTable | null = null;
  let loadingSensitivity = false;

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatNumber = (num: number | string | null): string => {
    if (!num) return "N/A";
    const value = typeof num === "string" ? parseFloat(num) : num;

    if (value >= 1000000000) {
      return `$${(value / 1000000000).toFixed(2)}B`;
    } else if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(2)}M`;
    } else if (value >= 1000) {
      return `$${(value / 1000).toFixed(2)}K`;
    }
    return `$${value.toFixed(2)}`;
  };

  const formatCurrency = (value: string | null): string => {
    if (!value) return "N/A";
    return `$${parseFloat(value).toFixed(2)}`;
  };

  const loadSensitivityAnalysis = async () => {
    if (!selectedValuation) return;

    loadingSensitivity = true;
    try {
      const response = await valuationApi.getSensitivityAnalysis(
        ticker,
        selectedValuation.id,
      );
      sensitivityData = response.sensitivityTable;
      showSensitivity = true;
    } catch (error) {
      console.error("Error loading sensitivity analysis:", error);
      alert("Failed to load sensitivity analysis");
    } finally {
      loadingSensitivity = false;
    }
  };

  const getDiscountedFCFs = (): number[] => {
    if (!selectedValuation) return [];

    const fcfs = [
      selectedValuation.fcfYear1,
      selectedValuation.fcfYear2,
      selectedValuation.fcfYear3,
      selectedValuation.fcfYear4,
      selectedValuation.fcfYear5,
      selectedValuation.fcfYear6,
      selectedValuation.fcfYear7,
      selectedValuation.fcfYear8,
      selectedValuation.fcfYear9,
      selectedValuation.fcfYear10,
    ].filter((v): v is number => v !== null);

    const r = parseFloat(selectedValuation.discountRate) / 100;

    return fcfs.map((fcf, index) => {
      const year = index + 1;
      return fcf / Math.pow(1 + r, year);
    });
  };
</script>

<div class="valuation-container">
  <!-- Sidebar: Valuation List -->
  <div class="sidebar">
    <h3>Saved Valuations</h3>
    <div class="valuation-cards">
      {#each valuations as valuation (valuation.id)}
        <div
          class="valuation-card"
          class:active={selectedValuation?.id === valuation.id}
          on:click={() => onSelect(valuation)}
          on:keydown={(e) => e.key === "Enter" && onSelect(valuation)}
          role="button"
          tabindex="0"
        >
          <div class="card-header-mini">
            <span class="scenario-name">{valuation.scenarioName}</span>
            <button
              class="delete-btn"
              on:click|stopPropagation={() => onDelete(valuation.id)}
              title="Delete valuation"
            >
              ×
            </button>
          </div>
          <div class="card-value">
            {formatCurrency(valuation.intrinsicValuePerShare)}
          </div>
          <div class="card-date">{formatDate(valuation.createdAt)}</div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Main Content: Valuation Details -->
  <div class="main-content">
    {#if selectedValuation}
      <div class="valuation-details">
        <!-- Header -->
        <div class="details-header">
          <div>
            <h2>{selectedValuation.scenarioName}</h2>
            <p class="created-date">
              Created on {formatDate(selectedValuation.createdAt)}
            </p>
          </div>
          <button
            class="sensitivity-btn"
            on:click={loadSensitivityAnalysis}
            disabled={loadingSensitivity}
          >
            {loadingSensitivity ? "Loading..." : "📊 Sensitivity Analysis"}
          </button>
        </div>

        <!-- Key Result -->
        {#if currentPrice && selectedValuation.intrinsicValuePerShare}
          {@const intrinsicValue = parseFloat(
            selectedValuation.intrinsicValuePerShare,
          )}
          {@const marginOfSafety =
            ((intrinsicValue - currentPrice) / intrinsicValue) * 100}
          {@const upsideDownside =
            ((intrinsicValue - currentPrice) / currentPrice) * 100}
          {@const isUndervalued = intrinsicValue > currentPrice}

          <div
            class="comparison-card"
            class:undervalued={isUndervalued}
            class:overvalued={!isUndervalued}
          >
            <h3>💰 Valuation Comparison</h3>

            <div class="comparison-grid">
              <div class="price-box current">
                <div class="price-label">Current Market Price</div>
                <div class="price-value">${currentPrice.toFixed(2)}</div>
              </div>

              <div class="vs-divider">vs</div>

              <div class="price-box intrinsic">
                <div class="price-label">Intrinsic Value</div>
                <div class="price-value">${intrinsicValue.toFixed(2)}</div>
              </div>
            </div>

            <div class="metrics-grid">
              <div class="metric-box">
                <div class="metric-label">Margin of Safety</div>
                <div
                  class="metric-value"
                  class:positive={marginOfSafety > 0}
                  class:negative={marginOfSafety < 0}
                >
                  {marginOfSafety.toFixed(1)}%
                </div>
                <div class="metric-help">
                  {#if marginOfSafety > 30}
                    🟢 Strong margin of safety
                  {:else if marginOfSafety > 15}
                    🟡 Moderate margin of safety
                  {:else if marginOfSafety > 0}
                    🟠 Small margin of safety
                  {:else}
                    🔴 No margin of safety
                  {/if}
                </div>
              </div>

              <div class="metric-box">
                <div class="metric-label">Upside/Downside</div>
                <div
                  class="metric-value"
                  class:positive={upsideDownside > 0}
                  class:negative={upsideDownside < 0}
                >
                  {upsideDownside > 0 ? "+" : ""}{upsideDownside.toFixed(1)}%
                </div>
                <div class="metric-help">
                  {#if isUndervalued}
                    📈 Potential upside
                  {:else}
                    📉 Potential downside
                  {/if}
                </div>
              </div>

              <div class="metric-box verdict">
                <div class="metric-label">Verdict</div>
                <div
                  class="verdict-text"
                  class:undervalued={isUndervalued}
                  class:overvalued={!isUndervalued}
                >
                  {#if marginOfSafety > 30}
                    Strong Buy
                  {:else if marginOfSafety > 15}
                    Buy
                  {:else if marginOfSafety > 0}
                    Hold
                  {:else if marginOfSafety > -15}
                    Sell
                  {:else}
                    Strong Sell
                  {/if}
                </div>
                <div class="metric-help">Based on margin of safety</div>
              </div>
            </div>
          </div>
        {/if}

        <div class="result-card highlight">
          <div class="result-label">Intrinsic Value Per Share</div>
          <div class="result-value-large">
            {formatCurrency(selectedValuation.intrinsicValuePerShare)}
          </div>
        </div>

        <!-- Model Parameters -->
        <div class="section-card">
          <h3>Model Parameters</h3>
          <div class="params-grid">
            <div class="param-item">
              <span class="param-label">Discount Rate</span>
              <span class="param-value">{selectedValuation.discountRate}%</span>
            </div>
            <div class="param-item">
              <span class="param-label">Perpetual Growth Rate</span>
              <span class="param-value"
                >{selectedValuation.perpetualGrowthRate}%</span
              >
            </div>
            <div class="param-item">
              <span class="param-label">Shares Outstanding</span>
              <span class="param-value"
                >{selectedValuation.sharesOutstanding.toLocaleString()}</span
              >
            </div>
          </div>
        </div>

        <!-- DCF Calculation Breakdown -->
        <div class="section-card">
          <h3>Step 2: Discounted Cash Flows</h3>
          <div class="fcf-table">
            <table>
              <thead>
                <tr>
                  <th>Year</th>
                  <th>Projected FCF</th>
                  <th>Discount Factor</th>
                  <th>Discounted FCF</th>
                </tr>
              </thead>
              <tbody>
                {#each [selectedValuation.fcfYear1, selectedValuation.fcfYear2, selectedValuation.fcfYear3, selectedValuation.fcfYear4, selectedValuation.fcfYear5, selectedValuation.fcfYear6, selectedValuation.fcfYear7, selectedValuation.fcfYear8, selectedValuation.fcfYear9, selectedValuation.fcfYear10] as fcf, i}
                  {@const r = parseFloat(selectedValuation.discountRate) / 100}
                  {@const year = i + 1}
                  {@const discountFactor = Math.pow(1 + r, year)}
                  {@const discountedFcf = fcf ? fcf / discountFactor : 0}
                  <tr>
                    <td>{year}</td>
                    <td>{formatNumber(fcf)}</td>
                    <td>{discountFactor.toFixed(3)}</td>
                    <td class="highlight-cell">{formatNumber(discountedFcf)}</td
                    >
                  </tr>
                {/each}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3"><strong>Total Discounted FCF</strong></td>
                  <td class="highlight-cell"
                    ><strong
                      >{formatNumber(
                        selectedValuation.totalDiscountedFcf,
                      )}</strong
                    ></td
                  >
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        <!-- Step 3: Perpetuity Value -->
        <div class="section-card">
          <h3>Step 3: Perpetuity Value</h3>
          <div class="calculation-steps">
            <div class="step">
              <span class="formula"
                >Perpetuity Value = FCF₁₀ × (1 + g) ÷ (R - g)</span
              >
              <span class="result"
                >{formatNumber(selectedValuation.perpetuityValue)}</span
              >
            </div>
            <div class="step">
              <span class="formula"
                >Discounted Perpetuity Value = Perpetuity Value ÷ (1 + R)¹⁰</span
              >
              <span class="result"
                >{formatNumber(
                  selectedValuation.discountedPerpetuityValue,
                )}</span
              >
            </div>
          </div>
        </div>

        <!-- Step 4: Total Equity Value -->
        <div class="section-card">
          <h3>Step 4: Total Equity Value</h3>
          <div class="equity-breakdown">
            <div class="breakdown-item">
              <span>Sum of Discounted FCFs</span>
              <span>{formatNumber(selectedValuation.totalDiscountedFcf)}</span>
            </div>
            <div class="breakdown-item">
              <span>Discounted Perpetuity Value</span>
              <span
                >{formatNumber(
                  selectedValuation.discountedPerpetuityValue,
                )}</span
              >
            </div>
            <div class="breakdown-item total">
              <span><strong>Total Equity Value</strong></span>
              <span
                ><strong
                  >{formatNumber(selectedValuation.totalEquityValue)}</strong
                ></span
              >
            </div>
          </div>
        </div>

        <!-- Step 5: Per Share Value -->
        <div class="section-card">
          <h3>Step 5: Intrinsic Value Per Share</h3>
          <div class="final-calculation">
            <div class="calc-formula">
              <span>Total Equity Value ÷ Shares Outstanding</span>
              <span class="calc-details">
                {formatNumber(selectedValuation.totalEquityValue)} ÷ {selectedValuation.sharesOutstanding.toLocaleString()}
              </span>
            </div>
            <div class="calc-result">
              = {formatCurrency(selectedValuation.intrinsicValuePerShare)}
            </div>
          </div>
        </div>

        <!-- Notes -->
        {#if selectedValuation.notes}
          <div class="section-card">
            <h3>Notes</h3>
            <p class="notes-text">{selectedValuation.notes}</p>
          </div>
        {/if}

        <!-- Sensitivity Analysis Modal -->
        {#if showSensitivity && sensitivityData}
          <div
            class="modal-overlay"
            on:click={() => (showSensitivity = false)}
            on:keydown={(e) => e.key === "Escape" && (showSensitivity = false)}
            role="button"
            tabindex="0"
          >
            <div
              class="modal-content"
              on:click|stopPropagation
              on:keydown|stopPropagation
              role="dialog"
              aria-modal="true"
              tabindex="-1"
            >
              <div class="modal-header">
                <h3>Sensitivity Analysis</h3>
                <button
                  class="close-btn"
                  on:click={() => (showSensitivity = false)}>×</button
                >
              </div>

              <p class="modal-description">
                Intrinsic value per share at different discount and growth rates
              </p>

              <div class="sensitivity-table-wrapper">
                <table class="sensitivity-table">
                  <thead>
                    <tr>
                      <th>Discount Rate →<br />Growth Rate ↓</th>
                      {#each Object.keys(sensitivityData) as discountRate}
                        <th>{discountRate}</th>
                      {/each}
                    </tr>
                  </thead>
                  <tbody>
                    {#each Object.entries(Object.values(sensitivityData)[0] || {}) as [growthRate, _]}
                      <tr>
                        <td class="row-header">{growthRate}</td>
                        {#each Object.keys(sensitivityData) as discountRate}
                          {@const value =
                            sensitivityData[discountRate][growthRate]}
                          <td
                            class:base-case={discountRate ===
                              `${selectedValuation.discountRate}%` &&
                              growthRate ===
                                `${selectedValuation.perpetualGrowthRate}%`}
                          >
                            ${value.toFixed(2)}
                          </td>
                        {/each}
                      </tr>
                    {/each}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .valuation-container {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 2rem;
    align-items: start;
  }

  /* Sidebar */
  .sidebar {
    position: sticky;
    top: 2rem;
  }

  .sidebar h3 {
    font-size: 1.1rem;
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-weight: 600;
  }

  .valuation-cards {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .valuation-card {
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: 8px;
    padding: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    text-align: left;
    width: 100%;
  }

  .valuation-card:hover {
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .valuation-card.active {
    border-color: var(--accent-primary);
    background: linear-gradient(
      135deg,
      var(--card-bg) 0%,
      var(--bg-secondary) 100%
    );
    box-shadow: var(--shadow-md);
  }

  .card-header-mini {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .scenario-name {
    font-weight: 600;
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .delete-btn {
    background: none;
    border: none;
    color: var(--text-tertiary);
    font-size: 1.5rem;
    line-height: 1;
    cursor: pointer;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .delete-btn:hover {
    background: var(--accent-error);
    color: white;
  }

  .card-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--accent-success);
    margin-bottom: 0.25rem;
  }

  .card-date {
    font-size: 0.8rem;
    color: var(--text-tertiary);
  }

  /* Main Content */
  .main-content {
    min-height: 600px;
  }

  .valuation-details {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .details-header h2 {
    font-size: 1.75rem;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
  }

  .created-date {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .sensitivity-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 8px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .sensitivity-btn:hover:not(:disabled) {
    background: var(--accent-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .sensitivity-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .result-card {
    background: linear-gradient(
      135deg,
      var(--bg-secondary) 0%,
      var(--card-bg) 100%
    );
    border: 2px solid var(--card-border);
    border-radius: 12px;
    padding: 2rem;
    text-align: center;
    margin-bottom: 2rem;
  }

  .result-card.highlight {
    border-color: var(--accent-success);
    background: linear-gradient(
      135deg,
      rgba(88, 129, 87, 0.1) 0%,
      var(--card-bg) 100%
    );
  }

  .result-label {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .result-value-large {
    font-size: 3rem;
    font-weight: 700;
    color: var(--accent-success);
  }

  .section-card {
    background: var(--bg-secondary);
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
  }

  .section-card h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-bottom: 1.25rem;
  }

  .params-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .param-item {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .param-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .param-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .fcf-table {
    overflow-x: auto;
  }

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 0.75rem;
    text-align: right;
  }

  th {
    background: var(--card-bg);
    color: var(--text-primary);
    font-weight: 600;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  td {
    border-top: 1px solid var(--border-color);
    color: var(--text-secondary);
  }

  td:first-child,
  th:first-child {
    text-align: left;
  }

  .highlight-cell {
    color: var(--accent-success);
    font-weight: 600;
  }

  tfoot td {
    padding-top: 1rem;
    border-top: 2px solid var(--border-color);
  }

  .calculation-steps,
  .equity-breakdown {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .step,
  .breakdown-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
  }

  .formula {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .result,
  .breakdown-item span:last-child {
    font-weight: 700;
    color: var(--accent-success);
    font-size: 1.1rem;
  }

  .breakdown-item.total {
    background: linear-gradient(
      135deg,
      rgba(88, 129, 87, 0.1) 0%,
      var(--card-bg) 100%
    );
    border: 2px solid var(--accent-success);
    font-size: 1.1rem;
  }

  .final-calculation {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--card-bg);
    border-radius: 8px;
  }

  .calc-formula {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .calc-formula span:first-child {
    color: var(--text-primary);
    font-weight: 600;
  }

  .calc-details {
    color: var(--text-tertiary);
    font-size: 0.9rem;
  }

  .calc-result {
    font-size: 2rem;
    font-weight: 700;
    color: var(--accent-success);
    text-align: center;
    padding: 1rem;
    background: linear-gradient(
      135deg,
      rgba(88, 129, 87, 0.1) 0%,
      transparent 100%
    );
    border-radius: 8px;
  }

  .notes-text {
    color: var(--text-secondary);
    line-height: 1.6;
    white-space: pre-wrap;
  }

  /* Sensitivity Analysis Modal */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 2rem;
  }

  .modal-content {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 2rem;
    max-width: 800px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
  }

  .modal-header h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
  }

  .close-btn {
    background: none;
    border: none;
    font-size: 2rem;
    color: var(--text-tertiary);
    cursor: pointer;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 4px;
    transition: all 0.2s ease;
  }

  .close-btn:hover {
    background: var(--accent-error);
    color: white;
  }

  .modal-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .sensitivity-table-wrapper {
    overflow-x: auto;
  }

  .sensitivity-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
  }

  .sensitivity-table th,
  .sensitivity-table td {
    padding: 0.75rem;
    text-align: center;
    border: 1px solid var(--border-color);
  }

  .sensitivity-table th {
    background: var(--bg-secondary);
    font-weight: 600;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .sensitivity-table .row-header {
    background: var(--bg-secondary);
    font-weight: 600;
    position: sticky;
    left: 0;
    z-index: 5;
  }

  .sensitivity-table td.base-case {
    background: rgba(88, 129, 87, 0.2);
    font-weight: 700;
    color: var(--accent-success);
    border: 2px solid var(--accent-success);
  }

  @media (max-width: 1024px) {
    .valuation-container {
      grid-template-columns: 1fr;
    }

    .sidebar {
      position: static;
    }

    .valuation-cards {
      flex-direction: row;
      overflow-x: auto;
      padding-bottom: 0.5rem;
    }

    .valuation-card {
      min-width: 200px;
    }
  }

  @media (max-width: 768px) {
    .valuation-details {
      padding: 1.5rem;
    }

    .result-value-large {
      font-size: 2rem;
    }

    .details-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .sensitivity-btn {
      width: 100%;
    }

    .fcf-table {
      font-size: 0.85rem;
    }

    th,
    td {
      padding: 0.5rem 0.25rem;
    }
  }

  /* Comparison Card */
  .comparison-card {
    background: var(--card-bg);
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 2rem;
    border: 2px solid var(--card-border);
    box-shadow: var(--shadow-lg);
  }

  .comparison-card.undervalued {
    border-color: #22c55e;
    background: linear-gradient(
      135deg,
      rgba(34, 197, 94, 0.05) 0%,
      var(--card-bg) 100%
    );
  }

  .comparison-card.overvalued {
    border-color: #ef4444;
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, 0.05) 0%,
      var(--card-bg) 100%
    );
  }

  .comparison-card h3 {
    font-size: 1.5rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    text-align: center;
  }

  .comparison-grid {
    display: grid;
    grid-template-columns: 1fr auto 1fr;
    gap: 2rem;
    align-items: center;
    margin-bottom: 2rem;
  }

  .price-box {
    text-align: center;
    padding: 1.5rem;
    border-radius: 12px;
    border: 2px solid var(--card-border);
  }

  .price-box.current {
    background: var(--bg-secondary);
  }

  .price-box.intrinsic {
    background: linear-gradient(
      135deg,
      rgba(88, 129, 87, 0.1) 0%,
      var(--bg-secondary) 100%
    );
    border-color: var(--accent-primary);
  }

  .price-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .price-value {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .vs-divider {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text-tertiary);
    text-align: center;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  .metric-box {
    background: var(--bg-secondary);
    padding: 1.5rem;
    border-radius: 12px;
    text-align: center;
    border: 1px solid var(--card-border);
  }

  .metric-box.verdict {
    background: linear-gradient(
      135deg,
      rgba(88, 129, 87, 0.1) 0%,
      var(--bg-secondary) 100%
    );
  }

  .metric-label {
    font-size: 0.85rem;
    color: var(--text-secondary);
    margin-bottom: 0.5rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-value {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .metric-value.positive {
    color: #22c55e;
  }

  .metric-value.negative {
    color: #ef4444;
  }

  .metric-help {
    font-size: 0.85rem;
    color: var(--text-tertiary);
  }

  .verdict-text {
    font-size: 1.75rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
  }

  .verdict-text.undervalued {
    color: #22c55e;
  }

  .verdict-text.overvalued {
    color: #ef4444;
  }

  /* Mobile responsive updates */
  @media (max-width: 768px) {
    .comparison-grid {
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    .vs-divider {
      transform: rotate(90deg);
      margin: 0.5rem 0;
    }

    .metrics-grid {
      grid-template-columns: 1fr;
    }

    .price-value {
      font-size: 2rem;
    }

    .metric-value {
      font-size: 1.5rem;
    }

    .verdict-text {
      font-size: 1.5rem;
    }
  }
</style>
