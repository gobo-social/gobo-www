<script>
  import LandingHeader from "$lib/components/headers/LandingHeader.svelte";
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte";
</script>

<div class="landing-outer">
  <LandingHeader />

  <main class="landing">
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
  </main>

  <PlainFooter />
</div>


<style>
  main {
    margin-bottom: 0;
  }

  #outseta-signup {
    width: 100%;
  }

  .outseta-embed-reshape {
    width: 100%;
    max-width: 500px;
    margin-top: var(--gobo-height-spacer);
    margin-bottom: 3rem;
    padding-bottom: 1rem;
    background: var(--gobo-color-panel);
    border-radius: 0;
    border: var(--gobo-border-panel);
  }

  @media (min-width: 500px) {
    .outseta-embed-reshape {
      border-radius: var(--gobo-border-radius);
    }
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
</style>
