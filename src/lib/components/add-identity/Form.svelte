<script>
  import "@shoelace-style/shoelace/dist/components/button/button.js";
  import "@shoelace-style/shoelace/dist/components/input/input.js";
  import "@shoelace-style/shoelace/dist/components/icon/icon.js";
  import "@shoelace-style/shoelace/dist/components/select/select.js";
  import "@shoelace-style/shoelace/dist/components/option/option.js";
  import "@shoelace-style/shoelace/dist/components/divider/divider.js";
  import "@shoelace-style/shoelace/dist/components/alert/alert.js";
  import { onMount } from "svelte";
  import { replaceState } from "$app/navigation";
  import { State } from "$lib/engines/store.js";
  import { Onboard } from "$lib/engines/onboarding.js";
  import * as identityStores from "$lib/stores/identity.js";

  let form, button, inputs;
  let state, platform;
  const Render = State.make();
  Render.cleanup = () => {
    state = "ready";
    platform = "bluesky";
    inputs = {};
  };

  const Inputs = {};

  Inputs.alert = ( name, message ) => {
    inputs[ name ].setCustomValidity( message );
  };

  Inputs.reset = ( name ) => {
    inputs[ name ].setCustomValidity( "" );
  };

  Inputs.resetAll = () => {
    for ( const key of inputs ) {
      Inputs.reset( key );
    }
  };


  const Validate = {};

  Validate.clear = ( event ) => {
    event.target.setCustomValidity( "" );
  };

  Validate.context = () => {
    const data = new FormData( form );
    const context = { platform };
    for ( const [ key, value ] of data.entries() ) {
      context[ key ] = value;
    }
    return context;
  };

  Validate.url = ( value ) => {
    if ( /^http(s):\/\//.test(value) === false ) {
      value = "https://" + value;
    }
    
    try {
      return new URL( value );
    } catch ( error ) {
      console.warn( error );
      return;
    }
  };

  Validate.bluesky = () => {
    const context = Validate.context();
    context.baseURL = "https://bsky.app";
    
    let login = context.blueskyLogin;
    if ( !login ) {
      Inputs.alert( "blueskyLogin", "Please provide a Bluesky username." );
      return;
    }
    
    if ( login.startsWith("@") ) {
      login = login.slice(1);
      context.blueskyLogin = login;
    }
    
    if ( login.length < 1 ) {
      Inputs.alert( "blueskyLogin", "This is an invalid Bluesky username." );
      return;
    }

    if ( login.startsWith( "." )) {
      Inputs.alert( "blueskyLogin", "This is an invalid Bluesky username." );
      return;
    }

    // Be forgiving for underspecified names. Assume main Bluesky instance.
    if ( !/\./.test( login )) {
      login = `${login}.bsky.social`;
      context.blueskyLogin = login;
    }

    if ( !context.blueskySecret ) {
      Inputs.alert( "blueskySecret", "Please provide a Bluesky secret." );
      return;
    }
    
    return context;
  };

  Validate.mastodon = () => {
    const context = Validate.context();
    
    if ( !context.mastodonURL ) {
      Inputs.alert( "mastodonURL", "Please provide a Mastodon server URL." );
      return;
    }

    if ( /\w+\.\w+/.test( context.mastodonURL ) === false ) {
      Inputs.alert( "mastodonURL", "This is an invalid URL." );
      return;
    }

    const url = Validate.url( context.mastodonURL );
    if ( url == null ) {
      Inputs.alert( "mastodonURL", "This is an invalid URL." );
      return;
    }

    context.mastodonURL = url.href;
    context.baseURL = url.origin;
    return context;
  };

  // No fields to validate, so mostly a no-op.
  Validate.reddit = () => {
    const context = Validate.context();
    context.baseURL = "https://www.reddit.com";
    return context;
  };

  // No fields to validate, so mostly a no-op.
  Validate.linkedin = () => {
    const context = Validate.context();
    context.baseURL = "https://www.linkedin.com";
    return context;
  };

  Validate.smalltown = () => {
    const context = Validate.context();
    
    if ( !context.smalltownURL ) {
      Inputs.alert( "smalltownURL", "Please provide a Smalltown server URL." );
      return;
    }

    if ( /\w+\.\w+/.test( context.smalltownURL ) === false ) {
      Inputs.alert( "smalltownURL", "This is an invalid URL." );
      return;
    }

    const url = Validate.url( context.smalltownURL );
    if ( url == null ) {
      Inputs.alert( "smalltownURL", "This is an invalid URL." );
      return;
    }

    context.smalltownURL = url.href;
    context.baseURL = url.origin;
    return context;
  };



  const Submit = {};

  Submit.validate = () => {
    const context = Validate[ platform ]();
    const isValid = form.reportValidity();
    if ( isValid === true ) {
      return context;
    } else {
      return;
    }
  };

  Submit.flow = async () => {
    let context = Submit.validate();
    if ( context == null ) {
      return;
    }

    Onboard.stow( context );
    await Onboard.start( context );
    if ( context.onboard == null ) {
      state = "error";
      return;
    }

    const url = Onboard.makeLoginURL( context );
    window.location = url;
  };


  const Handle = {};

  Handle.select = ( event ) => {
    platform = event.target.value;
  };

  Handle.submit = async ( event ) => {
    event.preventDefault();
    if ( button.loading === true ) {
      return;
    }
    button.loading = true;

    state = "ready";
    await Submit.flow();
    if ( state === "error" ) {
      identityStores.onboardFailure.put({ failure: true });
      replaceState( `/identities/add?failure=true` );
      button.loading = false;
      return;
    }
  };


  Render.reset();
  onMount(() => {
    return () => {
      Render.reset();
    };
  });
</script>


<section class="gobo-form">
  
  <sl-select
    on:sl-change={Handle.select}
    name="platform"
    value="bluesky"
    size="medium"
    label="Select Platform"
    pill>
    <sl-option value="bluesky">Bluesky</sl-option>
    <sl-option value="linkedin">LinkedIn</sl-option>
    <sl-option value="mastodon">Mastodon</sl-option>
    <sl-option value="reddit">Reddit</sl-option>
    <sl-option value="smalltown">Smalltown</sl-option>
  </sl-select>


  {#if platform === "bluesky"}
    <form bind:this={form} on:submit={Handle.submit}>
      <sl-input
        bind:this={inputs.blueskyLogin}
        on:input={Validate.clear}
        name="blueskyLogin"
        label="Bluesky Username"
        help-text="For example, gobo.bsky.social"
        autocomplete="off"
        size="medium"
        class="required">
      </sl-input>

      <sl-input
        bind:this={inputs.blueskySecret}
        on:input={Validate.clear}
        name="blueskySecret"
        label="Bluesky Secret"
        autocomplete="off"
        password
        size="medium"
        class="required">
          <p class="help-text" slot="help-text">
            On Bluesky, go to 
            <a 
              href="https://bsky.app/settings/app-passwords"
              target="_blank" 
              rel="noopener noreferrer nofollow">
            Settings > Privacy and Security > App Passwords
            </a> 
            and click "Add App Password" to get a secret for Gobo.
          </p>
      </sl-input>

      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Identity
        </sl-button>
      </div>
    </form>
  {/if}


  {#if platform === "linkedin"}
    <form bind:this={form} on:submit={Handle.submit}>
      
      <sl-alert open>
        <sl-icon slot="icon" src="/icons/info-circle.svg"></sl-icon>

        Due to LinkedIn's API restrictions, it is write-only on Gobo. 
        You can publish to LinkedIn but you can't view your feed or 
        notifications.
      </sl-alert>
      
      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Identity
        </sl-button>
      </div>
    </form>
  {/if}


  {#if platform === "mastodon"}
    <form bind:this={form} on:submit={Handle.submit}>
      <sl-input
        bind:this={inputs.mastodonURL}
        on:input={Validate.clear}
        name="mastodonURL"
        label="Mastodon Server URL"
        help-text="For example, mastodon.social"
        autocomplete="off"
        size="medium"
        class="required">
      </sl-input>
      
      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Identity
        </sl-button>
      </div>
    </form>
  {/if}


  {#if platform === "reddit"}
    <form bind:this={form} on:submit={Handle.submit}>
      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Identity
        </sl-button>
      </div>
    </form>
  {/if}


  {#if platform === "smalltown"}
    <form bind:this={form} on:submit={Handle.submit}>
      <sl-input
        bind:this={inputs.smalltownURL}
        on:input={Validate.clear}
        name="smalltownURL"
        label="Smalltown Server URL"
        help-text="For example, community.publicinfrastructure.org"
        autocomplete="off"
        size="medium"
        class="required">
      </sl-input>
      
      <div class="buttons">
        <sl-button
          bind:this={button}
          type="submit"
          class="submit"
          size="medium"
          pill>
          Add Identity
        </sl-button>
      </div>
    </form>
  {/if}
</section>


<style>
  sl-alert::part(base) {
    border-top-color: var(--gobo-color-text);
  }

  sl-alert sl-icon {
    color: var(--gobo-color-text);
  }

  .help-text {
    font-size: 14px;
  }
</style>