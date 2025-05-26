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
      id="outseta-login"
      data-o-auth="1"
      data-mode="embed"
      data-widget-mode="login">
    </div>

    <section class="alt-nav">
      <p>New to Gobo? <a href="/signup"> Create an Account </a></p>
    </section>
  </section>

  <div class="vertical-spacer"></div>
  <PlainFooter></PlainFooter>
</Center>

<style>
  #outseta-login {
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

  /* TODO: This is hacky, but we need to rework the page layout stuff. */
  .vertical-spacer {
    flex: 1 1 100%;
    min-height: 1rem;
  }


  /* header {
    flex-direction: row;
    flex-wrap: nowrap;
    background: var(--gobo-color-panel);
    color: var(--gobo-color-text);
    border-bottom: var(--gobo-border-panel);
    height: 4.625rem;
  }


  header > nav {
    flex: 1 1 100%;
    margin: 0;
    display: flex;
    flex-direction: row;
    align-items: center;
  }

  header > nav > .logo {
    font-family: var(--sl-font-sans);
    font-size: var(--sl-font-size-2x-large);
    text-decoration: none;
    color: initial;
    padding: 1rem; 
    flex: 0 0 auto;
  } */

</style>
