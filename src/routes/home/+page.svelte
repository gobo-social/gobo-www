<script>
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import '@shoelace-style/shoelace/dist/components/badge/badge.js';
  import MobileFilters from "$lib/components/MobileFilters.svelte";
  import { onMount } from "svelte";
  import { Draft } from "$lib/engines/draft.js";
  import { Feed } from "$lib/engines/feed/index.js";
  // As a temporary measure, we reset the draft when we go home. This keeps
  // us from resetting on all navigations, like the image pages.
  onMount(() => {
    Feed.show();
    Draft.clear();

    return () => {
      Feed.hide();
    };
  });
</script>
