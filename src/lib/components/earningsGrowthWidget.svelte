<script lang="ts">
  import type { EarningsData } from "$lib/types/analysis.type";

  export let consistency: "consistent" | "erratic" | "declining";
  export let earningsData: EarningsData | undefined;

  const formatEPS = (value: number): string => {
    return `$${value.toFixed(2)}`;
  };

  const getConsistencyInfo = (consistency: string) => {
    const info = {
      consistent: {
        icon: "🎯",
        color: "#10b981",
        label: "Consistent",
        bg: "#d1fae5",
        description: "Earnings show steady growth pattern",
      },
      erratic: {
        icon: "⚠️",
        color: "#f59e0b",
        label: "Erratic",
        bg: "#fef3c7",
        description: "Earnings growth is unpredictable",
      },
      declining: {
        icon: "📉",
        color: "#ef4444",
        label: "Declining",
        bg: "#fee2e2",
        description: "Earnings are decreasing over time",
      },
    };
    return info[consistency as keyof typeof info] || info.erratic;
  };

  const generateChartPoints = (
    epsHistory: Array<{ year: number; eps: number }>,
  ) => {
    if (epsHistory.length === 0) return "";

    const width = 400;
    const height = 180;
    const padding = 30;

    const epsValues = epsHistory.map((h) => h.eps);
    const max = Math.max(...epsValues, 0);
    const min = Math.min(...epsValues, 0);
    const range = max - min || 1;

    const points = epsValues
      .map((eps, index) => {
        const x =
          padding + (index / (epsValues.length - 1)) * (width - 2 * padding);
        const y =
          height - padding - ((eps - min) / range) * (height - 2 * padding);
        return `${x},${y}`;
      })
      .join(" ");

    return points;
  };

  const countPositiveGrowthYears = (
    epsHistory: Array<{ year: number; eps: number }>,
  ) => {
    let positiveYears = 0;
    for (let i = 1; i < epsHistory.length; i++) {
      if (epsHistory[i].eps > epsHistory[i - 1].eps) {
        positiveYears++;
      }
    }
    return positiveYears;
  };

  $: consistencyInfo = getConsistencyInfo(consistency);
  $: chartPoints = earningsData?.epsHistory
    ? generateChartPoints(earningsData.epsHistory)
    : "";
  $: latestEPS =
    earningsData?.epsHistory?.[earningsData.epsHistory.length - 1]?.eps || 0;
  $: oldestEPS = earningsData?.epsHistory?.[0]?.eps || 0;
  $: totalYears = earningsData?.epsHistory?.length || 0;
  $: positiveGrowthYears = earningsData?.epsHistory
    ? countPositiveGrowthYears(earningsData.epsHistory)
    : 0;
  $: growthRate = earningsData?.growthRate;
</script>

<div class="earnings-growth-widget-horizontal">
  {#if earningsData && earningsData.epsHistory.length > 0}
    <!-- Main Layout: Chart on Left, Info on Right -->
    <div class="horizontal-layout">
      <!-- Left Side: Chart Section -->
      <div class="chart-section">
        <!-- Chart -->
        <div class="chart-container">
          <svg viewBox="0 0 400 180" class="chart-svg">
            <!-- Grid lines -->
            <line
              x1="30"
              y1="150"
              x2="370"
              y2="150"
              stroke="#e5e7eb"
              stroke-width="1"
            />
            <line
              x1="30"
              y1="90"
              x2="370"
              y2="90"
              stroke="#e5e7eb"
              stroke-width="1"
              stroke-dasharray="4"
            />
            <line
              x1="30"
              y1="30"
              x2="370"
              y2="30"
              stroke="#e5e7eb"
              stroke-width="1"
            />

            <!-- EPS Line -->
            {#if chartPoints}
              <polyline
                points={chartPoints}
                fill="none"
                stroke={consistencyInfo.color}
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
                  fill={consistencyInfo.color}
                />
              {/each}
            {/if}
          </svg>

          <!-- Year labels -->
          <div class="chart-labels">
            {#each earningsData.epsHistory as item}
              <span class="year-label">{item.year}</span>
            {/each}
          </div>
        </div>
      </div>

      <!-- Right Side: Metrics & Analysis -->
      <div class="info-section">
        <!-- Consistency Badge -->
        <div
          class="consistency-badge"
          style="background: {consistencyInfo.bg}; border-color: {consistencyInfo.color}"
        >
          <span class="badge-icon">{consistencyInfo.icon}</span>
          <strong style="color: {consistencyInfo.color}"
            >{consistencyInfo.label}</strong
          >
        </div>
        <!-- Metrics Grid -->
        <div class="metrics-grid">
          <div class="metric-box highlight">
            <span class="metric-label">Latest EPS</span>
            <span class="metric-value large" class:negative={latestEPS < 0}>
              {formatEPS(latestEPS)}
            </span>
          </div>

          {#if growthRate !== null}
            <div class="metric-box highlight">
              <span class="metric-label">Growth (CAGR)</span>
              <span class="metric-value large" class:negative={growthRate < 0}>
                {growthRate.toFixed(1)}%
              </span>
            </div>
          {/if}

          <div class="metric-box">
            <span class="metric-label">Positive Years</span>
            <span class="metric-value">
              {positiveGrowthYears} / {totalYears - 1}
            </span>
            <div class="progress-bar">
              <div
                class="progress-fill"
                style="width: {(positiveGrowthYears /
                  Math.max(totalYears - 1, 1)) *
                  100}%; background: {consistencyInfo.color}"
              ></div>
            </div>
          </div>

          {#if earningsData.volatilityScore !== null}
            <div class="metric-box">
              <span class="metric-label">Volatility</span>
              <span
                class="metric-value"
                class:high-volatility={earningsData.volatilityScore > 30}
              >
                {earningsData.volatilityScore.toFixed(1)}%
              </span>
            </div>
          {/if}
        </div>

        <!-- Analysis Note -->
        <div class="analysis-note">
          {#if consistency === "consistent"}
            <p>
              ✅ <strong>Positive signal:</strong> Earnings grew in {positiveGrowthYears}
              of {totalYears - 1} years, from {formatEPS(oldestEPS)} to {formatEPS(
                latestEPS,
              )}.
            </p>
          {:else if consistency === "erratic"}
            <p>
              ⚠️ <strong>Variable pattern:</strong>
              {positiveGrowthYears} positive years out of {totalYears - 1}.
              Review context for large swings.
            </p>
          {:else}
            <p>
              📉 <strong>Concern:</strong> Declining trend from {formatEPS(
                oldestEPS,
              )} to {formatEPS(latestEPS)}.
            </p>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <!-- Fallback when no detailed data available -->
    <div class="no-data">
      <div
        class="consistency-badge"
        style="background: {consistencyInfo.bg}; border-color: {consistencyInfo.color}"
      >
        <span class="badge-icon">{consistencyInfo.icon}</span>
        <strong style="color: {consistencyInfo.color}"
          >{consistencyInfo.label}</strong
        >
      </div>
      <p class="description">{consistencyInfo.description}</p>
      <p class="hint">Detailed earnings history not available</p>
    </div>
  {/if}
</div>

<style>
  .earnings-growth-widget-horizontal {
    width: 100%;
  }

  .horizontal-layout {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    align-items: start;
  }

  /* Left Side - Chart Section */
  .chart-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .consistency-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    border: 2px solid;
    width: fit-content;
  }

  .badge-icon {
    font-size: 1.25rem;
  }

  .consistency-badge strong {
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
    justify-content: space-between;
    margin-top: 0.5rem;
    padding: 0 0.5rem;
  }

  .year-label {
    font-size: 0.7rem;
    color: var(--text-tertiary);
    font-weight: 600;
  }

  /* Right Side - Info Section */
  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .metrics-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }

  .metric-box {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .metric-box.highlight {
    background: var(--bg-secondary);
    border-width: 2px;
    border-color: var(--accent-primary);
  }

  .metric-label {
    font-size: 0.7rem;
    color: var(--text-tertiary);
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .metric-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--accent-success);
  }

  .metric-value.large {
    font-size: 1.4rem;
  }

  .metric-value.negative {
    color: var(--accent-error);
  }

  .metric-value.high-volatility {
    color: var(--accent-warning);
  }

  .progress-bar {
    width: 100%;
    height: 6px;
    background: var(--border-color);
    border-radius: 3px;
    margin-top: 0.5rem;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 3px;
    transition: width 0.3s ease;
  }

  .analysis-note {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .analysis-note p {
    color: var(--text-secondary);
    font-size: 0.85rem;
    margin: 0;
    line-height: 1.6;
  }

  .analysis-note strong {
    color: var(--text-primary);
  }

  /* Fallback */
  .no-data {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 2rem;
    text-align: center;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .no-data .description {
    margin: 0;
    color: var(--text-secondary);
    font-size: 0.95rem;
  }

  .no-data .hint {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-tertiary);
    font-style: italic;
  }

  /* Responsive */
  @media (max-width: 1024px) {
    .horizontal-layout {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }

    .metrics-grid {
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    }
  }

  @media (max-width: 768px) {
    .metrics-grid {
      grid-template-columns: 1fr 1fr;
    }

    .metric-value.large {
      font-size: 1.2rem;
    }
  }
</style>
