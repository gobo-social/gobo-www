<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
</script>

<PlainHeader></PlainHeader>
<Center>
  <section class="outseta-embed-reshape">
    <header class="outseta-logo-header">
      <img src="/images/gobo-logo.svg" />
    </header>

    <div
      id="outseta-signup"
      data-o-auth="1"
      data-widget-mode="register"
      data-plan-family-uid="L9nENZQZ"
      data-skip-plan-options="true"
      data-mode="embed">
    </div>

    <section class="alt-nav">
      <p>Already have an account? <a href="/login"> Log in </a></p>
    </section>
  </section>
  
</Center>

<style>
  #outseta-signup {
    width: 100%;
  }

  .outseta-embed-reshape {
    width: 100%;
    max-width: 500px;
    margin-top: var(--gobo-height-spacer);
    padding-bottom: 3rem;
    background: var(--gobo-color-panel);
    border-radius: var(--gobo-border-radius);
    border: var(--gobo-border-panel);
  }

  .alt-nav {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-top: var(--gobo-height-spacer);
    font-size: 15px;
  }

  .alt-nav a {
    font-weight: var(--gobo-font-weight-black);
  }

  .outseta-logo-header {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 2rem;
  }
</style>
