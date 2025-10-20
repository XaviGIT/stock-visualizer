<script lang="ts">
  import { onMount } from "svelte";
  import { page } from "$app/stores";
  import { stockApi } from "$lib/services/api";
  import type { SectorAnalysisResponse } from "$lib/types/sector.type";
  import ThemeToggle from "$lib/components/themeToggle.svelte";

  const ticker = $page.params.ticker || "";

  let sectorData: SectorAnalysisResponse | null = null;
  let isLoading = true;
  let errorMessage = "";

  onMount(async () => {
    await fetchSectorData();
  });

  async function fetchSectorData() {
    isLoading = true;
    errorMessage = "";

    try {
      sectorData = await stockApi.getSectorAnalysis(ticker);
    } catch (error) {
      errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to load sector analysis";
      console.error(error);
    } finally {
      isLoading = false;
    }
  }

  function formatCurrency(value: number | null): string {
    if (value === null) return "N/A";
    if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`;
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    return `$${value.toFixed(2)}`;
  }

  function formatPercentage(value: number | null): string {
    if (value === null) return "N/A";
    return `${value.toFixed(2)}%`;
  }

  function getRankingBadgeClass(percentile: number): string {
    if (percentile >= 90) return "badge-excellent";
    if (percentile >= 75) return "badge-good";
    if (percentile >= 50) return "badge-average";
    return "badge-poor";
  }
</script>

<ThemeToggle />

<div class="page-wrapper">
  <div class="container">
    <!-- Breadcrumb -->
    <nav class="breadcrumb">
      <a href="/">Home</a>
      <span class="separator">›</span>
      <a href="/stock/{ticker}">{ticker}</a>
      <span class="separator">›</span>
      <span class="current">Industry Analysis</span>
    </nav>

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Industry Analysis</h1>
        <p class="ticker-label">{ticker}</p>
      </div>
    </div>

    {#if isLoading}
      <div class="loading-card">
        <div class="spinner"></div>
        <p>Loading industry data...</p>
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
        <button on:click={fetchSectorData} class="retry-btn">
          Try Again
        </button>
      </div>
    {:else if sectorData}
      <!-- Industry Overview Section -->
      <section class="section-card">
        <h2>{sectorData.industry.name}</h2>
        {#if sectorData.sector}
          <p class="sector-badge">
            Sector: <strong>{sectorData.sector.name}</strong>
          </p>
        {/if}
        {#if sectorData.industry.description}
          <p class="sector-description">{sectorData.industry.description}</p>
        {/if}

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🏢</div>
            <div class="stat-content">
              <div class="stat-label">Total Companies</div>
              <div class="stat-value">
                {sectorData.industryOverview.totalCompanies}
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💰</div>
            <div class="stat-content">
              <div class="stat-label">Total Market Cap</div>
              <div class="stat-value">
                {formatCurrency(sectorData.industryOverview.totalMarketCap)}
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-label">Avg Market Cap</div>
              <div class="stat-value">
                {formatCurrency(sectorData.industryOverview.avgMarketCap)}
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📈</div>
            <div class="stat-content">
              <div class="stat-label">Avg Revenue</div>
              <div class="stat-value">
                {formatCurrency(sectorData.industryOverview.avgRevenue)}
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">💵</div>
            <div class="stat-content">
              <div class="stat-label">Avg Profit Margin</div>
              <div class="stat-value">
                {formatPercentage(sectorData.industryOverview.avgProfitMargin)}
              </div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-label">Avg Revenue Growth</div>
              <div class="stat-value">
                {formatPercentage(sectorData.industryOverview.avgRevenueGrowth)}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Company Position Section -->
      <section class="section-card">
        <h2>{sectorData.companyName} Position in Industry</h2>

        <div class="rankings-grid">
          <!-- Market Cap Ranking -->
          <div class="ranking-card">
            <h3>Market Cap</h3>
            <div class="ranking-value">
              #{sectorData.companyPosition.marketCapRank.rank}
              <span class="total"
                >of {sectorData.companyPosition.marketCapRank.total}</span
              >
            </div>
            <div class="ranking-percentile">
              <span
                class="badge {getRankingBadgeClass(
                  sectorData.companyPosition.marketCapRank.percentile,
                )}"
              >
                Top {100 - sectorData.companyPosition.marketCapRank.percentile}%
              </span>
            </div>
            <div class="ranking-actual">
              {formatCurrency(sectorData.companyPosition.marketCapRank.value)}
            </div>
          </div>

          <!-- Revenue Ranking -->
          <div class="ranking-card">
            <h3>Revenue</h3>
            <div class="ranking-value">
              #{sectorData.companyPosition.revenueRank.rank}
              <span class="total"
                >of {sectorData.companyPosition.revenueRank.total}</span
              >
            </div>
            <div class="ranking-percentile">
              <span
                class="badge {getRankingBadgeClass(
                  sectorData.companyPosition.revenueRank.percentile,
                )}"
              >
                Top {100 - sectorData.companyPosition.revenueRank.percentile}%
              </span>
            </div>
            <div class="ranking-actual">
              {formatCurrency(sectorData.companyPosition.revenueRank.value)}
            </div>
          </div>

          <!-- Profit Margin Ranking -->
          <div class="ranking-card">
            <h3>Profit Margin</h3>
            <div class="ranking-value">
              #{sectorData.companyPosition.profitMarginRank.rank}
              <span class="total"
                >of {sectorData.companyPosition.profitMarginRank.total}</span
              >
            </div>
            <div class="ranking-percentile">
              <span
                class="badge {getRankingBadgeClass(
                  sectorData.companyPosition.profitMarginRank.percentile,
                )}"
              >
                Top {100 -
                  sectorData.companyPosition.profitMarginRank.percentile}%
              </span>
            </div>
            <div class="ranking-actual">
              {formatPercentage(
                sectorData.companyPosition.profitMarginRank.value,
              )}
            </div>
          </div>
        </div>
      </section>

      <!-- Peer Comparison Section -->
      <section class="section-card">
        <h2>Peer Comparison</h2>

        <div class="table-wrapper">
          <table class="peer-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Ticker</th>
                <th>Market Cap</th>
                <th>Revenue</th>
                <th>Profit Margin</th>
                <th>Revenue Growth</th>
              </tr>
            </thead>
            <tbody>
              {#each sectorData.peerComparison as peer}
                <tr class="peer-row">
                  <td class="company-cell">
                    <a href="/stock/{peer.ticker}" class="company-link">
                      {peer.name}
                    </a>
                  </td>
                  <td class="ticker-cell">{peer.ticker}</td>
                  <td>{formatCurrency(peer.marketCap)}</td>
                  <td>{formatCurrency(peer.revenue)}</td>
                  <td
                    class:positive={peer.profitMargin && peer.profitMargin > 0}
                    class:negative={peer.profitMargin && peer.profitMargin < 0}
                  >
                    {formatPercentage(peer.profitMargin)}
                  </td>
                  <td
                    class:positive={peer.revenueGrowth &&
                      peer.revenueGrowth > 0}
                    class:negative={peer.revenueGrowth &&
                      peer.revenueGrowth < 0}
                  >
                    {formatPercentage(peer.revenueGrowth)}
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </section>
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
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: var(--card-bg);
    border-radius: 12px;
    border: 1px solid var(--card-border);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .spinner {
    width: 50px;
    height: 50px;
    border: 4px solid var(--card-border);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1.5rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .error-card svg {
    color: var(--accent-error);
    margin-bottom: 1.5rem;
  }

  .error-card p {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
  }

  .retry-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .retry-btn:hover {
    background: var(--accent-primary-hover);
    transform: translateY(-2px);
  }

  .section-card {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: 12px;
    margin-bottom: 2rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border: 1px solid var(--card-border);
  }

  .section-card h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .sector-description {
    color: var(--text-secondary);
    margin-bottom: 1.5rem;
    line-height: 1.6;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-top: 1.5rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.25rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--card-border);
  }

  .stat-icon {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .stat-content {
    flex: 1;
  }

  .stat-label {
    font-size: 0.8rem;
    color: var(--text-tertiary);
    margin-bottom: 0.25rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
  }

  .stat-value {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  .rankings-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 1.5rem;
  }

  .ranking-card {
    padding: 1.5rem;
    background: var(--bg-secondary);
    border-radius: 8px;
    border: 1px solid var(--card-border);
    text-align: center;
  }

  .ranking-card h3 {
    color: var(--text-secondary);
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 0.75rem;
  }

  .ranking-value {
    font-size: 2rem;
    font-weight: 700;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .ranking-value .total {
    font-size: 1rem;
    color: var(--text-tertiary);
    font-weight: 400;
  }

  .ranking-percentile {
    margin: 1rem 0;
  }

  .badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }

  .badge-excellent {
    background: #10b981;
    color: white;
  }

  .badge-good {
    background: #3b82f6;
    color: white;
  }

  .badge-average {
    background: #f59e0b;
    color: white;
  }

  .badge-poor {
    background: #ef4444;
    color: white;
  }

  .ranking-actual {
    font-size: 0.9rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
  }

  .table-wrapper {
    overflow-x: auto;
    margin-top: 1.5rem;
  }

  .peer-table {
    width: 100%;
    border-collapse: collapse;
  }

  .peer-table thead {
    background: var(--bg-secondary);
  }

  .peer-table th {
    padding: 1rem;
    text-align: left;
    font-size: 0.85rem;
    color: var(--text-secondary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    font-weight: 600;
    border-bottom: 2px solid var(--card-border);
  }

  .peer-table td {
    padding: 1rem;
    border-bottom: 1px solid var(--card-border);
    color: var(--text-primary);
  }

  .peer-row:hover {
    background: var(--bg-secondary);
  }

  .company-cell {
    font-weight: 600;
  }

  .company-link {
    color: var(--text-primary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .company-link:hover {
    color: var(--accent-primary);
  }

  .ticker-cell {
    color: var(--accent-primary);
    font-weight: 600;
  }

  .positive {
    color: #10b981;
  }

  .negative {
    color: #ef4444;
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .rankings-grid {
      grid-template-columns: 1fr;
    }
  }
</style>
