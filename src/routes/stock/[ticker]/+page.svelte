<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { stockApi } from "$lib/services/api";
  import type { Stock } from "$lib/types/stock.type";
  import ThemeToggle from "$lib/components/themeToggle.svelte";
  import { theme } from "$lib/stores/theme";

  $: ticker = $page.params.ticker || "";

  let company: Stock | null = null;
  let isLoading = true;
  let errorMessage = "";

  onMount(async () => {
    theme.init();
    await fetchCompanyData();
  });

  const fetchCompanyData = async () => {
    isLoading = true;
    errorMessage = "";

    try {
      const data = await stockApi.getCompany(ticker);
      company = data;
    } catch (error) {
      errorMessage = "Failed to load company data. Please try again.";
      console.error("Error fetching company:", error);
    } finally {
      isLoading = false;
    }
  };

  function formatDate(dateString: string | undefined) {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function formatNumber(num: number | null | undefined) {
    if (num === null || num === undefined) return "N/A";
    return num.toLocaleString("en-US");
  }

  function calculateMarketCap() {
    if (!company?.price || !company?.shares) return null;
    const price = parseFloat(company.price);
    const marketCap = price * company.shares;

    if (marketCap >= 1e12) {
      return `$${(marketCap / 1e12).toFixed(2)}T`;
    } else if (marketCap >= 1e9) {
      return `$${(marketCap / 1e9).toFixed(2)}B`;
    } else if (marketCap >= 1e6) {
      return `$${(marketCap / 1e6).toFixed(2)}M`;
    }
    return `$${marketCap.toFixed(2)}`;
  }
</script>

<ThemeToggle />

<div class="page-wrapper">
  <div class="container">
    <a href="/" class="back-link">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <line x1="19" y1="12" x2="5" y2="12" />
        <polyline points="12 19 5 12 12 5" />
      </svg>
      Back to search
    </a>

    {#if isLoading}
      <div class="loading-card">
        <div class="spinner"></div>
        <p>Loading company data...</p>
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
        <button on:click={fetchCompanyData} class="retry-btn">Try Again</button>
      </div>
    {:else if company}
      <!-- Header Card -->
      <div class="header-card">
        <div class="header-content">
          <div class="title-section">
            <h1>{company.name}</h1>
            <div class="meta-tags">
              <span class="ticker-badge">{company.ticker}</span>
              <span class="exchange-badge">{company.exchange}</span>
            </div>
          </div>
          {#if company.price}
            <div class="price-section">
              <div class="price-label">Current Price</div>
              <div class="price">${company.price}</div>
              {#if calculateMarketCap()}
                <div class="market-cap">Market Cap: {calculateMarketCap()}</div>
              {/if}
            </div>
          {/if}
        </div>
      </div>

      <!-- Stats Grid -->
      <div class="stats-grid">
        {#if company.sector}
          <div class="stat-card">
            <div class="stat-icon">🏢</div>
            <div class="stat-content">
              <div class="stat-label">Sector</div>
              <div class="stat-value">{company.sector}</div>
            </div>
          </div>
        {/if}

        {#if company.category}
          <div class="stat-card">
            <div class="stat-icon">📂</div>
            <div class="stat-content">
              <div class="stat-label">Category</div>
              <div class="stat-value">{company.category}</div>
            </div>
          </div>
        {/if}

        {#if company.shares}
          <div class="stat-card">
            <div class="stat-icon">📊</div>
            <div class="stat-content">
              <div class="stat-label">Shares Outstanding</div>
              <div class="stat-value">{formatNumber(company.shares)}</div>
            </div>
          </div>
        {/if}

        {#if company.nextEarnings}
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-content">
              <div class="stat-label">Next Earnings</div>
              <div class="stat-value">{formatDate(company.nextEarnings)}</div>
            </div>
          </div>
        {/if}
      </div>

      <!-- About Section -->
      {#if company.description}
        <div class="section-card">
          <h2>About {company.name}</h2>
          <p class="description">{company.description}</p>
        </div>
      {/if}

      <!-- Links -->
      <div class="links-section">
        {#if company.website}
          <a
            href={company.website}
            target="_blank"
            rel="noopener noreferrer"
            class="link-button"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="2" y1="12" x2="22" y2="12" />
              <path
                d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
              />
            </svg>
            Visit Company Website
          </a>
        {/if}
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Explore This Stock</h2>
        <div class="actions-grid">
          <a href="/stock/{ticker}/analysis" class="action-card primary">
            <div class="action-icon">📊</div>
            <div class="action-content">
              <h3>Analysis</h3>
              <p>Growth, profitability, and financial health metrics</p>
            </div>
            <span class="action-arrow">→</span>
          </a>

          <a href="/stock/{company.ticker}/financials" class="action-card">
            <div class="action-icon">💰</div>
            <div class="action-content">
              <h3>Financial Statements</h3>
              <p>Income, Balance Sheet & Cash Flow</p>
            </div>
            <div class="arrow">→</div>
          </a>

          <a href="/stock/{ticker}/valuation" class="action-card primary">
            <div class="action-icon">💰</div>
            <div class="action-content">
              <h3>Valuation</h3>
              <p>DCF models, intrinsic value calculations</p>
            </div>
            <span class="action-arrow">→</span>
          </a>

          <a href="/stock/{ticker}/story" class="action-card">
            <div class="action-icon">📝</div>
            <div class="action-content">
              <h3>Story</h3>
              <p>Investment thesis and narrative</p>
            </div>
            <div class="arrow">→</div>
          </a>
        </div>
      </div>

      <!-- Coming Soon Sections -->
      <div class="coming-soon-grid">
        <div class="coming-soon-card">
          <h3>👥 Management</h3>
          <p>Executive team, compensation, insider trading</p>
        </div>
        <div class="coming-soon-card disabled">
          <h3>🏢 Sector Analysis</h3>
          <p>Industry positioning and peer comparison (under redesign)</p>
        </div>
      </div>
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
    max-width: 1200px;
    margin: 0 auto;
  }

  /* Back Link */
  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--accent-primary);
    text-decoration: none;
    margin-bottom: 2rem;
    font-size: 0.95rem;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .back-link:hover {
    gap: 0.75rem;
  }

  /* Loading State */
  .loading-card {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
  }

  .spinner {
    width: 50px;
    height: 50px;
    margin: 0 auto 1.5rem;
    border: 4px solid var(--border-color);
    border-top: 4px solid var(--accent-primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .loading-card p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  /* Error State */
  .error-card {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-md);
  }

  .error-card svg {
    color: var(--accent-error);
    margin-bottom: 1rem;
  }

  .error-card p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .retry-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    box-shadow: var(--shadow-sm);
  }

  .retry-btn:hover {
    background: var(--accent-primary-hover);
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }

  /* Header Card */
  .header-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 2rem;
    margin-bottom: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
  }

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 2rem;
  }

  .title-section h1 {
    margin: 0 0 1rem 0;
    color: var(--text-primary);
    font-size: 2rem;
    font-weight: 700;
  }

  .meta-tags {
    display: flex;
    gap: 0.75rem;
    flex-wrap: wrap;
  }

  .ticker-badge {
    background: var(--accent-primary);
    color: white;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 700;
    font-size: 1.1rem;
    letter-spacing: 0.5px;
  }

  .exchange-badge {
    background: var(--bg-secondary);
    color: var(--text-secondary);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    font-size: 0.95rem;
  }

  .price-section {
    text-align: right;
  }

  .price-label {
    font-size: 0.85rem;
    color: var(--text-tertiary);
    margin-bottom: 0.5rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .price {
    font-size: 2.5rem;
    font-weight: 700;
    color: var(--accent-success);
    line-height: 1;
  }

  .market-cap {
    font-size: 0.95rem;
    color: var(--text-secondary);
    margin-top: 0.5rem;
    font-weight: 500;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--card-bg);
    padding: 1.5rem;
    border-radius: var(--border-radius);
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow-sm);
    transition: all 0.2s ease;
  }

  .stat-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
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
    font-size: 1.05rem;
    font-weight: 600;
    color: var(--text-primary);
  }

  /* Section Card */
  .section-card {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: var(--border-radius);
    margin-bottom: 2rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
  }

  .section-card h2 {
    color: var(--text-primary);
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .description {
    line-height: 1.8;
    color: var(--text-secondary);
    text-align: justify;
  }

  /* Links Section */
  .links-section {
    margin-bottom: 2rem;
  }

  .link-button {
    display: inline-flex;
    align-items: center;
    gap: 0.75rem;
    color: var(--accent-primary);
    background: var(--card-bg);
    text-decoration: none;
    font-size: 1rem;
    font-weight: 600;
    padding: 1rem 1.5rem;
    border: 2px solid var(--accent-primary);
    border-radius: var(--border-radius);
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }

  .link-button:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  /* Quick Actions */
  .quick-actions {
    margin-bottom: 2rem;
  }

  .quick-actions h2 {
    color: var(--text-primary);
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
  }

  .actions-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .action-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: var(--border-radius);
    text-decoration: none;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
    position: relative;
  }

  .action-card.primary {
    border-color: var(--accent-primary);
    background: linear-gradient(
      135deg,
      var(--card-bg) 0%,
      var(--bg-secondary) 100%
    );
  }

  .action-card.primary:hover {
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
    border-color: var(--accent-primary-hover);
  }

  .action-card.disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .action-icon {
    font-size: 2.5rem;
    flex-shrink: 0;
  }

  .action-content {
    flex: 1;
  }

  .action-content h3 {
    color: var(--text-primary);
    margin: 0 0 0.25rem 0;
    font-size: 1.1rem;
  }

  .action-content p {
    color: var(--text-secondary);
    margin: 0;
    font-size: 0.9rem;
    line-height: 1.4;
  }

  .action-arrow {
    color: var(--accent-primary);
    font-size: 1.5rem;
    font-weight: bold;
    transition: transform 0.2s ease;
  }

  .action-card.primary:hover .action-arrow {
    transform: translateX(4px);
  }

  .coming-soon-badge {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    padding: 0.25rem 0.6rem;
    background: var(--text-tertiary);
    color: white;
    font-size: 0.7rem;
    border-radius: 4px;
    font-weight: 600;
  }

  /* Coming Soon Grid */
  .coming-soon-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1rem;
  }

  .coming-soon-card {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: var(--border-radius);
    border: 2px dashed var(--card-border);
    text-align: center;
    opacity: 0.7;
    transition: all 0.2s ease;
  }

  .coming-soon-card:hover:not(.disabled) {
    opacity: 1;
    border-color: var(--accent-primary);
  }

  .coming-soon-card.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .coming-soon-card h3 {
    color: var(--text-primary);
    margin-bottom: 0.5rem;
    font-size: 1.2rem;
  }

  .coming-soon-card p {
    color: var(--text-tertiary);
    font-size: 0.9rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
    }

    .price-section {
      text-align: left;
      width: 100%;
    }

    .stats-grid {
      grid-template-columns: 1fr;
    }

    .title-section h1 {
      font-size: 1.5rem;
    }

    .price {
      font-size: 2rem;
    }

    .actions-grid {
      grid-template-columns: 1fr;
    }

    .action-card {
      flex-direction: column;
      text-align: center;
    }

    .action-arrow {
      display: none;
    }
  }
</style>
