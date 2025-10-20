<script lang="ts">
  import type { CreateValuationPayload } from "$lib/types/valuation.type";

  export let ticker: string;
  export let sharesOutstanding: number;
  export let currentFCF: number | null;
  export let onSubmit: (payload: CreateValuationPayload) => Promise<void>;
  export let onCancel: () => void;

  let scenarioName = "Base Case";
  let discountRate = 10.0;
  let perpetualGrowthRate = 3.0;

  // Year 0 (current FCF)
  let fcfYear0 = currentFCF || 0;

  let fcf: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  let notes = "";

  let isSaving = false;
  let projectionGrowthRate = 5.0;

  // Auto-fill FCF when Year 0 or growth rate changes
  // Use $: to make it reactive but only trigger when values actually change
  let lastFcfYear0 = 0;
  let lastGrowthRate = 0;

  $: {
    if (
      fcfYear0 > 0 &&
      projectionGrowthRate &&
      (fcfYear0 !== lastFcfYear0 || projectionGrowthRate !== lastGrowthRate)
    ) {
      lastFcfYear0 = fcfYear0;
      lastGrowthRate = projectionGrowthRate;
      autoFillFCF();
    }
  }

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) {
      return `${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(2)}K`;
    }
    return `${num.toFixed(2)}`;
  };

  const autoFillFCF = () => {
    if (fcfYear0 === 0 || projectionGrowthRate === 0) {
      return;
    }

    console.log(
      "Auto-filling with FCF Year 0:",
      fcfYear0,
      "Growth:",
      projectionGrowthRate,
    );

    const growthMultiplier = 1 + projectionGrowthRate / 100;
    let currentValue = fcfYear0;

    for (let i = 0; i < 10; i++) {
      currentValue = currentValue * growthMultiplier;
      fcf[i] = Math.round(currentValue);
    }

    console.log("Year 1 FCF:", fcf[0], "Year 10 FCF:", fcf[9]);
    fcf = [...fcf]; // Trigger reactivity
  };

  const handleSubmit = async () => {
    // Validation
    if (!sharesOutstanding || sharesOutstanding <= 0) {
      alert("Please enter shares outstanding");
      return;
    }

    if (discountRate <= perpetualGrowthRate) {
      alert("Discount rate must be greater than perpetual growth rate");
      return;
    }

    if (fcfYear0 <= 0) {
      alert("Please enter a current FCF value (Year 0)");
      return;
    }

    if (fcf.some((v) => v === null || v === undefined || v === 0)) {
      alert("Please ensure all 10 years of FCF projections are filled");
      return;
    }

    isSaving = true;

    try {
      const payload: CreateValuationPayload = {
        scenarioName,
        discountRate,
        perpetualGrowthRate,
        sharesOutstanding,
        fcfYear1: fcf[0],
        fcfYear2: fcf[1],
        fcfYear3: fcf[2],
        fcfYear4: fcf[3],
        fcfYear5: fcf[4],
        fcfYear6: fcf[5],
        fcfYear7: fcf[6],
        fcfYear8: fcf[7],
        fcfYear9: fcf[8],
        fcfYear10: fcf[9],
        notes: notes.trim() || undefined,
      };

      await onSubmit(payload);
    } catch (error) {
      console.error("Error submitting valuation:", error);
    } finally {
      isSaving = false;
    }
  };
</script>

<div class="calculator-card">
  <div class="card-header">
    <h2>🧮 Create DCF Valuation Model</h2>
    <p>Following Pat Dorsey's 10-Year Valuation Model</p>
  </div>

  <form on:submit|preventDefault={handleSubmit}>
    <!-- Scenario Name -->
    <div class="form-section">
      <h3>Scenario Details</h3>
      <div class="form-group">
        <label for="scenario">Scenario Name</label>
        <input
          id="scenario"
          type="text"
          bind:value={scenarioName}
          placeholder="e.g., Base Case, Bull Case, Bear Case"
        />
      </div>
    </div>

    <!-- Model Parameters -->
    <div class="form-section">
      <h3>Model Parameters</h3>

      <div class="form-grid">
        <div class="form-group">
          <label for="discount">Discount Rate (%)</label>
          <input
            id="discount"
            type="number"
            step="0.1"
            bind:value={discountRate}
            min="0"
            max="50"
            required
          />
          <span class="help-text">Required rate of return (R)</span>
        </div>

        <div class="form-group">
          <label for="growth">Perpetual Growth Rate (%)</label>
          <input
            id="growth"
            type="number"
            step="0.1"
            bind:value={perpetualGrowthRate}
            min="-5"
            max="10"
            required
          />
          <span class="help-text">Long-term growth rate (g)</span>
        </div>

        <div class="form-group">
          <label for="shares">Shares Outstanding</label>
          <input
            id="shares"
            type="number"
            bind:value={sharesOutstanding}
            min="1"
            required
            readonly
            class="readonly-input"
          />
          <span class="help-text">Auto-filled from company data</span>
        </div>
      </div>
    </div>

    <!-- Current FCF (Year 0) -->
    <div class="form-section">
      <h3>Current Free Cash Flow (Year 0)</h3>

      <div class="units-info">
        <strong>⚠️ Important: Verify This Number!</strong>
        <p>
          The FCF below is auto-calculated from the database, but may be
          outdated or incorrect.
        </p>
        <p>
          <strong>You can edit it manually</strong> if you have more recent data.
        </p>
        <p>FCF = Operating Cash Flow - Capital Expenditures</p>
      </div>

      <div class="form-group">
        <label for="fcf-year-0">Current FCF (Base Year) - Editable</label>
        <input
          id="fcf-year-0"
          type="number"
          bind:value={fcfYear0}
          placeholder="Enter or adjust current/latest FCF"
          required
          class="editable-highlight"
        />
        {#if fcfYear0 > 0}
          <span class="fcf-formatted-inline">{formatNumber(fcfYear0)}</span>
        {/if}
        <span class="help-text">
          💡 Auto-filled from database, but you can change it. Enter the most
          recent full-year FCF.
        </span>
      </div>

      {#if fcfYear0 > 0 && sharesOutstanding > 0}
        <div class="sanity-check">
          <strong>Quick Sanity Check:</strong>
          <p>
            Current FCF per share: <strong
              >${(fcfYear0 / sharesOutstanding).toFixed(2)}</strong
            >
          </p>
          <p class="help-text">
            For AMD, this should be around <strong>$2.00 - $3.00</strong> per share.
            If your number is significantly different, verify your FCF value!
          </p>
        </div>
      {/if}
    </div>

    <!-- FCF Projections -->
    <div class="form-section">
      <div class="section-header">
        <h3>Free Cash Flow Projections (10 Years)</h3>
        <div class="auto-fill">
          <input
            type="number"
            step="0.1"
            bind:value={projectionGrowthRate}
            min="-50"
            max="50"
            placeholder="5.0"
            class="growth-input"
          />
          <span>% annual growth</span>
          <button type="button" class="recalc-btn" on:click={autoFillFCF}>
            🔄 Recalculate
          </button>
        </div>
      </div>

      <p class="info-text">
        💡 Adjust the growth rate above and click Recalculate, or change Year 0
        to update projections
      </p>

      <div class="debug-info">
        <strong>Debug Info:</strong> Year 1 should be ${formatNumber(
          fcfYear0 * (1 + projectionGrowthRate / 100),
        )}
        with {projectionGrowthRate}% growth on Year 0 of ${formatNumber(
          fcfYear0,
        )}
      </div>

      <div class="fcf-grid">
        {#each fcf as value, i}
          <div class="fcf-input-group">
            <label for="fcf-{i}">Year {i + 1}</label>
            <input
              id="fcf-{i}"
              type="number"
              bind:value={fcf[i]}
              placeholder="0"
              required
            />
            {#if value > 0}
              <span class="fcf-formatted">{formatNumber(value)}</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Notes -->
    <div class="form-section">
      <h3>Notes (Optional)</h3>
      <textarea
        bind:value={notes}
        placeholder="Add any assumptions or notes about this valuation model..."
        rows="4"
      ></textarea>
    </div>

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="secondary-btn" on:click={onCancel}>
        Cancel
      </button>
      <button type="submit" class="primary-btn" disabled={isSaving}>
        {isSaving ? "Calculating..." : "Calculate Valuation"}
      </button>
    </div>
  </form>
</div>

<style>
  .calculator-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
  }

  .card-header {
    margin-bottom: 2rem;
  }

  .card-header h2 {
    font-size: 1.75rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .card-header p {
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .form-section {
    margin-bottom: 2.5rem;
    padding-bottom: 2rem;
    border-bottom: 1px solid var(--border-color);
  }

  .form-section:last-of-type {
    border-bottom: none;
  }

  .form-section h3 {
    font-size: 1.25rem;
    color: var(--text-primary);
    margin-bottom: 1.5rem;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .auto-fill {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .growth-input {
    width: 80px;
    padding: 0.5rem;
    border: 1px solid var(--input-border);
    border-radius: 6px;
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 0.9rem;
  }

  .auto-fill span {
    color: var(--text-secondary);
    font-size: 0.9rem;
  }

  .recalc-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 600;
  }

  .recalc-btn:hover {
    background: var(--accent-primary-hover);
    transform: translateY(-1px);
  }

  .debug-info {
    background: rgba(255, 193, 7, 0.1);
    border: 1px solid rgba(255, 193, 7, 0.3);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
  }

  .debug-info strong {
    color: var(--text-primary);
    display: block;
    margin-bottom: 0.25rem;
  }

  .info-text {
    background: var(--bg-secondary);
    padding: 0.75rem 1rem;
    border-radius: 8px;
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin-bottom: 1.5rem;
    border-left: 3px solid var(--accent-primary);
  }

  .readonly-input {
    background: var(--bg-secondary);
    cursor: not-allowed;
    opacity: 0.8;
  }

  .fcf-formatted-inline {
    display: inline-block;
    margin-left: 0.5rem;
    font-size: 0.9rem;
    color: var(--accent-success);
    font-weight: 600;
  }

  .units-info {
    background: #fff3cd;
    border: 2px solid #ffc107;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1.5rem;
  }

  :root[data-theme="dark"] .units-info {
    background: rgba(255, 193, 7, 0.1);
    border-color: rgba(255, 193, 7, 0.5);
  }

  .units-info strong {
    display: block;
    color: #856404;
    margin-bottom: 0.5rem;
    font-size: 1rem;
  }

  :root[data-theme="dark"] .units-info strong {
    color: #ffc107;
  }

  .units-info p {
    color: #856404;
    margin: 0.25rem 0;
    font-size: 0.9rem;
  }

  :root[data-theme="dark"] .units-info p {
    color: rgba(255, 193, 7, 0.9);
  }

  .units-info ul {
    margin: 0.5rem 0 0.5rem 1.5rem;
    color: #856404;
  }

  :root[data-theme="dark"] .units-info ul {
    color: rgba(255, 193, 7, 0.9);
  }

  .units-info li {
    font-size: 0.85rem;
    margin: 0.25rem 0;
  }

  .sanity-check {
    background: var(--bg-secondary);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 1rem;
    margin-top: 1rem;
  }

  .sanity-check strong {
    color: var(--text-primary);
    display: block;
    margin-bottom: 0.5rem;
  }

  .sanity-check p {
    margin: 0.25rem 0;
    color: var(--text-secondary);
  }

  .sanity-check p strong {
    color: var(--accent-success);
    font-size: 1.1rem;
    display: inline;
  }

  .editable-highlight {
    border: 2px solid var(--accent-primary) !important;
    background: linear-gradient(
      to right,
      var(--input-bg),
      rgba(88, 129, 87, 0.05)
    );
  }

  .editable-highlight:focus {
    border-color: var(--accent-primary) !important;
    box-shadow: 0 0 0 3px rgba(88, 129, 87, 0.2) !important;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1.5rem;
  }

  label {
    display: block;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 0.95rem;
  }

  input[type="text"],
  input[type="number"] {
    width: 100%;
    padding: 0.875rem;
    border: 1px solid var(--input-border);
    border-radius: 8px;
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  input:focus {
    outline: none;
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 3px rgba(88, 129, 87, 0.1);
  }

  .help-text {
    display: block;
    font-size: 0.85rem;
    color: var(--text-tertiary);
    margin-top: 0.25rem;
  }

  textarea {
    width: 100%;
    padding: 0.875rem;
    border: 1px solid var(--input-border);
    border-radius: 8px;
    background: var(--input-bg);
    color: var(--text-primary);
    font-size: 1rem;
    font-family: inherit;
    resize: vertical;
    transition: all 0.2s ease;
  }

  textarea:focus {
    outline: none;
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 3px rgba(88, 129, 87, 0.1);
  }

  .fcf-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.25rem;
  }

  .fcf-input-group {
    position: relative;
  }

  .fcf-input-group label {
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .fcf-formatted {
    position: absolute;
    right: 12px;
    top: 38px;
    font-size: 0.75rem;
    color: var(--accent-success);
    font-weight: 600;
    pointer-events: none;
  }

  .form-actions {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    margin-top: 2rem;
  }

  .primary-btn,
  .secondary-btn {
    padding: 0.875rem 1.75rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
  }

  .primary-btn {
    background: var(--accent-primary);
    color: white;
    box-shadow: var(--shadow-sm);
  }

  .primary-btn:hover:not(:disabled) {
    background: var(--accent-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .primary-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .secondary-btn {
    background: var(--bg-secondary);
    color: var(--text-primary);
    border: 1px solid var(--border-color);
  }

  .secondary-btn:hover {
    background: var(--card-border);
  }

  @media (max-width: 768px) {
    .calculator-card {
      padding: 1.5rem;
    }

    .fcf-grid {
      grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
      gap: 1rem;
    }

    .form-actions {
      flex-direction: column-reverse;
    }

    .primary-btn,
    .secondary-btn {
      width: 100%;
    }

    .section-header {
      flex-direction: column;
      align-items: flex-start;
    }
  }
</style>
