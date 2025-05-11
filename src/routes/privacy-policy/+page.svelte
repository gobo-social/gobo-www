<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
  import { toHTML } from "$lib/helpers/internal-markdown.js";
  import text from "./text.md?raw";

  let content = toHTML(text);
</script>

<PlainHeader></PlainHeader>
<Center>
  <div class="main-child">
    <section class="gobo-copy">
      {@html content}        
    </section>
  </div>
</Center>


<style>
  .gobo-copy {
    margin-top: var(--gobo-height-spacer);
  }
</style>