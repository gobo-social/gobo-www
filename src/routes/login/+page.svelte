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
        id="outseta-login"
        data-o-auth="1"
        data-mode="embed"
        data-widget-mode="login">
      </div>
  
      <section class="alt-nav">
        <p>New to Gobo? <a href="/signup"> Create an Account </a></p>
      </section>
    </section>
  </main>

  <PlainFooter />
</div>


<style>
  main {
    margin-bottom: 0;
  }

  #outseta-login {
    width: 100%;
  }

  .outseta-embed-reshape {
    width: 100%;
    max-width: 500px;
    margin-top: var(--gobo-height-spacer);
    padding-bottom: 1rem;
    margin-bottom: 3rem;
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
  }

  @media (min-width: 500px) {
    .outseta-embed-reshape {
      border-radius: var(--gobo-border-radius);
    }
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
