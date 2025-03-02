<script>
  import Spinner from "$lib/components/primitives/Spinner.svelte";
  import Delivery from "$lib/components/delivery/Delivery.svelte";

  import { onMount, tick } from "svelte";
  import { Feed } from "$lib/engines/delivery/index.js";
  import { State } from "$lib/engines/store.js";
  import { Scroll } from "$lib/engines/scroll.js";
  import { NavCommands } from '$lib/channels/nav-commands.js';
  import * as deliveryStores from "$lib/stores/delivery.js";

  let _feed;
  let deliveries, state, scroll;
  const Render = State.make();
  Render.cleanup = () => {
    deliveries = [];
    state = "loading";
    scroll = undefined;
  };


  Render.feed = async ( feed ) => {
    deliveries = feed.deliveries;
    Render.state();
    Render.scroll( feed );
  };

  Render.state = () => {    
    if ( deliveries.length === 0 ) {
      state = "empty";
    } else {
      state = "ready";
    }
  };

  Render.scroll = async ( feed ) => {
    await tick();
    scroll.listen();
  };


  const Handle = {};
  Handle.command = async ( event ) => {
    switch ( event.name ) {
      case "refresh":
        state = "loading";
        scroll.wait();
        await Feed.pull( 25 );
        Feed.command( "ready" );
        break;
      case "ready":
        break; // no-op
      default:
        console.warn( "unrecognized delivery feed command", event );
    }
  };

  Handle.scroll = ( event ) => {
    scroll.event( event );
  };

  Handle.infiniteScroll = ( event ) => {
    Feed.pull( 25 );
  };

  Handle.commandNav = ( event ) => {
    if (window.location.pathname !== "/posts") {
      return;
    }
    if ( event.detail.name === "scroll top" ) {
      _feed.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
    if ( event.detail.name === "scroll bottom" ) {
      _feed.scrollTo({
        top: _feed.scrollHeight,
        left: 0,
        behavior: "smooth"
      });
    }
  };


  Render.reset();
  onMount(() => {
    scroll = Scroll.make({ element: _feed });
    Render.listen( deliveryStores.feed, Render.feed );
    Render.listen( deliveryStores.command, Handle.command );
    _feed.addEventListener( "scroll", Handle.scroll );
    _feed.addEventListener( "gobo-infinite-scroll", Handle.infiniteScroll );
    const navCommandsTarget = NavCommands.listen( Handle.commandNav );
    return () => {
      NavCommands.stop( navCommandsTarget );
      _feed.removeEventListener( "scroll", Handle.scroll );
      _feed.removeEventListener( "gobo-infinite-scroll", Handle.infiniteScroll );
      scroll.halt();
      Render.reset();
    }
  });
</script>

<section class="feed" bind:this={_feed}>
  {#if state === "loading"}
    <Spinner></Spinner>

  {:else if state === "empty"}
    <section class="gobo-copy">
      <p>
        No published posts to display.
      </p> 
    </section>
  
  {:else if state === "ready"}
    {#each deliveries as { delivery, key }, index (key) }
      <Delivery {delivery} />
    {/each}
  
  {:else}
    <section class="gobo-copy">
      <p>
        There was a problem displaying this feed.
      </p> 
    </section>
  
  {/if}
</section>

<style>
  section.feed {
    flex-grow: 1;
    overflow-y: scroll;
    max-height: calc(100dvh - 7.5rem);
  }

  @media( min-width: 680px ) {
    section.feed {
      padding: var(--gobo-height-spacer) var(--gobo-width-spacer) 5rem var(--gobo-width-spacer); 
    }
  }

  @media ( max-width: 680px ) {
    section.feed {
      padding: var(--gobo-height-spacer) 0 5rem 0;
    }
    .gobo-copy {
      margin-left: var(--gobo-width-spacer-flex);
      margin-right: var(--gobo-width-spacer-flex);
    }
  }
</style>