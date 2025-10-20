<script lang="ts">
  import { page } from "$app/stores";
  import ThemeToggle from "$lib/components/themeToggle.svelte";

  const ticker = $page.params.ticker || "";
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
      <span class="current">Sector Analysis</span>
    </nav>

    <!-- Page Header -->
    <div class="page-header">
      <div>
        <h1>Sector Analysis</h1>
        <p class="ticker-label">{ticker}</p>
      </div>
    </div>

    <!-- Under Construction Message -->
    <div class="construction-card">
      <div class="construction-icon">🚧</div>
      <h2>Under Construction</h2>
      <p class="construction-message">
        The sector analysis feature is currently being redesigned to provide better industry insights, peer comparisons, and competitive positioning data.
      </p>
      <p class="construction-details">
        We're working on:
      </p>
      <ul class="construction-list">
        <li>Enhanced peer comparison tools</li>
        <li>Industry trend analysis</li>
        <li>Competitive positioning metrics</li>
        <li>Market share analysis</li>
        <li>Industry-specific financial ratios</li>
      </ul>
      <div class="construction-actions">
        <a href="/stock/{ticker}" class="back-button">
          ← Back to {ticker} Overview
        </a>
        <a href="/stock/{ticker}/analysis" class="alternative-button">
          View Financial Analysis
        </a>
      </div>
    </div>
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

  .construction-card {
    background: var(--card-bg);
    border: 2px dashed var(--card-border);
    border-radius: var(--border-radius);
    padding: 4rem 2rem;
    text-align: center;
    box-shadow: var(--shadow-md);
    max-width: 600px;
    margin: 0 auto;
  }

  .construction-icon {
    font-size: 4rem;
    margin-bottom: 1.5rem;
    opacity: 0.8;
  }

  .construction-card h2 {
    color: var(--text-primary);
    font-size: 2rem;
    margin-bottom: 1rem;
  }

  .construction-message {
    color: var(--text-secondary);
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .construction-details {
    color: var(--text-primary);
    font-weight: 600;
    margin-bottom: 1rem;
  }

  .construction-list {
    text-align: left;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    max-width: 400px;
    margin-left: auto;
    margin-right: auto;
  }

  .construction-list li {
    margin-bottom: 0.5rem;
    padding-left: 0.5rem;
  }

  .construction-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  .back-button,
  .alternative-button {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    text-decoration: none;
    font-weight: 600;
    transition: all 0.2s ease;
  }

  .back-button {
    background: var(--accent-primary);
    color: white;
  }

  .back-button:hover {
    background: var(--accent-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .alternative-button {
    background: var(--card-bg);
    color: var(--accent-primary);
    border: 2px solid var(--accent-primary);
  }

  .alternative-button:hover {
    background: var(--accent-primary);
    color: white;
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  @media (max-width: 768px) {
    .page-header h1 {
      font-size: 2rem;
    }

    .construction-card {
      padding: 2rem 1rem;
    }

    .construction-actions {
      flex-direction: column;
      align-items: center;
    }

    .back-button,
    .alternative-button {
      width: 100%;
      max-width: 300px;
      justify-content: center;
    }
  }
</style>
