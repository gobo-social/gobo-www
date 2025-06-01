<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte";
</script>

<PlainHeader></PlainHeader>
  
<div class="outer">
  <main>
    <h1>Pricing</h1>

    <p> Start for free. Upgrade for the fancy stuff.</p>
  
    <div id="section-list">
      <section class="card">
        <h2>Plan 1</h2>
  
        <p class="description">The description for the plan goes here</p>
  
        <p class="price">
          <span>$10</span>
          <span>/</span>
          <span>month</span>
        </p>
  
        <sl-button class="action" pill>Action Statement Here</sl-button>
  
        <ul>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 1</span>
          </li>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 2</span>
          </li>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 3</span>
          </li>
        </ul>
      </section>
  
  
      <section class="card">
        <h2>Plan 2</h2>
  
        <p class="description">The description for the plan goes here</p>
  
        <p class="price">
          <span>$10</span>
          <span>/</span>
          <span>month</span>
        </p>
  
        <sl-button class="action" pill>Action Statement Here</sl-button>
  
        <ul>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 1</span>
          </li>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 2</span>
          </li>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 3</span>
          </li>
        </ul>
      </section>
  
  
      <section class="card">
        <h2>Plan 3</h2>
  
        <p class="description">The description for the plan goes here</p>
  
        <p class="price">
          <span>$10</span>
          <span>/</span>
          <span>month</span>
        </p>
  
        <sl-button class="action" pill>Action Statement Here</sl-button>
  
        <ul>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 1</span>
          </li>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 2</span>
          </li>
          <li>
            <sl-icon src="/icons/check2-circle.svg"/> 
            <span>Feature 3</span>
          </li>
        </ul>
      </section>
    
    
    </div>
  </main>

  <PlainFooter></PlainFooter>
</div>


<style>
  .outer {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow-y: scroll;
  }

  main {
    padding-bottom: 3rem;
  }

  h1 {
    text-align: center;
  }

  main > p {
    text-align: center;
  }

  h1 {
    font-family: "Roboto";
    font-size: 72px;
    font-weight: 900;
    padding-bottom: 9.6px;
    margin-bottom: 1rem;
    margin-top: 2.5rem;
  }

  h2 {
    font-family: "Roboto";
    font-size: 60px;
    font-weight: 900;
    padding-bottom: 9.6px;
    margin-top: 80px;
    margin-bottom: 80px;
  }

  h3 {
    font-family: "Roboto";
    font-size: 24px;
    font-weight: 900;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  p {
    font-size: 20px;
    line-height: 32px;
    margin-top: 0;
    margin-bottom: 40px;
  }

  .vertical-spacer {
    flex: 1 1 100%;
    min-height: 1rem;
  }

  sl-button::part(label) {
    padding-inline: 12px;
  }

  #section-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 2rem;
  }

  .card {
    background: var(--gobo-color-panel);
    border: var(--gobo-panel-border);
    border-radius: var(--gobo-border-radius);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 25rem;
  }

  .card h2 {
    font-size: 36px;
    margin: 0;
  }

  .card p {
    margin: 0;
    font-size: 20px;
  }

  .card p :first-child {
    font-size: 40px;
    font-weight: 900;
  }

  .card .description {
    height: 4rem;
  }

  .card sl-button {
    margin-top: 2rem;
  }

  .card ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style-type: none;
    padding: 0;
    margin-top: 2rem;
  }

  .card ul li {
    display: flex;
    gap: 1rem;
  }

</style>
