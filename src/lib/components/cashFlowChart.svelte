<script lang="ts">
  export let cashFlows: number[];
  export let trend: "growing" | "stable" | "declining";

  const formatCurrency = (value: number): string => {
    const absValue = Math.abs(value);
    if (absValue >= 1e9) return `$${(value / 1e9).toFixed(1)}B`;
    if (absValue >= 1e6) return `$${(value / 1e6).toFixed(1)}M`;
    if (absValue >= 1e3) return `$${(value / 1e3).toFixed(1)}K`;
    return `$${value.toFixed(0)}`;
  };

  const getTrendInfo = (trend: string) => {
    const info = {
      growing: {
        icon: "📈",
        color: "#10b981",
        label: "Growing",
        bg: "#d1fae5",
      },
      stable: { icon: "➡️", color: "#6b7280", label: "Stable", bg: "#f3f4f6" },
      declining: {
        icon: "📉",
        color: "#ef4444",
        label: "Declining",
        bg: "#fee2e2",
      },
    };
    return info[trend as keyof typeof info];
  };

  const generateChartPoints = (values: number[]) => {
    if (values.length === 0) return "";

    const width = 300;
    const height = 150;
    const padding = 20;

    const max = Math.max(...values, 0);
    const min = Math.min(...values, 0);
    const range = max - min || 1;

    const points = values
      .map((value, index) => {
        const x =
          padding + (index / (values.length - 1)) * (width - 2 * padding);
        const y =
          height - padding - ((value - min) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");

    return points;
  };

  $: trendInfo = getTrendInfo(trend);
  $: chartPoints = generateChartPoints(cashFlows);
  $: latestCashFlow = cashFlows[cashFlows.length - 1] || 0;
  $: averageCashFlow =
    cashFlows.reduce((a, b) => a + b, 0) / (cashFlows.length || 1);
</script>

<div class="cash-flow-chart">
  <!-- Trend Badge -->
  <div
    class="trend-badge"
    style="background: {trendInfo.bg}; border-color: {trendInfo.color}"
  >
    <span class="trend-icon">{trendInfo.icon}</span>
    <strong style="color: {trendInfo.color}">{trendInfo.label}</strong>
  </div>

  <!-- Chart -->
  <div class="chart-container">
    <svg viewBox="0 0 300 150" class="chart-svg">
      <!-- Grid lines -->
      <line
        x1="20"
        y1="130"
        x2="280"
        y2="130"
        stroke="#e5e7eb"
        stroke-width="1"
      />
      <line
        x1="20"
        y1="75"
        x2="280"
        y2="75"
        stroke="#e5e7eb"
        stroke-width="1"
        stroke-dasharray="4"
      />
      <line
        x1="20"
        y1="20"
        x2="280"
        y2="20"
        stroke="#e5e7eb"
        stroke-width="1"
      />

      <!-- Data line -->
      {#if cashFlows.length > 0}
        <polyline
          points={chartPoints}
          fill="none"
          stroke={trendInfo.color}
          stroke-width="3"
          stroke-linecap="round"
          stroke-linejoin="round"
        />

        <!-- Data points -->
        {#each chartPoints.split(" ") as point}
          <circle
            cx={point.split(",")[0]}
            cy={point.split(",")[1]}
            r="4"
            fill={trendInfo.color}
          />
        {/each}
      {/if}
    </svg>

    <div class="chart-labels">
      {#each cashFlows as _, index}
        <span class="year-label">Y{index + 1}</span>
      {/each}
    </div>
  </div>

  <!-- Metrics -->
  <div class="metrics-row">
    <div class="metric-box">
      <span class="metric-label">Latest</span>
      <span class="metric-value" class:negative={latestCashFlow < 0}>
        {formatCurrency(latestCashFlow)}
      </span>
    </div>
    <div class="metric-box">
      <span class="metric-label">Average</span>
      <span class="metric-value" class:negative={averageCashFlow < 0}>
        {formatCurrency(averageCashFlow)}
      </span>
    </div>
  </div>

  <!-- Analysis -->
  <div class="analysis-note">
    {#if trend === "growing"}
      <p>
        ✅ <strong>Positive signal:</strong> Operating cash flows are consistently
        growing, indicating improving business operations.
      </p>
    {:else if trend === "stable"}
      <p>
        ➡️ <strong>Stable:</strong> Cash flows are relatively consistent, showing
        predictable operations.
      </p>
    {:else}
      <p>
        ⚠️ <strong>Concern:</strong> Declining cash flows may indicate operational
        challenges or increased working capital needs.
      </p>
    {/if}
  </div>
</div>

<style>
  .cash-flow-chart {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .trend-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 2px solid;
    width: fit-content;
  }

  .trend-icon {
    font-size: 1.25rem;
  }

  .trend-badge strong {
    font-size: 0.95rem;
    font-weight: 600;
  }

  .chart-container {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .chart-svg {
    width: 100%;
    height: auto;
  }

  .chart-labels {
    display: flex;
    justify-content: space-around;
    margin-top: 0.5rem;
  }

  .year-label {
    font-size: 0.75rem;
    color: var(--text-tertiary);
    font-weight: 600;
  }

  .metrics-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
  }

  .metric-box {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
    text-align: center;
  }

  .metric-label {
    font-size: 0.8rem;
    color: var(--text-tertiary);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-value {
    font-size: 1.3rem;
    font-weight: 700;
    color: var(--accent-success);
  }

  .metric-value.negative {
    color: var(--accent-error);
  }

  .analysis-note {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .analysis-note p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
  }

  .analysis-note strong {
    color: var(--text-primary);
  }
</style>
