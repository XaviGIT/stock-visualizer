<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { stockApi } from "$lib/services/api";
  import type {
    FinancialStatementsResponse,
    StatementType,
  } from "$lib/types/financials.type";
  import { STATEMENT_TABS } from "$lib/constants/financials";
  import ThemeToggle from "$lib/components/themeToggle.svelte";
  import FinancialStatementTabs from "$lib/components/financialStatementTabs.svelte";
  import BalanceSheetTable from "$lib/components/balanceSheetTable.svelte";
  import IncomeStatementTable from "$lib/components/incomeStatementTable.svelte";
  import CashFlowTable from "$lib/components/cashFlowTable.svelte";

  $: ticker = $page.params.ticker || "";

  let financialData: FinancialStatementsResponse | null = null;
  let activeTab: StatementType = "income-statement";
  let isLoading = true;
  let errorMessage = "";

  onMount(async () => {
    await fetchFinancialStatements();
  });

  const fetchFinancialStatements = async () => {
    isLoading = true;
    errorMessage = "";

    try {
      financialData = await stockApi.getFinancialStatements(ticker);
    } catch (error: any) {
      console.error("Error fetching financial statements:", error);
      if (error.message.includes("404")) {
        errorMessage = "No financial data available for this company.";
      } else {
        errorMessage = "Failed to load financial statements. Please try again.";
      }
    } finally {
      isLoading = false;
    }
  };
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
      <span class="current">Financial Statements</span>
    </nav>

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Financial Statements</h1>
        <p class="ticker-label">
          {ticker}
          {#if financialData?.companyName}
            • {financialData.companyName}
          {/if}
        </p>
      </div>
    </div>

    {#if isLoading}
      <!-- Loading State -->
      <div class="loading-card">
        <div class="spinner"></div>
        <p>Loading financial statements...</p>
      </div>
    {:else if errorMessage}
      <!-- Error State -->
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
        <button on:click={fetchFinancialStatements} class="retry-btn">
          Try Again
        </button>
      </div>
    {:else if financialData}
      <!-- Tabs -->
      <FinancialStatementTabs
        tabs={STATEMENT_TABS}
        bind:activeTab
        metadata={financialData.metadata}
      />

      <!-- Statement Content -->
      <div class="statement-content">
        {#if activeTab === "income-statement"}
          <IncomeStatementTable data={financialData.incomeStatements} />
        {:else if activeTab === "balance-sheet"}
          <BalanceSheetTable data={financialData.balanceSheets} />
        {:else if activeTab === "cash-flow"}
          <CashFlowTable data={financialData.cashFlows} />
        {/if}
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
    max-width: 1600px;
    margin: 0 auto;
  }

  /* Breadcrumb */
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

  /* Page Header */
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

  /* Loading State */
  .loading-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
  }

  .spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border-color);
    border-top-color: var(--accent-primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1rem;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .loading-card p {
    color: var(--text-secondary);
    font-size: 1.1rem;
  }

  /* Error State */
  .error-card {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--accent-error);
  }

  .error-card svg {
    color: var(--accent-error);
    margin: 0 auto 1rem;
  }

  .error-card p {
    color: var(--text-primary);
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .retry-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.75rem 2rem;
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

  /* Statement Content */
  .statement-content {
    margin-top: 2rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }

    .ticker-label {
      font-size: 1rem;
    }
  }
</style>
