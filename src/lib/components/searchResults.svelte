<script lang="ts">
  import type { SearchResult } from "$lib/types/search.type";

  export let results: SearchResult[] = [];
  export let isLoading = false;
  export let query = "";

  const handleClick = (ticker: string) => {
    window.location.href = `/stock/${ticker}`;
  };
</script>

<div class="results-container">
  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Searching for stocks...</p>
    </div>
  {:else if results.length > 0}
    <div class="results-list">
      {#each results as stock (stock.ticker)}
        <button class="result-item" on:click={() => handleClick(stock.ticker)}>
          <div class="result-left">
            <span class="ticker">{stock.ticker}</span>
            <span class="exchange">{stock.exchange}</span>
          </div>
          <span class="name">{stock.name}</span>
          <svg
            class="arrow-icon"
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      {/each}
    </div>
  {:else if query.length > 0}
    <div class="no-results">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <p>No stocks found for <strong>"{query}"</strong></p>
      <span class="hint">Try searching by ticker symbol or company name</span>
    </div>
  {/if}
</div>

<style>
  .results-container {
    margin-top: 1rem;
  }

  /* Loading State */
  .loading {
    text-align: center;
    padding: 3rem 2rem;
  }

  .spinner {
    width: 40px;
    height: 40px;
    margin: 0 auto 1rem;
    border: 3px solid var(--border-color);
    border-top: 3px solid var(--accent-primary);
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

  .loading p {
    color: var(--text-secondary);
    font-size: 1rem;
  }

  /* Results List */
  .results-list {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .result-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    background: var(--card-bg);
    border: 2px solid var(--card-border);
    border-radius: var(--border-radius);
    padding: 1.25rem 1.5rem;
    text-align: left;
    cursor: pointer;
    transition: all 0.2s ease;
    width: 100%;
    box-shadow: var(--shadow-sm);
  }

  .result-item:hover {
    border-color: var(--card-hover-border);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .result-item:active {
    transform: translateY(0);
  }

  .result-left {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    min-width: 140px;
  }

  .ticker {
    font-weight: 700;
    color: var(--accent-primary);
    font-size: 1.15rem;
    letter-spacing: 0.5px;
  }

  .exchange {
    color: var(--text-tertiary);
    font-size: 0.85rem;
    padding: 0.25rem 0.5rem;
    background: var(--bg-secondary);
    border-radius: 4px;
    font-weight: 500;
  }

  .name {
    color: var(--text-primary);
    font-size: 1rem;
    flex: 1;
    font-weight: 500;
  }

  .arrow-icon {
    color: var(--text-tertiary);
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  .result-item:hover .arrow-icon {
    color: var(--accent-primary);
    transform: translateX(4px);
  }

  /* No Results */
  .no-results {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--card-bg);
    border-radius: var(--border-radius);
    border: 2px dashed var(--card-border);
  }

  .no-results svg {
    color: var(--text-tertiary);
    margin-bottom: 1rem;
    opacity: 0.5;
  }

  .no-results p {
    color: var(--text-secondary);
    font-size: 1.05rem;
    margin-bottom: 0.5rem;
  }

  .no-results strong {
    color: var(--text-primary);
  }

  .hint {
    display: block;
    color: var(--text-tertiary);
    font-size: 0.9rem;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .result-item {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.5rem;
    }

    .result-left {
      width: 100%;
    }

    .arrow-icon {
      display: none;
    }

    .name {
      font-size: 0.95rem;
    }
  }
</style>
