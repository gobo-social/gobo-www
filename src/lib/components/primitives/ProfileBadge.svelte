<script>
  import { State } from "$lib/engines/store.js";
  import { profileStore } from "$lib/stores/profile";
  import { onMount } from "svelte";
  
  let name;
  const Render = State.make();
  Render.cleanup = () => {
    name = "";
  };

  Render.profile = ( profile ) => {
    name = profile.name ?? "";
  };

  onMount( function () {
    Render.listen( profileStore, Render.profile );
    return () => {
      Render.reset();
    };
  });
</script>

<nav>
  <sl-button
    href="/settings"
    pill>
    {name}
  </sl-button>
</nav>

<style>
  nav {
    margin-right: 3.5rem;
  }
  
  nav sl-button::part(base) {
    height: 2.1875rem;
    background-color: var(--gobo-color-panel);
    border: var(--gobo-border-panel);
    color: var(--gobo-color-button-lens);
  }

  nav sl-button::part(label) {
    font-size: var(--gobo-font-size-detail);
    font-weight: var(--gobo-font-weight-medium);
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

</style>
