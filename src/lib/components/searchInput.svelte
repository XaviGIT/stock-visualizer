<script lang="ts">
  export let placeholder = "Search for a stock...";
  export let value = "";
  export let onSearch: (term: string) => void = () => {};

  function debounce(func: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return function executedFunction(...args: any[]) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  const handleInput = debounce((event: Event) => {
    const target = event.target as HTMLInputElement;
    value = target.value;
    onSearch(value);
  }, 300);
</script>

<div class="search-container">
  <svg
    class="search-icon"
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
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.35-4.35" />
  </svg>
  <input
    type="text"
    {placeholder}
    {value}
    on:input={handleInput}
    class="search-input"
  />
</div>

<style>
  .search-container {
    position: relative;
    width: 100%;
  }

  .search-icon {
    position: absolute;
    left: 1.25rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-tertiary);
    pointer-events: none;
    transition: color 0.3s ease;
  }

  .search-input {
    width: 100%;
    padding: 1rem 1.5rem 1rem 3.25rem;
    font-size: 1.05rem;
    border: 2px solid var(--input-border);
    border-radius: 50px;
    outline: none;
    transition: all 0.3s ease;
    background: var(--input-bg);
    color: var(--text-primary);
    box-shadow: var(--shadow-sm);
  }

  .search-input::placeholder {
    color: var(--text-tertiary);
  }

  .search-input:focus {
    border-color: var(--input-focus-border);
    box-shadow: 0 4px 16px rgba(66, 133, 244, 0.2);
  }

  .search-input:focus + .search-icon {
    color: var(--accent-primary);
  }
</style>
