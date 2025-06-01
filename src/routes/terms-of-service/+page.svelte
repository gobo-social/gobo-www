<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import { toHTML } from "$lib/helpers/internal-markdown.js";
  import text from "./text.md?raw";

  let content = toHTML(text);
</script>

<PlainHeader></PlainHeader>
<main class="center">
  <div class="main-child">
    <section class="gobo-copy-special">
      {@html content}        
    </section>
  </div>
</main>


<style>
  .gobo-copy-special {
    margin-top: var(--gobo-height-spacer);
  }
</style>