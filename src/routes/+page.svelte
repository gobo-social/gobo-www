<script>
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte"
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import sectionAText from "./section-a.md?raw";
  import sectionB1Text from "./section-b1.md?raw";
  import sectionB2Text from "./section-b2.md?raw";
  import sectionB3Text from "./section-b3.md?raw";
  import { toHTML } from "$lib/helpers/internal-markdown.js";

  const sectionA = toHTML( sectionAText );
  const sectionB1 = toHTML( sectionB1Text );
  const sectionB2 = toHTML( sectionB2Text );
  const sectionB3 = toHTML( sectionB3Text );
</script>


<div class="outer">
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
          Login
        </sl-button>
      
        <sl-button
          class="submit"
          pill
          href="/signup">
          Signup
        </sl-button>
      </div>
    </nav>
  </header>
  
  
  <main>
    <div id="pseudo-header"></div>
    
    <section id='hero'>
      <h1>Hero Title Goes Here</h1>
    </section>
  
    <section id="supported-platforms">
      <h2>Supported Platforms</h2>
      <div id="platforms">
        <img src="/images/logomark-bluesky.png" alt="Bluesky"/>
        <img src="/images/logomark-linkedin.png" alt="LinkedIn"/>
        <img src="/images/logomark-mastodon.png" alt="Mastodon"/>
        <img src="/images/logomark-reddit.png" alt="Reddit"/>
        <img src="/images/logomark-smalltown.png" alt="Smalltown"/>
      </div>
    </section>
  
    <section id="section-a">
      <div class='inner'>
        {@html sectionA}
      </div>
    </section>

    <section id="section-b">
      <h2>The last email platform you'll migrate to.</h2>
        <div class="flex-columns">
          <div class="flex-column">
            <img src="/images/gobo-media-fallback.png">
            {@html sectionB1}
          </div>
          <div class="flex-column">
            <img src="/images/gobo-media-fallback.png">
            {@html sectionB2}
          </div>
          <div class="flex-column">
            <img src="/images/gobo-media-fallback.png">
            {@html sectionB3}
          </div>
        </div>
    </section>

    <section id="section-c">
      <div class="inner">
        <h2>Ready for a better newsletter?</h2>
        <p>See why thousands of businesses and creators use Buttondown to send millions of emails every day.</p>
  
        <sl-button
          class="action"
          pill
          href="/signup"
        >
          Build Your Newsletter
        </sl-button>
      </div>
    </section>
  </main>
  <PlainFooter></PlainFooter>
</div>





<style>
  .outer {
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    background: var(--gobo-color-panel);
  }

  header {
    display: flex;
    justify-content: center;
    align-items: center;
    position: fixed;
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
    max-width: 72rem;
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

  main {
    flex: 0 0 auto;
    min-height: 0;
    max-width: 100vw;
    margin: 0;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    overflow-y: scroll;
  }

  section {
    flex: 1 1 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0.5rem;
    font-family: "Open Sans";
  }

  /* @media ( min-width: 680px ) {
    main {
      margin: 0 1rem 1rem 1rem;
    }
  } */

  section :is(h1, h2, h3, h4, h5, h6) {
    font-family: "Roboto";
  }

  section :global(h1) {
    font-family: "Roboto";
    font-size: 72px;
    font-weight: 900;
    text-align: center;
    padding-bottom: 9.6px;
    margin-bottom: 1rem;
    margin-top: 3rem;
  }

  @media ( min-width: 680px ) {
    section :global(h1) {
      font-size: 96px;
    }
  }

  section :global(h2) {
    font-family: "Roboto";
    font-size: 48px;
    font-weight: 900;
    padding-bottom: 9.6px;
    margin-top: 80px;
    margin-bottom: 80px;
    text-align: center;
  }
  
  @media ( min-width: 680px ) {
    section :global(h1) {
      font-size: 60px;
    }
  }

  section :global(h3) {
    font-family: "Roboto";
    font-size: 24px;
    font-weight: 900;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  section :global(p.big) {
    font-size: 24px;
    line-height: 32px;
    margin-top: 0;
    margin-bottom: 40px;
  }

  section :global(p) {
    font-size: 20px;
    line-height: 32px;
    margin-top: 0;
    margin-bottom: 40px;
  }

  

  .inner {
    max-width: 40rem;
  }

  #pseudo-header {
    width: 100%;
    min-height: 4.5rem;
    background: var(--gobo-color-panel);
    flex: 0 0 auto;
  }

  #pricing-link {
    color: var(--gobo-color-text);
    font-weight: 900;
  }

  #hero {
    width: 100%;
    position: relative;
    background-size: cover;
    background-position: center top;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #platforms {
    width: 100%;
    max-width: 40rem;
    padding: 2rem 0.5rem;
    background: white;
    border: var(--gobo-border-panel);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }

  #platforms img {
    flex: 1 1 50%;
    object-fit: contain;
    object-position: center center;
    background: white;
    border-radius: 0.5rem;
    max-width: 10rem;
  }

  @media ( min-width: 680px ) {
    #platforms {
      border-radius: var(--gobo-border-radius);
    }
  }


  #section-b {
    width: 100%;
    padding-inline: 3rem;
  }

  #section-b h2 {
    max-width: 40rem;
    text-align: center;
  }

  .flex-columns {
    display: flex;
    flex-wrap: wrap;
    gap: 2rem;
  }

  .flex-column {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
  }

  #section-c .inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 5rem;
  }

  section .inner {
    margin-inline: 0.5rem;
  }

  @media ( min-width: 680px ) {
    section .inner {
      margin-inline: 0;
    }
  }

  @media ( min-width: 900px ) {
    .flex-columns {
      flex-wrap: nowrap;
    }
    .flex-columns {
      flex: 1 1 33%;
    }
  }
</style>