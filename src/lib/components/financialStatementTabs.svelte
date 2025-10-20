<script lang="ts">
  import type { StatementTab, StatementType } from "$lib/types/financials.type";

  export let tabs: StatementTab[];
  export let activeTab: StatementType;
  export let metadata: {
    balanceSheetsCount: number;
    incomeStatementsCount: number;
    cashFlowsCount: number;
    oldestPeriod: string | null;
    latestPeriod: string | null;
  };

  function getStatementCount(tabId: StatementType): number {
    switch (tabId) {
      case "balance-sheet":
        return metadata.balanceSheetsCount;
      case "income-statement":
        return metadata.incomeStatementsCount;
      case "cash-flow":
        return metadata.cashFlowsCount;
      default:
        return 0;
    }
  }
</script>

<div class="tabs-container">
  <div class="tabs">
    {#each tabs as tab}
      <button
        class="tab"
        class:active={activeTab === tab.id}
        on:click={() => (activeTab = tab.id)}
      >
        <span class="tab-icon">{tab.icon}</span>
        <span class="tab-label">{tab.label}</span>
        <span class="tab-count">{getStatementCount(tab.id)}</span>
      </button>
    {/each}
  </div>

  {#if metadata.oldestPeriod && metadata.latestPeriod}
    <div class="period-info">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
        <line x1="16" y1="2" x2="16" y2="6" />
        <line x1="8" y1="2" x2="8" y2="6" />
        <line x1="3" y1="10" x2="21" y2="10" />
      </svg>
      <span>
        {new Date(metadata.oldestPeriod).getFullYear()} - {new Date(
          metadata.latestPeriod,
        ).getFullYear()}
      </span>
    </div>
  {/if}
</div>

<style>
  .tabs-container {
    background: var(--card-bg);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-md);
    border: 1px solid var(--card-border);
    margin-bottom: 2rem;
  }

  .tabs {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }

  .tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.875rem 1.5rem;
    background: var(--bg-secondary);
    border: 2px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.95rem;
    font-weight: 600;
    color: var(--text-secondary);
    flex: 1;
    min-width: 180px;
    justify-content: center;
  }

  .tab:hover {
    background: var(--card-bg);
    border-color: var(--accent-primary);
    transform: translateY(-2px);
    box-shadow: var(--shadow-sm);
  }

  .tab.active {
    background: var(--accent-primary);
    border-color: var(--accent-primary);
    color: white;
    box-shadow: var(--shadow-md);
  }

  .tab-icon {
    font-size: 1.25rem;
  }

  .tab-label {
    flex: 1;
    text-align: center;
  }

  .tab-count {
    background: rgba(255, 255, 255, 0.2);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 700;
    min-width: 24px;
    text-align: center;
  }

  .tab.active .tab-count {
    background: rgba(255, 255, 255, 0.3);
  }

  .period-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-tertiary);
    font-size: 0.9rem;
    justify-content: center;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
  }

  .period-info svg {
    flex-shrink: 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .tabs {
      flex-direction: column;
    }

    .tab {
      min-width: 100%;
    }
  }
</style>
