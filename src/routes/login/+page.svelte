<script>
  import PlainHeader from "$lib/components/headers/PlainHeader.svelte"
  import Center from "$lib/components/layouts/Center.svelte"
</script>

<PlainHeader></PlainHeader>
<Center>
  <div
    id="outseta-login"
    data-o-auth="1"
    data-mode="embed"
    data-widget-mode="login"
    style="--dark-mode-bg-color: #313751 !important;">
  </div>
</Center>

<style>
  #outseta-login {
    width: 100%;
    margin-top: var(--gobo-height-spacer);
  }
</style>
