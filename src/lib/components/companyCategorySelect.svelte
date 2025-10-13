<script lang="ts">
  import type { CompanyCategory } from "$lib/types/analysis.type";

  export let selected: CompanyCategory | null = null;
  export let onChange: (category: CompanyCategory) => void;

  const categories: {
    value: CompanyCategory;
    label: string;
    description: string;
    emoji: string;
  }[] = [
    {
      value: "slow-grower",
      label: "Slow Grower",
      description: "Large, mature companies with modest growth",
      emoji: "🐢",
    },
    {
      value: "stalwart",
      label: "Stalwart",
      description: "Large companies growing 10-12% annually",
      emoji: "🛡️",
    },
    {
      value: "fast-grower",
      label: "Fast Grower",
      description: "Small aggressive companies growing 20-25%+",
      emoji: "🚀",
    },
    {
      value: "cyclical",
      label: "Cyclical",
      description: "Sales/profits rise and fall with business cycles",
      emoji: "🔄",
    },
    {
      value: "turnaround",
      label: "Turnaround",
      description: "Battered, depressed, no-growth companies recovering",
      emoji: "🔧",
    },
    {
      value: "asset-play",
      label: "Asset Play",
      description: "Company with valuable assets overlooked by market",
      emoji: "💎",
    },
  ];

  const handleSelect = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    onChange(target.value as CompanyCategory);
  };
</script>

<div class="category-selector">
  <label for="company-category">
    <strong>Company Type (Peter Lynch)</strong>
    <span class="label-hint"
      >Select the category that best describes this company</span
    >
  </label>

  <div class="select-wrapper">
    <select
      id="company-category"
      value={selected || ""}
      on:change={handleSelect}
      class="category-select"
    >
      <option value="" disabled>Select a category...</option>
      {#each categories as category}
        <option value={category.value}>
          {category.emoji}
          {category.label}
        </option>
      {/each}
    </select>
  </div>

  {#if selected}
    <div class="category-info">
      {#each categories as category}
        {#if category.value === selected}
          <div class="info-card">
            <span class="info-emoji">{category.emoji}</span>
            <div class="info-content">
              <strong>{category.label}</strong>
              <p>{category.description}</p>
            </div>
          </div>
        {/if}
      {/each}
    </div>
  {/if}
</div>

<style>
  .category-selector {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    color: var(--text-primary);
    font-size: 0.95rem;
  }

  .label-hint {
    color: var(--text-tertiary);
    font-size: 0.85rem;
    font-weight: normal;
  }

  .select-wrapper {
    position: relative;
  }

  .category-select {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    border: 2px solid var(--input-border);
    border-radius: 8px;
    background: var(--input-bg);
    color: var(--text-primary);
    cursor: pointer;
    transition: all 0.2s ease;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 1rem center;
    padding-right: 2.5rem;
  }

  .category-select:hover {
    border-color: var(--accent-primary);
  }

  .category-select:focus {
    outline: none;
    border-color: var(--input-focus-border);
    box-shadow: 0 0 0 3px rgba(88, 129, 87, 0.1);
  }

  .info-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    background: var(--card-bg);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }

  .info-emoji {
    font-size: 2rem;
    flex-shrink: 0;
  }

  .info-content {
    flex: 1;
  }

  .info-content strong {
    display: block;
    color: var(--text-primary);
    margin-bottom: 0.25rem;
    font-size: 1rem;
  }

  .info-content p {
    color: var(--text-secondary);
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.4;
  }

  @media (max-width: 768px) {
    .info-card {
      flex-direction: column;
      text-align: center;
    }
  }
</style>
