<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte";
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
      <p>By signing up, you agree to Gobo's
        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer nofollow">
          Terms&nbsp;of&nbsp;Service
        </a> and 
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer nofollow">
          Privacy&nbsp;Policy.
        </a>
      </p>
      <p>Already have a Gobo account? <a href="/login"> Log in </a></p>
    </section>
  </section>
  
  <div class="vertical-spacer"></div>
  <PlainFooter></PlainFooter>
</Center>

<style>
  #outseta-signup {
    width: 100%;
  }

  .outseta-embed-reshape {
    width: 100%;
    max-width: 500px;
    margin-top: var(--gobo-height-spacer);
    background: var(--gobo-color-panel);
    border-radius: var(--gobo-border-radius);
    border: var(--gobo-border-panel);
  }

  .alt-nav {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 1rem;
    font-size: 15px;
    margin-block-start: 4rem;
    margin-inline: 2rem;
    padding-block: 1rem;
    border-top: 1px solid var(--gobo-color-text);
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

  /* TODO: This is hacky, but we need to rework the page layout stuff. */
  .vertical-spacer {
    flex: 1 1 100%;
    min-height: 1rem;
  }
</style>
