<script>
  import BackLink from "$lib/components/primitives/BackLink.svelte";
  import VerticalNav from "$lib/components/primitives/VerticalNav.svelte";
  import NavLink from "$lib/components/primitives/NavLink.svelte";
  import { App } from "$lib/engines/app/index.js"; 

  const logout = async function ( event ) {
    event.preventDefault();
    await App.logout();
  };
</script>

<div class="main-child" >
  <BackLink heading="Settings"></BackLink>

  <VerticalNav slot="left">
    <NavLink href="/settings/profile">Profile</NavLink>
    <NavLink href="/settings/appearance">Appearance</NavLink>
    <NavLink href="/settings/identities">Identities</NavLink>
    <NavLink href="/settings/filters">Filters</NavLink>
    <NavLink href="/terms-of-service">Terms of Service</NavLink>
    <NavLink href="/privacy-policy">Privacy Policy</NavLink>
    <NavLink href="#" action={logout}>Logout</NavLink>
  </VerticalNav>
</div>