<script>
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/icon-button/icon-button.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import FilterGroup from "$lib/components/GeneralFilterMiniGroup.svelte";
</script>


<section class="outer-frame">

  <header>
    <a class="header-link" href="/settings/filters" >
      <sl-icon src="/icons/filter.svg" />
      <h2>Filters</h2>
      <sl-icon src="/icons/arrow-right.svg"/>
    </a>
  </header>

  
  <section class="inner-frame">
    
    <h3>Block Keyword</h3>
    <FilterGroup category="block-keyword">
    </FilterGroup>

    <h3>Block Username</h3>
    <FilterGroup category="block-username">
    </FilterGroup>

    <h3>Block Domain</h3>
    <FilterGroup category="block-domain">
    </FilterGroup>

  </section>

</section>

<style>
  .outer-frame {
    background: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    border-radius: var(--gobo-border-radius);
    width: 20rem;
    margin-bottom: var(--gobo-height-spacer);
  }

  header {
    width: 100%;
    padding: 0.25rem calc(var(--gobo-width-spacer) - 0.5rem);
    border-bottom: var(--gobo-border-panel);
    margin-bottom: var(--gobo-height-spacer-flex);
  }

  header a {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0.5rem;
    color: inherit;
  }

  header sl-icon {
    font-size: 1.5rem;
  }

  header h2 {
    flex: 1 1 100%;
    font-weight: var(--gobo-font-weight-black);
    font-size: 1.25rem;
    text-transform: capitalize;
  }

  header sl-icon-button {
    color: var(--gobo-color-text);
  }

  h3 {
    text-transform: capitalize;
    margin: 0;
    margin-top: 2rem;
  }

  h3:first-child {
    margin: 0;
  }

  .inner-frame {
    margin: var(--gobo-height-spacer-flex) var(--gobo-width-spacer-flex);
  }
</style>
