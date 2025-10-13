<script lang="ts">
  export let sharesHistory: number[];
  export let dilutionType: "significant-increase" | "stable" | "buyback";
  export let dilutionPercentage: number;

  const formatShares = (value: number): string => {
    if (value >= 1e9) return `${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `${(value / 1e3).toFixed(2)}K`;
    return `${value.toFixed(0)}`;
  };

  const getDilutionInfo = (type: string) => {
    const info = {
      "significant-increase": {
        icon: "⚠️",
        color: "#ef4444",
        label: "Significant Dilution",
        bg: "#fee2e2",
        description:
          "Share count has increased significantly, diluting existing shareholders",
      },
      stable: {
        icon: "✅",
        color: "#6b7280",
        label: "Stable",
        bg: "#f3f4f6",
        description: "Share count is relatively stable over time",
      },
      buyback: {
        icon: "🎯",
        color: "#10b981",
        label: "Share Buybacks",
        bg: "#d1fae5",
        description:
          "Company is reducing shares outstanding, benefiting shareholders",
      },
    };
    return info[type as keyof typeof info];
  };

  const generateBarChart = (shares: number[]) => {
    if (shares.length === 0) return [];

    const max = Math.max(...shares);
    return shares.map((value, index) => ({
      value,
      percentage: (value / max) * 100,
      year: `Y${index + 1}`,
      formatted: formatShares(value),
    }));
  };

  $: dilutionInfo = getDilutionInfo(dilutionType);
  $: chartData = generateBarChart(sharesHistory);
  $: latestShares = sharesHistory[sharesHistory.length - 1] || 0;
  $: firstShares = sharesHistory[0] || 1;
  $: changePercent = ((latestShares - firstShares) / firstShares) * 100;
</script>

<div class="dilution-indicator">
  <!-- Status Badge -->
  <div
    class="status-badge"
    style="background: {dilutionInfo.bg}; border-color: {dilutionInfo.color}"
  >
    <span class="badge-icon">{dilutionInfo.icon}</span>
    <div class="badge-content">
      <strong style="color: {dilutionInfo.color}">{dilutionInfo.label}</strong>
      <span>{dilutionInfo.description}</span>
    </div>
  </div>

  <!-- Bar Chart -->
  <div class="chart-section">
    <div class="bars-container">
      {#each chartData as bar}
        <div class="bar-wrapper">
          <div class="bar-value">{bar.formatted}</div>
          <div
            class="bar"
            style="height: {bar.percentage}%; background-color: {dilutionInfo.color}40; border-color: {dilutionInfo.color}"
          >
            <div
              class="bar-fill"
              style="background-color: {dilutionInfo.color}"
            ></div>
          </div>
          <div class="bar-label">{bar.year}</div>
        </div>
      {/each}
    </div>
  </div>

  <!-- Change Summary -->
  <div class="change-summary">
    <div class="summary-row">
      <span class="summary-label">Period Change:</span>
      <span
        class="summary-value"
        class:positive={changePercent < 0}
        class:negative={changePercent > 5}
      >
        {changePercent > 0 ? "+" : ""}{changePercent.toFixed(1)}%
      </span>
    </div>
    <div class="summary-row">
      <span class="summary-label">Latest Count:</span>
      <span class="summary-value">{formatShares(latestShares)}</span>
    </div>
  </div>

  <!-- Interpretation -->
  <div class="interpretation">
    {#if dilutionType === "significant-increase"}
      <p>
        ⚠️ <strong>Red flag:</strong> Significant increase in shares outstanding
        ({Math.abs(changePercent).toFixed(1)}%). This dilutes existing
        shareholders' ownership. Investigate if dilution funded growth or was
        used to compensate executives.
      </p>
    {:else if dilutionType === "buyback"}
      <p>
        ✅ <strong>Positive:</strong> Company is buying back shares ({Math.abs(
          changePercent,
        ).toFixed(1)}% reduction). This increases earnings per share and shows
        management confidence in the business.
      </p>
    {:else}
      <p>
        ➡️ <strong>Neutral:</strong> Share count has remained relatively stable.
        No significant dilution or buyback activity.
      </p>
    {/if}
  </div>
</div>

<style>
  .dilution-indicator {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .status-badge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 8px;
    border: 2px solid;
  }

  .badge-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .badge-content {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .badge-content strong {
    font-size: 1rem;
    font-weight: 600;
  }

  .badge-content span {
    font-size: 0.85rem;
    color: var(--text-secondary);
  }

  .chart-section {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .bars-container {
    display: flex;
    align-items: flex-end;
    justify-content: space-around;
    height: 180px;
    gap: 0.5rem;
  }

  .bar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    max-width: 60px;
  }

  .bar-value {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    height: 20px;
  }

  .bar {
    width: 100%;
    min-height: 20px;
    border-radius: 4px 4px 0 0;
    border: 2px solid;
    border-bottom: none;
    position: relative;
    transition: height 0.3s ease;
  }

  .bar-fill {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 30%;
    border-radius: 4px 4px 0 0;
  }

  .bar-label {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--text-tertiary);
    margin-top: 0.25rem;
  }

  .change-summary {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .summary-label {
    font-size: 0.9rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .summary-value {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text-primary);
  }

  .summary-value.positive {
    color: var(--accent-success);
  }

  .summary-value.negative {
    color: var(--accent-error);
  }

  .interpretation {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .interpretation p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.5;
  }

  .interpretation strong {
    color: var(--text-primary);
  }

  @media (max-width: 768px) {
    .bars-container {
      height: 150px;
    }

    .bar-wrapper {
      max-width: 50px;
    }

    .bar-value {
      font-size: 0.65rem;
    }
  }
</style>
