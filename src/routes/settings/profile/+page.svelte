<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import "$lib/styles/buttons.css";
  import { onMount } from "svelte";
  import { State } from "$lib/engines/store.js";
  import { Profile } from "$lib/engines/profile.js";
  import { profileStore } from "$lib/stores/profile";

  let form, button, nameInput;
  const Render = State.make();
  Render.cleanup = () => {
  };

  Render.profile = ( profile ) => {
    nameInput.value = profile.name ?? "";
  };

  const Handle = {};

  Handle.isValid = () => {
    return form.reportValidity();  
  };

  Handle.submit = async ( event ) => {
    event.preventDefault();
    if ( button.loading === true ) {
      return;
    }

    button.loading = true;
    if ( Handle.isValid() ) {
      const formData = new FormData( form );
      const data = {
        name: formData.get( "name" ),
      };
      await Profile.update( data );
    }

    button.loading = false;
  };

  onMount( function () {
    Render.listen( profileStore, Render.profile );
    return () => {
      Render.reset();
    }
  });
</script>

<div class="main-child">
  <BackLink heading="Profile"></BackLink>

  <form 
    bind:this={form} 
    on:submit={Handle.submit} 
    class="gobo-form">
    
    <sl-input
      bind:this={nameInput}
      name="name" 
      label="Profile Name"
      inputmode="text"
      autocomplete="off"
      maxlength=32
      size="medium">
    </sl-input>

    <div class="buttons">
      <sl-button
        bind:this={button}
        class="submit"
        type="submit"
        variant="primary"
        size="medium"
        pill>
        Update Profile
      </sl-button>
    </div>
   
  </form>

</div>


<style>
  sl-input {
    margin-bottom: 0;
  }
</style>