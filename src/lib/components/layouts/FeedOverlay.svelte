<script>
  import MobileFilters from "$lib/components/MobileFilters.svelte";
  import Feed from "$lib/components/Feed.svelte";
  import IdentityFilters from "$lib/components/IdentityFilters.svelte";  
  import GeneralFilters from "$lib/components/GeneralFilters.svelte";

  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import * as feedStores from "$lib/stores/feed.js";

  let current, styles;
  const Render = State.make();
  Render.cleanup = () => {
    current = "home";
    styles = {
      display: "none",
    };
  };


  const Handle = {};
  Handle.command = async ( event ) => {
    switch ( event.name ) {
      case "refresh":
      case "ready":
        break; // no-ops
      case "hide":
        styles.display = "none";
        break;
      case "show":
        styles.display = "flex";
        break;
      default:
        console.warn("unrecognized feed command", event);
    }
  };

 
  Render.reset();
  onMount(() => {
    Render.listen( feedStores.command, Handle.command );
    return () => {
      Render.reset();
    }
  });
</script>


<div class="panels" style:display={styles.display}>
  <div class="left-nav"></div>

  <aside>
    <div class="aside-internal">
      <IdentityFilters></IdentityFilters>
      <GeneralFilters></GeneralFilters>
    </div>
  </aside>

  <main class="main">
    <MobileFilters></MobileFilters>
    <Feed></Feed>
  </main>
</div>


<style>
  .panels {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    flex: 1 1 0%;
    min-height: 0;
    margin: 0;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: stretch;
  }

  main {
    order: 2;
    flex: 0 1 calc( var(--gobo-max-width-primary) + (2 * var(--gobo-width-spacer-flex)) );
    margin: 0;
    padding: 0;
    max-width: calc( var(--gobo-max-width-primary) + (2 * var(--gobo-width-spacer-flex)) );
    overflow: hidden;
  }

  .left-nav {
    order: 1;
    z-index: -1;
    display: none;
  }

  @media ( min-width: 680px ) {
    .panels {
      top: 5rem;
    }
    .left-nav {
      display: inline-flex;
      width: 6.3125rem; /* Careful here, this needs to mimic left nav */
      height: 100%;
    }
  }

  @media ( min-width: 1300px ) {
    .left-nav {
      width: 16.125rem; /* Careful here, this needs to mimic left nav */
    }
  }

  @media ( max-width: 680px ) {
    main {
      padding-left: 0;
      padding-right: 0;
    }
  }

  aside {
    order: 3;
    display: none;
  }

  .aside-internal {
    max-height: calc(100dvh - 4rem);
    overflow-y: scroll;
  }

  @media ( min-width: 988px ) {
    aside {
      display: flex;
      flex-direction: column;
      flex: 1 0 auto;
      margin-top: var(--gobo-height-spacer);
      margin-right: var(--gobo-width-spacer);
    }
  }
</style>