<script lang="ts">
  export let roe: number;
  export let leverageRatio: number;
  export let debtToEquity: number;
  export let leverageLevel: "low" | "moderate" | "high" | "extreme";

  const getLeverageColor = (level: string) => {
    const colors = {
      low: "#10b981",
      moderate: "#f59e0b",
      high: "#f97316",
      extreme: "#ef4444",
    };
    return colors[level as keyof typeof colors];
  };

  const getLeverageAngle = (ratio: number) => {
    // Financial leverage ratio typically ranges from 1 to 10+
    // Map to gauge angle (-90 to 90 degrees)
    const normalized = Math.min(ratio / 10, 1); // Cap at 10
    return -90 + normalized * 180;
  };

  $: leverageAngle = getLeverageAngle(leverageRatio);
  $: leverageColor = getLeverageColor(leverageLevel);
  $: roePass = roe >= 10;
</script>

<div class="roe-gauge">
  <!-- ROE Status -->
  <div class="roe-status">
    <div class="status-badge {roePass ? 'pass' : 'fail'}">
      <span class="badge-icon">{roePass ? "✓" : "✗"}</span>
      <div class="badge-content">
        <strong>ROE: {roe.toFixed(1)}%</strong>
        <span>{roePass ? "Above 10% ✓" : "Below 10%"}</span>
      </div>
    </div>
  </div>

  <!-- Leverage Odometer -->
  <div class="leverage-section">
    <h4>Leverage to Achieve ROE</h4>

    <div class="odometer">
      <svg viewBox="0 0 200 120" class="gauge-svg">
        <!-- Background arc -->
        <path
          d="M 20 100 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#e5e7eb"
          stroke-width="20"
          stroke-linecap="round"
        />

        <!-- Colored sections -->
        <path
          d="M 20 100 A 80 80 0 0 1 70 35"
          fill="none"
          stroke="#10b981"
          stroke-width="20"
          stroke-linecap="round"
        />
        <path
          d="M 70 35 A 80 80 0 0 1 130 35"
          fill="none"
          stroke="#f59e0b"
          stroke-width="20"
          stroke-linecap="round"
        />
        <path
          d="M 130 35 A 80 80 0 0 1 180 100"
          fill="none"
          stroke="#ef4444"
          stroke-width="20"
          stroke-linecap="round"
        />

        <!-- Needle -->
        <g transform="translate(100, 100)">
          <line
            x1="0"
            y1="0"
            x2="0"
            y2="-70"
            stroke={leverageColor}
            stroke-width="3"
            stroke-linecap="round"
            transform="rotate({leverageAngle})"
          />
          <circle cx="0" cy="0" r="6" fill={leverageColor} />
        </g>
      </svg>

      <div class="gauge-labels">
        <span class="label-left">Low</span>
        <span class="label-center">Moderate</span>
        <span class="label-right">High</span>
      </div>
    </div>

    <!-- Metrics -->
    <div class="metrics-grid">
      <div class="metric-item">
        <span class="metric-label">Financial Leverage Ratio</span>
        <span class="metric-value" style="color: {leverageColor}">
          {leverageRatio.toFixed(2)}x
        </span>
      </div>
      <div class="metric-item">
        <span class="metric-label">Debt-to-Equity</span>
        <span class="metric-value" style="color: {leverageColor}">
          {debtToEquity.toFixed(2)}
        </span>
      </div>
    </div>

    <!-- Warning if high leverage -->
    {#if leverageLevel === "high" || leverageLevel === "extreme"}
      <div class="leverage-warning">
        <span class="warning-icon">⚠️</span>
        <div class="warning-content">
          <strong>High Leverage Detected</strong>
          <p>
            Company is using significant debt to achieve returns. Check if debt
            is manageable and business is stable.
          </p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .roe-gauge {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .roe-status {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.75rem;
    border-radius: 8px;
  }

  .status-badge.pass {
    background: #d1fae5;
    border: 2px solid #10b981;
  }

  .status-badge.fail {
    background: #fee2e2;
    border: 2px solid #ef4444;
  }

  .badge-icon {
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

  .status-badge.pass .badge-icon {
    background: #10b981;
    color: white;
  }

  .status-badge.fail .badge-icon {
    background: #ef4444;
    color: white;
  }

  .badge-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .badge-content strong {
    color: var(--text-primary);
    font-size: 1.1rem;
  }

  .badge-content span {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  .leverage-section h4 {
    color: var(--text-primary);
    font-size: 1rem;
    margin-bottom: 1rem;
  }

  .odometer {
    margin-bottom: 1rem;
  }

  .gauge-svg {
    width: 100%;
    height: auto;
    max-width: 300px;
    margin: 0 auto;
    display: block;
  }

  .gauge-labels {
    display: flex;
    justify-content: space-between;
    padding: 0 1rem;
    font-size: 0.75rem;
    color: var(--text-tertiary);
    font-weight: 600;
    margin-top: -0.5rem;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }

  .metric-item {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 0.75rem;
    background: var(--card-bg);
    border-radius: 8px;
    text-align: center;
  }

  .metric-label {
    font-size: 0.8rem;
    color: var(--text-tertiary);
    font-weight: 500;
  }

  .metric-value {
    font-size: 1.3rem;
    font-weight: 700;
  }

  .leverage-warning {
    display: flex;
    gap: 0.75rem;
    padding: 1rem;
    background: #fef3c7;
    border: 1px solid #fbbf24;
    border-radius: 8px;
    margin-top: 1rem;
  }

  .warning-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .warning-content strong {
    display: block;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    font-size: 0.95rem;
  }

  .warning-content p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.4;
  }
</style>
