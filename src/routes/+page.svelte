<script lang="ts">
  import SearchInput from "$lib/components/searchInput.svelte";
  import SearchResults from "$lib/components/searchResults.svelte";
  import ThemeToggle from "$lib/components/themeToggle.svelte";
  import { stockApi } from "$lib/services/api";
  import { theme } from "$lib/stores/theme";
  import { onMount } from "svelte";
  import type { SearchResult } from "$lib/types/search.type";

  let searchTerm = "";
  let searchResults: SearchResult[] = [];
  let isLoading = false;
  let errorMessage = "";

  // Initialize theme on mount
  onMount(() => {
    theme.init();
  });

  const handleSearch = async (term: string) => {
    searchTerm = term;

    if (!term.trim()) {
      searchResults = [];
      return;
    }

    isLoading = true;
    errorMessage = "";

    try {
      searchResults = await stockApi.search(term);
    } catch (error) {
      errorMessage = "Failed to search stocks. Please try again.";
      console.error(error);
      searchResults = [];
    } finally {
      isLoading = false;
    }
  };
</script>

<ThemeToggle />

<div class="page-wrapper">
  <div class="container">
    <div class="header">
      <div class="logo">
        <span class="logo-icon">📊</span>
        <h1>Stock Analysis</h1>
      </div>
      <p class="subtitle">Discover insights and analyze your favorite stocks</p>
    </div>

    <div class="search-section">
      <SearchInput
        onSearch={handleSearch}
        placeholder="Search by ticker or company name..."
      />
    </div>

    {#if errorMessage}
      <div class="error-message">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
        {errorMessage}
      </div>
    {/if}

    <SearchResults results={searchResults} {isLoading} />
  </div>
</div>

<style>
  .page-wrapper {
    min-height: 100vh;
    background: linear-gradient(
      135deg,
      var(--bg-gradient-start) 0%,
      var(--bg-gradient-end) 100%
    );
    padding: 2rem 1rem;
  }

  .container {
    max-width: 800px;
    margin: 0 auto;
  }

  .header {
    text-align: center;
    margin-bottom: 3rem;
    padding-top: 2rem;
  }

  .logo {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    margin-bottom: 0.75rem;
  }

  .logo-icon {
    font-size: 2.5rem;
  }

  h1 {
    margin: 0;
    color: white;
    font-size: 2.5rem;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .subtitle {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    margin: 0;
    font-weight: 400;
  }

  .search-section {
    background: var(--card-bg);
    padding: 2rem;
    border-radius: var(--border-radius);
    box-shadow: var(--shadow-lg);
    margin-bottom: 2rem;
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: var(--accent-error);
    color: white;
    padding: 1rem 1.25rem;
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
    box-shadow: var(--shadow-md);
  }

  .error-message svg {
    flex-shrink: 0;
  }

  @media (max-width: 768px) {
    .page-wrapper {
      padding: 1rem 0.5rem;
    }

    h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }

    .search-section {
      padding: 1.5rem;
    }
  }
</style>
