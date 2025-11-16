<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte"
  import CenterAlt from "$lib/components/layouts/CenterAlt.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import { goto } from "$app/navigation";
</script>

<PlainHeader></PlainHeader>
<CenterAlt>
  <section>
    <h1>All your (open) social media in one&nbsp;place</h1>
    <section class="buttons gobo-copy">
      <p>Gobo is temporarily paused while we work on a major upgrade. We're grateful to folks who have participated in our beta, and we're excited to show you what we're working on.</p> 
      <p>In the meantime, don't hesitate to reach out if you have any questions, <a href="mailto:support@gobo.social">support@gobo.social</a></p>
      <p>See you soon!</p>
    </section>
  </section>
</CenterAlt>
<PlainFooter></PlainFooter>




<style>
  h1 {
    text-align: center;
    text-transform: capitalize;
  }

  .buttons {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: center;
    gap: 1rem;
    align-items: center;
    margin-top: 2rem;
  }

  .buttons p {
    font-size: 1.15rem;
  }
</style>