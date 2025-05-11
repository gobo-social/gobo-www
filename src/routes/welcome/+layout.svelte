<script>
  import MainHeader from "$lib/components/headers/MainHeader.svelte";
  import PlainFooter from "$lib/components/headers/PlainFooter.svelte";
  import GuardFrame from "$lib/components/GuardFrame.svelte";
</script>


<GuardFrame>
  <MainHeader></MainHeader>
  <slot></slot>
  <PlainFooter></PlainFooter>
</GuardFrame>