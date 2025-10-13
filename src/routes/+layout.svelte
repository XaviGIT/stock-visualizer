<script lang="ts">
  import "../app-earthy.css";
  import { theme } from "$lib/stores/theme";
  import { onMount } from "svelte";

  // Initialize theme immediately when the layout mounts
  onMount(() => {
    theme.init();
  });
</script>

<slot />
