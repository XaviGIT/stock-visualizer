<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { valuationApi, stockApi } from "$lib/services/api";
  import type {
    Valuation,
    CreateValuationPayload,
  } from "$lib/types/valuation.type";
  import type { Stock } from "$lib/types/stock.type";
  import ThemeToggle from "$lib/components/themeToggle.svelte";
  import DCFCalculator from "$lib/components/dfcCalculator.svelte";
  import ValuationList from "$lib/components/valuationList.svelte";

  $: ticker = $page.params.ticker || "";

  let valuations: Valuation[] = [];
  let selectedValuation: Valuation | null = null;
  let company: Stock | null = null;
  let currentFCF: number | null = null;
  let isLoading = true;
  let errorMessage = "";
  let showCalculator = false;
  let companyName = "";

  onMount(async () => {
    await Promise.all([fetchValuations(), fetchCompanyData()]);
  });

  const fetchCompanyData = async () => {
    try {
      // Get company basic info
      company = await stockApi.getCompany(ticker);
      companyName = company.name || ticker;

      // Get financial data including current FCF
      try {
        const financials = await stockApi.getCompanyFinancials(ticker);
        currentFCF = financials.currentFCF;
      } catch (error) {
        console.error("Error fetching financials:", error);
        // If financials endpoint fails, just use null
        currentFCF = null;
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
    }
  };

  const fetchValuations = async () => {
    isLoading = true;
    errorMessage = "";

    try {
      const data = await valuationApi.getValuations(ticker);
      valuations = data.valuations;
      companyName = data.companyName;

      if (valuations.length > 0) {
        selectedValuation = valuations[0];
      }
    } catch (error: any) {
      if (error.message.includes("404")) {
        // No valuations yet, that's okay
        errorMessage = "";
      } else {
        errorMessage = "Failed to load valuations. Please try again.";
        console.error("Error fetching valuations:", error);
      }
    } finally {
      isLoading = false;
    }
  };

  const handleCreateValuation = async (payload: CreateValuationPayload) => {
    try {
      await valuationApi.createValuation(ticker, payload);
      await fetchValuations();
      showCalculator = false;
    } catch (error) {
      console.error("Error creating valuation:", error);
      alert("Failed to create valuation. Please try again.");
    }
  };

  const handleSelectValuation = (valuation: Valuation) => {
    selectedValuation = valuation;
    showCalculator = false;
  };

  const handleDeleteValuation = async (id: string) => {
    if (!confirm("Are you sure you want to delete this valuation?")) {
      return;
    }

    try {
      await valuationApi.deleteValuation(ticker, id);
      await fetchValuations();

      if (selectedValuation?.id === id) {
        selectedValuation = valuations.length > 0 ? valuations[0] : null;
      }
    } catch (error) {
      console.error("Error deleting valuation:", error);
      alert("Failed to delete valuation. Please try again.");
    }
  };
</script>

<ThemeToggle />

<div class="page-wrapper">
  <div class="container">
    <nav class="breadcrumb">
      <a href="/">Home</a>
      <span class="separator">›</span>
      <a href="/stock/{ticker}">{ticker}</a>
      <span class="separator">›</span>
      <span class="current">Valuation</span>
    </nav>

    <div class="page-header">
      <div>
        <h1>DCF Valuation</h1>
        <p class="ticker-label">
          {ticker}
          {companyName ? `• ${companyName}` : ""}
        </p>
      </div>
      <button
        class="primary-btn"
        on:click={() => (showCalculator = !showCalculator)}
      >
        {showCalculator ? "← Back to Valuations" : "+ New Valuation"}
      </button>
    </div>

    {#if isLoading}
      <div class="loading-card">
        <div class="spinner"></div>
        <p>Loading valuations...</p>
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
        <button on:click={fetchValuations} class="retry-btn">
          Try Again
        </button>
      </div>
    {:else if showCalculator}
      <DCFCalculator
        {ticker}
        sharesOutstanding={company?.shares || 0}
        {currentFCF}
        onSubmit={handleCreateValuation}
        onCancel={() => (showCalculator = false)}
      />
    {:else if valuations.length === 0}
      <div class="empty-state">
        <div class="empty-icon">💰</div>
        <h2>No Valuations Yet</h2>
        <p>Create your first DCF valuation model to get started</p>
        <button
          class="primary-btn large"
          on:click={() => (showCalculator = true)}
        >
          Create First Valuation
        </button>
      </div>
    {:else}
      <ValuationList
        {valuations}
        {selectedValuation}
        {ticker}
        currentPrice={company?.price ? parseFloat(company.price) : null}
        onSelect={handleSelectValuation}
        onDelete={handleDeleteValuation}
      />
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
    color: var(--text-tertiary);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .breadcrumb a:hover {
    color: var(--accent-primary);
  }

  .separator {
    color: var(--text-tertiary);
  }

  .current {
    color: var(--text-primary);
    font-weight: 600;
  }

  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  .page-header h1 {
    font-size: 2rem;
    color: var(--text-primary);
    margin-bottom: 0.5rem;
  }

  .ticker-label {
    font-size: 1rem;
    color: var(--text-secondary);
    font-weight: 500;
  }

  .primary-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.875rem 1.5rem;
    border-radius: 8px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    box-shadow: var(--shadow-sm);
  }

  .primary-btn:hover {
    background: var(--accent-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .primary-btn.large {
    padding: 1.25rem 2.5rem;
    font-size: 1.1rem;
  }

  .loading-card,
  .error-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    border: 1px solid var(--card-border);
    box-shadow: var(--shadow-md);
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
    font-size: 1.1rem;
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
  }

  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 6rem 2rem;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    border: 2px dashed var(--card-border);
    text-align: center;
  }

  .empty-icon {
    font-size: 5rem;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  .empty-state h2 {
    color: var(--text-primary);
    font-size: 1.8rem;
    margin-bottom: 0.75rem;
  }

  .empty-state p {
    color: var(--text-secondary);
    font-size: 1.1rem;
    margin-bottom: 2rem;
    max-width: 500px;
  }

  @media (max-width: 768px) {
    .page-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .primary-btn {
      width: 100%;
    }
  }
</style>
