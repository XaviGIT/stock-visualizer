<script lang="ts">
  import type { CapitalizationSize } from "$lib/types/analysis.type";

  export let size: CapitalizationSize;
  export let marketCap: number;
  export let isRecentIPO: boolean;
  export let isSpinoff: boolean;
  export let ipoDate: string | null;

  const formatMarketCap = (value: number): string => {
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  };

  const getSizeInfo = (size: CapitalizationSize) => {
    const info = {
      micro: { label: "Micro Cap", color: "#8b5cf6", range: "< $300M" },
      small: { label: "Small Cap", color: "#3b82f6", range: "$300M - $2B" },
      mid: { label: "Mid Cap", color: "#10b981", range: "$2B - $10B" },
      large: { label: "Large Cap", color: "#f59e0b", range: "$10B - $200B" },
      mega: { label: "Mega Cap", color: "#ef4444", range: "> $200B" },
    };
    return info[size];
  };

  const formatIPODate = (date: string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  $: sizeInfo = getSizeInfo(size);
</script>

<div class="cap-indicator">
  <!-- Market Cap Badge -->
  <div
    class="cap-badge"
    style="background-color: {sizeInfo.color}20; border-color: {sizeInfo.color}"
  >
    <div class="cap-icon" style="background-color: {sizeInfo.color}">
      {#if size === "micro"}🔬
      {:else if size === "small"}📊
      {:else if size === "mid"}📈
      {:else if size === "large"}🏢
      {:else}🏛️
      {/if}
    </div>
    <div class="cap-info">
      <strong>{sizeInfo.label}</strong>
      <span class="cap-value">{formatMarketCap(marketCap)}</span>
      <span class="cap-range">{sizeInfo.range}</span>
    </div>
  </div>

  <!-- Special Flags -->
  {#if isRecentIPO || isSpinoff}
    <div class="flags-section">
      <strong class="flags-title">⚠️ Special Flags</strong>
      <div class="flags-list">
        {#if isRecentIPO}
          <div class="flag-item ipo">
            <span class="flag-icon">🆕</span>
            <div class="flag-content">
              <strong>Recent IPO</strong>
              {#if ipoDate}
                <span>{formatIPODate(ipoDate)}</span>
              {/if}
              <p class="flag-warning">
                Caution: Limited historical data, potential volatility
              </p>
            </div>
          </div>
        {/if}

        {#if isSpinoff}
          <div class="flag-item spinoff">
            <span class="flag-icon">🔀</span>
            <div class="flag-content">
              <strong>Spinoff</strong>
              <p class="flag-note">
                Often undervalued opportunities - investigate parent company
              </p>
            </div>
          </div>
        {/if}
      </div>
    </div>
  {/if}
</div>

<style>
  .cap-indicator {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .cap-badge {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    border-radius: 12px;
    border: 2px solid;
    transition: all 0.2s ease;
  }

  .cap-badge:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  .cap-icon {
    width: 50px;
    height: 50px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .cap-info {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    flex: 1;
  }

  .cap-info strong {
    color: var(--text-primary);
    font-size: 1.1rem;
  }

  .cap-value {
    color: var(--text-primary);
    font-size: 1.3rem;
    font-weight: 700;
  }

  .cap-range {
    color: var(--text-tertiary);
    font-size: 0.85rem;
  }

  .flags-section {
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .flags-title {
    display: block;
    color: var(--text-primary);
    margin-bottom: 0.75rem;
    font-size: 0.95rem;
  }

  .flags-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .flag-item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 0.875rem;
    border-radius: 8px;
  }

  .flag-item.ipo {
    background: #fef3c7;
    border: 1px solid #fbbf24;
  }

  .flag-item.spinoff {
    background: #dbeafe;
    border: 1px solid #3b82f6;
  }

  .flag-icon {
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  .flag-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
  }

  .flag-content strong {
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .flag-content span {
    color: var(--text-secondary);
    font-size: 0.85rem;
  }

  .flag-warning,
  .flag-note {
    color: var(--text-secondary);
    font-size: 0.8rem;
    margin: 0.25rem 0 0 0;
    line-height: 1.4;
    font-style: italic;
  }

  @media (max-width: 768px) {
    .cap-badge {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
