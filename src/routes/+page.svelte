<script>
  import LandingHeader from "$lib/components/headers/LandingHeader.svelte";
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


<div class="landing-outer">
  <LandingHeader />
  
  <main class="landing landing-copy">
    <section id="hero">
      <h1>Social media software for people like you.</h1>
      <p class="big">
        Folks just like you are switching to Gobo because it's a nicer, 
        simpler way to manage cross-posting to your audiences.
      </p>
    </section>
  
    <section id="supported-platforms">
      
      <div id="platforms">
        <img src="/images/logo-linkedin.png" alt="linkedIn"/>
        <img src="/images/logo-x.png" alt="x"/>
        <img src="/images/logo-bluesky.png" alt="bluesky"/>
        <img src="/images/logo-threads.png" alt="threads"/>
        <img src="/images/logo-mastodon.png" alt="mastodon"/>
        <img src="/images/logo-reddit.png" alt="reddit"/>
      </div>

      <sl-button
          class="submit"
          href="/signup"
          size="large"
          pill
        >
          Get Started For Free
      </sl-button>
      
      <p>No credit card required. Cancel anytime.</p>
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
  
  <PlainFooter />
</div>





<style>
  .landing-outer {
    background: var(--gobo-color-panel);
  }

  .inner {
    max-width: 40rem;
  }

  #hero {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  #hero h1 {
    max-width: 50rem;
    margin: 0;
  }

  #hero p {
    max-width: 30rem;
    margin: 0;
    margin-top: 1rem;
  }

  #supported-platforms sl-button::part(label) {
    font-weight: 900;
  }

  #supported-platforms p {
    font-size: 16px;
    margin: 0;
    margin-top: 1rem;
  }

  #platforms {
    padding: 1rem;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }

  #platforms img {
    flex: 1 1 50%;
    object-fit: contain;
    object-position: center center;
    border-radius: 0.75rem;
    max-width: 3rem;
  }

  @media ( min-width: 680px ) {
    #platforms {
      border-radius: var(--gobo-border-radius);
    }
  }

  #section-a {
    margin-top: 5rem;
  }

  #section-a .inner {
    max-width: 42rem;
    padding: 1rem 1.5rem;
    margin: 0 -1.5rem;
    background: var(--gobo-color-null);
    border: var(--gobo-border-panel);
    border-radius: 0;
  }

  @media (min-width: 42rem) {
    #section-a .inner {
      border-radius: var(--gobo-border-radius);
      margin: 0;
    }
  }

  #section-a .inner :global(h2) {
    font-size: 32px;
    text-align: center;
    margin: 1rem 0;
  }


  #section-b {
    width: 100%;
    padding-inline: 0;
  }

  #section-b h2 {
    max-width: 40rem;
    text-align: center;
  }

  .flex-columns {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem 0.5rem;
  }

  .flex-column {
    flex: 1 1 100%;
    display: flex;
    flex-direction: column;
    padding: 1.5rem;
    background: var(--gobo-color-null);
    border-radius: 0;
  }

  @media (min-width: 900px) {
    #section-b {
      padding-inline: 3rem;
    }
    .flex-columns {
      flex-wrap: nowrap;
    }
    .flex-column {
      border-radius: var(--gobo-border-radius);
      padding: 1rem;
    }
  }    

  #section-c {
    margin-top: 5rem;
  }

  #section-c h2 {
    margin: 0;
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

</style>