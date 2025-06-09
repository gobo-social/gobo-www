<div id="pseudo-header"></div>

<header>
  <nav>
    <a class="logo" href="/">
      <img src="/images/gobo-logo.svg" alt="Main logo for the Gobo application">
    </a>
  
    <div class="buttons">
      <a id="pricing-link"
        class="action"
        pill
        href="/pricing">
        Pricing
      </a>
    
      <sl-button
        class="neutral"
        pill
        href="/login">
        Log in
      </sl-button>
    
      <sl-button
        class="submit"
        pill
        href="/signup">
        Sign up
      </sl-button>
    </div>
  </nav>
</header>

<style>
  #pseudo-header {
    position: relative;
    width: 100%;
    min-height: 4.5rem;
    background: var(--gobo-color-panel);
    flex: 0 0 auto;
  }

  header {
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    right: 0;
    backdrop-filter: blur(16px);
    height: 4.5rem;
    padding: 1rem;
    z-index: 10;
  }

  header > nav {
    margin: 0;
    padding: 0;
    flex: 1 0 auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    color: var(--gobo-color-text);
  }

  header nav a:has(img) {
    min-height: 3rem;
    min-width: 3rem;
  }

  header > nav .buttons {
    flex: 1 1 100%;
    height: 100%;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
  }

  @media ( min-width: 680px ) {
    header > nav .buttons {
      gap: 2rem;
    }
  }

  #pricing-link {
    color: var(--gobo-color-text);
    font-weight: 900;
  }
</style>