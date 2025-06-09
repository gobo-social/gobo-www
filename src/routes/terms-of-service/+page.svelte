<script>
  import LandingHeader from "$lib/components/headers/LandingHeader.svelte";
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte";
  import { toHTML } from "$lib/helpers/internal-markdown.js";
  import text from "./text.md?raw";

  let content = toHTML(text);
</script>

<div class="landing-outer">
  <LandingHeader />
  
  <main class="landing">
    <section class="landing-longform">
      {@html content}        
    </section>
  </main>

  <PlainFooter />
</div>

<style>
  main {
    background: var(--gobo-color-panel);
    padding-top: var(--gobo-height-spacer);
  }
</style>