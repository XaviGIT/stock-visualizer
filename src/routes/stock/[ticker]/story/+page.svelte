<script lang="ts">
  import { page } from "$app/stores";
  import { onMount } from "svelte";
  import { storyApi, type StoryContent } from "$lib/services/api";
  import ThemeToggle from "$lib/components/themeToggle.svelte";

  const ticker = $page.params.ticker?.toUpperCase() || "";

  let isLoading = true;
  let isSaving = false;
  let errorMessage = "";
  let successMessage = "";
  let companyName = "";
  let lastEdited: string | null = null;

  // Story sections
  let content: StoryContent = {
    sections: {
      overview: "",
      businessModel: "",
      competitiveAdvantages: "",
      risks: "",
      investmentThesis: "",
      recentDevelopments: "",
      outlook: "",
    },
  };

  const sections = [
    {
      key: "overview",
      title: "Company Overview",
      icon: "🏢",
      placeholder:
        "Brief overview of the company, its history, and what it does...",
    },
    {
      key: "businessModel",
      title: "Business Model",
      icon: "💼",
      placeholder:
        "How does the company make money? Revenue streams, customer base, etc...",
    },
    {
      key: "competitiveAdvantages",
      title: "Competitive Advantages / Moats",
      icon: "🏰",
      placeholder:
        "What gives this company a sustainable competitive advantage?",
    },
    {
      key: "risks",
      title: "Key Risks",
      icon: "⚠️",
      placeholder:
        "What could go wrong? Competition, regulation, market risks...",
    },
    {
      key: "investmentThesis",
      title: "Investment Thesis",
      icon: "💡",
      placeholder: "Why invest in this company? Bull case arguments...",
    },
    {
      key: "recentDevelopments",
      title: "Recent Developments",
      icon: "📰",
      placeholder: "Recent news, product launches, acquisitions...",
    },
    {
      key: "outlook",
      title: "Long-term Outlook",
      icon: "🔮",
      placeholder:
        "Where is the company headed? Growth prospects, strategic direction...",
    },
  ];

  onMount(async () => {
    await loadStory();
  });

  async function loadStory() {
    try {
      isLoading = true;
      errorMessage = "";

      const response = await storyApi.getStory(ticker);
      companyName = response.companyName;

      if (response.story.content.sections) {
        content = response.story.content;
      }

      lastEdited = response.story.lastEdited;
    } catch (error) {
      errorMessage = "Failed to load story. Please try again.";
      console.error(error);
    } finally {
      isLoading = false;
    }
  }

  async function handleSave() {
    try {
      isSaving = true;
      errorMessage = "";
      successMessage = "";

      const response = await storyApi.saveStory(ticker, content);
      lastEdited = response.story.lastEdited;

      successMessage = "Story saved successfully!";
      setTimeout(() => {
        successMessage = "";
      }, 3000);
    } catch (error) {
      errorMessage = "Failed to save story. Please try again.";
      console.error(error);
    } finally {
      isSaving = false;
    }
  }

  function formatDate(dateString: string | null) {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleString();
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
      <span class="current">Story</span>
    </nav>

    <!-- Header -->
    <div class="page-header">
      <div class="header-content">
        <div>
          <h1>Investment Story</h1>
          <p class="ticker-label">{ticker}</p>
          {#if companyName}
            <p class="company-name">{companyName}</p>
          {/if}
        </div>
        {#if !isLoading}
          <button
            class="save-btn"
            class:saving={isSaving}
            on:click={handleSave}
            disabled={isSaving}
          >
            {#if isSaving}
              Saving...
            {:else}
              💾 Save Story
            {/if}
          </button>
        {/if}
      </div>
      {#if lastEdited}
        <p class="last-edited">Last edited: {formatDate(lastEdited)}</p>
      {/if}
    </div>

    <!-- Messages -->
    {#if errorMessage}
      <div class="message error-message">
        ⚠️ {errorMessage}
      </div>
    {/if}

    {#if successMessage}
      <div class="message success-message">
        ✓ {successMessage}
      </div>
    {/if}

    {#if isLoading}
      <div class="loading-card">
        <div class="spinner"></div>
        <p>Loading story...</p>
      </div>
    {:else}
      <!-- Story Sections -->
      <div class="story-sections">
        {#each sections as section}
          <div class="section-card">
            <div class="section-header">
              <span class="section-icon">{section.icon}</span>
              <h2>{section.title}</h2>
            </div>
            <textarea
              bind:value={content.sections[section.key]}
              placeholder={section.placeholder}
              rows="8"
            ></textarea>
          </div>
        {/each}
      </div>

      <!-- Bottom Save Button -->
      <div class="bottom-actions">
        <button
          class="save-btn primary"
          class:saving={isSaving}
          on:click={handleSave}
          disabled={isSaving}
        >
          {#if isSaving}
            Saving...
          {:else}
            💾 Save Story
          {/if}
        </button>
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

  .header-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 0.5rem;
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

  .company-name {
    color: var(--text-secondary);
    font-size: 1rem;
    margin-top: 0.25rem;
  }

  .last-edited {
    color: var(--text-tertiary);
    font-size: 0.9rem;
    font-style: italic;
  }

  /* Save Button */
  .save-btn {
    background: var(--accent-primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: var(--border-radius);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .save-btn:hover:not(:disabled) {
    background: var(--accent-primary-hover);
    transform: translateY(-2px);
    box-shadow: var(--shadow-md);
  }

  .save-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .save-btn.primary {
    padding: 1rem 2rem;
    font-size: 1.1rem;
  }

  /* Messages */
  .message {
    padding: 1rem 1.5rem;
    border-radius: var(--border-radius);
    margin-bottom: 1.5rem;
    font-weight: 500;
  }

  .error-message {
    background: #fee;
    color: #c33;
    border: 1px solid #fcc;
  }

  .success-message {
    background: #efe;
    color: #3a3;
    border: 1px solid #cfc;
  }

  /* Loading */
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
    to {
      transform: rotate(360deg);
    }
  }

  .loading-card p {
    color: var(--text-secondary);
  }

  /* Story Sections */
  .story-sections {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 2rem;
  }

  .section-card {
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: var(--border-radius);
    padding: 1.5rem;
    box-shadow: var(--shadow-sm);
  }

  .section-header {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-bottom: 1rem;
  }

  .section-icon {
    font-size: 1.5rem;
  }

  .section-card h2 {
    color: var(--text-primary);
    font-size: 1.25rem;
    margin: 0;
  }

  textarea {
    width: 100%;
    min-height: 150px;
    padding: 1rem;
    border: 2px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--bg-secondary);
    color: var(--text-primary);
    font-family: inherit;
    font-size: 1rem;
    line-height: 1.6;
    resize: vertical;
    transition: border-color 0.2s;
  }

  textarea:focus {
    outline: none;
    border-color: var(--accent-primary);
  }

  textarea::placeholder {
    color: var(--text-tertiary);
  }

  /* Bottom Actions */
  .bottom-actions {
    display: flex;
    justify-content: center;
    padding: 2rem 0;
  }

  /* Responsive */
  @media (max-width: 768px) {
    .header-content {
      flex-direction: column;
      gap: 1rem;
    }

    .save-btn {
      width: 100%;
    }
  }
</style>
